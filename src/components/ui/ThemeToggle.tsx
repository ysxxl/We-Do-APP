import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const { session, updateProfile } = useAuth();

  const handleToggle = () => {
    toggle();
    if (session) {
      const newTheme = theme === 'dark' ? 'light' : 'dark';
      updateProfile({ theme_preference: newTheme });
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={theme === 'dark' ? 'Aktifkan light mode' : 'Aktifkan dark mode'}
      className={cn(
        'relative inline-flex h-9 w-16 items-center rounded-full border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 transition-colors duration-300',
        className,
      )}
    >
      <span
        className={cn(
          'inline-flex h-7 w-7 items-center justify-center rounded-full shadow-sm transition-all duration-300',
          theme === 'dark' ? 'translate-x-8 bg-slate-900 text-accent-400' : 'translate-x-1 bg-white text-accent-500',
        )}
      >
        {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
      </span>
    </button>
  );
}
