import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const footerLinkStyle = {
  display: 'block',
  marginBottom: '10px',
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '12px',
  color: '#7F7F7F',
  cursor: 'pointer',
  background: 'none',
  border: 'none',
  padding: 0,
  textAlign: 'left',
};

const Footer = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isAdmin = isAuthenticated && user?.role === 'admin';

  return (
    <footer style={{ background: '#000', borderTop: '0.5px solid #1a1a1a', padding: '52px 40px 32px' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isAdmin ? '1.6fr 1fr 1fr 1fr' : '1.6fr 1fr 1fr 1fr',
          gap: '48px',
          marginBottom: '36px',
        }}
      >
        {/* Column 1 — Brand */}
        <div>
          <img
            src="https://res.cloudinary.com/djiqoe4bb/image/upload/v1776023220/BlackLogo_li2wwi.png"
            alt="Sony"
            style={{ height: '16px', width: 'auto', display: 'block', filter: 'brightness(0) invert(1)' }}
          />
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#7F7F7F', marginTop: '10px' }}>
            Sony Cameras India
          </p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: '#404040', lineHeight: 1.7, marginTop: '8px', maxWidth: '240px' }}>
            {isAdmin
              ? 'Administrator portal for managing Sony Cameras India — products, orders, users, and messages.'
              : 'Authorised marketplace for Sony interchangeable-lens, vlog, cinema line, compact and Handycam cameras.'}
          </p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', color: '#404040', marginTop: '16px' }}>
            © 2026 Sony Corporation
          </p>
        </div>

        {isAdmin ? (
          <>
            {/* Admin Col 2 — Catalogue */}
            <div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.18em', color: '#7F7F7F', marginBottom: '16px', fontWeight: 500 }}>
                CATALOGUE
              </p>
              <FooterLink label="Products" onClick={() => navigate('/products')} />
              <FooterLink label="Edit Products" onClick={() => navigate('/admin/products')} />
              <FooterLink label="Add New Product" onClick={() => navigate('/admin/products/new')} />
            </div>

            {/* Admin Col 3 — Operations */}
            <div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.18em', color: '#7F7F7F', marginBottom: '16px', fontWeight: 500 }}>
                OPERATIONS
              </p>
              <FooterLink label="Manage Orders" onClick={() => navigate('/admin/orders')} />
              <FooterLink label="Manage Users" onClick={() => navigate('/admin/users')} />
              <FooterLink label="Messages" onClick={() => navigate('/admin/messages')} />
            </div>

            {/* Admin Col 4 — Admin Account */}
            <div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.18em', color: '#7F7F7F', marginBottom: '16px', fontWeight: 500 }}>
                ADMIN
              </p>
              <FooterLink label="My Profile" onClick={() => navigate('/profile')} />
              <FooterLink label="Dashboard" onClick={() => navigate('/admin')} />
            </div>
          </>
        ) : (
          <>
            {/* Column 2 — Shop */}
            <div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.18em', color: '#7F7F7F', marginBottom: '16px', fontWeight: 500 }}>
                SHOP
              </p>
              <FooterLink label="All Products" onClick={() => navigate('/products')} />
              <FooterLink label="Interchangeable-lens" onClick={() => navigate('/category/interchangeable-lens-cameras')} />
              <FooterLink label="Vlog Cameras" onClick={() => navigate('/category/vlog-cameras')} />
              <FooterLink label="Handycam Camcorders" onClick={() => navigate('/category/handycam-camcorders')} />
              <FooterLink label="Compact Cameras" onClick={() => navigate('/category/compact-cameras')} />
              <FooterLink label="Cinema Line" onClick={() => navigate('/category/cinema-line-cameras')} />
            </div>

            {/* Column 3 — Support */}
            <div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.18em', color: '#7F7F7F', marginBottom: '16px', fontWeight: 500 }}>
                SUPPORT
              </p>
              <FooterLink label="About Us" onClick={() => navigate('/about')} />
              <FooterLink label="Contact Us" onClick={() => navigate('/contact')} />
            </div>

            {/* Column 4 — Account */}
            <div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.18em', color: '#7F7F7F', marginBottom: '16px', fontWeight: 500 }}>
                ACCOUNT
              </p>
              {isAuthenticated ? (
                <>
                  <FooterLink label="My Profile" onClick={() => navigate('/profile')} />
                  <FooterLink label="My Orders" onClick={() => navigate('/orders')} />
                  <FooterLink label="Addresses" onClick={() => navigate('/addresses')} />
                  <FooterLink label="Wishlist" onClick={() => navigate('/wishlist')} />
                </>
              ) : (
                <>
                  <FooterLink label="Login" onClick={() => navigate('/login')} />
                  <FooterLink label="Sign Up" onClick={() => navigate('/signup')} />
                </>
              )}
            </div>
          </>
        )}
      </div>

      {/* Bottom bar */}
      <div
        style={{
          borderTop: '0.5px solid #1a1a1a',
          paddingTop: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', color: '#404040' }}>
          {isAdmin ? 'Sony Cameras India — Admin Portal' : 'Made for creators. Built with Sony.'}
        </span>
        <div style={{ display: 'flex', gap: '20px' }}>
          <FooterLink label="Privacy Policy" onClick={() => navigate('/privacy')} />
          <FooterLink label="Terms & Conditions" onClick={() => navigate('/terms')} />
        </div>
      </div>
    </footer>
  );
};

/* ——— Footer Link with hover ——— */
const FooterLink = ({ label, onClick }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <span
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...footerLinkStyle,
        color: hovered ? '#fff' : '#7F7F7F',
        transition: 'color 0.15s',
      }}
    >
      {label}
    </span>
  );
};

export default Footer;
