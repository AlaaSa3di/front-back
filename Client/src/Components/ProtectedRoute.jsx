// src/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    // أثناء التحقق من المستخدم
    return <div>Loading...</div>;
  }

  if (!user) {
    // المستخدم غير مسجل الدخول
    return <Navigate to="/login" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // مسجل الدخول ولكن ليس لديه الصلاحية المطلوبة
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
