import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { useNavigate, useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Swal from 'sweetalert2';

const BookingForm = () => {
  const { screenId } = useParams();
  const navigate = useNavigate();
  const [screen, setScreen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    startDate: new Date(),
    endDate: new Date(Date.now() + 86400000), // Tomorrow's date
    notes: '',
    design: null
  });
  const [priceDetails, setPriceDetails] = useState({
    dailyPrice: 0,
    days: 1,
    totalPrice: 0
  });

  // Fetch screen data
  useEffect(() => {
    const fetchScreen = async () => {
      try {
        const response = await api.get(`/screens/${screenId}`);
        setScreen(response.data.data);
        setPriceDetails(prev => ({
          ...prev,
          dailyPrice: response.data.data.dailyPrice
        }));
        setLoading(false);
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load screen data',
          confirmButtonColor: '#FDB827'
        });
        setLoading(false);
      }
    };

    fetchScreen();
  }, [screenId]);

  // Calculate price when dates change
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const days = Math.ceil((formData.endDate - formData.startDate) / (1000 * 60 * 60 * 24)) + 1;
      const totalPrice = priceDetails.dailyPrice * days;
      setPriceDetails({
        dailyPrice: priceDetails.dailyPrice,
        days,
        totalPrice
      });
    }
  }, [formData.startDate, formData.endDate, priceDetails.dailyPrice]);

  const handleDateChange = (date, field) => {
    setFormData({
      ...formData,
      [field]: date
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      design: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formDataToSend = new FormData();
    formDataToSend.append('screen', screenId);
    formDataToSend.append('startDate', formData.startDate.toISOString().split('T')[0]);
    formDataToSend.append('endDate', formData.endDate.toISOString().split('T')[0]);
    formDataToSend.append('notes', formData.notes);
    if (formData.design) {
      formDataToSend.append('design', formData.design);
    }

    try {
      const response = await api.post('/bookings', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      Swal.fire({
        icon: 'success',
        title: 'Booking Successful!',
        text: 'Your screen has been booked successfully.',
        confirmButtonColor: '#FDB827'
      }).then(() => {
        navigate('/bookings', {
          state: { booking: response.data.data.booking }
        });
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Booking Failed',
        text: err.response?.data?.message || 'An error occurred during booking process',
        confirmButtonColor: '#FDB827'
      });
      setIsSubmitting(false);
    }
  };

  if (loading && !screen) return (
    <div className="flex justify-center items-center py-16">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FDB827]"></div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Screen Booking</h2>
      
      <div className="mb-8 p-5 bg-gray-50 rounded-lg shadow-sm">
        <h3 className="font-semibold text-lg mb-3 text-gray-700">Screen Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="mb-2"><span className="font-medium">Space Name:</span> {screen?.spaceDetails?.title || 'Not specified'}</p>
            <p className="mb-2"><span className="font-medium">Location:</span> {screen?.spaceDetails?.location?.city}, {screen?.spaceDetails?.location?.zone}</p>
            <p className="mb-2">
              <span className="font-medium">Screen Dimensions:</span> {' '}
              {screen?.installedDimensions?.width} {screen?.installedDimensions?.unit} × {' '}
              {screen?.installedDimensions?.height} {screen?.installedDimensions?.unit}
            </p>
            <p className="mb-2"><span className="font-medium">Daily Price:</span> {priceDetails.dailyPrice} JOD</p>
          </div>
          {screen?.screenImage?.url && (
            <div className="flex justify-center items-center">
              <img 
                src={screen.screenImage.url} 
                alt="Screen Image" 
                className="w-full h-48 object-cover rounded-md shadow-sm"
              />
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 font-medium text-gray-700">Start Date</label>
            <DatePicker
              selected={formData.startDate}
              onChange={(date) => handleDateChange(date, 'startDate')}
              minDate={new Date()}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FDB827] focus:border-transparent"
              dateFormat="yyyy-MM-dd"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium text-gray-700">End Date</label>
            <DatePicker
              selected={formData.endDate}
              onChange={(date) => handleDateChange(date, 'endDate')}
              minDate={formData.startDate}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FDB827] focus:border-transparent"
              dateFormat="yyyy-MM-dd"
            />
          </div>
        </div>

        <div className="bg-[#FDB827]/10 p-5 rounded-lg border border-[#FDB827]/20">
          <h3 className="font-semibold text-lg mb-3 text-gray-700">Price Details</h3>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-600">Number of Days: <span className="font-medium">{priceDetails.days}</span></p>
              <p className="text-gray-600">Daily Rate: <span className="font-medium">{priceDetails.dailyPrice} JOD</span></p>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">Total: {priceDetails.totalPrice} JOD</p>
            </div>
          </div>
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700">Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FDB827] focus:border-transparent"
            rows="3"
            placeholder="Add any specific requirements or notes for your booking"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700">Advertisement Design (Optional)</label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">JPG, PNG, PDF, PSD, AI (Max: 10MB)</p>
              </div>
              <input type="file" className="hidden" onChange={handleFileChange} accept="image/*,.pdf,.psd,.ai" />
            </label>
          </div>
          {formData.design && (
            <p className="mt-2 text-sm text-gray-600">Selected file: {formData.design.name}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 rounded-md font-medium text-black transition-colors ${
            isSubmitting ? "bg-gray-400" : "bg-[#FDB827] hover:bg-[#F26B0F]/90"
          }`}
        >
          {isSubmitting ? 'Processing...' : 'Confirm Booking'}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;