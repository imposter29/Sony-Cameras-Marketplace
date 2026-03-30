import { Link } from 'react-router-dom';
import { Package, Users, ShoppingBag, LayoutDashboard } from 'lucide-react';

const AdminDashboard = () => {
  const cards = [
    { title: 'Manage Products', icon: Package, href: '/admin/products', desc: 'Add, edit, or remove products' },
    { title: 'Manage Orders', icon: ShoppingBag, href: '/admin/orders', desc: 'View and update order statuses' },
    { title: 'Manage Users', icon: Users, href: '/admin/users', desc: 'View users and toggle accounts' },
  ];

  return (
    <div className="sony-container py-10">
      <div className="flex items-center space-x-3 mb-8">
        <LayoutDashboard size={28} />
        <h1 className="text-3xl font-display font-semibold">Admin Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Link
            key={card.href}
            to={card.href}
            className="border border-sony-light hover:border-sony-black p-8 transition-all group"
          >
            <card.icon size={32} className="text-sony-mid group-hover:text-sony-black transition-colors mb-4" />
            <h2 className="text-lg font-semibold mb-1">{card.title}</h2>
            <p className="text-sm text-sony-mid">{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
