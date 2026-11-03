import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStartup } from '../../context/StartupContext';
import { useCampaigns } from '../../context/CampaignContext';
import { StatCard } from '../../components/common/StatCard';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { ExportButton } from '../../components/export/ExportButton';
import { storageUtils } from '../../utils/storageUtils';
import {
  Megaphone,
  Wand2,
  Users,
  DollarSign,
  TrendingUp,
  Plus,
  Building2,
  Swords,
  MessageSquarePlus,
  BarChart3
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';

export const DashboardOverview = () => {
  const navigate = useNavigate();
  const { profile } = useStartup();
  const { campaigns } = useCampaigns();

  const totalCampaigns = campaigns.length;
  const runningCampaigns = campaigns.filter(c => c.status === "Running").length;
  const hasProfile = !!(profile && profile.businessName);

  // Compute metrics dynamically from user-created campaigns
  const totalReach = campaigns.reduce((sum, c) => sum + (c.metrics?.reach || 0), 0);
  const totalBudget = campaigns.reduce((sum, c) => sum + (Number(c.budget) || 0), 0) || (Number(profile.marketingBudget) || 0);

  const competitorsCount = storageUtils.getCompetitors().length;
  const contentCount = storageUtils.getSavedContent().length;
  const feedbackCount = storageUtils.getFeedbacks().length;

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="glass-card rounded-3xl p-6 border border-slate-200/90 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-indigo-50/50 via-white to-violet-50/50">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              {hasProfile ? profile.businessName : 'My Marketing Workspace'}
            </span>
            <span className="text-xs text-slate-500">| Academic Project</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Marketing Overview Dashboard
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            {hasProfile
              ? `Real-time campaign metrics and workspace summary for ${profile.businessName}.`
              : 'Welcome! Configure your startup profile or create a campaign to track marketing data.'}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button
            onClick={() => navigate('/app/profile')}
            variant="secondary"
            size="sm"
            icon={Building2}
          >
            Startup Profile
          </Button>
          <Button
            onClick={() => navigate('/app/campaigns')}
            variant="primary"
            size="sm"
            icon={Plus}
          >
            Create Campaign
          </Button>
          {campaigns.length > 0 && (
            <ExportButton
              data={campaigns}
              filename="campaign-metrics.csv"
              title="Campaign Overview Export"
            />
          )}
        </div>
      </div>

      {/* KPI METRIC CARDS - ALL INITIALIZE TO ZERO / EMPTY STATE */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Campaigns"
          value={totalCampaigns}
          change={totalCampaigns > 0 ? `${totalCampaigns} Added` : "0 Campaigns"}
          isPositive={totalCampaigns > 0}
          icon={Megaphone}
          color="indigo"
          subtitle={`${runningCampaigns} Running`}
        />
        <StatCard
          title="Content Created"
          value={contentCount}
          change={contentCount > 0 ? `${contentCount} Items` : "0 Content Created"}
          isPositive={contentCount > 0}
          icon={Wand2}
          color="violet"
          subtitle="Content Studio"
        />
        <StatCard
          title="Customers"
          value="0"
          change="0 Customers"
          isPositive={false}
          icon={Users}
          color="cyan"
          subtitle="Customer Insights"
        />
        <StatCard
          title="Competitors"
          value={competitorsCount}
          change={competitorsCount > 0 ? `${competitorsCount} Added` : "0 Competitors"}
          isPositive={competitorsCount > 0}
          icon={Swords}
          color="amber"
          subtitle="Competitor Intelligence"
        />
        <StatCard
          title="Marketing Budget"
          value={totalBudget > 0 ? `$${totalBudget.toLocaleString()}` : "Not Set"}
          change={totalBudget > 0 ? "Budget Set" : "$0"}
          isPositive={totalBudget > 0}
          icon={DollarSign}
          color="emerald"
          subtitle="Allocated Budget"
        />
      </div>

      {/* NO PROFILE & NO CAMPAIGNS CLEAN EMPTY BANNER */}
      {!hasProfile && campaigns.length === 0 && (
        <Card className="text-center py-12 border-dashed border-2 border-indigo-200 bg-indigo-50/20">
          <Building2 className="w-12 h-12 text-indigo-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900">Your Marketing Dashboard is Ready</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-6">
            There is no data configured yet. Complete your Startup Profile or launch your first campaign to begin tracking statistics.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button onClick={() => navigate('/app/profile')} variant="primary" icon={Building2}>
              Setup Startup Profile
            </Button>
            <Button onClick={() => navigate('/app/campaigns')} variant="secondary" icon={Plus}>
              Create First Campaign
            </Button>
          </div>
        </Card>
      )}

      {/* CHARTS / ANALYTICS AREA WITH CLEAN EMPTY STATES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campaign Performance Chart (Area) */}
        <Card title="Campaign Performance Trends" subtitle="Reach metrics over time" className="lg:col-span-2">
          {campaigns.length > 0 ? (
            <div className="h-72 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={campaigns.map((c, i) => ({
                    name: c.name || `Campaign ${i + 1}`,
                    reach: c.metrics?.reach || 0,
                    clicks: c.metrics?.clicks || 0
                  }))}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', color: '#0f172a' }} />
                  <Area type="monotone" dataKey="reach" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorReach)" name="Reach" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 mt-2">
              <BarChart3 className="w-10 h-10 text-slate-300 mb-2" />
              <h4 className="text-sm font-bold text-slate-700">No campaign data available yet.</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Create your first marketing campaign to start tracking performance metrics and trend charts.
              </p>
              <Button onClick={() => navigate('/app/campaigns')} variant="secondary" size="sm" icon={Plus} className="mt-4">
                + Create Campaign
              </Button>
            </div>
          )}
        </Card>

        {/* Customer Insights Empty Card */}
        <Card title="Customer Insights" subtitle="Demographic Segmentation">
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 mt-2">
            <Users className="w-10 h-10 text-slate-300 mb-2" />
            <h4 className="text-sm font-bold text-slate-700">No customer data available yet.</h4>
            <p className="text-xs text-slate-500 mt-1">
              Customer demographic segments will appear here once customer records are linked.
            </p>
          </div>
        </Card>
      </div>

      {/* CAMPAIGN TABLE - RENDERS ONLY USER CREATED CAMPAIGNS */}
      {campaigns.length > 0 && (
        <Card title="User Created Campaigns" subtitle="Your active marketing campaigns">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-500 border-b border-slate-100">
                  <th className="pb-3 font-semibold">Campaign Name</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Platforms</th>
                  <th className="pb-3 font-semibold">Budget</th>
                  <th className="pb-3 font-semibold">Reach</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {campaigns.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 font-semibold text-slate-900">{c.name}</td>
                    <td className="py-3">
                      <Badge variant={c.status === 'Running' ? 'emerald' : 'indigo'}>
                        {c.status}
                      </Badge>
                    </td>
                    <td className="py-3 text-slate-600">{c.platforms?.join(', ') || 'N/A'}</td>
                    <td className="py-3 font-medium text-slate-700">${Number(c.budget || 0).toLocaleString()}</td>
                    <td className="py-3 font-bold text-indigo-600">
                      {c.metrics?.reach ? c.metrics.reach.toLocaleString() : '0'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};
