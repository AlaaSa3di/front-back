import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  TablePagination,
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
} from "@mui/material";
import api from "../../../api/axiosConfig";
import { format } from "date-fns";

const ScreenBookingsTable = () => {
  const { screenId } = useParams();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Filter states
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPaymentStatus, setFilterPaymentStatus] = useState("all");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get(`/bookings?screenId=${screenId}`);
        setBookings(response.data.data?.bookings || []);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load bookings");
        setLoading(false);
      }
    };

    fetchBookings();
  }, [screenId]);

  const handleStatusChange = async (bookingId, newStatus) => {
    setActionLoading(true);
    try {
      await api.patch(`/bookings/${bookingId}`, { status: newStatus });
      setBookings(
        bookings.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: newStatus }
            : booking
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update booking status"
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handlePaymentStatusChange = async (bookingId, newPaymentStatus) => {
    setActionLoading(true);
    try {
      await api.patch(`/bookings/${bookingId}`, {
        paymentStatus: newPaymentStatus,
      });
      setBookings(
        bookings.map((booking) =>
          booking._id === bookingId
            ? { ...booking, paymentStatus: newPaymentStatus }
            : booking
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update payment status"
      );
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), "dd MMM yyyy");
  };

  // Filter bookings
  const filteredBookings = bookings.filter((booking) => {
    const statusMatch =
      filterStatus === "all" || booking.status === filterStatus;
    const paymentMatch =
      filterPaymentStatus === "all" ||
      booking.paymentStatus === filterPaymentStatus;
    return statusMatch && paymentMatch;
  });

  // Pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, color: "error.main", textAlign: "center" }}>
        <Typography>{error}</Typography>
        <Button
          variant="outlined"
          onClick={() => window.location.reload()}
          sx={{ mt: 2 }}
        >
          Try Again
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      {/* Filters */}
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="min-w-[180px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">Booking Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#FDB827] focus:border-[#FDB827]"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="min-w-[180px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
          <select
            value={filterPaymentStatus}
            onChange={(e) => setFilterPaymentStatus(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#FDB827] focus:border-[#FDB827]"
          >
            <option value="all">All Payments</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="unpaid">Unpaid</option>
          </select>
        </div>
      </div>
      {filteredBookings.length === 0 ? (
        <Box
          sx={{
            p: 3,
            textAlign: "center",
            bgcolor: "background.paper",
            borderRadius: 1,
          }}
        >
          <Typography>No bookings found for this screen</Typography>
        </Box>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Advertiser</TableCell>
                  <TableCell>Period</TableCell>
                  <TableCell>Days</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Payment</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBookings
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((booking) => (
                    <TableRow key={booking._id}>
                      <TableCell>
                        <Typography fontWeight="bold">
                          {booking.advertiser?.name || "N/A"}
                        </Typography>
                        {booking.advertiser?.company && (
                          <Typography variant="body2" color="text.secondary">
                            {booking.advertiser.company}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {formatDate(booking.startDate)} -{" "}
                        {formatDate(booking.endDate)}
                      </TableCell>
                      <TableCell>{booking.days}</TableCell>
                      <TableCell>{booking.totalPrice} JOD</TableCell>
                      <TableCell>
                        <Chip
                          label={
                            booking.status === "approved"
                              ? "Approved"
                              : booking.status === "pending"
                              ? "Pending"
                              : booking.status === "completed"
                              ? "Completed"
                              : "Rejected"
                          }
                          color={
                            booking.status === "approved"
                              ? "success"
                              : booking.status === "pending"
                              ? "warning"
                              : booking.status === "completed"
                              ? "info"
                              : "error"
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={
                            booking.paymentStatus === "paid"
                              ? "Paid"
                              : booking.paymentStatus === "pending"
                              ? "Pending"
                              : "Unpaid"
                          }
                          color={
                            booking.paymentStatus === "paid"
                              ? "success"
                              : booking.paymentStatus === "pending"
                              ? "warning"
                              : "error"
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          {booking.status !== "approved" && (
                            <Button
                              size="small"
                              variant="contained"
                              color="success"
                              onClick={() =>
                                handleStatusChange(booking._id, "approved")
                              }
                              disabled={actionLoading}
                            >
                              Approve
                            </Button>
                          )}
                          {booking.status !== "rejected" && (
                            <Button
                              size="small"
                              variant="contained"
                              color="error"
                              onClick={() =>
                                handleStatusChange(booking._id, "rejected")
                              }
                              disabled={actionLoading}
                            >
                              Reject
                            </Button>
                          )}
                          {booking.paymentStatus !== "paid" && (
                            <Button
                              size="small"
                              variant="outlined"
                              color="primary"
                              onClick={() =>
                                handlePaymentStatusChange(booking._id, "paid")
                              }
                              disabled={actionLoading}
                            >
                              Mark Paid
                            </Button>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredBookings.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
    </Box>
  );
};

export default ScreenBookingsTable;
