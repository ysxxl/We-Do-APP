import { Flame, TrendingUp, CalendarDays, Sparkles, Loader2 } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { StatCard } from '@/components/ui/StatCard';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { TaskCard } from '@/components/ui/TaskCard';
import { HabitCard } from '@/components/ui/HabitCard';
import { SegmentedTabs } from '@/components/ui/SegmentedTabs';
import { useState } from 'react';
import { useData } from '@/context/DataContext';
import { useAuth } from '@/context/AuthContext';
import { useLang } from '@/context/LanguageContext';
import type { Task, Habit } from '@/data/mockData';

type Props = { onAddTask: () => void; onEditTask: (task: Task) => void; onEditHabit: (habit: Habit) => void };

export function DashboardPage({ onAddTask, onEditTask, onEditHabit }: Props) {
  const { tasks, habits, loading, toggleTask, toggleHabit, deleteTask, deleteHabit } = useData();
  const { profile } = useAuth();
  const { t, lang } = useLang();
  const [tab, setTab] = useState('today');

  const todayTasks = tasks.filter((t) => t.category === 'daily');
  const doneCount = todayTasks.filter((t) => t.status === 'done').length;
  const pct = todayTasks.length ? Math.round((doneCount / todayTasks.length) * 100) : 0;
  const weekDone = tasks.filter((t) => t.status === 'done').length;
  const bestStreak = habits.length ? Math.max(...habits.map((h) => h.streak), 0) : 0;
  const bestHabit = habits.length ? habits.reduce((a, h) => (h.streak > a.streak ? h : a), habits[0]) : null;

  const filtered = tab === 'today' ? todayTasks : tab === 'week' ? tasks.filter((t) => t.category === 'weekly') : tasks.filter((t) => t.category === 'monthly');

  const displayName = profile?.full_name?.split(' ')[0] || 'kamu';
  const today = new Date().toLocaleDateString(lang === 'en' ? 'en-US' : 'id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <AppShell onAddTask={onAddTask}>
      <div className="mb-6">
        <p className="text-sm text-slate-400 dark:text-slate-500">{t('dash.welcome')}</p>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">{displayName} 👋</h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400 text-sm">{today} · {t('dash.tasksLeft')}: {todayTasks.length - doneCount}</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-7 h-7 animate-spin text-brand-500" /></div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <StatCard icon="task" label={t('dash.todayTasks')} value={`${todayTasks.length - doneCount} ${t('dash.todayTasksVal')}`} sub={`${doneCount} ${t('tasks.done').toLowerCase()}`} accent="text-brand-500" />
            <StatCard icon="done" label={t('dash.weekDone')} value={weekDone} sub={`${tasks.length} ${t('dash.total')}`} accent="text-sky-500" />
            <StatCard icon="streak" label={t('dash.bestStreak')} value={`${bestStreak} ${t('dash.days')}`} sub={bestHabit ? bestHabit.title : '—'} accent="text-accent-500" />
            <StatCard icon="spark" label={t('dash.habitsActive')} value={habits.length} sub={`${habits.length} ${t('dash.habitsSub')}`} accent="text-violet-500" />
          </div>

          <div className="grid lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 space-y-5">
              <div className="card p-5 sm:p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="font-display font-bold text-lg text-slate-800 dark:text-slate-100">{t('dash.progress')}</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{todayTasks.length === 0 ? t('dash.progressEmpty') : t('dash.progressMotiv')}</p>
                  </div>
                  <ProgressRing value={pct} size="lg" />
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-brand-400 to-brand-600 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-display font-bold text-lg text-slate-800 dark:text-slate-100">{t('dash.tasks')}</h2>
                  <SegmentedTabs tabs={[{ id: 'today', label: t('dash.tab.today') }, { id: 'week', label: t('dash.tab.week') }, { id: 'month', label: t('dash.tab.month') }]} active={tab} onChange={setTab} />
                </div>
                <div className="space-y-2.5">
                  {filtered.length === 0 ? (
                    <div className="card p-8 text-center">
                      <CalendarDays className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                      <p className="text-slate-500 dark:text-slate-400 text-sm">{t('dash.empty')}</p>
                      <button onClick={onAddTask} className="btn-primary mt-3 text-sm">{t('dash.addTask')}</button>
                    </div>
                  ) : (
                    filtered.map((task) => <TaskCard key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} onEdit={onEditTask} />)
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-display font-bold text-lg text-slate-800 dark:text-slate-100">{t('dash.habitsToday')}</h2>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-accent-600 dark:text-accent-400">
                  <TrendingUp className="w-3.5 h-3.5" /> {habits.filter((h) => h.doneToday).length}/{habits.length}
                </span>
              </div>
              {habits.length === 0 ? (
                <div className="card p-6 text-center">
                  <Flame className="w-7 h-7 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                  <p className="text-slate-500 dark:text-slate-400 text-sm">{t('dash.habitsEmpty')}</p>
                </div>
              ) : (
                habits.map((h) => <HabitCard key={h.id} habit={h} onToggle={toggleHabit} onDelete={deleteHabit} onEdit={onEditHabit} />)
              )}
              <div className="card p-4 bg-brand-50/50 dark:bg-brand-500/5 border-brand-200/50 dark:border-brand-500/20">
                <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400">
                  <Sparkles className="w-4 h-4" />
                  <p className="text-sm font-semibold">{t('dash.tip')}</p>
                </div>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{t('dash.tip.desc')}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </AppShell>
  );
}
