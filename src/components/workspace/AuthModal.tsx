import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { X, Lock, Mail, User, Building, ShieldCheck, ArrowRight, Shield, Sparkles, Database, CheckCircle2, Play } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onLogin: (user: UserProfile, isDemoAccount?: boolean) => void;
  onLogout: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  user,
  onLogin,
  onLogout,
}) => {
  const [mode, setMode] = useState<'signup' | 'login' | 'demo'>('signup');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserProfile['role']>('Lead Mechanical Engineer');
  const [company, setCompany] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const roleOptions: UserProfile['role'][] = [
    'Lead Mechanical Engineer',
    'Procurement & Sourcing Lead',
    'Reliability Engineer',
    'Master Data Architect',
    'Systems Integrator',
    'Chief Engineer',
  ];

  // 1-Click Instant Demo Sandbox Access
  const handleLaunchDemoTrial = () => {
    onLogin(
      {
        id: 'usr-demo-engineer-2026',
        email: 'trial.engineer@indusense-demo.io',
        name: 'Trial Engineer (Demo)',
        role: 'Chief Engineer',
        company: 'Apex Industrial Dynamics (Trial)',
        isAuthenticated: true,
        savedProductIds: ['prod-001', 'prod-006'],
      },
      true // isDemoAccount
    );
    onClose();
  };

  // Custom User Registration (Starts with clean private workspace)
  const handleSubmitCustomAccount = (e: React.FormEvent) => {
    e.preventDefault();

    const submittedName = name.trim() || (email ? email.split('@')[0] : 'Enterprise User');
    const submittedCompany = company.trim() || 'My Enterprise';

    onLogin(
      {
        id: `usr-${Date.now()}`,
        email: email.trim() || 'engineer@enterprise.com',
        name: submittedName,
        role,
        company: submittedCompany,
        isAuthenticated: true,
        savedProductIds: [],
      },
      false // isDemoAccount -> Clean empty workspace
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-md animate-fade-in font-sans">
      <div className="relative w-full max-w-lg rounded-2xl bg-zinc-900 border border-zinc-800 p-6 sm:p-7 space-y-5 shadow-2xl">
        
        {/* Top Header */}
        <div className="flex items-start justify-between pb-3 border-b border-zinc-800">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400">
              <Shield className="w-3.5 h-3.5" />
              <span>INDUSENSE ACCESS PORTAL</span>
            </div>
            <h3 className="text-base sm:text-lg font-semibold font-mono text-zinc-100">
              {user.isAuthenticated
                ? 'Active Workspace Profile'
                : mode === 'demo'
                ? 'Launch Instant Demo Sandbox'
                : mode === 'signup'
                ? 'Create New Enterprise Account'
                : 'Sign In to Your Workspace'}
            </h3>
            <p className="text-xs text-zinc-400">
              {user.isAuthenticated
                ? 'Manage your active session and workspace catalog permissions.'
                : mode === 'demo'
                ? 'Experience all features immediately with 14 pre-loaded industrial components.'
                : mode === 'signup'
                ? 'Get your clean, private workspace ready for your own supplier feeds.'
                : 'Sign in to access your existing private catalogs.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* If user is already authenticated */}
        {user.isAuthenticated ? (
          <div className="space-y-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
              <div className="text-emerald-400 text-[11px] font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>AUTHENTICATED SESSION</span>
              </div>
              <div className="text-zinc-300">User: <span className="text-zinc-100 font-bold">{user.name}</span></div>
              <div className="text-zinc-300">Email: <span className="text-zinc-100">{user.email}</span></div>
              <div className="text-zinc-300">Role: <span className="text-cyan-400">{user.role}</span></div>
              <div className="text-zinc-300">Organization: <span className="text-zinc-100">{user.company}</span></div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-rose-300 hover:text-rose-200 text-xs transition border border-zinc-700"
              >
                Sign Out
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs transition"
              >
                Return to Workspace
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            
            {/* 3 Clear Options: 1. Create Clean Account, 2. Sign In, 3. Try Demo */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-zinc-950 rounded-lg border border-zinc-800 text-xs font-mono">
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`py-1.5 rounded text-center transition ${
                  mode === 'signup' ? 'bg-zinc-800 text-zinc-100 font-semibold shadow' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                New Account
              </button>
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`py-1.5 rounded text-center transition ${
                  mode === 'login' ? 'bg-zinc-800 text-zinc-100 font-semibold shadow' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode('demo')}
                className={`py-1.5 rounded text-center transition flex items-center justify-center gap-1 ${
                  mode === 'demo' ? 'bg-cyan-500 text-zinc-950 font-bold shadow' : 'text-cyan-400 hover:text-cyan-300'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                <span>Try Demo</span>
              </button>
            </div>

            {/* OPTION 1: DEMO SANDBOX TRIAL MODE */}
            {mode === 'demo' ? (
              <div className="p-4 rounded-xl bg-zinc-950 border border-cyan-500/30 space-y-4 font-mono">
                <div className="space-y-1.5">
                  <div className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                    <Database className="w-4 h-4" />
                    <span>PRE-CONFIGURED INDUSTRIAL DEMO ACCOUNT</span>
                  </div>
                  <p className="text-[11px] text-zinc-300 leading-relaxed font-sans">
                    Use this trial sandbox to immediately explore all features without entering details or uploading files.
                  </p>
                </div>

                <div className="space-y-1.5 text-xs text-zinc-400 bg-zinc-900/90 p-3 rounded-lg border border-zinc-800">
                  <div className="text-zinc-200 font-semibold text-[11px]">Included in Trial Demo Catalog:</div>
                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span><strong>14 Pre-Loaded Industrial SKUs:</strong> Motors, Bearings, Pumps, Sensors, Pneumatics</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span><strong>Pre-computed AI Duplicate Clusters:</strong> Ready for merge testing</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span><strong>Vector Semantic Search & Copilot:</strong> Ready to query</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLaunchDemoTrial}
                  className="w-full py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs transition flex items-center justify-center gap-2"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Launch Instant Demo Workspace</span>
                </button>
              </div>
            ) : (
              /* OPTION 2 & 3: NEW ACCOUNT OR SIGN IN (STARTS WITH CLEAN PRIVATE REPO) */
              <form onSubmit={handleSubmitCustomAccount} className="space-y-3 text-xs font-mono">
                
                <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-400 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>
                    {mode === 'signup'
                      ? 'Creating an account gives you a clean, empty private workspace where you can upload and manage your own catalogs.'
                      : 'Sign in to access your private catalog workspace.'}
                  </span>
                </div>

                {mode === 'signup' && (
                  <>
                    <div className="space-y-1">
                      <label className="text-zinc-300">Full Name:</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Sarah Connor"
                        className="w-full p-2 rounded-lg bg-zinc-950 border border-zinc-700 text-zinc-100 placeholder-zinc-600 focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-zinc-300">Engineering Role:</label>
                      <select
                        value={role}
                        onChange={(e: any) => setRole(e.target.value)}
                        className="w-full p-2 rounded-lg bg-zinc-950 border border-zinc-700 text-zinc-100 focus:border-cyan-400 focus:outline-none"
                      >
                        {roleOptions.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-zinc-300">Company / Organization:</label>
                      <input
                        type="text"
                        required
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="e.g. Apex Industrial Dynamics"
                        className="w-full p-2 rounded-lg bg-zinc-950 border border-zinc-700 text-zinc-100 placeholder-zinc-600 focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                  </>
                )}

                <div className="space-y-1">
                  <label className="text-zinc-300">Enterprise Email:</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="engineer@company.com"
                    className="w-full p-2 rounded-lg bg-zinc-950 border border-zinc-700 text-zinc-100 placeholder-zinc-600 focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-300">Password:</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full p-2 rounded-lg bg-zinc-950 border border-zinc-700 text-zinc-100 placeholder-zinc-600 focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs transition flex items-center justify-center gap-1.5"
                  >
                    <span>{mode === 'signup' ? 'Create Account & Open Clean Workspace' : 'Sign In to Workspace'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Instant trial fallback button */}
                <div className="pt-1 text-center">
                  <button
                    type="button"
                    onClick={handleLaunchDemoTrial}
                    className="text-[11px] text-zinc-400 hover:text-cyan-400 underline transition"
                  >
                    Or try instant trial demo account with sample data &rarr;
                  </button>
                </div>

              </form>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
