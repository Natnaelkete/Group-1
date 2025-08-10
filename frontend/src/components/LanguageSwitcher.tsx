import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  return (
    <div className="fixed top-4 right-4 space-x-2 z-50">
      <button
        onClick={() => i18n.changeLanguage('en')}
        className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400"
      >
        English
      </button>
      <button
        onClick={() => i18n.changeLanguage('am')}
        className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400"
      >
        አማርኛ
      </button>
    </div>
  );
};

export default LanguageSwitcher;
