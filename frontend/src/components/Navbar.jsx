import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/user/userSlice";
import { LogOut, Menu, X, BookOpen, Info, LayoutDashboard } from "lucide-react";
import logo from "../assets/logo.png"; 

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Get auth state from Redux
  const { isAuthenticated, email } = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logout());
    setIsMobileMenuOpen(false);
    navigate("/login");
  };

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  // Generate User Initial
  const userInitial = email ? email.charAt(0).toUpperCase() : "U";
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#E5E5E5] bg-[#FAFAFA]/90 backdrop-blur-xl">
      <div className="mx-auto max-w-[1400px] px-6 h-16 flex items-center justify-between relative z-50 bg-inherit">
        
        {/* --- Logo --- */}
        <Link 
          to={isAuthenticated ? "/dashboard" : "/"} 
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <img src={logo} alt="Synapse Logo" className="lg:h-12 w-auto h-8 md:h-10" />
        </Link>

        {/* --- DESKTOP NAVIGATION --- */}
        <div className="hidden md:flex items-center gap-8">
            <Link 
                to="/about" 
                className={`text-sm font-medium transition-colors ${isActive('/about') ? 'text-blue-600 font-bold' : 'text-slate-600 hover:text-slate-900'}`}
            >
                About
            </Link>
            <Link 
                to="/docs" 
                className={`text-sm font-medium transition-colors ${isActive('/docs') ? 'text-blue-600 font-bold' : 'text-slate-600 hover:text-slate-900'}`}
            >
                Documentation
            </Link>
        </div>

        {/* --- DESKTOP ACTIONS --- */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 pl-1.5 pr-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm cursor-default select-none">
                <div className="h-7 w-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold ring-2 ring-white">
                    {userInitial}
                </div>
                <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-0.5 flex items-center gap-1">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Online
                    </span>
                    <span className="text-xs font-semibold text-slate-700 leading-none max-w-[150px] truncate" title={email}>
                        {email}
                    </span>
                </div>
              </div>
              <div className="h-6 w-px bg-slate-200 mx-1"></div>
              <button
                onClick={handleLogout}
                className="group flex h-9 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-xs font-bold text-slate-600 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600 active:scale-95"
              >
                <LogOut size={14} className="transition-transform group-hover:-translate-x-0.5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-medium text-slate-500 hover:text-[#111] transition-colors">
                Log in
              </Link>
              <Link 
                to="/signup" 
                className="flex items-center gap-2 text-sm font-semibold bg-[#111] text-white px-5 py-2.5 rounded-xl hover:bg-black hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <p className="text-white" >Get Started</p>
              </Link>
            </div>
          )}
        </div>

        {/* --- MOBILE TOGGLE BUTTON --- */}
        <button 
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

      </div>

      {/* --- MOBILE MENU OVERLAY --- */}
      <div 
        className={`
            fixed top-16 left-0 right-0 z-40 bg-[#FAFAFA] md:hidden 
            flex flex-col p-6 overflow-y-auto
            h-[calc(100vh-4rem)] 
            transition-all duration-300 ease-in-out origin-top
            ${isMobileMenuOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'}
        `}
      >
            
            {/* Mobile Links */}
            <div className="flex flex-col gap-4 text-lg font-medium text-slate-900 border-b border-slate-200 pb-8 mb-8">
                {isAuthenticated && (
                     <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 hover:bg-white hover:shadow-sm rounded-xl transition-all">
                        <LayoutDashboard size={20} className="text-purple-600" /> Dashboard
                     </Link>
                )}
                <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 hover:bg-white hover:shadow-sm rounded-xl transition-all">
                    <Info size={20} className="text-blue-600" /> About
                </Link>
                <Link to="/docs" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 hover:bg-white hover:shadow-sm rounded-xl transition-all">
                    <BookOpen size={20} className="text-amber-600" /> Documentation
                </Link>
            </div>

            {/* Mobile Actions */}
            <div className="mt-auto pb-20"> {/* Extra padding bottom for safe area */}
                {isAuthenticated ? (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                            <div className="h-10 w-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                                {userInitial}
                            </div>
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-xs text-slate-500">Signed in as</span>
                                <span className="font-bold text-slate-900 truncate">{email}</span>
                            </div>
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-red-50 text-red-600 font-bold border border-red-100 active:scale-95 transition-transform"
                        >
                            <LogOut size={18} /> Logout
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        <Link 
                            to="/login" 
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="w-full py-3.5 text-center rounded-xl bg-white border border-slate-200 font-bold text-slate-700 shadow-sm active:scale-95 transition-transform"
                        >
                            Log in
                        </Link>
                        <Link 
                            to="/signup" 
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="w-full py-3.5 text-center rounded-xl bg-[#111] font-bold text-white shadow-lg active:scale-95 transition-transform"
                        >
                            <p className="text-white" >Get Started</p>
                        </Link>
                    </div>
                )}
            </div>
      </div>
    </nav>
  );
}