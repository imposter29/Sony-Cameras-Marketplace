import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import { registerUser } from '../api/auth';
import useAuthStore from '../store/authStore';

const Signup = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register: reg,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const passwordValue = watch('password');

  const onSubmit = async (formData) => {
    try {
      setLoading(true);
      setError('');
      const { data } = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      login(data.user, data.token);
      localStorage.setItem('token', data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '14px',
    color: '#000000',
    border: '1px solid #000000',
    borderRadius: '0',
    backgroundColor: '#FFFFFF',
  };

  const labelStyle = {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '12px',
    fontWeight: 500,
    color: '#000000',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  const errorStyle = {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '12px',
    color: '#7F7F7F',
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
          Create your account
        </p>

        {/* Error message */}
        {error && (
          <p className="text-center mb-6" style={errorStyle}>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block mb-1.5" style={labelStyle}>
              Full Name
            </label>
            <input
              type="text"
              {...reg('name', { required: 'Full name is required' })}
              className="w-full px-4 py-3 outline-none"
              style={inputStyle}
              placeholder="John Doe"
            />
            {errors.name && (
              <p className="mt-1" style={errorStyle}>
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1.5" style={labelStyle}>
              Email
            </label>
            <input
              type="email"
              {...reg('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Please enter a valid email address',
                },
              })}
              className="w-full px-4 py-3 outline-none"
              style={inputStyle}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="mt-1" style={errorStyle}>
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1.5" style={labelStyle}>
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                {...reg('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Minimum 6 characters' },
                })}
                className="w-full px-4 py-3 pr-10 outline-none"
                style={inputStyle}
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
              <p className="mt-1" style={errorStyle}>
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block mb-1.5" style={labelStyle}>
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                {...reg('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) =>
                    value === passwordValue || 'Passwords do not match',
                })}
                className="w-full px-4 py-3 pr-10 outline-none"
                style={inputStyle}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: '#7F7F7F' }}
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1" style={errorStyle}>
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Create Account button */}
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
            {loading ? 'Creating account...' : 'CREATE ACCOUNT'}
          </button>
        </form>

        {/* Login link */}
        <p
          className="text-center mt-8"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '13px',
            color: '#7F7F7F',
          }}
        >
          Already have an account?{' '}
          <Link
            to="/login"
            style={{
              color: '#000000',
              fontWeight: 500,
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
            }}
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
