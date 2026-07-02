import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../api/auth';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { setError('Please enter your email'); return; }
    try {
      setLoading(true);
      setError('');
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#000',
    border: '1px solid #000', borderRadius: '0', padding: '12px 16px', outline: 'none', backgroundColor: '#fff',
  };
  const labelStyle = {
    fontFamily: "'DM Sans', sans-serif", fontSize: '10px', fontWeight: 600,
    textTransform: 'uppercase', letterSpacing: '0.12em', color: '#000',
    display: 'block', marginBottom: '8px',
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: 'calc(100vh - 56px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', fontWeight: 500, color: '#000', marginBottom: '8px', textAlign: 'center' }}>Reset Password</h1>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#7F7F7F', textAlign: 'center', marginBottom: '32px' }}>Enter your email and we'll send you a reset link</p>

        {sent ? (
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#000', textAlign: 'center', borderLeft: '2px solid #000', paddingLeft: '12px' }}>
            If an account exists for {email}, a reset link has been sent. Please check your inbox.
          </p>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={labelStyle}>EMAIL</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} placeholder="you@example.com" required />
            </div>
            {error && (
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: '#000', borderLeft: '2px solid #000', paddingLeft: '12px' }}>{error}</p>
            )}
            <button type="submit" disabled={loading} style={{
              width: '100%', fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.12em', backgroundColor: '#000', color: '#fff',
              border: 'none', borderRadius: '0', padding: '14px', cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1,
            }}>{loading ? 'SENDING...' : 'SEND RESET LINK'}</button>
          </form>
        )}

        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#7F7F7F', textAlign: 'center', marginTop: '24px' }}>
          Remembered it?{' '}
          <Link to="/login" style={{ color: '#000', textDecoration: 'underline', textUnderlineOffset: '3px' }}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
