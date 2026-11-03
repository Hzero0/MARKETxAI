import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { storageUtils } from '../../utils/storageUtils';
import { useToast } from '../../context/ToastContext';
import { Swords, Plus, Trash2, Layers } from 'lucide-react';

export const CompetitorAnalysis = () => {
  const { showSuccess } = useToast();
  const [competitors, setCompetitors] = useState(() => storageUtils.getCompetitors());
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    website: '',
    marketShare: '',
    strengths: '',
    weaknesses: ''
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!formData.name) return;

    const newComp = { id: "comp-" + Date.now(), ...formData };
    const updated = [newComp, ...competitors];
    setCompetitors(updated);
    storageUtils.saveCompetitors(updated);
    showSuccess(`Competitor "${formData.name}" added successfully.`);
    setShowModal(false);
    setFormData({ name: '', website: '', marketShare: '', strengths: '', weaknesses: '' });
  };

  const handleDelete = (id) => {
    const updated = competitors.filter((c) => c.id !== id);
    setCompetitors(updated);
    storageUtils.saveCompetitors(updated);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-slate-200 bg-white">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Swords className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Competitor Analysis</h1>
            <p className="text-xs text-slate-500">
              Benchmark your market positioning and track industry competitors manually.
            </p>
          </div>
        </div>

        <Button onClick={() => setShowModal(true)} variant="primary" icon={Plus}>
          Add Competitor
        </Button>
      </div>

      {/* COMPETITOR LIST OR CLEAN EMPTY STATE */}
      {competitors.length === 0 ? (
        <Card className="text-center py-16 border-dashed border-2 border-slate-200">
          <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">No competitors added</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
            Add competitors to compare market positioning, strengths, and strategies.
          </p>
          <Button onClick={() => setShowModal(true)} variant="primary" icon={Plus}>
            + Add Competitor
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {competitors.map((comp) => (
            <Card key={comp.id} className="relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-bold text-slate-900">{comp.name}</h3>
                  <button
                    onClick={() => handleDelete(comp.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded-md"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 text-xs text-slate-600 mt-3 pt-3 border-t border-slate-100">
                  <p><span className="font-semibold text-slate-700">Website:</span> {comp.website || 'N/A'}</p>
                  <p><span className="font-semibold text-slate-700">Market Share:</span> {comp.marketShare || 'N/A'}</p>
                  <p><span className="font-semibold text-slate-700">Strengths:</span> {comp.strengths || 'N/A'}</p>
                  <p><span className="font-semibold text-slate-700">Weaknesses:</span> {comp.weaknesses || 'N/A'}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ADD COMPETITOR MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Add Industry Competitor</h2>

            <form onSubmit={handleAdd} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Competitor Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Acme Corp"
                  className="w-full px-3.5 py-2 rounded-xl glass-input text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Website URL</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://acmecorp.com"
                  className="w-full px-3.5 py-2 rounded-xl glass-input text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Estimated Market Share</label>
                <input
                  type="text"
                  value={formData.marketShare}
                  onChange={(e) => setFormData({ ...formData, marketShare: e.target.value })}
                  placeholder="e.g. 15%"
                  className="w-full px-3.5 py-2 rounded-xl glass-input text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Key Strengths</label>
                <input
                  type="text"
                  value={formData.strengths}
                  onChange={(e) => setFormData({ ...formData, strengths: e.target.value })}
                  placeholder="e.g. Large distribution, strong brand"
                  className="w-full px-3.5 py-2 rounded-xl glass-input text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Key Weaknesses</label>
                <input
                  type="text"
                  value={formData.weaknesses}
                  onChange={(e) => setFormData({ ...formData, weaknesses: e.target.value })}
                  placeholder="e.g. High pricing, slow innovation"
                  className="w-full px-3.5 py-2 rounded-xl glass-input text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Save Competitor
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
