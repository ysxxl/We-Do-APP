import { useState } from 'react';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useRouter } from '@/context/RouterContext';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LanguageContext';
import { Logo } from '@/components/Logo';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { cn } from '@/lib/utils';

type Props = { mode: 'login' | 'signup' };

export function AuthPage({ mode }: Props) {
  const { navigate } = useRouter();
  const { signIn, signUp } = useAuth();
  const { t } = useLang();
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isSignup = mode === 'signup';

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    if (isSignup) {
      const { error } = await signUp(email, password, fullName);
      if (error) { setError(error); setSubmitting(false); return; }
      navigate('onboarding');
    } else {
      const { error } = await signIn(email, password);
      if (error) { setError(error); setSubmitting(false); return; }
      navigate('dashboard');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <header className="flex items-center justify-between px-4 sm:px-6 h-16">
        <button onClick={() => navigate('landing')} className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition">
          <ArrowLeft className="w-4 h-4" /> {t('auth.back')}
        </button>
        <ThemeToggle />
      </header>

      <div className="flex-1 flex items-center justify-center px-4 pb-10">
        <div className="w-full max-w-md animate-fade-in">
          <div className="flex justify-center mb-6"><Logo showText={false} /></div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white text-center">
            {isSignup ? t('auth.signup.title') : t('auth.login.title')}
          </h1>
          <p className="mt-2 text-center text-slate-500 dark:text-slate-400 text-sm">
            {isSignup ? t('auth.signup.sub') : t('auth.login.sub')}
          </p>

          {error && (
            <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 text-sm font-medium animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="mt-6 space-y-4">
            {isSignup && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{t('auth.name')}</label>
                <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="input" placeholder={t('auth.namePh')} />
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{t('auth.email')}</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input pl-10" placeholder="kamu@email.com" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{t('auth.password')}</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type={showPw ? 'text' : 'password'} required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="input pl-10 pr-10" placeholder={t('auth.pwPh')} />
                <button type="button" onClick={() => setShowPw((v) => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {!isSignup && (
              <div className="flex justify-end">
                <button type="button" className="text-sm font-semibold text-brand-600 dark:text-brand-400 hover:underline">{t('auth.forgot')}</button>
              </div>
            )}
            <button type="submit" disabled={submitting} className={cn('btn-primary w-full text-base py-3', submitting && 'opacity-70')}>
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : isSignup ? t('auth.signup.btn') : t('auth.login.btn')}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            {isSignup ? t('auth.signup.have') : t('auth.login.dont')}{' '}
            <button onClick={() => navigate(isSignup ? 'login' : 'signup')} className="font-semibold text-brand-600 dark:text-brand-400 hover:underline">
              {isSignup ? t('auth.signup.haveLink') : t('auth.login.dontLink')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
