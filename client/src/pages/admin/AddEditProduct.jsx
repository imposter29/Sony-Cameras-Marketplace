import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, ArrowLeft, Plus, X } from 'lucide-react';
import { getProductBySlug, getCategories, createProduct, updateProduct } from '../../api/products';
import { useToast } from '../../components/ui/Toast';
import api from '../../api/axios';

const AddEditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // id = product._id when editing
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: '', slug: '', description: '', category: '',
    price: '', originalPrice: '', stock: '', isFeatured: false,
    images: [''],
  });

  // When editing, load by ID
  const { data: productData, isLoading: loadingProduct } = useQuery({
    queryKey: ['admin', 'product-edit', id],
    queryFn: () => api.get(`/products/by-id/${id}`).then(r => r.data),
    enabled: isEdit,
  });

  const { data: catData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then(r => r.data.categories || r.data),
  });
  const categories = Array.isArray(catData) ? catData : (catData?.categories || []);

  useEffect(() => {
    if (productData?.product) {
      const p = productData.product;
      setForm({
        name: p.name || '',
        slug: p.slug || '',
        description: p.description || '',
        category: p.category?._id || p.category || '',
        price: p.price || '',
        originalPrice: p.originalPrice || '',
        stock: p.stock || '',
        isFeatured: p.isFeatured || false,
        images: p.images?.length ? p.images : [''],
      });
    }
  }, [productData]);

  const saveMutation = useMutation({
    mutationFn: (data) => isEdit ? updateProduct(id, data) : createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      addToast(isEdit ? '✓ Product updated' : '✓ Product created');
      navigate('/admin/products');
    },
    onError: (err) => {
      addToast(err.response?.data?.message || '✗ Save failed');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...form,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      stock: Number(form.stock),
      images: form.images.filter(Boolean),
    };
    saveMutation.mutate(data);
  };

  const inputStyle = {
    fontFamily: "'DM Sans', sans-serif", fontSize: '12px', border: '0.5px solid #E5E5E5',
    padding: '11px 14px', width: '100%', outline: 'none', backgroundColor: '#fff', color: '#000',
    boxSizing: 'border-box',
  };
  const labelStyle = {
    fontFamily: "'DM Sans', sans-serif", fontSize: '10px', fontWeight: 600,
    textTransform: 'uppercase', letterSpacing: '0.1em', color: '#7F7F7F',
    display: 'block', marginBottom: '6px',
  };

  return (
    <div style={{ backgroundColor: '#FAFAFA', minHeight: 'calc(100vh - 56px)' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 40px 80px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
          <button onClick={() => navigate('/admin/products')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: '#7F7F7F' }}>
            <ArrowLeft size={14} /> Back
          </button>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', fontWeight: 500, color: '#000' }}>
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </h1>
        </div>

        {loadingProduct ? (
          <div style={{ textAlign: 'center', padding: '60px 0', fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#7F7F7F' }}>Loading product...</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ backgroundColor: '#fff', border: '0.5px solid #E5E5E5', padding: '32px', marginBottom: '16px' }}>
              <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#000', marginBottom: '24px' }}>Basic Information</h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={labelStyle}>Product Name *</label>
                  <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} placeholder="Sony Alpha A7 IV" />
                </div>
                <div>
                  <label style={labelStyle}>Slug *</label>
                  <input required value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))} style={inputStyle} placeholder="sony-alpha-a7-iv" />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Description *</label>
                <textarea required value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={4} style={{ ...inputStyle, resize: 'vertical', fontFamily: "'DM Sans', sans-serif" }} placeholder="Full camera description..." />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Category *</label>
                  <select required value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
                    <option value="">Select...</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Price (₹) *</label>
                  <input required type="number" min="0" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} style={inputStyle} placeholder="249990" />
                </div>
                <div>
                  <label style={labelStyle}>Original Price (₹)</label>
                  <input type="number" min="0" value={form.originalPrice} onChange={e => setForm(f => ({ ...f, originalPrice: e.target.value }))} style={inputStyle} placeholder="299990" />
                </div>
                <div>
                  <label style={labelStyle}>Stock *</label>
                  <input required type="number" min="0" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} style={inputStyle} placeholder="10" />
                </div>
              </div>

              <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="checkbox" id="featured" checked={form.isFeatured} onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))} style={{ cursor: 'pointer' }} />
                <label htmlFor="featured" style={{ ...labelStyle, marginBottom: 0, cursor: 'pointer' }}>Feature on Homepage</label>
              </div>
            </div>

            {/* Images */}
            <div style={{ backgroundColor: '#fff', border: '0.5px solid #E5E5E5', padding: '32px', marginBottom: '24px' }}>
              <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#000', marginBottom: '20px' }}>Product Images</h2>
              {form.images.map((img, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                  <input
                    value={img}
                    onChange={e => {
                      const imgs = [...form.images];
                      imgs[i] = e.target.value;
                      setForm(f => ({ ...f, images: imgs }));
                    }}
                    style={{ ...inputStyle, flex: 1 }}
                    placeholder={`Image URL ${i + 1}`}
                  />
                  {form.images.length > 1 && (
                    <button type="button" onClick={() => setForm(f => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }))} style={{ background: 'none', border: '0.5px solid #E5E5E5', padding: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                      <X size={12} stroke="#7F7F7F" />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => setForm(f => ({ ...f, images: [...f.images, ''] }))} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: '#7F7F7F', background: 'none', border: 'none', cursor: 'pointer', marginTop: '4px' }}>
                <Plus size={12} /> Add Image URL
              </button>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="button" onClick={() => navigate('/admin/products')} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', backgroundColor: 'transparent', color: '#000', border: '0.5px solid #000', padding: '13px 28px', cursor: 'pointer' }}>
                CANCEL
              </button>
              <button type="submit" disabled={saveMutation.isPending} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', backgroundColor: '#000', color: '#fff', border: 'none', padding: '13px 28px', cursor: 'pointer' }}>
                <Save size={14} />
                {saveMutation.isPending ? 'SAVING...' : (isEdit ? 'UPDATE PRODUCT' : 'CREATE PRODUCT')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddEditProduct;
