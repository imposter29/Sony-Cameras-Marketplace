import { useNavigate } from 'react-router-dom';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import { formatPrice } from '../utils/formatPrice';

const Cart = () => {
  const navigate = useNavigate();
  const { items, clearCart, updateQuantity, removeItem } = useCartStore();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: 'calc(100vh - 56px)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 40px 80px' }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', fontWeight: 500, color: '#000', marginBottom: '32px' }}>Shopping Cart</h1>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#E5E5E5" strokeWidth="1" style={{ margin: '0 auto 16px', display: 'block' }}>
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: 500, color: '#000', marginBottom: '8px' }}>Your cart is empty</p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#7F7F7F', marginBottom: '24px' }}>Discover our cameras</p>
            <button onClick={() => navigate('/products')} style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: 600, textTransform: 'uppercase',
              letterSpacing: '0.12em', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '0',
              padding: '13px 28px', cursor: 'pointer',
            }}>EXPLORE CAMERAS</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '40px' }}>
            {/* Items */}
            <div>
              {items.map((item) => (
                <div key={item._id} style={{ display: 'flex', gap: '16px', padding: '20px 0', borderBottom: '0.5px solid #E5E5E5' }}>
                  <div style={{ width: '80px', height: '64px', backgroundColor: '#FFF', overflow: 'hidden', flexShrink: 0 }}>
                    {item.images?.[0] && <img src={item.images[0]} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '14px', fontWeight: 500, color: '#000' }}>{item.name}</p>
                    <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#000', marginTop: '4px' }}>{formatPrice(item.price)}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                      <button onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))} style={{
                        width: '28px', height: '28px', border: '0.5px solid #E5E5E5', borderRadius: '0',
                        backgroundColor: '#fff', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: '14px',
                      }}>−</button>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', width: '24px', textAlign: 'center' }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, item.quantity + 1)} style={{
                        width: '28px', height: '28px', border: '0.5px solid #E5E5E5', borderRadius: '0',
                        backgroundColor: '#fff', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: '14px',
                      }}>+</button>
                      <button onClick={() => removeItem(item._id)} style={{
                        fontFamily: "'DM Sans', sans-serif", fontSize: '10px', color: '#7F7F7F', background: 'none',
                        border: 'none', cursor: 'pointer', textTransform: 'uppercase', marginLeft: '12px',
                      }}>REMOVE</button>
                    </div>
                  </div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#000' }}>{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
              <button onClick={clearCart} style={{
                marginTop: '16px', fontFamily: "'DM Sans', sans-serif", fontSize: '10px', color: '#7F7F7F',
                background: 'none', border: 'none', cursor: 'pointer', textTransform: 'uppercase', textDecoration: 'underline',
                textUnderlineOffset: '2px',
              }}>Clear Cart</button>
            </div>

            {/* Summary */}
            <div style={{ border: '0.5px solid #E5E5E5', padding: '24px', height: 'fit-content', position: 'sticky', top: '72px' }}>
              <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#000', marginBottom: '20px' }}>ORDER SUMMARY</h2>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#7F7F7F' }}>Subtotal ({items.length} items)</span>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#000' }}>{formatPrice(total)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#7F7F7F' }}>Shipping</span>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#000' }}>Free</span>
              </div>
              <div style={{ borderTop: '1px solid #000', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 600, color: '#000' }}>Total</span>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 600, color: '#000' }}>{formatPrice(total)}</span>
              </div>
              <button onClick={handleCheckout} style={{
                width: '100%', fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: 600, textTransform: 'uppercase',
                letterSpacing: '0.12em', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '0',
                padding: '14px', cursor: 'pointer',
              }}>PROCEED TO CHECKOUT</button>
              <button onClick={() => navigate('/products')} style={{
                width: '100%', marginTop: '8px', fontFamily: "'DM Sans', sans-serif", fontSize: '11px',
                textTransform: 'uppercase', letterSpacing: '0.1em', backgroundColor: 'transparent', color: '#7F7F7F',
                border: 'none', borderRadius: '0', padding: '10px', cursor: 'pointer',
              }}>CONTINUE SHOPPING</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
