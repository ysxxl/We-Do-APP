import { cn } from '@/lib/utils';

type Props = {
  tabs: { id: string; label: string; count?: number }[];
  active: string;
  onChange: (id: string) => void;
  className?: string;
};

export function SegmentedTabs({ tabs, active, onChange, className }: Props) {
  return (
    <div className={cn('inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700', className)}>
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
          className={cn(
            'relative px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200',
            active === t.id
              ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200',
          )}
        >
          {t.label}
          {typeof t.count === 'number' && (
            <span className={cn(
              'ml-1.5 text-[11px] px-1.5 py-0.5 rounded-md font-bold',
              active === t.id ? 'bg-brand-100 dark:bg-brand-500/15 text-brand-600 dark:text-brand-400' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400',
            )}>
              {t.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
