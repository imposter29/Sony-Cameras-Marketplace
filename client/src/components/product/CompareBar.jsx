import { useNavigate } from 'react-router-dom';
import useCompareStore from '../../store/compareStore';

const CompareBar = () => {
  const navigate = useNavigate();
  const items = useCompareStore((s) => s.items);
  const removeFromCompare = useCompareStore((s) => s.removeFromCompare);
  const clearCompare = useCompareStore((s) => s.clearCompare);

  if (items.length === 0) return null;

  return (
    <div style={{
      backgroundColor: '#FFFFFF', borderTop: '1px solid #000000', padding: '12px 32px',
      display: 'flex', alignItems: 'center', gap: '16px',
    }}>
      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#000', whiteSpace: 'nowrap' }}>
        COMPARE ({items.length})
      </span>
      <div style={{ display: 'flex', gap: '8px', flex: 1, overflow: 'hidden' }}>
        {items.map((item) => (
          <span key={item._id} style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: '10px', color: '#000',
            border: '0.5px solid #E5E5E5', padding: '4px 10px',
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {item.name}
            <button onClick={() => removeFromCompare(item._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#7F7F7F', lineHeight: 1, flexShrink: 0 }}>×</button>
          </span>
        ))}
      </div>
      <button onClick={() => navigate('/compare')} style={{
        fontFamily: "'DM Sans', sans-serif", fontSize: '10px', fontWeight: 600, textTransform: 'uppercase',
        letterSpacing: '0.08em', backgroundColor: '#000', color: '#FFF', border: 'none', borderRadius: '0',
        padding: '10px 24px', cursor: 'pointer', whiteSpace: 'nowrap',
      }}>COMPARE NOW</button>
      <button onClick={clearCompare} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', color: '#7F7F7F', background: 'none', border: 'none', cursor: 'pointer', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>CLEAR</button>
    </div>
  );
};

export default CompareBar;
