import React, { useState } from 'react';
import agriIcon from '@/assets/images/agriIcon.png';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface SignInData {
  phoneNumber: string;
  password: string;
}

const SignIn: React.FC = () => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState<SignInData>({
    phoneNumber: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      phone: formData.phoneNumber,
      password: formData.password,
      role: 'farmer',
    };

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        alert(t('signIn.loginSuccess'));
        console.log('Backend response:', data);
      } else {
        alert(`${t('signIn.loginFailed')}: ${data.error || t('signIn.unknownError')}`);
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert(t('signIn.networkError'));
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
            {t('signIn.title')}
          </h1>
          <p className="text-gray-600 mt-2">
            {t('signIn.description')}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-800 mb-2">
              {t('signIn.phoneLabel')}
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder={t('signIn.phonePlaceholder')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
              required
            />
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="block text-sm font-medium text-gray-800 mb-2">
                {t('signIn.passwordLabel')}
              </label>
              <Link to="/forgot-password" className="text-xs text-green-600 hover:text-green-800 transition-colors duration-300">
                {t('signIn.forgotPassword')}
              </Link>
            </div>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={t('signIn.passwordPlaceholder')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300"
          >
            {t('signIn.signInButton')}
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-gray-600">
          {t('signIn.noAccount')}{' '}
          <Link to="/sign-up" className="font-medium text-green-600 hover:text-green-800 transition-colors duration-300 ml-1">
            {t('signIn.signUpNow')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
