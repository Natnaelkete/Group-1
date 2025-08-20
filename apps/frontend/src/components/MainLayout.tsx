// src/components/MainLayout.tsx
import React from 'react';
import Header from './Header'; // Make sure this path is correct
import { Outlet } from 'react-router-dom';

const MainLayout: React.FC = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default MainLayout;