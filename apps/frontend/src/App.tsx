import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { XIcon } from "lucide-react";

import ForgotPassword from "./components/authPages/ForgotPassword";
import ResetPassword from "./components/authPages/ResetPassword";
import SignUp from "./components/authPages/SignUp";
import SignIn from "./components/authPages/SignIn";
import PostProduct from "./components/Product/PostProduct";
import DashboardLayout from "./components/DashboardLayout";
import ProductsList from "./components/Product/ProductList";
import Calendar from "./pages/Calendar";
import Dashboard from "./pages/Dashboard";
import ProductDetail from "./components/Product/ProductDetail";
import { CartProvider } from "./components/cart/CartContext";
import CartPage from "./components/cart/CartPage";
import LandingPage from "./pages/LandingPage";
import Header from "./components/Header";
import { Link } from "react-router-dom";

import "./index.css";

// This is the Mobile Menu component to be controlled by the Header
const MobileMenu = ({ isOpen, onClose, t, NavLink, isLoggedIn }) => {
  return (
    <div
      className={`fixed top-0 left-0 w-64 h-full z-50 bg-white shadow-xl transform transition-transform duration-300 ease-in-out md:hidden ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex flex-col p-6 h-full">
        <button onClick={onClose} className="self-end text-green-700">
          <XIcon size={24} />
        </button>
        <nav className="flex flex-col gap-4 mt-8">
          {!isLoggedIn ? (
            <>
              <NavLink to="/" onClick={onClose}>{t("nav.home")}</NavLink>
              <NavLink to="/products" onClick={onClose}>{t("nav.products")}</NavLink>
              <NavLink to="/about" onClick={onClose}>{t("nav.about")}</NavLink>
              <NavLink to="/contact" onClick={onClose}>{t("nav.contact")}</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/dashboard" onClick={onClose}>{t("nav.home")}</NavLink>
              <NavLink to="/create-product" onClick={onClose}>{t("nav.createProduct")}</NavLink>
              <NavLink to="/products" onClick={onClose}>{t("nav.allProducts")}</NavLink>
              <NavLink to="/calendar" onClick={onClose}>{t("nav.calendar")}</NavLink>
            </>
          )}
        </nav>
        {/* Auth buttons for mobile - Removed as per user request */}
        {/* {!isLoggedIn && (
          <div className="flex flex-col gap-4 mt-8">
            <Link to="/sign-in" onClick={onClose}>
              <button className="w-full border border-green-600 text-green-700 py-2 rounded-lg">
                {t("auth.signIn")}
              </button>
            </Link>
            <Link to="/sign-up" onClick={onClose}>
              <button className="w-full bg-yellow-400 text-green-900 py-2 rounded-lg">
                {t("auth.signUp")}
              </button>
            </Link>
          </div>
        )} */}
      </div>
    </div>
  );
};

// Private route for farmers
const FarmerRoute = ({ children }) => {
  const role = localStorage.getItem("role");
  if (role !== "farmer") {
    return <Navigate to="/products" replace />;
  }
  return children;
};

// Custom NavLink for mobile menu
const NavLink = ({ to, onClick, children }) => {
  return (
    <Link to={to} onClick={onClick} className="text-lg font-medium text-gray-800 hover:text-green-600">
      {children}
    </Link>
  );
};

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();
  const role = localStorage.getItem("role");
  const isLoggedIn = !!role;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <CartProvider>
      <BrowserRouter>
        <Header onMenuClick={toggleMenu} />
        <MobileMenu
          isOpen={isMenuOpen}
          onClose={toggleMenu}
          t={t}
          NavLink={NavLink}
          isLoggedIn={isLoggedIn}
        />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/products" element={<ProductsList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route element={<FarmerRoute><DashboardLayout /></FarmerRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-product" element={<PostProduct />} />
            <Route path="/calendar" element={<Calendar />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;