import { useParams } from 'react-router-dom';
import { useCategories } from '../hooks/useProducts';
import Products from './Products';

const Category = () => {
  const { slug } = useParams();
  const { data: catData } = useCategories();
  const categories = catData?.categories || catData || [];
  const category = categories.find((c) => c.slug === slug);

  return (
    <div style={{ backgroundColor: '#FFFFFF' }}>
      <div style={{
        backgroundColor: '#000000', padding: '48px 40px 40px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: '9px', textTransform: 'uppercase',
          letterSpacing: '0.2em', color: '#7F7F7F', marginBottom: '8px',
        }}>SONY CAMERAS</p>
        <h1 style={{
          fontFamily: "'Playfair Display', serif", fontSize: '36px', fontWeight: 400, color: '#FFFFFF',
          letterSpacing: '-0.01em',
        }}>
          {category?.name || slug}
        </h1>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#7F7F7F', marginTop: '8px',
          maxWidth: '500px', textAlign: 'center',
        }}>
          {category?.description || `Browse our ${category?.name || slug} collection`}
        </p>
      </div>
      <Products key={slug} initialCategory={slug} />
    </div>
  );
};

export default Category;
