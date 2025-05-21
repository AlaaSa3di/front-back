import React from 'react';
import { PayPalButtons } from "@paypal/react-paypal-js";
import api from '../../api/axiosConfig';
import Swal from 'sweetalert2';

const PaymentPopup = ({ booking, onClose, onPaymentSuccess }) => {
  const createOrder = async () => {
    try {
      const response = await api.post(`/bookings/${booking._id}/create-payment`);
      return response.data.data.orderID;
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Payment Error',
        text: 'Failed to create payment order',
        confirmButtonColor: '#FDB827'
      });
      throw err;
    }
  };

  const onApprove = async (data, actions) => {
    try {
      await api.post(`/bookings/${booking._id}/capture-payment`, {
        orderID: data.orderID
      });
      onPaymentSuccess();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Payment Error',
        text: err.response?.data?.message || 'Failed to process payment',
        confirmButtonColor: '#FDB827'
      });
      throw err;
    }
  };

  const onError = (err) => {
    Swal.fire({
      icon: 'error',
      title: 'Payment Error',
      text: err.message || 'An error occurred during payment',
      confirmButtonColor: '#FDB827'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Complete Payment</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Booking Summary</h3>
            <div className="grid grid-cols-2 gap-2">
              <p className="text-gray-600">Booking ID:</p>
              <p>{booking._id}</p>
              
              <p className="text-gray-600">Total Amount:</p>
              <p>{booking.totalPrice} JOD</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <PayPalButtons 
              style={{ layout: "vertical" }}
              createOrder={createOrder}
              onApprove={onApprove}
              onError={onError}
            />
          </div>

          <div className="mt-4 p-3 bg-yellow-50 rounded text-sm text-yellow-800">
            <p className="font-semibold">Important Note:</p>
            <p>The amount will be held temporarily and only processed after final approval.</p>
            <p>If the booking is rejected, the amount will be refunded within 3-5 business days.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPopup;