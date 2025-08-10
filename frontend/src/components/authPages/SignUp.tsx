import React, { useState } from 'react';
import agriIcon from '@/assets/images/agriIcon.png';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface FormData {
  name: string;
  phoneNumber: string;
  email: string;
}

const SignUp: React.FC = () => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    phoneNumber: '',
    email: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Registration data submitted:', formData);
    alert(t('signUp.submitSuccessMessage', 'Registration successful! Check the console for the submitted data.'));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-100 p-4">
      <div className="relative bg-white p-8 md:p-10 rounded-xl shadow-2xl w-full max-w-lg">
       

        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-green-700">
            {t('signUp.title')}
          </h1>
          <p className="text-gray-600 mt-2">
            {t('signUp.description')}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm font-medium text-gray-800 mb-2">
              {t('signUp.nameLabel')}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
              placeholder={t('signUp.namePlaceholder')}
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-800 mb-2">
              {t('signUp.phoneNumberLabel')}
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
              placeholder={t('signUp.phoneNumberPlaceholder')}
              required
            />
          </div>

          <div className="mb-8">
            <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-2">
              {t('signUp.emailLabel')}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
              placeholder={t('signUp.emailPlaceholder')}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300"
          >
            {t('signUp.submitButton')}
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-gray-600">
          {t('signUp.alreadyAccountText')}{' '}
          <Link to="/sign-in" className="font-medium text-green-600 hover:text-green-800 transition-colors duration-300 ml-1">
            {t('signUp.loginHere')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
