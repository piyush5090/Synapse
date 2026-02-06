import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, authFailed } from './features/user/userSlice';
import api from './services/api'; // Ensure this path matches your project
import { Loader2 } from 'lucide-react';

// Pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ContentPage from './pages/ContentPage';
import PostScheduler from './pages/PostScheduler';
import LandingPage from './pages/LandingPage';
import NotFoundPage from './pages/NotFoundPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AboutPage from './pages/AboutPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import DocumentationPage from './pages/DocumentationPage';
import SystemTokenGuide from './pages/docs/SystemTokenGuide';

// Layouts & Components
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';

/**
 * Wrapper for Public Routes (Login, Signup, Landing).
 * If User is authenticated, they are redirected to Dashboard immediately.
 */
const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.user);
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function App() {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.user);

  // --- GLOBAL AUTH CHECK ON LOAD ---
  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem('token');

      // 1. No token? Stop loading, user is guest.
      if (!token) {
        dispatch(authFailed());
        return;
      }

      // 2. Token exists? Verify with Backend.
      try {
        const { data } = await api.get('/auth/me'); 
        // Expected data: { id, email, business, social_accounts, ... }
        
        // Dispatch success with fresh data + existing token
        dispatch(loginSuccess({ ...data, token }));
      } catch (err) {
        console.error("Session expired or invalid:", err);
        dispatch(authFailed());
      }
    };

    verifyUser();
  }, [dispatch]);

  // --- SHOW LOADER WHILE CHECKING ---
  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#F8F9FC]">
        <Loader2 className="animate-spin text-purple-600" size={40} />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        
        {/* --- 1. Standalone Public Routes --- */}
        {/* If logged in, these redirect to Dashboard */}
        <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
        <Route path="/signup" element={<PublicOnlyRoute><SignupPage /></PublicOnlyRoute>} />


        {/* --- 2. Layout Routes --- */}
        <Route element={<MainLayout />}>
          
          {/* A. Landing Page (Public) */}
          {/* If logged in, redirects to Dashboard. If not, shows Landing. */}
          <Route path="/" element={<PublicOnlyRoute><LandingPage /></PublicOnlyRoute>} />
          <Route path="/about" element={<PublicOnlyRoute><AboutPage /></PublicOnlyRoute>} />
          <Route path="/legal" element={<PublicOnlyRoute><PrivacyPolicy /></PublicOnlyRoute>} />
          <Route path="/terms" element={<PublicOnlyRoute><TermsOfService /></PublicOnlyRoute>} />
          <Route path="/docs" element={<PublicOnlyRoute><DocumentationPage /></PublicOnlyRoute>} />
          <Route path="/docs/system-token" element={<PublicOnlyRoute><SystemTokenGuide /></PublicOnlyRoute>} />

          {/* B. Protected Pages */}
          {/* ProtectedRoute already handles "If NOT logged in, go to Login" */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/content" element={<ContentPage />} />
            <Route path="/schedule" element={<PostScheduler />} />
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