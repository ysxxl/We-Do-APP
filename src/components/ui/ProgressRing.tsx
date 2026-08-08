import { cn } from '@/lib/utils';

type Props = {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  label?: string;
};

export function ProgressRing({ value, max = 100, size = 'md', color = 'stroke-brand-500', label }: Props) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const dim = size === 'sm' ? 48 : size === 'lg' ? 120 : 80;
  const stroke = size === 'sm' ? 5 : size === 'lg' ? 10 : 7;
  const r = (dim - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: dim, height: dim }}>
      <svg width={dim} height={dim} className="-rotate-90">
        <circle cx={dim / 2} cy={dim / 2} r={r} fill="none" strokeWidth={stroke} className="stroke-slate-100 dark:stroke-slate-800" />
        <circle
          cx={dim / 2}
          cy={dim / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          className={cn('transition-all duration-700 ease-out', color)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn('font-bold text-slate-800 dark:text-slate-100', size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-xs' : 'text-base')}>
          {label ?? `${pct}%`}
        </span>
      </div>
    </div>
  );
}
