import React, { useState } from 'react';
import agriIcon from '@/assets/images/agriIcon.png';
import { Link } from 'react-router-dom';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Password reset requested for:', email);
    alert('If this email is registered, you will receive password reset instructions.');
    setEmail('');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-100 p-4">
      <div className="relative bg-white p-8 md:p-10 rounded-xl shadow-2xl w-full max-w-lg">
        
        <img 
          src={agriIcon} 
          alt="AgroTech Logo" 
          className="absolute top-6 left-6 w-20 h-20 p-2" 
        />

        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-green-700">
            Forgot Password
          </h1>
          <p className="text-gray-600 mt-2">
            Enter your email address to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
              placeholder="you@example.com"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300"
          >
            Send Reset Link
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-gray-600">
          Remember your password?{' '}
          <Link to="/sign-in" className="font-medium text-green-600 hover:text-green-800 transition-colors duration-300 ml-1">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
