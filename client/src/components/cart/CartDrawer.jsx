import { useNavigate } from 'react-router-dom';
import useCartStore from '../../store/cartStore';
import { formatPrice } from '../../utils/formatPrice';

const CartDrawer = () => {
  const navigate = useNavigate();
  const { items, isOpen, toggleDrawer, updateQuantity, removeItem } = useCartStore();
  const cartTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000 }}>
      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)' }} onClick={toggleDrawer} />
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0, width: '100%', maxWidth: '400px',
        backgroundColor: '#FFFFFF', display: 'flex', flexDirection: 'column',
        boxShadow: '-4px 0 24px rgba(0,0,0,0.08)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '0.5px solid #E5E5E5' }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#000' }}>
            CART ({items.length})
          </span>
          <button onClick={toggleDrawer} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: '18px', color: '#000', lineHeight: 1 }}>
            ×
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#E5E5E5" strokeWidth="1" style={{ margin: '0 auto 12px', display: 'block' }}>
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#7F7F7F' }}>Your cart is empty</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item._id} style={{ display: 'flex', gap: '12px', paddingBottom: '16px', marginBottom: '16px', borderBottom: '0.5px solid #E5E5E5' }}>
                <div style={{ width: '56px', height: '56px', backgroundColor: '#FFF', overflow: 'hidden', flexShrink: 0 }}>
                  {item.images?.[0] && <img src={item.images[0]} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 500, color: '#000', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</p>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 600, color: '#000', marginTop: '2px' }}>{formatPrice(item.price)}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                    <button onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))} style={{
                      width: '22px', height: '22px', border: '0.5px solid #E5E5E5', backgroundColor: '#fff',
                      cursor: 'pointer', fontSize: '12px', fontFamily: "'DM Sans', sans-serif", borderRadius: '0',
                    }}>−</button>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)} style={{
                      width: '22px', height: '22px', border: '0.5px solid #E5E5E5', backgroundColor: '#fff',
                      cursor: 'pointer', fontSize: '12px', fontFamily: "'DM Sans', sans-serif", borderRadius: '0',
                    }}>+</button>
                    <button onClick={() => removeItem(item._id)} style={{
                      fontFamily: "'DM Sans', sans-serif", fontSize: '9px', color: '#7F7F7F', background: 'none',
                      border: 'none', cursor: 'pointer', textTransform: 'uppercase', marginLeft: '8px',
                    }}>REMOVE</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ padding: '20px 24px', borderTop: '1px solid #000' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 600, color: '#000' }}>Total</span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 600, color: '#000' }}>{formatPrice(cartTotal)}</span>
            </div>
            <button onClick={() => { toggleDrawer(); navigate('/checkout'); }} style={{
              width: '100%', fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.12em', backgroundColor: '#000', color: '#fff',
              border: 'none', borderRadius: '0', padding: '14px', cursor: 'pointer',
            }}>CHECKOUT</button>
            <button onClick={() => { toggleDrawer(); navigate('/cart'); }} style={{
              width: '100%', marginTop: '6px', fontFamily: "'DM Sans', sans-serif", fontSize: '10px',
              textTransform: 'uppercase', letterSpacing: '0.1em', backgroundColor: 'transparent', color: '#7F7F7F',
              border: 'none', borderRadius: '0', padding: '8px', cursor: 'pointer',
            }}>VIEW FULL CART</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
