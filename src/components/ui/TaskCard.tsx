import { Trash2, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Category, Task } from '@/data/mockData';
import { categoryMeta, priorityMeta, formatDate, formatTime, relativeDeadline } from '@/data/mockData';
import { useLang } from '@/context/LanguageContext';
import { Checkbox } from './Checkbox';

type Props = {
  task: Task;
  onToggle: (id: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (task: Task) => void;
  onClick?: (task: Task) => void;
};

export function TaskCard({ task, onToggle, onDelete, onEdit, onClick }: Props) {
  const { t, lang } = useLang();
  const cat = categoryMeta[task.category];
  const prio = priorityMeta[task.priority];
  const rel = relativeDeadline(task.deadline, t);
  const done = task.status === 'done';

  return (
    <div
      onClick={() => onClick?.(task)}
      className={cn(
        'card p-4 flex items-start gap-3 cursor-pointer hover:shadow-glow hover:border-brand-300 dark:hover:border-brand-700 transition-all duration-200 group',
        done && 'opacity-60',
      )}
    >
      <Checkbox checked={done} onClick={() => onToggle(task.id)} className="mt-0.5" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={cn('text-[11px] font-bold px-2 py-0.5 rounded-md', cat.color)}>{t(`cat.${task.category}`)}</span>
          <span className={cn('inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400')}>
            <span className={cn('w-1.5 h-1.5 rounded-full', prio.dot)} />
            {t(`prio.${task.priority}`)}
          </span>
        </div>
        <h4 className={cn('font-semibold text-slate-800 dark:text-slate-100 mt-1.5 truncate', done && 'line-through')}>
          {task.title}
        </h4>
        {task.description && (
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{task.description}</p>
        )}
        <div className="flex items-center gap-3 mt-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
            {formatDate(task.deadline, lang)} · {formatTime(task.deadline, lang)}
          </span>
          <span className={cn(
            'font-semibold',
            rel.tone === 'overdue' && 'text-rose-500',
            rel.tone === 'soon' && 'text-accent-600 dark:text-accent-400',
            rel.tone === 'neutral' && 'text-slate-400',
          )}>
            {rel.label}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-0.5 shrink-0">
        {onEdit && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onEdit(task); }}
            aria-label={t('settings.edit')}
            className="p-2 rounded-lg text-slate-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 transition opacity-0 group-hover:opacity-100"
          >
            <Pencil className="w-4 h-4" />
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
            aria-label={t('settings.signOut')}
            className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition opacity-0 group-hover:opacity-100"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export function CategoryBadge({ category }: { category: Category }) {
  const { t } = useLang();
  const cat = categoryMeta[category];
  return <span className={cn('text-[11px] font-bold px-2 py-0.5 rounded-md', cat.color)}>{t(`cat.${category}`)}</span>;
}
