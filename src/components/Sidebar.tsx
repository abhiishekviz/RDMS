import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Upload, Search, Users, FileText, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function Sidebar() {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/upload', icon: Upload, label: 'Upload Document' },
    { path: '/search', icon: Search, label: 'Search Document' },
    { path: '/profile', icon: Users, label: 'Profile' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="bg-white h-screen w-64 fixed left-0 top-0 shadow-lg">
      <div className="p-4 border-b">
        <div className="flex items-center space-x-2">
          <FileText className="h-8 w-8 text-red-600" />
          <span className="text-xl font-bold text-red-600">RDMS</span>
        </div>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-red-50 text-red-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
          <li>
            <button
              onClick={logout}
              className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-gray-50 w-full"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;