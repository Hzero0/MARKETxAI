import React, { useState } from 'react';
import { useCampaigns } from '../../context/CampaignContext';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ExportButton } from '../../components/export/ExportButton';
import {
  Megaphone,
  Plus,
  Trash2,
  Edit2,
  Copy,
  Layers
} from 'lucide-react';

export const Campaigns = () => {
  const { campaigns, addCampaign, updateCampaign, deleteCampaign, duplicateCampaign } = useCampaigns();
  const { showSuccess } = useToast();

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    product: '',
    objective: '',
    targetAudience: '',
    budget: '',
    startDate: '',
    endDate: '',
    platforms: ['LinkedIn'],
    status: 'Draft',
    description: ''
  });

  const platformsList = ["LinkedIn", "X/Twitter", "Instagram", "Facebook", "Email", "YouTube"];

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      name: '',
      product: '',
      objective: '',
      targetAudience: '',
      budget: '',
      startDate: '',
      endDate: '',
      platforms: ['LinkedIn'],
      status: 'Draft',
      description: ''
    });
    setShowModal(true);
  };

  const handleOpenEdit = (camp) => {
    setEditingId(camp.id);
    setFormData({ ...camp });
    setShowModal(true);
  };

  const handlePlatformToggle = (platform) => {
    const current = formData.platforms || [];
    const updated = current.includes(platform)
      ? current.filter((p) => p !== platform)
      : [...current, platform];
    setFormData({ ...formData, platforms: updated });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;

    if (editingId) {
      updateCampaign(editingId, formData);
      showSuccess(`Campaign "${formData.name}" updated successfully!`);
    } else {
      addCampaign(formData);
      showSuccess(`Campaign "${formData.name}" created successfully!`);
    }

    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-slate-200 bg-white">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Megaphone className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Marketing Campaigns</h1>
            <p className="text-xs text-slate-500">
              Create and manage your marketing campaigns across digital platforms.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {campaigns.length > 0 && (
            <ExportButton data={campaigns} filename="campaigns-export.csv" title="Export Campaigns" />
          )}
          <Button onClick={handleOpenCreate} variant="primary" icon={Plus}>
            Create Campaign
          </Button>
        </div>
      </div>

      {/* CAMPAIGN LIST OR CLEAN EMPTY STATE */}
      {campaigns.length === 0 ? (
        <Card className="text-center py-16 border-dashed border-2 border-slate-200">
          <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">No campaigns yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
            Create your first marketing campaign to organize platforms, schedules, and budgets.
          </p>
          <Button onClick={handleOpenCreate} variant="primary" icon={Plus}>
            + Create Campaign
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((c) => (
            <Card key={c.id} className="relative flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <Badge variant={c.status === 'Running' ? 'emerald' : c.status === 'Scheduled' ? 'indigo' : 'slate'}>
                    {c.status}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => duplicateCampaign(c.id)}
                      title="Duplicate"
                      className="p-1 text-slate-400 hover:text-slate-700 rounded-md"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(c)}
                      title="Edit"
                      className="p-1 text-slate-400 hover:text-indigo-600 rounded-md"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete campaign "${c.name}"?`)) deleteCampaign(c.id);
                      }}
                      title="Delete"
                      className="p-1 text-slate-400 hover:text-rose-600 rounded-md"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-tight">{c.name}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{c.description || 'No description provided.'}</p>

                <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Budget:</span>
                    <span className="font-bold text-slate-900">${Number(c.budget || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Platforms:</span>
                    <span className="font-semibold text-indigo-600">{c.platforms?.join(', ') || 'None'}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              {editingId ? 'Edit Campaign' : 'Create New Campaign'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Campaign Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Q3 Growth Campaign"
                  className="w-full px-3.5 py-2 rounded-xl glass-input text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Budget ($ USD)</label>
                <input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  placeholder="5000"
                  className="w-full px-3.5 py-2 rounded-xl glass-input text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl glass-input text-slate-900 bg-white"
                >
                  <option value="Draft">Draft</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Running">Running</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Platforms</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {platformsList.map((p) => {
                    const sel = (formData.platforms || []).includes(p);
                    return (
                      <button
                        type="button"
                        key={p}
                        onClick={() => handlePlatformToggle(p)}
                        className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all ${
                          sel ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-50 text-slate-600 border-slate-200'
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Campaign strategy description..."
                  className="w-full px-3.5 py-2 rounded-xl glass-input text-slate-900 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  {editingId ? 'Save Changes' : 'Create Campaign'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
