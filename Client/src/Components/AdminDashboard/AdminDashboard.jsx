// src/Components/AdminDashboard/AdminDashboard.jsx
import React from "react";
import AdminLayout from "./AdminLayout";
import DashboardMetrics from "./DashboardMetrics";
import ArticlesList from "./ArticlesList";

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Welcome, Admin!</h1>
      <DashboardMetrics />
      <div className="mt-8">
        <ArticlesList />
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
