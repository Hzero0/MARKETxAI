import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { StartupProvider } from './context/StartupContext';
import { CampaignProvider } from './context/CampaignContext';

import { LandingPage } from './pages/LandingPage';
import { AuthLayout } from './layouts/AuthLayout';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';

import { DashboardLayout } from './layouts/DashboardLayout';
import { DashboardOverview } from './pages/dashboard/DashboardOverview';
import { StartupProfile } from './pages/dashboard/StartupProfile';
import { Campaigns } from './pages/dashboard/Campaigns';
import { ContentStudio } from './pages/dashboard/ContentStudio';
import { TargetAudience } from './pages/dashboard/TargetAudience';
import { CustomerInsights } from './pages/dashboard/CustomerInsights';
import { SentimentAnalysis } from './pages/dashboard/SentimentAnalysis';
import { CampaignPrediction } from './pages/dashboard/CampaignPrediction';
import { Recommendations } from './pages/dashboard/Recommendations';
import { CompetitorAnalysis } from './pages/dashboard/CompetitorAnalysis';
import { Analytics } from './pages/dashboard/Analytics';
import { FeedbackPage } from './pages/dashboard/FeedbackPage';
import { SettingsPage } from './pages/dashboard/SettingsPage';

export function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <StartupProvider>
          <CampaignProvider>
            <Routes>
              {/* Landing Page */}
              <Route path="/" element={<LandingPage />} />

              {/* Auth Routes */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              </Route>

              {/* Dashboard Layout & Child Routes */}
              <Route path="/app" element={<DashboardLayout />}>
                <Route index element={<Navigate to="/app/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardOverview />} />
                <Route path="profile" element={<StartupProfile />} />
                <Route path="campaigns" element={<Campaigns />} />
                <Route path="content-studio" element={<ContentStudio />} />
                <Route path="target-audience" element={<TargetAudience />} />
                <Route path="customer-insights" element={<CustomerInsights />} />
                <Route path="prediction" element={<CampaignPrediction />} />
                <Route path="sentiment" element={<SentimentAnalysis />} />
                <Route path="recommendations" element={<Recommendations />} />
                <Route path="competitors" element={<CompetitorAnalysis />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="feedback" element={<FeedbackPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>

              {/* Catch-all fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </CampaignProvider>
        </StartupProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
