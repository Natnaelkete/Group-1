import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ForgotPassword from './components/authPages/ForgotPassword';
import ResetPassword from './components/authPages/ResetPassword';
import SignUp from './components/authPages/SignUp';
import SignIn from './components/authPages/SignIn';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<h1>Welcome to Agrolink</h1>} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='*' element={<h1>404 - Page not found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
