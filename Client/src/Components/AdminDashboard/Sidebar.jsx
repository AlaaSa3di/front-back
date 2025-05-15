// src/Components/AdminDashboard/Sidebar.jsx
import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white shadow-md flex flex-col">
      {/* Brand or Title */}
      <div className="px-6 py-4 text-2xl font-bold border-b">Admin Panel</div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {/* <Link
          to="/admin"
          className="block px-4 py-2 rounded hover:bg-gray-200 transition"
        >
          Dashboard
        </Link>
        <Link
          to="/admin/articles"
          className="block px-4 py-2 rounded hover:bg-gray-200 transition"
        >
          Articles
        </Link> */}
        <Link
          to="/admin/users"
          className="block px-4 py-2 rounded hover:bg-gray-200 transition"
        >
          User Management
        </Link>
        <Link
          to="/admin/spaces"
          className="block px-4 py-2 rounded hover:bg-gray-200 transition"
        >
          Space Management
        </Link>
        <Link
          to="/admin/bookings"
          className="block px-4 py-2 rounded hover:bg-gray-200 transition"
        >
          Bookings
        </Link>
        <Link
          to="/admin/contact-messages"
          className="block px-4 py-2 rounded hover:bg-gray-200 transition"
        >
          Massages
        </Link>
        {/* Add more links for journalists, users, etc. */}
      </nav>
    </aside>
  );
};

export default Sidebar;
