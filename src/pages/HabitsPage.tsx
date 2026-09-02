import { Plus, Flame, Trophy, Loader2 } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { HabitCard } from '@/components/ui/HabitCard';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { useData } from '@/context/DataContext';
import { useLang } from '@/context/LanguageContext';
import type { Habit } from '@/data/mockData';

type Props = { onAddTask: () => void; onAddHabit: () => void; onEditHabit: (habit: Habit) => void };

export function HabitsPage({ onAddTask, onAddHabit, onEditHabit }: Props) {
  const { habits, loading, toggleHabit, deleteHabit } = useData();
  const { t } = useLang();

  const doneToday = habits.filter((h) => h.doneToday).length;
  const pct = habits.length ? Math.round((doneToday / habits.length) * 100) : 0;
  const totalStreak = habits.reduce((a, h) => a + h.streak, 0);
  const best = habits.length ? habits.reduce((a, h) => Math.max(a, h.bestStreak), 0) : 0;

  return (
    <AppShell onAddTask={onAddTask}>
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">{t('habits.title')}</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400 text-sm">{t('habits.sub')}</p>
        </div>
        <button onClick={onAddHabit} className="btn-secondary text-sm shrink-0">
          <Plus className="w-4 h-4" /> {t('habits.new')}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-7 h-7 animate-spin text-brand-500" /></div>
      ) : (
        <>
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <div className="card p-5 flex items-center gap-4">
              <ProgressRing value={pct} size="md" />
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{t('habits.today')}</p>
                <p className="font-display font-bold text-lg text-slate-800 dark:text-slate-100">{doneToday}/{habits.length} {t('habits.todayVal')}</p>
              </div>
            </div>
            <div className="card p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-accent-50 dark:bg-accent-500/10 text-accent-500 flex items-center justify-center">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{t('habits.totalStreak')}</p>
                <p className="font-display font-bold text-lg text-slate-800 dark:text-slate-100">{totalStreak} {t('habits.totalStreakVal')}</p>
              </div>
            </div>
            <div className="card p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-violet-50 dark:bg-violet-500/10 text-violet-500 flex items-center justify-center">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{t('habits.best')}</p>
                <p className="font-display font-bold text-lg text-slate-800 dark:text-slate-100">{best} {t('habits.bestVal')}</p>
              </div>
            </div>
          </div>

          {habits.length === 0 ? (
            <div className="card p-12 text-center">
              <Flame className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
              <p className="text-slate-500 dark:text-slate-400">{t('habits.empty')}</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {habits.map((h) => <HabitCard key={h.id} habit={h} onToggle={toggleHabit} onDelete={deleteHabit} onEdit={onEditHabit} />)}
            </div>
          )}
        </>
      )}
    </AppShell>
  );
}
