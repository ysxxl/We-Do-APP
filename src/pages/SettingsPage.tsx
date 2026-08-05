import { useState, useEffect } from 'react';
import { User, Bell, Palette, Shield, LogOut, Loader2, Check } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from '@/context/RouterContext';
import { useAuth } from '@/context/AuthContext';
import { useLang, type Lang } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

type Props = { onAddTask: () => void };

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={cn('relative w-11 h-6 rounded-full transition-colors duration-200', on ? 'bg-brand-500' : 'bg-slate-300 dark:bg-slate-700')}>
      <span className={cn('absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200', on && 'translate-x-5')} />
    </button>
  );
}

export function SettingsPage({ onAddTask }: Props) {
  const { theme, setTheme } = useTheme();
  const { navigate } = useRouter();
  const { profile, user, updateProfile, signOut } = useAuth();
  const { lang, setLang, t } = useLang();
  const [saving, setSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  const notif = {
    task: profile?.notif_task ?? true,
    habit: profile?.notif_habit ?? true,
    streak: profile?.notif_streak ?? true,
    email: profile?.notif_email ?? false,
  };

  const displayName = profile?.full_name || (user?.email?.split('@')[0] ?? t('misc.user'));
  const email = user?.email ?? '—';
  const initial = displayName.charAt(0).toUpperCase();

  const toggleNotif = async (key: keyof typeof notif) => {
    setSaving(true);
    const patch: Record<string, unknown> = {};
    if (key === 'task') patch.notif_task = !notif.task;
    if (key === 'habit') patch.notif_habit = !notif.habit;
    if (key === 'streak') patch.notif_streak = !notif.streak;
    if (key === 'email') patch.notif_email = !notif.email;
    await updateProfile(patch);
    setSaving(false);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1500);
  };

  const changeLang = async (l: Lang) => {
    setLang(l);
    setSaving(true);
    await updateProfile({ language: l });
    setSaving(false);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1500);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('landing');
  };

  const notifItems = [
    { key: 'task' as const, label: t('settings.notif.task'), desc: t('settings.notif.taskDesc') },
    { key: 'habit' as const, label: t('settings.notif.habit'), desc: t('settings.notif.habitDesc') },
    { key: 'streak' as const, label: t('settings.notif.streak'), desc: t('settings.notif.streakDesc') },
    { key: 'email' as const, label: t('settings.notif.email'), desc: t('settings.notif.emailDesc') },
  ];

  return (
    <AppShell onAddTask={onAddTask}>
      <div className="mb-6">
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">{t('settings.title')}</h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400 text-sm">{t('settings.sub')}</p>
      </div>

      <div className="max-w-2xl space-y-5">
        <section className="card p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-4 h-4 text-slate-400" />
            <h2 className="font-display font-bold text-slate-800 dark:text-slate-100">{t('settings.profile')}</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 text-white flex items-center justify-center font-display font-bold text-2xl">{initial}</div>
            <div className="flex-1">
              <p className="font-semibold text-slate-800 dark:text-slate-100">{displayName}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{email}</p>
            </div>
            <button className="btn-secondary text-sm">{t('settings.edit')}</button>
          </div>
        </section>

        <section className="card p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-4 h-4 text-slate-400" />
            <h2 className="font-display font-bold text-slate-800 dark:text-slate-100">{t('settings.appearance')}</h2>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-slate-700 dark:text-slate-200">{t('settings.theme')}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{t('settings.themeDesc')}</p>
            </div>
            <ThemeToggle />
          </div>
          <div className="border-t border-slate-100 dark:border-slate-800 my-3" />
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-slate-700 dark:text-slate-200">{t('settings.language')}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{t('settings.languageDesc')}</p>
            </div>
            <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
              {[{ id: 'id' as Lang, label: 'ID' }, { id: 'en' as Lang, label: 'EN' }].map((l) => (
                <button key={l.id} onClick={() => changeLang(l.id)} className={cn('px-3 py-1.5 rounded-lg text-sm font-semibold transition', lang === l.id ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm' : 'text-slate-500 dark:text-slate-400')}>
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="card p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-4 h-4 text-slate-400" />
            <h2 className="font-display font-bold text-slate-800 dark:text-slate-100">{t('settings.notifications')}</h2>
            {saving && <Loader2 className="w-4 h-4 animate-spin text-brand-500" />}
            {savedFlash && <Check className="w-4 h-4 text-brand-500 animate-pop" />}
          </div>
          {notifItems.map((n, i, arr) => (
            <div key={n.key}>
              <div className="flex items-center justify-between py-2.5">
                <div>
                  <p className="font-medium text-slate-700 dark:text-slate-200">{n.label}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{n.desc}</p>
                </div>
                <Toggle on={notif[n.key]} onClick={() => toggleNotif(n.key)} />
              </div>
              {i < arr.length - 1 && <div className="border-t border-slate-100 dark:border-slate-800" />}
            </div>
          ))}
        </section>

        <section className="card p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-4 h-4 text-slate-400" />
            <h2 className="font-display font-bold text-slate-800 dark:text-slate-100">{t('settings.privacy')}</h2>
          </div>
          <button className="w-full flex items-center justify-between py-2.5 text-left">
            <div>
              <p className="font-medium text-slate-700 dark:text-slate-200">{t('settings.changePw')}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{t('settings.changePwDesc')}</p>
            </div>
            <span className="text-slate-400">→</span>
          </button>
          <div className="border-t border-slate-100 dark:border-slate-800" />
          <button className="w-full flex items-center justify-between py-2.5 text-left">
            <div>
              <p className="font-medium text-slate-700 dark:text-slate-200">{t('settings.export')}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{t('settings.exportDesc')}</p>
            </div>
            <span className="text-slate-400">→</span>
          </button>
        </section>

        <button onClick={handleSignOut} className="w-full card p-4 flex items-center justify-center gap-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition">
          <LogOut className="w-4 h-4" />
          <span className="font-semibold">{t('settings.signOut')}</span>
        </button>

        <p className="text-center text-xs text-slate-400 dark:text-slate-500 pb-4">{t('misc.version')}</p>
      </div>
    </AppShell>
  );
}
