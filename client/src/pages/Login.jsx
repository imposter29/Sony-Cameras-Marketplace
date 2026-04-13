import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { loginUser } from '../api/auth';
import { useToast } from '../components/ui/Toast';

const Login = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const setAuth = useAuthStore((s) => s.login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields'); return; }
    try {
      setLoading(true);
      setError('');
      const { data } = await loginUser({ email, password });
      setAuth(data.user, data.token);
      addToast('✓ Welcome back');
      navigate(data.user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
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
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', fontWeight: 500, color: '#000', marginBottom: '8px', textAlign: 'center' }}>Login</h1>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#7F7F7F', textAlign: 'center', marginBottom: '32px' }}>Enter your credentials to continue</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={labelStyle}>EMAIL</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} placeholder="you@example.com" required />
          </div>
          <div>
            <label style={labelStyle}>PASSWORD</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} placeholder="••••••••" required />
          </div>

          {error && (
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: '#000', borderLeft: '2px solid #000', paddingLeft: '12px' }}>{error}</p>
          )}

          <button type="submit" disabled={loading} style={{
            width: '100%', fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: 600,
            textTransform: 'uppercase', letterSpacing: '0.12em', backgroundColor: '#000', color: '#fff',
            border: 'none', borderRadius: '0', padding: '14px', cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.5 : 1,
          }}>{loading ? 'LOGGING IN...' : 'LOGIN'}</button>
        </form>

        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#7F7F7F', textAlign: 'center', marginTop: '24px' }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: '#000', textDecoration: 'underline', textUnderlineOffset: '3px' }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
