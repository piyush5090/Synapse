import { Github, Linkedin, Mail, Globe, Cpu, ShieldCheck, Zap } from 'lucide-react';
import piyushImg from '../assets/piyush.jpeg';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[#F8F9FC] text-slate-900 font-sans selection:bg-purple-100 overflow-x-hidden">
      
      {/* --- BACKGROUND BLOBS (Subtle Light Version) --- */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-100/60 rounded-full blur-[100px] mix-blend-multiply" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-100/60 rounded-full blur-[100px] mix-blend-multiply" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        
        {/* --- 1. HERO --- */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-blue-100 shadow-sm text-blue-600 text-xs font-bold uppercase tracking-widest mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            The Synapse Vision
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 mb-6">
            Creativity Meets <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Intelligence.</span>
          </h1>
          
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Bridging the gap between chaotic ideas and scheduled perfection.
            Automated, intelligent, and unbreakable.
          </p>
        </div>

        {/* --- 2. BENTO GRID (Light Theme Cards) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          
          {/* Feature A: Large Card */}
          <div className="md:col-span-2 bg-white border border-slate-200 rounded-3xl p-8 md:p-12 flex flex-col justify-between shadow-sm hover:shadow-lg hover:border-blue-200 transition-all group relative overflow-hidden">
             {/* Decorative Gradient Blob */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-full pointer-events-none" />
             
             <div>
               <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                 <Cpu size={24} />
               </div>
               <h3 className="text-2xl font-bold text-slate-900 mb-3">Neural Core Engine</h3>
               <p className="text-slate-500 leading-relaxed max-w-md">
                 Synapse uses advanced AI context awareness to generate content that sounds human, ensuring your brand voice never sounds robotic.
               </p>
             </div>
          </div>

          {/* Feature B: Tall Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col shadow-sm hover:shadow-lg hover:border-purple-200 transition-all group relative overflow-hidden">
             <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:rotate-12 transition-transform">
               <ShieldCheck size={24} />
             </div>
             <h3 className="text-xl font-bold text-slate-900 mb-2">Bot-Proof</h3>
             <p className="text-slate-500 text-sm mb-8 flex-1">
               Heuristic filtering blocks 99.9% of crawler bots, ensuring your analytics reflect real humans only.
             </p>
             {/* Abstract Chart */}
             <div className="h-24 bg-slate-50 rounded-xl border border-slate-100 relative overflow-hidden">
                <div className="absolute bottom-0 left-4 w-4 h-10 bg-slate-200 rounded-t-sm" />
                <div className="absolute bottom-0 left-10 w-4 h-16 bg-purple-500 shadow-lg rounded-t-sm" />
                <div className="absolute bottom-0 left-16 w-4 h-8 bg-slate-200 rounded-t-sm" />
             </div>
          </div>

          {/* Feature C: Wide Card */}
          <div className="md:col-span-3 bg-white border border-slate-200 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 shadow-sm hover:shadow-lg hover:border-pink-200 transition-all">
             <div className="w-14 h-14 shrink-0 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-500">
               <Zap size={28} />
             </div>
             <div className="flex-1 text-center md:text-left">
               <h3 className="text-xl font-bold text-slate-900 mb-2">Zero-Failure Infrastructure</h3>
               <p className="text-slate-500">
                 Engineered with atomic database locks and robust polling loops. When Synapse says "Scheduled", it means "Published".
               </p>
             </div>
             <div className="px-5 py-2 rounded-full bg-slate-900 text-white text-xs font-bold tracking-wide shadow-md">
                100% Uptime
             </div>
          </div>

        </div>

        {/* --- 3. THE CREATOR (Profile Card) --- */}
        <div className="relative group mx-auto max-w-sm">
          {/* Subtle Glow behind card */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-200 to-purple-200 rounded-[2rem] blur opacity-50 group-hover:opacity-100 transition duration-500" />
          
          <div className="relative bg-white border border-slate-200 rounded-[1.8rem] p-3 overflow-hidden shadow-sm">
            
            {/* Image Area */}
            <div className="h-90 bg-slate-100 rounded-3xl overflow-hidden relative group">
               {/* Replace with your image */}
               <img 
                 src={piyushImg} 
                 alt="Piyush Govindani" 
                 className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
               />
               
               {/* Overlay for Text Legibility */}
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-90" />
               
               <div className="absolute bottom-5 left-5 text-white">
                 <h3 className="text-2xl font-bold">Piyush Govindani</h3>
                 <p className="text-blue-200 font-medium text-sm">Founder & Engineer</p>
               </div>
            </div>

            {/* Links Area */}
            <div className="px-6 py-6 text-center">
              <p className="text-slate-500 text-sm mb-6 leading-relaxed font-medium">
                Building systems that blend logic with creativity. <br/> 
                Full Stack Developer.
              </p>

              <div className="flex justify-center gap-4">
                 <SocialIcon href="https://github.com/piyush5090" icon={<Github size={18} />} />
                 <SocialIcon href="https://www.linkedin.com/in/piyush-govindani/" icon={<Linkedin size={18} />} />
                 <SocialIcon href="mailto:govindanipiyush10@gmail.com" icon={<Mail size={18} />} />
                 <SocialIcon href="https://piyush-portfolio-25.netlify.app/" icon={<Globe size={18} />} />
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

// Helper for Icons (Light Theme)
const SocialIcon = ({ href, icon }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noreferrer" 
    className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 text-slate-500 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all flex items-center justify-center hover:scale-110 shadow-sm"
  >
    {icon}
  </a>
);

export default AboutPage;