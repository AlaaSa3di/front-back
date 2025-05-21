import { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import Pagination from '../common/Pagination';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Swal from 'sweetalert2';
import PaymentPopup from '../Payment/pay';

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState('grid');
  const [sortOption, setSortOption] = useState('default');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedScreen, setSelectedScreen] = useState(null);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [formData, setFormData] = useState({
    startDate: new Date(),
    endDate: new Date(Date.now() + 86400000),
    notes: '',
    design: null
  });
  const [priceDetails, setPriceDetails] = useState({
    dailyPrice: 0,
    days: 1,
    totalPrice: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const screensPerPage = 6;

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('q');

    const fetchResults = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/search/screens?q=${query}`);
        
        if (!response.data.success) {
          throw new Error(response.data.message || 'Search failed');
        }

        setResults(response.data.data);
        setTotalPages(Math.ceil(response.data.data.length / screensPerPage));
        setError(null);
      } catch (err) {
        console.error('Search error:', err);
        setError(err.message || 'Failed to fetch search results');
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    if (query?.trim()) {
      fetchResults();
    } else {
      setLoading(false);
      setResults([]);
    }
  }, [location.search]);

  useEffect(() => {
    if (formData.startDate && formData.endDate && selectedScreen) {
      const days = Math.ceil((formData.endDate - formData.startDate) / (1000 * 60 * 60 * 24)) + 1;
      const totalPrice = selectedScreen.price * days;
      setPriceDetails({
        dailyPrice: selectedScreen.price,
        days,
        totalPrice
      });
    }
  }, [formData.startDate, formData.endDate, selectedScreen]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  const handleBookNow = (screen) => {
    setSelectedScreen(screen);
    setPriceDetails({
      dailyPrice: screen.price,
      days: 1,
      totalPrice: screen.price
    });
    setShowBookingForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formDataToSend = new FormData();
    formDataToSend.append('screen', selectedScreen.id);
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

      setCurrentBooking(response.data.data.booking);
      setShowBookingForm(false);
      setShowPaymentPopup(true);
      
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Booking Failed',
        text: err.response?.data?.message || 'An error occurred during booking process',
        confirmButtonColor: '#FDB827'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = () => {
    Swal.fire({
      icon: 'success',
      title: 'Booking Successful!',
      text: 'Keep follow up on your profile to check approve your bookings.',
      confirmButtonColor: '#FDB827'
    }).then(() => {
      navigate('/');
    });
  };

  const paginatedResults = results.slice(
    (currentPage - 1) * screensPerPage,
    currentPage * screensPerPage
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Search Results</h1>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Sort by:</label>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="default">Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-1 border border-gray-200 rounded-md">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-l-md ${viewMode === 'grid' ? 'bg-[#FDB827]' : 'bg-gray-100'}`}
              title="Grid view"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-r-md ${viewMode === 'list' ? 'bg-[#FDB827]' : 'bg-gray-100'}`}
              title="List view"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <p>{error}</p>
          <Link to="/screens" className="text-black transition-colors bg-[#FDB827] hover:bg-[#F26B0F] mt-2 inline-block">
            Browse all screens
          </Link>
        </div>
      ) : results.length > 0 ? (
        <>
          <div className="mb-4 text-sm text-gray-500">
            Showing {paginatedResults.length} of {results.length} {results.length === 1 ? 'result' : 'results'} 
            (Page {currentPage} of {totalPages})
          </div>

          {viewMode === 'grid' ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {paginatedResults.map((screen) => (
                <ScreenCard 
                  key={screen.id} 
                  screen={screen} 
                  onBookNow={() => handleBookNow(screen)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {paginatedResults.map((screen) => (
                <ScreenListItem 
                  key={screen.id} 
                  screen={screen} 
                  onBookNow={() => handleBookNow(screen)}
                />
              ))}
            </div>
          )}

          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">No screens found</h2>
          <p className="text-gray-600 mb-6">
            Try different search terms or check out our available screens
          </p>
          <Link
            to="/screens"
            className="inline-block text-black transition-colors bg-[#FDB827] hover:bg-[#F26B0F] px-6 py-2 rounded  transition"
          >
            Browse All Screens
          </Link>
        </div>
      )}

      {/* Booking Form Modal */}
      {showBookingForm && selectedScreen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Book Screen</h2>
                <button 
                  onClick={() => setShowBookingForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-8 p-5 bg-gray-50 rounded-lg shadow-sm">
                <h3 className="font-semibold text-lg mb-3 text-gray-700">Screen Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="mb-2"><span className="font-medium">Title:</span> {selectedScreen.title || 'Not specified'}</p>
                    <p className="mb-2"><span className="font-medium">location:</span> {selectedScreen.location || 'Not specified'}</p>
                    <p className="mb-2"><span className="font-medium">Price:</span> {selectedScreen.price} JOD per day</p>
                  </div>
                  {selectedScreen.image && (
                    <div className="flex justify-center items-center">
                      <img 
                        src={selectedScreen.image} 
                        alt="Screen" 
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
                        <p className="text-xs text-gray-500">JPG, PNG, PDF, PSD, AI (Max: 5MB)</p>
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
          </div>
        </div>
      )}

      {/* Payment Popup */}
      {showPaymentPopup && currentBooking && (
        <PaymentPopup 
          booking={currentBooking}
          onClose={() => setShowPaymentPopup(false)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

const ScreenCard = ({ screen, onBookNow }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col transition-shadow hover:shadow-lg">
    {screen.image ? (
      <div className="h-48 w-full overflow-hidden relative">
        <img 
          src={screen.image} 
          alt={screen.title || 'Screen preview'}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 right-0 m-2">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Available
          </span>
        </div>
      </div>
    ) : (
      <div className="h-48 w-full bg-gray-200 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    )}

    <div className="p-4 flex-1 flex flex-col">
      <h2 className="text-lg font-semibold mb-1 line-clamp-1">
        {screen.title || 'Untitled Screen'}
      </h2>
      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
        {screen.location || 'No location available'}
      </p>
      
      <div className="space-y-2 mb-4 flex-1">
        <div className="flex items-center justify-between">
          <span className="text-gray-700 text-sm">Price:</span>
          <span className="font-bold text-[#F26B0F]">{screen.price || 'N/A'} JOD</span>
        </div>
      </div>
      
      <button
        onClick={() => onBookNow(screen)}
        className="w-full py-3 rounded-md font-medium text-black transition-colors bg-[#FDB827] hover:bg-[#F26B0F]/90"
      >
        Book Now
      </button>
    </div>
  </div>
);

const ScreenListItem = ({ screen, onBookNow }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row transition-shadow hover:shadow-lg">
    {screen.image ? (
      <div className="md:w-1/4 h-48 md:h-40 w-full overflow-hidden relative">
        <img 
          src={screen.image} 
          alt={screen.title || 'Screen preview'}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 right-0 m-2">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Available
          </span>
        </div>
      </div>
    ) : (
      <div className="md:w-1/4 h-48 md:h-40 w-full bg-gray-200 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    )}

    <div className="p-4 flex-1 flex flex-col md:flex-row md:justify-between">
      <div className="flex-1">
        <h2 className="text-lg font-semibold mb-1">
          {screen.title || 'Untitled Screen'}
        </h2>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
          {screen.location || 'No location available'}
        </p>
        
        <div className="grid grid-cols-2 gap-x-8 gap-y-1 mb-3">
          <div className="flex items-center">
            <span className="text-gray-700 text-sm w-24">Price:</span>
            <span className="font-bold text-[#F26B0F]">{screen.price || 'N/A'} JOD</span>
          </div>
        </div>
      </div>
      
      <div className="mt-4 md:mt-0 md:ml-6 md:flex md:items-center">
        <button
          onClick={() => onBookNow(screen)}
          className="w-full md:w-auto px-6 py-3 rounded-md font-medium text-black transition-colors bg-[#FDB827] hover:bg-[#F26B0F]/90"
        >
          Book Now
        </button>
      </div>
    </div>
  </div>
);

export default SearchResults;