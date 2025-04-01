import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../../lib/auth-context";
import {
  Users,
  Utensils,
  BarChart3,
  Settings,
  LogOut,
  Home,
  MessageSquare,
} from "lucide-react";

const AdminDashboard = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <div className="flex items-center space-x-2">
            <div className="rounded-full bg-primary p-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-primary-foreground"
              >
                <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                <line x1="6" y1="1" x2="6" y2="4" />
                <line x1="10" y1="1" x2="10" y2="4" />
                <line x1="14" y1="1" x2="14" y2="4" />
              </svg>
            </div>
            <span className="text-xl font-bold">FitTrack Admin</span>
          </div>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link
                to="/admin/dashboard"
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100"
              >
                <Home className="h-5 w-5 text-gray-500" />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/users"
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100"
              >
                <Users className="h-5 w-5 text-gray-500" />
                <span>User Management</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/food"
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100"
              >
                <Utensils className="h-5 w-5 text-gray-500" />
                <span>Food Database</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/ads"
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100"
              >
                <MessageSquare className="h-5 w-5 text-gray-500" />
                <span>Ad Generator</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/analytics"
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100"
              >
                <BarChart3 className="h-5 w-5 text-gray-500" />
                <span>Analytics</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/settings"
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100"
              >
                <Settings className="h-5 w-5 text-gray-500" />
                <span>Settings</span>
              </Link>
            </li>
          </ul>

          <div className="pt-8 mt-8 border-t">
            <div className="flex items-center space-x-2 p-4">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                {user?.name?.[0] || user?.email?.[0] || "A"}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{user?.name || "Admin"}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 text-red-500"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
