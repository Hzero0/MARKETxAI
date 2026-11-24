import React, { useState, useEffect } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { sentimentService } from '../../services/sentimentService';
import {
  MessageSquareHeart,
  Send,
  Star,
  Sparkles,
  TrendingUp,
  ThumbsUp,
  Minus,
  ThumbsDown,
  Trash2,
  Layers,
  HelpCircle,
  RefreshCw,
  BarChart2
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from 'recharts';

export const SentimentAnalysis = () => {
  const { user } = useAuth();
  const { showSuccess, showError, showInfo } = useToast();

  const userId = user?.id || 'usr-demo-01';

  // Analysis Form State
  const [inputText, setInputText] = useState('');
  const [category, setCategory] = useState('Product Quality');
  const [rating, setRating] = useState(5);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Latest analysis result highlight
  const [latestResult, setLatestResult] = useState(null);

  // Data & History State
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    counts: { positive: 0, neutral: 0, negative: 0 },
    percentages: { positive: 0, neutral: 0, negative: 0 },
    distribution: [
      { name: 'Positive', count: 0, percentage: 0, color: '#10b981' },
      { name: 'Neutral', count: 0, percentage: 0, color: '#64748b' },
      { name: 'Negative', count: 0, percentage: 0, color: '#f43f5e' }
    ]
  });

  // Load Feedback Records & Sentiment Analytics
  const loadSentimentData = async () => {
    try {
      setLoading(true);
      const data = await sentimentService.getSentimentData(userId);
      if (data && data.success) {
        setFeedbacks(data.feedbacks || []);
        setStats({
          total: data.total || 0,
          counts: data.counts || { positive: 0, neutral: 0, negative: 0 },
          percentages: data.percentages || { positive: 0, neutral: 0, negative: 0 },
          distribution: data.distribution || []
        });
      }
    } catch (err) {
      console.error('Failed to load sentiment data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSentimentData();
  }, [userId]);

  // Handle Form Submission
  const handleAnalyze = async (e) => {
    if (e) e.preventDefault();

    if (!inputText || !inputText.trim()) {
      showError('Feedback text cannot be empty.');
      return;
    }

    try {
      setIsAnalyzing(true);
      const res = await sentimentService.analyzeFeedback({
        text: inputText.trim(),
        userId,
        category,
        rating,
        source: 'Live Sentiment Console'
      });

      if (res && res.success && res.feedback) {
        setLatestResult(res.feedback);
        showSuccess(`Analyzed as ${res.feedback.sentiment} with ${(res.feedback.confidence * 100).toFixed(1)}% confidence!`);
        setInputText('');
        // Refresh aggregated data
        await loadSentimentData();
      } else {
        throw new Error(res.error || 'Failed to analyze feedback');
      }
    } catch (err) {
      console.error('Error analyzing sentiment:', err);
      showError(err.message || 'Failed to analyze feedback.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Quick Test Samples
  const handleFillSample = (sampleText, sampleRating, sampleCategory) => {
    setInputText(sampleText);
    setRating(sampleRating);
    setCategory(sampleCategory);
    showInfo('Sample loaded. Click "Analyze Sentiment" or submit to run inference.');
  };

  // Handle Item Deletion
  const handleDelete = async (feedbackId) => {
    try {
      await sentimentService.deleteFeedback(feedbackId);
      showSuccess('Feedback item removed.');
      await loadSentimentData();
      if (latestResult && latestResult.id === feedbackId) {
        setLatestResult(null);
      }
    } catch (err) {
      console.error('Error deleting feedback:', err);
      showError('Failed to delete feedback item.');
    }
  };

  // Sentiment Color & Badge Helpers
  const getBadgeStyle = (sentiment) => {
    switch (sentiment) {
      case 'Positive':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Negative':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Neutral':
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'Positive':
        return <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />;
      case 'Negative':
        return <ThumbsDown className="w-3.5 h-3.5 text-rose-600" />;
      case 'Neutral':
      default:
        return <Minus className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-slate-200 bg-white">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-xs">
            <MessageSquareHeart className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Sentiment Analysis</h1>
            <p className="text-xs text-slate-500">
              BERT-powered NLP sentiment inference, probability breakdown, and customer satisfaction metrics.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={loadSentimentData}
            icon={RefreshCw}
          >
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Top Analytics Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Feedback */}
        <div className="glass-card p-4 rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Analyzed</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <BarChart2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">{stats.total}</div>
          <div className="mt-1 text-[11px] text-slate-400">Customer feedback items</div>
        </div>

        {/* Positive Sentiment */}
        <div className="glass-card p-4 rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Positive</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <ThumbsUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-600">{stats.percentages.positive}%</div>
          <div className="mt-1 text-[11px] text-slate-400">{stats.counts.positive} positive mentions</div>
        </div>

        {/* Neutral Sentiment */}
        <div className="glass-card p-4 rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Neutral</span>
            <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
              <Minus className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-700">{stats.percentages.neutral}%</div>
          <div className="mt-1 text-[11px] text-slate-400">{stats.counts.neutral} balanced mentions</div>
        </div>

        {/* Negative Sentiment */}
        <div className="glass-card p-4 rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Negative</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
              <ThumbsDown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-rose-600">{stats.percentages.negative}%</div>
          <div className="mt-1 text-[11px] text-slate-400">{stats.counts.negative} critical mentions</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Sentiment Analyzer Console */}
        <div className="lg:col-span-7 space-y-6">
          <Card title="BERT Sentiment Inference Console">
            <form onSubmit={handleAnalyze} className="space-y-4 text-xs">
              {/* Sample Quick-Test Buttons */}
              <div>
                <label className="block font-bold text-slate-700 mb-2">
                  Quick Test Validation Samples:
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleFillSample('I love the product. The customer support is excellent!', 5, 'Customer Support')
                    }
                    className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-medium text-[11px] transition-colors cursor-pointer"
                  >
                    🟢 Positive Test
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleFillSample('The product is disappointing. I experienced multiple issues.', 1, 'Product Quality')
                    }
                    className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-medium text-[11px] transition-colors cursor-pointer"
                  >
                    🔴 Negative Test
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleFillSample('The product was delivered yesterday. I have started using it.', 3, 'Delivery & Logistics')
                    }
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-medium text-[11px] transition-colors cursor-pointer"
                  >
                    ⚪ Neutral Test
                  </button>
                </div>
              </div>

              {/* Input Text Area */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Customer Feedback / Review Text *
                </label>
                <textarea
                  rows={3}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Enter customer feedback or social mention to analyze..."
                  className="w-full px-3.5 py-2 rounded-xl glass-input text-slate-900 resize-none text-xs"
                  required
                />
              </div>

              {/* Category and Rating */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl glass-input text-slate-900 bg-white"
                  >
                    <option value="Product Quality">Product Quality</option>
                    <option value="Customer Support">Customer Support</option>
                    <option value="User Interface">User Interface</option>
                    <option value="Pricing & Value">Pricing & Value</option>
                    <option value="Feature Request">Feature Request</option>
                    <option value="Delivery & Logistics">Delivery & Logistics</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">User Rating</label>
                  <div className="flex items-center gap-1.5 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star className={`w-4 h-4 ${star <= rating ? 'fill-amber-400' : 'text-slate-200'}`} />
                      </button>
                    ))}
                    <span className="text-[11px] font-bold text-slate-600 ml-1">{rating} / 5</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  icon={Sparkles}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? 'Running Inference...' : 'Analyze Sentiment'}
                </Button>
              </div>
            </form>

            {/* Latest Result Inspection Card */}
            {latestResult && (
              <div className="mt-4 p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">Latest Inference Result:</span>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${getBadgeStyle(
                        latestResult.sentiment
                      )}`}
                    >
                      {getSentimentIcon(latestResult.sentiment)}
                      {latestResult.sentiment}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-semibold">
                    Confidence: {(latestResult.confidence * 100).toFixed(1)}%
                  </span>
                </div>

                <p className="text-xs text-slate-700 italic bg-white p-2.5 rounded-xl border border-indigo-100">
                  "{latestResult.text}"
                </p>

                {/* Probability Distribution Bar */}
                {latestResult.probabilities && (
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between text-[11px] font-medium text-slate-600">
                      <span>Probabilities:</span>
                      <div className="flex items-center gap-3">
                        <span className="text-emerald-700 font-semibold">
                          Pos: {(latestResult.probabilities.positive * 100).toFixed(1)}%
                        </span>
                        <span className="text-slate-600 font-semibold">
                          Neu: {(latestResult.probabilities.neutral * 100).toFixed(1)}%
                        </span>
                        <span className="text-rose-700 font-semibold">
                          Neg: {(latestResult.probabilities.negative * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    {/* Visual Tri-Color Probability Meter */}
                    <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden flex">
                      <div
                        style={{ width: `${(latestResult.probabilities.positive * 100).toFixed(1)}%` }}
                        className="bg-emerald-500 h-full"
                        title={`Positive: ${(latestResult.probabilities.positive * 100).toFixed(1)}%`}
                      />
                      <div
                        style={{ width: `${(latestResult.probabilities.neutral * 100).toFixed(1)}%` }}
                        className="bg-slate-400 h-full"
                        title={`Neutral: ${(latestResult.probabilities.neutral * 100).toFixed(1)}%`}
                      />
                      <div
                        style={{ width: `${(latestResult.probabilities.negative * 100).toFixed(1)}%` }}
                        className="bg-rose-500 h-full"
                        title={`Negative: ${(latestResult.probabilities.negative * 100).toFixed(1)}%`}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Sentiment Distribution Chart */}
        <div className="lg:col-span-5 space-y-6">
          <Card title="Sentiment Distribution">
            {stats.total === 0 ? (
              <div className="py-16 flex flex-col items-center justify-center text-center p-6 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                <Layers className="w-10 h-10 text-slate-300 mb-2" />
                <h4 className="text-sm font-bold text-slate-800">No sentiment data yet</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
                  Analyze feedback on the left or click a sample test button to compute live sentiment distribution.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="h-56 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.distribution}
                        dataKey="count"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={4}
                      >
                        {stats.distribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(val, name, item) => [`${val} (${item.payload.percentage}%)`, name]}
                        contentStyle={{
                          borderRadius: '12px',
                          border: '1px solid #e2e8f0',
                          fontSize: '12px'
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
                    <span className="block text-[10px] font-semibold text-emerald-800">POSITIVE</span>
                    <span className="text-base font-extrabold text-emerald-700">{stats.counts.positive}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="block text-[10px] font-semibold text-slate-600">NEUTRAL</span>
                    <span className="text-base font-extrabold text-slate-700">{stats.counts.neutral}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-rose-50/60 border border-rose-100">
                    <span className="block text-[10px] font-semibold text-rose-800">NEGATIVE</span>
                    <span className="text-base font-extrabold text-rose-700">{stats.counts.negative}</span>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Bottom Section: Feedback History */}
      <Card title={`Feedback & Sentiment History (${feedbacks.length})`}>
        {feedbacks.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center p-6 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <Layers className="w-10 h-10 text-slate-300 mb-2" />
            <h4 className="text-sm font-bold text-slate-800">No feedback history for this startup</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              All submitted and analyzed customer feedback for startup <code className="text-indigo-600 font-semibold">{userId}</code> will be listed here with individual probabilities and sentiment ratings.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {feedbacks.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:bg-white hover:shadow-xs"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getBadgeStyle(
                        item.sentiment
                      )}`}
                    >
                      {getSentimentIcon(item.sentiment)}
                      {item.sentiment}
                    </span>

                    <span className="text-[11px] font-bold text-slate-800 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                      {item.category}
                    </span>

                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3 h-3 ${star <= item.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                        />
                      ))}
                    </div>

                    <span className="text-[10px] text-slate-400">
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recent'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed font-medium">"{item.text}"</p>

                  {/* Probabilities preview */}
                  {item.probabilities && (
                    <div className="flex items-center gap-3 text-[10px] text-slate-500 font-mono">
                      <span className="text-emerald-700 font-semibold">
                        Pos: {(item.probabilities.positive * 100).toFixed(1)}%
                      </span>
                      <span>•</span>
                      <span className="text-slate-600 font-semibold">
                        Neu: {(item.probabilities.neutral * 100).toFixed(1)}%
                      </span>
                      <span>•</span>
                      <span className="text-rose-700 font-semibold">
                        Neg: {(item.probabilities.negative * 100).toFixed(1)}%
                      </span>
                      {item.confidence && (
                        <>
                          <span>•</span>
                          <span className="text-indigo-600 font-semibold">
                            Confidence: {(item.confidence * 100).toFixed(1)}%
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer shrink-0"
                  title="Delete feedback"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
