import React, { useState } from 'react';
import { POSTER_THEMES, ASPECT_RATIOS, downloadPosterPNG } from '../../utils/posterGenerator';
import { Download, Sparkles, Copy, Check, Edit3, Eye, RefreshCw, Share2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const PosterPreview = ({
  poster,
  onUpdatePoster,
  onRegenerate,
  onSelectTheme,
  onSelectRatio
}) => {
  const { showSuccess } = useToast();
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!poster) return null;

  const currentTheme = POSTER_THEMES[poster.theme] || POSTER_THEMES.cyber;
  const currentRatio = ASPECT_RATIOS[poster.aspectRatio] || ASPECT_RATIOS.portrait;

  const handleDownload = () => {
    setIsDownloading(true);
    try {
      downloadPosterPNG(poster);
      showSuccess('Poster downloaded successfully (High-Res PNG)!');
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyCaption = async () => {
    try {
      await navigator.clipboard.writeText(poster.caption);
      setCopiedCaption(true);
      showSuccess('Social media caption & hashtags copied to clipboard!');
      setTimeout(() => setCopiedCaption(false), 2500);
    } catch (err) {
      console.error('Clipboard copy error:', err);
    }
  };

  const handleFieldChange = (field, value) => {
    if (onUpdatePoster) {
      onUpdatePoster({ ...poster, [field]: value });
    }
  };

  return (
    <div className="space-y-4">
      {/* Action Bar Above Poster */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm shadow-indigo-600/30 transition-all active:scale-95 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isDownloading ? 'Exporting...' : 'Download PNG'}</span>
          </button>

          <button
            type="button"
            onClick={handleCopyCaption}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium text-xs transition-colors cursor-pointer"
          >
            {copiedCaption ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCaption ? 'Copied!' : 'Copy Caption'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
              isEditing
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
            }`}
          >
            {isEditing ? <Eye className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
            <span>{isEditing ? 'Preview Mode' : 'Quick Edit'}</span>
          </button>
        </div>

        {onRegenerate && (
          <button
            type="button"
            onClick={onRegenerate}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl hover:bg-slate-200/60 text-slate-600 text-xs font-medium transition-colors cursor-pointer"
            title="Generate a fresh variation with current settings"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Remix</span>
          </button>
        )}
      </div>

      {/* Theme Switcher Bar */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto py-1 px-1">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider shrink-0">
          Theme:
        </span>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {Object.values(POSTER_THEMES).map((th) => {
            const isActive = poster.theme === th.id;
            return (
              <button
                key={th.id}
                type="button"
                onClick={() => onSelectTheme && onSelectTheme(th.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-600'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: th.accent }}
                />
                <span>{th.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Aspect Ratio Switcher Bar */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto py-1 px-1">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider shrink-0">
          Format:
        </span>
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {Object.values(ASPECT_RATIOS).map((ratio) => {
            const isActive = poster.aspectRatio === ratio.id;
            return (
              <button
                key={ratio.id}
                type="button"
                onClick={() => onSelectRatio && onSelectRatio(ratio.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? 'border-indigo-600 bg-indigo-600 text-white shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white text-slate-600'
                }`}
              >
                {ratio.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* The Visual Poster Card */}
      <div className="relative mx-auto max-w-md w-full overflow-hidden rounded-3xl shadow-2xl transition-all duration-300">
        <div
          className={`w-full ${currentRatio.aspectClass} relative p-6 sm:p-8 flex flex-col justify-between overflow-hidden border border-white/10 select-none`}
          style={{
            background: `linear-gradient(135deg, ${currentTheme.canvasBg[0]} 0%, ${currentTheme.canvasBg[1]} 50%, ${currentTheme.canvasBg[2]} 100%)`,
            color: currentTheme.textPrimary
          }}
        >
          {/* Ambient Glow Orbs */}
          <div
            className="absolute -top-16 -right-16 w-64 h-64 rounded-full pointer-events-none blur-3xl opacity-40 transition-colors duration-500"
            style={{ backgroundColor: currentTheme.accent }}
          />
          <div
            className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full pointer-events-none blur-3xl opacity-30 transition-colors duration-500"
            style={{ backgroundColor: currentTheme.secondary }}
          />

          {/* Decorative Dot Grid Overlay */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}
          />

          {/* Top Row: Brand Logo & Promotional Badge */}
          <div className="relative z-10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" style={{ color: currentTheme.accentLight }} />
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                {poster.brandName}
              </span>
            </div>

            {poster.badgeText && (
              <div
                className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest border backdrop-blur-md shadow-xs"
                style={{
                  backgroundColor: currentTheme.badgeBg,
                  borderColor: currentTheme.badgeBorder,
                  color: currentTheme.badgeText
                }}
              >
                {poster.badgeText}
              </div>
            )}
          </div>

          {/* Center Content: Headline & Subheadline */}
          <div className="relative z-10 my-auto py-4 space-y-3">
            {isEditing ? (
              <div className="space-y-3 bg-black/40 p-3 rounded-2xl border border-white/20 backdrop-blur-md">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-300 mb-1 block">Headline</label>
                  <input
                    type="text"
                    value={poster.headline}
                    onChange={(e) => handleFieldChange('headline', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-black/60 border border-white/30 text-white text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-300 mb-1 block">Subheadline</label>
                  <textarea
                    rows={2}
                    value={poster.subheadline}
                    onChange={(e) => handleFieldChange('subheadline', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-black/60 border border-white/30 text-white text-[11px] resize-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-300 mb-1 block">CTA Text</label>
                  <input
                    type="text"
                    value={poster.ctaText}
                    onChange={(e) => handleFieldChange('ctaText', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-black/60 border border-white/30 text-white text-xs font-bold"
                  />
                </div>
              </div>
            ) : (
              <>
                <h2
                  className="font-black text-xl sm:text-2xl md:text-3xl tracking-tight leading-tight drop-shadow-md"
                  style={{ color: currentTheme.textPrimary }}
                >
                  {poster.headline}
                </h2>
                <p
                  className="text-xs sm:text-sm font-medium leading-relaxed opacity-90 line-clamp-3"
                  style={{ color: currentTheme.textSecondary }}
                >
                  {poster.subheadline}
                </p>
              </>
            )}

            {/* Feature Highlights Pills */}
            {poster.features && poster.features.length > 0 && !isEditing && (
              <div className="pt-2 space-y-2">
                {poster.features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl backdrop-blur-md border transition-transform hover:scale-[1.01]"
                    style={{
                      backgroundColor: currentTheme.cardBg,
                      borderColor: currentTheme.cardBorder
                    }}
                  >
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0"
                      style={{ backgroundColor: currentTheme.badgeBg }}
                    >
                      {feat.icon}
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-bold truncate" style={{ color: currentTheme.textPrimary }}>
                        {feat.title}
                      </div>
                      <div className="text-[10px] truncate opacity-80" style={{ color: currentTheme.textSecondary }}>
                        {feat.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Row: CTA Button & Footer Details */}
          <div className="relative z-10 pt-2 space-y-3">
            <div>
              <button
                type="button"
                className="w-full py-2.5 px-5 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.02] active:scale-95 cursor-default"
                style={{
                  backgroundColor: currentTheme.ctaBg,
                  color: currentTheme.ctaText,
                  boxShadow: `0 8px 24px ${currentTheme.glowColor}`
                }}
              >
                <span>{poster.ctaText}</span>
                <span className="text-base font-extrabold">→</span>
              </button>
            </div>

            <div className="flex items-center justify-between text-[10px] pt-1 opacity-75 font-medium border-t border-white/10">
              <span className="truncate max-w-[200px]">🌐 {poster.website}</span>
              <span className="uppercase tracking-widest text-[9px] font-bold">MARKETxAI</span>
            </div>
          </div>
        </div>
      </div>

      {/* Social Media Caption Box */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-800 flex items-center gap-1.5">
            <Share2 className="w-3.5 h-3.5 text-indigo-600" />
            Social Media Caption & Tags
          </span>
          <button
            type="button"
            onClick={handleCopyCaption}
            className="text-indigo-600 hover:text-indigo-700 font-semibold text-[11px] flex items-center gap-1 cursor-pointer"
          >
            {copiedCaption ? 'Copied!' : 'Copy to Clipboard'}
          </button>
        </div>
        <p className="text-slate-600 whitespace-pre-line bg-slate-50 p-3 rounded-xl border border-slate-100 font-sans text-xs leading-relaxed max-h-36 overflow-y-auto">
          {poster.caption}
        </p>
      </div>
    </div>
  );
};

