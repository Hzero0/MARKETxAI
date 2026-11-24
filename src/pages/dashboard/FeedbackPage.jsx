import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { storageUtils } from '../../utils/storageUtils';
import { useToast } from '../../context/ToastContext';
import { MessageSquarePlus, Send, Star, Layers, Trash2 } from 'lucide-react';

export const FeedbackPage = () => {
  const { showSuccess } = useToast();
  const [feedbacks, setFeedbacks] = useState(() => storageUtils.getFeedbacks());

  const [rating, setRating] = useState(5);
  const [category, setCategory] = useState('User Interface');
  const [comments, setComments] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comments.trim()) return;

    const item = {
      id: "fb-" + Date.now(),
      rating,
      category,
      comments: comments.trim(),
      date: new Date().toLocaleDateString()
    };

    const updated = [item, ...feedbacks];
    setFeedbacks(updated);
    storageUtils.saveFeedbacks(updated);
    showSuccess("Feedback submitted successfully!");
    setComments('');
  };

  const handleDelete = (id) => {
    const updated = feedbacks.filter((f) => f.id !== id);
    setFeedbacks(updated);
    storageUtils.saveFeedbacks(updated);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-slate-200 bg-white">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <MessageSquarePlus className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Platform Feedback</h1>
            <p className="text-xs text-slate-500">
              Submit user experience feedback and feature suggestions.
            </p>
          </div>
        </div>
      </div>

      {/* Submission Form */}
      <Card title="Submit User Feedback">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Feedback Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl glass-input text-slate-900 bg-white"
              >
                <option value="User Interface">User Interface</option>
                <option value="Feature Request">Feature Request</option>
                <option value="Bug Report">Bug Report</option>
                <option value="General Suggestion">General Suggestion</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Rating</label>
              <div className="flex items-center gap-2 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-amber-400 hover:scale-110 transition-transform"
                  >
                    <Star className={`w-5 h-5 ${star <= rating ? 'fill-amber-400' : 'text-slate-300'}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Feedback & Comments *</label>
            <textarea
              rows={3}
              required
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Enter your feedback, suggestions, or reports here..."
              className="w-full px-3.5 py-2 rounded-xl glass-input text-slate-900 resize-none"
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" icon={Send}>
              Submit Feedback
            </Button>
          </div>
        </form>
      </Card>

      {/* FEEDBACK LIST OR CLEAN EMPTY STATE */}
      <Card title="Submitted Feedback Records">
        {feedbacks.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center p-6 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <Layers className="w-10 h-10 text-slate-300 mb-2" />
            <h4 className="text-sm font-bold text-slate-800">No feedback submitted</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              Submitted user feedback and feature requests will be listed here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {feedbacks.map((item) => (
              <div key={item.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-900">{item.category}</span>
                    <span className="text-[10px] text-slate-400">• {item.date}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.comments}</p>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1 text-slate-400 hover:text-rose-600 rounded-md shrink-0"
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
