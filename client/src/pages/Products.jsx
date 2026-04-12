import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useProducts, useCategories } from '../hooks/useProducts';
import ProductCard from '../components/product/ProductCard';
import SkeletonCard from '../components/ui/SkeletonCard';

const Products = ({ initialCategory = '' }) => {
  const [searchParams] = useSearchParams();
  const urlSearch = searchParams.get('search') || '';

  const [search, setSearch] = useState(urlSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(urlSearch);
  const [selectedCategories, setSelectedCategories] = useState(initialCategory ? [initialCategory] : []);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [appliedMin, setAppliedMin] = useState('');
  const [appliedMax, setAppliedMax] = useState('');
  const [rating, setRating] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);

  useEffect(() => { const t = setTimeout(() => setDebouncedSearch(search), 400); return () => clearTimeout(t); }, [search]);

  const resetPage = useCallback(() => setPage(1), []);

  const params = {
    search: debouncedSearch || undefined,
    category: selectedCategories.length ? selectedCategories.join(',') : undefined,
    minPrice: appliedMin || undefined,
    maxPrice: appliedMax || undefined,
    rating: rating || undefined,
    sort, page, limit: 12,
  };

  const { data, isLoading } = useProducts(params);
  const { data: catData } = useCategories();

  const products = data?.products || [];
  const pagination = data?.pagination || {};
  const totalPages = pagination.pages || 1;
  const categories = catData?.categories || catData || [];

  const toggleArr = (arr, setArr, val) => {
    setArr((p) => p.includes(val) ? p.filter((v) => v !== val) : [...p, val]);
    resetPage();
  };

  const activeFilters = [];
  selectedCategories.forEach((c) => {
    const cat = categories.find((x) => x.slug === c);
    activeFilters.push({ label: cat?.name || c, type: 'category', value: c });
  });
  if (rating) activeFilters.push({ label: `${rating}★ & up`, type: 'rating', value: rating });
  if (appliedMin || appliedMax) activeFilters.push({ label: `₹${appliedMin || '0'} – ₹${appliedMax || '∞'}`, type: 'price', value: 'price' });

  const removeFilter = (f) => {
    if (f.type === 'category') setSelectedCategories((p) => p.filter((v) => v !== f.value));
    if (f.type === 'rating') setRating('');
    if (f.type === 'price') { setAppliedMin(''); setAppliedMax(''); setMinPrice(''); setMaxPrice(''); }
    resetPage();
  };

  const clearAll = () => {
    setSearch(''); setDebouncedSearch('');
    setSelectedCategories(initialCategory ? [initialCategory] : []);
    setMinPrice(''); setMaxPrice(''); setAppliedMin(''); setAppliedMax('');
    setRating(''); setSort('newest'); setPage(1);
  };

  const lbl = { fontFamily: "'DM Sans', sans-serif", fontSize: '9px', color: '#7F7F7F', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px', display: 'block' };
  const chk = (on) => ({
    width: '14px', height: '14px', border: '0.5px solid #404040', borderRadius: '0',
    backgroundColor: on ? '#000000' : '#FFFFFF', display: 'inline-flex', alignItems: 'center',
    justifyContent: 'center', cursor: 'pointer', flexShrink: 0, marginRight: '8px',
  });

  return (
    <div style={{ display: 'flex', backgroundColor: '#FFFFFF', minHeight: 'calc(100vh - 56px)' }}>
      {/* FILTER SIDEBAR */}
      <aside style={{
        width: '220px', minWidth: '220px', backgroundColor: '#FFFFFF',
        borderRight: '0.5px solid #E5E5E5', padding: '24px 20px',
        position: 'sticky', top: '56px', height: 'calc(100vh - 56px)', overflowY: 'auto',
      }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#000000', paddingBottom: '12px', borderBottom: '0.5px solid #E5E5E5', marginBottom: '20px' }}>FILTERS</div>

        {/* Category */}
        <div style={{ marginBottom: '24px' }}>
          <span style={lbl}>CATEGORY</span>
          {categories.map((cat) => (
            <label key={cat._id || cat.slug} onClick={() => toggleArr(selectedCategories, setSelectedCategories, cat.slug)} style={{
              display: 'flex', alignItems: 'center', marginBottom: '6px', cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif", fontSize: '11px',
              color: selectedCategories.includes(cat.slug) ? '#000000' : '#7F7F7F',
            }}>
              <span style={chk(selectedCategories.includes(cat.slug))}>
                {selectedCategories.includes(cat.slug) && <span style={{ color: '#FFF', fontSize: '9px' }}>✓</span>}
              </span>
              {cat.name}
            </label>
          ))}
        </div>

        {/* Price */}
        <div style={{ marginBottom: '24px' }}>
          <span style={lbl}>PRICE RANGE</span>
          <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
            <input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)}
              style={{ flex: 1, fontFamily: "'DM Sans', sans-serif", fontSize: '11px', border: '0.5px solid #E5E5E5', borderRadius: '0', padding: '6px 8px', outline: 'none', width: '60px' }} />
            <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}
              style={{ flex: 1, fontFamily: "'DM Sans', sans-serif", fontSize: '11px', border: '0.5px solid #E5E5E5', borderRadius: '0', padding: '6px 8px', outline: 'none', width: '60px' }} />
          </div>
          <button onClick={() => { setAppliedMin(minPrice); setAppliedMax(maxPrice); resetPage(); }}
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '9px', fontWeight: 600, textTransform: 'uppercase', backgroundColor: '#000000', color: '#FFFFFF', border: 'none', borderRadius: '0', padding: '6px 14px', cursor: 'pointer' }}>APPLY</button>
        </div>

        {/* Rating */}
        <div style={{ marginBottom: '24px' }}>
          <span style={lbl}>RATING</span>
          {[{ l: '5 stars only', v: '5' }, { l: '4 stars & up', v: '4' }, { l: '3 stars & up', v: '3' }].map((r) => (
            <label key={r.v} onClick={() => { setRating(rating === r.v ? '' : r.v); resetPage(); }} style={{
              display: 'flex', alignItems: 'center', marginBottom: '6px', cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: rating === r.v ? '#000' : '#7F7F7F',
            }}>
              <span style={{ ...chk(rating === r.v), borderRadius: '50%' }}>
                {rating === r.v && <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#FFF', display: 'block' }} />}
              </span>
              {r.l}
            </label>
          ))}
        </div>

        <button onClick={clearAll} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', color: '#7F7F7F', textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>Clear all filters</button>
      </aside>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, padding: '24px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '300px' }}>
            <Search size={13} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#7F7F7F' }} />
            <input type="text" placeholder="Search cameras..." value={search} onChange={(e) => { setSearch(e.target.value); resetPage(); }}
              style={{ width: '100%', fontFamily: "'DM Sans', sans-serif", fontSize: '12px', backgroundColor: '#FFFFFF', border: '0.5px solid #000000', borderRadius: '0', padding: '9px 12px 9px 36px', outline: 'none' }} />
          </div>
          <select value={sort} onChange={(e) => { setSort(e.target.value); resetPage(); }}
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', border: '0.5px solid #404040', borderRadius: '0', padding: '9px 12px', backgroundColor: '#FFFFFF', outline: 'none', cursor: 'pointer' }}>
            <option value="newest">Newest first</option>
            <option value="price_asc">Price: low to high</option>
            <option value="price_desc">Price: high to low</option>
            <option value="rating">Top rated</option>
          </select>
        </div>

        {/* Active chips */}
        {activeFilters.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
            {activeFilters.map((f, i) => (
              <span key={i} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', color: '#000', border: '0.5px solid #000', borderRadius: '0', padding: '4px 10px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                {f.label}
                <button onClick={() => removeFilter(f)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#000', lineHeight: 1 }}>×</button>
              </span>
            ))}
            <button onClick={clearAll} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', color: '#7F7F7F', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 10px', textTransform: 'uppercase' }}>CLEAR ALL</button>
          </div>
        )}

        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: '#7F7F7F', marginBottom: '16px' }}>
          {pagination.total ?? products.length} cameras found
        </p>

        {isLoading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', backgroundColor: '#FFFFFF' }}>
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#7F7F7F', marginBottom: '16px' }}>No cameras found matching your filters.</p>
            <button onClick={clearAll} style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: 600, textTransform: 'uppercase',
              backgroundColor: '#000000', color: '#FFFFFF', border: 'none', borderRadius: '0', padding: '12px 28px', cursor: 'pointer', letterSpacing: '0.08em',
            }}>CLEAR ALL FILTERS</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', backgroundColor: '#FFFFFF' }}>
            {products.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginTop: '32px' }}>
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', textTransform: 'uppercase', border: '0.5px solid #000', borderRadius: '0', backgroundColor: '#FFF', color: page <= 1 ? '#E5E5E5' : '#000', padding: '8px 20px', cursor: page <= 1 ? 'default' : 'pointer' }}>PREV</button>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: '#7F7F7F' }}>Page {page} of {totalPages}</span>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', textTransform: 'uppercase', border: '0.5px solid #000', borderRadius: '0', backgroundColor: '#FFF', color: page >= totalPages ? '#E5E5E5' : '#000', padding: '8px 20px', cursor: page >= totalPages ? 'default' : 'pointer' }}>NEXT</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
