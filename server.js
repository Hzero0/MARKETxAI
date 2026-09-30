import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --------------------------------------------------------
// MONGODB CONNECTION
// --------------------------------------------------------
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/marketxai';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected successfully to MongoDB Database!'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err.message));

// --------------------------------------------------------
// MONGOOSE SCHEMAS & MODELS (Flexible Non-Relational NoSQL)
// --------------------------------------------------------

// 1. User Schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'Startup Founder' },
  avatar: { type: String, default: '' }
}, { timestamps: true });

// 2. Startup Profile Schema
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
}, { timestamps: true, strict: false }); // strict: false allows arbitrary non-relational document fields

// 3. Campaign Schema
const CampaignSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  objective: { type: String, default: 'Brand Awareness' },
  status: { type: String, default: 'Draft' },
  platform: { type: String, default: 'LinkedIn' },
  budget: { type: Number, default: 0 },
  targetAudience: { type: String, default: '' },
  durationDays: { type: Number, default: 30 },
  metrics: { type: mongoose.Schema.Types.Mixed, default: {} } // Flexible NoSQL document
}, { timestamps: true, strict: false });

const User = mongoose.model('User', UserSchema);
const StartupProfile = mongoose.model('StartupProfile', StartupProfileSchema);
const Campaign = mongoose.model('Campaign', CampaignSchema);

// --------------------------------------------------------
// REST API ROUTES
// --------------------------------------------------------

// Health check
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
    res.json({ id: user._id.toString(), name: user.name, email: user.email, role: user.role });
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
    res.json({ id: user._id.toString(), name: user.name, email: user.email, role: user.role });
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
    const campaigns = await Campaign.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    const formatted = campaigns.map(c => {
      const obj = c.toObject();
      obj.id = c._id.toString();
      obj._id = c._id.toString();
      return obj;
    });
    console.log(`✅ Found ${formatted.length} campaigns in MongoDB for userId: ${req.params.userId}`);
    res.json(formatted);
  } catch (err) {
    console.error(`❌ GET /api/campaigns/${req.params.userId} error:`, err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/campaigns', async (req, res) => {
  try {
    console.log('📥 POST /api/campaigns - received req.body:', JSON.stringify(req.body, null, 2));
    const { id, _id, userId, name, objective, status, platform, platforms, budget, targetAudience, durationDays, metrics, description, startDate, endDate, product } = req.body;

    if (!userId || !name) {
      console.error('❌ POST /api/campaigns Validation Error: userId and name are required', { userId, name });
      return res.status(400).json({ error: 'userId and name are required' });
    }

    const campaignId = id || _id;
    let campaign;

    if (campaignId && mongoose.Types.ObjectId.isValid(campaignId)) {
      console.log(`🔄 Updating existing campaign in MongoDB Atlas (id: ${campaignId})`);
      campaign = await Campaign.findByIdAndUpdate(
        campaignId,
        { userId, name, objective, status, platform, platforms, budget, targetAudience, durationDays, metrics, description, startDate, endDate, product },
        { new: true, upsert: true }
      );
    } else {
      console.log('✨ Creating new campaign document in MongoDB Atlas...');
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

    const savedObj = campaign.toObject ? campaign.toObject() : campaign;
    savedObj.id = campaign._id.toString();
    savedObj._id = campaign._id.toString();

    console.log(`✅ Campaign successfully persisted to MongoDB Atlas (Document ID: ${savedObj.id})`);
    res.json(savedObj);
  } catch (err) {
    console.error('❌ POST /api/campaigns error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/campaigns/:id', async (req, res) => {
  try {
    console.log(`🗑️ DELETE /api/campaigns/${req.params.id}`);
    await Campaign.findByIdAndDelete(req.params.id);
    console.log(`✅ Deleted campaign document ${req.params.id} from MongoDB Atlas`);
    res.json({ success: true, id: req.params.id });
  } catch (err) {
    console.error(`❌ DELETE /api/campaigns/${req.params.id} error:`, err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 MARKETxAI MongoDB Server running on http://localhost:${PORT}`);
});
