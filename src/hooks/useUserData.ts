import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Category, Habit, Task } from '@/data/mockData';

function todayISODate(): string {
  return new Date().toISOString().slice(0, 10);
}

function startOfWeek(): Date {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function dayOfWeekIndex(): number {
  const day = new Date().getDay();
  return day === 0 ? 6 : day - 1;
}

type HabitLogRow = { habit_id: string; log_date: string };

export function useUserData() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setLoading(false);
      return;
    }

    const [tasksRes, habitsRes, logsRes] = await Promise.all([
      supabase.from('tasks').select('*').order('deadline', { ascending: true }),
      supabase.from('habits').select('*').order('created_at', { ascending: true }),
      supabase.from('habit_logs').select('habit_id, log_date'),
    ]);

    if (tasksRes.error) { setError(tasksRes.error.message); setLoading(false); return; }
    if (habitsRes.error) { setError(habitsRes.error.message); setLoading(false); return; }
    if (logsRes.error) { setError(logsRes.error.message); setLoading(false); return; }

    const today = todayISODate();
    const weekStart = startOfWeek();

    const logs = (logsRes.data ?? []) as HabitLogRow[];
    const logsByHabit = new Map<string, Set<string>>();
    for (const l of logs) {
      if (!logsByHabit.has(l.habit_id)) logsByHabit.set(l.habit_id, new Set());
      logsByHabit.get(l.habit_id)!.add(l.log_date);
    }

    const mappedHabits: Habit[] = (habitsRes.data ?? []).map((h: Record<string, unknown>) => {
      const habitId = h.id as string;
      const logDates = logsByHabit.get(habitId) ?? new Set<string>();
      const doneToday = logDates.has(today);
      const weekProgress = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(weekStart);
        d.setDate(weekStart.getDate() + i);
        const ds = d.toISOString().slice(0, 10);
        return logDates.has(ds);
      });
      return {
        id: habitId,
        title: h.title as string,
        frequency: (h.frequency as Category) ?? 'daily',
        streak: (h.streak as number) ?? 0,
        bestStreak: (h.best_streak as number) ?? 0,
        doneToday,
        weekProgress,
        color: (h.color as string) ?? 'brand',
      };
    });

    const mappedTasks: Task[] = (tasksRes.data ?? []).map((t: Record<string, unknown>) => ({
      id: t.id as string,
      title: t.title as string,
      description: (t.description as string) ?? undefined,
      category: (t.category as Category) ?? 'daily',
      deadline: (t.deadline as string) ?? new Date().toISOString(),
      status: ((t.status as string) === 'done' ? 'done' : 'todo') as Task['status'],
      priority: (t.priority as Task['priority']) ?? 'medium',
    }));

    setTasks(mappedTasks);
    setHabits(mappedHabits);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggleTask = useCallback(async (id: string) => {
    setTasks((ts) => ts.map((t) => t.id === id ? { ...t, status: t.status === 'done' ? 'todo' : 'done' } : t));
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const newStatus = task.status === 'done' ? 'todo' : 'done';
    const { error } = await supabase.from('tasks').update({ status: newStatus }).eq('id', id);
    if (error) { console.error('toggleTask error:', error.message); await load(); }
  }, [tasks, load]);

  const addTask = useCallback(async (t: Omit<Task, 'id' | 'status'>) => {
    const { data, error } = await supabase.from('tasks').insert({
      title: t.title,
      description: t.description ?? null,
      category: t.category,
      deadline: t.deadline,
      priority: t.priority,
      status: 'todo',
    }).select('*').single();
    if (error) { console.error('addTask error:', error.message); return; }
    if (data) {
      setTasks((ts) => [...ts, {
        id: data.id as string,
        title: data.title as string,
        description: (data.description as string) ?? undefined,
        category: data.category as Category,
        deadline: data.deadline as string,
        status: 'todo' as Task['status'],
        priority: data.priority as Task['priority'],
      }].sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()));
    }
  }, []);

  const toggleHabit = useCallback(async (id: string) => {
    const habit = habits.find((h) => h.id === id);
    if (!habit) return;
    const today = todayISODate();
    const todayIdx = dayOfWeekIndex();

    if (habit.doneToday) {
      setHabits((hs) => hs.map((h) => h.id === id ? {
        ...h,
        doneToday: false,
        streak: Math.max(0, h.streak - 1),
        weekProgress: h.weekProgress.map((d, i) => i === todayIdx ? false : d),
      } : h));
      const { error } = await supabase.from('habit_logs').delete().eq('habit_id', id).eq('log_date', today);
      if (error) { console.error('toggleHabit delete error:', error.message); await load(); }
      else {
        await supabase.from('habits').update({ streak: Math.max(0, habit.streak - 1) }).eq('id', id);
      }
    } else {
      const newStreak = habit.streak + 1;
      const newBest = Math.max(habit.bestStreak, newStreak);
      setHabits((hs) => hs.map((h) => h.id === id ? {
        ...h,
        doneToday: true,
        streak: newStreak,
        bestStreak: newBest,
        weekProgress: h.weekProgress.map((d, i) => i === todayIdx ? true : d),
      } : h));
      const { error } = await supabase.from('habit_logs').insert({ habit_id: id, log_date: today });
      if (error) { console.error('toggleHabit insert error:', error.message); await load(); }
      else {
        await supabase.from('habits').update({ streak: newStreak, best_streak: newBest }).eq('id', id);
      }
    }
  }, [habits, load]);

  const editTask = useCallback(async (id: string, patch: Omit<Task, 'id' | 'status'>) => {
    setTasks((ts) => ts.map((t) => t.id === id ? { ...t, ...patch } : t).sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()));
    const { error } = await supabase.from('tasks').update({
      title: patch.title,
      description: patch.description ?? null,
      category: patch.category,
      deadline: patch.deadline,
      priority: patch.priority,
    }).eq('id', id);
    if (error) { console.error('editTask error:', error.message); await load(); }
  }, [load]);

  const deleteTask = useCallback(async (id: string) => {
    setTasks((ts) => ts.filter((t) => t.id !== id));
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) { console.error('deleteTask error:', error.message); await load(); }
  }, [load]);

  const addHabit = useCallback(async (title: string, color: string) => {
    const { data, error } = await supabase.from('habits').insert({
      title,
      color,
      frequency: 'daily',
      streak: 0,
      best_streak: 0,
    }).select('*').single();
    if (error) { console.error('addHabit error:', error.message); return; }
    if (data) {
      setHabits((hs) => [...hs, {
        id: data.id as string,
        title: data.title as string,
        frequency: 'daily',
        streak: 0,
        bestStreak: 0,
        doneToday: false,
        weekProgress: [false, false, false, false, false, false, false],
        color: (data.color as string) ?? 'brand',
      }]);
    }
  }, []);

  const editHabit = useCallback(async (id: string, title: string, color: string) => {
    setHabits((hs) => hs.map((h) => h.id === id ? { ...h, title, color } : h));
    const { error } = await supabase.from('habits').update({ title, color }).eq('id', id);
    if (error) { console.error('editHabit error:', error.message); await load(); }
  }, [load]);

  const deleteHabit = useCallback(async (id: string) => {
    setHabits((hs) => hs.filter((h) => h.id !== id));
    await supabase.from('habit_logs').delete().eq('habit_id', id);
    const { error } = await supabase.from('habits').delete().eq('id', id);
    if (error) { console.error('deleteHabit error:', error.message); await load(); }
  }, [load]);

  const seedData = useCallback(async (goal: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const now = new Date();
    const inDays = (n: number) => {
      const d = new Date(now);
      d.setDate(d.getDate() + n);
      return d.toISOString();
    };

    const taskTemplates: Array<{ title: string; description?: string; category: Category; deadline: string; priority: Task['priority'] }> = [];

    if (goal === 'kuliah' || goal === 'semua') {
      taskTemplates.push(
        { title: 'Bimbingan skripsi', category: 'daily', deadline: inDays(0), priority: 'high' },
        { title: 'Revisi Bab 3 Skripsi', description: 'Perbaiki bagian metodologi sesuai masukan dosen', category: 'daily', deadline: inDays(1), priority: 'high' },
        { title: 'Riset referensi jurnal', category: 'weekly', deadline: inDays(4), priority: 'low' },
      );
    }
    if (goal === 'kerja' || goal === 'semua') {
      taskTemplates.push(
        { title: 'Review PR #124', category: 'daily', deadline: inDays(0), priority: 'medium' },
        { title: 'Kirim draft artikel klien', category: 'weekly', deadline: inDays(2), priority: 'medium' },
        { title: 'Planning sprint minggu depan', category: 'weekly', deadline: inDays(5), priority: 'medium' },
      );
    }
    if (goal === 'habit' || goal === 'semua') {
      taskTemplates.push(
        { title: 'Planning konten bulan ini', category: 'monthly', deadline: inDays(20), priority: 'medium' },
      );
    }

    if (taskTemplates.length > 0) {
      const { error: taskErr } = await supabase.from('tasks').insert(
        taskTemplates.map((t) => ({
          title: t.title,
          description: t.description ?? null,
          category: t.category,
          deadline: t.deadline,
          priority: t.priority,
          status: 'todo',
        }))
      );
      if (taskErr) console.error('Seed tasks error:', taskErr.message);
    }

    const habitTemplates: Array<{ title: string; color: string }> = [];
    if (goal === 'kuliah' || goal === 'semua') {
      habitTemplates.push({ title: 'Menulis skripsi 30 menit', color: 'brand' });
    }
    if (goal === 'kerja' || goal === 'semua') {
      habitTemplates.push({ title: 'Olahraga pagi', color: 'accent' });
    }
    if (goal === 'habit' || goal === 'semua') {
      habitTemplates.push({ title: 'Membaca 20 halaman', color: 'sky' });
      habitTemplates.push({ title: 'Journaling malam', color: 'violet' });
    }

    if (habitTemplates.length === 0) {
      habitTemplates.push(
        { title: 'Membaca 20 halaman', color: 'sky' },
        { title: 'Olahraga pagi', color: 'accent' },
      );
    }

    const { error: habitErr } = await supabase.from('habits').insert(
      habitTemplates.map((h) => ({
        title: h.title,
        color: h.color,
        frequency: 'daily',
        streak: 0,
        best_streak: 0,
      }))
    );
    if (habitErr) console.error('Seed habits error:', habitErr.message);

    await load();
  }, [load]);

  return { tasks, habits, loading, error, toggleTask, addTask, editTask, deleteTask, toggleHabit, addHabit, editHabit, deleteHabit, reload: load, seedData };
}
