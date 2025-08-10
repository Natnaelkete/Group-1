import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import agriIcon from "@/assets/images/agriIcon.png";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GlobeIcon, UserIcon, MenuIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/70 border-b border-green-100 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group transition-all duration-300">
          <div className="p-1 bg-gradient-to-br from-green-600 to-green-800 rounded-full group-hover:rotate-12 transition-transform duration-500">
            <img
              src={agriIcon}
              alt="AgroLink"
              className="w-10 h-10 rounded-full border-2 border-white"
            />
          </div>
          <div>
            <span className="font-bold text-xl text-green-800 group-hover:text-green-600 transition-colors">
              አግሮLink
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:block">
          <NavigationMenu>
            <NavigationMenuList className="gap-1">
              {/* Home */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to="/"
                    className="px-4 py-2 text-green-800 hover:bg-green-50 rounded-lg transition-all flex items-center gap-1 font-medium"
                  >
                    {t("nav.home")}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* Create Product */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to="/create-product"
                    className="px-4 py-2 text-green-800 hover:bg-green-50 rounded-lg transition-all flex items-center gap-1 font-medium"
                  >
                    {t("nav.createProduct")}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* Marketplace - simple link now */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to="/products"
                    className="px-4 py-2 text-green-800 hover:bg-green-50 rounded-lg transition-all flex items-center gap-1 font-medium"
                  >
                    {t("nav.marketplace")}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* Services */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to="/services"
                    className="px-4 py-2 text-green-800 hover:bg-green-50 rounded-lg transition-all flex items-center gap-1 font-medium"
                  >
                    {t("nav.services")}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* About Us */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to="/about"
                    className="px-4 py-2 text-green-800 hover:bg-green-50 rounded-lg transition-all flex items-center gap-1 font-medium"
                  >
                    {t("nav.aboutUs")}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
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

          {/* Mobile menu button */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-green-700 hover:bg-green-50"
              >
                <MenuIcon className="w-6 h-6" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-64 p-6">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-3">
                  <img
                    src={agriIcon}
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
    </header>
  );
};

export default Header;
