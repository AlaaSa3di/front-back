import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../../api/axiosConfig';
import ScreenBookingsTable from './ScreenBookingsTable';

const ScreenDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [screen, setScreen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    fetchScreen();
  }, [id]);

  const fetchScreen = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/screens/${id}?populate=spaceDetails,ownerDetails`);
      setScreen(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch screen details');
      toast.error('Failed to load screen details');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!screen) return;

    const originalStatus = screen.status;

    try {
      setScreen(prev => ({ ...prev, status: newStatus }));

      const response = await api.put(`/screens/${id}/status`, {
        status: newStatus
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status !== 200 && response.status !== 201) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      toast.success('Status updated successfully');
    } catch (err) {
      setScreen(prev => ({ ...prev, status: originalStatus }));
      
      let errorMessage = 'Failed to update screen status';
      
      if (err.response) {
        errorMessage = err.response.data?.message || 
                      err.response.data?.error || 
                      `Server error: ${err.response.status}`;
      } else if (err.request) {
        errorMessage = 'Network error - No response from server';
      }

      toast.error(errorMessage);
      console.error('Error details:', {
        error: err,
        request: err.config,
        response: err.response?.data
      });
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'out_of_service': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'active': return 'Active';
      case 'maintenance': return 'Under Maintenance';
      case 'out_of_service': return 'Out of Service';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#FDB827]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6 text-red-600">
        <p className="text-lg">{error}</p>
        <button 
          onClick={fetchScreen}
          className="mt-4 flex items-center gap-2 bg-[#FDB827] hover:bg-[#F26B0F]/90 text-black py-2 px-4 rounded-md font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          Retry
        </button>
      </div>
    );
  }

  if (!screen) {
    return <p className="text-center text-gray-700 text-lg py-10">Screen not found</p>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer position="top-center" autoClose={3000} />
      
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-3 py-3 sm:px-4 sm:py-4 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button 
                onClick={() => navigate(-1)} 
                className="mr-2 sm:mr-4 p-1 sm:p-2 rounded-full hover:bg-gray-100"
                aria-label="Go back"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Screen Details</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={fetchScreen}
                className="p-1 sm:p-2 rounded-full hover:bg-gray-100"
                aria-label="Refresh"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-3 py-4 sm:px-4 sm:py-5 lg:px-8 lg:py-6">
        {/* Tablet Layout - Screen Image First */}
        <div className="block md:block lg:hidden mb-6">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-base font-medium text-gray-900">Screen Image</h3>
            </div>
            <div className="p-4">
              {screen.screenImage?.url ? (
                <img
                  src={screen.screenImage.url}
                  alt={screen.spaceDetails?.title}
                  className="w-full h-auto rounded-lg"
                />
              ) : (
                <div className="bg-gray-100 rounded-lg h-40 flex items-center justify-center">
                  <p className="text-gray-500 text-sm">No image available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Side - Screen Details (Green Box) */}
          <div className="lg:w-2/3">
            <div className="bg-white shadow rounded-lg overflow-hidden h-full">
              <div className="px-4 py-4 sm:px-6 sm:py-5 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-800 truncate">{screen.spaceDetails?.title}</h2>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(screen.status)}`}>
                    {getStatusText(screen.status)}
                  </span>
                </div>
              </div>
              
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2 sm:mb-3">Screen Information</h3>
                    <dl className="space-y-2">
                      <div>
                        <dt className="text-xs sm:text-sm font-medium text-gray-500">ID</dt>
                        <dd className="mt-1 text-xs sm:text-sm text-gray-900 break-all">{screen._id}</dd>
                      </div>
                      <div>
                        <dt className="text-xs sm:text-sm font-medium text-gray-500">Daily Price</dt>
                        <dd className="mt-1 text-xs sm:text-sm text-gray-900">{screen.dailyPrice?.toLocaleString()} JOD</dd>
                      </div>
                      <div>
                        <dt className="text-xs sm:text-sm font-medium text-gray-500">Dimensions</dt>
                        <dd className="mt-1 text-xs sm:text-sm text-gray-900">
                          {screen.installedDimensions?.width} × {screen.installedDimensions?.height} {screen.installedDimensions?.unit}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs sm:text-sm font-medium text-gray-500">Technology</dt>
                        <dd className="mt-1 text-xs sm:text-sm text-gray-900">{screen.specifications?.technology || 'Not specified'}</dd>
                      </div>
                      <div>
                        <dt className="text-xs sm:text-sm font-medium text-gray-500">Resolution</dt>
                        <dd className="mt-1 text-xs sm:text-sm text-gray-900">{screen.specifications?.resolution || 'Not specified'}</dd>
                      </div>
                    </dl>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2 sm:mb-3">Space Information</h3>
                    <dl className="space-y-2">
                      <div>
                        <dt className="text-xs sm:text-sm font-medium text-gray-500">Location</dt>
                        <dd className="mt-1 text-xs sm:text-sm text-gray-900">
                          {screen.spaceDetails?.location?.city} - {screen.spaceDetails?.location?.zone}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs sm:text-sm font-medium text-gray-500">Address</dt>
                        <dd className="mt-1 text-xs sm:text-sm text-gray-900">{screen.spaceDetails?.location?.street}</dd>
                      </div>
                      <div>
                        <dt className="text-xs sm:text-sm font-medium text-gray-500">Space Dimensions</dt>
                        <dd className="mt-1 text-xs sm:text-sm text-gray-900">
                          {screen.spaceDetails?.dimensions?.width} × {screen.spaceDetails?.dimensions?.height} m
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div className="sm:col-span-2 md:col-span-1">
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2 sm:mb-3">Owner</h3>
                    <dl className="space-y-2">
                      <div>
                        <dt className="text-xs sm:text-sm font-medium text-gray-500">Name</dt>
                        <dd className="mt-1 text-xs sm:text-sm text-gray-900">{screen.ownerDetails?.fullName}</dd>
                      </div>
                      <div>
                        <dt className="text-xs sm:text-sm font-medium text-gray-500">Email</dt>
                        <dd className="mt-1 text-xs sm:text-sm text-gray-900 break-all">{screen.ownerDetails?.email}</dd>
                      </div>
                      {screen.ownerDetails?.phoneNumber && (
                        <div>
                          <dt className="text-xs sm:text-sm font-medium text-gray-500">Phone</dt>
                          <dd className="mt-1 text-xs sm:text-sm text-gray-900">{screen.ownerDetails?.phoneNumber}</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Image and Status (Red Boxes) */}
          <div className="lg:w-1/3 flex flex-col gap-6">
            {/* Screen Image */}
            <div className="bg-white shadow rounded-lg overflow-hidden flex-1">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Screen Image</h3>
              </div>
              <div className="p-6 h-full flex items-center justify-center">
                {screen.screenImage?.url ? (
                  <img
                    src={screen.screenImage.url}
                    alt={screen.spaceDetails?.title}
                    className="w-full h-auto rounded-lg max-h-64 object-contain"
                  />
                ) : (
                  <div className="bg-gray-100 rounded-lg w-full h-48 flex items-center justify-center">
                    <p className="text-gray-500">No image available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Status Change */}
            <div className="bg-white shadow rounded-lg overflow-hidden flex-1">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Change Screen Status</h3>
              </div>
              <div className="p-6 h-full flex flex-col justify-between">
                <div className="space-y-4">
                  <button
                    onClick={() => handleStatusChange('active')}
                    className={`w-full py-3 rounded-md font-medium text-black transition-colors ${
                      screen.status === 'active' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-[#FDB827] hover:bg-[#F26B0F]/90'
                    }`}
                  >
                    Set as Active
                  </button>
                  <button
                    onClick={() => handleStatusChange('maintenance')}
                    className={`w-full py-3 rounded-md font-medium text-black transition-colors ${
                      screen.status === 'maintenance' 
                        ? 'bg-yellow-500 text-white' 
                        : 'bg-[#FDB827] hover:bg-[#F26B0F]/90'
                    }`}
                  >
                    Set as Under Maintenance
                  </button>
                  <button
                    onClick={() => handleStatusChange('out_of_service')}
                    className={`w-full py-3 rounded-md font-medium text-black transition-colors ${
                      screen.status === 'out_of_service' 
                        ? 'bg-red-500 text-white' 
                        : 'bg-[#FDB827] hover:bg-[#F26B0F]/90'
                    }`}
                  >
                    Set as Out of Service
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Status Change - Mobile Only */}
        <div className="block lg:hidden mt-4">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-base font-medium text-gray-900">Change Screen Status</h3>
            </div>
            <div className="p-4 space-y-3">
              <button
                onClick={() => handleStatusChange('active')}
                className={`w-full py-2 rounded-md font-medium text-sm text-black transition-colors ${
                  screen.status === 'active' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-[#FDB827] hover:bg-[#F26B0F]/90'
                }`}
              >
                Set as Active
              </button>
              <button
                onClick={() => handleStatusChange('maintenance')}
                className={`w-full py-2 rounded-md font-medium text-sm text-black transition-colors ${
                  screen.status === 'maintenance' 
                    ? 'bg-yellow-500 text-white' 
                    : 'bg-[#FDB827] hover:bg-[#F26B0F]/90'
                }`}
              >
                Set as Under Maintenance
              </button>
              <button
                onClick={() => handleStatusChange('out_of_service')}
                className={`w-full py-2 rounded-md font-medium text-sm text-black transition-colors ${
                  screen.status === 'out_of_service' 
                    ? 'bg-red-500 text-white' 
                    : 'bg-[#FDB827] hover:bg-[#F26B0F]/90'
                }`}
              >
                Set as Out of Service
              </button>
            </div>
          </div>
        </div>

        {/* Bookings Tab - Full Width */}
        <div className="mt-6">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex">
                <button
                  className={`
                    w-1/4 py-3 sm:py-4 px-1 text-center border-b-2 font-medium text-sm
                    ${activeTab === 0 
                      ? 'border-[#FDB827] text-[#FDB827]' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                  `}
                  onClick={() => setActiveTab(0)}
                >
                  Bookings
                </button>
              </nav>
            </div>
            
            <div className="p-0">
              {activeTab === 0 && (
                <div className="overflow-x-auto">
                  <ScreenBookingsTable screenId={id} fullWidth={true} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScreenDetails;