import { useState } from 'react';
import { ArrowRight, GraduationCap, Briefcase, Heart, Layers, Check, Loader2 } from 'lucide-react';
import { useRouter } from '@/context/RouterContext';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { useLang } from '@/context/LanguageContext';
import { Logo } from '@/components/Logo';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { cn } from '@/lib/utils';

export function OnboardingPage() {
  const { navigate } = useRouter();
  const { profile, updateProfile } = useAuth();
  const { seedData } = useData();
  const { t } = useLang();
  const [selected, setSelected] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  const goals = [
    { id: 'kuliah', icon: GraduationCap },
    { id: 'kerja', icon: Briefcase },
    { id: 'habit', icon: Heart },
    { id: 'semua', icon: Layers },
  ];

  const next = async () => {
    if (step === 0 && selected) {
      setSaving(true);
      await updateProfile({ goal: selected, onboarded: true });
      await seedData(selected);
      setSaving(false);
      setStep(1);
    } else if (step === 1) {
      navigate('dashboard');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <header className="flex items-center justify-between px-4 sm:px-6 h-16">
        <Logo />
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button onClick={() => navigate('dashboard')} className="text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition">{t('onb.skip')}</button>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 pb-10">
        <div className="w-full max-w-xl">
          <div className="flex items-center justify-center gap-2 mb-8">
            {[0, 1].map((i) => (
              <div key={i} className={cn('h-1.5 rounded-full transition-all duration-300', i === step ? 'w-8 bg-brand-500' : 'w-1.5 bg-slate-300 dark:bg-slate-700')} />
            ))}
          </div>

          {step === 0 && (
            <div className="animate-fade-in">
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white text-center">
                {t('onb.q')}
              </h1>
              <p className="mt-2 text-center text-slate-500 dark:text-slate-400 text-sm">
                {t('onb.sub')}
              </p>
              <div className="mt-8 grid sm:grid-cols-2 gap-3">
                {goals.map((g) => {
                  const Icon = g.icon;
                  const active = selected === g.id;
                  return (
                    <button
                      key={g.id}
                      onClick={() => setSelected(g.id)}
                      className={cn(
                        'text-left p-5 rounded-2xl border-2 transition-all duration-200 hover:-translate-y-0.5',
                        active ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10 shadow-glow' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700',
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', active ? 'bg-brand-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400')}>
                          <Icon className="w-5 h-5" />
                        </div>
                        {active && <div className="w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center"><Check className="w-3 h-3 text-white" strokeWidth={3} /></div>}
                      </div>
                      <h3 className="mt-3 font-display font-bold text-slate-800 dark:text-slate-100">{t(`goal.${g.id}`)}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{t(`goal.${g.id}.desc`)}</p>
                    </button>
                  );
                })}
              </div>
              <button onClick={next} disabled={!selected || saving} className="mt-6 btn-primary w-full text-base py-3 group">
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{t('onb.next')} <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" /></>}
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="animate-fade-in text-center">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-brand-500 text-white flex items-center justify-center shadow-glow animate-pop">
                <Check className="w-10 h-10" strokeWidth={3} />
              </div>
              <h1 className="mt-6 font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">
                {t('onb.done.title')}
              </h1>
              <p className="mt-3 text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                {profile?.full_name ? `${t('onb.done.hello')} ${profile.full_name}! ` : ''}{t('onb.done.desc')}
              </p>
              <div className="mt-6 card p-5 text-left max-w-sm mx-auto">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">{t('onb.tips.title')}</p>
                <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-300">
                  <li className="flex gap-2"><span className="text-brand-500 font-bold">•</span> {t('onb.tips.1')}</li>
                  <li className="flex gap-2"><span className="text-brand-500 font-bold">•</span> {t('onb.tips.2')}</li>
                  <li className="flex gap-2"><span className="text-brand-500 font-bold">•</span> {t('onb.tips.3')}</li>
                </ul>
              </div>
              <button onClick={next} className="mt-6 btn-primary text-base px-7 py-3">
                {t('onb.start')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
