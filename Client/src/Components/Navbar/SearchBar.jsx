import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";

const SearchBar = ({ mobile = false }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    
    if (query.length < 2) {
      toast.info("Please enter at least 2 characters to search");
      return;
    }
    
    setIsSearching(true);
    
    try {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setSearchQuery("");
      setIsSearching(false);
    } catch (error) {
      toast.error("Search failed. Please try again.");
      setIsSearching(false);
    }
  };

  return (
    <form 
      onSubmit={handleSearch} 
      className={`flex items-center ${mobile ? 'w-full' : 'w-auto'}`}
      role="search"
    >
      <div className="relative flex-grow">
        <div className="relative">
          <input
            type="text"
            placeholder="Search billboards, spaces..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`px-4 py-2 ${mobile ? 'pl-10' : 'pl-4'} rounded-l-md border-0 text-black bg-white focus:ring-2 focus:ring-[#FDB827] focus:outline-none ${
              mobile ? 'w-full' : 'w-48 md:w-60 lg:w-64'
            }`}
            minLength={2}
            required
            disabled={isSearching}
          />
          {mobile && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
              <FaSearch size={16} />
            </div>
          )}
        </div>
      </div>
      <button 
        type="submit"
        disabled={isSearching}
        className={`bg-[#FDB827] text-black font-medium px-4 py-2 rounded-r-md hover:bg-[#F26B0F]/90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FDB827] ${
          isSearching ? 'opacity-75 cursor-not-allowed' : ''
        }`}
        aria-label="Search"
      >
        {mobile ? (
          <FaSearch size={24} />
        ) : isSearching ? (
          <div className="flex items-center">
            <div className="w-4 h-4 border-2 border-t-transparent border-black rounded-full animate-spin mr-1"></div>
            <span>Searching...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-1">
            {/* <span>Search</span> */}
            <FaSearch size={24} />
          </div>
        )}
      </button>
    </form>
  );
};

export default SearchBar;