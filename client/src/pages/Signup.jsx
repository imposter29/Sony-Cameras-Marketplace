import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { registerUser } from '../api/auth';
import { useToast } from '../components/ui/Toast';

const Signup = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const setAuth = useAuthStore((s) => s.login);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) { setError('Please fill in all fields'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    try {
      setLoading(true);
      setError('');
      const { data } = await registerUser({ name, email, password });
      setAuth(data.user, data.token);
      addToast('✓ Account created');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
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
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', fontWeight: 500, color: '#000', marginBottom: '8px', textAlign: 'center' }}>Create Account</h1>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#7F7F7F', textAlign: 'center', marginBottom: '32px' }}>Join the Sony camera community</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={labelStyle}>FULL NAME</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} placeholder="John Doe" required />
          </div>
          <div>
            <label style={labelStyle}>EMAIL</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} placeholder="you@example.com" required />
          </div>
          <div>
            <label style={labelStyle}>PASSWORD</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} placeholder="••••••••" required />
          </div>
          <div>
            <label style={labelStyle}>CONFIRM PASSWORD</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={inputStyle} placeholder="••••••••" required />
          </div>

          {error && (
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: '#000', borderLeft: '2px solid #000', paddingLeft: '12px' }}>{error}</p>
          )}

          <button type="submit" disabled={loading} style={{
            width: '100%', fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: 600,
            textTransform: 'uppercase', letterSpacing: '0.12em', backgroundColor: '#000', color: '#fff',
            border: 'none', borderRadius: '0', padding: '14px', cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.5 : 1,
          }}>{loading ? 'CREATING...' : 'CREATE ACCOUNT'}</button>
        </form>

        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#7F7F7F', textAlign: 'center', marginTop: '24px' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#000', textDecoration: 'underline', textUnderlineOffset: '3px' }}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
