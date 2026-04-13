import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getMyOrders } from '../api/orders';
import { formatPrice } from '../utils/formatPrice';

const MyOrders = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ['orders', 'my'],
    queryFn: () => getMyOrders().then((r) => r.data),
  });
  const orders = data?.orders || [];

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: 'calc(100vh - 56px)' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 40px 80px' }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', fontWeight: 500, color: '#000', marginBottom: '32px' }}>My Orders</h1>

        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[0,1,2].map(i => (
              <div key={i} className="animate-pulse" style={{ height: '80px', backgroundColor: '#F5F5F5' }} />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#E5E5E5" strokeWidth="1" style={{ margin: '0 auto 16px', display: 'block' }}>
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: 500, color: '#000', marginBottom: '8px' }}>No orders yet</p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#7F7F7F', marginBottom: '24px' }}>Your order history will appear here</p>
            <button onClick={() => navigate('/products')} style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: 600, textTransform: 'uppercase',
              letterSpacing: '0.12em', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '0',
              padding: '13px 28px', cursor: 'pointer',
            }}>START SHOPPING</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {orders.map((order) => (
              <div
                key={order._id}
                onClick={() => navigate(`/orders/${order._id}`)}
                style={{ border: '0.5px solid #E5E5E5', padding: '20px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#7F7F7F', fontVariantNumeric: 'tabular-nums' }}>
                    #SON-{order._id.slice(-6).toUpperCase()}
                  </p>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '18px', fontWeight: 600, color: '#000', marginTop: '4px' }}>
                    {formatPrice(order.total)}
                  </p>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: '#7F7F7F', marginTop: '4px' }}>
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    {' · '}{order.items.length} item{order.items.length > 1 ? 's' : ''}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    fontFamily: "'DM Sans', sans-serif", fontSize: '9px', fontWeight: 600, textTransform: 'uppercase',
                    letterSpacing: '0.08em', border: '0.5px solid #000', color: '#000', padding: '4px 10px',
                  }}>
                    {order.status.replace(/_/g, ' ').toUpperCase()}
                  </span>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: '#7F7F7F', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>VIEW DETAILS →</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
