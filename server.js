
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// --------------------------------------------------------
// MONGODB CONNECTION
// --------------------------------------------------------

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/marketxai';
const LOCAL_MONGODB_URI = 'mongodb://localhost:27017/marketxai';

async function connectToDatabase() {
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 2000 });
    console.log('✅ Connected successfully to primary MongoDB Database!');
  } catch (err) {
    console.warn(`⚠️ Primary MongoDB unavailable (${err.message}). Connecting to local MongoDB server...`);
    try {
      await mongoose.connect(LOCAL_MONGODB_URI, { serverSelectionTimeoutMS: 2000 });
      console.log('✅ Connected successfully to local MongoDB!');
    } catch (localErr) {
      console.error('❌ MongoDB Connection Error:', localErr.message);
    }
  }
}

connectToDatabase();

// --------------------------------------------------------
// MONGOOSE SCHEMAS & MODELS
// --------------------------------------------------------

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'Startup Founder' },
  avatar: { type: String, default: '' }
}, { timestamps: true });

const StartupProfileSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  name: { type: String, default: '' },
  tagline: { type: String, default: '' },
  industry: { type: String, default: '' },
  stage: { type: String, default: '' },
  budget: { type: Number, default: 0 },
  brandTone: { type: String, default: 'Professional' },
  targetLocation: { type: String, default: '' },
  website: { type: String, default: '' }
}, { timestamps: true, strict: false });

const CampaignSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  objective: { type: String, default: 'Brand Awareness' },
  status: { type: String, default: 'Draft' },
  platform: { type: String, default: 'LinkedIn' },
  budget: { type: Number, default: 0 },
  targetAudience: { type: String, default: '' },
  durationDays: { type: Number, default: 30 },
  metrics: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true, strict: false });

const FeedbackSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  text: { type: String, required: true },
  category: { type: String, default: 'General' },
  rating: { type: Number, default: 5 },
  sentiment: { type: String, required: true, enum: ['Positive', 'Negative', 'Neutral'] },
  confidence: { type: Number, default: 0 },
  probabilities: {
    positive: { type: Number, default: 0 },
    neutral: { type: Number, default: 0 },
    negative: { type: Number, default: 0 }
  },
  source: { type: String, default: 'Customer Feedback' }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
const StartupProfile = mongoose.model('StartupProfile', StartupProfileSchema);
const Campaign = mongoose.model('Campaign', CampaignSchema);
const Feedback = mongoose.model('Feedback', FeedbackSchema);

// --------------------------------------------------------
// REST API ROUTES
// --------------------------------------------------------

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'MongoDB Server active' });
});

// AUTH ROUTES

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const user = new User({ name, email, password });
    await user.save();

    res.json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// STARTUP PROFILE ROUTES

app.get('/api/startup/:userId', async (req, res) => {
  try {
    const profile = await StartupProfile.findOne({ userId: req.params.userId });
    res.json(profile || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/startup', async (req, res) => {
  try {
    const { userId, ...profileData } = req.body;

    const profile = await StartupProfile.findOneAndUpdate(
      { userId },
      { userId, ...profileData },
      { new: true, upsert: true }
    );

    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CAMPAIGN ROUTES

app.get('/api/campaigns/:userId', async (req, res) => {
  try {
    console.log(`📥 GET /api/campaigns/${req.params.userId}`);

    const campaigns = await Campaign.find({
      userId: req.params.userId
    }).sort({ createdAt: -1 });

    const formatted = campaigns.map(c => {
      const obj = c.toObject();
      obj.id = c._id.toString();
      obj._id = c._id.toString();
      return obj;
    });

    console.log(`✅ Found ${formatted.length} campaigns for userId: ${req.params.userId}`);
    res.json(formatted);
  } catch (err) {
    console.error('❌ GET campaigns error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/campaigns', async (req, res) => {
  try {
    console.log('📥 POST /api/campaigns:', JSON.stringify(req.body, null, 2));

    const {
      id, _id, userId, name, objective, status, platform, platforms,
      budget, targetAudience, durationDays, metrics, description,
      startDate, endDate, product
    } = req.body;

    if (!userId || !name) {
      return res.status(400).json({
        error: 'userId and name are required'
      });
    }

    const campaignId = id || _id;
    let campaign;

    if (campaignId && mongoose.Types.ObjectId.isValid(campaignId)) {
      campaign = await Campaign.findByIdAndUpdate(
        campaignId,
        {
          userId, name, objective, status, platform, platforms,
          budget, targetAudience, durationDays, metrics,
          description, startDate, endDate, product
        },
        { new: true, upsert: true }
      );
    } else {
      campaign = new Campaign({
        userId,
        name,
        objective: objective || 'Brand Awareness',
        status: status || 'Draft',
        platform: platform || (Array.isArray(platforms) && platforms.length > 0 ? platforms[0] : 'LinkedIn'),
        platforms: platforms || (platform ? [platform] : ['LinkedIn']),
        budget: budget ? Number(budget) : 0,
        targetAudience: targetAudience || '',
        durationDays: durationDays ? Number(durationDays) : 30,
        metrics: metrics || {},
        description: description || '',
        startDate: startDate || '',
        endDate: endDate || '',
        product: product || ''
      });

      await campaign.save();
    }

    const savedObj = campaign.toObject();
    savedObj.id = campaign._id.toString();
    savedObj._id = campaign._id.toString();

    console.log(`✅ Campaign saved: ${savedObj.id}`);
    res.json(savedObj);
  } catch (err) {
    console.error('❌ POST campaigns error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/campaigns/:id', async (req, res) => {
  try {
    await Campaign.findByIdAndDelete(req.params.id);
    res.json({ success: true, id: req.params.id });
  } catch (err) {
    console.error('❌ DELETE campaigns error:', err);
    res.status(500).json({ error: err.message });
  }
});

// --------------------------------------------------------
// SENTIMENT & FEEDBACK NLP ROUTES
// --------------------------------------------------------

const PYTHON_AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:5001';

app.post('/api/sentiment/analyze', async (req, res) => {
  try {
    const {
      text,
      userId = 'usr-demo-01',
      category = 'User Experience',
      rating = 5,
      source = 'Customer Feedback'
    } = req.body;

    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({
        error: 'Feedback text is required and cannot be empty.'
      });
    }

    const cleanText = text.trim();
    let sentimentResult = null;

    try {
      const aiResponse = await fetch(`${PYTHON_AI_SERVICE_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleanText }),
        signal: AbortSignal.timeout(6000)
      });

      if (aiResponse.ok) {
        sentimentResult = await aiResponse.json();
      } else {
        console.warn(`Python AI service responded with HTTP ${aiResponse.status}`);
      }
    } catch (aiErr) {
      console.warn(`Python AI service unavailable: ${aiErr.message}. Using NLP fallback.`);
    }

    if (!sentimentResult || !sentimentResult.probabilities) {
      const lower = cleanText.toLowerCase();

      let posScore = 0.33;
      let negScore = 0.33;
      let neuScore = 0.34;

      const posWords = [
        'love', 'excellent', 'great', 'good', 'awesome',
        'amazing', 'best', 'smooth', 'helpful', 'satisfied'
      ];

      const negWords = [
        'disappointing', 'issue', 'issues', 'bad', 'terrible',
        'awful', 'bug', 'broken', 'slow', 'fail', 'poor'
      ];

      const posCount = posWords.filter(w => lower.includes(w)).length;
      const negCount = negWords.filter(w => lower.includes(w)).length;

      if (posCount > negCount) {
        posScore = 0.85;
        neuScore = 0.10;
        negScore = 0.05;
      } else if (negCount > posCount) {
        negScore = 0.85;
        neuScore = 0.10;
        posScore = 0.05;
      } else {
        neuScore = 0.70;
        posScore = 0.15;
        negScore = 0.15;
      }

      let label = 'Neutral';

      if (posScore > neuScore && posScore > negScore) label = 'Positive';
      if (negScore > neuScore && negScore > posScore) label = 'Negative';

      sentimentResult = {
        sentiment: label,
        confidence: Math.max(posScore, negScore, neuScore),
        probabilities: {
          positive: posScore,
          neutral: neuScore,
          negative: negScore
        },
        model: 'heuristic-nlp-engine'
      };
    }

    const newFeedback = new Feedback({
      userId,
      text: cleanText,
      category,
      rating: Number(rating) || 5,
      sentiment: sentimentResult.sentiment,
      confidence: sentimentResult.confidence,
      probabilities: sentimentResult.probabilities,
      source
    });

    await newFeedback.save();

    const formatted = newFeedback.toObject();
    formatted.id = newFeedback._id.toString();

    console.log(`✅ Feedback saved for user [${userId}]`);

    return res.json({
      success: true,
      feedback: formatted
    });

  } catch (err) {
    console.error('❌ POST sentiment error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET SENTIMENT

app.get('/api/sentiment/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const items = await Feedback.find({ userId }).sort({ createdAt: -1 });

    const total = items.length;
    let posCount = 0;
    let neuCount = 0;
    let negCount = 0;

    const formattedList = items.map(f => {
      const obj = f.toObject();
      obj.id = f._id.toString();

      if (obj.sentiment === 'Positive') posCount++;
      else if (obj.sentiment === 'Negative') negCount++;
      else neuCount++;

      return obj;
    });

    const percentages = {
      positive: total ? Math.round((posCount / total) * 100) : 0,
      neutral: total ? Math.round((neuCount / total) * 100) : 0,
      negative: total ? Math.round((negCount / total) * 100) : 0
    };

    const distribution = [
      { name: 'Positive', count: posCount, percentage: percentages.positive, color: '#10b981' },
      { name: 'Neutral', count: neuCount, percentage: percentages.neutral, color: '#64748b' },
      { name: 'Negative', count: negCount, percentage: percentages.negative, color: '#f43f5e' }
    ];

    res.json({
      success: true,
      userId,
      total,
      counts: {
        positive: posCount,
        neutral: neuCount,
        negative: negCount
      },
      percentages,
      distribution,
      feedbacks: formattedList
    });

  } catch (err) {
    console.error('❌ GET sentiment error:', err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE SENTIMENT

app.delete('/api/sentiment/:id', async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ success: true, id: req.params.id });
  } catch (err) {
    console.error('❌ DELETE sentiment error:', err);
    res.status(500).json({ error: err.message });
  }
});

// --------------------------------------------------------
// SERVE REACT / VITE FRONTEND
// --------------------------------------------------------

const distPath = path.join(__dirname, 'dist');

app.use(express.static(distPath));

app.use((req, res, next) => {
  if (req.method !== 'GET' || req.path.startsWith('/api/')) {
    return next();
  }

  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      next(err);
    }
  });
});

// --------------------------------------------------------
// START SERVER
// --------------------------------------------------------

app.listen(PORT, () => {
  console.log(`🚀 MARKETxAI MongoDB Server running on http://localhost:${PORT}`);
});
