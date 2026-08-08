import { useState, type ReactNode } from 'react';
import { Home, ListTodo, Repeat, Settings, LogOut, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter, type Route } from '@/context/RouterContext';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LanguageContext';
import { Logo } from './Logo';
import { ThemeToggle } from './ui/ThemeToggle';

export function AppShell({ children, onAddTask }: { children: ReactNode; onAddTask: () => void }) {
  const { route, navigate } = useRouter();
  const { signOut } = useAuth();
  const { t } = useLang();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems: { id: Route; label: string; icon: typeof Home }[] = [
    { id: 'dashboard', label: t('nav.dashboard'), icon: Home },
    { id: 'tasks', label: t('nav.tasks'), icon: ListTodo },
    { id: 'habits', label: t('nav.habits'), icon: Repeat },
    { id: 'settings', label: t('nav.settings'), icon: Settings },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('landing');
  };

  const go = (r: Route) => {
    navigate(r);
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-6">
        <div className="px-2"><Logo /></div>
        <nav className="mt-8 flex-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = route === item.id;
            return (
              <button key={item.id} onClick={() => go(item.id)} className={cn('w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200', active ? 'bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200')}>
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="space-y-3">
          <button onClick={onAddTask} className="btn-primary w-full">
            <span className="text-lg leading-none">+</span> {t('nav.addTask')}
          </button>
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{t('nav.theme')}</span>
            <ThemeToggle />
          </div>
          <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
            <LogOut className="w-5 h-5" />
            {t('nav.signOut')}
          </button>
        </div>
      </aside>

      <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <Logo />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button onClick={() => setMobileOpen(true)} className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-fade-in" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 bg-white dark:bg-slate-900 p-5 flex flex-col animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <Logo />
              <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = route === item.id;
                return (
                  <button key={item.id} onClick={() => go(item.id)} className={cn('w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition', active ? 'bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800')}>
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
            <div className="space-y-2">
              <button onClick={() => { onAddTask(); setMobileOpen(false); }} className="btn-primary w-full">+ {t('nav.addTask')}</button>
              <button onClick={handleSignOut} className="btn-ghost w-full">{t('nav.signOut')}</button>
            </div>
          </div>
        </div>
      )}

      <main className="lg:pl-64">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-10 pb-28 lg:pb-10">
          {children}
        </div>
      </main>

      <button onClick={onAddTask} className="lg:hidden fixed bottom-6 right-6 z-30 w-14 h-14 rounded-full bg-brand-600 text-white shadow-glow flex items-center justify-center active:scale-90 transition">
        <span className="text-2xl leading-none">+</span>
      </button>
    </div>
  );
}
