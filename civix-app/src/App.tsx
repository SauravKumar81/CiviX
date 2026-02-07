import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomeFeed from './pages/HomeFeed';
import ReportIssuePage from './pages/ReportIssuePage';
import TrendingMapPage from './pages/TrendingMapPage';
import EditReportPage from './pages/EditReportPage';
import LogoutConfirmationPage from './pages/LogoutConfirmationPage';
import ProfilePage from './pages/ProfilePage';
import ProfileSetupPage from './pages/ProfileSetupPage';


import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './context/AuthContext';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <AuthProvider>
        <ThemeProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route 
                path="/profile-setup" 
                element={
                  <ProtectedRoute>
                    <ProfileSetupPage />
                  </ProtectedRoute>
                } 
              />
              <Route path="/" element={<HomeFeed />} />
              <Route 
                path="/report" 
                element={
                  <ProtectedRoute>
                    <ReportIssuePage />
                  </ProtectedRoute>
                } 
              />
              <Route path="/map" element={<TrendingMapPage />} />
              <Route 
                path="/edit-report/:id" 
                element={
                  <ProtectedRoute>
                    <EditReportPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile/:id?" 
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } 
              />
              <Route path="/logout" element={<LogoutConfirmationPage />} />
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
