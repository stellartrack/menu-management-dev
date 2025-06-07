import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const MainLayout = ({ sidebarOpen, setSidebarOpen }) => {

  return (
    <div className="d-flex" >
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen((prev) => !prev)} />
      <div className="flex-grow-1 d-flex flex-column min-vh-100">
        <Header sidebarOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen((prev) => !prev)} />
        <main className="p-4  flex-grow-1 overflow-auto">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
