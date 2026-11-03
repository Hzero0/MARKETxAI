import React from 'react';
import { Card } from '../../components/common/Card';
import { Lightbulb, Layers } from 'lucide-react';

export const Recommendations = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-slate-200 bg-white">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Lightbulb className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Recommendations</h1>
            <p className="text-xs text-slate-500">
              Strategic optimization suggestions and channel recommendations.
            </p>
          </div>
        </div>
      </div>

      {/* Clean Empty State */}
      <Card title="Marketing Recommendations">
        <div className="py-20 flex flex-col items-center justify-center text-center p-6 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
          <Layers className="w-12 h-12 text-slate-300 mb-3" />
          <h3 className="text-lg font-bold text-slate-800">No recommendations available</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
            Recommendations will be generated automatically once the recommendation engine evaluates your marketing campaigns and audience data.
          </p>
        </div>
      </Card>
    </div>
  );
};
