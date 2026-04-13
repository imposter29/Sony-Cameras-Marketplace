import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, Search, Package, ChevronLeft, ChevronRight } from 'lucide-react';
import { getProducts, getCategories, deleteProduct } from '../../api/products';
import { formatPrice } from '../../utils/formatPrice';
import { useToast } from '../../components/ui/Toast';

const ManageProducts = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'products', page, search],
    queryFn: () => getProducts({ page, limit: 12, search: search || undefined }).then(r => r.data),
    keepPreviousData: true,
  });

  const products = data?.products || [];
  const totalPages = data?.pagination?.pages || 1;
  const total = data?.pagination?.total || 0;

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      addToast('✓ Product deleted');
      setConfirmDelete(null);
    },
    onError: (err) => {
      addToast(err.response?.data?.message || '✗ Delete failed');
      setConfirmDelete(null);
    },
  });

  const inputStyle = {
    fontFamily: "'DM Sans', sans-serif", fontSize: '12px', border: '0.5px solid #E5E5E5',
    padding: '10px 14px', width: '100%', outline: 'none', backgroundColor: '#fff', color: '#000',
  };

  return (
    <div style={{ backgroundColor: '#FAFAFA', minHeight: 'calc(100vh - 56px)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 40px 80px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', fontWeight: 500, color: '#000' }}>Manage Products</h1>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#7F7F7F', marginTop: '4px' }}>{total} products total</p>
          </div>
          <button
            onClick={() => navigate('/admin/products/new')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', backgroundColor: '#000', color: '#fff', border: 'none', padding: '12px 24px', cursor: 'pointer' }}
          >
            <Plus size={14} /> Add Product
          </button>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: '24px', maxWidth: '400px' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', stroke: '#7F7F7F' }} />
          <input
            placeholder="Search products..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            style={{ ...inputStyle, paddingLeft: '36px', maxWidth: '400px' }}
          />
        </div>

        {/* Table */}
        <div style={{ backgroundColor: '#fff', border: '0.5px solid #E5E5E5' }}>
          {/* Head */}
          <div style={{ display: 'grid', gridTemplateColumns: '56px 1fr 160px 80px 80px 80px', borderBottom: '0.5px solid #E5E5E5', padding: '12px 16px' }}>
            {['', 'Product', 'Category', 'Price', 'Stock', 'Actions'].map(h => (
              <span key={h} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '9px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#7F7F7F' }}>{h}</span>
            ))}
          </div>

          {isLoading ? (
            [1,2,3,4,5].map(i => (
              <div key={i} className="animate-pulse" style={{ height: '72px', borderBottom: '0.5px solid #F0F0F0', backgroundColor: '#FAFAFA' }} />
            ))
          ) : products.length === 0 ? (
            <div style={{ padding: '60px 20px', textAlign: 'center' }}>
              <Package size={36} stroke="#E5E5E5" style={{ margin: '0 auto 12px', display: 'block' }} />
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#7F7F7F' }}>No products found</p>
            </div>
          ) : products.map(product => (
            <div key={product._id} style={{ display: 'grid', gridTemplateColumns: '56px 1fr 160px 80px 80px 80px', alignItems: 'center', padding: '12px 16px', borderBottom: '0.5px solid #F0F0F0' }}>
              {/* Image */}
              <div style={{ width: '44px', height: '36px', backgroundColor: '#fff', border: '0.5px solid #F0F0F0', overflow: 'hidden' }}>
                {product.images?.[0]
                  ? <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
                  : <Package size={16} stroke="#E5E5E5" style={{ margin: '8px auto', display: 'block' }} />
                }
              </div>
              {/* Name */}
              <div style={{ paddingRight: '12px' }}>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 500, color: '#000', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', color: '#7F7F7F', marginTop: '2px' }}>{product.slug}</p>
              </div>
              {/* Category */}
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: '#7F7F7F' }}>{product.category?.name || '-'}</p>
              {/* Price */}
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 600, color: '#000' }}>{formatPrice(product.price)}</p>
              {/* Stock */}
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 600, color: product.stock < 5 ? '#EF4444' : product.stock < 20 ? '#F59E0B' : '#000' }}>
                {product.stock}
              </p>
              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => navigate(`/admin/products/${product._id}/edit`)}
                  style={{ background: 'none', border: '0.5px solid #E5E5E5', padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  title="Edit"
                >
                  <Edit2 size={12} stroke="#000" />
                </button>
                <button
                  onClick={() => setConfirmDelete(product)}
                  style={{ background: 'none', border: '0.5px solid #EF4444', padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  title="Delete"
                >
                  <Trash2 size={12} stroke="#EF4444" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '20px', justifyContent: 'center' }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ background: 'none', border: '0.5px solid #E5E5E5', padding: '8px', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.4 : 1 }}>
              <ChevronLeft size={14} stroke="#000" />
            </button>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#000' }}>{page} / {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ background: 'none', border: '0.5px solid #E5E5E5', padding: '8px', cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.4 : 1 }}>
              <ChevronRight size={14} stroke="#000" />
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div style={{ backgroundColor: '#fff', padding: '32px', maxWidth: '400px', width: '90%' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: 500, color: '#000', marginBottom: '12px' }}>Delete Product?</h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#7F7F7F', marginBottom: '24px' }}>
              "<strong style={{ color: '#000' }}>{confirmDelete.name}</strong>" will be permanently deleted.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setConfirmDelete(null)} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', backgroundColor: 'transparent', color: '#000', border: '0.5px solid #000', padding: '12px 24px', cursor: 'pointer', flex: 1 }}>CANCEL</button>
              <button onClick={() => deleteMutation.mutate(confirmDelete._id)} disabled={deleteMutation.isPending} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', backgroundColor: '#EF4444', color: '#fff', border: 'none', padding: '12px 24px', cursor: 'pointer', flex: 1 }}>
                {deleteMutation.isPending ? 'DELETING...' : 'DELETE'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
