import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  HomeIcon,
  PackageIcon,
  PlusIcon,
  ActivityIcon,
  NewspaperIcon,
  CalendarIcon,
  LeafIcon,
  CloudSunIcon,
} from "lucide-react";

// NOTE: In a real app, 'theme' should come from a Context Provider
// and 'isLoggedIn' should come from your authentication state.
const SidebarLayout: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const isLoggedIn = true; 
  const theme = "light"; 

  const isActive = (path: string) => location.pathname === path;

  const themeClasses = {
    light: {
      sidebarBg: "bg-gray-50 border-gray-200", 
      hoverBg: "hover:bg-gray-100",
      activeBg: "bg-gray-200",
      activeText: "text-gray-900",
      border: "border-gray-200",
    },
    dark: {
      sidebarBg: "bg-gray-800 border-gray-700",
      hoverBg: "hover:bg-gray-700",
      activeBg: "bg-gray-700",
      activeText: "text-gray-50",
      border: "border-gray-700",
    },
  };

  const currentTheme = themeClasses[theme as keyof typeof themeClasses];

  const navItems = [
    { path: "/", Icon: HomeIcon, label: t("nav.home") },
    { path: "/create-product", Icon: PlusIcon, label: t("nav.createProduct") },
    { path: "/services", Icon: LeafIcon, label: t("nav.services") },
    { path: "/disease-detection", Icon: ActivityIcon, label: t("nav.diseaseDetection") },
    { path: "/news", Icon: NewspaperIcon, label: t("nav.news") },
    { path: "/products", Icon: PackageIcon, label: t("nav.products") },
    { path: "/weather-detector", Icon: CloudSunIcon, label: t("nav.weather") },
    { path: "/calendar", Icon: CalendarIcon, label: t("nav.calendar") },
  ];

  const renderLink = ({ path, Icon, label }: typeof navItems[0]) => {
    const active = isActive(path);

    const linkClasses = `flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 bg-white
      ${currentTheme.hoverBg}
      ${active ? currentTheme.activeBg : ""}`;

    const iconClasses = `w-5 h-5 text-green-700`;
    const textClasses = `text-sm font-medium text-gray-600`;

    return (
      <div className="mb-2" key={path}>
        <Link to={path} className={linkClasses}>
          <Icon className={iconClasses} />
          <span className={textClasses}>{label}</span>
        </Link>
      </div>
    );
  };

  return (
    <div
      className={`flex flex-col h-screen border-r ${currentTheme.sidebarBg}`}
    >
      {!isLoggedIn && (
        <div
          className={`flex flex-col gap-2 p-4 md:hidden border-b ${currentTheme.border}`}
        >
          <Link
            to="/sign-in"
            className="w-full px-4 py-2 text-center text-sm font-semibold rounded-md transition-colors border border-gray-300 hover:bg-gray-100"
          >
            {t("auth.signIn")}
          </Link>
          <Link
            to="/sign-up"
            className="w-full px-4 py-2 text-center text-sm font-semibold rounded-md transition-colors bg-gray-900 text-white hover:bg-gray-700"
          >
            {t("auth.signUp")}
          </Link>
        </div>
      )}

      <nav className="flex flex-col flex-grow p-4">
        {navItems.map(renderLink)}
      </nav>

      <div
        className={`p-4 text-xs text-center text-gray-600 opacity-50`}
      >
        {t("footer.copyright")}
      </div>
    </div>
  );
};

export default SidebarLayout;