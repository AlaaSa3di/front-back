import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import Pagination from '../common/Pagination'; // Make sure this path is correct

const ScreensListing = () => {
  const [allScreens, setAllScreens] = useState([]);
  const [filteredScreens, setFilteredScreens] = useState([]);
  const [paginatedScreens, setPaginatedScreens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    city: '',
    zone: '',
    spaceType: ''
  });
  const [viewMode, setViewMode] = useState('grid');
  const [sortOption, setSortOption] = useState('default');
  const [showFilters, setShowFilters] = useState(false);
  const searchParams = new URLSearchParams(window.location.search);
  const spaceTypeParam = searchParams.get('spaceType');
  const navigate = useNavigate();
  const screensPerPage = 6;

  useEffect(() => {
    fetchAllScreens();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [allScreens, filters, sortOption, currentPage, spaceTypeParam]);

  const fetchAllScreens = async () => {
    try {
      setLoading(true);
      // const response = await api.get('/screens');
      const response = await api.get('/screens/active');
      setAllScreens(response.data.data);
    } catch (error) {
      console.error('Error fetching screens:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let result = [...allScreens];
    
    // apply filters 
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
        
    if (filters.spaceType) {
      result = result.filter(screen => 
        screen.spaceDetails?.spaceType === filters.spaceType
      );
    }
     if (spaceTypeParam) {
      result = result.filter(screen => 
        screen.spaceDetails?.spaceType === spaceTypeParam
      );
    }
    // apply sort
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
    setTotalPages(Math.ceil(result.length / screensPerPage));
    
    // apply pagination 
    const startIndex = (currentPage - 1) * screensPerPage;
    const endIndex = startIndex + screensPerPage;
    setPaginatedScreens(result.slice(startIndex, endIndex));
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
      spaceType: ''
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

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  if (loading && allScreens.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 rounded-full border-4 border-[#FDB827] border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Available Screens for Booking</h1>
        
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
              <option value="size">Size</option>
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          
          <button
            onClick={toggleFilters}
            className={`flex items-center space-x-1 px-3 py-2 border rounded-md ${showFilters ? 'bg-[#FDB827] border-[#FDB827]' : 'bg-white border-gray-300 hover:bg-gray-50'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span className="font-medium text-sm">Filters</span>
            <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded-full">
              {Object.values(filters).filter(v => v !== '').length}
            </span>
          </button>
          
          {spaceTypeParam && (
            <button
              onClick={() => navigate('/screens')}
              className="flex items-center space-x-1 px-3 py-2 border rounded-md bg-white border-gray-300 hover:bg-gray-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              <span className="font-medium text-sm">View All</span>
            </button>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="bg-white p-5 rounded-lg shadow-lg mb-6 border border-gray-200 transition-all duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range (JOD)</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <input
                  type="number"
                  placeholder="Max"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="City"
                  name="city"
                  value={filters.city}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <input
                  type="text"
                  placeholder="Zone"
                  name="zone"
                  value={filters.zone}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
            </div>
            
            <div className="space-y-4">              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Space Type</label>
                <select
                  name="spaceType"
                  value={filters.spaceType}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">All Types</option>
                  <option value="building_facade">Building Facade</option>
                  <option value="mall_interior">Mall Interior</option>
                  <option value="billboard">Billboard</option>
                  <option value="public_transport">Public Transport</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm font-medium"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}
      
      <div className="mb-4 text-sm text-gray-500">
        Showing {paginatedScreens.length} of {filteredScreens.length} {filteredScreens.length === 1 ? 'result' : 'results'} 
        (Page {currentPage} of {totalPages})
      </div>
      
      {paginatedScreens.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No screens match your filters</h3>
          <p className="text-gray-500">Try adjusting your search criteria or reset the filters to see more results.</p>
        </div>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedScreens.map((screen) => (
                <ScreenCard key={screen._id} screen={screen} onBookNow={handleBookNow} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {paginatedScreens.map((screen) => (
                <ScreenListItem key={screen._id} screen={screen} onBookNow={handleBookNow} />
              ))}
            </div>
          )}

          {/* Replaced the pagination code with the Pagination component */}
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

const ScreenCard = ({ screen, onBookNow }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col transition-shadow hover:shadow-lg">
    {screen.screenImage?.url ? (
      <div className="h-48 w-full overflow-hidden relative">
        <img 
          src={screen.screenImage.url} 
          alt={screen.spaceDetails?.title || 'Screen preview'}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 right-0 m-2">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
            screen.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
          }`}>
            {screen.status === 'active' ? 'Available' : 'Unavailable'}
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
        {screen.spaceDetails?.title || 'Untitled Screen'}
      </h2>
      <p className="text-gray-600 text-sm mb-3 line-clamp-1">
        {screen.spaceDetails?.location?.city || 'N/A'}, {screen.spaceDetails?.location?.zone || 'N/A'}
      </p>
      
      <div className="space-y-2 mb-4 flex-1">
        <div className="flex items-center justify-between">
          <span className="text-gray-700 text-sm">Dimensions:</span>
          <span className="font-medium text-sm">
            {screen.installedDimensions?.width || 'N/A'}{screen.installedDimensions?.unit} × {screen.installedDimensions?.height || 'N/A'}{screen.installedDimensions?.unit}
          </span>
        </div>
                <div className="flex items-center justify-between">
          <span className="text-gray-700 text-sm">Ads Count:</span>
          <span className="font-bold text-[#F26B00] mr-6">{screen.adsCount || 'N/A'} </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-700 text-sm">Daily Price:</span>
          <span className="font-bold text-[#F26B0F]">{screen.dailyPrice || 'N/A'} JOD</span>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {screen.specifications?.technology && (
          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
            {screen.specifications.technology}
          </span>
        )}
        {screen.spaceDetails?.spaceType && (
          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700">
            {screen.spaceDetails.spaceType.replace('_', ' ')}
          </span>
        )}
      </div>
      
      <button
        onClick={() => onBookNow(screen._id)}
        disabled={screen.status !== 'active'}
        className={`w-full py-3 rounded-md font-medium text-black transition-colors ${
          screen.status !== 'active' 
            ? 'bg-gray-300 cursor-not-allowed' 
            : 'bg-[#FDB827] hover:bg-[#F26B0F]/90'
        }`}
      >
        {screen.status === 'active' ? 'Book Now' : 'Not Available'}
      </button>
    </div>
  </div>
);

const ScreenListItem = ({ screen, onBookNow }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row transition-shadow hover:shadow-lg">
    {screen.screenImage?.url ? (
      <div className="md:w-1/4 h-48 md:h-40 w-full overflow-hidden relative">
        <img 
          src={screen.screenImage.url} 
          alt={screen.spaceDetails?.title || 'Screen preview'}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 right-0 m-2">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
            screen.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
          }`}>
            {screen.status === 'active' ? 'Available' : 'Unavailable'}
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
          {screen.spaceDetails?.title || 'Untitled Screen'}
        </h2>
        <p className="text-gray-600 text-sm mb-2">
          {screen.spaceDetails?.location?.city || 'N/A'}, {screen.spaceDetails?.location?.zone || 'N/A'}
        </p>
        
        <div className="grid grid-cols-2 gap-x-8 gap-y-1 mb-3">
          <div className="flex items-center">
            <span className="text-gray-700 text-sm w-24">Dimensions:</span>
            <span className="font-medium text-sm">
              {screen.installedDimensions?.width || 'N/A'}{screen.installedDimensions?.unit} × {screen.installedDimensions?.height || 'N/A'}{screen.installedDimensions?.unit}
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-700 text-sm w-24">Daily Price:</span>
            <span className="font-bold text-[#F26B0F]">{screen.dailyPrice || 'N/A'} JOD</span>
          </div>
          {screen.specifications?.technology && (
            <div className="flex items-center">
              <span className="text-gray-700 text-sm w-24">Technology:</span>
              <span className="font-medium text-sm">{screen.specifications.technology}</span>
            </div>
          )}
          {screen.spaceDetails?.spaceType && (
            <div className="flex items-center">
              <span className="text-gray-700 text-sm w-24">Space Type:</span>
              <span className="font-medium text-sm">{screen.spaceDetails.spaceType.replace('_', ' ')}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-4 md:mt-0 md:ml-6 md:flex md:items-center">
        <button
          onClick={() => onBookNow(screen._id)}
          disabled={screen.status !== 'active'}
          className={`w-full md:w-auto px-6 py-3 rounded-md font-medium text-black transition-colors ${
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
);

export default ScreensListing;