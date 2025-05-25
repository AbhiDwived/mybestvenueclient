import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const VendorLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
    
  );
};

export default VendorLayout;
