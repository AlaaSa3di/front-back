import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaUserCircle, FaSearch } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../images/logo.png";
import { useAuth } from "../../contexts/AuthContext";
import SearchBar from "./SearchBar";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMenuOpen(false);
    setMobileSearchOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const toggleMobileSearch = () => setMobileSearchOpen(!mobileSearchOpen);

  // Click outside dropdown handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest(".dropdown-container")) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const navLinks = [
    { path: "/screens", label: "Screens" },
    { path: "/space", label: "Join Us" },
    { path: "/About", label: "About Us" },
    { path: "/Contact", label: "Contact Us" },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed. Please try again.");
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return (
      <div className="h-16 bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-t-[#FDB827] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <nav className="text-white backdrop-blur-md bg-black/95 sticky top-0 z-50 border-b border-gray-800 shadow-md w-full">
        <div className="container mx-auto px-4 flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Spot Flash" className="h-10 md:h-12" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`transition duration-300 text-base font-medium ${
                  location.pathname === link.path
                    ? "text-[#FDB827] border-b-2 border-[#FDB827]"
                    : "text-white hover:text-[#FDB827]"
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            <div className="ml-4">
              <SearchBar />
            </div>
          </div>

          {/* User Section */}
          <div className="hidden lg:block relative">
            {user ? (
              <div className="flex items-center gap-4 dropdown-container">
                <div className="relative">
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center cursor-pointer space-x-2 focus:outline-none p-2 rounded-full hover:bg-gray-800 transition-colors"
                  >
                    <FaUserCircle size={28} className="text-[#FDB827]" />
                    <span className="text-white font-medium ml-2">
                      {user.fullName || user.email.split("@")[0]}
                    </span>
                  </button>
                  
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-black border border-gray-800 rounded-md shadow-lg py-1 z-50">
                      <Link
                        to="/Profile/:id"
                        className="block px-4 py-2 text-white hover:bg-gray-800 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-800 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link
                  to="/login"
                  className="border border-[#FDB827] text-[#FDB827] hover:bg-[#FDB827] hover:text-black transition duration-300 px-4 py-2 rounded-md uppercase text-sm font-bold"
                >
                  LOGIN
                </Link>
                <Link
                  to="/register"
                  className="bg-[#FDB827] text-black hover:bg-[#F26B0F]/90 transition duration-300 px-4 py-2 rounded-md uppercase text-sm font-bold"
                >
                  SIGN UP
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center gap-4">
            <button 
              onClick={toggleMobileSearch}
              className="text-white hover:text-[#FDB827] p-2"
              aria-label="Search"
            >
              <FaSearch size={20} />
            </button>
            <button 
              onClick={toggleMenu} 
              className="text-white hover:text-[#FDB827] p-2"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {mobileSearchOpen && (
          <div className="lg:hidden bg-black py-3 px-4 border-t border-gray-800 transition-all">
            <SearchBar mobile={true} />
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-black py-4 border-t border-gray-800 shadow-lg">
            <div className="container mx-auto px-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block py-3 text-base ${
                    location.pathname === link.path
                      ? "text-[#FDB827] font-medium"
                      : "text-white hover:text-[#FDB827]"
                  }`}
                  onClick={closeMenu}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="pt-4 border-t border-gray-800 mt-4">
                {user ? (
                  <>
                    <div className="flex items-center space-x-2 mb-4 p-2 bg-gray-900 rounded-md">
                      <FaUserCircle size={24} className="text-[#FDB827]" />
                      <span className="text-white font-medium">
                        {user.fullName || user.email.split("@")[0]}
                      </span>
                    </div>
                    <Link 
                      to="/Profile/:id" 
                      className="block text-white hover:text-[#FDB827] py-3 px-2"
                      onClick={closeMenu}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        closeMenu();
                      }}
                      className="block w-full text-left text-red-500 hover:text-red-400 py-3 px-2"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col space-y-3 pt-2">
                    <Link
                      to="/login"
                      className="w-full py-3 rounded-md font-medium text-[#FDB827] border border-[#FDB827] hover:bg-[#FDB827] hover:text-black transition-colors text-center uppercase"
                      onClick={closeMenu}
                    >
                      LOGIN
                    </Link>
                    <Link
                      to="/register"
                      className="w-full py-3 rounded-md font-medium text-black transition-colors bg-[#FDB827] hover:bg-[#F26B0F]/90 text-center uppercase"
                      onClick={closeMenu}
                    >
                      SIGN UP
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
      <Outlet />
    </>
  );
};

export default Navbar;