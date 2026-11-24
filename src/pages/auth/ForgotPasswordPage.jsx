import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Mail, ArrowLeft, KeyRound } from 'lucide-react';

export const ForgotPasswordPage = () => {
  const { showSuccess } = useToast();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    showSuccess(`Password reset instructions sent to ${email} (Demo)`);
  };

  return (
    <div className="w-full max-w-md">
      <div className="glass-panel rounded-3xl p-8 shadow-xl border border-slate-200 bg-white relative overflow-hidden">
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 mb-3">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Reset Password</h2>
          <p className="text-xs text-slate-500 mt-1">Enter your account email to receive reset instructions</p>
        </div>

        {submitted ? (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
            <p className="text-xs font-medium text-emerald-800">
              Demo reset link has been dispatched to <strong>{email}</strong>.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:underline"
            >
              <ArrowLeft className="w-4 h-4" /> Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="demo@novatech.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm glass-input text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <Button type="submit" className="w-full">
              Send Reset Instructions
            </Button>

            <div className="text-center">
              <Link to="/login" className="text-xs text-slate-500 hover:text-slate-900 inline-flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
