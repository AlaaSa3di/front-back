import React, { useState, useEffect } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import api from '../../api/axiosConfig';

const PaymentModal = ({ booking, onClose, onPaymentSuccess }) => {
  const [orderID, setOrderID] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const createOrder = async () => {
    try {
      setLoading(true);
      const response = await api.post(`/payments/${booking._id}/paypal`);
      setOrderID(response.data.data.orderID);
      return response.data.data.orderID;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create payment order');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const onApprove = async (data, actions) => {
    try {
      setLoading(true);
      await api.post('/payments/capture', { orderID: data.orderID });
      onPaymentSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Payment capture failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-xl font-bold mb-4">Complete Payment</h3>
        
        <div className="mb-6 space-y-2">
          <p className="font-semibold">Booking ID: {booking._id}</p>
          <p>Amount: {booking.totalPrice} SAR (≈{(booking.totalPrice / 3.75).toFixed(2)} USD)</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <PayPalScriptProvider 
          options={{ 
            "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID,
            currency: "USD"
          }}
        >
          <PayPalButtons
            style={{ layout: "vertical" }}
            createOrder={createOrder}
            onApprove={onApprove}
            onError={(err) => {
              console.error("PayPal error:", err);
              setError("An error occurred with PayPal");
            }}
            disabled={loading}
          />
        </PayPalScriptProvider>

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;