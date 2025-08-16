import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import agriIcon from "@/assets/images/agriIcon.png";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  GlobeIcon,
  BellIcon,
  ChevronDownIcon,
  UserIcon,
  MenuIcon,
  LogOutIcon,
  SearchIcon,
  XIcon,
} from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
}

const flags = {
  en: "https://flagcdn.com/us.svg",
  am: "https://flagcdn.com/et.svg",
};

const notificationsSample = [
  { id: 1, text: "New order received", time: "2h ago" },
  { id: 2, text: "Product stock low", time: "5h ago" },
  { id: 3, text: "Weather alert issued", time: "1d ago" },
];

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [isLoggedIn] = useState(false);
  const [notificationCount] = useState(notificationsSample.length);
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
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-green-700 hover:bg-green-50 rounded-full"
              onClick={onMenuClick}
            >
              <MenuIcon className="w-6 h-6" />
            </Button>
            <Link to="/" className="flex items-center gap-2 group mr-6 md:mr-8">
              <div className="p-1 bg-gradient-to-br from-green-500 to-green-700 rounded-full group-hover:rotate-6 transition-transform duration-500">
                <img
                  src={agriIcon}
                  alt="AgroLink Logo"
                  className="w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-white"
                />
              </div>
              <span className="font-bold text-xl text-green-800 hidden sm:block">
                አግሮLink
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-2 lg:gap-4">
             
               
            </nav>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* The search bar is now conditionally rendered */}
            {isLoggedIn && (
              <div className="hidden md:block relative w-48 lg:w-64">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" />
                <input
                  type="text"
                  placeholder={t("header.searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full bg-green-50 rounded-full focus:outline-none focus:ring-2 focus:ring-green-200 text-sm text-green-700 placeholder-green-400"
                />
              </div>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-green-700 hover:bg-green-50 rounded-full"
                >
                  <GlobeIcon className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {Object.entries(flags).map(([lng, flagUrl]) => (
                  <DropdownMenuItem
                    key={lng}
                    onClick={() => changeLanguage(lng)}
                    className="flex items-center gap-2 text-sm cursor-pointer"
                  >
                    <img
                      src={flagUrl}
                      alt={`${lng} flag`}
                      className="w-5 h-3 rounded-sm"
                    />
                    <span>{lng === "en" ? "English" : "አማርኛ"}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-green-700 hover:bg-green-50 rounded-full"
                >
                  <div className="bg-gray-100 p-1 rounded-md">
                    <BellIcon className="w-5 h-5 text-green-700" />
                  </div>
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full h-4 w-4 flex items-center justify-center border-2 border-white">
                      {Math.min(notificationCount, 9)}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72 p-0">
                <div className="px-4 py-3 border-b">
                  <h3 className="text-sm font-semibold text-green-800">
                    {t("header.notifications")}
                  </h3>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {notificationsSample.length === 0 ? (
                    <div className="px-4 py-6 text-center text-gray-500 text-sm">
                      {t("header.noNotifications")}
                    </div>
                  ) : (
                    notificationsSample.map((note) => (
                      <DropdownMenuItem
                        key={note.id}
                        className="px-4 py-3 border-b last:border-b-0 hover:bg-green-50 cursor-pointer"
                      >
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-800">
                            {note.text}
                          </span>
                          <span className="text-xs text-gray-400 mt-1">
                            {note.time}
                          </span>
                        </div>
                      </DropdownMenuItem>
                    ))
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {isLoggedIn && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchVisible(true)}
                className="text-green-700 hover:bg-green-50 rounded-full md:hidden"
              >
                <SearchIcon className="w-5 h-5" />
              </Button>
            )}
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="hidden md:flex items-center gap-2 hover:bg-green-50 px-3 py-2 rounded-full"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <UserIcon className="w-4 h-4 text-green-700" />
                    </div>
                    <span className="text-sm font-medium text-green-800">
                      User
                    </span>
                    <ChevronDownIcon className="w-4 h-4 text-green-700" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link
                      to="/profile"
                      className="w-full flex items-center gap-2 text-sm px-3 py-2 cursor-pointer"
                    >
                      <UserIcon className="w-4 h-4" />
                      {t("profile.myProfile")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600 focus:bg-red-50 text-sm px-3 py-2 flex items-center gap-2 cursor-pointer"
                    onClick={() => console.log("Logout")}
                  >
                    <LogOutIcon className="w-4 h-4" />
                    {t("profile.logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center gap-2 ml-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-green-600 text-green-700 hover:bg-green-50"
                  asChild
                >
                  <Link to="/sign-in">{t("auth.signIn")}</Link>
                </Button>
                <Button
                  size="sm"
                  className="bg-yellow-400 hover:bg-yellow-500 text-green-900 shadow-md"
                  asChild
                >
                  <Link to="/sign-up">{t("auth.signUp")}</Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {isSearchVisible && (
          <div className="absolute top-0 left-0 right-0 bg-white flex items-center p-3 shadow-md animate-slideDown md:hidden">
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
      </div>
    </header>
  );
};

export default Header;