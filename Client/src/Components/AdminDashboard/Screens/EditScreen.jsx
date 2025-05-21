import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../../api/axiosConfig';

const EditScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    dailyPrice: '',
    installedDimensions: {
      width: '',
      height: '',
      unit: 'm'
    },
    specifications: {
      technology: '',
      resolution: ''
    },
    status: 'active'
  });

  useEffect(() => {
    const fetchScreen = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/screens/${id}?populate=spaceDetails`);
        const screenData = response.data.data;
        setScreen(screenData);
        setFormData({
          dailyPrice: screenData.dailyPrice,
          installedDimensions: screenData.installedDimensions,
          specifications: screenData.specifications,
          status: screenData.status
        });
      } catch (error) {
        console.error('Error fetching screen:', error);
        toast.error('Failed to fetch screen data');
        navigate('/admin/screens');
      } finally {
        setLoading(false);
      }
    };

    fetchScreen();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  try {
    await api.put(`/screens/${id}`, formData);
    toast.success('Screen updated successfully');
    navigate(`/admin/screens/${id}`);
  } catch (error) {
    console.error('Error updating screen:', error);
    toast.error(error.response?.data?.message || 'Failed to update screen');
  } finally {
    setIsSubmitting(false);
  }
};
  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FDB827]"></div>
      </div>
    );
  }

  if (!screen) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold">Screen not found</h2>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <ToastContainer 
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div className="flex items-center mb-4 md:mb-0">
          <button 
            onClick={handleBack}
            className="mr-3 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Edit Screen</h1>
            <p className="text-gray-600">Space: {screen.spaceDetails?.title}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="col-span-1 md:col-span-2">
              <h2 className="text-lg font-semibold mb-4 pb-2 border-b">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Daily Price (JOD)</label>
                  <input
                    type="number"
                    name="dailyPrice"
                    value={formData.dailyPrice}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FDB827] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Screen Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FDB827] focus:border-transparent"
                    required
                  >
                    <option value="active">Active</option>
                    <option value="maintenance">Under Maintenance</option>
                    <option value="out_of_service">Out of Service</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Screen Dimensions */}
            <div className="col-span-1 md:col-span-2">
              <h2 className="text-lg font-semibold mb-4 pb-2 border-b">Screen Dimensions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Width</label>
                  <input
                    type="number"
                    name="installedDimensions.width"
                    value={formData.installedDimensions.width}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FDB827] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
                  <input
                    type="number"
                    name="installedDimensions.height"
                    value={formData.installedDimensions.height}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FDB827] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                  <select
                    name="installedDimensions.unit"
                    value={formData.installedDimensions.unit}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FDB827] focus:border-transparent"
                  >
                    <option value="m">Meters</option>
                    <option value="cm">Centimeters</option>
                    <option value="in">Inches</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="col-span-1 md:col-span-2">
              <h2 className="text-lg font-semibold mb-4 pb-2 border-b">Technical Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Technology</label>
                  <select
                    name="specifications.technology"
                    value={formData.specifications.technology}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FDB827] focus:border-transparent"
                  >
                    <option value="">Select Technology</option>
                    <option value="LED">LED</option>
                    <option value="LCD">LCD</option>
                    <option value="OLED">OLED</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Resolution</label>
                  <input
                    type="text"
                    name="specifications.resolution"
                    value={formData.specifications.resolution}
                    onChange={handleChange}
                    placeholder="e.g. 1920x1080"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FDB827] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col md:flex-row gap-4 md:justify-end">
            <button
              type="button"
              onClick={() => navigate(`/admin/screens/${id}`)}
              className="w-full md:w-auto px-6 py-3 rounded-md font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full md:w-auto px-6 py-3 rounded-md font-medium text-black transition-colors ${
                isSubmitting ? "bg-gray-400" : "bg-[#FDB827] hover:bg-[#F26B0F]/90"
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin mr-2 h-5 w-5 border-t-2 border-b-2 border-black rounded-full"></div>
                  Saving...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Save Changes
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditScreen;