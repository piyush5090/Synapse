import { ArrowLeft, FileText, CheckCircle, AlertTriangle, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
  return (
    <div className="min-h-screen pt-20 bg-[#F8F9FC] text-slate-900 font-sans py-12 px-4 md:px-8">
      
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation */}
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium mb-8 transition-colors">
          <ArrowLeft size={18} /> Back to Home
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            Terms of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Service</span>
          </h1>
          <p className="text-slate-500">Effective from: February 2026</p>
        </div>

        {/* Content Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-sm">
          
          <div className="space-y-12">
            
            {/* Section 1 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><CheckCircle size={20} /></div>
                <h2 className="text-xl font-bold text-slate-900">1. Acceptance of Terms</h2>
              </div>
              <p className="text-slate-600 leading-relaxed">
                By accessing and using Synapse, you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to abide by these terms, please do not use this service.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><FileText size={20} /></div>
                <h2 className="text-xl font-bold text-slate-900">2. Usage License</h2>
              </div>
              <p className="text-slate-600 leading-relaxed mb-4">
                You are granted a limited license to access and use Synapse for personal or internal business purposes. You agree not to:
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-2 ml-2">
                <li>Use the platform to distribute spam or malicious content.</li>
                <li>Attempt to reverse engineer any part of the software.</li>
                <li>Use the API in a way that exceeds reasonable request limits.</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-50 rounded-lg text-amber-600"><AlertTriangle size={20} /></div>
                <h2 className="text-xl font-bold text-slate-900">3. Platform Reliability</h2>
              </div>
              <p className="text-slate-600 leading-relaxed">
                While we strive for 100% uptime and robust scheduling (via our processing locks and polling systems), 
                Synapse is provided "as is". We are not liable for any missed posts due to third-party API outages 
                (e.g., Instagram or Facebook downtime).
              </p>
            </section>

            {/* Section 4 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-600"><Scale size={20} /></div>
                <h2 className="text-xl font-bold text-slate-900">4. Termination</h2>
              </div>
              <p className="text-slate-600 leading-relaxed">
                We reserve the right to terminate or suspend access to our service immediately, without prior notice or liability, 
                for any reason whatsoever, including without limitation if you breach the Terms.
              </p>
            </section>

            {/* Footer */}
            <div className="border-t border-slate-100 pt-8 mt-8">
              <p className="text-slate-500 text-sm">
                Synapse is a project by <strong>Piyush Govindani</strong>. 
                <br />Ujjain, India.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;