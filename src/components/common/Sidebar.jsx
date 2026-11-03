import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Megaphone,
  Wand2,
  Users,
  LineChart,
  BrainCircuit,
  MessageSquareHeart,
  Lightbulb,
  Swords,
  BarChart3,
  MessageSquarePlus,
  Settings,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const MENU_ITEMS = [
  { path: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/app/profile', label: 'Startup Profile', icon: Building2 },
  { path: '/app/campaigns', label: 'Marketing Campaigns', icon: Megaphone },
  { path: '/app/content-studio', label: 'Content Studio', icon: Wand2 },
  { path: '/app/target-audience', label: 'Target Audience', icon: Users },
  { path: '/app/customer-insights', label: 'Customer Insights', icon: LineChart },
  { path: '/app/prediction', label: 'Campaign Prediction', icon: BrainCircuit },
  { path: '/app/sentiment', label: 'Sentiment Analysis', icon: MessageSquareHeart },
  { path: '/app/recommendations', label: 'Recommendations', icon: Lightbulb },
  { path: '/app/competitors', label: 'Competitor Analysis', icon: Swords },
  { path: '/app/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/app/feedback', label: 'Feedback', icon: MessageSquarePlus },
  { path: '/app/settings', label: 'Settings', icon: Settings },
];

export const Sidebar = ({ isCollapsed, setIsCollapsed, mobileOpen, setMobileOpen }) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-white border-r border-slate-200/90 flex flex-col transition-all duration-300 shadow-sm ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 shrink-0">
          <Link to="/" className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-500 p-0.5 shadow-md shadow-indigo-500/20 shrink-0">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-indigo-600" />
              </div>
            </div>
            {!isCollapsed && (
              <div className="flex flex-col truncate">
                <span className="font-extrabold text-sm text-slate-900 tracking-tight leading-none">
                  MARKETxAI
                </span>
                <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest mt-1">
                  Marketing Portal
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group relative ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                {!isCollapsed && <span className="truncate flex-1">{item.label}</span>}
                {/* Tooltip when collapsed */}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2.5 py-1 rounded-md bg-slate-900 text-white text-xs font-medium whitespace-nowrap shadow-xl border border-slate-700 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                    {item.label}
                  </div>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Sidebar Footer Badge */}
        {!isCollapsed && (
          <div className="p-3 m-3 rounded-xl bg-slate-50 border border-slate-200 text-center shrink-0">
            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-1">
              Clean State Mode
            </span>
            <p className="text-[10px] text-slate-500 leading-tight">
              Ready for AI & ML Backend Integration.
            </p>
          </div>
        )}
      </aside>
    </>
  );
};
