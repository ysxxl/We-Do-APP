import { useState, useEffect } from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { RouterProvider, useRouter } from '@/context/RouterContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { DataProvider, useData } from '@/context/DataContext';
import { LandingPage } from '@/pages/LandingPage';
import { AuthPage } from '@/pages/AuthPage';
import { OnboardingPage } from '@/pages/OnboardingPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { TasksPage } from '@/pages/TasksPage';
import { HabitsPage } from '@/pages/HabitsPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { AddTaskModal } from '@/components/AddTaskModal';
import { AddHabitModal } from '@/components/AddHabitModal';
import type { Task, Habit } from '@/data/mockData';
import { Loader2 } from 'lucide-react';

const privateRoutes = ['dashboard', 'tasks', 'habits', 'settings', 'onboarding'];

function AuthenticatedApp() {
  const { route, navigate } = useRouter();
  const { profile, loading } = useAuth();
  const { tasks, addTask, editTask, toggleTask, toggleHabit, addHabit, editHabit } = useData();
  const [addOpen, setAddOpen] = useState(false);
  const [addHabitOpen, setAddHabitOpen] = useState(false);
  const [editTaskData, setEditTaskData] = useState<Task | null>(null);
  const [editHabitData, setEditHabitData] = useState<Habit | null>(null);

  useEffect(() => {
    if (!loading && profile && !profile.onboarded && route === 'dashboard') {
      navigate('onboarding');
    }
  }, [loading, profile, route, navigate]);

  const handleSave = (t: Omit<Task, 'id' | 'status'>) => { addTask(t); setAddOpen(false); };
  const handleSaveHabit = (title: string, color: string) => { addHabit(title, color); setAddHabitOpen(false); };
  const handleUpdateTask = (id: string, t: Omit<Task, 'id' | 'status'>) => { editTask(id, t); setEditTaskData(null); };
  const handleUpdateHabit = (id: string, title: string, color: string) => { editHabit(id, title, color); setEditHabitData(null); };

  const closeTaskModal = () => { setAddOpen(false); setEditTaskData(null); };
  const closeHabitModal = () => { setAddHabitOpen(false); setEditHabitData(null); };

  const withShell = (page: React.ReactNode) => (
    <>
      {page}
      <AddTaskModal open={addOpen || !!editTaskData} onClose={closeTaskModal} onSave={handleSave} editTask={editTaskData} onUpdate={handleUpdateTask} />
      <AddHabitModal open={addHabitOpen || !!editHabitData} onClose={closeHabitModal} onSave={handleSaveHabit} editHabit={editHabitData} onUpdate={handleUpdateHabit} />
    </>
  );

  const onEditTask = (task: Task) => setEditTaskData(task);
  const onEditHabit = (habit: Habit) => setEditHabitData(habit);

  switch (route) {
    case 'onboarding': return <OnboardingPage />;
    case 'dashboard': return withShell(<DashboardPage onAddTask={() => setAddOpen(true)} onEditTask={onEditTask} onEditHabit={onEditHabit} />);
    case 'tasks': return withShell(<TasksPage onAddTask={() => setAddOpen(true)} onEditTask={onEditTask} />);
    case 'habits': return withShell(<HabitsPage onAddTask={() => setAddOpen(true)} onAddHabit={() => setAddHabitOpen(true)} onEditHabit={onEditHabit} />);
    case 'settings': return withShell(<SettingsPage onAddTask={() => setAddOpen(true)} />);
    default: return withShell(<DashboardPage onAddTask={() => setAddOpen(true)} onEditTask={onEditTask} onEditHabit={onEditHabit} />);
  }
}

function RoutedApp() {
  const { route, navigate } = useRouter();
  const { session, loading } = useAuth();

  useEffect(() => {
    if (!loading && !session && privateRoutes.includes(route)) navigate('login');
  }, [loading, session, route, navigate]);

  useEffect(() => {
    if (!loading && session && (route === 'login' || route === 'signup')) navigate('dashboard');
  }, [loading, session, route, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    );
  }

  switch (route) {
    case 'landing': return <LandingPage />;
    case 'login': return <AuthPage mode="login" />;
    case 'signup': return <AuthPage mode="signup" />;
    case 'onboarding':
    case 'dashboard':
    case 'tasks':
    case 'habits':
    case 'settings':
      return session ? (
        <DataProvider>
          <AuthenticatedApp />
        </DataProvider>
      ) : <AuthPage mode="login" />;
    default: return <LandingPage />;
  }
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LanguageProvider>
          <RouterProvider>
            <RoutedApp />
          </RouterProvider>
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
