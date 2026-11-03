import React from 'react';

export const Card = ({ children, className = '', title, subtitle, action }) => {
  return (
    <div className={`glass-card rounded-2xl p-6 relative overflow-hidden bg-white border border-slate-200/80 shadow-xs ${className}`}>
      {(title || subtitle || action) && (
        <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-4">
          <div>
            {title && <h3 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
