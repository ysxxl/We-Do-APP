import { useMemo, useState } from 'react';
import { Search, SlidersHorizontal, Loader2 } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { TaskCard } from '@/components/ui/TaskCard';
import { SegmentedTabs } from '@/components/ui/SegmentedTabs';
import { useData } from '@/context/DataContext';
import { useLang } from '@/context/LanguageContext';
import type { Task } from '@/data/mockData';

type Props = { onAddTask: () => void; onEditTask: (task: Task) => void };

export function TasksPage({ onAddTask, onEditTask }: Props) {
  const { tasks, loading, toggleTask, deleteTask } = useData();
  const { t } = useLang();
  const [filter, setFilter] = useState('all');
  const [status, setStatus] = useState('all');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    let list = tasks;
    if (filter !== 'all') list = list.filter((t) => t.category === filter);
    if (status === 'todo') list = list.filter((t) => t.status === 'todo');
    if (status === 'done') list = list.filter((t) => t.status === 'done');
    if (query.trim()) list = list.filter((t) => t.title.toLowerCase().includes(query.toLowerCase()));
    return [...list].sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
  }, [tasks, filter, status, query]);

  const counts = {
    all: tasks.length,
    daily: tasks.filter((t) => t.category === 'daily').length,
    weekly: tasks.filter((t) => t.category === 'weekly').length,
    monthly: tasks.filter((t) => t.category === 'monthly').length,
  };

  return (
    <AppShell onAddTask={onAddTask}>
      <div className="mb-6">
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">{t('tasks.title')}</h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400 text-sm">{t('tasks.sub')}</p>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('tasks.search')} className="input pl-10" />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <SegmentedTabs
          tabs={[
            { id: 'all', label: t('tasks.all'), count: counts.all },
            { id: 'daily', label: t('tasks.daily'), count: counts.daily },
            { id: 'weekly', label: t('tasks.weekly'), count: counts.weekly },
            { id: 'monthly', label: t('tasks.monthly'), count: counts.monthly },
          ]}
          active={filter}
          onChange={setFilter}
        />
        <div className="flex items-center gap-2 sm:ml-auto">
          <SlidersHorizontal className="w-4 h-4 text-slate-400" />
          <SegmentedTabs
            tabs={[
              { id: 'all', label: t('tasks.all') },
              { id: 'todo', label: t('tasks.todo') },
              { id: 'done', label: t('tasks.done') },
            ]}
            active={status}
            onChange={setStatus}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-7 h-7 animate-spin text-brand-500" /></div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-slate-500 dark:text-slate-400">{tasks.length === 0 ? t('tasks.emptyAll') : t('tasks.emptyFilter')}</p>
          <button onClick={onAddTask} className="btn-primary mt-4">{t('tasks.addFirst')}</button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((task) => <TaskCard key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} onEdit={onEditTask} />)}
        </div>
      )}
    </AppShell>
  );
}
