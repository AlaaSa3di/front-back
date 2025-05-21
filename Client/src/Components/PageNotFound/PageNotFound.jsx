import React from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function PageNotFound() {
  const handleReturnHome = () => {
    toast.info("Redirecting to homepage...");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center px-4 py-8">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      
      <div className="max-w-md w-full text-center space-y-8 bg-white p-6 sm:p-8 rounded-xl shadow-lg">
        <div className="space-y-4">
          <div className="relative">
            <h1 className="text-8xl sm:text-9xl font-extrabold text-[#FDB827]">404</h1>
            <svg className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 text-[#FDB827]/10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9.172 16.242a.994.994 0 01-.708-.294l-4.242-4.242a1 1 0 010-1.414l4.242-4.242a1 1 0 111.414 1.414L6.344 10l3.535 3.535a1 1 0 01-.708 1.707zm5.656 0a.994.994 0 01-.707-.293 1 1 0 010-1.414L17.657 10l-3.535-3.535a1 1 0 111.414-1.414l4.242 4.242a1 1 0 010 1.414l-4.242 4.242a.994.994 0 01-.708.293z" />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Page Not Found</h2>
          <p className="text-base sm:text-lg text-gray-600">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="h-0.5 w-full bg-gray-200 rounded-full" />
        
        <div className="space-y-5">
          <p className="text-gray-500">
            Let's get you back on track.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
            <Link to="/" className="w-full" onClick={handleReturnHome}>
              <button className="w-full py-3 rounded-md font-medium text-black transition-colors bg-[#FDB827] hover:bg-[#F26B0F]/90 flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Return Home
              </button>
            </Link>
            
            <Link to="/contact" className="w-full">
              <button className="w-full py-3 rounded-md font-medium text-[#FDB827] border border-[#FDB827] transition-colors hover:bg-[#FDB827]/5 flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Contact Support
              </button>
            </Link>
          </div>
        </div>
        
        <div className="pt-2">
          <p className="text-sm text-gray-400">
            Error code: 404_PAGE_NOT_FOUND
          </p>
        </div>
      </div>
    </div>
  );
}

export default PageNotFound;