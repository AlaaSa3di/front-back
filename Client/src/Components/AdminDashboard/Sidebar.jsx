import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

// Icons
import {
  LayoutDashboard,
  Users,
  Map,
  CalendarRange,
  MessageSquare,
  Monitor,
  Settings,
  Menu,
  X,
  LogOut,
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isHovered, setIsHovered] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const menuItems = [
    {
      text: "Overview",
      icon: <LayoutDashboard size={20} />,
      path: "/admin/over",
    },
    {
      text: "User Management",
      icon: <Users size={20} />,
      path: "/admin/users",
    },
    {
      text: "Space Management",
      icon: <Map size={20} />,
      path: "/admin/spaces",
    },
    {
      text: "Screen Management",
      icon: <Monitor size={20} />,
      path: "/admin/screens",
    },
    {
      text: "Bookings",
      icon: <CalendarRange size={20} />,
      path: "/admin/bookings",
    },
    {
      text: "Messages",
      icon: <MessageSquare size={20} />,
      path: "/admin/contact-messages",
    },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex h-screen">
      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleSidebar}
          className="bg-[#FDB827] p-2 rounded-md text-black"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`
          border-r border-gray-100 bg-white h-screen w-64 shrink-0
          transition-all duration-300 overflow-y-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          fixed lg:relative z-40
        `}
      >
        {/* Logo Area */}
        <div className="p-4 border-b border-gray-100">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
        </div>

        {/* Menu Items */}
        <nav>
          <ul>
            {menuItems.map((item) => {
              const isActive =
                location.pathname === item.path ||
                (item.path === "/admin/spaces" &&
                  location.pathname.includes("spaces"));

              return (
                <li key={item.text}>
                  <Link
                    to={item.path}
                    className={`
                      flex items-center px-4 py-3 text-sm transition-colors
                      ${
                        isActive
                          ? "border-l-4 border-[#FDB827] text-[#FDB827]"
                          : "border-l-4 border-transparent hover:bg-gray-50"
                      }
                    `}
                  >
                    <span
                      className={`mr-3 ${
                        isActive ? "text-[#FDB827]" : "text-gray-500"
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span>{item.text}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Divider */}
        <div className="h-px bg-gray-100 my-1"></div>

        {/* Settings */}
        <div>
          <Link
            to="/admin/hero"
            className={`
              flex items-center px-4 py-3 text-sm transition-colors
              ${
                location.pathname === "/admin/hero"
                  ? "border-l-4 border-[#FDB827] text-[#FDB827]"
                  : "border-l-4 border-transparent hover:bg-gray-50"
              }
            `}
          >
            <span
              className={`mr-3 ${
                location.pathname === "/admin/hero"
                  ? "text-[#FDB827]"
                  : "text-gray-500"
              }`}
            >
              <Settings size={20} />
            </span>
            <span>Settings</span>
          </Link>
        </div>

        {/* logout Button */}
        <div className="absolute bottom-4 w-full px-4">
          <button
            onClick={handleLogout}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`flex items-center justify-center gap-2 w-full bg-red-500 text-white px-4 py-2 rounded-lg transition-all duration-300 ${
              isHovered ? "bg-red-600 shadow-md" : ""
            }`}
          >
            <LogOut size={18} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content Area - No gap between sidebar and content */}
      <div className="flex-grow overflow-auto bg-gray-50">
        {/* Content will be rendered here by React Router */}
      </div>
    </div>
  );
};

export default Sidebar;
