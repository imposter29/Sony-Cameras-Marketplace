import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getOrderById, cancelOrder } from '../api/orders';
import { formatPrice } from '../utils/formatPrice';
import { useToast } from '../components/ui/Toast';

const ORDER_STEPS = ['placed', 'confirmed', 'shipped', 'out_for_delivery', 'delivered'];
const STEP_LABELS = ['Order Placed', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'];

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const [cancelling, setCancelling] = useState(false);
  // Controls animation — we start bars at 0 and animate to actual progress
  const [animated, setAnimated] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => getOrderById(id).then((r) => r.data),
    enabled: !!id,
    // Poll every 15 seconds so status updates from admin are reflected automatically
    refetchInterval: 15000,
    refetchOnWindowFocus: true,
  });

  // Trigger animation after component mounts (small delay so CSS transition fires)
  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 120);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px' }}>
        {[0, 1, 2].map(i => (
          <div key={i} className="animate-pulse" style={{ height: '60px', backgroundColor: '#F5F5F5', marginBottom: '8px' }} />
        ))}
      </div>
    );
  }

  const order = data?.order;
  if (!order) return (
    <div style={{ padding: '80px 40px', textAlign: 'center' }}>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#7F7F7F' }}>Order not found</p>
    </div>
  );

  const isCancelled = order.status === 'cancelled';
  const currentStepIdx = isCancelled ? -1 : ORDER_STEPS.indexOf(order.status);
  // Progress fraction: 0 steps done → 0%, all done → 100%
  // For N steps, the bar spans (N-1) gaps; progress = currentStepIdx / (N-1)
  const progressPercent = currentStepIdx <= 0 ? 0 : (currentStepIdx / (ORDER_STEPS.length - 1)) * 100;
  const canCancel = ['placed', 'confirmed'].includes(order.status);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      setCancelling(true);
      await cancelOrder(order._id);
      queryClient.invalidateQueries({ queryKey: ['order', id] });
      queryClient.invalidateQueries({ queryKey: ['orders', 'my'] });
      addToast('✓ Order cancelled');
    } catch (err) {
      addToast(err.response?.data?.message || '✗ Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  const statusColor = {
    placed: '#F59E0B',
    confirmed: '#3B82F6',
    shipped: '#8B5CF6',
    out_for_delivery: '#06B6D4',
    delivered: '#10B981',
    cancelled: '#EF4444',
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: 'calc(100vh - 56px)' }}>
      {/* Inject keyframe animation */}
      <style>{`
        @keyframes fillBar {
          from { width: 0% }
          to   { width: var(--target-width) }
        }
        .order-progress-fill {
          animation: fillBar 1.1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        @keyframes popIn {
          0%   { transform: scale(0.4); opacity: 0; }
          70%  { transform: scale(1.15); }
          100% { transform: scale(1); opacity: 1; }
        }
        .step-dot-active {
          animation: popIn 0.5s ease forwards;
        }
      `}</style>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 40px 80px' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', fontWeight: 500, color: '#000', marginBottom: '8px' }}>Order Detail</h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#7F7F7F' }}>
            Order #SON-{order._id.slice(-6).toUpperCase()} · Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* ===== Status Timeline ===== */}
        <div style={{ border: '0.5px solid #E5E5E5', padding: '28px 32px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#7F7F7F' }}>
              ORDER TRACKING
            </p>
            <span style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: '9px', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.1em',
              border: `0.5px solid ${statusColor[order.status] || '#000'}`,
              color: statusColor[order.status] || '#000',
              padding: '4px 12px',
            }}>
              {order.status.replace(/_/g, ' ').toUpperCase()}
            </span>
          </div>

          {isCancelled ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', backgroundColor: '#FEF2F2', border: '0.5px solid #EF4444' }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>✕</span>
              </div>
              <div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 600, color: '#DC2626' }}>Order Cancelled</p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: '#7F7F7F', marginTop: '2px' }}>This order has been cancelled and stock has been restored.</p>
              </div>
            </div>
          ) : (
            <>
              {/* Step dots row */}
              <div style={{ position: 'relative' }}>
                {/* Track + fill wrapper — constrained between first and last dot centers */}
                <div style={{ position: 'absolute', top: '18px', left: '21px', right: '18px', height: '3px', zIndex: 0 }}>
                  {/* Background track */}
                  <div style={{ position: 'absolute', inset: 0, backgroundColor: '#E5E5E5' }} />
                  {/* Animated fill — percentage is now relative to track width, not container */}
                  <div
                    style={{
                      position: 'absolute', top: 0, left: 0, height: '100%',
                      backgroundColor: '#000',
                      width: animated ? `${progressPercent}%` : '0%',
                      transition: 'width 1.1s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  />
                </div>

                {/* Step dots */}
                <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
                  {ORDER_STEPS.map((step, idx) => {
                    const done = idx < currentStepIdx;
                    const active = idx === currentStepIdx;
                    const pending = idx > currentStepIdx;
                    return (
                      <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                        {/* Dot */}
                        <div
                          className={active ? 'step-dot-active' : ''}
                          style={{
                            width: active ? '36px' : '32px',
                            height: active ? '36px' : '32px',
                            borderRadius: '50%',
                            backgroundColor: done ? '#000' : active ? '#000' : '#fff',
                            border: pending ? '2px solid #E5E5E5' : '2px solid #000',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: active ? '16px' : '13px',
                            transition: 'all 0.3s ease',
                            boxShadow: active ? '0 0 0 4px rgba(0,0,0,0.08)' : 'none',
                          }}
                        >
                          {done ? (
                            <span style={{ color: '#fff', fontSize: '12px', fontWeight: 700 }}>✓</span>
                          ) : (
                            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: 700, color: active ? '#fff' : '#BDBDBD' }}>
                              {idx + 1}
                            </span>
                          )}
                        </div>

                        {/* Label */}
                        <span style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: '9px',
                          color: pending ? '#BDBDBD' : '#000',
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                          fontWeight: active ? 700 : done ? 500 : 400,
                          textAlign: 'center',
                          maxWidth: '72px',
                          lineHeight: 1.3,
                        }}>
                          {STEP_LABELS[idx]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Current step description */}
              {currentStepIdx >= 0 && (
                <div style={{ marginTop: '24px', padding: '12px 16px', backgroundColor: '#F9F9F9', border: '0.5px solid #EBEBEB' }}>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: '#7F7F7F' }}>
                    {currentStepIdx === 0 && "We've received your order and are preparing it for processing."}
                    {currentStepIdx === 1 && 'Your order has been confirmed and will be dispatched soon.'}
                    {currentStepIdx === 2 && 'Your order is on its way. It has been handed over to the courier.'}
                    {currentStepIdx === 3 && 'Your order is out for delivery. Expect it today.'}
                    {currentStepIdx === 4 && 'Your order has been delivered. Thank you for shopping with us.'}
                  </p>
                </div>
              )}

              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', color: '#BDBDBD', marginTop: '16px', textAlign: 'right' }}>
                Auto-updates every 15 seconds
              </p>
            </>
          )}
        </div>

        {/* Items */}
        <div style={{ border: '0.5px solid #E5E5E5', marginBottom: '24px' }}>
          <div style={{ padding: '12px 16px', borderBottom: '0.5px solid #E5E5E5' }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#7F7F7F' }}>ITEMS ({order.items.length})</span>
          </div>
          {order.items.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', borderBottom: i < order.items.length - 1 ? '0.5px solid #E5E5E5' : 'none' }}>
              <div style={{ width: '64px', height: '52px', backgroundColor: '#fff', border: '0.5px solid #F0F0F0', overflow: 'hidden', flexShrink: 0 }}>
                {item.image && <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} />}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '14px', fontWeight: 500, color: '#000' }}>{item.name}</p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: '#7F7F7F', marginTop: '3px' }}>Qty: {item.quantity} · {formatPrice(item.price)} each</p>
              </div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, color: '#000' }}>{formatPrice(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          {/* Shipping */}
          <div style={{ border: '0.5px solid #E5E5E5', padding: '20px' }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#7F7F7F', marginBottom: '12px' }}>SHIPPING ADDRESS</p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#000', lineHeight: 1.7 }}>
              {order.shippingAddress?.line1}<br />
              {order.shippingAddress?.city}, {order.shippingAddress?.state}<br />
              PIN: {order.shippingAddress?.pincode}
            </p>
            {order.shippingAddress?.phone && (
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#7F7F7F', marginTop: '8px' }}>📞 {order.shippingAddress.phone}</p>
            )}
          </div>

          {/* Summary */}
          <div style={{ border: '0.5px solid #E5E5E5', padding: '20px' }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#7F7F7F', marginBottom: '12px' }}>PAYMENT SUMMARY</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#7F7F7F' }}>Method</span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#000', textTransform: 'uppercase' }}>{order.paymentMethod}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#7F7F7F' }}>Payment Status</span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: order.paymentStatus === 'paid' ? '#10B981' : '#F59E0B', fontWeight: 600, textTransform: 'uppercase' }}>{order.paymentStatus}</span>
            </div>
            <div style={{ borderTop: '0.5px solid #E5E5E5', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 600, color: '#000' }}>Total</span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '20px', fontWeight: 600, color: '#000' }}>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button onClick={() => navigate('/orders')} style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: '11px', textTransform: 'uppercase',
            letterSpacing: '0.1em', backgroundColor: 'transparent', color: '#7F7F7F',
            border: 'none', borderRadius: '0', padding: '13px 0', cursor: 'pointer',
          }}>← BACK TO ORDERS</button>

          {canCancel && (
            <button onClick={handleCancel} disabled={cancelling} style={{
              marginLeft: 'auto',
              fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: 600, textTransform: 'uppercase',
              letterSpacing: '0.12em', backgroundColor: 'transparent', color: '#000',
              border: '0.5px solid #000', borderRadius: '0', padding: '13px 28px',
              cursor: cancelling ? 'not-allowed' : 'pointer', opacity: cancelling ? 0.5 : 1,
            }}>{cancelling ? 'CANCELLING...' : 'CANCEL ORDER'}</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
