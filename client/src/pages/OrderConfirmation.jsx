import { useNavigate } from 'react-router-dom';

const OrderConfirmation = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      backgroundColor: '#FFFFFF', minHeight: 'calc(100vh - 56px)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '40px',
    }}>
      <div style={{
        width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#000',
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px',
      }}>
        <span style={{ color: '#fff', fontSize: '24px' }}>✓</span>
      </div>
      <h1 style={{
        fontFamily: "'Playfair Display', serif", fontSize: '32px', fontWeight: 500, color: '#000', marginBottom: '12px',
      }}>Order Placed!</h1>
      <p style={{
        fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#7F7F7F',
        maxWidth: '400px', textAlign: 'center', lineHeight: 1.7, marginBottom: '32px',
      }}>
        Thank you for your purchase. Your order has been confirmed and will be shipped shortly. You'll receive a confirmation email.
      </p>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={() => navigate('/orders')} style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: 600, textTransform: 'uppercase',
          letterSpacing: '0.12em', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '0',
          padding: '13px 28px', cursor: 'pointer',
        }}>VIEW MY ORDERS</button>
        <button onClick={() => navigate('/products')} style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: 600, textTransform: 'uppercase',
          letterSpacing: '0.12em', backgroundColor: 'transparent', color: '#000',
          border: '0.5px solid #000', borderRadius: '0', padding: '13px 28px', cursor: 'pointer',
        }}>CONTINUE SHOPPING</button>
      </div>
    </div>
  );
};

export default OrderConfirmation;
