import { useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Camera, Truck, Shield, Store } from 'lucide-react';
import { useProductBySlug, useProducts, useProductReviews } from '../hooks/useProducts';
import useAuthStore from '../store/authStore';
import useCartStore from '../store/cartStore';
import useWishlistStore from '../store/wishlistStore';
import useCompareStore from '../store/compareStore';
import { addToCart } from '../api/cart';
import { toggleWishlist } from '../api/users';
import { formatPrice } from '../utils/formatPrice';
import ProductCard from '../components/product/ProductCard';
import SkeletonCard from '../components/ui/SkeletonCard';

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const reviewsRef = useRef(null);
  const { data, isLoading } = useProductBySlug(slug);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const cartAddItem = useCartStore((s) => s.addItem);
  const { toggleItem, items: wishlistItems } = useWishlistStore();
  const { addToCompare, items: compareItems } = useCompareStore();

  const [selectedImage, setSelectedImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [cartMsg, setCartMsg] = useState('');
  const [show360, setShow360] = useState(false);

  if (isLoading) {
    return (
      <div style={{ padding: '60px 32px', textAlign: 'center' }}>
        <div className="animate-pulse" style={{ width: '200px', height: '20px', backgroundColor: '#E5E5E5', margin: '0 auto' }} />
      </div>
    );
  }

  const product = data?.product;
  if (!product) {
    return <div style={{ padding: '60px 32px', textAlign: 'center', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#7F7F7F' }}>Product not found</div>;
  }

  const wishlisted = wishlistItems.some((i) => i._id === product._id);
  const inCompare = compareItems.some((i) => i._id === product._id);
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountAmt = hasDiscount ? product.originalPrice - product.price : 0;
  const discountPct = hasDiscount ? Math.round((discountAmt / product.originalPrice) * 100) : 0;
  const inStock = product.stock > 0;
  const stars = Array.from({ length: 5 }, (_, i) => (i < Math.round(product.avgRating || 0) ? '★' : '☆')).join('');

  const handleAddToCart = async () => {
    if (!isAuthenticated) return navigate('/login');
    try { await addToCart(product._id, qty); } catch {}
    cartAddItem(product, qty);
    setCartMsg('✓ Added to cart');
    setTimeout(() => setCartMsg(''), 2000);
  };

  const handleWishlist = () => {
    if (!isAuthenticated) return navigate('/login');
    toggleWishlist(product._id).catch(() => {});
    toggleItem(product);
  };

  const handleCompare = () => {
    if (inCompare) return;
    addToCompare(product);
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF' }}>
      <div style={{ display: 'flex', maxWidth: '1200px', margin: '0 auto' }}>
        {/* LEFT — Gallery + Specs 60% */}
        <div style={{ flex: '0 0 60%', padding: '28px 24px' }}>
          {/* Main image */}
          <div style={{ height: '400px', backgroundColor: '#F5F5F5', border: '0.5px solid #E5E5E5', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
            {product.images && product.images.length > 0 ? (
              <img src={product.images[selectedImage] || product.images[0]} alt={product.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            ) : (
              <Camera size={64} style={{ color: '#E5E5E5' }} />
            )}
            <span style={{ position: 'absolute', bottom: '8px', right: '8px', border: '0.5px solid #E5E5E5', padding: '4px 8px', fontFamily: "'DM Sans', sans-serif", fontSize: '9px', color: '#7F7F7F', backgroundColor: '#FFFFFF' }}>⤢ ZOOM</span>
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              {product.images.slice(0, 4).map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)} style={{
                  width: '60px', height: '48px', border: selectedImage === i ? '1px solid #000' : '0.5px solid #E5E5E5',
                  borderRadius: '0', overflow: 'hidden', cursor: 'pointer', padding: 0, backgroundColor: '#F5F5F5',
                }}>
                  <img src={img} alt={`${product.name} ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}

          {/* 360° button */}
          <button onClick={() => setShow360(true)} style={{
            marginTop: '12px', fontFamily: "'DM Sans', sans-serif", fontSize: '10px', textTransform: 'uppercase',
            border: '0.5px solid #000', borderRadius: '0', backgroundColor: '#FFF', color: '#000', padding: '8px 16px', cursor: 'pointer',
          }}>⟳ 360° VIEW</button>

          {/* Specs table */}
          {product.specs && Object.keys(product.specs).length > 0 && (
            <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '0.5px solid #E5E5E5' }}>
              <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#7F7F7F', marginBottom: '16px' }}>KEY SPECIFICATIONS</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {Object.entries(product.specs).map(([key, value]) => (
                    <tr key={key} style={{ borderBottom: '0.5px solid #E5E5E5' }}>
                      <td style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: '#7F7F7F', width: '45%', padding: '9px 0', textTransform: 'capitalize' }}>{key}</td>
                      <td style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: 500, color: '#000', padding: '9px 0' }}>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* RIGHT — Buy Panel 40% */}
        <div style={{ flex: '0 0 40%', borderLeft: '0.5px solid #E5E5E5', padding: '28px', position: 'sticky', top: '56px', height: 'fit-content', maxHeight: 'calc(100vh - 56px)', overflowY: 'auto' }}>
          {/* Breadcrumb */}
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', color: '#7F7F7F', marginBottom: '14px' }}>
            <Link to="/" style={{ color: '#7F7F7F', textDecoration: 'none' }}>Home</Link>
            {' › '}
            <Link to={`/category/${product.category?.slug || ''}`} style={{ color: '#7F7F7F', textDecoration: 'none' }}>{product.category?.name || 'Products'}</Link>
            {' › '}
            <span style={{ color: '#404040' }}>{product.name}</span>
          </p>

          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#7F7F7F', marginBottom: '6px' }}>{product.category?.name || ''}</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '26px', fontWeight: 500, color: '#000', lineHeight: 1.2, marginBottom: '10px' }}>{product.name}</h1>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px', fontFamily: "'DM Sans', sans-serif", fontSize: '11px' }}>
            <span style={{ color: '#404040', letterSpacing: '1px' }}>{stars}</span>
            <span style={{ color: '#000', fontWeight: 500 }}>{(product.avgRating || 0).toFixed(1)}</span>
            <span style={{ color: '#7F7F7F', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => reviewsRef.current?.scrollIntoView({ behavior: 'smooth' })}>
              ({product.reviewCount || 0} reviews)
            </span>
          </div>

          <div style={{ borderTop: '0.5px solid #E5E5E5', margin: '16px 0' }} />

          {/* Price */}
          <div style={{ marginBottom: '4px' }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '30px', fontWeight: 600, color: '#000' }}>{formatPrice(product.price)}</span>
            {hasDiscount && <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', color: '#7F7F7F', textDecoration: 'line-through', marginLeft: '12px' }}>{formatPrice(product.originalPrice)}</span>}
          </div>
          {hasDiscount && <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#404040', marginBottom: '12px' }}>You save {formatPrice(discountAmt)} ({discountPct}% off)</p>}

          {/* Stock */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: inStock ? '#000' : '#E5E5E5', display: 'inline-block' }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: '#404040' }}>{inStock ? 'In stock — ships in 2-3 days' : 'Out of stock'}</span>
          </div>

          <div style={{ borderTop: '0.5px solid #E5E5E5', margin: '16px 0' }} />

          {/* Quantity */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', color: '#7F7F7F', textTransform: 'uppercase' }}>QTY</span>
            <div style={{ display: 'flex' }}>
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} style={{ width: '30px', height: '30px', border: '0.5px solid #E5E5E5', borderRadius: '0', backgroundColor: '#FFF', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: '14px' }}>−</button>
              <span style={{ width: '30px', height: '30px', border: '0.5px solid #E5E5E5', borderLeft: 'none', borderRight: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif", fontSize: '12px' }}>{qty}</span>
              <button onClick={() => setQty((q) => Math.min(product.stock || 99, q + 1))} style={{ width: '30px', height: '30px', border: '0.5px solid #E5E5E5', borderRadius: '0', backgroundColor: '#FFF', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: '14px' }}>+</button>
            </div>
          </div>

          {/* Buttons */}
          <button onClick={handleAddToCart} disabled={!inStock} style={{
            width: '100%', backgroundColor: inStock ? '#000' : '#E5E5E5', color: '#FFF',
            fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: 600, textTransform: 'uppercase',
            letterSpacing: '0.12em', padding: '14px', border: 'none', borderRadius: '0', cursor: inStock ? 'pointer' : 'default', marginBottom: '8px',
          }}>{inStock ? 'ADD TO CART' : 'OUT OF STOCK'}</button>
          {cartMsg && <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: '#404040', textAlign: 'center', marginBottom: '8px' }}>{cartMsg}</p>}

          <button onClick={handleWishlist} style={{
            width: '100%', backgroundColor: '#FFF', color: '#000',
            fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: 600, textTransform: 'uppercase',
            letterSpacing: '0.12em', padding: '14px', border: '0.5px solid #404040', borderRadius: '0', cursor: 'pointer', marginBottom: '8px',
          }}>{wishlisted ? '✓ IN WISHLIST' : 'SAVE TO WISHLIST'}</button>

          <button onClick={handleCompare} style={{
            width: '100%', backgroundColor: '#FFF', color: '#7F7F7F',
            fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: 500, textTransform: 'uppercase',
            letterSpacing: '0.12em', padding: '14px', border: '0.5px solid #E5E5E5', borderRadius: '0', cursor: 'pointer', marginBottom: '24px',
          }}>{inCompare ? '✓ ADDED' : '+ ADD TO COMPARE'}</button>

          {/* Trust signals */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { icon: <Truck size={14} />, text: 'Free shipping on orders above ₹10,000' },
              { icon: <Shield size={14} />, text: '2-year Sony India warranty included' },
              { icon: <Store size={14} />, text: 'Authorised Sony India retailer' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: "'DM Sans', sans-serif", fontSize: '10px', color: '#7F7F7F' }}>
                <span style={{ color: '#7F7F7F' }}>{item.icon}</span>{item.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* REVIEWS */}
      <ReviewsSection product={product} reviewsRef={reviewsRef} />

      {/* RELATED */}
      <RelatedProducts product={product} />

      {/* 360° Modal */}
      {show360 && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShow360(false)}>
          <div style={{ backgroundColor: '#FFF', padding: '32px', position: 'relative', maxWidth: '500px', width: '100%' }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShow360(false)} style={{ position: 'absolute', top: '12px', right: '12px', background: 'none', border: 'none', fontFamily: "'DM Sans', sans-serif", fontSize: '18px', cursor: 'pointer', color: '#000' }}>×</button>
            <div style={{ animation: 'spin360 3s linear infinite', transformStyle: 'preserve-3d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {product.images?.[0] ? (
                <img src={product.images[0]} alt={product.name} style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }} />
              ) : <Camera size={100} style={{ color: '#E5E5E5' }} />}
            </div>
            <style>{`@keyframes spin360 { from { transform: rotateY(0deg); } to { transform: rotateY(360deg); } }`}</style>
          </div>
        </div>
      )}
    </div>
  );
};

/* Reviews Section */
const ReviewsSection = ({ product, reviewsRef }) => {
  const { data: reviewsData } = useProductReviews(product._id);
  const reviews = reviewsData?.reviews || [];
  const ratingCounts = [0, 0, 0, 0, 0];
  reviews.forEach((r) => { if (r.rating >= 1 && r.rating <= 5) ratingCounts[r.rating - 1]++; });
  const totalReviews = reviews.length || product.reviewCount || 1;

  return (
    <div ref={reviewsRef} style={{ borderTop: '0.5px solid #E5E5E5', maxWidth: '1200px', margin: '32px auto 0', padding: '32px' }}>
      <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#7F7F7F', marginBottom: '24px' }}>CUSTOMER REVIEWS</h3>

      <div style={{ display: 'flex', gap: '40px', marginBottom: '32px' }}>
        <div>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '48px', fontWeight: 400, color: '#000', display: 'block', lineHeight: 1 }}>{(product.avgRating || 0).toFixed(1)}</span>
          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', color: '#7F7F7F' }}>out of 5</span>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '4px' }}>
          {[5, 4, 3, 2, 1].map((star) => {
            const pct = totalReviews > 0 ? (ratingCounts[star - 1] / totalReviews) * 100 : 0;
            return (
              <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', color: '#7F7F7F', width: '16px' }}>{star}★</span>
                <div style={{ flex: 1, height: '3px', backgroundColor: '#E5E5E5', position: 'relative' }}>
                  <div style={{ width: `${pct}%`, height: '100%', backgroundColor: '#000' }} />
                </div>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', color: '#7F7F7F', width: '30px', textAlign: 'right' }}>{Math.round(pct)}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {reviews.length === 0 ? (
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#7F7F7F', textAlign: 'center', padding: '32px 0' }}>No reviews yet. Be the first to review this camera.</p>
      ) : reviews.map((review) => (
        <div key={review._id} style={{ borderBottom: '0.5px solid #E5E5E5', padding: '16px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#000', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 600 }}>
              {review.user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', fontWeight: 500, color: '#000' }}>{review.user?.name || 'Anonymous'}</p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', color: '#7F7F7F' }}>{new Date(review.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: '#404040', letterSpacing: '1px', marginBottom: '6px' }}>
            {Array.from({ length: 5 }, (_, i) => (i < review.rating ? '★' : '☆')).join('')}
          </p>
          {review.title && <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '15px', fontWeight: 500, color: '#000', marginBottom: '4px' }}>{review.title}</p>}
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#404040', lineHeight: 1.7 }}>{review.comment}</p>
        </div>
      ))}
    </div>
  );
};

/* Related Products */
const RelatedProducts = ({ product }) => {
  const { data, isLoading } = useProducts({ category: product.category?.slug, limit: 4 });
  const related = (data?.products || []).filter((p) => p._id !== product._id).slice(0, 3);
  if (!isLoading && related.length === 0) return null;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px' }}>
      <h3 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#7F7F7F', marginBottom: '24px' }}>YOU MAY ALSO LIKE</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', backgroundColor: '#E5E5E5' }}>
        {isLoading ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />) : related.map((p) => <ProductCard key={p._id} product={p} />)}
      </div>
    </div>
  );
};

export default ProductDetail;
