export type Category = 'daily' | 'weekly' | 'monthly';
export type TaskStatus = 'todo' | 'done';

export type Task = {
  id: string;
  title: string;
  description?: string;
  category: Category;
  deadline: string; // ISO date
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high';
};

export type Habit = {
  id: string;
  title: string;
  frequency: Category;
  streak: number;
  bestStreak: number;
  doneToday: boolean;
  weekProgress: boolean[]; // 7 entries
  color: string;
};

export const categoryMeta: Record<Category, { short: string; color: string }> = {
  daily: { short: 'H', color: 'bg-brand-100 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300' },
  weekly: { short: 'M', color: 'bg-accent-100 text-accent-600 dark:bg-accent-500/15 dark:text-accent-400' },
  monthly: { short: 'B', color: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300' },
};

export const priorityMeta = {
  low: { dot: 'bg-slate-400' },
  medium: { dot: 'bg-accent-500' },
  high: { dot: 'bg-rose-500' },
} as const;

export const initialTasks: Task[] = [
  { id: 't1', title: 'Revisi Bab 3 Skripsi', description: 'Perbaiki bagian metodologi sesuai masukan dosen pembimbing', category: 'daily', deadline: '2026-08-01T17:00', status: 'todo', priority: 'high' },
  { id: 't2', title: 'Bimbingan skripsi', category: 'daily', deadline: '2026-08-01T14:00', status: 'todo', priority: 'high' },
  { id: 't3', title: 'Kirim draft artikel klien', category: 'weekly', deadline: '2026-08-03T12:00', status: 'todo', priority: 'medium' },
  { id: 't4', title: 'Review PR #124', category: 'daily', deadline: '2026-08-01T10:00', status: 'done', priority: 'medium' },
  { id: 't5', title: 'Riset referensi jurnal', category: 'weekly', deadline: '2026-08-05T09:00', status: 'todo', priority: 'low' },
  { id: 't6', title: 'Planning konten bulan ini', category: 'monthly', deadline: '2026-08-25T23:00', status: 'todo', priority: 'medium' },
  { id: 't7', title: 'Belanja mingguan', category: 'weekly', deadline: '2026-08-02T18:00', status: 'done', priority: 'low' },
];

export const initialHabits: Habit[] = [
  { id: 'h1', title: 'Menulis skripsi 30 menit', frequency: 'daily', streak: 12, bestStreak: 18, doneToday: false, weekProgress: [true, true, true, true, true, false, false], color: 'brand' },
  { id: 'h2', title: 'Olahraga pagi', frequency: 'daily', streak: 5, bestStreak: 9, doneToday: true, weekProgress: [true, false, true, true, true, true, false], color: 'accent' },
  { id: 'h3', title: 'Membaca 20 halaman', frequency: 'daily', streak: 21, bestStreak: 30, doneToday: false, weekProgress: [true, true, true, true, true, true, false], color: 'sky' },
  { id: 'h4', title: 'Journaling malam', frequency: 'daily', streak: 3, bestStreak: 7, doneToday: false, weekProgress: [false, true, true, false, true, true, false], color: 'violet' },
];

export function formatDate(iso: string, lang: string = 'id'): string {
  const d = new Date(iso);
  return d.toLocaleDateString(lang === 'en' ? 'en-US' : 'id-ID', { day: 'numeric', month: 'short' });
}

export function formatTime(iso: string, lang: string = 'id'): string {
  const d = new Date(iso);
  return d.toLocaleTimeString(lang === 'en' ? 'en-US' : 'id-ID', { hour: '2-digit', minute: '2-digit' });
}

export function relativeDeadline(iso: string, t: (k: string) => string = (k) => k): { label: string; tone: 'neutral' | 'soon' | 'overdue' } {
  const now = new Date();
  const d = new Date(iso);
  const diffMs = d.getTime() - now.getTime();
  const diffH = diffMs / 3.6e6;
  if (diffH < 0) return { label: t('rel.overdue'), tone: 'overdue' };
  if (diffH < 24) return { label: t('rel.today'), tone: 'soon' };
  const days = Math.floor(diffH / 24);
  if (days === 1) return { label: t('rel.tomorrow'), tone: 'soon' };
  if (days <= 3) return { label: `${days} ${t('rel.daysLeft')}`, tone: 'soon' };
  return { label: `${days} ${t('rel.daysLeft')}`, tone: 'neutral' };
}
