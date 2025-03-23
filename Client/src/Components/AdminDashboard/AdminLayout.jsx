// src/Components/AdminDashboard/AdminLayout.jsx
import React from "react";
import Sidebar from "./Sidebar";
import TopNav from "./TopNav";

const AdminLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Navigation */}
        <TopNav />

        {/* Main Content Scrollable */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
