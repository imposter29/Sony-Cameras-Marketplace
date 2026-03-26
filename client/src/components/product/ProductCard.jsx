import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Camera } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useCartStore from '../../store/cartStore';
import useWishlistStore from '../../store/wishlistStore';
import useCompareStore from '../../store/compareStore';
import { addToCart } from '../../api/cart';
import { toggleWishlist } from '../../api/users';
import { formatPrice } from '../../utils/formatPrice';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const addItem = useCartStore((s) => s.addItem);
  const { toggleItem, items: wishlistItems } = useWishlistStore();
  const { addToCompare, items: compareItems } = useCompareStore();
  const [compareMsg, setCompareMsg] = useState('');

  const wishlisted = wishlistItems.some((i) => i._id === product._id);
  const inCompare = compareItems.some((i) => i._id === product._id);

  const isNew = product.createdAt && Date.now() - new Date(product.createdAt).getTime() < 30 * 24 * 60 * 60 * 1000;
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPct = hasDiscount ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  const rating = product.avgRating || 0;
  const stars = Array.from({ length: 5 }, (_, i) => (i < Math.round(rating) ? '★' : '☆')).join('');

  const handleCardClick = () => navigate(`/products/${product.slug}`);

  const handleWishlist = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) return navigate('/login');
    toggleWishlist(product._id).catch(() => {});
    toggleItem(product);
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) return navigate('/login');
    try { await addToCart(product._id, 1); } catch {}
    addItem(product, 1);
  };

  const handleCompare = (e) => {
    e.stopPropagation();
    if (inCompare) return;
    if (compareItems.length >= 3) {
      setCompareMsg('Max 3');
      setTimeout(() => setCompareMsg(''), 1500);
      return;
    }
    addToCompare(product);
  };

  return (
    <div
      onClick={handleCardClick}
      style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '0.5px solid #E5E5E5',
        borderRight: '0.5px solid #E5E5E5',
        cursor: 'pointer',
        transition: 'border-color 0.2s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#000000'; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderBottomColor = '#E5E5E5'; e.currentTarget.style.borderRightColor = '#E5E5E5'; }}
    >
      {/* Image area */}
      <div style={{ height: '240px', backgroundColor: '#F5F5F5', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {product.images && product.images.length > 0 ? (
          <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <Camera size={48} style={{ color: '#E5E5E5' }} />
        )}

        {(hasDiscount || isNew) && (
          <span style={{
            position: 'absolute', top: '8px', left: '8px',
            backgroundColor: hasDiscount ? '#404040' : '#000000', color: '#FFFFFF',
            fontFamily: "'DM Sans', sans-serif", fontSize: '8px', fontWeight: 600,
            textTransform: 'uppercase', letterSpacing: '0.08em', padding: '3px 8px',
          }}>
            {hasDiscount ? `−${discountPct}%` : 'NEW'}
          </span>
        )}

        <button onClick={handleWishlist} style={{
          position: 'absolute', top: '8px', right: '8px', width: '28px', height: '28px',
          backgroundColor: '#FFFFFF', border: '0.5px solid #E5E5E5', borderRadius: '0',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0,
        }}>
          <Heart size={14} style={{ color: '#000000' }} fill={wishlisted ? '#000000' : 'none'} strokeWidth={1.5} />
        </button>
      </div>

      {/* Info section */}
      <div style={{ padding: '16px' }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '9px', color: '#7F7F7F', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '4px' }}>
          {product.category?.name || ''}
        </p>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '15px', fontWeight: 500, color: '#000000', lineHeight: 1.3, marginBottom: '4px' }}>
          {product.name}
        </h3>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: '#7F7F7F', lineHeight: 1.5, marginBottom: '10px',
          overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
        }}>
          {product.description ? product.description.slice(0, 60) + (product.description.length > 60 ? '...' : '') : ''}
        </p>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '6px' }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '16px', fontWeight: 600, color: '#000000' }}>
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#7F7F7F', textDecoration: 'line-through' }}>
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: '#404040', letterSpacing: '1px' }}>{stars}</span>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', color: '#7F7F7F' }}>({product.reviewCount || 0})</span>
        </div>

        <div style={{ display: 'flex', gap: '1px' }}>
          <button onClick={handleAddToCart} style={{
            flex: 1, backgroundColor: '#000000', color: '#FFFFFF',
            fontFamily: "'DM Sans', sans-serif", fontSize: '10px', fontWeight: 600,
            textTransform: 'uppercase', letterSpacing: '0.08em', padding: '10px 0',
            border: 'none', borderRadius: '0', cursor: 'pointer',
          }}>
            ADD TO CART
          </button>
          <button onClick={handleCompare} style={{
            width: '44px', backgroundColor: '#FFFFFF', color: inCompare ? '#000000' : '#404040',
            fontFamily: "'DM Sans', sans-serif", fontSize: '10px', fontWeight: 500,
            border: '0.5px solid #000000', borderRadius: '0', cursor: 'pointer', padding: 0,
          }}>
            {compareMsg || (inCompare ? '✓' : '+')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
