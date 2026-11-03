import React, { useState, useEffect } from 'react';
import { useStartup } from '../../context/StartupContext';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Building2, Save, RotateCcw, Edit3 } from 'lucide-react';

export const StartupProfile = () => {
  const { profile, updateProfile, resetProfile } = useStartup();
  const { showSuccess, showInfo } = useToast();

  const [isEditing, setIsEditing] = useState(true);
  const [formData, setFormData] = useState({ ...profile });

  useEffect(() => {
    setFormData({ ...profile });
  }, [profile]);

  const platformsList = ["LinkedIn", "X/Twitter", "Instagram", "Facebook", "Email", "YouTube"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlatformToggle = (platform) => {
    const current = formData.preferredPlatforms || [];
    const updated = current.includes(platform)
      ? current.filter((p) => p !== platform)
      : [...current, platform];
    setFormData((prev) => ({ ...prev, preferredPlatforms: updated }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.businessName || !formData.productName) {
      alert("Startup Name and Product/Service are required.");
      return;
    }
    updateProfile(formData);
    showSuccess("Startup profile updated successfully!");
    setIsEditing(false);
  };

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear all profile information?")) {
      const reset = resetProfile();
      setFormData(reset);
      showInfo("Startup profile cleared.");
      setIsEditing(true);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-slate-200 bg-white">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Startup Profile</h1>
            <p className="text-xs text-slate-500">
              Enter and manage your business identity, target audience, brand tone, and marketing budget.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleClear}
            icon={RotateCcw}
          >
            Clear Profile
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            icon={Edit3}
          >
            {isEditing ? 'View Mode' : 'Edit Profile'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Core Business Info */}
        <Card title="General Business Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Startup / Business Name *</label>
              <input
                type="text"
                name="businessName"
                disabled={!isEditing}
                value={formData.businessName || ''}
                onChange={handleChange}
                placeholder="Enter your startup name"
                className="w-full px-3.5 py-2 rounded-xl text-sm glass-input text-slate-900 disabled:opacity-60"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Product / Service Name *</label>
              <input
                type="text"
                name="productName"
                disabled={!isEditing}
                value={formData.productName || ''}
                onChange={handleChange}
                placeholder="Enter your product or service name"
                className="w-full px-3.5 py-2 rounded-xl text-sm glass-input text-slate-900 disabled:opacity-60"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Industry Category</label>
              <input
                type="text"
                name="industry"
                disabled={!isEditing}
                value={formData.industry || ''}
                onChange={handleChange}
                placeholder="e.g. HealthTech, B2B SaaS, E-Commerce"
                className="w-full px-3.5 py-2 rounded-xl text-sm glass-input text-slate-900 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Brand Voice & Tone</label>
              <select
                name="brandTone"
                disabled={!isEditing}
                value={formData.brandTone || 'Professional'}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl text-sm glass-input text-slate-900 disabled:opacity-60 bg-white"
              >
                <option value="Professional">Professional & Direct</option>
                <option value="Casual & Friendly">Casual & Friendly</option>
                <option value="Energetic & Bold">Energetic & Bold</option>
                <option value="Corporate & Educational">Corporate & Educational</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Business Description</label>
              <textarea
                name="businessDescription"
                disabled={!isEditing}
                rows={3}
                value={formData.businessDescription || ''}
                onChange={handleChange}
                placeholder="Describe what your startup does and its core value proposition..."
                className="w-full px-3.5 py-2 rounded-xl text-sm glass-input text-slate-900 disabled:opacity-60 resize-none"
              />
            </div>
          </div>
        </Card>

        {/* Target Audience & Strategy */}
        <Card title="Marketing Strategy & Objectives">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Audience</label>
              <input
                type="text"
                name="targetAudience"
                disabled={!isEditing}
                value={formData.targetAudience || ''}
                onChange={handleChange}
                placeholder="e.g. Small Business Owners aged 25-45"
                className="w-full px-3.5 py-2 rounded-xl text-sm glass-input text-slate-900 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Location / Target Region</label>
              <input
                type="text"
                name="location"
                disabled={!isEditing}
                value={formData.location || ''}
                onChange={handleChange}
                placeholder="e.g. North America, Global Remote"
                className="w-full px-3.5 py-2 rounded-xl text-sm glass-input text-slate-900 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Marketing Objective</label>
              <input
                type="text"
                name="marketingObjective"
                disabled={!isEditing}
                value={formData.marketingObjective || ''}
                onChange={handleChange}
                placeholder="e.g. Increase Brand Awareness, Lead Gen"
                className="w-full px-3.5 py-2 rounded-xl text-sm glass-input text-slate-900 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Marketing Budget ($ USD)</label>
              <input
                type="number"
                name="marketingBudget"
                disabled={!isEditing}
                value={formData.marketingBudget || ''}
                onChange={handleChange}
                placeholder="0"
                className="w-full px-3.5 py-2 rounded-xl text-sm glass-input text-slate-900 disabled:opacity-60"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-2">Preferred Platforms</label>
              <div className="flex flex-wrap gap-2">
                {platformsList.map((platform) => {
                  const selected = (formData.preferredPlatforms || []).includes(platform);
                  return (
                    <button
                      key={platform}
                      type="button"
                      disabled={!isEditing}
                      onClick={() => handlePlatformToggle(platform)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        selected
                          ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {platform}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>

        {/* Contact Information */}
        <Card title="Contact & Public Presence">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Website URL</label>
              <input
                type="url"
                name="website"
                disabled={!isEditing}
                value={formData.website || ''}
                onChange={handleChange}
                placeholder="https://yourstartup.com"
                className="w-full px-3.5 py-2 rounded-xl text-sm glass-input text-slate-900 disabled:opacity-60"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Email</label>
              <input
                type="email"
                name="contactEmail"
                disabled={!isEditing}
                value={formData.contactEmail || ''}
                onChange={handleChange}
                placeholder="contact@yourstartup.com"
                className="w-full px-3.5 py-2 rounded-xl text-sm glass-input text-slate-900 disabled:opacity-60"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone</label>
              <input
                type="text"
                name="contactPhone"
                disabled={!isEditing}
                value={formData.contactPhone || ''}
                onChange={handleChange}
                placeholder="+1 (800) 000-0000"
                className="w-full px-3.5 py-2 rounded-xl text-sm glass-input text-slate-900 disabled:opacity-60"
              />
            </div>
          </div>
        </Card>

        {/* Form Actions */}
        {isEditing && (
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="submit" variant="primary" icon={Save}>
              Save Profile
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};
