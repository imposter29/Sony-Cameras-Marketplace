import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, Heart, ShoppingBag, ChevronDown, GitCompare } from 'lucide-react';
import api from '../../api/axios';
import useAuthStore from '../../store/authStore';
import useCartStore from '../../store/cartStore';
import useWishlistStore from '../../store/wishlistStore';
import useCompareStore from '../../store/compareStore';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // State
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [hoveredCatIdx, setHoveredCatIdx] = useState(-1);
  const [hoveredProfileIdx, setHoveredProfileIdx] = useState(-1);

  // Refs
  const catBtnRef = useRef(null);
  const catDropdownRef = useRef(null);
  const profileBtnRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const debounceRef = useRef(null);

  // Stores
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const cartItems = useCartStore((s) => s.items);
  const toggleDrawer = useCartStore((s) => s.toggleDrawer);
  const wishlistItems = useWishlistStore((s) => s.items);
  const compareItems = useCompareStore((s) => s.items);

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then((r) => r.data.data),
    staleTime: 5 * 60 * 1000,
  });

  // Close categories on outside click
  useEffect(() => {
    const handler = (e) => {
      if (
        catDropdownRef.current &&
        !catDropdownRef.current.contains(e.target) &&
        catBtnRef.current &&
        !catBtnRef.current.contains(e.target)
      ) {
        setIsCatOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close profile on outside click
  useEffect(() => {
    const handler = (e) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(e.target) &&
        profileBtnRef.current &&
        !profileBtnRef.current.contains(e.target)
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Debounced search — only update params on /products page
  const handleSearchChange = useCallback(
    (e) => {
      const val = e.target.value;
      setSearchValue(val);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        if (location.pathname === '/products') {
          setSearchParams({ search: val });
        }
      }, 400);
    },
    [location.pathname, setSearchParams]
  );

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      navigate('/products?search=' + encodeURIComponent(searchValue));
    }
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    setIsProfileOpen(false);
    navigate('/');
  };

  const profileLinks = [
    { label: 'My Profile', path: '/profile' },
    { label: 'My Orders', path: '/orders/my' },
    { label: 'Addresses', path: '/addresses' },
  ];

  const userInitial = user?.name?.charAt(0).toUpperCase() || '?';

  // Badge component
  const Badge = ({ count }) => (
    <span
      style={{
        position: 'absolute',
        top: '-6px',
        right: '-6px',
        width: '14px',
        height: '14px',
        borderRadius: '50%',
        background: '#fff',
        color: '#000',
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '8px',
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {count}
    </span>
  );

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: '#000',
        height: '56px',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        padding: '0 28px',
        borderBottom: '0.5px solid #1a1a1a',
      }}
    >
      {/* ========== LEFT ZONE ========== */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flex: 1 }}>
        {/* Categories button */}
        <div style={{ position: 'relative' }}>
          <button
            ref={catBtnRef}
            onClick={() => setIsCatOpen((v) => !v)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: '#fff',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Products
            <ChevronDown size={11} />
          </button>

          {/* Categories dropdown */}
          {isCatOpen && (
            <div
              ref={catDropdownRef}
              style={{
                position: 'absolute',
                top: '56px',
                left: 0,
                background: '#000',
                border: '0.5px solid #222',
                minWidth: '200px',
                zIndex: 100,
              }}
            >
              {categories?.map((cat, i) => (
                <div
                  key={cat._id || cat.slug}
                  onClick={() => {
                    navigate('/category/' + cat.slug);
                    setIsCatOpen(false);
                  }}
                  onMouseEnter={() => setHoveredCatIdx(i)}
                  onMouseLeave={() => setHoveredCatIdx(-1)}
                  style={{
                    padding: '12px 20px',
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '11px',
                    color: '#fff',
                    display: 'block',
                    cursor: 'pointer',
                    background: hoveredCatIdx === i ? '#111' : 'transparent',
                  }}
                >
                  {cat.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Search icon */}
        <div
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => navigate('/products')}
        >
          <Search size={16} stroke="#fff" />
        </div>
      </div>

      {/* ========== CENTER ZONE ========== */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          cursor: 'pointer',
        }}
        onClick={() => navigate('/')}
      >
        <img
          src="/BlackLogo.png"
          alt="Sony"
          style={{ height: '18px', width: 'auto', display: 'block', filter: 'brightness(0) invert(1)' }}
        />
      </div>

      {/* ========== RIGHT ZONE ========== */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginLeft: 'auto' }}>
        {/* Compare */}
        <div
          style={{ position: 'relative', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => navigate('/compare')}
        >
          <GitCompare size={16} stroke="#fff" fill="none" />
          {compareItems.length > 0 && <Badge count={compareItems.length} />}
        </div>

        {/* Wishlist */}
        <div
          style={{ position: 'relative', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => navigate('/wishlist')}
        >
          <Heart
            size={16}
            stroke="#fff"
            fill={wishlistItems.length > 0 ? '#fff' : 'none'}
          />
          {wishlistItems.length > 0 && <Badge count={wishlistItems.length} />}
        </div>

        {/* Cart */}
        <div
          style={{ position: 'relative', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={toggleDrawer}
        >
          <ShoppingBag size={16} stroke="#fff" fill="none" />
          {cartItems.length > 0 && <Badge count={cartItems.length} />}
        </div>

        {/* Profile / Login */}
        {!isAuthenticated ? (
          <span
            onClick={() => navigate('/login')}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            LOGIN
          </span>
        ) : (
          <div style={{ position: 'relative' }}>
            <div
              ref={profileBtnRef}
              onClick={() => setIsProfileOpen((v) => !v)}
              style={{
                width: '28px',
                height: '28px',
                background: '#fff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#000',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {userInitial}
            </div>

            {/* Profile dropdown */}
            {isProfileOpen && (
              <div
                ref={profileDropdownRef}
                style={{
                  position: 'absolute',
                  top: '56px',
                  right: 0,
                  background: '#000',
                  border: '0.5px solid #222',
                  minWidth: '160px',
                  zIndex: 100,
                }}
              >
                {profileLinks.map((item, i) => (
                  <div
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setIsProfileOpen(false);
                    }}
                    onMouseEnter={() => setHoveredProfileIdx(i)}
                    onMouseLeave={() => setHoveredProfileIdx(-1)}
                    style={{
                      padding: '10px 16px',
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '11px',
                      color: '#fff',
                      cursor: 'pointer',
                      background: hoveredProfileIdx === i ? '#111' : 'transparent',
                    }}
                  >
                    {item.label}
                  </div>
                ))}
                {/* Divider */}
                <div style={{ borderTop: '0.5px solid #1a1a1a', margin: '4px 0' }} />
                <div
                  onClick={handleLogout}
                  onMouseEnter={() => setHoveredProfileIdx(99)}
                  onMouseLeave={() => setHoveredProfileIdx(-1)}
                  style={{
                    padding: '10px 16px',
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '11px',
                    color: '#fff',
                    cursor: 'pointer',
                    background: hoveredProfileIdx === 99 ? '#111' : 'transparent',
                  }}
                >
                  Logout
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
