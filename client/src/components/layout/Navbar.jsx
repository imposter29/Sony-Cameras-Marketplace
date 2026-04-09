import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, Heart, ShoppingBag, ChevronDown, GitCompare } from 'lucide-react';
import api from '../../api/axios';
import useAuthStore from '../../store/authStore';
import useCartStore from '../../store/cartStore';
import useWishlistStore from '../../store/wishlistStore';
import useCompareStore from '../../store/compareStore';

const Navbar = () => {
  const navigate = useNavigate();

  // State
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [hoveredCatIdx, setHoveredCatIdx] = useState(-1);
  const [hoveredProfileIdx, setHoveredProfileIdx] = useState(-1);

  // Refs
  const catBtnRef = useRef(null);
  const catDropdownRef = useRef(null);
  const profileBtnRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const debounceRef = useRef(null);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);

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
    queryFn: () => api.get('/categories').then((r) => r.data.categories || r.data),
    staleTime: 60 * 1000,
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

  // Live search query (debounced)
  const handleSearchChange = useCallback((e) => {
    const val = e.target.value;
    setSearchValue(val);
    setIsSearchOpen(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setSearchQuery(val), 300);
  }, []);

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && searchValue.trim()) {
      navigate('/products?search=' + encodeURIComponent(searchValue));
      setIsSearchOpen(false);
      setSearchValue('');
      setSearchQuery('');
    }
    if (e.key === 'Escape') { setIsSearchOpen(false); }
  };

  // Close search dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Fetch live search results
  const { data: searchResults } = useQuery({
    queryKey: ['navbar-search', searchQuery],
    queryFn: () => api.get('/products', { params: { search: searchQuery, limit: 6 } }).then(r => r.data.products || []),
    enabled: searchQuery.trim().length > 1,
    staleTime: 30 * 1000,
  });

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    setIsProfileOpen(false);
    navigate('/');
  };

  const profileLinks = [
    { label: 'My Profile', path: '/profile' },
    { label: 'My Orders', path: '/orders' },
    { label: 'Addresses', path: '/addresses' },
  ];

  const adminLinks = [
    { label: '⚙ Admin Dashboard', path: '/admin' },
    { label: 'Manage Products', path: '/admin/products' },
    { label: 'Manage Orders', path: '/admin/orders' },
    { label: 'Manage Users', path: '/admin/users' },
    { label: 'Messages', path: '/admin/messages' },
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '40px', flex: 1 }}>
        {/* Products button */}
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

          {/* Products dropdown */}
          {isCatOpen && (
            <div
              ref={catDropdownRef}
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                marginTop: '6px',
                background: '#000',
                border: '0.5px solid #222',
                minWidth: '220px',
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

        {/* ── Inline search ── */}
        <div ref={searchRef} style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.5)', paddingBottom: '2px' }}>
            <Search size={13} stroke="rgba(255,255,255,0.7)" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search"
              value={searchValue}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
              onFocus={() => searchValue.length > 1 && setIsSearchOpen(true)}
              style={{
                background: 'transparent', border: 'none', outline: 'none',
                fontFamily: "'DM Sans', sans-serif", fontSize: '11px',
                color: '#fff', width: '140px', letterSpacing: '0.04em',
              }}
            />
          </div>

          {/* Results dropdown */}
          {isSearchOpen && searchQuery.length > 1 && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 10px)', left: 0,
              background: '#fff', minWidth: '320px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              border: '0.5px solid #E5E5E5', zIndex: 200,
            }}>
              {!searchResults || searchResults.length === 0 ? (
                <div style={{ padding: '16px 20px', fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#7F7F7F' }}>
                  No results for "{searchQuery}"
                </div>
              ) : (
                <>
                  {searchResults.map(p => (
                    <div
                      key={p._id}
                      onClick={() => { navigate(`/products/${p.slug}`); setIsSearchOpen(false); setSearchValue(''); setSearchQuery(''); }}
                      style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', cursor: 'pointer', borderBottom: '0.5px solid #F5F5F5' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#FAFAFA'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <div style={{ width: '40px', height: '32px', background: '#F5F5F5', flexShrink: 0, overflow: 'hidden' }}>
                        {p.images?.[0] && <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#000', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</p>
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', color: '#7F7F7F' }}>{p.category?.name}</p>
                      </div>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#000', fontWeight: 600, flexShrink: 0 }}>
                        ₹{p.price?.toLocaleString('en-IN')}
                      </p>
                    </div>
                  ))}
                  <div
                    onClick={() => { navigate('/products?search=' + encodeURIComponent(searchQuery)); setIsSearchOpen(false); setSearchValue(''); setSearchQuery(''); }}
                    style={{ padding: '10px 16px', fontFamily: "'DM Sans', sans-serif", fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#000', cursor: 'pointer', textAlign: 'center', borderTop: '0.5px solid #E5E5E5' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F5F5F5'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    View all results for "{searchQuery}" →
                  </div>
                </>
              )}
            </div>
          )}
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '40px', marginLeft: 'auto' }}>


        {/* Compare */}
        <div
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '6px' }}
          onClick={() => navigate('/compare')}
        >
          <div style={{ position: 'relative' }}>
            <GitCompare size={16} stroke="#fff" fill="none" />
            {compareItems.length > 0 && <Badge count={compareItems.length} />}
          </div>
          <span style={{ color: '#fff', fontSize: '10px', fontFamily: "'DM Sans', sans-serif", textTransform: 'uppercase', letterSpacing: '0.08em' }}>Compare</span>
        </div>

        {/* Wishlist */}
        <div
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '6px' }}
          onClick={() => navigate('/wishlist')}
        >
          <div style={{ position: 'relative' }}>
            <Heart size={16} stroke="#fff" fill={wishlistItems.length > 0 ? '#fff' : 'none'} />
            {wishlistItems.length > 0 && <Badge count={wishlistItems.length} />}
          </div>
          <span style={{ color: '#fff', fontSize: '10px', fontFamily: "'DM Sans', sans-serif", textTransform: 'uppercase', letterSpacing: '0.08em' }}>Wishlist</span>
        </div>

        {/* Cart */}
        <div
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '6px' }}
          onClick={toggleDrawer}
        >
          <div style={{ position: 'relative' }}>
            <ShoppingBag size={16} stroke="#fff" fill="none" />
            {cartItems.length > 0 && <Badge count={cartItems.length} />}
          </div>
          <span style={{ color: '#fff', fontSize: '10px', fontFamily: "'DM Sans', sans-serif", textTransform: 'uppercase', letterSpacing: '0.08em' }}>Cart</span>
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
              {/* Admin badge on avatar */}
              {user?.role === 'admin' && (
                <span style={{ position: 'absolute', bottom: '-4px', right: '-4px', backgroundColor: '#fff', color: '#000', fontFamily: "'DM Sans', sans-serif", fontSize: '6px', fontWeight: 700, padding: '1px 3px', letterSpacing: '0.05em' }}>ADM</span>
              )}
            </div>

            {/* Profile dropdown */}
            {isProfileOpen && (
              <div
                ref={profileDropdownRef}
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '6px',
                  background: '#000',
                  border: '0.5px solid #222',
                  minWidth: '200px',
                  zIndex: 100,
                }}
              >
                {/* Profile link — shown for all users */}
                <div
                  onClick={() => { navigate('/profile'); setIsProfileOpen(false); }}
                  onMouseEnter={() => setHoveredProfileIdx(200)}
                  onMouseLeave={() => setHoveredProfileIdx(-1)}
                  style={{ padding: '10px 16px', fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: '#fff', cursor: 'pointer', background: hoveredProfileIdx === 200 ? '#111' : 'transparent' }}
                >
                  My Profile
                </div>

                {/* Normal user links — hidden for admin */}
                {user?.role !== 'admin' && profileLinks.filter(l => l.path !== '/profile').map((item, i) => (
                  <div
                    key={item.path}
                    onClick={() => { navigate(item.path); setIsProfileOpen(false); }}
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

                {/* Admin links — shown only for admin */}
                {user?.role === 'admin' && adminLinks.map((item, i) => (
                  <div
                    key={item.path}
                    onClick={() => { navigate(item.path); setIsProfileOpen(false); }}
                    onMouseEnter={() => setHoveredProfileIdx(100 + i)}
                    onMouseLeave={() => setHoveredProfileIdx(-1)}
                    style={{ padding: '10px 16px', fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: '#fff', cursor: 'pointer', background: hoveredProfileIdx === 100 + i ? '#111' : 'transparent' }}
                  >
                    {item.label}
                  </div>
                ))}

                {/* Divider + Logout */}
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
