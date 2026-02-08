import { ArrowLeft, CheckCircle2, ExternalLink, Copy, Globe, AlertTriangle, Key, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const BrevoSetup = () => {
  return (
    <div className="min-h-screen bg-[#F8F9FC] text-slate-900 font-sans py-12 pt-20 px-4 md:px-8">
      
      <div className="max-w-3xl mx-auto">
        
        {/* Navigation */}
        <Link to="/email-campaigns" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium mb-8 transition-colors">
          <ArrowLeft size={18} /> Back to Settings
        </Link>

        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-600 text-xs font-bold uppercase tracking-wider mb-4 border border-purple-100">
            Email Infrastructure
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">
            Setting up Brevo (SMTP)
          </h1>
          <p className="text-lg text-slate-500">
            Synapse uses Brevo's high-deliverability API to bypass spam filters and firewall blocks. Setup takes about 2 minutes.
          </p>
        </div>

        {/* --- CRITICAL INFO --- */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
            <h3 className="text-amber-900 font-bold flex items-center gap-2 mb-3">
                <AlertTriangle size={20} /> Important: Domain Status
            </h3>
            <div className="space-y-3">
                <div className="flex items-start gap-3">
                    <div className="mt-1 min-w-[16px]"><Globe size={16} className="text-amber-600" /></div>
                    <p className="text-amber-800 text-sm">
                        <strong>If you don't have a domain:</strong> Emails sent from free addresses (e.g., <code>@gmail.com</code>) will appear as "via brevosend.com" in the recipient's inbox. This is normal and prevents your email from going to Spam.
                    </p>
                </div>
            </div>
        </div>

        {/* STEPS CONTAINER */}
        <div className="space-y-6">

            {/* STEP 1: CREATE ACCOUNT */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8">
                <h3 className="text-lg font-bold flex items-center gap-3 mb-4">
                    <span className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-sm">1</span>
                    Create Free Account
                </h3>
                <p className="text-slate-600 mb-4">
                    Brevo (formerly Sendinblue) offers a free tier that allows 300 emails/day forever.
                </p>
                <a href="https://www.brevo.com/signup/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-blue-600 font-bold hover:underline bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
                    Sign Up for Brevo <ExternalLink size={14} />
                </a>
            </div>

            {/* STEP 2: VERIFY SENDER */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8">
                <h3 className="text-lg font-bold flex items-center gap-3 mb-4">
                    <span className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-sm">2</span>
                    Verify Sender Email
                </h3>
                <p className="text-slate-600 mb-4">
                    You must prove you own the email address you want to send from.
                </p>
                <ul className="space-y-3 text-slate-600 list-disc list-inside ml-2">
                    <li>Log in to your Brevo dashboard.</li>
                    <li>Click your name (top right) &rarr; <strong>Senders & IP</strong>.</li>
                    <li>Click <strong>+ Add a Sender</strong>.</li>
                    <li>Enter your details and click <strong>Save</strong>.</li>
                    <li className="font-medium text-slate-800">Check your inbox and click the verification link sent by Brevo.</li>
                </ul>
            </div>

            {/* STEP 3: API KEY */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 border-l-4 border-l-purple-500">
                <h3 className="text-lg font-bold flex items-center gap-3 mb-4">
                    <span className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center text-sm">3</span>
                    Generate API Key (v3)
                </h3>
                <p className="text-slate-600 mb-4">
                    This is the password Synapse needs. Ensure you are on the <strong>API Keys</strong> tab, NOT the SMTP tab.
                </p>
                
                <ul className="space-y-2 text-slate-600 list-disc list-inside ml-2 mb-4">
                     <li>Go to <strong>SMTP & API</strong> settings.</li>
                     <li>Click <strong>+ Generate a new API key</strong>.</li>
                     <li>Name it "Synapse" and copy it immediately.</li>
                </ul>

                <div className="bg-slate-900 rounded-xl p-4 font-mono text-sm text-purple-300 space-y-2 overflow-x-auto">
                    <div className="text-slate-500 uppercase text-[10px] font-bold">Correct Format:</div>
                    <div>xkeysib-823a9c...1b2d</div>
                    <div className="text-slate-500 text-[10px] pt-2 border-t border-slate-800 mt-2">
                        If your key doesn't start with "xkeysib-", you generated the wrong type of key.
                    </div>
                </div>
            </div>

            {/* STEP 4: OPTIONAL DOMAIN */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 opacity-90 hover:opacity-100 transition-opacity">
                <h3 className="text-lg font-bold flex items-center gap-3 mb-4 text-slate-700">
                    <span className="w-8 h-8 rounded-lg bg-slate-200 text-slate-600 flex items-center justify-center text-sm">4</span>
                    Remove "via brevosend.com" (Optional)
                </h3>
                <p className="text-slate-600 mb-4 text-sm">
                    If you own a custom domain (e.g., <code>myapp.com</code>), you can authenticate it to remove the Brevo branding.
                </p>
                <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <Globe size={16} className="text-slate-400 mt-1" />
                    <p className="text-slate-600 text-sm">
                        Go to <strong>Senders & IP</strong> &rarr; <strong>Domains</strong>. Add your domain and copy the DNS records (TXT/CNAME) to your domain provider (GoDaddy, Namecheap, etc).
                    </p>
                </div>
            </div>

            {/* FINAL STEP */}
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 md:p-8 flex items-start gap-4">
                <div className="p-2 bg-white rounded-full text-green-600 shadow-sm shrink-0">
                    <Key size={24} />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-green-900 mb-1">Final Step</h3>
                    <p className="text-green-800 leading-relaxed mb-4">
                        Copy your <strong>API Key</strong> and your <strong>Verified Email</strong>. Return to Synapse and paste them into the "Add Sender" modal.
                    </p>
                    <Link to="/email-campaigns" className="inline-flex items-center gap-2 bg-green-200 text-white px-5 py-2 rounded-lg font-bold hover:bg-green-400 transition-colors shadow-sm">
                        Go to Sender Settings 
                    </Link>
                </div>
            </div>

        </div>

      </div>
    </div>
  );
};

export default BrevoSetup;