import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

  return (
    <footer style={{ background: '#000', borderTop: '0.5px solid #1a1a1a', padding: '52px 40px 32px' }}>
      {/* Three-column grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.5fr 1fr 1fr',
          gap: '48px',
          marginBottom: '36px',
        }}
      >
        {/* Column 1 — Brand */}
        <div>
          <img
            src="/BlackLogo.png"
            alt="Sony"
            style={{ height: '16px', width: 'auto', display: 'block', filter: 'brightness(0) invert(1)' }}
          />
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '12px',
              color: '#7F7F7F',
              marginTop: '10px',
            }}
          >
            Sony Cameras India
          </p>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '11px',
              color: '#404040',
              lineHeight: 1.7,
              marginTop: '8px',
              maxWidth: '240px',
            }}
          >
            Authorised marketplace for Sony Alpha, ZV, and Cinema Line cameras.
          </p>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '10px',
              color: '#404040',
              marginTop: '16px',
            }}
          >
            © 2026 Sony Corporation
          </p>
        </div>

        {/* Column 2 — Cameras */}
        <div>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '9px',
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              color: '#7F7F7F',
              marginBottom: '16px',
              fontWeight: 500,
            }}
          >
            CAMERAS
          </p>
          <FooterLink label="Alpha Series" onClick={() => navigate('/category/alpha-series')} />
          <FooterLink label="ZV Series" onClick={() => navigate('/category/zv-series')} />
          <FooterLink label="Cinema Line" onClick={() => navigate('/category/cinema-line')} />
          <FooterLink label="Lenses" onClick={() => navigate('/category/lenses')} />
          <FooterLink label="Accessories" onClick={() => navigate('/category/accessories')} />
        </div>

        {/* Column 3 — Account */}
        <div>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '9px',
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              color: '#7F7F7F',
              marginBottom: '16px',
              fontWeight: 500,
            }}
          >
            ACCOUNT
          </p>
          <FooterLink label="Login" onClick={() => navigate('/login')} />
          <FooterLink label="My Profile" onClick={() => navigate('/profile')} />
          <FooterLink label="My Orders" onClick={() => navigate('/orders/my')} />
          <FooterLink label="Wishlist" onClick={() => navigate('/wishlist')} />
          <FooterLink label="Compare" onClick={() => navigate('/compare')} />
        </div>
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
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '10px',
            color: '#404040',
          }}
        >
          Made for creators. Built with Sony.
        </span>
        <div style={{ display: 'flex', gap: '20px' }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', color: '#404040' }}>
            Privacy
          </span>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', color: '#404040' }}>
            Terms
          </span>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', color: '#404040' }}>
            Support
          </span>
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
