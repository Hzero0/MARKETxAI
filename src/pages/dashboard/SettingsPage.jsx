import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { storageUtils } from '../../utils/storageUtils';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { Settings, Save, RotateCcw, User } from 'lucide-react';

export const SettingsPage = () => {
  const { showSuccess, showInfo } = useToast();
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [theme, setTheme] = useState('light');
  const [emailNotifications, setEmailNotifications] = useState(true);

  const handleSave = (e) => {
    e.preventDefault();
    if (updateProfile) {
      updateProfile({ name, email });
    }
    showSuccess("Settings and profile updated successfully.");
  };

  const handleClearData = () => {
    if (window.confirm("Are you sure you want to clear all user-created data (Startup profile, campaigns, competitors, feedback)?")) {
      storageUtils.clearAllUserData();
      showInfo("All user data has been cleared.");
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-slate-200 bg-white">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Platform Settings</h1>
            <p className="text-xs text-slate-500">
              Manage profile information, display themes, and data storage.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Card title="User Profile">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-slate-900 bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-3.5 py-2.5 rounded-xl glass-input text-slate-900 bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </Card>

        <Card title="Display & Workspace Settings">
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Color Theme</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full sm:w-64 px-3.5 py-2 rounded-xl glass-input text-slate-900 bg-white"
              >
                <option value="light">Light Mode</option>
                <option value="dark">Dark Mode (Beta)</option>
              </select>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="notify"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="notify" className="font-semibold text-slate-700">
                Enable local workspace action notifications
              </label>
            </div>
          </div>
        </Card>

        <Card title="Data Management">
          <div className="space-y-3 text-xs">
            <p className="text-slate-500 leading-relaxed">
              Clear all stored startup profiles, campaigns, audience segments, competitor records, and feedback from local storage.
            </p>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleClearData}
              icon={RotateCcw}
              className="text-rose-600 border-rose-200 hover:bg-rose-50"
            >
              Clear All Stored User Data
            </Button>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" variant="primary" icon={Save}>
            Save Preferences
          </Button>
        </div>
      </form>
    </div>
  );
};
