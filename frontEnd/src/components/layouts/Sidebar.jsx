import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  UploadCloud,
  GitCompare,
  Bot,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { cn } from '../common/Button';
import { Logo } from '../common/Logo';

const baseNavigationItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Contracts', path: '/contracts', icon: FileText },
  { name: 'Upload Contract', path: '/upload', icon: UploadCloud },
  { name: 'Compare Contracts', path: '/compare', icon: GitCompare },
  { name: 'AI Assistant', path: '/chat', icon: Bot },
  { name: 'Reports', path: '/reports', icon: BarChart3 },
  { name: 'Notifications', path: '/notifications', icon: Bell },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export const Sidebar = ({ isMobileOpen, setIsMobileOpen }) => {
  const navigate = useNavigate();
  const { logout, user, isAdmin } = useAuth();
  const { unreadCount } = useNotifications();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigationItems = isAdmin
    ? [
        ...baseNavigationItems,
        { name: 'Admin Portal', path: '/admin', icon: ShieldCheck, isAdminOnly: true },
      ]
    : baseNavigationItems;

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed md:static inset-y-0 left-0 z-50 w-[260px] flex flex-col bg-white border-r border-[#E2E8F0] transition-transform duration-200 ease-in-out select-none shadow-sm',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        {/* Brand Logo Header */}
        <div className="flex items-center px-6 h-[72px] border-b border-[#E2E8F0]">
          <Logo size="md" />
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3.5 py-6 space-y-1.5 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isNotifications = item.name === 'Notifications';
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center justify-between px-3.5 py-2.5 rounded-[12px] text-xs font-semibold transition-all duration-150',
                    item.isAdminOnly
                      ? isActive
                        ? 'bg-purple-600 text-white font-bold shadow-sm'
                        : 'text-purple-700 bg-purple-50 hover:bg-purple-100 font-bold'
                      : isActive
                      ? 'bg-blue-50 text-[#2563EB] font-bold shadow-sm'
                      : 'text-[#475569] hover:text-[#0F172A] hover:bg-slate-50'
                  )
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-current" />
                  <span>{item.name}</span>
                </div>

                {isNotifications && unreadCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-[#2563EB] text-white text-[10px] font-bold">
                    {unreadCount}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-[#E2E8F0] space-y-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-[10px] font-bold text-xs flex items-center justify-center ${
                isAdmin
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-blue-100 text-[#2563EB]'
              }`}
            >
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'CI'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-bold text-[#0F172A] truncate">{user?.name || 'User'}</p>
                <span
                  className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
                    isAdmin
                      ? 'bg-purple-100 text-purple-700 border border-purple-200'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {user?.role === 'admin' ? 'Admin' : 'User'}
                </span>
              </div>
              <p className="text-[11px] text-[#475569] truncate">{user?.company || 'Enterprise'}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-[10px] text-xs font-semibold text-red-600 hover:bg-red-50 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
