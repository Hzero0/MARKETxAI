import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';
import { Wand2, Info, Sparkles, Layers } from 'lucide-react';

export const ContentStudio = () => {
  const { showInfo } = useToast();
  const [contentType, setContentType] = useState('Social Media Post');
  const [platform, setPlatform] = useState('LinkedIn');
  const [product, setProduct] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [tone, setTone] = useState('Professional');
  const [keywords, setKeywords] = useState('');
  const [instructions, setInstructions] = useState('');

  const [aiNoticeModal, setAiNoticeModal] = useState(false);

  const handleGenerate = (e) => {
    e.preventDefault();
    setAiNoticeModal(true);
    showInfo("AI Integration Required: AI generator module not connected yet.");
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-slate-200 bg-white">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Wand2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Content Studio</h1>
            <p className="text-xs text-slate-500">
              Configure parameters for AI marketing content generation and social media drafting.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Controls */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleGenerate} className="space-y-6">
            <Card title="Content Parameters">
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Content Type</label>
                    <select
                      value={contentType}
                      onChange={(e) => setContentType(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl glass-input text-slate-900 bg-white"
                    >
                      <option value="Social Media Post">Social Media Post</option>
                      <option value="Advertisement Copy">Advertisement Copy</option>
                      <option value="Email Newsletter">Email Newsletter</option>
                      <option value="Product Description">Product Description</option>
                      <option value="Campaign Concept">Campaign Concept</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Target Platform</label>
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
                    <label className="block font-semibold text-slate-700 mb-1">Product / Service</label>
                    <input
                      type="text"
                      value={product}
                      onChange={(e) => setProduct(e.target.value)}
                      placeholder="e.g. Analytics Platform"
                      className="w-full px-3.5 py-2 rounded-xl glass-input text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Brand Tone</label>
                    <select
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl glass-input text-slate-900 bg-white"
                    >
                      <option value="Professional">Professional & Direct</option>
                      <option value="Casual & Friendly">Casual & Friendly</option>
                      <option value="Urgent & Bold">Urgent & Bold</option>
                      <option value="Educational">Educational & Informative</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Audience</label>
                  <input
                    type="text"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="e.g. Startup Founders, Operations Directors"
                    className="w-full px-3.5 py-2 rounded-xl glass-input text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Keywords / Tags</label>
                  <input
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="e.g. #SaaS, #Productivity, #Growth"
                    className="w-full px-3.5 py-2 rounded-xl glass-input text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Custom Prompt / Instructions</label>
                  <textarea
                    rows={3}
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="Provide specific instructions or key points to include..."
                    className="w-full px-3.5 py-2 rounded-xl glass-input text-slate-900 resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <Button type="submit" variant="primary" icon={Sparkles}>
                    Generate Content
                  </Button>
                </div>
              </div>
            </Card>
          </form>
        </div>

        {/* Output Panel / Empty State */}
        <div className="space-y-6">
          <Card title="Generated Content Output">
            <div className="min-h-[320px] flex flex-col items-center justify-center text-center p-6 bg-slate-50/60 rounded-2xl border border-dashed border-slate-200">
              <Layers className="w-10 h-10 text-slate-300 mb-3" />
              <h4 className="text-sm font-bold text-slate-800">No content created yet.</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
                Configure your parameters on the left and click Generate Content to create marketing copy.
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* AI INTEGRATION NOTICE MODAL */}
      {aiNoticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 text-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto mb-4">
              <Info className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">AI Integration Placeholder</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              AI content generation will be available after AI integration. The frontend UI parameters are fully configured and ready for the backend AI service connection.
            </p>
            <div className="mt-6">
              <Button onClick={() => setAiNoticeModal(false)} variant="primary" className="w-full">
                Got It
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
