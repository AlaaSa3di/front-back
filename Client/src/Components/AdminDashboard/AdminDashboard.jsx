// src/Components/AdminDashboard/AdminDashboard.jsx
import React from "react";
import AdminLayout from "./AdminLayout";
import DashboardMetrics from "./DashboardMetrics";
import ArticlesList from "./ArticlesList";
// import SpaceManagement from "./spaceManage"

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Welcome, Admin!</h1>
      <DashboardMetrics />
      <div className="mt-8">
        <ArticlesList />
      </div>
      {/* <div className="mt-8">
        <SpaceManagement />
      </div> */}
    </AdminLayout>
  );
};

export default AdminDashboard;
