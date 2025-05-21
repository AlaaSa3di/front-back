import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import logo from "../images/log.png";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    profilePicture: null,
  });
  const [previewImage, setPreviewImage] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState("cards"); // "cards" or "list"
  const [activeTab, setActiveTab] = useState("bookings"); // "bookings" or "spaces"
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const defaultProfile = logo;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user profile and bookings
        const profileResponse = await api.get("/users/profile");
        setUser(profileResponse.data.user);
        setBookings(profileResponse.data.bookings);
        setFormData({
          fullName: profileResponse.data.user.fullName,
          phoneNumber: profileResponse.data.user.phoneNumber || "",
        });

        // Fetch spaces
        const spacesResponse = await api.get("/spaces/my-spaces");
        setSpaces(spacesResponse.data.data);

        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profilePicture: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage("");
    setFormData((prev) => ({ ...prev, profilePicture: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("fullName", formData.fullName);
      formDataToSend.append("phoneNumber", formData.phoneNumber);

      if (formData.profilePicture) {
        formDataToSend.append("profilePicture", formData.profilePicture);
      }

      const response = await api.put("/users/profile", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUser(response.data.user);
      setEditMode(false);
      setPreviewImage("");
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
      console.error("Update error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    if (statusFilter === "all") return true;
    return booking.status.toLowerCase() === statusFilter;
  });

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FDB827]"></div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center py-8 text-red-500 font-medium">{error}</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        {/* User Profile Card */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="w-full md:w-1/4 flex justify-center">
              <div className="relative">
                <img
                  src={
                    previewImage ||
                    (user.profilePicture &&
                      `http://localhost:8000${user.profilePicture}`) ||
                    defaultProfile
                  }
                  alt="Profile"
                  className="w-40 h-40 rounded-full object-cover border-4 border-[#FDB827]"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultProfile;
                  }}
                />
                {editMode && (
                  <div className="mt-4 text-center space-y-2">
                    <label className="cursor-pointer text-[#FDB827] hover:text-[#F26B0F] block font-medium">
                      Change Photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    {previewImage && (
                      <button
                        onClick={handleRemoveImage}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Remove selected image
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="w-full md:w-3/4 text-center md:text-left">
              {editMode ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FDB827]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FDB827]"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-3 rounded-md font-medium text-black transition-colors ${
                        isSubmitting
                          ? "bg-gray-400"
                          : "bg-[#FDB827] hover:bg-[#F26B0F]/90"
                      }`}
                    >
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditMode(false);
                        setPreviewImage("");
                        setFormData({
                          fullName: user.fullName,
                          phoneNumber: user.phoneNumber || "",
                          profilePicture: null,
                        });
                      }}
                      className="w-full py-3 bg-gray-200 text-gray-800 rounded-md font-medium hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <h2 className="text-3xl font-bold mb-2">{user.fullName}</h2>
                  <div className="flex flex-col gap-2 text-gray-600 mb-6">
                    <p className="flex items-center justify-center md:justify-start gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-[#FDB827]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      {user.email}
                    </p>
                    {user.phoneNumber && (
                      <p className="flex items-center justify-center md:justify-start gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-[#FDB827]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        {user.phoneNumber}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setEditMode(true)}
                    className={`py-3 px-6 rounded-md font-medium text-black transition-colors bg-[#FDB827] hover:bg-[#F26B0F]/90`}
                  >
                    Edit Profile
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Tabs for Bookings and Spaces */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="border-b border-gray-200 mb-6">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab("bookings")}
                className={`py-4 px-1 font-medium text-lg border-b-2 transition-colors ${
                  activeTab === "bookings"
                    ? "border-[#FDB827] text-[#FDB827]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                My Bookings
              </button>
              <button
                onClick={() => setActiveTab("spaces")}
                className={`py-4 px-1 font-medium text-lg border-b-2 transition-colors ${
                  activeTab === "spaces"
                    ? "border-[#FDB827] text-[#FDB827]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                My Spaces
              </button>
            </div>
          </div>

          {activeTab === "bookings" ? (
            <>
              <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <h3 className="text-2xl font-bold">My Bookings</h3>

                <div className="flex flex-col md:flex-row gap-4 mt-4 md:mt-0">
                  {/* View Mode Toggle */}
                  <div className="flex rounded-md overflow-hidden border border-gray-300">
                    <button
                      onClick={() => setViewMode("cards")}
                      className={`px-4 py-2 text-sm ${
                        viewMode === "cards"
                          ? "bg-[#FDB827] text-black"
                          : "bg-white text-gray-700"
                      }`}
                    >
                      Cards
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`px-4 py-2 text-sm ${
                        viewMode === "list"
                          ? "bg-[#FDB827] text-black"
                          : "bg-white text-gray-700"
                      }`}
                    >
                      List
                    </button>
                  </div>

                  {/* Status Filter */}
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border rounded-md bg-white text-gray-700 text-sm"
                  >
                    <option value="all">All Bookings</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {filteredBookings.length === 0 ? (
                <div className="text-center py-12">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 mx-auto text-gray-300 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <p className="text-gray-500 text-lg">No bookings found.</p>
                </div>
              ) : viewMode === "cards" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBookings.map((booking) => (
                    <div
                      key={booking._id}
                      className="border rounded-lg overflow-hidden h-full flex flex-col"
                    >
                      <div
                        className={`p-1 text-center text-sm font-medium text-white ${
                          booking.status.toLowerCase() === "approved"
                            ? "bg-green-500"
                            : booking.status.toLowerCase() === "pending"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                      >
                        {booking.status}
                      </div>

                      {/* Add Design Image */}
                      {booking.design && booking.design.url && (
                        <div className="h-48 bg-gray-100 overflow-hidden">
                          <img
                            src={booking.design.url}
                            alt="Design"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = logo;
                            }}
                          />
                        </div>
                      )}

                      <div className="p-6 flex-grow">
                        <h4 className="font-bold text-lg mb-2 line-clamp-1">
                          {booking.screenDetails?.spaceDetails?.title ||
                            "Screen"}
                        </h4>
                        <div className="space-y-2 text-gray-600 text-sm">
                          <p className="flex items-center gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-[#FDB827]"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            <span>
                              {new Date(booking.startDate).toLocaleDateString()}{" "}
                              - {new Date(booking.endDate).toLocaleDateString()}
                            </span>
                          </p>
                          <p className="flex items-center gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-[#FDB827]"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span>{booking.totalPrice} JOD</span>
                          </p>
                          {booking.paymentStatus && (
                            <p className="flex items-center gap-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-[#FDB827]"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <span
                                className={`${
                                  booking.paymentStatus === "paid"
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                Payment:{" "}
                                {booking.paymentStatus.charAt(0).toUpperCase() +
                                  booking.paymentStatus.slice(1)}
                              </span>
                            </p>
                          )}
                          {booking.notes && (
                            <p className="mt-2 italic text-gray-500">
                              "{booking.notes}"
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Design
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Screen
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Dates
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Payment
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredBookings.map((booking) => (
                        <tr key={booking._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {booking.design && booking.design.url ? (
                              <div className="w-16 h-16 rounded overflow-hidden">
                                <img
                                  src={booking.design.url}
                                  alt="Design"
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = logo;
                                  }}
                                />
                              </div>
                            ) : (
                              <span className="text-gray-400">No image</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">
                              {booking.screenDetails?.spaceDetails?.title ||
                                "Screen"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(booking.startDate).toLocaleDateString()} -{" "}
                            {new Date(booking.endDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {booking.totalPrice} JOD
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                booking.status.toLowerCase() === "approved"
                                  ? "bg-green-100 text-green-800"
                                  : booking.status.toLowerCase() === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                booking.paymentStatus === "paid"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {booking.paymentStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold">My Spaces</h3>
                <button
                  onClick={() => navigate("/space")}
                  className="px-4 py-2 bg-[#FDB827] text-black rounded-md font-medium hover:bg-[#F26B0F]/90 transition-colors"
                >
                  Add New Space
                </button>
              </div>

              {spaces.length === 0 ? (
                <div className="text-center py-12">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 mx-auto text-gray-300 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <p className="text-gray-500 text-lg">
                    No spaces found. Create your first space!
                    <button
                  onClick={() => navigate("/space")}
                  className="px-4 py-2 bg-[#FDB827] text-black rounded-md font-medium hover:bg-[#F26B0F]/90 transition-colors"
                >
                  Add Space
                </button>
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {spaces.map((space) => (
                    <div
                      key={space._id}
                      className="border rounded-lg overflow-hidden h-full flex flex-col"
                    >
                      {/* Space Images */}
                      <div className="h-48 bg-gray-100 overflow-hidden">
                        {space.images && space.images.length > 0 ? (
                          <img
                            src={space.images[0].url}
                            alt={space.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = logo;
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-12 w-12"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>

                      <div className="p-4 flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-lg">{space.title}</h3>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              space.isApproved
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {space.isApproved ? "Approved" : "Pending Approval"}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {space.description}
                        </p>
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          {space.location?.city}, {space.location?.zone}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 6h12M6 12h12M6 18h12M3 6v12M21 6v12"
                            />
                          </svg>
                          {space.dimensions?.width}m x{" "}
                          {space.dimensions?.height}m
                        </div>{" "}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
