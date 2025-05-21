import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../api/axiosConfig';

const AddScreen = () => {
  const { spaceId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [space, setSpace] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    dailyPrice: '',
    width: '',
    height: '',
    unit: 'm',
    resolution: '',
    brightness: '',
    technology: '',
    status: 'active'
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [alert, setAlert] = useState({
    show: false,
    message: '',
    type: 'success'
  });

  useEffect(() => {
    const fetchSpace = async () => {
      try {
        const response = await api.get(`/spaces/${spaceId}`);
        setSpace(response.data.data);
      } catch (error) {
        showAlert('Failed to fetch space details', 'error');
        navigate('/admin/spaces');
      } finally {
        setLoading(false);
      }
    };

    fetchSpace();
  }, [spaceId, navigate]);

  const showAlert = (message, type) => {
    setAlert({
      show: true,
      message,
      type
    });
    
    setTimeout(() => {
      setAlert(prev => ({ ...prev, show: false }));
    }, 6000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);

      // Prepare form data for screen creation
      const formDataToSend = new FormData();
      formDataToSend.append('spaceId', spaceId);
      formDataToSend.append('dailyPrice', formData.dailyPrice);
      formDataToSend.append('installedDimensions', 
        `{"width":${formData.width},"height":${formData.height},"unit":"${formData.unit}"}`
      );
      formDataToSend.append('specifications', 
        `{"resolution":"${formData.resolution}","brightness":"${formData.brightness}","technology":"${formData.technology}"}`
      );
      formDataToSend.append('status', formData.status);
      
      if (image) {
        formDataToSend.append('screenImage', image);
      }

      // Create the screen
      const response = await api.post('/screens', formDataToSend);

      // Update space status (with separate error handling)
      try {
        await api.patch(`/spaces/${spaceId}/update-screen-status`, {
          isScreenInstalled: true
        });
        console.log('Space status updated successfully');
      } catch (updateError) {
        console.warn('Space status update warning:', updateError.response?.data || updateError.message);
      }

      showAlert('Screen added successfully', 'success');
      navigate('/admin/spaces');
      
    } catch (error) {
      console.error('Error adding screen:', {
        message: error.message,
        response: error.response?.data,
        config: error.config
      });
      
      showAlert(error.response?.data?.message || 'Failed to add screen', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && !space) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 rounded-full border-4 border-[#FDB827] border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        Add Screen to Space: {space?.title}
      </h1>
      
      {alert.show && (
        <div className={`mb-6 p-4 rounded-md ${
          alert.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 
          'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {alert.message}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Space Information Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold border-b pb-2">Space Information</h2>
              <div className="space-y-2">
                <p><span className="font-medium">Location:</span> {space?.location?.city}, {space?.location?.zone}</p>
                <p><span className="font-medium">Dimensions:</span> {space?.dimensions?.width}m × {space?.dimensions?.height}m</p>
                <p><span className="font-medium">Status:</span> {space?.isApproved ? 'Approved' : 'Pending Approval'}</p>
              </div>
            </div>

            {/* Screen Image Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold border-b pb-2">Screen Image</h2>
              <div className="space-y-4">
                <div className="relative h-40 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Screen preview" className="object-contain h-full w-full" />
                  ) : (
                    <span className="text-gray-400">No image selected</span>
                  )}
                </div>
                
                <div>
                  <input
                    type="file"
                    id="screen-image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label 
                    htmlFor="screen-image" 
                    className="block w-full py-2.5 text-center rounded-md cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors"
                  >
                    {image ? 'Change Image' : 'Upload Screen Image'}
                  </label>
                  {image && (
                    <p className="mt-2 text-sm text-gray-500">
                      Selected: {image.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Daily Price */}
            <div className="md:col-span-1">
              <label className="block font-medium text-gray-700 mb-1">Daily Price (JOD)</label>
              <input
                type="number"
                name="dailyPrice"
                value={formData.dailyPrice}
                onChange={handleChange}
                required
                min="0"
                placeholder="Enter price"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FDB827]/50"
              />
            </div>

            {/* Screen Status */}
            <div className="md:col-span-1">
              <label className="block font-medium text-gray-700 mb-1">Screen Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FDB827]/50"
              >
                <option value="active">Active</option>
                <option value="maintenance">Maintenance</option>
                <option value="out_of_service">Out of Service</option>
              </select>
            </div>

            {/* Screen Dimensions Section */}
            <div className="md:col-span-2">
              <h2 className="text-lg font-semibold border-b pb-2 mb-4">Screen Dimensions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Width</label>
                  <input
                    type="number"
                    name="width"
                    value={formData.width}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="Enter width"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FDB827]/50"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Height</label>
                  <input
                    type="number"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="Enter height"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FDB827]/50"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Unit</label>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FDB827]/50"
                  >
                    <option value="m">Meters</option>
                    <option value="cm">Centimeters</option>
                    <option value="in">Inches</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Technical Specifications Section */}
            <div className="md:col-span-2">
              <h2 className="text-lg font-semibold border-b pb-2 mb-4">Technical Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Resolution</label>
                  <input
                    type="text"
                    name="resolution"
                    value={formData.resolution}
                    onChange={handleChange}
                    placeholder="e.g., 1920x1080"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FDB827]/50"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Brightness (nits)</label>
                  <input
                    type="text"
                    name="brightness"
                    value={formData.brightness}
                    onChange={handleChange}
                    placeholder="e.g., 1500"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FDB827]/50"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Display Technology</label>
                  <select
                    name="technology"
                    value={formData.technology}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FDB827]/50"
                  >
                    <option value="">Select Technology</option>
                    <option value="LED">LED</option>
                    <option value="LCD">LCD</option>
                    <option value="OLED">OLED</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="mt-8 flex flex-col-reverse md:flex-row gap-4 justify-end">
            <button
              type="button"
              onClick={() => navigate('/admin/spaces')}
              disabled={isSubmitting}
              className="w-full md:w-auto px-6 py-3 rounded-md font-medium text-gray-700 border border-gray-300 bg-white hover:bg-gray-50 transition-colors"
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
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 rounded-full border-2 border-black border-t-transparent animate-spin"></div>
                  <span>Adding...</span>
                </div>
              ) : (
                'Add Screen'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddScreen;