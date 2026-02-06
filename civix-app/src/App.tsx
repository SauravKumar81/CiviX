import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import LoginPage from './pages/LoginPage';
import HomeFeed from './pages/HomeFeed';
import ReportIssuePage from './pages/ReportIssuePage';
import TrendingMapPage from './pages/TrendingMapPage';
import LogoutConfirmationPage from './pages/LogoutConfirmationPage';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<HomeFeed />} />
          <Route path="/report" element={<ReportIssuePage />} />
          <Route path="/map" element={<TrendingMapPage />} />
          <Route path="/logout" element={<LogoutConfirmationPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
