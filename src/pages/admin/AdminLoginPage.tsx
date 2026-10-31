import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Building2,
  KeyRound,
  CheckCircle2
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { adminLogin, isAdminAuthenticated, isAdminLoading } = useAdmin();

  const [email, setEmail] = useState('admin@stayaura.com');
  const [password, setPassword] = useState('Admin@StayAura2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const redirectPath = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin';

  useEffect(() => {
    if (!isAdminLoading && isAdminAuthenticated) {
      navigate(redirectPath, { replace: true });
    }
  }, [isAdminAuthenticated, isAdminLoading, navigate, redirectPath]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!email.trim() || !password) {
      setErrorMessage('Please enter both administrator email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await adminLogin(email.trim(), password);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Invalid administrator credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#11161B] text-[#FAF9F6] flex flex-col justify-between selection:bg-[#C5A880]/30 selection:text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 -left-40 w-96 h-96 bg-[#C5A880]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -right-40 w-96 h-96 bg-[#3B82F6]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar */}
      <header className="border-b border-white/10 px-6 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#C5A880] group-hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-display text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                Stay<span className="text-[#C5A880]">Aura</span>
              </span>
              <p className="text-[9px] tracking-widest text-gray-400 uppercase font-semibold">
                Admin Console
              </p>
            </div>
          </Link>

          <Link
            to="/"
            className="text-xs font-semibold text-gray-400 hover:text-[#C5A880] transition-colors flex items-center gap-1.5"
          >
            <span>Return to Guest Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Main Login Box */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="w-full max-w-md bg-[#1E252B]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl relative">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#C5A880]/20 to-[#E9D8B4]/10 text-[#C5A880] mx-auto flex items-center justify-center mb-4 border border-[#C5A880]/30 shadow-inner">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#C5A880]">
              Authorized Personnel Only
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mt-1">
              Administrator Login
            </h1>
            <p className="text-xs text-gray-400 mt-2">
              Sign in with your enterprise credentials to manage reservations, guests, inventory and revenue.
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@stayaura.com"
                  required
                  autoComplete="email"
                  className="w-full bg-[#161B20] border border-white/15 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider">
                  Password
                </label>
                <span className="text-[11px] text-[#C5A880]">Protected by Role Auth</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full bg-[#161B20] border border-white/15 rounded-xl pl-10 pr-11 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#C5A880] to-[#B39366] text-[#11161B] font-bold text-xs uppercase tracking-wider hover:opacity-95 transition-opacity disabled:opacity-50 cursor-pointer shadow-lg shadow-[#C5A880]/20 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-[#11161B] border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Access Admin Dashboard</span>
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials Helper Card */}
          <div className="mt-8 pt-6 border-t border-white/10 text-xs">
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5 space-y-1.5">
              <div className="flex items-center gap-2 text-[#C5A880] font-semibold text-[11px] uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Pre-configured Demo Credentials</span>
              </div>
              <div className="font-mono text-[11px] text-gray-300 space-y-0.5">
                <p>Email: <span className="text-white font-bold">admin@stayaura.com</span></p>
                <p>Password: <span className="text-white font-bold">Admin@StayAura2026!</span></p>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-4 text-center text-xs text-gray-500">
        <p>StayAura Enterprise Hotel Management System • Encrypted SSL Session</p>
      </footer>
    </div>
  );
}
