import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import {
  Sparkles,
  ArrowRight,
  BarChart3,
  Users,
  Megaphone,
  Building2,
  Wand2,
  BrainCircuit,
  Swords,
  CheckCircle,
  ShieldCheck,
  Zap,
  Globe,
  Rocket
} from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();

  const FEATURES = [
    {
      icon: Building2,
      title: "Company Profile & Details",
      desc: "Define your startup name, product details, industry category, target audience, and brand tone in one structured portal.",
      color: "indigo"
    },
    {
      icon: Megaphone,
      title: "Campaign Management",
      desc: "Plan, schedule, track, and manage multi-platform marketing campaigns with real-time budget tracking.",
      color: "emerald"
    },
    {
      icon: Users,
      title: "Audience & Market Targeting",
      desc: "Specify demographic profiles, key regions, and customer segments to align marketing efforts.",
      color: "violet"
    },
    {
      icon: BarChart3,
      title: "Budget & Channel Allocation",
      desc: "Distribute your marketing budget across preferred social and digital marketing platforms.",
      color: "amber"
    }
  ];

  const STEPS = [
    { num: "01", title: "Add Company Details", desc: "Enter your product name, industry category, brand tone, and business description." },
    { num: "02", title: "Set Target Audience & Budget", desc: "Define your ideal customer profile, target location, and total marketing budget." },
    { num: "03", title: "Create Marketing Campaigns", desc: "Launch and manage multi-channel marketing campaigns across your preferred platforms." },
    { num: "04", title: "Ready for AI Integration", desc: "Your structured data is saved and structured for future AI model integration." }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* Navbar */}
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden gradient-bg-subtle">
        {/* Glow Spheres */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/4 right-10 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-6 shadow-xs">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>AI Startup Marketing Assistant — Full Web Platform</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
            Smart Marketing Tools Designed for <span className="gradient-text">Startup Growth</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Smart marketing tools designed to help startups understand their audience, create campaigns, and make better marketing decisions.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/app/dashboard')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 group"
            >
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/app/dashboard')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 shadow-sm transition-all flex items-center justify-center gap-2"
            >
              Explore Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-20 border-t border-slate-200 relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Platform Features</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">Everything Your Startup Needs to Scale</p>
            <p className="text-sm text-slate-600 mt-3">Comprehensive suite of marketing tools built with clean service abstraction.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="glass-card rounded-2xl p-6 hover:-translate-y-1 transition-all bg-white border border-slate-200">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-5">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{f.title}</h3>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-violet-600 uppercase tracking-widest">Simple Workflow</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">How It Works</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {STEPS.map((s, idx) => (
              <div key={idx} className="glass-card rounded-2xl p-6 bg-white border border-slate-200">
                <span className="text-3xl font-extrabold text-indigo-400 block mb-3">{s.num}</span>
                <h4 className="text-base font-bold text-slate-900">{s.title}</h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 bg-white border-t border-slate-200 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="font-bold text-slate-900">AI Startup Marketing Assistant</span>
          </div>
          <p>&copy; {new Date().getFullYear()} Website Development Academic Project. Clean State Ready.</p>
          <div className="flex items-center gap-4 text-slate-600">
            <Link to="/app/dashboard" className="hover:text-slate-900">Dashboard</Link>
            <Link to="/login" className="hover:text-slate-900">Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
