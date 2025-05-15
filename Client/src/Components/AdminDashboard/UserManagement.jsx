import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import {
  TrashIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  PencilIcon,
  UserCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import logo from "../images/log.png";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [deletedUsers, setDeletedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUserRole, setCurrentUserRole] = useState('user');
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userToDeactivate, setUserToDeactivate] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [userToUpdateRole, setUserToUpdateRole] = useState(null);
  const [showUserDetailsPopup, setShowUserDetailsPopup] = useState(false);
  const navigate = useNavigate();
  const defaultProfile = logo;

  // Fetch current user data
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const { data } = await api.get('/auth/me');
        setCurrentUser(data.data.user);
        setCurrentUserRole(data.data.user.role);
      } catch (error) {
        console.error('Failed to fetch current user:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/users');
      setUsers(data.users);
    } catch (error) {
      toast.error('Failed to fetch users', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch deleted users
  const fetchDeletedUsers = async () => {
    try {
      const { data } = await api.get('/users/deleted');
      setDeletedUsers(data.users);
    } catch (error) {
      toast.error('Failed to fetch inactive users', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchDeletedUsers();
  }, []);

  // Handle deactivate user
  const handleDeactivateUser = (userId) => {
    const userToDeactivate = users.find(user => user._id === userId || user.id === userId);
    setUserToDeactivate(userToDeactivate);
    setShowConfirmModal(true);
  };

  // Confirm deactivation
  const confirmDeactivation = async () => {
    if (!userToDeactivate) return;
    
    const userId = userToDeactivate._id || userToDeactivate.id;
    
    try {
      await api.patch(`/users/${userId}/delete`);
      toast.success('User deactivated successfully', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        icon: "🔒"
      });
      setShowConfirmModal(false);
      fetchUsers();
      fetchDeletedUsers();
      
      if (selectedUser && (selectedUser._id === userId || selectedUser.id === userId)) {
        setSelectedUser(null);
      }
    } catch (error) {
      toast.error('Failed to deactivate user', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  // Cancel deactivation
  const cancelDeactivation = () => {
    setShowConfirmModal(false);
    setUserToDeactivate(null);
  };

  // Handle edit role
  const handleEditRole = (userId) => {
    const userToEdit = users.find(user => user._id === userId || user.id === userId);
    setUserToUpdateRole(userToEdit);
    setSelectedRole(userToEdit.role);
    setShowRoleModal(true);
  };

  // Confirm role update
  const confirmRoleUpdate = async () => {
    if (!userToUpdateRole) return;
    
    const userId = userToUpdateRole._id || userToUpdateRole.id;
    
    try {
      await api.patch(`/users/${userId}/role`, { role: selectedRole });
      toast.success('User role updated successfully', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        icon: "✏️"
      });
      setShowRoleModal(false);
      fetchUsers();
      
      if (selectedUser && (selectedUser._id === userId || selectedUser.id === userId)) {
        setSelectedUser({...selectedUser, role: selectedRole});
      }
    } catch (error) {
      toast.error('Failed to update user role', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  // Cancel role update
  const cancelRoleUpdate = () => {
    setShowRoleModal(false);
    setUserToUpdateRole(null);
    setSelectedRole('');
  };

  // Restore user
  const handleRestoreUser = async (userId) => {
    try {
      await api.patch(`/users/${userId}/restore`);
      toast.success('User restored successfully', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        icon: "🔓"
      });
      fetchUsers();
      fetchDeletedUsers();
    } catch (error) {
      toast.error('Failed to restore user', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  // Handle user row click
  const handleUserRowClick = (user) => {
    setSelectedUser(user);
    setShowUserDetailsPopup(true);
  };

  // Close user details panel
  const closeUserDetails = () => {
    setShowUserDetailsPopup(false);
    setSelectedUser(null);
  };

  // Filter users based on search
  const filteredUsers = (activeTab === 'active' ? users : deletedUsers).filter(
    (user) =>
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check if current user is admin
  const isAdmin = currentUserRole === 'admin';

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">User Management</h1>
      
      {/* Search and Tab Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FDB827] focus:border-[#FDB827] sm:text-sm"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === 'active'
                ? 'bg-[#FDB827] text-black'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Active Users
          </button>
          <button
            onClick={() => setActiveTab('deleted')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === 'deleted'
                ? 'bg-[#FDB827] text-black'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Inactive Users
          </button>
        </div>
      </div>

      {/* Loading indicator */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FDB827]"></div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                {isAdmin && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => {
                  const userId = user._id || user.id;
                  return (
                    <tr 
                      key={userId}
                      onClick={() => handleUserRowClick(user)}
                      className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                        selectedUser?._id === userId || selectedUser?.id === userId ? 'bg-[#FDB827]/10' : ''
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {user.profilePicture && (
                            <div className="flex-shrink-0 h-10 w-10">
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={`http://localhost:8000${user.profilePicture}`}
                                alt="User profile"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = defaultProfile;
                                }}
                              />
                            </div>
                          )}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.fullName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.phoneNumber || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === 'admin'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.isDeleted
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {user.isDeleted ? 'Inactive' : 'Active'}
                        </span>
                      </td>
                      {isAdmin && (
                        <td 
                          className="px-6 py-4 whitespace-nowrap text-sm font-medium"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex space-x-2">
                            {activeTab === 'active' && (
                              <button
                                onClick={() => handleEditRole(userId)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Edit Role"
                              >
                                <PencilIcon className="h-5 w-5" />
                              </button>
                            )}
                            {activeTab === 'active' ? (
                              <button
                                onClick={() => handleDeactivateUser(userId)}
                                className="text-red-600 hover:text-red-900"
                                title="Deactivate User"
                              >
                                <TrashIcon className="h-5 w-5" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleRestoreUser(userId)}
                                className="text-green-600 hover:text-green-900"
                                title="Restore User"
                              >
                                <ArrowPathIcon className="h-5 w-5" />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={isAdmin ? 6 : 5} className="px-6 py-4 text-center text-sm text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* User details popup */}
      {showUserDetailsPopup && selectedUser && (
        <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold">User Details</h2>
              <button 
                onClick={closeUserDetails}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                  {selectedUser.profilePicture ? (
                    <img
                      className="h-24 w-24 rounded-full object-cover mb-4"
                      src={`http://localhost:8000${selectedUser.profilePicture}`}
                      alt="User profile"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = defaultProfile;
                      }}
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                      <UserCircleIcon className="h-12 w-12 text-gray-500" />
                    </div>
                  )}
                  <h3 className="text-lg font-medium">{selectedUser.fullName}</h3>
                  <p className="text-sm text-gray-500">{selectedUser.email}</p>
                  
                  <div className="mt-4 flex items-center">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        selectedUser.isDeleted
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {selectedUser.isDeleted ? 'Inactive' : 'Active'}
                    </span>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-md">
                      <p className="text-xs text-gray-500 mb-1">Full Name</p>
                      <p className="font-medium">{selectedUser.fullName}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-md">
                      <p className="text-xs text-gray-500 mb-1">Email</p>
                      <p className="font-medium">{selectedUser.email}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-md">
                      <p className="text-xs text-gray-500 mb-1">Phone</p>
                      <p className="font-medium">{selectedUser.phoneNumber || '-'}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-md">
                      <p className="text-xs text-gray-500 mb-1">Role</p>
                      <p className="font-medium flex items-center">
                        {selectedUser.role === 'admin' ? (
                          <>
                            <CheckCircleIcon className="h-4 w-4 text-purple-600 mr-1" />
                            Administrator
                          </>
                        ) : (
                          <>
                            <CheckCircleIcon className="h-4 w-4 text-blue-600 mr-1" />
                            Standard User
                          </>
                        )}
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-md">
                      <p className="text-xs text-gray-500 mb-1">Status</p>
                      <p className="font-medium">
                        {selectedUser.isDeleted ? 'Inactive Account' : 'Active Account'}
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-md">
                      <p className="text-xs text-gray-500 mb-1">User ID</p>
                      <p className="font-mono text-xs text-gray-600 break-all">{selectedUser._id || selectedUser.id}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={closeUserDetails}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Deactivation */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-2xl transform transition-all animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-6 w-6 text-amber-500 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Confirm Deactivation</h3>
              </div>
              <button 
                onClick={cancelDeactivation}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6 rounded">
              <p className="text-sm text-gray-600">
                Are you sure you want to deactivate this user? 
                <span className="block mt-1 font-semibold">This action can be reversed later.</span>
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDeactivation}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeactivation}
                className="w-24 py-2 rounded-md font-medium text-black transition-colors bg-[#FDB827] hover:bg-[#F26B0F]/90"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Editing Role */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-2xl transform transition-all animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <PencilIcon className="h-6 w-6 text-blue-500 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Edit User Role</h3>
              </div>
              <button 
                onClick={cancelRoleUpdate}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mb-6">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                Select Role
              </label>
              <select
                id="role"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#FDB827] focus:border-[#FDB827]"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelRoleUpdate}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmRoleUpdate}
                className="w-24 py-2 rounded-md font-medium text-black transition-colors bg-[#FDB827] hover:bg-[#F26B0F]/90"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Toast Container for notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default UserManagement;