import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next"; 
import agrilcon from "../assets/images/agriIcon.png";
import { useCart } from "../components/cart/CartContext"; // ✅ real hook

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import {
  GlobeIcon,
  UserIcon,
  MenuIcon,
  ShoppingCart,
  CloudSunIcon,
  SettingsIcon,
  SearchIcon,
  XIcon,
} from "lucide-react";

interface HeaderProps {
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { cartCount } = useCart(); // ✅ use cartCount directly
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const isActive = (path: string) => location.pathname === path;

  const NavLink = ({
    to,
    isActive,
    children,
  }: {
    to: string;
    isActive: boolean;
    children: React.ReactNode;
  }) => (
    <Link
      to={to}
      className={`flex items-center text-sm font-medium p-2 rounded-lg transition-colors duration-200 ${
        isActive
          ? "bg-gray-100 text-green-800"
          : "text-gray-600 hover:bg-green-50 hover:text-green-700"
      }`}
    >
      {children}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/90 border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center flex-shrink-0">
            {onMenuClick && (
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-green-700 hover:bg-green-50 rounded-full"
                onClick={onMenuClick}
              >
                <MenuIcon className="w-6 h-6" />
              </Button>
            )}

            <Link to="/" className="flex items-center gap-2 group mr-6 md:mr-8">
              <div className="p-1 bg-gradient-to-br from-green-500 to-green-700 rounded-full group-hover:rotate-6 transition-transform duration-500">
                <img
                  src={agrilcon}
                  alt="AgroLink Logo"
                  className="w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-white"
                />
              </div>
              <span className="font-bold text-xl text-green-800 hidden sm:block">
                አግሮLink
              </span>
            </Link>

            {/* Main navigation links */}
            <nav className="hidden md:flex items-center gap-2 lg:gap-4">
              <NavLink
                to="/weather-detector"
                isActive={isActive("/weather-detector")}
              >
                <div className="bg-gray-100 p-1 rounded-md mr-2">
                  <CloudSunIcon className="w-5 h-5 text-green-700" />
                </div>
                {t("nav.weather")}
              </NavLink>
              <NavLink to="/settings" isActive={isActive("/settings")}>
                <div className="bg-gray-100 p-1 rounded-md mr-2">
                  <SettingsIcon className="w-5 h-5 text-green-700" />
                </div>
                {t("nav.settings")}
              </NavLink>
            </nav>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Search Button (Mobile) */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-green-700 hover:bg-green-50"
              onClick={() => setIsSearchVisible(!isSearchVisible)}
            >
              <SearchIcon className="w-5 h-5" />
            </Button>

            {/* Cart Icon */}
            <Link to="/cart" className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="relative text-green-700 hover:bg-green-50 transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center h-4 w-4 rounded-full bg-red-500 text-xs font-bold text-white transform translate-x-1/2 -translate-y-1/2">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Language Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-green-700 hover:bg-green-50 flex items-center gap-1"
                >
                  <GlobeIcon className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-32">
                <DropdownMenuItem
                  onClick={() => changeLanguage("en")}
                  className="focus:bg-green-50 focus:text-green-700 cursor-pointer"
                >
                  English
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => changeLanguage("am")}
                  className="focus:bg-green-50 focus:text-green-700 cursor-pointer"
                >
                  አማርኛ
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Auth Buttons desktop */}
            <div className="hidden md:flex gap-2">
              <Link to="/sign-in">
                <Button
                  variant="outline"
                  className="border-green-600 text-green-700 hover:bg-green-50 hover:border-green-700 hover:text-green-800 transition-colors"
                >
                  {t("auth.signIn")}
                </Button>
              </Link>
              <Link to="/sign-up">
                <Button className="bg-yellow-400 hover:bg-yellow-500 text-green-900 shadow-lg hover:scale-105 transition-all">
                  {t("auth.signUp")}
                </Button>
              </Link>
            </div>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden md:flex text-green-700 hover:bg-green-50"
                >
                  <UserIcon className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-48">
                <DropdownMenuItem asChild className="py-2 focus:bg-green-50">
                  <Link to="/profile" className="w-full">
                    {t("profile.myProfile")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="py-2 focus:bg-green-50">
                  <Link to="/my-products" className="w-full">
                    {t("profile.myProducts")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="py-2 text-red-600 focus:bg-red-50 cursor-pointer">
                  {t("profile.logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile search */}
        {isSearchVisible && (
          <div className="absolute top-16 left-0 right-0 bg-white flex items-center p-3 shadow-md animate-slideDown md:hidden">
            <SearchIcon className="w-5 h-5 text-green-600 mr-2" />
            <input
              type="text"
              placeholder={t("header.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-green-50 rounded-full px-4 py-2 text-sm text-green-700 placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-200"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchVisible(false)}
              className="text-green-700 hover:bg-green-50 rounded-full ml-2"
            >
              <XIcon className="w-5 h-5" />
            </Button>
          </div>
        )}

        {/* Mobile menu */}
        {!onMenuClick && (
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-green-700 hover:bg-green-50 rounded-full"
              >
                <MenuIcon className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 p-6">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-3">
                  <img
                    src={agrilcon}
                    alt="AgroLink"
                    className="w-10 h-10 rounded-full border-2 border-white"
                  />
                  <span className="font-bold text-green-800 text-lg">አግሮLink</span>
                </SheetTitle>
              </SheetHeader>

              <nav className="mt-6 flex flex-col gap-3">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 text-green-800 hover:bg-green-50 rounded-lg font-medium"
                >
                  {t("nav.home")}
                </Link>
                <Link
                  to="/create-product"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 text-green-800 hover:bg-green-50 rounded-lg font-medium"
                >
                  {t("nav.createProduct")}
                </Link>
                <Link
                  to="/products"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 text-green-800 hover:bg-green-50 rounded-lg font-medium"
                >
                  {t("nav.marketplace")}
                </Link>
                <Link
                  to="/services"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 text-green-800 hover:bg-green-50 rounded-lg font-medium"
                >
                  {t("nav.services")}
                </Link>
                <Link
                  to="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 text-green-800 hover:bg-green-50 rounded-lg font-medium"
                >
                  {t("nav.aboutUs")}
                </Link>
              </nav>

              <div className="mt-8 flex flex-col gap-3">
                <Link
                  to="/sign-in"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 border border-green-700 rounded-lg text-green-700 text-center hover:bg-green-50 font-medium"
                >
                  {t("auth.signIn")}
                </Link>
                <Link
                  to="/sign-up"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 bg-yellow-400 rounded-lg text-green-900 text-center hover:bg-yellow-500 font-semibold shadow-lg"
                >
                  {t("auth.signUp")}
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </header>
  );
};

export default Header;
