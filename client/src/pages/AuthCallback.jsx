import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import api from '../api/axios';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuthStore();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      navigate('/login?error=' + error);
      return;
    }

    if (!token) {
      navigate('/login');
      return;
    }

    // Store token first so the axios interceptor picks it up
    localStorage.setItem('token', token);

    api.get('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        const user = res.data.user || res.data.data || res.data;
        login(user, token);
        navigate('/');
      })
      .catch(() => {
        localStorage.removeItem('token');
        navigate('/login?error=auth_failed');
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#FFFFFF',
      flexDirection: 'column',
      gap: '16px',
    }}>
      {/* Minimal animated dot loader matching the monochrome design system */}
      <div style={{ display: 'flex', gap: '6px' }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: '#000',
            animation: 'dotPulse 1.2s ease-in-out infinite',
            animationDelay: `${i * 0.2}s`,
          }} />
        ))}
      </div>
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '11px',
        color: '#7F7F7F',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
      }}>
        Signing you in...
      </p>
      <style>{`
        @keyframes dotPulse {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
