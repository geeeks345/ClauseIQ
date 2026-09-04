import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Menu, Bell, Search, Plus, User, LogOut, UploadCloud, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { Button } from '../common/Button';

export const Navbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/contracts?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 h-[72px] bg-white border-b border-[#E2E8F0] px-6 md:px-10 flex items-center justify-between gap-4 shadow-sm">
      {/* Mobile Toggle & Search */}
      <div className="flex items-center gap-4 flex-1 max-w-lg">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-[10px] text-[#475569] hover:bg-slate-100 md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <form onSubmit={handleSearch} className="relative flex-1 hidden sm:block">
          <Search className="w-4 h-4 text-[#475569] absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search contracts, clauses, risks..."
            className="w-full pl-10 pr-4 py-2 text-xs enterprise-input"
          />
        </form>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3.5">
        <Link to="/upload">
          <Button variant="primary" size="sm" className="hidden sm:inline-flex">
            <UploadCloud className="w-4 h-4 mr-1.5" />
            Upload Contract
          </Button>
        </Link>

        {/* Notifications Icon */}
        <Link
          to="/notifications"
          className="relative p-2.5 rounded-[12px] text-[#475569] hover:text-[#0F172A] hover:bg-slate-100 transition border border-[#E2E8F0]"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#2563EB] ring-2 ring-white" />
          )}
        </Link>

        {/* User Avatar Menu */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 p-1 rounded-[12px] hover:bg-slate-100 transition"
          >
            <div className="w-9 h-9 rounded-[12px] bg-blue-50 border border-blue-200 text-[#2563EB] font-bold text-xs flex items-center justify-center">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'CI'}
            </div>
          </button>

          {showDropdown && (
            <div
              className="absolute right-0 mt-2 w-56 bg-white border border-[#E2E8F0] rounded-[16px] shadow-xl py-2 z-50 animate-fade-in"
              onClick={() => setShowDropdown(false)}
            >
              <div className="px-4 py-2.5 border-b border-[#E2E8F0]">
                <p className="text-xs font-bold text-[#0F172A]">{user?.name || 'User'}</p>
                <p className="text-[11px] text-[#475569] truncate">{user?.email}</p>
                <span className="inline-block mt-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200">
                  {user?.company || 'Enterprise'}
                </span>
              </div>
              <Link
                to="/settings"
                className="block px-4 py-2 text-xs font-medium text-[#475569] hover:bg-slate-50"
              >
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition text-left"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
