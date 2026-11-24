import React, { useState, useEffect } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';
import { useStartup } from '../../context/StartupContext';
import { PosterPreview } from '../../components/poster/PosterPreview';
import { generatePosterData, POSTER_THEMES, ASPECT_RATIOS } from '../../utils/posterGenerator';
import {
  Wand2,
  Sparkles,
  Layers,
  Building2,
  History
} from 'lucide-react';

export const ContentStudio = () => {
  const { showSuccess } = useToast();
  const { profile } = useStartup();

  // Form State initialized with StartupProfile values if present
  const [brandName, setBrandName] = useState(() => profile?.businessName || profile?.name || '');
  const [product, setProduct] = useState(() => profile?.productName || profile?.tagline || '');
  const [posterType, setPosterType] = useState('Promotional Poster');
  const [platform, setPlatform] = useState('LinkedIn');
  const [selectedRatio, setSelectedRatio] = useState('portrait');
  const [selectedTheme, setSelectedTheme] = useState('cyber');
  const [targetAudience, setTargetAudience] = useState(() => profile?.targetAudience || '');
  const [tone, setTone] = useState(() => profile?.brandTone || 'Professional');
  const [offer, setOffer] = useState('');
  const [keywords, setKeywords] = useState('');
  const [instructions, setInstructions] = useState('');
  const [website, setWebsite] = useState(() => profile?.website || '');

  // Generation & Output State
  const [isGenerating, setIsGenerating] = useState(false);
  const [activePoster, setActivePoster] = useState(null);
  const [posterHistory, setPosterHistory] = useState([]);

  const handleSyncProfile = () => {
    if (!profile) return;
    setBrandName(profile.businessName || profile.name || 'MyStartup');
    setProduct(profile.productName || profile.tagline || 'AI Solution');
    setTargetAudience(profile.targetAudience || 'Modern Businesses');
    setTone(profile.brandTone || 'Professional');
    setWebsite(profile.website || '');
    showSuccess('Imported details from your Startup Profile!');
  };

  const handleGenerate = (e) => {
    if (e) e.preventDefault();

    setIsGenerating(true);

    // Realistic synthesis delay
    setTimeout(() => {
      const newPoster = generatePosterData({
        brandName: brandName.trim() || profile?.businessName || profile?.name || 'PulseFlow AI',
        product: product.trim() || profile?.productName || 'Smart Marketing Engine',
        targetAudience: targetAudience.trim() || profile?.targetAudience || 'Founders & Growth Teams',
        tone,
        instructions,
        keywords,
        offer,
        platform,
        posterType,
        selectedTheme,
        selectedRatio,
        website: website.trim() || profile?.website || ''
      });

      setActivePoster(newPoster);
      setPosterHistory((prev) => [newPoster, ...prev.slice(0, 9)]);
      setIsGenerating(false);
      showSuccess('Marketing poster generated successfully!');
    }, 750);
  };

  const handleRegenerate = () => {
    handleGenerate();
  };

  const handleSelectTheme = (themeId) => {
    setSelectedTheme(themeId);
    if (activePoster) {
      setActivePoster((prev) => ({ ...prev, theme: themeId }));
    }
  };

  const handleSelectRatio = (ratioId) => {
    setSelectedRatio(ratioId);
    if (activePoster) {
      setActivePoster((prev) => ({ ...prev, aspectRatio: ratioId }));
    }
  };

  const handleQuickDemo = () => {
    setBrandName('PulseFlow AI');
    setProduct('Autonomous Marketing Suite');
    setTargetAudience('Tech Startups & Founders');
    setTone('Urgent & Bold');
    setOffer('50% OFF Launch Week');
    setKeywords('#SaaS, #AI, #StartupGrowth, #Marketing');
    setInstructions('Scale your marketing 10x faster with AI precision targeting');
    setWebsite('www.pulseflow.ai');

    const demoPoster = generatePosterData({
      brandName: 'PulseFlow AI',
      product: 'Autonomous Marketing Suite',
      targetAudience: 'Tech Startups & Founders',
      tone: 'Urgent & Bold',
      instructions: 'Scale your marketing 10x faster with AI precision targeting',
      keywords: '#SaaS, #AI, #StartupGrowth, #Marketing',
      offer: '50% OFF Launch Week',
      platform: 'LinkedIn',
      posterType: 'Promotional Poster',
      selectedTheme: 'cyber',
      selectedRatio: 'portrait',
      website: 'www.pulseflow.ai'
    });

    setActivePoster(demoPoster);
    setPosterHistory((prev) => [demoPoster, ...prev.slice(0, 9)]);
    showSuccess('Generated sample marketing poster!');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-slate-200 bg-white">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-xs">
            <Wand2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Content Studio</h1>
            <p className="text-xs text-slate-500">
              Generate high-converting marketing posters, promotional graphics, and social campaign assets.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleSyncProfile}
            icon={Building2}
          >
            Auto-fill from Profile
          </Button>

          {!activePoster && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleQuickDemo}
              icon={Sparkles}
            >
              Quick Sample
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Controls - Left Column */}
        <div className="lg:col-span-5 space-y-6">
          <form onSubmit={handleGenerate} className="space-y-6">
            <Card title="Poster & Content Parameters">
              <div className="space-y-4 text-xs">
                {/* Brand & Product Names */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Startup / Brand Name *
                    </label>
                    <input
                      type="text"
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      placeholder="e.g. Acme AI"
                      className="w-full px-3.5 py-2 rounded-xl glass-input text-slate-900"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Product / Service *
                    </label>
                    <input
                      type="text"
                      value={product}
                      onChange={(e) => setProduct(e.target.value)}
                      placeholder="e.g. Analytics Suite"
                      className="w-full px-3.5 py-2 rounded-xl glass-input text-slate-900"
                      required
                    />
                  </div>
                </div>

                {/* Poster Type & Platform */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Poster Type</label>
                    <select
                      value={posterType}
                      onChange={(e) => setPosterType(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl glass-input text-slate-900 bg-white"
                    >
                      <option value="Promotional Poster">Promotional Poster</option>
                      <option value="Product Launch Poster">Product Launch Poster</option>
                      <option value="Discount / Special Offer">Discount / Special Offer</option>
                      <option value="Feature Highlight">Feature Highlight</option>
                      <option value="Event & Webinar">Event & Webinar</option>
                      <option value="Brand Awareness">Brand Awareness</option>
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
                      <option value="Instagram">Instagram</option>
                      <option value="X/Twitter">X/Twitter</option>
                      <option value="Facebook">Facebook</option>
                    </select>
                  </div>
                </div>

                {/* Aspect Ratio & Visual Theme */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Poster Format</label>
                    <select
                      value={selectedRatio}
                      onChange={(e) => handleSelectRatio(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl glass-input text-slate-900 bg-white"
                    >
                      {Object.values(ASPECT_RATIOS).map((ratio) => (
                        <option key={ratio.id} value={ratio.id}>
                          {ratio.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Visual Theme</label>
                    <select
                      value={selectedTheme}
                      onChange={(e) => handleSelectTheme(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl glass-input text-slate-900 bg-white"
                    >
                      {Object.values(POSTER_THEMES).map((theme) => (
                        <option key={theme.id} value={theme.id}>
                          {theme.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Target Audience & Brand Tone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Target Audience</label>
                    <input
                      type="text"
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      placeholder="e.g. Founders, Marketing Directors"
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

                {/* Special Offer Badge / Deal */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Special Offer / Badge Text (Optional)
                  </label>
                  <input
                    type="text"
                    value={offer}
                    onChange={(e) => setOffer(e.target.value)}
                    placeholder="e.g. 50% OFF First 3 Months, Limited Beta"
                    className="w-full px-3.5 py-2 rounded-xl glass-input text-slate-900"
                  />
                </div>

                {/* Keywords & Website */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Keywords / Tags</label>
                    <input
                      type="text"
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                      placeholder="#SaaS, #Growth, #AI"
                      className="w-full px-3.5 py-2 rounded-xl glass-input text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Website URL</label>
                    <input
                      type="text"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="e.g. www.acme.ai"
                      className="w-full px-3.5 py-2 rounded-xl glass-input text-slate-900"
                    />
                  </div>
                </div>

                {/* Custom Prompt / Headline Instructions */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Custom Headline / Key Points (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="Leave empty to auto-generate catchy headlines, or specify key points..."
                    className="w-full px-3.5 py-2 rounded-xl glass-input text-slate-900 resize-none"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2 flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    icon={Sparkles}
                    disabled={isGenerating}
                    className="w-full sm:w-auto"
                  >
                    {isGenerating ? 'Generating Poster...' : 'Generate Poster'}
                  </Button>
                </div>
              </div>
            </Card>
          </form>

          {/* Recently Generated History */}
          {posterHistory.length > 1 && (
            <Card title="Generated Posters History">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
                  <History className="w-3.5 h-3.5" />
                  <span>Click to switch between generated variations:</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {posterHistory.map((item, idx) => (
                    <button
                      key={item.id || idx}
                      type="button"
                      onClick={() => setActivePoster(item)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        activePoster?.id === item.id
                          ? 'border-indigo-600 bg-indigo-50/60 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                        <span className="font-bold text-slate-700 truncate">{item.brandName}</span>
                        <span>{item.createdAt}</span>
                      </div>
                      <div className="text-xs font-semibold text-slate-800 line-clamp-1 mt-0.5">
                        {item.headline}
                      </div>
                      <div className="text-[10px] text-indigo-600 font-medium capitalize mt-1">
                        {item.theme} • {item.aspectRatio}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Output Panel - Right Column */}
        <div className="lg:col-span-7 space-y-6">
          <Card title="Generated Poster Output">
            {isGenerating ? (
              <div className="min-h-[460px] flex flex-col items-center justify-center text-center p-8 bg-slate-50/60 rounded-2xl border border-dashed border-indigo-200">
                <div className="relative mb-4">
                  <div className="w-16 h-16 rounded-3xl bg-indigo-600/10 border border-indigo-200 flex items-center justify-center animate-pulse">
                    <Sparkles className="w-8 h-8 text-indigo-600 animate-spin" />
                  </div>
                </div>
                <h4 className="text-base font-bold text-slate-900">Generating AI Marketing Poster...</h4>
                <p className="text-xs text-slate-500 mt-1.5 max-w-xs leading-relaxed">
                  Synthesizing headline hooks, designing visual layout, and formatting export-ready graphics.
                </p>
                <div className="mt-4 flex items-center gap-2 text-[11px] text-indigo-600 font-semibold bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-ping" />
                  Applying {POSTER_THEMES[selectedTheme]?.name || 'Theme'} Palette
                </div>
              </div>
            ) : activePoster ? (
              <PosterPreview
                poster={activePoster}
                onUpdatePoster={setActivePoster}
                onRegenerate={handleRegenerate}
                onSelectTheme={handleSelectTheme}
                onSelectRatio={handleSelectRatio}
              />
            ) : (
              <div className="min-h-[460px] flex flex-col items-center justify-center text-center p-8 bg-slate-50/60 rounded-2xl border border-dashed border-slate-200">
                <div className="w-16 h-16 rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500 mb-4 shadow-xs">
                  <Layers className="w-8 h-8 text-indigo-500" />
                </div>
                <h4 className="text-base font-bold text-slate-800">No poster generated yet</h4>
                <p className="text-xs text-slate-500 mt-1.5 max-w-sm leading-relaxed">
                  Enter your startup name, product, audience, and click <strong>Generate Poster</strong> on the left, or click <strong>Quick Sample</strong> above to see a sample poster immediately.
                </p>
                <div className="mt-6">
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleQuickDemo}
                    icon={Sparkles}
                    size="sm"
                  >
                    Generate Instant Sample Poster
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
