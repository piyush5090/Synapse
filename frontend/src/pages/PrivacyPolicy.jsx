import { ArrowLeft, Lock, Shield, Eye, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
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
            Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Policy</span>
          </h1>
          <p className="text-slate-500">Last Updated: February, 2026</p>
        </div>

        {/* Content Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-sm">
          
          <div className="space-y-12">
            
            {/* Section 1 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Database size={20} /></div>
                <h2 className="text-xl font-bold text-slate-900">1. Information We Collect</h2>
              </div>
              <p className="text-slate-600 leading-relaxed mb-4">
                We collect only the essential information needed to provide our services:
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-2 ml-2">
                <li><strong>Account Information:</strong> Your name and email address when you register.</li>
                <li><strong>Social Tokens:</strong> OAuth Access Tokens for Facebook and Instagram (stored securely).</li>
              </ul>
            </section>

            {/* Section 2 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><Eye size={20} /></div>
                <h2 className="text-xl font-bold text-slate-900">2. How We Use Your Data</h2>
              </div>
              <p className="text-slate-600 leading-relaxed">
                We do not sell your data. Your information is used strictly for:
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-2 ml-2 mt-2">
                <li>Scheduling and publishing content to your connected social accounts.</li>
                <li>Generating AI-powered captions via our internal engines.</li>
                <li>Tracking click analytics for the links you generate.</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-pink-50 rounded-lg text-pink-600"><Lock size={20} /></div>
                <h2 className="text-xl font-bold text-slate-900">3. Data Security</h2>
              </div>
              <p className="text-slate-600 leading-relaxed">
                We employ industry-standard security measures. Your social media access tokens are encrypted in our database. 
                We use secure polling mechanisms to communicate with Meta APIs, ensuring your credentials are never exposed to the client-side.
              </p>
            </section>

            {/* Section 4 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-600"><Shield size={20} /></div>
                <h2 className="text-xl font-bold text-slate-900">4. Third-Party Sharing</h2>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Our service interacts directly with the <strong>Facebook Graph API</strong> and <strong>Instagram Graph API</strong>. 
                By using Synapse, you acknowledge that your content will be transmitted to these platforms for publication.
              </p>
            </section>

            {/* Contact */}
            <div className="border-t border-slate-100 pt-8 mt-8">
              <p className="text-slate-500 text-sm">
                If you have questions about this policy, contact us at <a href="mailto:govindanipiyush10@gmail.com" className="text-blue-600 font-bold hover:underline">govindanipiyush10@gmail.com</a>.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;