---
title: AI Startup Marketing Assistant - MARKETxAI
emoji: 🚀
colorFrom: indigo
colorTo: purple
sdk: gradio
sdk_version: 4.44.0
app_file: app.py
pinned: false
---

# AI Startup Marketing Assistant - MARKETxAI

Clean, high-performance web platform for managing startup profiles, marketing campaigns, target audience strategy, competitor benchmarks, and feedback.

## Features
- **Clean Empty-State Architecture**: Pure user-generated data model with zero hardcoded fake metrics or fake AI responses.
- **Startup Profile Management**: Customize and persist startup branding, industry category, budget, brand tone, and target location.
- **Marketing Campaign Manager**: Full CRUD capabilities to create, edit, duplicate, and delete marketing campaigns.
- **Competitor Intelligence & Audience Targeting**: Add and manage custom competitor profiles and target demographic segments.
- **Future AI/ML Integration Ready**: Structured UI interfaces and clean service placeholders ready for backend AI model connection.

## Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start dev server:
   ```bash
   npm run dev
   ```

3. Build production bundle:
   ```bash
   npm run build
   ```

## Deploying on Hugging Face Spaces

1. Create a new **Space** on [huggingface.co/new-space](https://huggingface.co/new-space).
2. Select **Docker** as the Space SDK.
3. Upload or git push all files in this repository to your Hugging Face Space.
4. Hugging Face will automatically build and host the application!
