import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import agriIcon from '@/assets/images/agriIcon.png'; // Assuming this is a valid path
import { useAuth } from '@/context/AuthContext'; // Import useAuth hook

interface SignInData {
  phoneNumber: string;
  password: string;
}

const SignIn: React.FC = () => {
  const { setAuth } = useAuth(); 

  const [formData, setFormData] = useState<SignInData>({
    phoneNumber: '',
    password: '',
  });
  const [otp, setOtp] = useState<string>('');
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp' | 'otpInput'>('password');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLoginSuccess = (data: any) => {
    setSuccessMessage('Login successful! Redirecting...');
    setAuth(data.token, data.userId); 
    localStorage.setItem('role', data.role);

    // Role-based redirection
    if (data.role === 'farmer') {
      navigate('/'); // Farmer dashboard
    } else {
      navigate('/dashboard'); // Buyer landing page
    }
  };

  const handlePasswordLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    const payload = {
      phone: formData.phoneNumber,
      password: formData.password,
    };

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        handleLoginSuccess(data);
      } else {
        setError(data.error || 'Unknown error');
      }
    } catch (err) {
      console.error('Error during password login:', err);
      setError('Login failed: Network error or backend down');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    const payload = { phone: formData.phoneNumber };

    try {
      const response = await fetch('http://localhost:5000/api/auth/login-with-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message);
        setLoginMethod('otpInput');
      } else {
        setError(data.error || 'Failed to send OTP. Please check your phone number and try again.');
      }
    } catch (err) {
      console.error('Error requesting OTP:', err);
      setError('Login failed: Network error or backend down');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    const payload = { phone: formData.phoneNumber, otp };

    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-login-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        handleLoginSuccess(data);
      } else {
        setError(data.error || 'Invalid or expired OTP.');
      }
    } catch (err) {
      console.error('Error verifying OTP:', err);
      setError('Verification failed: Network error or backend down');
    } finally {
      setIsLoading(false);
    }
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
            Welcome Back!
          </h1>
          <p className="text-gray-600 mt-2">
            Sign in to your አግሮLink account.
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{successMessage}</span>
          </div>
        )}

        {/* Password login */}
        {loginMethod === 'password' && (
          <form onSubmit={handlePasswordLogin}>
            <div className="mb-6">
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-800 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter your phone number"
                required
              />
            </div>
            <div className="mb-8">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="block text-sm font-medium text-gray-800 mb-2">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs text-green-600 hover:text-green-800 transition-colors duration-300">
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter your password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In with Password'}
            </button>
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setLoginMethod('otp')}
                className="text-sm font-medium text-green-600 hover:text-green-800 transition-colors duration-300"
              >
                Or, Sign In with OTP
              </button>
            </div>
          </form>
        )}

        {/* Request OTP */}
        {loginMethod === 'otp' && (
          <form onSubmit={handleRequestOtp}>
            <div className="mb-6">
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-800 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter your phone number"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Sending OTP...' : 'Send OTP'}
            </button>
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setLoginMethod('password')}
                className="text-sm font-medium text-green-600 hover:text-green-800 transition-colors duration-300"
              >
                Or, Sign In with Password
              </button>
            </div>
          </form>
        )}

        {/* Verify OTP */}
        {loginMethod === 'otpInput' && (
          <form onSubmit={handleVerifyOtp}>
            <p className="text-center text-gray-600 mb-6">
              An OTP has been sent to your phone number.
            </p>
            <div className="mb-6">
              <label htmlFor="otp" className="block text-sm font-medium text-gray-800 mb-2">
                Enter OTP
              </label>
              <input
                type="text"
                id="otp"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-center tracking-widest text-xl"
                placeholder="000000"
                maxLength={6}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        )}

        <div className="text-center mt-6 text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/sign-up" className="font-medium text-green-600 hover:text-green-800 transition-colors duration-300 ml-1">
            Sign up now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
