// src/App.jsx
import React, { useEffect } from 'react';
import Router from './routes/index';
import { initializeAuthCleanup } from './utils/authCleanup';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  useEffect(() => {
    // Clean up any stale authentication data on app start
    initializeAuthCleanup();
  }, []);

  return (
    <React.Fragment>
      <Router />
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </React.Fragment>
  );
};

export default App;