import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import LoginPage from './pages/LoginPage';
import HomeFeed from './pages/HomeFeed';
import ReportIssuePage from './pages/ReportIssuePage';
import TrendingMapPage from './pages/TrendingMapPage';
import LogoutConfirmationPage from './pages/LogoutConfirmationPage';
import { isAuthenticated } from './services/authService';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const auth = isAuthenticated();
  const location = useLocation();

  if (!auth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <HomeFeed />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/report" 
            element={
              <ProtectedRoute>
                <ReportIssuePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/map" 
            element={
              <ProtectedRoute>
                <TrendingMapPage />
              </ProtectedRoute>
            } 
          />
          <Route path="/logout" element={<LogoutConfirmationPage />} />
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
