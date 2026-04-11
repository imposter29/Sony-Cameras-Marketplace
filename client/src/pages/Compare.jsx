import { useNavigate } from 'react-router-dom';
import useCompareStore from '../store/compareStore';
import { formatPrice } from '../utils/formatPrice';

const Compare = () => {
  const navigate = useNavigate();
  const { items, removeFromCompare, clearCompare } = useCompareStore();

  const allSpecs = items.length > 0
    ? [...new Set(items.flatMap((p) => Object.keys(p.specs || {})))]
    : [];

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: 'calc(100vh - 56px)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 40px 80px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', fontWeight: 500, color: '#000' }}>Compare Cameras</h1>
          {items.length > 0 && (
            <button onClick={clearCompare} style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: '10px', color: '#7F7F7F', background: 'none',
              border: 'none', cursor: 'pointer', textTransform: 'uppercase', textDecoration: 'underline',
              textUnderlineOffset: '2px',
            }}>CLEAR ALL</button>
          )}
        </div>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#E5E5E5" strokeWidth="1" style={{ margin: '0 auto 16px', display: 'block' }}>
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="12" y1="3" x2="12" y2="21" />
            </svg>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: 500, color: '#000', marginBottom: '8px' }}>Nothing to compare</p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#7F7F7F', marginBottom: '24px' }}>Add up to 3 cameras to compare their specs side by side</p>
            <button onClick={() => navigate('/products')} style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: 600, textTransform: 'uppercase',
              letterSpacing: '0.12em', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '0',
              padding: '13px 28px', cursor: 'pointer',
            }}>BROWSE CAMERAS</button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ padding: '16px', textAlign: 'left', fontFamily: "'DM Sans', sans-serif", fontSize: '9px', color: '#7F7F7F', textTransform: 'uppercase', letterSpacing: '0.15em', borderBottom: '1px solid #000', width: '25%' }}>
                    FEATURE
                  </th>
                  {items.map((product) => (
                    <th key={product._id} style={{ padding: '16px', borderBottom: '1px solid #000', textAlign: 'center', verticalAlign: 'top', position: 'relative' }}>
                      <button onClick={() => removeFromCompare(product._id)} style={{
                        position: 'absolute', top: '8px', right: '8px', background: 'none', border: 'none',
                        cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: '16px', color: '#7F7F7F', lineHeight: 1,
                      }}>×</button>
                      <div style={{ width: '80px', height: '80px', margin: '0 auto 8px', backgroundColor: '#F5F5F5', overflow: 'hidden' }}>
                        {product.images?.[0] && <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                      </div>
                      <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '13px', fontWeight: 500, color: '#000' }}>{product.name}</p>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', fontWeight: 600, marginTop: '4px', color: '#000' }}>{formatPrice(product.price)}</p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allSpecs.map((spec, idx) => (
                  <tr key={spec} style={{ borderBottom: '0.5px solid #E5E5E5', backgroundColor: idx % 2 === 1 ? '#FAFAFA' : '#fff' }}>
                    <td style={{ padding: '10px 16px', fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: '#7F7F7F', textTransform: 'capitalize' }}>{spec}</td>
                    {items.map((product) => (
                      <td key={product._id} style={{ padding: '10px 16px', fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#000', textAlign: 'center' }}>
                        {product.specs?.[spec] || '—'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Compare;
