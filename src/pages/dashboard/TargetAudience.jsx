import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { storageUtils } from '../../utils/storageUtils';
import { useToast } from '../../context/ToastContext';
import { Users, Plus, Trash2, Layers } from 'lucide-react';

export const TargetAudience = () => {
  const { showSuccess } = useToast();
  const [segments, setSegments] = useState(() => storageUtils.getAudienceSegments());
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    ageRange: '',
    primaryInterest: '',
    preferredChannel: ''
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!formData.name) return;

    const newSeg = { id: "seg-" + Date.now(), ...formData };
    const updated = [newSeg, ...segments];
    setSegments(updated);
    storageUtils.saveAudienceSegments(updated);
    showSuccess(`Audience segment "${formData.name}" added.`);
    setShowModal(false);
    setFormData({ name: '', ageRange: '', primaryInterest: '', preferredChannel: '' });
  };

  const handleDelete = (id) => {
    const updated = segments.filter((s) => s.id !== id);
    setSegments(updated);
    storageUtils.saveAudienceSegments(updated);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-slate-200 bg-white">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Target Audience</h1>
            <p className="text-xs text-slate-500">
              Define customer demographic profiles and market segments manually.
            </p>
          </div>
        </div>

        <Button onClick={() => setShowModal(true)} variant="primary" icon={Plus}>
          Add Segment
        </Button>
      </div>

      {/* SEGMENT LIST OR CLEAN EMPTY STATE */}
      {segments.length === 0 ? (
        <Card className="text-center py-16 border-dashed border-2 border-slate-200">
          <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">No audience data available</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
            Add customer audience segments manually to define your key buyer personas.
          </p>
          <Button onClick={() => setShowModal(true)} variant="primary" icon={Plus}>
            + Add Audience Segment
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {segments.map((seg) => (
            <Card key={seg.id} className="relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-bold text-slate-900">{seg.name}</h3>
                  <button
                    onClick={() => handleDelete(seg.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded-md"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 text-xs text-slate-600 mt-3 pt-3 border-t border-slate-100">
                  <p><span className="font-semibold text-slate-700">Age Range:</span> {seg.ageRange || 'Not specified'}</p>
                  <p><span className="font-semibold text-slate-700">Primary Interest:</span> {seg.primaryInterest || 'Not specified'}</p>
                  <p><span className="font-semibold text-slate-700">Preferred Channel:</span> {seg.preferredChannel || 'Not specified'}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ADD SEGMENT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Add Target Audience Segment</h2>

            <form onSubmit={handleAdd} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Segment Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Small Business Founders"
                  className="w-full px-3.5 py-2 rounded-xl glass-input text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Age Range</label>
                <input
                  type="text"
                  value={formData.ageRange}
                  onChange={(e) => setFormData({ ...formData, ageRange: e.target.value })}
                  placeholder="e.g. 25 - 45"
                  className="w-full px-3.5 py-2 rounded-xl glass-input text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Primary Interest</label>
                <input
                  type="text"
                  value={formData.primaryInterest}
                  onChange={(e) => setFormData({ ...formData, primaryInterest: e.target.value })}
                  placeholder="e.g. Business Growth, Productivity"
                  className="w-full px-3.5 py-2 rounded-xl glass-input text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Preferred Channel</label>
                <input
                  type="text"
                  value={formData.preferredChannel}
                  onChange={(e) => setFormData({ ...formData, preferredChannel: e.target.value })}
                  placeholder="e.g. LinkedIn, Email"
                  className="w-full px-3.5 py-2 rounded-xl glass-input text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Save Segment
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
