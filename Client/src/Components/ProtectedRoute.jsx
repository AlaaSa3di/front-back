import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Check authentication and permission when component mounts or dependencies change
    if (!loading) {
      if (!user) {
        handleUnauthorizedAccess("Authentication Required", "Please log in to access this page.");
      } else if (requiredRole && user.role !== requiredRole) {
        handleUnauthorizedAccess("Access Denied", "You don't have permission to access this page.");
      }
    }
  }, [user, loading, requiredRole]);

  const handleUnauthorizedAccess = (title, message) => {
    if (!isRedirecting) {
      setIsRedirecting(true);
      
      Swal.fire({
        title: title,
        text: message,
        icon: "warning",
        confirmButtonText: "Continue",
        confirmButtonColor: "#FDB827",
        showClass: {
          popup: 'animate__animated animate__fadeIn',
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOut',
        },
      }).then(() => {
        // Redirect after alert is closed
        if (!user) {
          window.location.href = "/login";
        } else {
          window.location.href = "/";
        }
      });
    }
  };

  // Show loading state with brand styling
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-gray-50">
        <div className="text-center p-5">
          <div className="w-16 h-16 border-4 border-t-[#FDB827] border-b-[#FDB827] border-l-gray-200 border-r-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Loading your content...</p>
        </div>
      </div>
    );
  }

  // If auth check passed and not redirecting, render children
  if (user && (!requiredRole || user.role === requiredRole) && !isRedirecting) {
    return children;
  }

  // Render an empty div while the alert is showing
  return <div className="hidden"></div>;
};

export default ProtectedRoute;