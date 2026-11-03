import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';
import { BrainCircuit, Info, Sparkles } from 'lucide-react';

export const CampaignPrediction = () => {
  const { showInfo } = useToast();
  const [campaignName, setCampaignName] = useState('');
  const [budget, setBudget] = useState('');
  const [platform, setPlatform] = useState('LinkedIn');
  const [targetAudience, setTargetAudience] = useState('');
  const [duration, setDuration] = useState('30 Days');
  const [objective, setObjective] = useState('Lead Generation');

  const [mlNoticeModal, setMlNoticeModal] = useState(false);

  const handlePredict = (e) => {
    e.preventDefault();
    setMlNoticeModal(true);
    showInfo("ML Integration Required: Prediction model not connected yet.");
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-slate-200 bg-white">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Campaign Prediction</h1>
            <p className="text-xs text-slate-500">
              Configure parameters to forecast campaign reach, conversions, and acquisition costs.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Controls */}
        <div className="lg:col-span-2">
          <form onSubmit={handlePredict}>
            <Card title="Simulation Parameters">
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Campaign Name</label>
                  <input
                    type="text"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    placeholder="e.g. Q4 Lead Gen Campaign"
                    className="w-full px-3.5 py-2 rounded-xl glass-input text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Budget ($ USD)</label>
                    <input
                      type="number"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      placeholder="5000"
                      className="w-full px-3.5 py-2 rounded-xl glass-input text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Platform</label>
                    <select
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl glass-input text-slate-900 bg-white"
                    >
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="X/Twitter">X/Twitter</option>
                      <option value="Instagram">Instagram</option>
                      <option value="Facebook">Facebook</option>
                      <option value="Email">Email</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Duration</label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl glass-input text-slate-900 bg-white"
                    >
                      <option value="7 Days">7 Days</option>
                      <option value="14 Days">14 Days</option>
                      <option value="30 Days">30 Days</option>
                      <option value="60 Days">60 Days</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Marketing Objective</label>
                    <select
                      value={objective}
                      onChange={(e) => setObjective(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl glass-input text-slate-900 bg-white"
                    >
                      <option value="Lead Generation">Lead Generation</option>
                      <option value="Brand Awareness">Brand Awareness</option>
                      <option value="Product Conversions">Product Conversions</option>
                      <option value="Web Traffic">Web Traffic</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Audience</label>
                  <input
                    type="text"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="e.g. Founders, Tech Managers"
                    className="w-full px-3.5 py-2 rounded-xl glass-input text-slate-900"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <Button type="submit" variant="primary" icon={Sparkles}>
                    Predict Campaign Performance
                  </Button>
                </div>
              </div>
            </Card>
          </form>
        </div>

        {/* Prediction Results Area */}
        <div>
          <Card title="Predicted Results">
            <div className="min-h-[280px] flex flex-col items-center justify-center text-center p-6 bg-slate-50/60 rounded-2xl border border-dashed border-slate-200">
              <BrainCircuit className="w-10 h-10 text-slate-300 mb-3" />
              <h4 className="text-sm font-bold text-slate-800">No predictions generated</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
                Campaign prediction requires the ML model integration.
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* ML INTEGRATION NOTICE MODAL */}
      {mlNoticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 text-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto mb-4">
              <Info className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">ML Model Integration Required</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Campaign prediction requires the ML model integration. All form parameters are structured and ready to pass into the predictive model once connected.
            </p>
            <div className="mt-6">
              <Button onClick={() => setMlNoticeModal(false)} variant="primary" className="w-full">
                Understood
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
