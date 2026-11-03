import React from 'react';
import { Card } from '../../components/common/Card';
import { useCampaigns } from '../../context/CampaignContext';
import { ExportButton } from '../../components/export/ExportButton';
import { BarChart3, Megaphone } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';

export const Analytics = () => {
  const { campaigns } = useCampaigns();

  const totalReach = campaigns.reduce((sum, c) => sum + (c.metrics?.reach || 0), 0);
  const totalClicks = campaigns.reduce((sum, c) => sum + (c.metrics?.clicks || 0), 0);
  const totalConversions = campaigns.reduce((sum, c) => sum + (c.metrics?.conversions || 0), 0);
  const totalBudget = campaigns.reduce((sum, c) => sum + (Number(c.budget) || 0), 0);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-slate-200 bg-white">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Marketing Analytics</h1>
            <p className="text-xs text-slate-500">
              Consolidated performance metrics calculated from user-created campaigns.
            </p>
          </div>
        </div>

        {campaigns.length > 0 && (
          <ExportButton data={campaigns} filename="analytics-report.csv" title="Export Analytics" />
        )}
      </div>

      {/* Metric Cards Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center p-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Campaigns</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{campaigns.length}</p>
        </Card>

        <Card className="text-center p-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Budget</p>
          <p className="text-2xl font-extrabold text-indigo-600 mt-1">${totalBudget.toLocaleString()}</p>
        </Card>

        <Card className="text-center p-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Reach</p>
          <p className="text-2xl font-extrabold text-violet-600 mt-1">{totalReach.toLocaleString()}</p>
        </Card>

        <Card className="text-center p-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Conversions</p>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">{totalConversions.toLocaleString()}</p>
        </Card>
      </div>

      {/* Analytics Chart or Clean Empty State */}
      <Card title="Campaign Budget & Reach Breakdown">
        {campaigns.length > 0 ? (
          <div className="h-72 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={campaigns.map((c) => ({
                  name: c.name,
                  budget: Number(c.budget || 0),
                  reach: c.metrics?.reach || 0
                }))}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', color: '#0f172a' }} />
                <Bar dataKey="budget" fill="#6366f1" radius={[6, 6, 0, 0]} name="Budget ($)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-center p-6 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <Megaphone className="w-12 h-12 text-slate-300 mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No analytics data available yet</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
              Create your first marketing campaign to begin accumulating performance metrics and comparative charts.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};
