import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
  checked: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md';
  className?: string;
};

export function Checkbox({ checked, onClick, size = 'md', className }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={checked}
      aria-label={checked ? 'Tandai belum selesai' : 'Tandai selesai'}
      className={cn(
        'flex items-center justify-center rounded-lg border-2 transition-all duration-200 shrink-0',
        size === 'sm' ? 'w-5 h-5' : 'w-6 h-6',
        checked
          ? 'bg-brand-500 border-brand-500 text-white animate-pop'
          : 'border-slate-300 dark:border-slate-600 hover:border-brand-400 dark:hover:border-brand-500 bg-transparent',
        className,
      )}
    >
      {checked && <Check className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} strokeWidth={3} />}
    </button>
  );
}
