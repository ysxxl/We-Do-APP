import { Check, Flame, Trash2, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Habit } from '@/data/mockData';
import { useLang } from '@/context/LanguageContext';

const colorMap: Record<string, { ring: string; text: string; dot: string; bar: string; soft: string }> = {
  brand: { ring: 'ring-brand-500', text: 'text-brand-600 dark:text-brand-400', dot: 'bg-brand-500', bar: 'bg-brand-500', soft: 'bg-brand-50 dark:bg-brand-500/10' },
  accent: { ring: 'ring-accent-500', text: 'text-accent-600 dark:text-accent-400', dot: 'bg-accent-500', bar: 'bg-accent-500', soft: 'bg-accent-50 dark:bg-accent-500/10' },
  sky: { ring: 'ring-sky-500', text: 'text-sky-600 dark:text-sky-400', dot: 'bg-sky-500', bar: 'bg-sky-500', soft: 'bg-sky-50 dark:bg-sky-500/10' },
  violet: { ring: 'ring-violet-500', text: 'text-violet-600 dark:text-violet-400', dot: 'bg-violet-500', bar: 'bg-violet-500', soft: 'bg-violet-50 dark:bg-violet-500/10' },
};

const dayKeys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;

type Props = {
  habit: Habit;
  onToggle: (id: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (habit: Habit) => void;
};

export function HabitCard({ habit, onToggle, onDelete, onEdit }: Props) {
  const { t } = useLang();
  const c = colorMap[habit.color] ?? colorMap.brand;
  const weekDone = habit.weekProgress.filter(Boolean).length;

  return (
    <div className="card p-5 hover:shadow-glow transition-all duration-200 group">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-slate-800 dark:text-slate-100">{habit.title}</h4>
          <div className="flex items-center gap-4 mt-1.5 text-sm">
            <span className={cn('inline-flex items-center gap-1 font-bold', c.text)}>
              <Flame className="w-4 h-4" />
              {habit.streak} {t('habits.days')}
            </span>
            <span className="text-slate-400 dark:text-slate-500 text-xs">{t('habits.bestLabel')} {habit.bestStreak} {t('habits.days')}</span>
          </div>
        </div>
        <div className="flex items-center gap-0.5 shrink-0">
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(habit)}
              aria-label={t('settings.edit')}
              className="p-2 rounded-lg text-slate-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10 transition opacity-0 group-hover:opacity-100"
            >
              <Pencil className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(habit.id)}
              aria-label={t('settings.signOut')}
              className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => onToggle(habit.id)}
            aria-pressed={habit.doneToday}
            className={cn(
              'shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-90',
              habit.doneToday
                ? `${c.bar} text-white animate-pop shadow-sm`
                : `border-2 border-dashed border-slate-300 dark:border-slate-600 ${c.soft} ${c.text} hover:border-solid`,
            )}
          >
            <Check className="w-5 h-5" strokeWidth={3} />
          </button>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{t('habits.thisWeek')}</span>
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{weekDone}/7</span>
        </div>
        <div className="flex items-center justify-between gap-1">
          {habit.weekProgress.map((done, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={cn(
                  'w-full h-2 rounded-full transition-colors',
                  done ? c.bar : 'bg-slate-100 dark:bg-slate-800',
                )}
              />
              <span className="text-[10px] text-slate-400 dark:text-slate-500">{t(`day.${dayKeys[i]}Short`)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
