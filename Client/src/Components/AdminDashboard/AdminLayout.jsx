// src/Components/AdminDashboard/AdminLayout.jsx
import React, { Suspense, lazy } from "react";
import { Outlet } from "react-router-dom";
import { Helmet } from "react-helmet";

const Sidebar = lazy(() => import("./Sidebar"));
const TopNav = lazy(() => import("./TopNav"));

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-[#F1F1F1]">
      <Helmet>
        <meta
          name="description"
          content="Admin panel for managing Orbitra content and users."
        />
      </Helmet>
      <Suspense fallback={<div>Loading...</div>}>
        <Sidebar />
      </Suspense>

      <div className="flex flex-col flex-1 overflow-hidden">
        <Suspense fallback={<div>Loading...</div>}>
          <TopNav />
        </Suspense>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;