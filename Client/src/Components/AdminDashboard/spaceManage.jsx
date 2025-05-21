import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Pagination from '../common/Pagination';

const SpaceManagement = () => {
  const [spaces, setSpaces] = useState([]);
  const [filteredSpaces, setFilteredSpaces] = useState([]);
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const spacesPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    fetchSpaces();
  }, []);
  
  useEffect(() => {
    filterSpaces();
  }, [spaces, filter]);

  const fetchSpaces = async () => {
    try {
      setLoading(true);
      const response = await api.get('/spaces');
      setSpaces(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching spaces:', error);
      toast.error('Failed to fetch spaces');
      setSpaces([]);
    } finally {
      setLoading(false);
    }
  };

  const filterSpaces = () => {
    if (filter === 'all') {
      setFilteredSpaces(spaces);
    } else if (filter === 'approved') {
      setFilteredSpaces(spaces.filter(space => space.isApproved));
    } else if (filter === 'pending') {
      setFilteredSpaces(spaces.filter(space => !space.isApproved));
    }
    setCurrentPage(1);
  };

  const handleSpaceClick = (space) => {
    setSelectedSpace(space);
    setOpenDialog(true);
  };

  const handleApproveSpace = async () => {
    try {
      setIsSubmitting(true);
      await api.patch(`/spaces/${selectedSpace?._id}/approve`);
      toast.success('Space approved successfully');
      fetchSpaces();
      setOpenDialog(false);
    } catch (error) {
      console.error('Error approving space:', error);
      toast.error(error.response?.data?.message || 'Failed to approve space');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSpace = async () => {
    try {
      setIsSubmitting(true);
      await api.patch(`/spaces/${selectedSpace?._id}/soft-delete`, {
        isDeleted: true,
        deletedAt: new Date().toISOString()
      });
      
      toast.success('Space disabled successfully');
      fetchSpaces();
      setOpenDialog(false);
    } catch (error) {
      console.error('Error marking space as deleted:', error);
      toast.error(error.response?.data?.message || 'Failed to disable space');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddScreen = () => {
    navigate(`/admin/spaces/${selectedSpace._id}/add-screen`);
    toast.info('Redirecting to add screen page');
  };

  // Pagination logic
  const indexOfLastSpace = currentPage * spacesPerPage;
  const indexOfFirstSpace = indexOfLastSpace - spacesPerPage;
  const currentSpaces = filteredSpaces.slice(indexOfFirstSpace, indexOfLastSpace);
  const totalPages = Math.ceil(filteredSpaces.length / spacesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      <ToastContainer position="bottom-right" autoClose={3000} />
      
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Space Management</h1>
        <p className="mt-2 text-sm text-gray-500">Manage and monitor all available spaces</p>
      </div>
      
      {/* Filter and View Toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-5 gap-4">
        <div className="flex space-x-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap ${
              filter === 'all' 
                ? 'bg-[#FDB827] text-black' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Spaces
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap ${
              filter === 'approved' 
                ? 'bg-[#FDB827] text-black' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap ${
              filter === 'pending' 
                ? 'bg-[#FDB827] text-black' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pending
          </button>
        </div>
        <div className="flex space-x-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md ${
              viewMode === 'grid' 
                ? 'bg-[#FDB827] text-black' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md ${
              viewMode === 'list' 
                ? 'bg-[#FDB827] text-black' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FDB827]"></div>
        </div>
      ) : filteredSpaces.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-500">No spaces found matching the selected filter</p>
          <button 
            onClick={() => setFilter('all')} 
            className="mt-4 px-4 py-2 bg-[#FDB827] text-black rounded-md text-sm font-medium hover:bg-[#F26B0F]/90 transition-colors"
          >
            View All Spaces
          </button>
        </div>
      ) : (
        <>
          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {currentSpaces.map((space) => (
                <div 
                  key={space._id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
                  onClick={() => handleSpaceClick(space)}
                >
                  <div className="relative aspect-video bg-gray-100">
                    {space.images?.length > 0 ? (
                      <img
                        src={space.images[0]?.url}
                        alt={space.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute top-0 left-0 right-0 p-2 flex justify-between items-center">
                      <span 
                        className={`px-2 py-1 text-xs font-semibold rounded-md ${
                          space.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {space.isApproved ? 'Approved' : 'Pending'}
                      </span>
                      {space.isApproved && space.isScreenInstalled && (
                        <span className="px-2 py-1 text-xs font-semibold rounded-md bg-blue-100 text-blue-800">
                          Screen Installed
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-4">
                    <h2 className="text-lg font-medium text-gray-900 mb-1 truncate">{space.title}</h2>
                    <p className="text-sm text-gray-500 mb-2 truncate">{space.location?.city}, {space.location?.zone}</p>
                    <div className="flex items-center text-sm text-gray-700">
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                        {space.spaceType?.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* List View */}
          {viewMode === 'list' && (
            <div className="bg-white shadow-md overflow-hidden rounded-lg">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Space
                      </th>
                      <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Screen
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentSpaces.map((space) => (
                      <tr 
                        key={space._id} 
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleSpaceClick(space)}
                      >
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 mr-3">
                              {space.images?.length > 0 ? (
                                <img
                                  className="h-10 w-10 rounded-full object-cover"
                                  src={space.images[0]?.url}
                                  alt={space.title}
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{space.title}</div>
                              <div className="text-sm text-gray-500">{space.owner?.fullName}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{space.location?.city}</div>
                          <div className="text-sm text-gray-500">{space.location?.zone}</div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{space.spaceType?.replace('_', ' ')}</div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            space.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {space.isApproved ? 'Approved' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            space.isScreenInstalled ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {space.isScreenInstalled ? 'Installed' : 'Not Installed'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {/* Pagination using the provided component */}
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={handlePageChange} 
          />
        </>
      )}

      {/* Space Details Dialog */}
      {openDialog && selectedSpace && (
        <div className="fixed inset-0 z-10 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
            <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:align-middle">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  onClick={() => setOpenDialog(false)}
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                      <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                        {selectedSpace.title}
                        <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-md ${
                          selectedSpace.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {selectedSpace.isApproved ? 'Approved' : 'Pending'}
                        </span>
                        {selectedSpace.isApproved && selectedSpace.isScreenInstalled && (
                          <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-md bg-blue-100 text-blue-800">
                            Screen Installed
                          </span>
                        )}
                      </h3>
                    </div>
                    <div className="mt-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-md font-medium text-gray-900 mb-3">Details</h4>
                          <div className="space-y-3 text-sm">
                            <div>
                              <span className="font-semibold text-gray-700">Description:</span> 
                              <p className="mt-1 text-gray-600">{selectedSpace.description || 'No description available'}</p>
                            </div>
                            <div>
                              <span className="font-semibold text-gray-700">Location:</span> 
                              <p className="mt-1 text-gray-600">{selectedSpace.location?.street}, {selectedSpace.location?.zone}, {selectedSpace.location?.city}</p>
                            </div>
                            <div>
                              <span className="font-semibold text-gray-700">Type:</span> 
                              <p className="mt-1 text-gray-600">{selectedSpace.spaceType?.replace('_', ' ')}</p>
                            </div>
                            <div>
                              <span className="font-semibold text-gray-700">Dimensions:</span> 
                              <p className="mt-1 text-gray-600">{selectedSpace.dimensions?.width}m (width) × {selectedSpace.dimensions?.height}m (height)</p>
                            </div>
                            <div>
                              <span className="font-semibold text-gray-700">Owner:</span> 
                              <p className="mt-1 text-gray-600">{selectedSpace.owner?.fullName} ({selectedSpace.owner?.email})</p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-md font-medium text-gray-900 mb-3">Images</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {selectedSpace.images?.length > 0 ? (
                              selectedSpace.images.map((image, index) => (
                                <div key={index} className="aspect-video bg-gray-100 rounded-md overflow-hidden">
                                  <img 
                                    src={image.url} 
                                    alt={`Space ${index + 1}`} 
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ))
                            ) : (
                              <div className="col-span-2 flex items-center justify-center h-32 bg-gray-100 rounded-md">
                                <p className="text-sm text-gray-500">No images available</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                {/* Add Screen Button - Only visible for approved spaces without screens */}
                {selectedSpace.isApproved && !selectedSpace.isScreenInstalled && (
                  <button
                    type="button"
                    onClick={handleAddScreen}
                    className="w-full sm:w-auto py-3 px-4 rounded-md font-medium text-black transition-colors sm:ml-3 bg-[#FDB827] hover:bg-[#F26B0F]/90"
                  >
                    Add Screen
                  </button>
                )}
                
                {!selectedSpace.isApproved && (
                  <button
                    type="button"
                    onClick={handleApproveSpace}
                    disabled={isSubmitting}
                    className={`w-full sm:w-auto py-3 px-4 rounded-md font-medium text-black transition-colors sm:ml-3 ${
                      isSubmitting ? "bg-gray-400" : "bg-[#FDB827] hover:bg-[#F26B0F]/90"
                    }`}
                  >
                    {isSubmitting ? 'Processing...' : 'Approve Space'}
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleDeleteSpace}
                  disabled={isSubmitting}
                  className="mt-3 w-full sm:w-auto inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3"
                >
                  {isSubmitting ? 'Processing...' : 'Delete Space'}
                </button>
                <button
                  type="button"
                  onClick={() => setOpenDialog(false)}
                  className="mt-3 w-full sm:w-auto inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpaceManagement;