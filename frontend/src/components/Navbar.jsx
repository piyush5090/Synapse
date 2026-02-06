import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/user/userSlice";
import { Command, LogOut, Sparkles } from "lucide-react";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get auth state from Redux
  const { isAuthenticated, email } = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // Generate User Initial
  const userInitial = email ? email.charAt(0).toUpperCase() : "U";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#E5E5E5] bg-[#FAFAFA]/80 backdrop-blur-xl transition-all">
      <div className="mx-auto max-w-[1400px] px-6 h-16 flex items-center justify-between">
        
        {/* --- Logo --- */}
        <Link 
          to={isAuthenticated ? "/dashboard" : "/"} 
          className="group flex items-center gap-2.5 font-bold text-xl tracking-tight text-[#111] transition-opacity hover:opacity-80"
        >
          <img src="../../public/logo.png" alt="Synapse Logo" className="lg:h-12 w-auto h-10" />
        </Link>

        {/* --- Right Actions --- */}
        <div className="flex items-center gap-3">
          
          {isAuthenticated ? (
            /* --- LOGGED IN STATE --- */
            <div className="flex items-center gap-3">
              
              {/* Profile Capsule */}
              <div className="hidden md:flex items-center gap-3 pl-1.5 pr-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm transition-all hover:border-slate-300 hover:shadow-md cursor-default select-none">
                
                {/* Avatar */}
                <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-slate-800 to-black text-white flex items-center justify-center text-[10px] font-bold shadow-inner ring-2 ring-white">
                    {userInitial}
                </div>
                
                {/* Email Display */}
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

              {/* Mobile-only avatar (if screen is small) */}
              <div className="md:hidden h-8 w-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">
                 {userInitial}
              </div>

              {/* Separator */}
              <div className="h-6 w-px bg-slate-200 mx-1 hidden md:block"></div>

              {/* Logout Button */}
              <div
                onClick={handleLogout}
                className="group flex h-9 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-xs font-bold text-slate-600 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600 active:scale-95"
                title="Sign out of your account"
              >
                <LogOut size={14} className="transition-transform group-hover:-translate-x-0.5" />
                <span>Logout</span>
              </div>
            </div>
          ) : (
            /* --- LOGGED OUT STATE --- */
            <div className="flex items-center gap-4">
              <Link 
                to="/login" 
                className="text-sm font-medium text-slate-500 hover:text-[#111] transition-colors"
              >
                Log in
              </Link>
              <Link 
                to="/signup" 
                className="group flex items-center gap-2 text-sm font-semibold bg-[#111] text-white px-5 py-2.5 rounded-xl hover:bg-black hover:shadow-lg hover:-translate-y-0.5 transition-all"
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