import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import Weather from "./pages/WeatherPage";
import "./index.css";

const FarmerRoute = ({ children }: { children: JSX.Element }) => {
  const role = localStorage.getItem("role");
  return role === "farmer" ? children : <Navigate to="/products" replace />;
};

function App() {
  const role = localStorage.getItem("role");

  return (
    <CartProvider>
      <BrowserRouter>
        <Header />

        <Routes>
          <Route
            path="/"
            element={
              role
                ? role === "farmer"
                  ? <Navigate to="/dashboard" replace />
                  : <Navigate to="/products" replace />
                : <LandingPage />
            }
          />

          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route
            element={
              <FarmerRoute>
                <DashboardLayout />
              </FarmerRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-product" element={<PostProduct />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="/products" element={<ProductsList />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<CartPage />} />
          </Route>

          <Route path="/products" element={<ProductsList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage />} />

          <Route path="*" element={<Navigate to="/sign-up" replace />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
