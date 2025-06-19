import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingContact from '../components/FloatingContact';

const MainLayout = () => {
  return (
    <div>
      <Navbar />
        <Outlet />
         <Footer/>
         <FloatingContact/>
              
    </div>
  );
};

export default MainLayout;
