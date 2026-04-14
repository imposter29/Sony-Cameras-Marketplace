import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import useAuthStore from './store/authStore';
import { getMe } from './api/auth';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CartDrawer from './components/cart/CartDrawer';
import CompareBar from './components/product/CompareBar';

// Route guards
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Category from './pages/Category';
import Compare from './pages/Compare';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Addresses from './pages/Addresses';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import MyOrders from './pages/MyOrders';
import OrderDetail from './pages/OrderDetail';
import NotFound from './pages/NotFound';
import About from './pages/About';
import ContactUs from './pages/ContactUs';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import AuthCallback from './pages/AuthCallback';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageProducts from './pages/admin/ManageProducts';
import AddEditProduct from './pages/admin/AddEditProduct';
import ManageOrders from './pages/admin/ManageOrders';
import ManageUsers from './pages/admin/ManageUsers';
import ManageMessages from './pages/admin/ManageMessages';

// Scroll to top on every route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

function App() {
  const token = useAuthStore((state) => state.token);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);

  // Rehydrate user from token on app load
  useEffect(() => {
    const rehydrate = async () => {
      if (!token) return;
      try {
        const { data } = await getMe();
        setUser(data.user);
      } catch {
        logout();
      }
    };
    rehydrate();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FFFFFF' }}>
      <Navbar />
      <ScrollToTop />
      <CartDrawer />

      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/category/:slug" element={<Category />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Protected Routes — requires authentication */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/addresses" element={<Addresses />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/orders" element={<MyOrders />} />
            <Route path="/orders/:id" element={<OrderDetail />} />
          </Route>

          {/* Admin Routes — requires admin role */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<ManageProducts />} />
            <Route path="/admin/products/new" element={<AddEditProduct />} />
            <Route path="/admin/products/:id/edit" element={<AddEditProduct />} />
            <Route path="/admin/orders" element={<ManageOrders />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/messages" element={<ManageMessages />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <CompareBar />
      <Footer />
    </div>
  );
}

export default App;
