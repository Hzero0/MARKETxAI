---
title: AI Startup Marketing Assistant - MARKETxAI
colorFrom: indigo
colorTo: purple
sdk: gradio
sdk_version: 4.44.0
app_file: app.py
pinned: false
---

# AI Startup Marketing Assistant - MARKETxAI

Clean, high-performance web platform for managing startup profiles, marketing campaigns, target audience strategy, competitor benchmarks, marketing poster generation, and BERT-powered customer sentiment analysis.

## Features
- **Marketing Poster Studio**: Generate visual, multi-format promotional posters and marketing assets with high-res PNG export and instant style remixing.
- **BERT Sentiment Analysis Engine**: Real-time natural language processing of customer feedback, reviews, and social mentions, returning 3-class sentiment classifications (`Positive`, `Negative`, `Neutral`) with complete probability distributions ($p \in [0, 1], \sum p \approx 1$).
- **Multi-Tenant Startup Isolation**: Feedback records, profiles, and campaigns are partitioned strictly by `userId` in MongoDB, preventing cross-startup data leakage.
- **Startup Profile Management**: Customize and persist startup branding, industry category, budget, brand tone, and target location.
- **Marketing Campaign Manager**: Full CRUD capabilities to create, edit, duplicate, and delete marketing campaigns.
- **Competitor Intelligence & Audience Targeting**: Add and manage custom competitor profiles and target demographic segments.

---

## Architecture

| Component | Technology | Default Port | Description |
|---|---|---|---|
| **Frontend** | React 19, Vite 8, Tailwind CSS 4, Recharts | `5173` | Interactive dashboard & visualization UI |
| **Backend API** | Node.js, Express, Mongoose | `5000` | REST API, MongoDB data access, orchestrator |
| **AI NLP Service** | Python 3, Flask, Transformers (BERT) | `5001` | Modular BERT sentiment inference pipeline |
| **Database** | MongoDB | `27017` | Multi-tenant persistent document store |

---

## Running Locally

### 1. Prerequisites
- **Node.js** v18+ and **npm**
- **Python** 3.10+ (with `flask` and `transformers` / `vaderSentiment`)
- **MongoDB** running locally or a MongoDB Atlas connection string in `.env`

### 2. Install Dependencies
```bash
# Frontend & Backend dependencies
npm install

# Python AI Service dependencies
pip install flask transformers torch
```

### 3. Start the Services

#### Option A: Start Python AI Microservice (Port 5001)
```bash
python ai_service/sentiment_api.py
```

#### Option B: Start Node.js Express Backend (Port 5000)
```bash
node server.js
```

#### Option C: Start Vite Development Server (Port 5173)
```bash
npm run dev
```

Open your browser at **`http://localhost:5173`**.

---

## API Endpoints Reference

### Sentiment & Feedback Analysis
* `POST /api/sentiment/analyze`: Classifies feedback text via the BERT pipeline and persists record under `userId`.
  * **Request Body**:
    ```json
    {
      "text": "I love the product. The customer support is excellent!",
      "userId": "usr-demo-01",
      "rating": 5,
      "category": "Customer Support"
    }
    ```
  * **Response Body**:
    ```json
    {
      "success": true,
      "feedback": {
        "id": "6aef...",
        "userId": "usr-demo-01",
        "text": "I love the product. The customer support is excellent!",
        "sentiment": "Positive",
        "confidence": 0.75,
        "probabilities": {
          "positive": 0.75,
          "neutral": 0.22,
          "negative": 0.03
        },
        "createdAt": "2026-11-08T..."
      }
    }
    ```
* `GET /api/sentiment/:userId`: Retrieves feedback records and calculated sentiment distribution strictly isolated for the requested startup.
* `DELETE /api/sentiment/:id`: Deletes a feedback record.

---

## Deploying on Hugging Face Spaces
1. Create a new **Space** on [huggingface.co/new-space](https://huggingface.co/new-space).
2. Select **Docker** as the Space SDK.
3. Upload or git push all files in this repository to your Hugging Face Space.
4. Hugging Face will automatically build and host the application.
