import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  HomeIcon,
  PackageIcon,
  PlusIcon,
  ShoppingCartIcon,
  InfoIcon,
  ActivityIcon,
  NewspaperIcon,
  CalendarIcon,
  LeafIcon,
  CloudSunIcon,
  SettingsIcon,
  HelpCircleIcon,
  LogOut as LogOutIcon,
} from "lucide-react";

const SidebarLayout: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const isLoggedIn = true;

  const isActive = (path: string) => location.pathname === path;

  const defaultBgClass = "bg-gray-50 text-green-700";
  const hoverBgClass = "hover:bg-green-200 hover:text-green-900";
  const transitionClass = "transition-colors duration-300";

  return (
    <div className="flex flex-col h-screen bg-white border-r">
      {!isLoggedIn && (
        <div className="flex flex-col gap-1 px-2 py-2 border-b border-gray-200 md:hidden">
          <Link
            to="/sign-in"
            className="flex items-center justify-center w-full px-4 py-2 bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors"
          >
            {t("auth.signIn")}
          </Link>
          <Link
            to="/sign-up"
            className="flex items-center justify-center w-full px-4 py-2 bg-yellow-400 text-green-900 font-medium rounded-md hover:bg-yellow-500 transition-colors"
          >
            {t("auth.signUp")}
          </Link>
        </div>
      )}

      <nav className="flex flex-col mt-0 space-y-1 p-1">
        <Link
          to="/dashboard"
          className={`flex items-center gap-3 px-2 py-2 rounded ${transitionClass} ${
            isActive("/dashboard")
              ? "bg-green-100 text-green-900"
              : `${defaultBgClass} ${hoverBgClass}`
          }`}
        >
          <HomeIcon className="w-5 h-5" />
          {t("nav.home")}
        </Link>

        <Link
          to="/create-product"
          className={`flex items-center gap-3 px-2 py-2 rounded ${transitionClass} ${
            isActive("/create-product")
              ? "bg-green-100 text-green-900"
              : `${defaultBgClass} ${hoverBgClass}`
          }`}
        >
          <PlusIcon className="w-5 h-5" />
          {t("nav.createProduct")}
        </Link>

        <Link
          to="/marketplace"
          className={`flex items-center gap-3 px-2 py-2 rounded ${transitionClass} ${
            isActive("/marketplace")
              ? "bg-green-100 text-green-900"
              : `${defaultBgClass} ${hoverBgClass}`
          }`}
        >
          <ShoppingCartIcon className="w-5 h-5" />
          {t("nav.marketplace")}
          <span className="ml-auto bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
            24
          </span>
        </Link>

        <Link
          to="/services"
          className={`flex items-center gap-3 px-2 py-2 rounded ${transitionClass} ${
            isActive("/services")
              ? "bg-green-100 text-green-900"
              : `${defaultBgClass} ${hoverBgClass}`
          }`}
        >
          <LeafIcon className="w-5 h-5" />
          {t("nav.services")}
        </Link>

        <Link
          to="/disease-detection"
          className={`flex items-center gap-3 px-2 py-2 rounded ${transitionClass} ${
            isActive("/disease-detection")
              ? "bg-green-100 text-green-900"
              : `${defaultBgClass} ${hoverBgClass}`
          }`}
        >
          <ActivityIcon className="w-5 h-5" />
          {t("nav.diseaseDetection")}
        </Link>

        <Link
          to="/news"
          className={`flex items-center gap-3 px-2 py-2 rounded ${transitionClass} ${
            isActive("/news")
              ? "bg-green-100 text-green-900"
              : `${defaultBgClass} ${hoverBgClass}`
          }`}
        >
          <NewspaperIcon className="w-5 h-5" />
          {t("nav.news")}
        </Link>

        <Link
          to="/products"
          className={`flex items-center gap-3 px-2 py-2 rounded ${transitionClass} ${
            isActive("/products")
              ? "bg-green-100 text-green-900"
              : `${defaultBgClass} ${hoverBgClass}`
          }`}
        >
          <PackageIcon className="w-5 h-5" />
          {t("nav.products")}
        </Link>

        <Link
          to="/weather-detector"
          className={`flex md:hidden items-center gap-3 px-2 py-2 rounded ${transitionClass} ${
            isActive("/weather-detector")
              ? "bg-green-100 text-green-900"
              : `${defaultBgClass} ${hoverBgClass}`
          }`}
        >
          <CloudSunIcon className="w-5 h-5" />
          {t("nav.weather")}
        </Link>

        <Link
          to="/calendar"
          className={`flex items-center gap-3 px-2 py-2 rounded ${transitionClass} ${
            isActive("/calendar")
              ? "bg-green-100 text-green-900"
              : `${defaultBgClass} ${hoverBgClass}`
          }`}
        >
          <CalendarIcon className="w-5 h-5" />
          {t("nav.calendar")}
        </Link>
      </nav>

      <div className="p-1 space-y-1 border-t border-gray-200 mt-">
        <Link
          to="/about"
          className={`flex items-center gap-3 px-2 py-2 rounded ${transitionClass} ${
            isActive("/about")
              ? "bg-green-100 text-green-900"
              : `${defaultBgClass} ${hoverBgClass}`
          }`}
        >
          <InfoIcon className="w-5 h-5" />
          {t("nav.aboutUs")}
        </Link>

        <Link
          to="/settings"
          className={`flex md:hidden items-center gap-3 px-2 py-2 rounded ${transitionClass} ${
            isActive("/settings")
              ? "bg-green-100 text-green-900"
              : `${defaultBgClass} ${hoverBgClass}`
          }`}
        >
          <SettingsIcon className="w-5 h-5" />
          {t("nav.settings")}
        </Link>

        <Link
          to="/help"
          className={`flex items-center gap-3 px-2 py-2 rounded ${transitionClass} ${defaultBgClass} ${hoverBgClass}`}
        >
          <HelpCircleIcon className="w-5 h-5" />
          {t("nav.helpCenter")}
        </Link>

        {isLoggedIn && (
          <button
            className={`flex items-center gap-3 w-full px-2 py-2 rounded ${transitionClass} ${defaultBgClass} ${hoverBgClass}`}
          >
            <LogOutIcon className="w-5 h-5" />
            {t("profile.logout")}
          </button>
        )}
      </div>

      <div className="p-2 text-sm text-gray-500 border-t border-gray-200">
        {t("footer.copyright")}
      </div>
    </div>
  );
};

export default SidebarLayout;