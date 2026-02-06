import { Link } from "react-router-dom";
import { Command, Github, Twitter, Linkedin } from "lucide-react";
import logo from "/src/assets/logo.png";


export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#E5E5E5] pt-20 pb-10">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="flex flex-col md:flex-row justify-between gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="max-w-xs">
            <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-[#111]">
              <img src={logo} alt="Synapse Logo" className="h-12 w-auto" />
            </div>
            <p className="text-sm text-[#666] leading-relaxed mb-6">
              The operating system for automated brand growth. Built for creators who value their time.
            </p>
            <div className="flex gap-4">
              <SocialIcon icon={<Twitter size={18} />} href="#" />
              <SocialIcon icon={<Github size={18} />} href="#" />
              <SocialIcon icon={<Linkedin size={18} />} href="#" />
            </div>
          </div>
          
          {/* Links Columns */}
          <div className="flex gap-16 flex-wrap">
            <div>
              <h4 className="font-bold text-[#111] mb-6 text-sm uppercase tracking-wider">Product</h4>
              <ul className="space-y-3 text-sm text-[#666]">
                <li><Link to="#" className="hover:text-[#111] transition-colors">Integrations</Link></li>
                <li><Link to="#" className="hover:text-[#111] transition-colors">Changelog</Link></li>
                <li><Link to="#" className="hover:text-[#111] transition-colors">Documentation</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[#111] mb-6 text-sm uppercase tracking-wider">Company</h4>
              <ul className="space-y-3 text-sm text-[#666]">
                <li><Link to="/about" className="hover:text-[#111] transition-colors">About</Link></li>
                <li><Link to="/legal" className="hover:text-[#111] transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-[#111] transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#F0F0F0] flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#888]">
          <p>&copy; {new Date().getFullYear()} Synapse Systems Inc. All rights reserved.</p>
          <div className="flex gap-2 items-center">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span>All Systems Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ icon, href }) {
  return (
    <a 
      href={href} 
      className="h-8 w-8 flex items-center justify-center rounded-full bg-[#F5F5F5] text-[#666] hover:bg-[#111] hover:text-white transition-all"
    >
      {icon}
    </a>
  );
}