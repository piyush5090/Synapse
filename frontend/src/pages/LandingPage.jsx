import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  Command, 
  Sparkles, 
  Globe, 
  Mail, 
  Clock, 
  BarChart3,
  CheckCircle2,
  Calendar,
  Briefcase,
  Layers,
  Zap,
  MessageSquare,
  Link as LinkIcon,
  AlignLeft,
  PenTool
} from "lucide-react";

export default function LandingPage() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 100]);

  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] text-[#111] font-sans selection:bg-[#111] selection:text-white">
      
      {/* --- HERO SECTION --- */}
      <section className="pt-32 pb-24 border-b border-[#E5E5E5] overflow-hidden">
        <div className="mx-auto max-w-[1400px] px-6">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            
            {/* LEFT: Simple, Direct Pitch */}
            <div className="lg:col-span-7 relative z-10">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 border border-[#E5E5E5] bg-white rounded-full px-3 py-1 text-xs font-mono text-[#666] mb-8">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"/>
                  New: Email Marketing Added
                </div>

                {/* HIGHLIGHTED SYNAPSE */}
                <h1 className="text-7xl lg:text-[8rem] font-bold tracking-tighter leading-[0.9] mb-6 text-[#111]">
                  <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#111] to-[#666]">
                    Synapse
                  </span>
                  <span className="text-indigo-600">.</span>
                </h1>
                <h2 className="text-4xl lg:text-5xl font-semibold tracking-tight text-[#888] mb-8">
                    Social Media, on Autopilot.
                </h2>
                
                <p className="text-xl text-[#444] max-w-xl leading-relaxed mb-10">
                  The all-in-one tool to create, schedule, and post content automatically. 
                  You provide the idea, AI handles the rest.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <Link to="/signup" className="group h-14 px-8 bg-[#111] text-white font-medium rounded-lg flex items-center gap-3 transition-all hover:pr-10">
                    <p className="text-white" >Get Started Free</p>
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1 text-white" />
                  </Link>
                  
                  <div className="h-14 px-6 border border-[#E5E5E5] bg-white rounded-lg flex items-center gap-3 text-sm font-medium text-[#444]">
                    <div className="flex -space-x-2">
                       <div className="h-6 w-6 rounded-full bg-gray-200 border border-white"/>
                       <div className="h-6 w-6 rounded-full bg-gray-300 border border-white"/>
                       <div className="h-6 w-6 rounded-full bg-gray-400 border border-white"/>
                    </div>
                    <span>Loved by 2,400+ Creators</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* RIGHT: Simple Workflow Visual */}
            <div className="lg:col-span-5 relative">
               <motion.div 
                 style={{ y: y1 }}
                 className="relative z-10 bg-white rounded-xl shadow-2xl border border-[#E5E5E5] overflow-hidden"
               >
                 <div className="h-10 border-b border-[#F0F0F0] bg-[#FAFAFA] flex items-center justify-between px-4">
                    <div className="flex gap-2">
                        <div className="h-3 w-3 rounded-full bg-[#FF5F56]" />
                        <div className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
                        <div className="h-3 w-3 rounded-full bg-[#27C93F]" />
                    </div>
                    <div className="text-[10px] font-mono text-[#999] uppercase tracking-widest">
                        Status: Active
                    </div>
                 </div>

                 <div className="p-6 space-y-6">
                    {/* STEP 1: INPUT */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-[#999] uppercase tracking-wider">
                            <MessageSquare size={12} />
                            <span>1. You have an idea</span>
                        </div>
                        <div className="bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg p-4 font-medium text-sm text-[#333]">
                            "Write a post about our new coffee blend."
                            <span className="inline-block w-2 h-4 bg-[#111] ml-1 animate-pulse align-middle"/>
                        </div>
                    </div>

                    {/* STEP 2: OUTPUT */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-[#999] uppercase tracking-wider">
                            <Sparkles size={12} />
                            <span>2. AI Creates the Post</span>
                        </div>
                        
                        <div className="flex gap-4 p-4 bg-white border border-[#E5E5E5] rounded-xl shadow-sm">
                            <div className="h-24 w-24 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden relative">
                                <img 
                                    src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=150&q=80" 
                                    alt="Generated" 
                                    className="object-cover h-full w-full"
                                />
                                <div className="absolute bottom-1 right-1 bg-black/50 text-white text-[8px] px-1 rounded backdrop-blur-sm">AI</div>
                            </div>
                            <div className="flex-1 space-y-2">
                                <p className="text-xs font-medium text-[#444] leading-relaxed">
                                    "Start your day with clarity. Our new single-origin pour over is ready. ☕️✨"
                                </p>
                                <div className="flex flex-wrap gap-1">
                                    <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">#morningbrew</span>
                                    <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">#coffee</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* STEP 3: SUCCESS */}
                    <div className="pt-2 border-t border-dashed border-[#E5E5E5]">
                        <div className="flex items-center justify-between bg-green-50 border border-green-100 p-3 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 bg-green-100 text-green-700 rounded-md flex items-center justify-center">
                                    <Calendar size={16} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-green-800">Scheduled for Tomorrow</p>
                                    <p className="text-[10px] text-green-600">Posted automatically at 9:00 AM</p>
                                </div>
                            </div>
                            <CheckCircle2 size={18} className="text-green-600" />
                        </div>
                    </div>
                 </div>
               </motion.div>

               <div className="absolute top-10 -right-10 w-full h-full border border-[#E5E5E5] rounded-xl -z-10 bg-[#FAFAFA]" />
               <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-gradient-to-tr from-indigo-100 to-purple-100 blur-[80px] opacity-60 -z-20" />
            </div>
          </div>
        </div>
      </section>

      {/* --- STATS TICKER --- */}
      <section className="border-b border-[#E5E5E5] bg-white overflow-hidden">
        <div className="flex whitespace-nowrap">
           {[...Array(10)].map((_, i) => (
             <div key={i} className="flex items-center gap-8 py-6 px-4 animate-marquee opacity-30 grayscale">
                <span className="text-xl font-bold text-[#111]">CREATE /// SCHEDULE /// GROW</span>
                <Zap size={16} className="text-[#111]" />
             </div>
           ))}
        </div>
      </section>

      {/* --- FEATURES (Easy to Understand) --- */}
      <section id="features" className="py-32 bg-[#FAFAFA]">
        <div className="mx-auto max-w-[1400px] px-6">
            <div className="mb-16">
                <h2 className="text-4xl font-bold tracking-tight mb-4">Everything you need</h2>
                <p className="text-[#666] max-w-2xl text-lg">
                    We replaced the hard work with smart tools. Here is how Synapse helps you grow.
                </p>
            </div>

            {/* BENTO GRID */}
            <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6 auto-rows-[minmax(300px,auto)]">
                
                {/* 1. BRAND PROFILE (Wide - ACCURATE DATA) */}
                <div className="col-span-1 md:col-span-6 lg:col-span-8 bg-[#1E1E1E] rounded-3xl p-8 relative overflow-hidden group border border-[#333]">
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                             <div className="h-12 w-12 bg-white/10 rounded-xl flex items-center justify-center text-white backdrop-blur-md">
                                <Briefcase size={24} />
                             </div>
                             <span className="text-xs font-mono text-indigo-400 border border-indigo-400/30 px-2 py-1 rounded bg-indigo-400/10">Setup Once</span>
                        </div>
                        
                        <div className="mt-8">
                             {/* Visual: User Profile Data */}
                             <div className="bg-black/40 p-5 rounded-xl border border-white/10 mb-6 backdrop-blur-sm grid grid-cols-2 gap-4">
                                <div className="col-span-2 space-y-1">
                                    <label className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Business Name</label>
                                    <div className="flex items-center gap-2 text-white font-mono text-sm p-2 bg-white/5 rounded border border-white/5">
                                        <Briefcase size={12} className="text-gray-400"/> Acme Coffee Co.
                                    </div>
                                </div>
                                <div className="col-span-2 space-y-1">
                                    <label className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">What we do</label>
                                    <div className="flex items-start gap-2 text-white font-mono text-sm p-2 bg-white/5 rounded border border-white/5">
                                        <AlignLeft size={12} className="text-gray-400 mt-1"/> 
                                        <span className="text-gray-300">"We sell fresh roasted coffee beans online."</span>
                                    </div>
                                </div>
                                <div className="col-span-2 space-y-1">
                                    <label className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Website</label>
                                    <div className="flex items-center gap-2 text-blue-400 font-mono text-sm p-2 bg-white/5 rounded border border-white/5">
                                        <LinkIcon size={12} className="text-gray-400"/> acmeco.com
                                    </div>
                                </div>
                             </div>
                             
                             <h3 className="text-2xl font-bold text-white mb-2">We learn your style instantly</h3>
                             <p className="text-gray-400 max-w-md">
                                 Just tell us your business name and what you do. Our AI learns your style so every post sounds exactly like you.
                             </p>
                        </div>
                    </div>
                </div>

                {/* 2. ANALYTICS (Tall) */}
                <div className="col-span-1 md:col-span-3 lg:col-span-4 row-span-2 bg-white rounded-3xl p-8 border border-[#E5E5E5] relative overflow-hidden group shadow-sm hover:shadow-lg transition-all">
                     <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50" />
                     <div className="relative z-10 flex flex-col h-full">
                        <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                            <BarChart3 size={24} />
                        </div>
                        <h3 className="text-2xl font-bold text-[#111] mb-2">Real Results</h3>
                        <p className="text-[#666] mb-8">See exactly how many people click your links and visit your site.</p>
                        <div className="mt-auto flex items-end gap-3 h-48 w-full">
                            {[40, 65, 50, 85, 60, 95, 75].map((h, i) => (
                                <div key={i} className="flex-1 bg-indigo-500 rounded-t-sm opacity-90 group-hover:opacity-100 transition-opacity" style={{ height: `${h}%` }}>
                                    <div className="w-full h-full bg-indigo-600 opacity-0 group-hover:opacity-20 transition-opacity" />
                                </div>
                            ))}
                        </div>
                     </div>
                </div>

                {/* 3. GENERATIVE AI */}
                <div className="col-span-1 md:col-span-3 lg:col-span-4 bg-white rounded-3xl p-8 border border-[#E5E5E5] relative overflow-hidden group shadow-sm hover:shadow-lg transition-all">
                    <div className="absolute -right-4 -top-4 bg-gradient-to-br from-purple-100 to-blue-50 h-32 w-32 rounded-full blur-3xl opacity-60" />
                    <div className="h-12 w-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6 relative z-10">
                        <PenTool size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-[#111] mb-2">AI Content Creator</h3>
                    <p className="text-sm text-[#666]">
                        Stuck on what to write? Our AI writes captions, adds hashtags, and picks images for you.
                    </p>
                </div>

                {/* 4. SCHEDULING */}
                <div className="col-span-1 md:col-span-3 lg:col-span-4 bg-white rounded-3xl p-8 border border-[#E5E5E5] relative overflow-hidden group shadow-sm hover:shadow-lg transition-all">
                     <div className="h-12 w-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-6">
                        <Clock size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-[#111] mb-2">Reliable Scheduling</h3>
                    <p className="text-sm text-[#666]">
                        Plan a week of content in minutes. We post it for you, day or night, so you can sleep.
                    </p>
                </div>

                {/* 5. EMAIL & SOCIAL (Wide) */}
                <div className="col-span-1 md:col-span-6 lg:col-span-8 bg-gradient-to-br from-[#F5F5F5] to-white rounded-3xl p-8 border border-[#E5E5E5] group shadow-sm hover:shadow-lg transition-all">
                    <div className="flex flex-col md:flex-row items-center gap-8 h-full">
                        <div className="flex-1">
                             <div className="h-12 w-12 bg-[#111] text-white rounded-xl flex items-center justify-center mb-6">
                                <Layers size={24} />
                            </div>
                            <h3 className="text-2xl font-bold text-[#111] mb-2">All Channels, One Place</h3>
                            <p className="text-[#666]">
                                Post to Facebook, Instagram, and send Email Newsletters without switching between different apps.
                            </p>
                        </div>
                        <div className="flex-1 flex items-center justify-end gap-4 opacity-70 group-hover:opacity-100 transition-opacity">
                             <div className="p-4 bg-white rounded-2xl border border-[#E5E5E5] shadow-sm">
                                <Globe size={32} className="text-blue-600"/>
                             </div>
                             <ArrowRight className="text-[#CCC]" />
                             <div className="p-4 bg-white rounded-2xl border border-[#E5E5E5] shadow-sm">
                                <Mail size={32} className="text-purple-600"/>
                             </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
      </section>

      {/* --- HAPPY PEOPLE SECTION --- */}
      <section className="py-32 border-t border-[#E5E5E5] bg-white">
          <div className="mx-auto max-w-[1400px] px-6">
              <div className="grid lg:grid-cols-2 gap-20">
                  <div>
                      <h2 className="text-6xl font-bold tracking-tighter mb-8 leading-[0.9]">
                          More growing.<br/> Less stressing.
                      </h2>
                      <p className="text-xl text-[#444] leading-relaxed mb-12">
                          The best businesses focus on their strategy and let Synapse handle the posting.
                      </p>
                      
                      <div className="space-y-8">
                          <Testimonial 
                             quote="I used to spend 10 hours a week on Instagram. Now I spend 20 minutes."
                             author="Elena R."
                             role="Small Business Owner"
                             img="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
                          />
                          <div className="w-full h-px bg-[#F0F0F0]" />
                           <Testimonial 
                             quote="Finally, a tool that is actually easy to use. The email marketing feature is a game changer."
                             author="Marcus D."
                             role="Content Creator"
                             img="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
                          />
                      </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 h-full">
                      <div className="space-y-4 mt-12">
                           <div className="aspect-[3/4] bg-[#F5F5F5] rounded-xl overflow-hidden relative group">
                                <img src="https://images.unsplash.com/photo-1531545514256-b1400bc00f31?auto=format&fit=crop&w=800&q=80" className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500" alt="Team" />
                                <div className="absolute bottom-4 left-4 bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider">Growth</div>
                           </div>
                      </div>
                      <div className="space-y-4">
                           <div className="aspect-[3/4] bg-[#F5F5F5] rounded-xl overflow-hidden relative group">
                                <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500" alt="Team" />
                                <div className="absolute bottom-4 left-4 bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider">Results</div>
                           </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* --- CTA --- */}
      <section className="py-40 bg-[#111] text-white text-center">
         <div className="mx-auto max-w-3xl px-6">
            <h2 className="text-5xl lg:text-7xl font-bold tracking-tighter mb-8">
                Ready to grow?
            </h2>
            <p className="text-xl text-[#888] mb-10">
                Join thousands of creators using Synapse today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/signup" className="h-16 px-10 bg-white text-black text-lg font-bold rounded-full flex items-center justify-center gap-2 hover:bg-[#E5E5E5] transition-colors">
                    Start Automating
                </Link>
                <Link to="/login" className="h-16 px-10 border border-[#333] text-white text-lg font-bold rounded-full flex items-center justify-center hover:border-white transition-colors">
                    Login to Dashboard
                </Link>
            </div>
         </div>
      </section>
    </div>
  );
}

// --- SUBCOMPONENTS ---

function Testimonial({ quote, author, role, img, authorType }) {
    return (
        <div>
            <p className="text-2xl font-medium tracking-tight mb-6 text-[#222]">"{quote}"</p>
            <div className="flex items-center gap-4">
                <img src={img} alt={author} className="h-12 w-12 rounded-full grayscale" />
                <div>
                    <p className="font-bold text-[#111]">{author}</p>
                    <div className="flex items-center gap-2 text-sm text-[#666]">
                        {role} 
                        {authorType && <span className="bg-[#F0F0F0] px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider text-black">{authorType}</span>}
                    </div>
                </div>
            </div>
        </div>
    )
}