import React, { useMemo, useState, useEffect } from 'react';
import {
  Apple,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Building2,
  ChevronDown,
  Clock,
  Eye,
  EyeOff,
  ImagePlus,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { uploadImage } from '../../lib/api';

type Screen = 'login' | 'register' | 'forgot' | 'verify' | 'pending';

const inputClass = 'w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#C5A880] focus:ring-2 focus:ring-[#C5A880]/20';

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, login, register, authModalScreen } = useAuth();
  const [screen, setScreen] = useState<Screen>(authModalScreen || 'login');

  useEffect(() => {
    if (isAuthModalOpen) {
      setScreen(authModalScreen || 'login');
      setAuthError('');
    }
  }, [isAuthModalOpen, authModalScreen]);
  const [showPassword, setShowPassword] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [captchaChecked, setCaptchaChecked] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [authError, setAuthError] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    setAuthError('');
    try {
      const res = await uploadImage(file);
      setAvatarUrl(res.url);
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Photo upload failed');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const strength = useMemo(() => {
    const checks = [password.length >= 8, /[A-Z]/.test(password), /[0-9]/.test(password), /[^A-Za-z0-9]/.test(password)];
    return checks.filter(Boolean).length;
  }, [password]);
  const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'StayAura Guest';

  if (!isAuthModalOpen) return null;

  const finishLogin = async () => {
    try {
      await login(identifier, password);
      setAuthError('');
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Could not sign in.');
    }
  };

  const socialLogin = (provider: string) => setAuthError(`${provider} sign-in is not configured. Use your email and password.`);

  const submitLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    await finishLogin();
  };

  const submitRegistration = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setAuthError('Passwords do not match.');
      return;
    }
    try {
      const res = await register(fullName, identifier, password, phone);
      if (res.status === 'pending') {
        setAuthError('');
        setScreen('pending');
      } else if (res.status === 'error') {
        setAuthError(res.message);
      } else {
        setAuthError('');
      }
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Could not create your account.');
    }
  };

  const reset = () => {
    setScreen('login');
    setShowDetails(false);
    setCaptchaChecked(false);
    setAuthError('');
  };

  const SocialButtons = () => (
    <div className="grid grid-cols-3 gap-2">
      <button type="button" onClick={() => socialLogin('Google')} className="rounded-xl border border-gray-200 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50">Google</button>
      <button type="button" onClick={() => socialLogin('Facebook')} className="rounded-xl border border-gray-200 py-2.5 text-xs font-bold text-[#1877F2] hover:bg-blue-50"><span className="text-sm">f</span></button>
      <button type="button" onClick={() => socialLogin('Apple')} className="rounded-xl border border-gray-200 py-2.5 text-xs font-bold text-gray-900 hover:bg-gray-50"><Apple className="mx-auto h-4 w-4" /></button>
    </div>
  );

  const FieldLabel = ({ children }: { children: React.ReactNode }) => <label className="mb-1.5 block text-xs font-bold text-gray-700">{children}</label>;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-3 backdrop-blur-sm sm:p-5">
      <div className="relative my-auto w-full max-w-lg overflow-hidden rounded-3xl border border-white/20 bg-white shadow-2xl">
        <div className="relative bg-gradient-to-br from-[#17202A] via-[#253342] to-[#1E252B] px-6 pb-7 pt-8 text-white sm:px-9">
          <button onClick={closeAuthModal} className="absolute right-4 top-4 rounded-full p-2 text-gray-300 hover:bg-white/10 hover:text-white" aria-label="Close authentication"><X className="h-5 w-5" /></button>
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#C5A880]/20 text-[#E9D8B4]"><Sparkles className="h-5 w-5" /></div>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#C5A880]">StayAura Members</p>
          <h2 className="mt-1 font-display text-2xl font-bold">
            {screen === 'register' ? 'Create your travel profile' : screen === 'forgot' ? 'Reset your password' : screen === 'verify' ? 'Verify your details' : screen === 'pending' ? 'Registration Submitted' : 'Welcome back'}
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-gray-300">
            {screen === 'register' ? 'Start with the essentials — finish your traveller profile whenever you like.' : screen === 'verify' ? 'This is a demonstration verification step. No email or OTP is sent.' : screen === 'pending' ? 'Your account has been created and is awaiting administrator approval.' : 'Access your bookings, rewards and saved travel preferences.'}
          </p>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-6 sm:p-8">
          {(screen === 'login' || screen === 'register') && (
            <div className="flex rounded-xl bg-gray-100 p-1 mb-5">
              <button
                type="button"
                onClick={() => { setScreen('login'); setAuthError(''); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  screen === 'login' ? 'bg-[#1E252B] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setScreen('register'); setAuthError(''); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  screen === 'register' ? 'bg-[#1E252B] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Register
              </button>
            </div>
          )}

          {screen === 'login' && (
            <form onSubmit={submitLogin} className="space-y-4">
              <div>
                <FieldLabel>Email address or phone number</FieldLabel>
                <div className="relative"><Mail className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" /><input required type="email" value={identifier} onChange={(e) => setIdentifier(e.target.value)} className={inputClass + ' pl-10'} placeholder="name@example.com" /></div>
              </div>
              <div>
                <div className="mb-1.5 flex items-center justify-between"><FieldLabel>Password</FieldLabel><button type="button" onClick={() => setScreen('forgot')} className="text-xs font-bold text-[#977341] hover:underline">Forgot password?</button></div>
                <div className="relative"><Lock className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" /><input required type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass + ' px-10'} placeholder="Your password" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-gray-400">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-gray-600"><label className="flex items-center gap-2"><input checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} type="checkbox" className="accent-[#977341]" /> Remember me</label><button type="button" onClick={() => setTwoFactor(!twoFactor)} className="font-semibold text-[#977341]">{twoFactor ? '2FA enabled' : 'Use 2FA demo'}</button></div>
              {twoFactor && <div className="rounded-xl border border-[#E9D8B4] bg-[#FAF5EB] p-3 text-xs text-[#765A32]"><ShieldCheck className="mr-1 inline h-4 w-4" /> Enter any 6-digit code after login — it is only a demo UI.</div>}
              {authError && <p role="alert" className="rounded-lg bg-red-50 p-3 text-xs text-red-700">{authError}</p>}
              <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1E252B] py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#2D3748]">Login <ArrowRight className="h-4 w-4 text-[#C5A880]" /></button>
              <div className="relative py-1 text-center text-xs text-gray-400 before:absolute before:left-0 before:top-1/2 before:h-px before:w-[42%] before:bg-gray-200 after:absolute after:right-0 after:top-1/2 after:h-px after:w-[42%] after:bg-gray-200">or</div>
              <SocialButtons />
              <div className="pt-1"><button type="button" onClick={() => socialLogin('Corporate SSO')} className="w-full flex items-center justify-center gap-1 rounded-xl border border-gray-200 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50"><Building2 className="h-3.5 w-3.5" /> Corporate SSO</button></div>
              <p className="pt-1 text-center text-xs text-gray-600">New to StayAura? <button type="button" onClick={() => setScreen('register')} className="font-bold text-[#977341] hover:underline">Create an account</button></p>
            </form>
          )}

          {screen === 'register' && (
            <form onSubmit={submitRegistration} className="space-y-4">
              <div className="grid grid-cols-2 gap-3"><div><FieldLabel>First name</FieldLabel><input required value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputClass} placeholder="First name" /></div><div><FieldLabel>Last name</FieldLabel><input required value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputClass} placeholder="Last name" /></div></div>
              <div><FieldLabel>Email address</FieldLabel><div className="relative"><Mail className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" /><input required type="email" value={identifier} onChange={(e) => setIdentifier(e.target.value)} className={inputClass + ' pl-10'} placeholder="name@example.com" /></div></div>
              <div><FieldLabel>Phone number</FieldLabel><div className="relative"><Phone className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" /><input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass + ' pl-10'} placeholder="Phone number" /></div></div>
              <div><FieldLabel>Create password</FieldLabel><div className="relative"><Lock className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" /><input required minLength={8} type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass + ' px-10'} placeholder="At least 8 characters" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-gray-400">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div>
                <div className="mt-2 flex gap-1">{[1,2,3,4].map((item) => <span key={item} className={'h-1 flex-1 rounded ' + (strength >= item ? (strength >= 4 ? 'bg-emerald-500' : 'bg-[#C5A880]') : 'bg-gray-100')} />)}</div><p className="mt-1 text-[10px] text-gray-500">{strength}/4: 8+ characters, uppercase, number and symbol.</p></div>
              <div><FieldLabel>Confirm password</FieldLabel><input required type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputClass} placeholder="Re-enter password" /><p className="mt-1 text-[10px] text-emerald-700">{confirmPassword && confirmPassword === password ? 'Passwords match' : 'Confirm your password before continuing'}</p></div>
              <button type="button" onClick={() => setShowDetails(!showDetails)} className="flex w-full items-center justify-between rounded-xl border border-dashed border-[#D5CEC5] px-3.5 py-2.5 text-xs font-bold text-[#765A32] hover:bg-[#FAF9F6]">Add travel preferences now (optional)<ChevronDown className={'h-4 w-4 transition ' + (showDetails ? 'rotate-180' : '')} /></button>
              {showDetails && <div className="space-y-3 rounded-2xl bg-[#FAF9F6] p-4"><div className="grid grid-cols-2 gap-3"><select className={inputClass} defaultValue="India"><option>India</option><option>United States</option><option>United Kingdom</option><option>Other</option></select><input type="date" className={inputClass} aria-label="Date of birth" /></div><div className="grid grid-cols-2 gap-3"><select className={inputClass} defaultValue="English"><option>English</option><option>Hindi</option><option>French</option></select><select className={inputClass} defaultValue="INR"><option>INR (₹)</option><option>USD ($)</option><option>EUR (€)</option></select></div><label className="flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50">{uploadingAvatar ? (<span className="text-[#977341]">Uploading photo...</span>) : avatarUrl ? (<><img src={avatarUrl} alt="Avatar" className="w-5 h-5 rounded-full object-cover border border-[#C5A880]" /><span className="text-emerald-700 font-bold">Photo attached</span></>) : (<><ImagePlus className="h-4 w-4 text-[#977341]" /> Upload profile photo</>)}<input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleAvatarUpload} disabled={uploadingAvatar} className="hidden" /></label></div>}
              <label className="flex gap-2 text-xs leading-relaxed text-gray-600"><input checked={marketingConsent} onChange={(e) => setMarketingConsent(e.target.checked)} type="checkbox" className="mt-0.5 accent-[#977341]" /> Send me member-only offers and travel inspiration.</label>
              <label className="flex gap-2 text-xs leading-relaxed text-gray-600"><input checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} type="checkbox" className="mt-0.5 accent-[#977341]" /> I agree to the <button type="button" className="font-bold text-[#977341] hover:underline">Terms & Conditions</button> and <button type="button" className="font-bold text-[#977341] hover:underline">Privacy Policy</button>.</label>
              <label className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs text-gray-600"><input checked={captchaChecked} onChange={(e) => setCaptchaChecked(e.target.checked)} type="checkbox" className="h-4 w-4 accent-[#977341]" /><ShieldCheck className="h-4 w-4 text-emerald-600" /> I am not a robot <span className="ml-auto text-[10px] text-gray-400">Demo CAPTCHA</span></label>
              {authError && <p role="alert" className="rounded-lg bg-red-50 p-3 text-xs text-red-700">{authError}</p>}
              <button disabled={!acceptTerms} type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1E252B] py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#2D3748] disabled:cursor-not-allowed disabled:opacity-40">Create account <ArrowRight className="h-4 w-4 text-[#C5A880]" /></button>
              <SocialButtons />
              <p className="text-center text-xs text-gray-600">Already a member? <button type="button" onClick={() => setScreen('login')} className="font-bold text-[#977341] hover:underline">Login</button></p>
            </form>
          )}

          {screen === 'forgot' && <div className="space-y-4"><button type="button" onClick={reset} className="flex items-center gap-1 text-xs font-bold text-[#977341]"><ArrowLeft className="h-4 w-4" /> Back to login</button><p className="text-sm text-gray-600">Password recovery is not configured yet. Contact the property administrator for account assistance.</p><input type="email" value={identifier} onChange={(e) => setIdentifier(e.target.value)} className={inputClass} placeholder="name@example.com" />{authError && <p role="alert" className="text-xs text-red-700">{authError}</p>}</div>}

          {screen === 'verify' && <div className="space-y-5 text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"><BadgeCheck className="h-7 w-7" /></div><p className="text-sm text-gray-600">Account verification is not configured. Sign in with the email and password used to register.</p><button type="button" onClick={reset} className="w-full rounded-xl bg-[#1E252B] py-3 text-sm font-bold text-white">Return to login</button></div>}

          {screen === 'pending' && (
            <div className="space-y-5 text-center py-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                <Clock className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Awaiting Admin Approval</h3>
                <p className="mt-2 text-xs leading-relaxed text-gray-600">
                  Your registration was submitted successfully! An administrator must review and approve your account before you can log in and book stays.
                </p>
              </div>
              <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-800 font-medium">
                Please wait for admin approval before logging in.
              </div>
              <button
                type="button"
                onClick={() => {
                  setScreen('login');
                  setAuthError('');
                }}
                className="w-full rounded-xl bg-[#1E252B] py-3 text-sm font-bold text-white hover:bg-[#2D3748] transition"
              >
                Go to Login
              </button>
            </div>
          )}
        </div>

        {screen !== 'verify' && screen !== 'pending' && <div className="border-t border-gray-100 bg-[#FAF9F6] px-6 py-3 text-center text-[11px] text-gray-500 sm:px-8"><Sparkles className="mr-1 inline h-3.5 w-3.5 text-[#C5A880]" /> Members earn points on every stay, save traveller profiles and access their booking history.</div>}
      </div>
    </div>
  );
}
