import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginSuccess } from '../features/user/userSlice'; // Import standard action
import api from '../services/api';
import { Command, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Local UI State (Since we are fetching in component)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Direct API Call
      const response = await api.post('/auth/login', { email, password });
      
      const { token, user } = response.data;

      // 2. Dispatch to Redux Store
      dispatch(loginSuccess({
        email: user.email,
        token: token,
        // Backend doesn't return business/socials yet, but store handles nulls
        business: null, 
        social_accounts: []
      }));

      // 3. Navigate
      navigate('/dashboard');

    } catch (err) {
      console.error("Login Error:", err);
      // Handle axios error response
      const msg = err.response?.data?.message || "Something went wrong. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log("Initiating Google login... (Functionality pending)");
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#FAFAFA] text-[#111] px-4 font-sans selection:bg-[#111] selection:text-white relative overflow-hidden">
      
      {/* --- BACKGROUNDS --- */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
            backgroundImage: `linear-gradient(to right, #E5E5E5 1px, transparent 1px), linear-gradient(to bottom, #E5E5E5 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
            opacity: 0.5
        }}
      />
      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      {/* --- CONTENT --- */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="w-full max-w-[400px] relative z-10"
      >
        
        {/* Card Container */}
        <div className="bg-white/80 backdrop-blur-xl border border-[#E5E5E5] shadow-2xl shadow-gray-200/50 rounded-2xl p-8 sm:p-10 relative overflow-hidden">
          
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#111] to-transparent opacity-10" />

          {/* Header */}
          <div className="mb-8 flex flex-col text-center">
            <img src="../../public/logo.png" alt="Synapse Logo" className="h-auto w-80" />
            <p className="mt-2 text-sm text-[#666]">
              Enter credentials to initialize session.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono font-medium text-[#888] uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@company.com"
                className="w-full rounded-lg border border-[#E5E5E5] bg-white/50 px-3 py-2.5 text-sm text-[#111] placeholder-gray-400 transition-all focus:border-[#111] focus:bg-white focus:ring-1 focus:ring-[#111] outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-mono font-medium text-[#888] uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full rounded-lg border border-[#E5E5E5] bg-white/50 px-3 py-2.5 text-sm text-[#111] placeholder-gray-400 transition-all focus:border-[#111] focus:bg-white focus:ring-1 focus:ring-[#111] outline-none"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-100 p-3 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                <p className="text-xs text-red-600 font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group w-full rounded-lg bg-[#111] py-2.5 text-sm font-semibold text-white shadow-md shadow-gray-200 transition-all hover:bg-black hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Login
                  <ArrowRight size={16} className="opacity-70 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="pt-6 border-t border-[#F5F5F5] text-center">
            <p className="text-xs text-[#666]">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="font-semibold text-[#111] hover:underline decoration-1 underline-offset-2"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

function GoogleLogo() {
  return (
    <svg className="h-4 w-4" aria-hidden="true" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

export default LoginPage;