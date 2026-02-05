import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ContentPage from './pages/ContentPage';
import PostScheduler from './pages/PostScheduler'; // <--- IMPORT THIS
import LandingPage from './pages/LandingPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import AnalyticsPage from './pages/AnalyticsPage';

function App() {
  return (
    <Router>
      <Routes>
        
        {/* --- 1. Standalone Public Routes (No Navbar/Footer) --- */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* --- 2. Layout Routes (Has Navbar & Footer) --- */}
        <Route element={<MainLayout />}>
          
          {/* A. Public Pages inside Layout */}
          <Route path="/" element={<LandingPage />} />

          {/* B. Protected Pages inside Layout */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/content" element={<ContentPage />} />
            <Route path="/schedule" element={<PostScheduler />} /> {/* <--- ADDED THIS */}
            <Route path="/analytics" element={<AnalyticsPage />} />
          </Route>

        </Route>

        {/* --- 404 Catch All --- */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;