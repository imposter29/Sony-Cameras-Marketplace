import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      backgroundColor: '#FFFFFF', minHeight: 'calc(100vh - 56px)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '40px',
    }}>
      <span style={{
        fontFamily: "'Cormorant Garamond', serif", fontSize: '120px', fontWeight: 300, color: '#E5E5E5',
        lineHeight: 1, letterSpacing: '-0.04em',
      }}>404</span>
      <h1 style={{
        fontFamily: "'Playfair Display', serif", fontSize: '24px', fontWeight: 500, color: '#000',
        marginBottom: '8px', marginTop: '-8px',
      }}>Page Not Found</h1>
      <p style={{
        fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#7F7F7F',
        marginBottom: '32px', maxWidth: '360px', textAlign: 'center',
      }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <button onClick={() => navigate('/')} style={{
        fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: 600, textTransform: 'uppercase',
        letterSpacing: '0.12em', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '0',
        padding: '13px 28px', cursor: 'pointer',
      }}>BACK TO HOME</button>
    </div>
  );
};

export default NotFound;
