import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import { loginUser } from '../api/auth';
import useAuthStore from '../store/authStore';

const Login = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      setError('');
      const { data } = await loginUser(formData);
      login(data.user, data.token);
      localStorage.setItem('token', data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12">
      <div className="w-full max-w-md mx-4">
        {/* SONY heading */}
        <div className="text-center mb-2">
          <img src="/BlackLogo.png" alt="Sony" style={{ height: '40px', width: 'auto', margin: '0 auto' }} />
        </div>

        {/* Subheading */}
        <p
          className="text-center mb-10"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '15px',
            color: '#7F7F7F',
          }}
        >
          Welcome back
        </p>

        {/* Error message */}
        {error && (
          <p
            className="text-center mb-6"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '13px',
              color: '#7F7F7F',
            }}
          >
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div>
            <label
              className="block mb-1.5"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '12px',
                fontWeight: 500,
                color: '#000000',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Email
            </label>
            <input
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Please enter a valid email address',
                },
              })}
              className="w-full px-4 py-3 outline-none"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '14px',
                color: '#000000',
                border: '1px solid #000000',
                borderRadius: '0',
                backgroundColor: '#FFFFFF',
              }}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p
                className="mt-1"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '12px',
                  color: '#7F7F7F',
                }}
              >
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              className="block mb-1.5"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '12px',
                fontWeight: 500,
                color: '#000000',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password', { required: 'Password is required' })}
                className="w-full px-4 py-3 pr-10 outline-none"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '14px',
                  color: '#000000',
                  border: '1px solid #000000',
                  borderRadius: '0',
                  backgroundColor: '#FFFFFF',
                }}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: '#7F7F7F' }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p
                className="mt-1"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '12px',
                  color: '#7F7F7F',
                }}
              >
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Login button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '13px',
              fontWeight: 700,
              color: '#FFFFFF',
              backgroundColor: '#000000',
              border: 'none',
              borderRadius: '0',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Logging in...' : 'LOGIN'}
          </button>
        </form>

        {/* Sign up link */}
        <p
          className="text-center mt-8"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '13px',
            color: '#7F7F7F',
          }}
        >
          Don&apos;t have an account?{' '}
          <Link
            to="/signup"
            style={{
              color: '#000000',
              fontWeight: 500,
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
            }}
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
