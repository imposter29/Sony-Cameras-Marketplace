import { useNavigate } from 'react-router-dom';
import useWishlistStore from '../store/wishlistStore';
import ProductCard from '../components/product/ProductCard';

const Wishlist = () => {
  const navigate = useNavigate();
  const { items } = useWishlistStore();

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: 'calc(100vh - 56px)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 40px 80px' }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', fontWeight: 500, color: '#000', marginBottom: '32px' }}>
          My Wishlist ({items.length})
        </h1>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#E5E5E5" strokeWidth="1" style={{ margin: '0 auto 16px', display: 'block' }}>
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: 500, color: '#000', marginBottom: '8px' }}>Nothing saved yet</p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#7F7F7F', marginBottom: '24px' }}>Save items you love by clicking the heart icon</p>
            <button onClick={() => navigate('/products')} style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: 600, textTransform: 'uppercase',
              letterSpacing: '0.12em', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '0',
              padding: '13px 28px', cursor: 'pointer',
            }}>BROWSE CAMERAS</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', backgroundColor: '#FFFFFF' }}>
            {items.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
