import { CheckCircle2, Flame, ListTodo, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
  icon: 'task' | 'done' | 'streak' | 'spark';
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
};

const icons = {
  task: ListTodo,
  done: CheckCircle2,
  streak: Flame,
  spark: Sparkles,
};

export function StatCard({ icon, label, value, sub, accent = 'text-brand-500' }: Props) {
  const Icon = icons[icon];
  return (
    <div className="card p-4 sm:p-5 flex items-center gap-4 hover:shadow-glow transition-all duration-200">
      <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center bg-slate-50 dark:bg-slate-800', accent)}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">{label}</p>
        <p className="text-xl font-bold text-slate-800 dark:text-slate-100 leading-tight">{value}</p>
        {sub && <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{sub}</p>}
      </div>
    </div>
  );
}
