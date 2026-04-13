import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CreditCard, MapPin, Plus } from 'lucide-react';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import { getAddresses, addAddress } from '../api/users';
import { placeOrder } from '../api/orders';
import { formatPrice } from '../utils/formatPrice';
import { useToast } from '../components/ui/Toast';
import StepIndicator from '../components/checkout/StepIndicator';

const Checkout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const { items, clearCart } = useCartStore();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [step, setStep] = useState(0);
  const [selectedAddressIdx, setSelectedAddressIdx] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [placing, setPlacing] = useState(false);

  // Inline add address
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddr, setNewAddr] = useState({ label: 'Home', line1: '', city: '', state: '', pincode: '', phone: '' });
  const [addrSaving, setAddrSaving] = useState(false);
  const [indiaStates, setIndiaStates] = useState([]);
  const [pincodeError, setPincodeError] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [cardNum, setCardNum] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardExpError, setCardExpError] = useState('');
  const skippingCartRef = useRef(false);

  const handleCardNumChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 16);
    let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setCardNum(formatted);
  };

  const handleCvvChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 3);
    setCardCvv(val);
  };

  const handleExpChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length >= 3) val = val.substring(0, 2) + '/' + val.substring(2, 4);
    else val = val.substring(0, 4);
    setCardExp(val);
    
    if (val.length === 5) {
      const [m, y] = val.split('/');
      const month = parseInt(m, 10);
      const year = parseInt(y, 10) + 2000;
      const now = new Date();
      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();

      if (month < 1 || month > 12) {
        setCardExpError('Invalid month');
      } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
        setCardExpError('Card expired');
      } else {
        setCardExpError('');
      }
    } else {
      setCardExpError('');
    }
  };

  // Redirect if empty cart or not authenticated
  useEffect(() => {
    if (skippingCartRef.current) return;
    if (!isAuthenticated) navigate('/login');
    else if (items.length === 0) navigate('/cart');
  }, [isAuthenticated, items.length, navigate]);

  // Fetch Indian states
  useEffect(() => {
    fetch('https://countriesnow.space/api/v0.1/countries/states', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ country: 'India' })
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setIndiaStates(data.data.states);
      })
      .catch((err) => console.error(err));
  }, []);

  const validatePincode = async (pincode) => {
    if (pincode.length === 6) {
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const data = await res.json();
        if (data && data[0] && data[0].Status === 'Success') {
          const postOffice = data[0].PostOffice[0];
          setNewAddr((prev) => ({ ...prev, city: postOffice.District, state: postOffice.State }));
          setPincodeError(false);
        } else {
          setPincodeError(true);
        }
      } catch (err) {
        console.error(err);
        setPincodeError(true);
      }
    } else {
      setPincodeError(false);
    }
  };

  // Fetch addresses
  const { data: addrData, refetch: refetchAddresses } = useQuery({
    queryKey: ['addresses'],
    queryFn: () => getAddresses().then((r) => r.data),
    enabled: isAuthenticated,
  });
  const addresses = addrData?.addresses || addrData || [];

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!newAddr.line1 || !newAddr.city || !newAddr.state || !newAddr.pincode) return;
    try {
      setAddrSaving(true);
      await addAddress(newAddr);
      await refetchAddresses();
      setShowAddForm(false);
      setNewAddr({ label: 'Home', line1: '', city: '', state: '', pincode: '', phone: '' });
    } catch (err) {
      addToast('✗ Failed to save address');
    } finally {
      setAddrSaving(false);
    }
  };

  const handlePlaceOrder = async () => {
    const address = addresses[selectedAddressIdx];
    if (!address) { addToast('Please select a shipping address'); return; }
    
    const executeBackendOrder = async () => {
      try {
        setPlacing(true);
        await placeOrder({
          shippingAddress: {
            label: address.label,
            line1: address.line1,
            city: address.city,
            state: address.state,
            pincode: address.pincode,
            phone: address.phone,
          },
          paymentMethod,
        });
        queryClient.invalidateQueries({ queryKey: ['orders'] });
        skippingCartRef.current = true;
        clearCart();
        addToast('✓ Order placed successfully');
        navigate('/order-confirmation');
      } catch (err) {
        addToast(err.response?.data?.message || '✗ Failed to place order');
      } finally {
        setPlacing(false);
      }
    };

    if (paymentMethod === 'card') {
      if (cardNum.replace(/\s/g, '').length !== 16) { addToast('Invalid Card Number'); return; }
      if (cardExp.length !== 5 || cardExpError) { addToast('Invalid Expiry Date'); return; }
      if (cardCvv.length !== 3) { addToast('Invalid CVV'); return; }
    }

    if (paymentMethod === 'card' || paymentMethod === 'upi') {
      setProcessingPayment(true);
      setTimeout(() => {
        setProcessingPayment(false);
        executeBackendOrder();
      }, 3000);
    } else {
      executeBackendOrder();
    }
  };

  if (items.length === 0) return null;

  const inputStyle = {
    width: '100%', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#000',
    border: '0.5px solid #E5E5E5', borderRadius: '0', padding: '10px 14px', outline: 'none', backgroundColor: '#fff',
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: 'calc(100vh - 56px)' }}>
      {processingPayment && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(255,255,255,0.95)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid #E5E5E5', borderTopColor: '#000', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', fontWeight: 500, color: '#000', marginTop: '24px' }}>Processing Payment...</h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#7F7F7F', marginTop: '8px' }}>Please do not refresh or close this window.</p>
          <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        </div>
      )}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 40px 80px' }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', fontWeight: 500, color: '#000', marginBottom: '32px' }}>Checkout</h1>
        <StepIndicator currentStep={step} />

        {/* STEP 0 — Address */}
        {step === 0 && (
          <div style={{ marginTop: '40px' }}>
            <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#7F7F7F', marginBottom: '20px' }}>SHIPPING ADDRESS</h2>

            {addresses.length === 0 && !showAddForm && (
              <div style={{ border: '0.5px solid #E5E5E5', padding: '40px', textAlign: 'center' }}>
                <MapPin size={32} style={{ color: '#E5E5E5', margin: '0 auto 12px' }} />
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#7F7F7F', marginBottom: '16px' }}>No addresses saved. Add one to continue.</p>
                <button onClick={() => setShowAddForm(true)} style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: 600, textTransform: 'uppercase',
                  letterSpacing: '0.12em', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '0',
                  padding: '13px 28px', cursor: 'pointer',
                }}>ADD ADDRESS</button>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {addresses.map((addr, idx) => (
                <div
                  key={addr._id}
                  onClick={() => setSelectedAddressIdx(idx)}
                  style={{
                    border: selectedAddressIdx === idx ? '1px solid #000' : '0.5px solid #E5E5E5',
                    padding: '16px 20px', cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{
                      width: '14px', height: '14px', borderRadius: '50%', border: '1px solid #000',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      {selectedAddressIdx === idx && <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#000' }} />}
                    </span>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', backgroundColor: '#404040', color: '#fff', padding: '2px 6px' }}>{addr.label}</span>
                    {addr.isDefault && <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '9px', color: '#7F7F7F' }}>DEFAULT</span>}
                  </div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#000' }}>{addr.line1}</p>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#404040' }}>{addr.city}, {addr.state} — {addr.pincode}</p>
                  {addr.phone && <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: '#7F7F7F', marginTop: '2px' }}>{addr.phone}</p>}
                </div>
              ))}
            </div>

            {!showAddForm && addresses.length > 0 && (
              <button onClick={() => setShowAddForm(true)} style={{
                marginTop: '12px', fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: '#7F7F7F',
                background: 'none', border: 'none', cursor: 'pointer', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px',
              }}><Plus size={12} /> Add new address</button>
            )}

            {/* Inline add form */}
            {showAddForm && (
              <form onSubmit={handleSaveAddress} style={{ border: '0.5px solid #E5E5E5', padding: '20px', marginTop: '12px' }}>
                <h4 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#000', marginBottom: '16px' }}>NEW ADDRESS</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <select value={newAddr.label} onChange={(e) => setNewAddr({ ...newAddr, label: e.target.value })} style={inputStyle}>
                    <option>Home</option><option>Work</option><option>Other</option>
                  </select>
                  <input type="tel" placeholder="Phone" value={newAddr.phone} onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value.replace(/\D/g, '') })} style={inputStyle} />
                  <input placeholder="Address Line 1 *" required value={newAddr.line1} onChange={(e) => setNewAddr({ ...newAddr, line1: e.target.value })} style={{ ...inputStyle, gridColumn: '1 / -1' }} />
                  <input placeholder="City *" required value={newAddr.city} onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })} style={inputStyle} />
                  <select required value={newAddr.state} onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })} style={inputStyle}>
                    <option value="" disabled>Select State *</option>
                    {indiaStates.map((s) => (
                      <option key={s.state_code} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                  <div>
                    <input type="text" maxLength={6} placeholder="Pincode *" required value={newAddr.pincode} onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setNewAddr({ ...newAddr, pincode: val });
                      if (val.length === 6) validatePincode(val);
                      else setPincodeError(false);
                    }} style={{ ...inputStyle, border: pincodeError ? '1px solid red' : '0.5px solid #E5E5E5' }} />
                    {pincodeError && <p style={{ color: 'red', fontSize: '9px', fontFamily: "'DM Sans', sans-serif", marginTop: '4px' }}>Invalid Pincode</p>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                  <button type="submit" disabled={addrSaving} style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: 600, textTransform: 'uppercase',
                    letterSpacing: '0.12em', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '0',
                    padding: '10px 20px', cursor: 'pointer', opacity: addrSaving ? 0.5 : 1,
                  }}>{addrSaving ? 'SAVING...' : 'SAVE'}</button>
                  <button type="button" onClick={() => setShowAddForm(false)} style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: '11px', textTransform: 'uppercase',
                    backgroundColor: 'transparent', color: '#000', border: '0.5px solid #000', borderRadius: '0',
                    padding: '10px 20px', cursor: 'pointer',
                  }}>CANCEL</button>
                </div>
              </form>
            )}

            <button
              onClick={() => { if (addresses.length > 0) setStep(1); else addToast('Please add a shipping address'); }}
              style={{
                marginTop: '32px', fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: 600,
                textTransform: 'uppercase', letterSpacing: '0.12em', backgroundColor: '#000', color: '#fff',
                border: 'none', borderRadius: '0', padding: '13px 28px', cursor: 'pointer',
              }}
            >CONTINUE TO PAYMENT</button>
          </div>
        )}

        {/* STEP 1 — Payment */}
        {step === 1 && (
          <div style={{ marginTop: '40px' }}>
            <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#7F7F7F', marginBottom: '20px' }}>PAYMENT METHOD</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { value: 'card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay' },
                { value: 'upi', label: 'UPI', desc: 'Google Pay, PhonePe, Paytm' },
                { value: 'cod', label: 'Cash on Delivery', desc: 'Pay when your order arrives' },
              ].map((method) => (
                <div key={method.value} style={{ display: 'flex', flexDirection: 'column' }}>
                  <div
                    onClick={() => setPaymentMethod(method.value)}
                    style={{
                      border: paymentMethod === method.value ? '1px solid #000' : '0.5px solid #E5E5E5',
                      padding: '16px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px',
                    }}
                  >
                    <span style={{
                      width: '14px', height: '14px', borderRadius: '50%', border: '1px solid #000',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      {paymentMethod === method.value && <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#000' }} />}
                    </span>
                    <div>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 500, color: '#000' }}>{method.label}</p>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: '#7F7F7F' }}>{method.desc}</p>
                    </div>
                  </div>
                  {/* Expanded Card Details */}
                  {method.value === 'card' && paymentMethod === 'card' && (
                    <div style={{ border: '0.5px solid #E5E5E5', borderTop: 'none', padding: '16px 20px', backgroundColor: '#FAFAFA' }}>
                      <input placeholder="Card Number (16 digits)" value={cardNum} onChange={handleCardNumChange} maxLength={19} type="tel" style={{ ...inputStyle, marginBottom: '8px' }} />
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <div style={{ flex: 1 }}>
                          <input placeholder="MM/YY" value={cardExp} onChange={handleExpChange} maxLength={5} type="tel" style={{ ...inputStyle, border: cardExpError ? '1px solid red' : '0.5px solid #E5E5E5' }} />
                          {cardExpError && <p style={{ color: 'red', fontSize: '9px', fontFamily: "'DM Sans', sans-serif", marginTop: '4px' }}>{cardExpError}</p>}
                        </div>
                        <div style={{ flex: 1 }}>
                          <input placeholder="CVV (3 digits)" value={cardCvv} onChange={handleCvvChange} maxLength={3} type="password" style={inputStyle} />
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Expanded UPI Details */}
                  {method.value === 'upi' && paymentMethod === 'upi' && (
                     <div style={{ border: '0.5px solid #E5E5E5', borderTop: 'none', padding: '16px 20px', backgroundColor: '#FAFAFA' }}>
                        <input placeholder="UPI ID (e.g. name@okhdfc)" type="text" style={inputStyle} />
                     </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '32px' }}>
              <button onClick={() => setStep(0)} style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: '11px', textTransform: 'uppercase',
                backgroundColor: 'transparent', color: '#000', border: '0.5px solid #000', borderRadius: '0',
                padding: '13px 28px', cursor: 'pointer',
              }}>BACK</button>
              <button onClick={() => setStep(2)} style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: 600, textTransform: 'uppercase',
                letterSpacing: '0.12em', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '0',
                padding: '13px 28px', cursor: 'pointer',
              }}>REVIEW ORDER</button>
            </div>
          </div>
        )}

        {/* STEP 2 — Review & Place */}
        {step === 2 && (
          <div style={{ marginTop: '40px' }}>
            <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#7F7F7F', marginBottom: '20px' }}>ORDER REVIEW</h2>

            {/* Items */}
            <div style={{ border: '0.5px solid #E5E5E5', marginBottom: '16px' }}>
              {items.map((item, idx) => (
                <div key={item._id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderBottom: idx < items.length - 1 ? '0.5px solid #E5E5E5' : 'none' }}>
                  <div style={{ width: '60px', height: '48px', backgroundColor: '#FFF', overflow: 'hidden', flexShrink: 0 }}>
                    {item.images?.[0] && <img src={item.images[0]} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '13px', fontWeight: 500, color: '#000' }}>{item.name}</p>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: '#7F7F7F' }}>Qty: {item.quantity}</p>
                  </div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#000' }}>{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            {/* Address summary */}
            {addresses[selectedAddressIdx] && (
              <div style={{ border: '0.5px solid #E5E5E5', padding: '16px', marginBottom: '16px' }}>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', textTransform: 'uppercase', color: '#7F7F7F', marginBottom: '6px' }}>SHIPPING TO</p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#000' }}>{addresses[selectedAddressIdx].line1}</p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#404040' }}>
                  {addresses[selectedAddressIdx].city}, {addresses[selectedAddressIdx].state} — {addresses[selectedAddressIdx].pincode}
                </p>
              </div>
            )}

            {/* Payment summary */}
            <div style={{ border: '0.5px solid #E5E5E5', padding: '16px', marginBottom: '16px' }}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', textTransform: 'uppercase', color: '#7F7F7F', marginBottom: '6px' }}>PAYMENT METHOD</p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#000', textTransform: 'uppercase' }}>{paymentMethod}</p>
            </div>

            {/* Total */}
            <div style={{ borderTop: '1px solid #000', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '32px' }}>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 600, color: '#000' }}>Total</span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '24px', fontWeight: 600, color: '#000' }}>{formatPrice(total)}</span>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setStep(1)} style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: '11px', textTransform: 'uppercase',
                backgroundColor: 'transparent', color: '#000', border: '0.5px solid #000', borderRadius: '0',
                padding: '13px 28px', cursor: 'pointer',
              }}>BACK</button>
              <button onClick={handlePlaceOrder} disabled={placing} style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: 600, textTransform: 'uppercase',
                letterSpacing: '0.12em', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '0',
                padding: '13px 28px', cursor: placing ? 'not-allowed' : 'pointer', opacity: placing ? 0.5 : 1,
              }}>{placing ? 'PLACING ORDER...' : 'PLACE ORDER'}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
