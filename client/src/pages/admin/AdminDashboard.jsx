import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Package, Users, ShoppingBag, LayoutDashboard, TrendingUp, AlertCircle, MessageSquare } from 'lucide-react';
import { getAllOrders } from '../../api/orders';
import { getProducts } from '../../api/products';
import { getAllUsers } from '../../api/users';
import { formatPrice } from '../../utils/formatPrice';

const statCard = (label, value, sub, icon) => ({ label, value, sub, icon });

const AdminDashboard = () => {
  const navigate = useNavigate();

  const { data: ordersData } = useQuery({
    queryKey: ['admin', 'orders'],
    queryFn: () => getAllOrders().then(r => r.data),
  });
  const { data: productsData } = useQuery({
    queryKey: ['admin', 'products-all'],
    queryFn: () => getProducts({ limit: 1000 }).then(r => r.data),
  });
  const { data: usersData } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: () => getAllUsers().then(r => r.data),
  });
  const { data: messagesData } = useQuery({
    queryKey: ['contact-messages'],
    queryFn: () => import('../../api/axios').then(m => m.default.get('/contact').then(r => r.data)),
  });

  const orders = ordersData?.orders || [];
  const products = productsData?.products || [];
  const users = usersData?.users || [];
  const messages = messagesData?.messages || [];
  const unreadMessages = messages.filter(m => !m.read).length;

  const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'placed').length;
  const lowStock = products.filter(p => p.stock < 5).length;

  const recentOrders = orders.slice(0, 5);

  const statusColor = {
    placed: '#F59E0B',
    confirmed: '#3B82F6',
    shipped: '#8B5CF6',
    out_for_delivery: '#06B6D4',
    delivered: '#10B981',
    cancelled: '#EF4444',
  };

  return (
    <div style={{ backgroundColor: '#FAFAFA', minHeight: 'calc(100vh - 56px)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 40px 80px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
          <LayoutDashboard size={22} stroke="#000" />
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', fontWeight: 500, color: '#000' }}>
            Admin Dashboard
          </h1>
        </div>

        {/* Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '40px' }}>
          {[
            { label: 'Total Revenue', value: formatPrice(totalRevenue), sub: `${orders.filter(o=>o.status!=='cancelled').length} orders`, icon: TrendingUp },
            { label: 'Total Orders', value: orders.length, sub: `${pendingOrders} pending`, icon: ShoppingBag },
            { label: 'Products', value: products.length, sub: `${lowStock} low stock`, icon: Package },
            { label: 'Users', value: users.length, sub: `${users.filter(u=>u.isActive).length} active`, icon: Users },
            { label: 'Messages', value: messages.length, sub: `${unreadMessages} unread`, icon: MessageSquare },
          ].map((stat) => (
            <div key={stat.label} style={{ backgroundColor: '#fff', border: '0.5px solid #E5E5E5', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#7F7F7F' }}>{stat.label}</p>
                <stat.icon size={16} stroke="#C0C0C0" />
              </div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '28px', fontWeight: 600, color: '#000', marginBottom: '4px' }}>{stat.value}</p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: '#7F7F7F' }}>{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Low Stock Alert */}
        {lowStock > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#FEF3C7', border: '0.5px solid #F59E0B', padding: '12px 16px', marginBottom: '32px' }}>
            <AlertCircle size={16} stroke="#F59E0B" />
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#92400E' }}>
              {lowStock} product{lowStock > 1 ? 's are' : ' is'} low on stock (less than 5 units).{' '}
              <span style={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={() => navigate('/admin/products')}>Manage Products →</span>
            </p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' }}>
          {/* Recent Orders */}
          <div style={{ backgroundColor: '#fff', border: '0.5px solid #E5E5E5', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#000' }}>Recent Orders</h2>
              <button onClick={() => navigate('/admin/orders')} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', color: '#7F7F7F', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>View all</button>
            </div>
            {recentOrders.length === 0 ? (
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#7F7F7F', padding: '24px 0', textAlign: 'center' }}>No orders yet</p>
            ) : recentOrders.map(order => (
              <div key={order._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '0.5px solid #F0F0F0' }}>
                <div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', fontWeight: 500, color: '#000' }}>#{order._id.slice(-6).toUpperCase()}</p>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', color: '#7F7F7F', marginTop: '2px' }}>{order.user?.name || 'Unknown'} · {formatPrice(order.total)}</p>
                </div>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '9px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: statusColor[order.status] || '#000', border: `0.5px solid ${statusColor[order.status] || '#000'}`, padding: '3px 8px' }}>
                  {order.status.replace(/_/g, ' ')}
                </span>
              </div>
            ))}
          </div>

          {/* Quick Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { label: 'Manage Products', desc: 'Add, edit, delete cameras', icon: Package, href: '/admin/products' },
              { label: 'Manage Orders', desc: 'Update order statuses', icon: ShoppingBag, href: '/admin/orders' },
              { label: 'Manage Users', desc: 'Toggle user accounts', icon: Users, href: '/admin/users' },
              { label: 'Messages', desc: `${unreadMessages} unread message${unreadMessages !== 1 ? 's' : ''}`, icon: MessageSquare, href: '/admin/messages' },
            ].map(link => (
              <div
                key={link.href}
                onClick={() => navigate(link.href)}
                style={{ backgroundColor: '#fff', border: '0.5px solid #E5E5E5', padding: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px', transition: 'border-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#000'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#E5E5E5'}
              >
                <link.icon size={18} stroke="#000" />
                <div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', fontWeight: 600, color: '#000' }}>{link.label}</p>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10px', color: '#7F7F7F', marginTop: '2px' }}>{link.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
