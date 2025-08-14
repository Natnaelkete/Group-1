import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ForgotPassword from './components/authPages/ForgotPassword';
import ResetPassword from './components/authPages/ResetPassword';
import SignUp from './components/authPages/SignUp';
import SignIn from './components/authPages/SignIn';
import PostProduct from './components/Product/PostProduct';
import DashboardLayout from './components/DashboardLayout';
import ProductsList from './components/Product/ProductList';
import './index.css';
import Calendar from './pages/Calendar';
import Dashboard from './pages/Dashboard';
import ProductDetail from './components/Product/ProductDetail';
import { CartProvider } from './components/cart/CartContext';
import CartPage from './components/cart/CartPage';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth Pages */}
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Dashboard Pages */}
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<ProductsList />} />
                        <Route path="/cart" element={<CartPage/>} />
            <Route path="/calendar" element={<Calendar/>} />

            <Route path="/create-product" element={<PostProduct />} />
            <Route path="/products/:id" element={<ProductDetail />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}
 export default App