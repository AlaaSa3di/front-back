import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';

const ScreensListing = () => {
  const [screens, setScreens] = useState([]);
  const [filteredScreens, setFilteredScreens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    city: '',
    zone: '',
    minWidth: '',
    minHeight: ''
  });
  const [viewMode, setViewMode] = useState('grid');
  const [sortOption, setSortOption] = useState('default');
  
  const navigate = useNavigate();
  const screensPerPage = 6;

  useEffect(() => {
    fetchScreens();
  }, [currentPage]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [screens, filters, sortOption]);

  const fetchScreens = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/screens?page=${currentPage}&limit=${screensPerPage}`);
      setScreens(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching screens:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let result = [...screens];
    
    // Apply filters
    if (filters.minPrice) {
      result = result.filter(screen => screen.dailyPrice >= Number(filters.minPrice));
    }
    
    if (filters.maxPrice) {
      result = result.filter(screen => screen.dailyPrice <= Number(filters.maxPrice));
    }
    
    if (filters.city) {
      result = result.filter(screen => 
        screen.spaceDetails?.location?.city?.toLowerCase().includes(filters.city.toLowerCase())
      );
    }
    
    if (filters.zone) {
      result = result.filter(screen => 
        screen.spaceDetails?.location?.zone?.toLowerCase().includes(filters.zone.toLowerCase())
      );
    }
    
    if (filters.minWidth) {
      result = result.filter(screen => 
        screen.installedDimensions?.width >= Number(filters.minWidth)
      );
    }
    
    if (filters.minHeight) {
      result = result.filter(screen => 
        screen.installedDimensions?.height >= Number(filters.minHeight)
      );
    }
    
    // Apply sorting
    switch(sortOption) {
      case 'price-low':
        result.sort((a, b) => a.dailyPrice - b.dailyPrice);
        break;
      case 'price-high':
        result.sort((a, b) => b.dailyPrice - a.dailyPrice);
        break;
      case 'size':
        result.sort((a, b) => 
          (b.installedDimensions?.width * b.installedDimensions?.height || 0) - 
          (a.installedDimensions?.width * a.installedDimensions?.height || 0)
        );
        break;
      default:
        break;
    }
    
    setFilteredScreens(result);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      city: '',
      zone: '',
      minWidth: '',
      minHeight: ''
    });
    setSortOption('default');
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookNow = (screenId) => {
    navigate(`/booking/${screenId}`);
  };

  if (loading && screens.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 rounded-full border-4 border-[#FDB827] border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Available Screens for Booking</h1>

      {/* Filter and View Controls */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price Range (JOD)</label>
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Min"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="Max"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          
          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="City"
                name="city"
                value={filters.city}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                placeholder="Zone"
                name="zone"
                value={filters.zone}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          
          {/* Dimensions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Dimensions</label>
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Width"
                name="minWidth"
                value={filters.minWidth}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="Height"
                name="minHeight"
                value={filters.minHeight}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex space-x-2 mb-2 sm:mb-0">
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Reset Filters
            </button>
          </div>
          
          <div className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Sort by:</label>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="default">Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="size">Size</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-[#FDB827]' : 'bg-gray-200'}`}
                title="Grid view"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-[#FDB827]' : 'bg-gray-200'}`}
                title="List view"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {filteredScreens.length === 0 ? (
        <div className="text-gray-500 py-8 text-center">
          No screens match your filters. Try adjusting your search criteria.
        </div>
      ) : (
        <>
          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredScreens.map((screen) => (
                <div key={screen._id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
                  {screen.screenImage?.url && (
                    <div className="h-48 w-full overflow-hidden">
                      <img 
                        src={screen.screenImage.url} 
                        alt={screen.spaceDetails ? screen.spaceDetails.title : 'Screen preview'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="p-4 flex-1 flex flex-col">
                    <h2 className="text-xl font-semibold mb-1">
                      {screen.spaceDetails?.title || 'Untitled Screen'}
                    </h2>
                    <p className="text-gray-600 text-sm mb-2">
                      {screen.spaceDetails?.location?.city}, {screen.spaceDetails?.location?.zone}
                    </p>
                    
                    <div className="space-y-2 mb-4 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 text-sm">Dimensions:</span>
                        <span className="font-medium">
                          {screen.installedDimensions?.width || 'N/A'}{screen.installedDimensions?.unit} × {screen.installedDimensions?.height || 'N/A'}{screen.installedDimensions?.unit}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 text-sm">Daily Price:</span>
                        <span className="font-medium"> {screen.dailyPrice || 'N/A'} JOD</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        screen.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {screen.status === 'active' ? 'Available' : screen.status || 'Unknown'}
                      </span>
                      
                      {screen.specifications?.technology && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {screen.specifications.technology}
                        </span>
                      )}
                    </div>
                    
                    <button
                      onClick={() => handleBookNow(screen._id)}
                      disabled={screen.status !== 'active'}
                      className={`w-full py-2.5 rounded-md font-medium text-black transition-colors ${
                        screen.status !== 'active' 
                          ? 'bg-gray-300 cursor-not-allowed' 
                          : 'bg-[#FDB827] hover:bg-[#F26B0F]/90'
                      }`}
                    >
                      {screen.status === 'active' ? 'Book Now' : 'Not Available'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* List View */}
          {viewMode === 'list' && (
            <div className="space-y-4">
              {filteredScreens.map((screen) => (
                <div key={screen._id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
                  {screen.screenImage?.url && (
                    <div className="md:w-1/3 h-48 md:h-48 w-full overflow-hidden">
                      <img 
                        src={screen.screenImage.url} 
                        alt={screen.spaceDetails ? screen.spaceDetails.title : 'Screen preview'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="p-4 flex-1 flex flex-col md:flex-row md:justify-between">
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold mb-1">
                        {screen.spaceDetails?.title || 'Untitled Screen'}
                      </h2>
                      <p className="text-gray-600 text-sm mb-2">
                        {screen.spaceDetails?.location?.city}, {screen.spaceDetails?.location?.zone}
                      </p>
                      
                      <div className="space-y-1 mb-3">
                        <div className="flex items-center">
                          <span className="text-gray-700 text-sm w-24">Dimensions:</span>
                          <span className="font-medium">
                            {screen.installedDimensions?.width || 'N/A'}{screen.installedDimensions?.unit} × {screen.installedDimensions?.height || 'N/A'}{screen.installedDimensions?.unit}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-700 text-sm w-24">Daily Price:</span>
                          <span className="font-medium">SAR {screen.dailyPrice || 'N/A'}</span>
                        </div>
                        {screen.specifications?.technology && (
                          <div className="flex items-center">
                            <span className="text-gray-700 text-sm w-24">Technology:</span>
                            <span className="font-medium">{screen.specifications.technology}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          screen.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {screen.status === 'active' ? 'Available' : screen.status || 'Unknown'}
                        </span>
                        
                        {screen.specifications?.technology && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {screen.specifications.technology}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-4 md:mt-0 md:ml-4 md:flex md:items-center">
                      <button
                        onClick={() => handleBookNow(screen._id)}
                        disabled={screen.status !== 'active'}
                        className={`w-full md:w-auto px-6 py-2.5 rounded-md font-medium text-black transition-colors ${
                          screen.status !== 'active' 
                            ? 'bg-gray-300 cursor-not-allowed' 
                            : 'bg-[#FDB827] hover:bg-[#F26B0F]/90'
                        }`}
                      >
                        {screen.status === 'active' ? 'Book Now' : 'Not Available'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-md border border-gray-300 disabled:opacity-50 hover:bg-gray-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Show first page, last page, and pages around current page
                  let page;
                  if (totalPages <= 5) {
                    page = i + 1;
                  } else if (currentPage <= 3) {
                    page = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    page = totalPages - 4 + i;
                  } else {
                    page = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 flex items-center justify-center rounded-md ${
                        currentPage === page 
                          ? 'bg-[#FDB827] text-black font-medium' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <span className="px-2">...</span>
                )}
                
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    className={`w-10 h-10 flex items-center justify-center rounded-md ${
                      currentPage === totalPages 
                        ? 'bg-[#FDB827] text-black font-medium' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {totalPages}
                  </button>
                )}
                
                <button
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-md border border-gray-300 disabled:opacity-50 hover:bg-gray-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ScreensListing;