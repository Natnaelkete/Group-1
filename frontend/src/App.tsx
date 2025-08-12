import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ForgotPassword from './components/authPages/ForgotPassword';
import ResetPassword from './components/authPages/ResetPassword';
import SignUp from './components/authPages/SignUp'
import SignIn from './components/authPages/SignIn';           
import PostProduct from './components/Post/PostProduct.tsxPostProduct';
import LanguageSwitcher from './components/LanguageSwitcher'
import ProductsList from './components/Post/ProductList';
import './index.css'
import Header from './components/Header';
import Profile from './pages/Profile';

function App() {
  return (
    <BrowserRouter>
    <Header/>

      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/sign-up" element={<SignUp />} />
                <Route path="/create-product" element={<PostProduct/>} />
                <Route path="/products" element={<ProductsList />} />
                                <Route path="/profile" element={<Profile />} />




        
      </Routes>
    </BrowserRouter>
  );
}

export default App;