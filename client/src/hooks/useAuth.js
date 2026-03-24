import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { getMe } from '../api/auth';

export const useAuth = () => {
  const { user, token, login, logout, setUser } = useAuthStore();
  const navigate = useNavigate();

  const isAuthenticated = !!token;
  const isAdmin = user?.role === 'admin';

  const fetchUser = async () => {
    try {
      const { data } = await getMe();
      setUser(data.user);
    } catch (error) {
      logout();
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    login,
    logout: handleLogout,
    fetchUser,
    setUser,
  };
};

export default useAuth;
