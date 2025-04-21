import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { useLocation } from 'react-router-dom';
import { format } from 'date-fns';

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const location = useLocation();
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingsPerPage] = useState(5);
  
  // Filter states
  const [filterPaymentStatus, setFilterPaymentStatus] = useState('all');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get('/bookings');
        console.log('Bookings data:', response.data);
        setBookings(response.data.data.bookings);
        setLoading(false);
      } catch (err) {
        setError('Failed to load bookings');
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleStatusChange = async (bookingId, newStatus) => {
    setActionLoading(true);
    try {
      await api.patch(`/bookings/${bookingId}`, { status: newStatus });
      setBookings(bookings.map(booking => 
        booking._id === bookingId ? { ...booking, status: newStatus } : booking
      ));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update booking status');
    } finally {
      setActionLoading(false);
    }
  };

  const handlePaymentStatusChange = async (bookingId, newPaymentStatus) => {
    setActionLoading(true);
    try {
      await api.patch(`/bookings/${bookingId}`, { paymentStatus: newPaymentStatus });
      setBookings(bookings.map(booking => 
        booking._id === bookingId ? { ...booking, paymentStatus: newPaymentStatus } : booking
      ));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update payment status');
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd MMM yyyy');
  };

  // Filter bookings based on payment status
  const filteredBookings = bookings.filter(booking => {
    if (filterPaymentStatus === 'all') return true;
    return booking.paymentStatus === filterPaymentStatus;
  });

  // Get current bookings for pagination
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Calculate total pages
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-12 h-12 rounded-full border-4 border-[#FDB827] border-t-transparent animate-spin"></div>
    </div>
  );

  if (error) return (
    <div className="text-center py-8 text-red-500">
      {error}
      <button 
        onClick={() => window.location.reload()}
        className="ml-4 px-4 py-2 bg-[#FDB827] text-black font-medium rounded hover:bg-[#F26B0F]/90"
      >
        Try Again
      </button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      {location.state?.message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          {location.state.message}
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">My Bookings</h1>
        
        <div className="relative inline-block text-left">
          <select
            value={filterPaymentStatus}
            onChange={(e) => {
              setFilterPaymentStatus(e.target.value);
              setCurrentPage(1); // Reset to first page when filter changes
            }}
            className="block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#FDB827] focus:border-[#FDB827] rounded-md"
          >
            <option value="all">All Payments</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending Payment</option>
            <option value="unpaid">Unpaid</option>
          </select>
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <div className="text-gray-500 text-lg mb-4">No bookings found</div>
        </div>
      ) : (
        <>
          <div className="grid gap-6">
            {currentBookings.map(booking => (
              <div key={booking._id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                <div className="md:flex">
                  {booking.design?.url ? (
                    <div className="md:w-1/4 h-48 md:h-auto relative">
                      <img 
                        src={booking.design.url} 
                        alt="Advertisement Design" 
                        className="absolute w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="md:w-1/4 h-48 md:h-auto bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">No Image</span>
                    </div>
                  )}
                  
                  <div className="p-6 flex-1">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                      <div className="flex-1">
                        <h2 className="text-xl font-bold text-gray-800 mb-2">
                          {booking.screenDetails?.spaceDetails?.title || 'Advertisement Screen'}
                        </h2>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-gray-600">
                              <span className="font-medium">Location:</span> {booking.screenDetails?.spaceDetails?.location?.city || 'Not specified'} - 
                              {booking.screenDetails?.spaceDetails?.location?.zone || ''}
                            </p>
                            <p className="text-gray-600">
                              <span className="font-medium">Dimensions:</span> {booking.screenDetails?.installedDimensions?.width || 0} × 
                              {booking.screenDetails?.installedDimensions?.height || 0} {booking.screenDetails?.installedDimensions?.unit || ''}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">
                              <span className="font-medium">Technology:</span> {booking.screenDetails?.specifications?.technology || 'Not specified'}
                            </p>
                            <p className="text-gray-600">
                              <span className="font-medium">Daily Price:</span> {booking.screenDetails?.dailyPrice || 0} JOD
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            booking.status === 'approved' ? 'bg-green-100 text-green-800' : 
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            booking.status === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {booking.status === 'approved' ? 'Approved' : 
                             booking.status === 'pending' ? 'Pending' : 
                             booking.status === 'completed' ? 'Completed' : 'Cancelled'}
                          </span>
                          
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 
                            booking.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {booking.paymentStatus === 'paid' ? 'Paid' : 
                             booking.paymentStatus === 'pending' ? 'Payment Pending' : 'Unpaid'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-lg font-bold text-gray-800 mb-1">{booking.totalPrice} JOD</p>
                        <p className="text-gray-600">
                          {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                        </p>
                        <p className="text-gray-500 text-sm">{booking.days} days</p>
                      </div>
                    </div>
                    
                    {booking.notes && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <h3 className="font-medium text-gray-700 mb-2">Notes:</h3>
                        <p className="text-gray-600">{booking.notes}</p>
                      </div>
                    )}
                    
                    <div className="mt-6 flex flex-wrap gap-3 justify-end">
                      {booking.status !== 'approved' && (
                        <button
                          onClick={() => handleStatusChange(booking._id, 'approved')}
                          disabled={actionLoading}
                          className="w-32 py-3 rounded-md font-medium text-black transition-colors bg-[#FDB827] hover:bg-[#F26B0F]/90 disabled:bg-gray-400"
                        >
                          Approve
                        </button>
                      )}
                      
                      {booking.status !== 'rejected' && (
                        <button
                          onClick={() => handleStatusChange(booking._id, 'rejected')}
                          disabled={actionLoading}
                          className="w-32 py-3 rounded-md font-medium text-white transition-colors bg-red-500 hover:bg-red-600 disabled:bg-gray-400"
                        >
                          Reject
                        </button>
                      )}
                      
                      {booking.paymentStatus !== 'paid' && (
                        <button
                          onClick={() => handlePaymentStatusChange(booking._id, 'paid')}
                          disabled={actionLoading}
                          className="w-32 py-3 rounded-md font-medium text-black transition-colors bg-[#FDB827] hover:bg-[#F26B0F]/90 disabled:bg-gray-400"
                        >
                          Mark Paid
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => paginate(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded ${
                    currentPage === 1 
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  &lt;
                </button>
                
                {[...Array(totalPages).keys()].map(number => (
                  <button
                    key={number + 1}
                    onClick={() => paginate(number + 1)}
                    className={`px-3 py-1 rounded ${
                      currentPage === number + 1
                        ? 'bg-[#FDB827] text-black font-medium'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {number + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded ${
                    currentPage === totalPages
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  &gt;
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BookingsPage;