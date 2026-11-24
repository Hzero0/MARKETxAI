import React, { useState } from 'react';
import { Menu, Bell, User, LogOut, Sparkles, Building2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStartup } from '../../context/StartupContext';
import { useNavigate } from 'react-router-dom';

export const Header = ({ setMobileOpen }) => {
  const { user, logout } = useAuth();
  const { profile } = useStartup();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const hasProfile = !!(profile && profile.businessName);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200/90 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-4">
        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Active Startup Badge */}
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-100/90 border border-slate-200">
          <Building2 className="w-4 h-4 text-indigo-600 shrink-0" />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-900 leading-none">
              {hasProfile ? profile.businessName : 'My Startup'}
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5">
              {hasProfile ? (profile.productName || profile.industry || 'Startup Profile') : 'Profile Not Configured'}
            </span>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="relative p-2.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <Bell className="w-5 h-5" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-slate-200 shadow-xl p-4 z-50 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Notifications</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                  System
                </span>
              </div>
              <div className="mt-3 text-center py-6 text-slate-400 text-xs">
                No new notifications.
              </div>
            </div>
          )}
        </div>

        {/* Profile Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-3 p-1 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs ring-2 ring-indigo-500/30">
              {user?.name ? user.name.charAt(0) : 'U'}
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-900 leading-tight">{user?.name || "User"}</span>
              <span className="text-[10px] text-indigo-600 font-medium">{user?.role || "Founder"}</span>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200 shadow-xl p-2 z-50 animate-fadeIn">
              <div className="p-3 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{user?.name || "User"}</p>
                <p className="text-[11px] text-slate-500 truncate">{user?.email || "user@startup.com"}</p>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate('/app/profile');
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg flex items-center gap-2"
                >
                  <User className="w-4 h-4 text-indigo-600" />
                  Startup Profile
                </button>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate('/app/settings');
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-violet-600" />
                  Settings
                </button>
              </div>
              <div className="pt-1 border-t border-slate-100">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
