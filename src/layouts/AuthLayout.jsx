import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden gradient-bg-subtle">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Brand Header */}
      <div className="flex items-center justify-between max-w-7xl w-full mx-auto z-10">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-pink-500 p-0.5 shadow-md shadow-indigo-500/20">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-indigo-600" />
            </div>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-extrabold text-lg text-slate-900 tracking-tight">MARKETxAI</span>
            <span className="text-[10px] font-semibold text-indigo-600 tracking-wider uppercase mt-1">AI Startup Marketing</span>
          </div>
        </Link>
      </div>

      {/* Auth Content Card Outlet */}
      <div className="flex-1 flex items-center justify-center my-8 z-10">
        <Outlet />
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-slate-400 z-10">
        AI Startup Marketing Assistant &copy; {new Date().getFullYear()} Academic Project Demo
      </div>
    </div>
  );
};
