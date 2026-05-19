// ==========================================
// App.tsx — Root component with routing
// React Router DOM v6 configuration
// ==========================================

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/shared/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import OnboardingPage from './pages/OnboardingPage';
import FeedPage from './pages/FeedPage';
import ExplorePage from './pages/ExplorePage';
import StudioPage from './pages/StudioPage';
import InboxPage from './pages/InboxPage';
import ProfilePage from './pages/ProfilePage';
import { useStore } from './store/useStore';
import supabase from './lib/supabase';
import api from './lib/axios';

const App: React.FC = () => {
  const { setUser, setAccessToken, setAuthLoading, logout } = useStore();

  useEffect(() => {
    let active = true;

    // Helper function to fetch full relational user profile
    const fetchProfile = async (userId: string, token: string) => {
      try {
        // Set loading state
        setAuthLoading(true);
        // Force the access token in state so the request interceptor attaches it
        setAccessToken(token);

        const res = await api.get(`/users/${userId}/portfolio`);
        if (active) {
          setUser(res.data);
        }
      } catch (err: any) {
        console.warn('[App] Failed to fetch user profile:', err.response?.status === 404 ? 'Profile not synced yet' : err.message);
        if (active) {
          // If profile does not exist in DB (404), they must go through onboarding.
          // Keep user as null (which triggers onboarding redirection in ProtectedRoute)
          setUser(null);
        }
      } finally {
        if (active) {
          setAuthLoading(false);
        }
      }
    };

    // 1. Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!active) return;
      if (session) {
        fetchProfile(session.user.id, session.access_token);
      } else {
        logout();
        setAuthLoading(false);
      }
    });

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      
      if (session) {
        fetchProfile(session.user.id, session.access_token);
      } else {
        logout();
        setAuthLoading(false);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [setUser, setAccessToken, setAuthLoading, logout]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />

        {/* Protected routes with MainLayout */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<FeedPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/studio" element={<StudioPage />} />
          <Route path="/inbox" element={<InboxPage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
