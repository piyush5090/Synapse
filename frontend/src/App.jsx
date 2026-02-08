import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess, authFailed } from './features/user/userSlice';
import api from './services/api'; 
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
import DocumentationPage from './pages/docs/DocumentationPage';
import SystemTokenGuide from './pages/docs/SystemTokenGuide';
import EmailCampaignsPage from './pages/EmailCampaignsPage';
import BrevoSetup from './pages/docs/BrevoSetup';
import AdminDashboard from './pages/admin/AdminDashboard'; 

// Layouts & Components
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';

/**
 * Wrapper for Public Routes.
 */
const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.user);
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

/**
 * Wrapper for Admin Routes.
 */
const AdminRoute = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  if (user?.role !== 'admin') {
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

      // 1. No token? User is guest.
      if (!token) {
        dispatch(authFailed());
        return;
      }

      try {
        // 2. Call /me to get full profile (role, business, etc)
        const { data } = await api.get('/auth/me'); 
        
        // 3. Security: Check Ban Status immediately on load
        if (data.is_banned) {
            console.error("User is banned. Logging out.");
            localStorage.removeItem('token');
            dispatch(authFailed());
            return;
        }

        // 4. Success: Update Redux
        // Passing 'token' from localStorage because /me doesn't return a new token
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
        
        {/* --- 1. Public Routes --- */}
        <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
        <Route path="/signup" element={<PublicOnlyRoute><SignupPage /></PublicOnlyRoute>} />
        
        <Route path="/about" element={<AboutPage />} />
        <Route path="/legal" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        
        <Route path="/docs" element={<DocumentationPage />} />
        <Route path="/docs/system-token" element={<SystemTokenGuide />} />
        <Route path="/docs/brevo-setup" element={<BrevoSetup />} />

        {/* --- 2. Layout Routes --- */}
        <Route element={<MainLayout />}>
          
          <Route path="/" element={<PublicOnlyRoute><LandingPage /></PublicOnlyRoute>} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/content" element={<ContentPage />} />
            <Route path="/schedule" element={<PostScheduler />} />
            <Route path="/email-campaigns" element={<EmailCampaignsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
          </Route>

        </Route>

        {/* --- 404 --- */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;