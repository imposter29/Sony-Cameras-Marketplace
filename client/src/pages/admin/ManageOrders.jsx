import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ShoppingBag, ChevronDown, Search } from 'lucide-react';
import { getAllOrders, updateOrderStatus } from '../../api/orders';
import { formatPrice } from '../../utils/formatPrice';
import { useToast } from '../../components/ui/Toast';

const STATUS_OPTIONS = ['placed', 'confirmed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'];

const statusColor = {
  placed: '#F59E0B',
  confirmed: '#3B82F6',
  shipped: '#8B5CF6',
  out_for_delivery: '#06B6D4',
  delivered: '#10B981',
  cancelled: '#EF4444',
};

const ManageOrders = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'orders'],
    queryFn: () => getAllOrders().then(r => r.data),
  });
  const orders = data?.orders || [];

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      addToast('✓ Order status updated');
    },
    onError: () => addToast('✗ Failed to update status'),
  });

  const filtered = orders.filter(o => {
    const matchStatus = filterStatus === 'all' || o.status === filterStatus;
    const matchSearch = !search || o._id.includes(search) || o.user?.name?.toLowerCase().includes(search.toLowerCase()) || o.user?.email?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const inputStyle = {
    fontFamily: "'DM Sans', sans-serif", fontSize: '12px', border: '0.5px solid #E5E5E5',
    padding: '10px 14px', outline: 'none', backgroundColor: '#fff', color: '#000',
  };

  return (
    <div style={{ backgroundColor: '#FAFAFA', minHeight: 'calc(100vh - 56px)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 40px 80px' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', fontWeight: 500, color: '#000' }}>Manage Orders</h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#7F7F7F', marginTop: '4px' }}>{orders.length} total orders</p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '1', minWidth: '220px' }}>
            <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', stroke: '#7F7F7F' }} />
            <input placeholder="Search by order ID or customer..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, paddingLeft: '36px', width: '100%', boxSizing: 'border-box' }} />
          </div>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            style={{ ...inputStyle, appearance: 'none', cursor: 'pointer', paddingRight: '32px', minWidth: '160px' }}
          >
            <option value="all">All Statuses</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>)}
          </select>
        </div>

        {/* Status summary badges */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {STATUS_OPTIONS.map(s => {
            const count = orders.filter(o => o.status === s).length;
            if (!count) return null;
            return (
              <button
                key={s}
                onClick={() => setFilterStatus(filterStatus === s ? 'all' : s)}
                style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: '9px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em',
                  border: `0.5px solid ${statusColor[s]}`, color: filterStatus === s ? '#fff' : statusColor[s],
                  backgroundColor: filterStatus === s ? statusColor[s] : 'transparent', padding: '4px 12px', cursor: 'pointer',
                }}
              >
                {s.replace(/_/g, ' ')} ({count})
              </button>
            );
          })}
        </div>

        {/* Orders List */}
        {isLoading ? (
          [1,2,3].map(i => <div key={i} className="animate-pulse" style={{ height: '80px', backgroundColor: '#fff', border: '0.5px solid #E5E5E5', marginBottom: '8px' }} />)
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', backgroundColor: '#fff', border: '0.5px solid #E5E5E5' }}>
            <ShoppingBag size={36} stroke="#E5E5E5" style={{ margin: '0 auto 12px', display: 'block' }} />
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#7F7F7F' }}>No orders found</p>
          </div>
        ) : (
          filtered.map(order => (
            <div key={order._id} style={{ backgroundColor: '#fff', border: '0.5px solid #E5E5E5', marginBottom: '8px' }}>
              {/* Order Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', alignItems: 'center', gap: '16px', padding: '16px 20px' }}>
                <div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 600, color: '#000' }}>
                    #SON-{order._id.slice(-6).toUpperCase()}
                  </p>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: '#7F7F7F', marginTop: '2px' }}>
                    {order.user?.name} · {order.user?.email}
                  </p>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', color: '#7F7F7F', marginTop: '2px' }}>
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · {order.items.length} item{order.items.length > 1 ? 's' : ''} · {formatPrice(order.total)}
                  </p>
                </div>

                {/* Status Selector */}
                <div style={{ position: 'relative' }}>
                  <select
                    value={order.status}
                    onChange={e => statusMutation.mutate({ id: order._id, status: e.target.value })}
                    disabled={statusMutation.isPending}
                    style={{
                      fontFamily: "'DM Sans', sans-serif", fontSize: '9px', fontWeight: 600, textTransform: 'uppercase',
                      letterSpacing: '0.08em', border: `0.5px solid ${statusColor[order.status]}`,
                      color: statusColor[order.status], backgroundColor: 'transparent', padding: '4px 24px 4px 8px',
                      cursor: 'pointer', appearance: 'none', outline: 'none',
                    }}
                  >
                    {STATUS_OPTIONS.map(s => (
                      <option key={s} value={s}>{s.replace(/_/g, ' ').toUpperCase()}</option>
                    ))}
                  </select>
                  <ChevronDown size={10} stroke={statusColor[order.status]} style={{ position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                </div>

                {/* Payment badge */}
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '9px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', border: `0.5px solid ${order.paymentStatus === 'paid' ? '#10B981' : '#F59E0B'}`, color: order.paymentStatus === 'paid' ? '#10B981' : '#F59E0B', padding: '4px 10px' }}>
                  {order.paymentStatus}
                </span>

                {/* Expand toggle */}
                <button
                  onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                  style={{ background: 'none', border: '0.5px solid #E5E5E5', padding: '6px 10px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#7F7F7F' }}
                >
                  {expandedOrder === order._id ? 'Hide' : 'Details'}
                </button>
              </div>

              {/* Expanded Details */}
              {expandedOrder === order._id && (
                <div style={{ borderTop: '0.5px solid #F0F0F0', padding: '16px 20px', backgroundColor: '#FAFAFA' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    {/* Items */}
                    <div>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#7F7F7F', marginBottom: '10px' }}>Items</p>
                      {order.items.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                          <div style={{ width: '36px', height: '28px', backgroundColor: '#fff', border: '0.5px solid #E5E5E5', overflow: 'hidden', flexShrink: 0 }}>
                            {item.image && <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} />}
                          </div>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: '#000' }}>{item.name}</p>
                            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', color: '#7F7F7F' }}>Qty: {item.quantity} · {formatPrice(item.price)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Shipping address */}
                    <div>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#7F7F7F', marginBottom: '10px' }}>Shipping Address</p>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#000', lineHeight: 1.7 }}>
                        {order.shippingAddress?.line1}<br />
                        {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}<br />
                        {order.shippingAddress?.phone && <>📞 {order.shippingAddress.phone}</>}
                      </p>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: '#7F7F7F', marginTop: '8px' }}>Payment: {order.paymentMethod?.toUpperCase()}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageOrders;
