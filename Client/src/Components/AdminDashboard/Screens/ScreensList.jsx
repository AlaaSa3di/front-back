import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Plus, RefreshCw, Sliders, Eye, Edit } from "lucide-react";
import api from "../../../api/axiosConfig";
import Pagination from "../../common/Pagination";

const ScreenStatusBadge = ({ status }) => {
  const getBadgeStyles = () => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-300";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "out_of_service":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "active":
        return "Active";
      case "maintenance":
        return "Maintenance";
      case "out_of_service":
        return "Out of Service";
      default:
        return "Unknown";
    }
  };

  return (
    <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getBadgeStyles()}`}>
      {getStatusText()}
    </span>
  );
};

const ScreensList = () => {
  const [screens, setScreens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(8);
  const [stats, setStats] = useState({
    totalScreens: 0,
    activeScreens: 0,
    inMaintenance: 0,
    outOfService: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get("/screens?populate=spaceDetails,ownerDetails");
      const screensData = response.data.data;
      setScreens(screensData);
      updateStatistics(screensData);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to fetch screens");
      console.error("Error fetching screens:", err);
      toast.error("Failed to load screen data");
    } finally {
      setLoading(false);
    }
  };

  const updateStatistics = (screensData) => {
    const totalScreens = screensData.length;
    const activeScreens = screensData.filter((s) => s.status === "active").length;
    const inMaintenance = screensData.filter((s) => s.status === "maintenance").length;
    const outOfService = screensData.filter((s) => s.status === "out_of_service").length;

    setStats({
      totalScreens,
      activeScreens,
      inMaintenance,
      outOfService,
    });
  };

  const handleStatusChange = async (screenId, newStatus) => {
    try {
      const updatedScreens = screens.map((screen) =>
        screen._id === screenId ? { ...screen, status: newStatus } : screen
      );
      setScreens(updatedScreens);

      const response = await api.put(`/screens/${screenId}/status`, {
        status: newStatus,
      });

      if (!response.data.success) {
        throw new Error("Failed to update status");
      }

      toast.success("Screen status updated successfully");
      updateStatistics(updatedScreens);
    } catch (err) {
      setScreens([...screens]);
      toast.error(err.response?.data?.message || "Failed to update screen status");
      console.error("Error updating screen status:", err);
    }
  };

  const filteredScreens = screens.filter((screen) => {
    const matchesSearch =
      screen.spaceDetails?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      screen.spaceDetails?.location?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      screen._id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || screen.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredScreens.length / rowsPerPage);
  const paginatedScreens = filteredScreens.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FDB827]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          className="bg-[#FDB827] hover:bg-[#F26B0F]/90 px-4 py-2 rounded-md flex items-center justify-center gap-2 mx-auto"
          onClick={fetchData}
        >
          <RefreshCw size={18} />
          <span>Retry</span>
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <ToastContainer position="top-center" autoClose={3000} />

      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Screen Management</h1>
        <button
          className="bg-[#FDB827] hover:bg-[#F26B0F]/90 text-black px-4 py-2 rounded-md flex items-center gap-2 transition-colors w-full sm:w-auto"
          onClick={() => navigate("/admin/spaces")}
        >
          <Plus size={18} />
          <span>Add New Screen</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="text-gray-500 mb-1">Total Screens</div>
          <div className="text-3xl font-bold">{stats.totalScreens}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="text-gray-500 mb-1">Active</div>
          <div className="text-3xl font-bold text-green-600">{stats.activeScreens}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="text-gray-500 mb-1">In Maintenance</div>
          <div className="text-3xl font-bold text-yellow-600">{stats.inMaintenance}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="text-gray-500 mb-1">Out of Service</div>
          <div className="text-3xl font-bold text-red-600">{stats.outOfService}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <div className="flex flex-col md:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search screens..."
              className="border border-gray-300 w-full px-4 py-2 rounded-md pl-9"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
            />
            <Sliders size={18} className="absolute left-3 top-2.5 text-gray-400" />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="border border-gray-300 px-3 py-2 rounded-md bg-white w-full sm:w-auto"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="maintenance">Maintenance</option>
            <option value="out_of_service">Out of Service</option>
          </select>
        </div>

        <button
          className="flex items-center gap-2 border border-gray-300 px-3 py-2 rounded-md hover:bg-gray-50 w-full sm:w-auto justify-center"
          onClick={fetchData}
        >
          <RefreshCw size={18} />
          <span className="hidden md:inline">Refresh</span>
        </button>
      </div>

      {/* Screens Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Space</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Daily Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedScreens.length > 0 ? (
                paginatedScreens.map((screen) => (
                  <tr key={screen._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium">{screen.spaceDetails?.title}</div>
                      <div className="text-sm text-gray-500">{screen.spaceDetails?.spaceType}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>{screen.spaceDetails?.location?.city}</div>
                      <div className="text-sm text-gray-500">{screen.spaceDetails?.location?.zone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={screen.status}
                        onChange={(e) => handleStatusChange(screen._id, e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                      >
                        <option value="active">Active</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="out_of_service">Out of Service</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {screen.dailyPrice?.toLocaleString()} JOD
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                      <button
                        onClick={() => navigate(`/admin/screens/${screen._id}`)}
                        className="text-gray-600 hover:text-blue-500"
                        title="View"
                      >
                        <Eye size={20} />
                      </button>
                      <button
                        onClick={() => navigate(`/admin/screens/${screen._id}/edit`)}
                        className="text-gray-600 hover:text-green-500"
                        title="Edit"
                      >
                        <Edit size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                    No screens match your search criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="border-t border-gray-200 px-4 py-3">
          <Pagination 
            currentPage={page} 
            totalPages={totalPages} 
            onPageChange={setPage} 
          />
        </div>
      </div>

      {/* Mobile View for Screens */}
      <div className="md:hidden mt-6 space-y-4">
        {paginatedScreens.length > 0 ? (
          paginatedScreens.map((screen) => (
            <div key={screen._id} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-medium">{screen.spaceDetails?.title}</h3>
                  <p className="text-sm text-gray-500">{screen.spaceDetails?.spaceType}</p>
                </div>
                <ScreenStatusBadge status={screen.status} />
              </div>
              
              <div className="mb-3">
                <div className="text-sm text-gray-500">Location:</div>
                <div>{screen.spaceDetails?.location?.city}, {screen.spaceDetails?.location?.zone}</div>
              </div>
              
              <div className="mb-3">
                <div className="text-sm text-gray-500">Daily Price:</div>
                <div className="font-medium">${screen.dailyPrice?.toLocaleString()}</div>
              </div>
              
              <div className="mb-4">
                <div className="text-sm text-gray-500 mb-1">Status:</div>
                <select
                  value={screen.status}
                  onChange={(e) => handleStatusChange(screen._id, e.target.value)}
                  className="border border-gray-300 rounded w-full px-2 py-1.5"
                >
                  <option value="active">Active</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="out_of_service">Out of Service</option>
                </select>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => navigate(`/admin/screens/${screen._id}`)}
                  className="flex-1 py-2 rounded-md flex items-center justify-center gap-2 text-white bg-blue-500 hover:bg-blue-600"
                >
                  <Eye size={18} />
                  <span>View</span>
                </button>
                <button
                  onClick={() => navigate(`/admin/screens/${screen._id}/edit`)}
                  className="flex-1 py-2 rounded-md flex items-center justify-center gap-2 text-white bg-green-500 hover:bg-green-600"
                >
                  <Edit size={18} />
                  <span>Edit</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center text-gray-500">
            No screens match your search criteria
          </div>
        )}
        
        {/* Pagination for Mobile */}
        <div className="mt-4">
          <Pagination 
            currentPage={page} 
            totalPages={totalPages} 
            onPageChange={setPage} 
          />
        </div>
      </div>
    </div>
  );
};

export default ScreensList;