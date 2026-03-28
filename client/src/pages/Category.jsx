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
        backgroundColor: '#000000', height: '120px', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', fontWeight: 500, color: '#FFFFFF' }}>
          {category?.name || slug}
        </h1>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#7F7F7F', marginTop: '4px' }}>
          {category?.description || `Browse our ${category?.name || slug} collection`}
        </p>
      </div>
      <Products initialCategory={slug} />
    </div>
  );
};

export default Category;
