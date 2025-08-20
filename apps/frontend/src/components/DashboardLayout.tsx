import React, { useState } from "react";
import Header from "./Header";
import SidebarLayout from "./SidebarLayout";
import { XIcon } from "lucide-react";
import { Outlet } from "react-router-dom";

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Grid container */}
      <div className="grid grid-cols-[auto_1fr] grid-rows-[auto_1fr] h-screen">
        {/* Sidebar - fixed on all screens */}
        <aside
          className={`fixed md:relative w-64 bg-white border-r border-gray-200 z-50 md:z-auto transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 row-span-2 h-screen`}
        >
          <div className="md:hidden p-4 flex justify-end">
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-md hover:bg-gray-100"
            >
              <XIcon className="w-6 h-6 text-gray-500" />
            </button>
          </div>
          <SidebarLayout />
        </aside>

        {/* Header - fixed */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30 col-span-2 md:col-span-1">
          <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        </header>

        {/* Main content - scrollable */}
        <main className="col-start-2 row-start-2 overflow-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
