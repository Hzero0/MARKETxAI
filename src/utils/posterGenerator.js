/**
 * Poster Generator Utility for MARKETxAI
 * Generates marketing poster copy, visual themes, and renders high-resolution PNG exports.
 */

export const POSTER_THEMES = {
  cyber: {
    id: 'cyber',
    name: 'Cyber Indigo',
    bgGradient: 'from-slate-950 via-indigo-950 to-slate-900',
    canvasBg: ['#030712', '#1e1b4b', '#0f172a'],
    accent: '#6366f1',
    accentLight: '#818cf8',
    secondary: '#06b6d4',
    badgeBg: 'rgba(99, 102, 241, 0.25)',
    badgeBorder: '#6366f1',
    badgeText: '#a5b4fc',
    cardBg: 'rgba(255, 255, 255, 0.06)',
    cardBorder: 'rgba(99, 102, 241, 0.3)',
    textPrimary: '#ffffff',
    textSecondary: '#cbd5e1',
    ctaBg: '#4f46e5',
    ctaText: '#ffffff',
    glowColor: 'rgba(99, 102, 241, 0.35)',
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset Coral',
    bgGradient: 'from-stone-950 via-rose-950 to-amber-950',
    canvasBg: ['#0c0a09', '#4c0519', '#451a03'],
    accent: '#f43f5e',
    accentLight: '#fb7185',
    secondary: '#f59e0b',
    badgeBg: 'rgba(244, 63, 94, 0.25)',
    badgeBorder: '#f43f5e',
    badgeText: '#fecdd3',
    cardBg: 'rgba(255, 255, 255, 0.06)',
    cardBorder: 'rgba(244, 63, 94, 0.3)',
    textPrimary: '#ffffff',
    textSecondary: '#fce7f3',
    ctaBg: '#e11d48',
    ctaText: '#ffffff',
    glowColor: 'rgba(244, 63, 94, 0.35)',
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean Teal',
    bgGradient: 'from-slate-950 via-cyan-950 to-emerald-950',
    canvasBg: ['#020617', '#083344', '#022c22'],
    accent: '#06b6d4',
    accentLight: '#22d3ee',
    secondary: '#10b981',
    badgeBg: 'rgba(6, 182, 212, 0.25)',
    badgeBorder: '#06b6d4',
    badgeText: '#a5f3fc',
    cardBg: 'rgba(255, 255, 255, 0.06)',
    cardBorder: 'rgba(6, 182, 212, 0.3)',
    textPrimary: '#ffffff',
    textSecondary: '#cffafe',
    ctaBg: '#0891b2',
    ctaText: '#ffffff',
    glowColor: 'rgba(6, 182, 212, 0.35)',
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight Gold',
    bgGradient: 'from-black via-zinc-950 to-amber-950/40',
    canvasBg: ['#000000', '#18181b', '#27272a'],
    accent: '#eab308',
    accentLight: '#fde047',
    secondary: '#d97706',
    badgeBg: 'rgba(234, 179, 8, 0.2)',
    badgeBorder: '#eab308',
    badgeText: '#fef08a',
    cardBg: 'rgba(255, 255, 255, 0.04)',
    cardBorder: 'rgba(234, 179, 8, 0.3)',
    textPrimary: '#ffffff',
    textSecondary: '#e4e4e7',
    ctaBg: '#ca8a04',
    ctaText: '#000000',
    glowColor: 'rgba(234, 179, 8, 0.25)',
  },
  neon: {
    id: 'neon',
    name: 'Neo Matrix',
    bgGradient: 'from-slate-950 via-emerald-950 to-slate-900',
    canvasBg: ['#020617', '#064e3b', '#020617'],
    accent: '#10b981',
    accentLight: '#34d399',
    secondary: '#06b6d4',
    badgeBg: 'rgba(16, 185, 129, 0.25)',
    badgeBorder: '#10b981',
    badgeText: '#a7f3d0',
    cardBg: 'rgba(255, 255, 255, 0.05)',
    cardBorder: 'rgba(16, 185, 129, 0.3)',
    textPrimary: '#ffffff',
    textSecondary: '#d1fae5',
    ctaBg: '#059669',
    ctaText: '#ffffff',
    glowColor: 'rgba(16, 185, 129, 0.35)',
  },
  crimson: {
    id: 'crimson',
    name: 'Crimson Power',
    bgGradient: 'from-neutral-950 via-red-950 to-purple-950',
    canvasBg: ['#0a0a0a', '#450a0a', '#3b0764'],
    accent: '#ef4444',
    accentLight: '#f87171',
    secondary: '#a855f7',
    badgeBg: 'rgba(239, 68, 68, 0.25)',
    badgeBorder: '#ef4444',
    badgeText: '#fecaca',
    cardBg: 'rgba(255, 255, 255, 0.06)',
    cardBorder: 'rgba(239, 68, 68, 0.3)',
    textPrimary: '#ffffff',
    textSecondary: '#f5d0fe',
    ctaBg: '#dc2626',
    ctaText: '#ffffff',
    glowColor: 'rgba(239, 68, 68, 0.35)',
  }
};

export const ASPECT_RATIOS = {
  square: { id: 'square', label: 'Square (1:1)', width: 1080, height: 1080, aspectClass: 'aspect-square' },
  portrait: { id: 'portrait', label: 'Social Poster (4:5)', width: 1080, height: 1350, aspectClass: 'aspect-[4/5]' },
  story: { id: 'story', label: 'Story / Reel (9:16)', width: 1080, height: 1920, aspectClass: 'aspect-[9/16]' },
  landscape: { id: 'landscape', label: 'Banner (16:9)', width: 1200, height: 675, aspectClass: 'aspect-[16/9]' }
};

// Generates dynamic marketing poster copy and structure based on input parameters
export function generatePosterData(params) {
  const {
    brandName = 'MyStartup',
    product = 'AI Platform',
    targetAudience = 'Founders & Growth Teams',
    tone = 'Professional',
    instructions = '',
    keywords = '',
    offer = '',
    platform = 'LinkedIn',
    posterType = 'Promotional Poster',
    selectedTheme = 'cyber',
    selectedRatio = 'portrait'
  } = params;

  const cleanBrand = brandName.trim() || 'MyStartup';
  const cleanProduct = product.trim() || 'Innovative Solution';
  const cleanAudience = targetAudience.trim() || 'Modern Teams';

  // Tone-specific variations
  const headlineBank = {
    'Professional': [
      `Supercharge Your Workflow with ${cleanProduct}`,
      `Next-Generation Intelligence for ${cleanAudience}`,
      `Engineered for Scale: Meet ${cleanProduct}`,
      `Transform Your Business Operations with ${cleanBrand}`
    ],
    'Casual & Friendly': [
      `Say Hello to the Future of Work with ${cleanProduct}`,
      `Everything You Need to Win, Built into ${cleanProduct}`,
      `Work Smarter, Grow Faster with ${cleanBrand}`,
      `Meet Your New Secret Weapon: ${cleanProduct}`
    ],
    'Urgent & Bold': [
      `Don't Get Left Behind. Upgrade to ${cleanProduct} Today!`,
      `Stop Wasting Time. Scale 10x Faster with ${cleanBrand}`,
      `The Ultimate Advantage for ${cleanAudience}`,
      `Game Over for Outdated Tools: Unleash ${cleanProduct}`
    ],
    'Educational': [
      `The Proven Way to Accelerate Results with ${cleanProduct}`,
      `Master Your Growth: How ${cleanBrand} Delivers Real ROI`,
      `Built by Experts for ${cleanAudience}`,
      `Smarter Strategies Powered by ${cleanProduct}`
    ]
  };

  const subheadlineBank = {
    'Professional': `Empowering ${cleanAudience} with high-precision automation, data-driven insights, and seamless scalability.`,
    'Casual & Friendly': `Simple to use, ridiculously fast, and designed to help you accomplish more in less time.`,
    'Urgent & Bold': `Proven 10x efficiency gains and unmatched performance. Experience the breakthrough today.`,
    'Educational': `Discover a streamlined methodology to boost conversions, reduce friction, and lead your industry.`
  };

  const featureOptions = [
    { icon: '⚡', title: 'Lightning Fast Setup', desc: 'Deploy and see measurable impact in minutes' },
    { icon: '🎯', title: 'Precision AI Targeting', desc: 'Reach high-intent audiences with zero wasted spend' },
    { icon: '📈', title: '10x Measurable ROI', desc: 'Real-time performance tracking and actionable data' },
    { icon: '🔒', title: 'Enterprise-Grade Security', desc: 'End-to-end data encryption and compliance ready' },
    { icon: '🤖', title: 'Autonomous Automation', desc: 'Workflows run 24/7 without manual intervention' },
    { icon: '✨', title: 'Intuitive Experience', desc: 'Zero learning curve for your entire team' }
  ];

  // Pick headline
  const toneHeadlines = headlineBank[tone] || headlineBank['Professional'];
  let chosenHeadline = toneHeadlines[Math.floor(Math.random() * toneHeadlines.length)];

  // If user provided specific custom instructions with a headline idea, respect it
  if (instructions && instructions.length > 5 && instructions.length < 90) {
    chosenHeadline = instructions;
  }

  const chosenSubheadline = subheadlineBank[tone] || subheadlineBank['Professional'];

  // Select 3 random unique features
  const shuffledFeatures = [...featureOptions].sort(() => 0.5 - Math.random()).slice(0, 3);

  // Badge text
  let badgeText = '✨ OFFICIAL LAUNCH';
  if (offer) {
    badgeText = `🔥 ${offer.toUpperCase()}`;
  } else if (posterType === 'Discount / Special Offer') {
    badgeText = '🔥 LIMITED TIME OFFER';
  } else if (posterType === 'Event / Webinar') {
    badgeText = '📅 UPCOMING EVENT';
  } else if (posterType === 'Feature Highlight') {
    badgeText = '🚀 NEW RELEASE';
  } else if (tone === 'Urgent & Bold') {
    badgeText = '⚡ EXCLUSIVE ACCESS';
  }

  // CTA text
  let ctaText = 'Get Started Free';
  if (offer) {
    ctaText = 'Claim Offer Now';
  } else if (posterType === 'Event / Webinar') {
    ctaText = 'Reserve Your Spot';
  } else if (tone === 'Urgent & Bold') {
    ctaText = 'Start Scaling Today';
  } else if (tone === 'Educational') {
    ctaText = 'Explore The Platform';
  }

  // Generate hashtags
  const defaultTags = ['#Marketing', '#Startup', '#Growth', '#Innovation', '#Tech'];
  const customTags = keywords ? keywords.split(',').map(k => {
    const trimmed = k.trim().replace(/^#/, '');
    return trimmed ? `#${trimmed}` : '';
  }).filter(Boolean) : [];
  const hashtags = Array.from(new Set([...customTags, ...defaultTags])).slice(0, 5).join(' ');

  // Social caption
  const caption = `🚀 Excited to present ${cleanProduct} by ${cleanBrand}!\n\n` +
    `${chosenHeadline}\n\n` +
    `${chosenSubheadline}\n\n` +
    `Key highlights:\n` +
    shuffledFeatures.map(f => `${f.icon} ${f.title}: ${f.desc}`).join('\n') +
    `\n\n👉 Ready to elevate your growth? ${ctaText}!\n\n${hashtags}`;

  return {
    id: 'poster-' + Date.now(),
    brandName: cleanBrand,
    product: cleanProduct,
    targetAudience: cleanAudience,
    posterType,
    headline: chosenHeadline,
    subheadline: chosenSubheadline,
    badgeText,
    ctaText,
    features: shuffledFeatures,
    website: params.website || `www.${cleanBrand.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
    theme: selectedTheme,
    aspectRatio: selectedRatio,
    platform,
    caption,
    hashtags,
    createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
}

/**
 * Renders the poster onto an HTML5 Canvas and returns a downloadable Data URL.
 */
export function renderPosterCanvas(poster, options = {}) {
  const theme = POSTER_THEMES[poster.theme] || POSTER_THEMES.cyber;
  const ratio = ASPECT_RATIOS[poster.aspectRatio] || ASPECT_RATIOS.portrait;

  const canvas = document.createElement('canvas');
  // Scale up for high-resolution retina export
  const scale = options.scale || 2;
  const w = ratio.width * scale;
  const h = ratio.height * scale;

  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // 1. Background gradient
  const bgGrad = ctx.createLinearGradient(0, 0, w * 0.8, h);
  bgGrad.addColorStop(0, theme.canvasBg[0]);
  bgGrad.addColorStop(0.5, theme.canvasBg[1]);
  bgGrad.addColorStop(1, theme.canvasBg[2]);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // 2. Ambient background radial glow circles
  const drawGlow = (cx, cy, radius, color) => {
    const radial = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    radial.addColorStop(0, color);
    radial.addColorStop(1, 'transparent');
    ctx.fillStyle = radial;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
  };

  drawGlow(w * 0.8, h * 0.15, w * 0.6, theme.glowColor);
  drawGlow(w * 0.15, h * 0.85, w * 0.5, theme.glowColor);

  // 3. Subtle grid / dots accent in background
  ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
  const dotSpacing = 40 * scale;
  for (let x = dotSpacing; x < w; x += dotSpacing) {
    for (let y = dotSpacing; y < h; y += dotSpacing) {
      ctx.beginPath();
      ctx.arc(x, y, 1.2 * scale, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 4. Outer border
  ctx.strokeStyle = theme.cardBorder;
  ctx.lineWidth = 4 * scale;
  ctx.strokeRect(30 * scale, 30 * scale, w - 60 * scale, h - 60 * scale);

  const padX = 70 * scale;
  let currentY = 90 * scale;

  // 5. Header: Brand Logo & Pill Badge
  ctx.save();
  // Brand name badge
  ctx.font = `bold ${24 * scale}px system-ui, -apple-system, sans-serif`;
  const brandMetrics = ctx.measureText(poster.brandName.toUpperCase());
  const pillW = brandMetrics.width + 48 * scale;
  const pillH = 42 * scale;

  // Brand pill background
  ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
  roundRect(ctx, padX, currentY, pillW, pillH, 21 * scale);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.lineWidth = 1.5 * scale;
  roundRect(ctx, padX, currentY, pillW, pillH, 21 * scale);
  ctx.stroke();

  // Brand text
  ctx.fillStyle = '#ffffff';
  ctx.fillText(poster.brandName.toUpperCase(), padX + 24 * scale, currentY + 28 * scale);

  // Top-right Promotional Badge
  if (poster.badgeText) {
    ctx.font = `bold ${18 * scale}px system-ui, -apple-system, sans-serif`;
    const badgeMetrics = ctx.measureText(poster.badgeText);
    const bW = badgeMetrics.width + 36 * scale;
    const bH = 38 * scale;
    const bX = w - padX - bW;

    ctx.fillStyle = theme.badgeBg;
    roundRect(ctx, bX, currentY + 2 * scale, bW, bH, 19 * scale);
    ctx.fill();
    ctx.strokeStyle = theme.badgeBorder;
    ctx.lineWidth = 2 * scale;
    roundRect(ctx, bX, currentY + 2 * scale, bW, bH, 19 * scale);
    ctx.stroke();

    ctx.fillStyle = theme.badgeText;
    ctx.fillText(poster.badgeText, bX + 18 * scale, currentY + 26 * scale);
  }
  ctx.restore();

  currentY += 80 * scale;

  // 6. Main Headline (Multi-line auto wrap)
  ctx.save();
  ctx.fillStyle = theme.textPrimary;
  const headlineFontSize = Math.min(56 * scale, Math.floor((w - padX * 2) / 12));
  ctx.font = `900 ${headlineFontSize}px system-ui, -apple-system, sans-serif`;
  ctx.textBaseline = 'top';

  const maxTextW = w - padX * 2;
  const words = poster.headline.split(' ');
  let line = '';
  const lines = [];

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const testWidth = ctx.measureText(testLine).width;
    if (testWidth > maxTextW && i > 0) {
      lines.push(line.trim());
      line = words[i] + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line.trim());

  const lineHeight = headlineFontSize * 1.18;
  for (let l = 0; l < Math.min(lines.length, 3); l++) {
    // Add subtle glow shadow to headline
    ctx.shadowColor = theme.glowColor;
    ctx.shadowBlur = 15 * scale;
    ctx.fillText(lines[l], padX, currentY);
    ctx.shadowBlur = 0;
    currentY += lineHeight;
  }
  ctx.restore();

  currentY += 20 * scale;

  // 7. Subheadline
  ctx.save();
  ctx.fillStyle = theme.textSecondary;
  const subFontSize = 22 * scale;
  ctx.font = `500 ${subFontSize}px system-ui, -apple-system, sans-serif`;
  ctx.textBaseline = 'top';

  const subWords = poster.subheadline.split(' ');
  let subLine = '';
  const subLines = [];
  for (let i = 0; i < subWords.length; i++) {
    const testLine = subLine + subWords[i] + ' ';
    if (ctx.measureText(testLine).width > maxTextW && i > 0) {
      subLines.push(subLine.trim());
      subLine = subWords[i] + ' ';
    } else {
      subLine = testLine;
    }
  }
  subLines.push(subLine.trim());

  const subLineHeight = subFontSize * 1.35;
  for (let l = 0; l < Math.min(subLines.length, 3); l++) {
    ctx.fillText(subLines[l], padX, currentY);
    currentY += subLineHeight;
  }
  ctx.restore();

  currentY += 40 * scale;

  // 8. Key Features Cards
  if (poster.features && poster.features.length > 0) {
    const cardH = 68 * scale;
    const cardGap = 16 * scale;

    poster.features.forEach((feat) => {
      ctx.save();
      // Glass card background
      ctx.fillStyle = theme.cardBg;
      roundRect(ctx, padX, currentY, maxTextW, cardH, 16 * scale);
      ctx.fill();

      ctx.strokeStyle = theme.cardBorder;
      ctx.lineWidth = 1.5 * scale;
      roundRect(ctx, padX, currentY, maxTextW, cardH, 16 * scale);
      ctx.stroke();

      // Feature Icon badge
      ctx.fillStyle = theme.badgeBg;
      roundRect(ctx, padX + 16 * scale, currentY + 12 * scale, 44 * scale, 44 * scale, 12 * scale);
      ctx.fill();

      ctx.font = `${22 * scale}px system-ui, sans-serif`;
      ctx.textBaseline = 'middle';
      ctx.fillText(feat.icon || '✓', padX + 27 * scale, currentY + 34 * scale);

      // Feature Title & Description
      ctx.font = `bold ${18 * scale}px system-ui, sans-serif`;
      ctx.fillStyle = theme.textPrimary;
      ctx.fillText(feat.title, padX + 74 * scale, currentY + 25 * scale);

      ctx.font = `400 ${14 * scale}px system-ui, sans-serif`;
      ctx.fillStyle = theme.textSecondary;
      ctx.fillText(feat.desc, padX + 74 * scale, currentY + 47 * scale);

      ctx.restore();
      currentY += cardH + cardGap;
    });
  }

  currentY += 30 * scale;

  // 9. CTA Button
  ctx.save();
  ctx.font = `bold ${24 * scale}px system-ui, sans-serif`;
  const ctaMetrics = ctx.measureText(poster.ctaText + '  →');
  const ctaW = Math.min(ctaMetrics.width + 60 * scale, maxTextW);
  const ctaH = 60 * scale;

  // CTA Button Glow & Shadow
  ctx.shadowColor = theme.glowColor;
  ctx.shadowBlur = 25 * scale;
  ctx.fillStyle = theme.ctaBg;
  roundRect(ctx, padX, currentY, ctaW, ctaH, 30 * scale);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.fillStyle = theme.ctaText;
  ctx.textBaseline = 'middle';
  ctx.fillText(poster.ctaText + '  →', padX + 30 * scale, currentY + ctaH / 2);
  ctx.restore();

  // 10. Footer Website / Contact
  ctx.save();
  const footerY = h - 60 * scale;
  ctx.font = `500 ${16 * scale}px system-ui, sans-serif`;
  ctx.fillStyle = theme.textSecondary;
  ctx.textBaseline = 'bottom';
  ctx.fillText(`🌐 ${poster.website}`, padX, footerY);

  const poweredText = `Generated by MARKETxAI`;
  const pMetrics = ctx.measureText(poweredText);
  ctx.fillText(poweredText, w - padX - pMetrics.width, footerY);
  ctx.restore();

  return canvas.toDataURL('image/png');
}

/**
 * Triggers a real browser download of the poster PNG
 */
export function downloadPosterPNG(poster) {
  const dataUrl = renderPosterCanvas(poster, { scale: 2 });
  if (!dataUrl) return false;

  const link = document.createElement('a');
  const safeBrand = (poster.brandName || 'startup').toLowerCase().replace(/[^a-z0-9]/g, '-');
  link.download = `${safeBrand}-poster-${poster.aspectRatio}.png`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  return true;
}

// Canvas rounded rectangle helper
function roundRect(ctx, x, y, width, height, radius) {
  if (width < 2 * radius) radius = width / 2;
  if (height < 2 * radius) radius = height / 2;
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

