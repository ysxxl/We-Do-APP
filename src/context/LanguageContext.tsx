import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';

export type Lang = 'id' | 'en';

type Dict = Record<string, string>;

const id: Dict = {
  // App / Nav
  'nav.dashboard': 'Dashboard',
  'nav.tasks': 'Tugas',
  'nav.habits': 'Habit Tracker',
  'nav.settings': 'Pengaturan',
  'nav.addTask': 'Tambah Task',
  'nav.theme': 'Tema',
  'nav.signOut': 'Keluar',

  // Landing
  'landing.nav.features': 'Fitur',
  'landing.nav.how': 'Cara Kerja',
  'landing.nav.stories': 'Cerita User',
  'landing.nav.login': 'Masuk',
  'landing.nav.start': 'Mulai Gratis',
  'landing.badge': 'To-Do List & Habit Tracker dalam satu app',
  'landing.hero.title1': 'Satu tempat sederhana untuk ',
  'landing.hero.title2': 'kelola tugas',
  'landing.hero.title3': ' dan ',
  'landing.hero.title4': 'bangun kebiasaan',
  'landing.hero.desc': 'We Do menggabungkan to-do list dan habit tracker tanpa ribet — dirancang untuk mahasiswa & pekerja remote yang butuh satu tempat untuk seluruh waktunya.',
  'landing.hero.cta1': 'Mulai Gratis',
  'landing.hero.cta2': 'Lihat Demo',
  'landing.hero.note': 'Gratis selamanya · Tanpa kartu kredit',
  'landing.mock.today': 'Hari Ini',
  'landing.mock.todaySub': '68% selesai · 4 dari 6',
  'landing.mock.tasksTitle': 'Tugas Hari Ini',
  'landing.mock.habitTitle': 'Habit Streak',
  'landing.features.title': 'Semua yang kamu butuh, tanpa kompleksitas',
  'landing.features.desc': 'Fitur lengkap untuk produktivitas harian, dirancang sederhana agar langsung bisa dipakai.',
  'landing.how.title': 'Mulai dalam 3 langkah',
  'landing.how.desc': 'Tanpa setup lama. Langsung produktif di menit pertama.',
  'landing.stories.title': 'Cerita dari pengguna We Do',
  'landing.cta.title': 'Siap mulai bangun kebiasaan?',
  'landing.cta.desc': 'Gabung bersama mahasiswa & pekerja remote yang sudah mengatur hidup mereka dengan We Do.',
  'landing.cta.button': 'Buat Akun Gratis',
  'landing.footer': '© 2026 We Do. Dibuat untuk yang produktif.',

  // Landing features
  'feat.todo.title': 'To-Do List Cerdas',
  'feat.todo.desc': 'Kelola tugas dengan kategori harian, mingguan, dan bulanan. Deadline & reminder otomatis.',
  'feat.habit.title': 'Habit Tracker',
  'feat.habit.desc': 'Bangun kebiasaan dengan tracking streak harian. Lihat konsistensi kamu dalam visual yang memotivasi.',
  'feat.dark.title': 'Dark Mode',
  'feat.dark.desc': 'Nyaman dipakai siang maupun malam. Preferensi tema tersimpan otomatis.',
  'feat.filter.title': 'Filter & Sort',
  'feat.filter.desc': 'Urutkan berdasarkan deadline, kategori, atau status. Temukan task penting dalam sekali klik.',
  'feat.bell.title': 'Reminder',
  'feat.bell.desc': 'Notifikasi tepat waktu untuk deadline task dan habit. Tidak ada lagi yang terlewat.',
  'feat.phone.title': 'Responsive',
  'feat.phone.desc': 'Optimal di laptop, tablet, dan HP. Akses dari mana saja, kapan saja.',

  // Landing steps
  'step.1.title': 'Daftar cepat',
  'step.1.desc': 'Sign up via email atau Google dalam hitungan detik. Tanpa setup rumit.',
  'step.2.title': 'Tambah task & habit',
  'step.2.desc': 'Pilih kategori waktu, set deadline, dan mulai bangun kebiasaan pertamamu.',
  'step.3.title': 'Bangun konsistensi',
  'step.3.desc': 'Centang task setiap hari, lihat streak tumbuh, dan rasakan momentum.',

  // Auth
  'auth.back': 'Kembali',
  'auth.signup.title': 'Buat akun We Do',
  'auth.login.title': 'Selamat datang kembali',
  'auth.signup.sub': 'Mulai kelola tugas & kebiasaan dalam satu tempat',
  'auth.login.sub': 'Masuk untuk lanjut mengatur harimu',
  'auth.google.signup': 'Daftar dengan Google',
  'auth.google.login': 'Masuk dengan Google',
  'auth.or': 'atau',
  'auth.name': 'Nama',
  'auth.namePh': 'Nama lengkap',
  'auth.email': 'Email',
  'auth.password': 'Password',
  'auth.pwPh': 'Min. 6 karakter',
  'auth.forgot': 'Lupa password?',
  'auth.signup.btn': 'Buat Akun',
  'auth.login.btn': 'Masuk',
  'auth.signup.have': 'Sudah punya akun?',
  'auth.signup.haveLink': 'Masuk di sini',
  'auth.login.dont': 'Belum punya akun?',
  'auth.login.dontLink': 'Daftar gratis',

  // Onboarding
  'onb.skip': 'Lewati',
  'onb.q': 'Apa tujuan utamamu pakai We Do?',
  'onb.sub': 'Pilih satu — kami akan personalisasi dashboard-mu',
  'onb.next': 'Lanjut',
  'onb.done.title': 'Dashboard-mu siap!',
  'onb.done.desc': 'Kamu bisa langsung tambah task & habit baru. Dashboard kosong siap diisi.',
  'onb.done.hello': 'Halo',
  'onb.tips.title': 'Tips cepat',
  'onb.tips.1': 'Klik tombol + Tambah Task untuk menambah tugas baru',
  'onb.tips.2': 'Centang task untuk menandai selesai',
  'onb.tips.3': 'Buka tab Habit Tracker untuk bangun streak',
  'onb.start': 'Mulai pakai We Do',
  'goal.kuliah': 'Tugas Kuliah',
  'goal.kuliah.desc': 'Deadline, bimbingan, tugas mata kuliah',
  'goal.kerja': 'Pekerjaan',
  'goal.kerja.desc': 'Sprint, task kerja, meeting',
  'goal.habit': 'Kebiasaan Pribadi',
  'goal.habit.desc': 'Olahraga, membaca, journaling',
  'goal.semua': 'Semua di atas',
  'goal.semua.desc': 'Tugas + kebiasaan dalam satu tempat',

  // Dashboard
  'dash.welcome': 'Selamat datang kembali,',
  'dash.tasksLeft': 'tugas tersisa hari ini',
  'dash.todayTasks': 'Tugas Hari Ini',
  'dash.todayTasksVal': 'tersisa',
  'dash.weekDone': 'Selesai Minggu Ini',
  'dash.total': 'total',
  'dash.bestStreak': 'Streak Terbaik',
  'dash.habitsActive': 'Habit Aktif',
  'dash.habitsSub': 'habit harian',
  'dash.progress': 'Progres Hari Ini',
  'dash.progressEmpty': 'Belum ada tugas harian',
  'dash.progressMotiv': 'Teruslah, sedikit lagi!',
  'dash.tasks': 'Tugas',
  'dash.tab.today': 'Harian',
  'dash.tab.week': 'Mingguan',
  'dash.tab.month': 'Bulanan',
  'dash.empty': 'Belum ada tugas di kategori ini',
  'dash.addTask': 'Tambah Task',
  'dash.habitsToday': 'Habit Hari Ini',
  'dash.habitsEmpty': 'Belum ada habit. Tambahkan dari halaman Habit Tracker.',
  'dash.tip': 'Tips',
  'dash.tip.desc': 'Jangan rusak streak-mu! Centang habit hari ini sebelum tidur.',
  'dash.days': 'hari',

  // Tasks page
  'tasks.title': 'Tugas',
  'tasks.sub': 'Kelola seluruh tugas kamu di satu tempat',
  'tasks.search': 'Cari tugas...',
  'tasks.all': 'Semua',
  'tasks.daily': 'Harian',
  'tasks.weekly': 'Mingguan',
  'tasks.monthly': 'Bulanan',
  'tasks.todo': 'Belum',
  'tasks.done': 'Selesai',
  'tasks.emptyAll': 'Belum ada tugas. Yuk tambah task pertamamu!',
  'tasks.emptyFilter': 'Tidak ada tugas yang cocok dengan filter ini.',
  'tasks.addFirst': 'Tambah Task Pertama',

  // Habits page
  'habits.title': 'Habit Tracker',
  'habits.sub': 'Bangun konsistensi, jangan rusak streak-mu',
  'habits.new': 'Habit Baru',
  'habits.today': 'Hari Ini',
  'habits.todayVal': 'selesai',
  'habits.totalStreak': 'Total Streak',
  'habits.totalStreakVal': 'hari',
  'habits.best': 'Rekor Terbaik',
  'habits.bestVal': 'hari',
  'habits.empty': 'Belum ada habit. Tambahkan kebiasaan pertamamu untuk mulai membangun streak!',
  'habits.thisWeek': 'Minggu ini',
  'habits.bestLabel': 'Terbaik:',
  'habits.days': 'hari',

  // Settings
  'settings.title': 'Pengaturan',
  'settings.sub': 'Sesuaikan We Do sesuai preferensimu',
  'settings.profile': 'Profil',
  'settings.appearance': 'Tampilan',
  'settings.theme': 'Tema',
  'settings.themeDesc': 'Pilih light atau dark mode',
  'settings.language': 'Bahasa',
  'settings.languageDesc': 'Pilih bahasa antarmuka',
  'settings.notifications': 'Notifikasi',
  'settings.privacy': 'Privasi & Keamanan',
  'settings.notif.task': 'Reminder deadline task',
  'settings.notif.taskDesc': 'Notifikasi sebelum deadline tiba',
  'settings.notif.habit': 'Reminder habit harian',
  'settings.notif.habitDesc': 'Pengingat centang habit hari ini',
  'settings.notif.streak': 'Peringatan streak',
  'settings.notif.streakDesc': 'Peringatan sebelum streak putus',
  'settings.notif.email': 'Notifikasi email',
  'settings.notif.emailDesc': 'Ringkasan mingguan via email',
  'settings.changePw': 'Ubah password',
  'settings.changePwDesc': 'Perbarui password akunmu',
  'settings.export': 'Ekspor data',
  'settings.exportDesc': 'Unduh seluruh data tugas & habit',
  'settings.signOut': 'Keluar dari We Do',
  'settings.edit': 'Edit',

  // Modals
  'modal.addTask': 'Tambah Task Baru',
  'modal.editTask': 'Edit Task',
  'modal.addHabit': 'Tambah Habit Baru',
  'modal.editHabit': 'Edit Habit',
  'modal.taskTitle': 'Judul Task',
  'modal.taskTitlePh': 'cth: Revisi Bab 3 Skripsi',
  'modal.desc': 'Deskripsi',
  'modal.descPh': 'Detail singkat...',
  'modal.optional': '(opsional)',
  'modal.category': 'Kategori',
  'modal.deadline': 'Deadline',
  'modal.time': 'Jam',
  'modal.priority': 'Prioritas',
  'modal.habitName': 'Nama Habit',
  'modal.habitNamePh': 'cth: Membaca 20 halaman',
  'modal.color': 'Warna',
  'modal.cancel': 'Batal',
  'modal.saveTask': 'Simpan Task',
  'modal.saveHabit': 'Simpan Habit',
  'modal.updateTask': 'Perbarui Task',
  'modal.updateHabit': 'Perbarui Habit',

  // Category & priority labels
  'cat.daily': 'Harian',
  'cat.weekly': 'Mingguan',
  'cat.monthly': 'Bulanan',
  'prio.low': 'Rendah',
  'prio.medium': 'Sedang',
  'prio.high': 'Tinggi',

  // Relative deadline
  'rel.overdue': 'Terlewat',
  'rel.today': 'Hari ini',
  'rel.tomorrow': 'Besok',
  'rel.daysLeft': 'hari lagi',

  // Days
  'day.mon': 'Senin',
  'day.tue': 'Selasa',
  'day.wed': 'Rabu',
  'day.thu': 'Kamis',
  'day.fri': "Jum'at",
  'day.sat': 'Sabtu',
  'day.sun': 'Minggu',
  'day.monShort': 'Sen',
  'day.tueShort': 'Sel',
  'day.wedShort': 'Rab',
  'day.thuShort': 'Kam',
  'day.friShort': 'Jum',
  'day.satShort': 'Sab',
  'day.sunShort': 'Min',

  // Colors
  'color.brand': 'Biru',
  'color.accent': 'Oranye',
  'color.sky': 'Sky',
  'color.violet': 'Violet',

  // Misc
  'misc.user': 'Pengguna',
  'misc.version': 'We Do v1.0 · © 2026',
};

const en: Dict = {
  'nav.dashboard': 'Dashboard',
  'nav.tasks': 'Tasks',
  'nav.habits': 'Habit Tracker',
  'nav.settings': 'Settings',
  'nav.addTask': 'Add Task',
  'nav.theme': 'Theme',
  'nav.signOut': 'Sign Out',

  'landing.nav.features': 'Features',
  'landing.nav.how': 'How It Works',
  'landing.nav.stories': 'User Stories',
  'landing.nav.login': 'Log In',
  'landing.nav.start': 'Get Started',
  'landing.badge': 'To-Do List & Habit Tracker in one app',
  'landing.hero.title1': 'One simple place to ',
  'landing.hero.title2': 'manage tasks',
  'landing.hero.title3': ' and ',
  'landing.hero.title4': 'build habits',
  'landing.hero.desc': 'We Do combines to-do list and habit tracker without the clutter — designed for students & remote workers who need one place for all their time.',
  'landing.hero.cta1': 'Get Started',
  'landing.hero.cta2': 'View Demo',
  'landing.hero.note': 'Free forever · No credit card',
  'landing.mock.today': 'Today',
  'landing.mock.todaySub': '68% done · 4 of 6',
  'landing.mock.tasksTitle': 'Today\'s Tasks',
  'landing.mock.habitTitle': 'Habit Streak',
  'landing.features.title': 'Everything you need, without the complexity',
  'landing.features.desc': 'Complete features for daily productivity, designed simple so you can start right away.',
  'landing.how.title': 'Start in 3 steps',
  'landing.how.desc': 'No long setup. Productive in the first minute.',
  'landing.stories.title': 'Stories from We Do users',
  'landing.cta.title': 'Ready to start building habits?',
  'landing.cta.desc': 'Join students & remote workers who already organize their lives with We Do.',
  'landing.cta.button': 'Create Free Account',
  'landing.footer': '© 2026 We Do. Made for the productive.',

  'feat.todo.title': 'Smart To-Do List',
  'feat.todo.desc': 'Manage tasks with daily, weekly, and monthly categories. Automatic deadlines & reminders.',
  'feat.habit.title': 'Habit Tracker',
  'feat.habit.desc': 'Build habits with daily streak tracking. See your consistency in a motivating visual.',
  'feat.dark.title': 'Dark Mode',
  'feat.dark.desc': 'Comfortable day or night. Theme preference saved automatically.',
  'feat.filter.title': 'Filter & Sort',
  'feat.filter.desc': 'Sort by deadline, category, or status. Find important tasks in one click.',
  'feat.bell.title': 'Reminders',
  'feat.bell.desc': 'Timely notifications for task deadlines and habits. Never miss anything again.',
  'feat.phone.title': 'Responsive',
  'feat.phone.desc': 'Optimal on laptop, tablet, and phone. Access from anywhere, anytime.',

  'step.1.title': 'Quick sign up',
  'step.1.desc': 'Sign up via email or Google in seconds. No complicated setup.',
  'step.2.title': 'Add tasks & habits',
  'step.2.desc': 'Pick a time category, set a deadline, and start building your first habit.',
  'step.3.title': 'Build consistency',
  'step.3.desc': 'Check off tasks daily, watch your streak grow, and feel the momentum.',

  'auth.back': 'Back',
  'auth.signup.title': 'Create your We Do account',
  'auth.login.title': 'Welcome back',
  'auth.signup.sub': 'Start managing tasks & habits in one place',
  'auth.login.sub': 'Log in to continue organizing your day',
  'auth.google.signup': 'Sign up with Google',
  'auth.google.login': 'Log in with Google',
  'auth.or': 'or',
  'auth.name': 'Name',
  'auth.namePh': 'Full name',
  'auth.email': 'Email',
  'auth.password': 'Password',
  'auth.pwPh': 'Min. 6 characters',
  'auth.forgot': 'Forgot password?',
  'auth.signup.btn': 'Create Account',
  'auth.login.btn': 'Log In',
  'auth.signup.have': 'Already have an account?',
  'auth.signup.haveLink': 'Log in here',
  'auth.login.dont': "Don't have an account?",
  'auth.login.dontLink': 'Sign up free',

  'onb.skip': 'Skip',
  'onb.q': 'What\'s your main goal using We Do?',
  'onb.sub': 'Pick one — we\'ll personalize your dashboard',
  'onb.next': 'Continue',
  'onb.done.title': 'Your dashboard is ready!',
  'onb.done.desc': 'You can start adding tasks & habits right away. Your empty dashboard is ready to fill.',
  'onb.done.hello': 'Hello',
  'onb.tips.title': 'Quick tips',
  'onb.tips.1': 'Click the + Add Task button to add a new task',
  'onb.tips.2': 'Check off tasks to mark them as done',
  'onb.tips.3': 'Open the Habit Tracker tab to build your streak',
  'onb.start': 'Start using We Do',
  'goal.kuliah': 'College Tasks',
  'goal.kuliah.desc': 'Deadlines, advising, coursework',
  'goal.kerja': 'Work',
  'goal.kerja.desc': 'Sprints, work tasks, meetings',
  'goal.habit': 'Personal Habits',
  'goal.habit.desc': 'Exercise, reading, journaling',
  'goal.semua': 'All of the above',
  'goal.semua.desc': 'Tasks + habits in one place',

  'dash.welcome': 'Welcome back,',
  'dash.tasksLeft': 'tasks left today',
  'dash.todayTasks': 'Today\'s Tasks',
  'dash.todayTasksVal': 'left',
  'dash.weekDone': 'Done This Week',
  'dash.total': 'total',
  'dash.bestStreak': 'Best Streak',
  'dash.habitsActive': 'Active Habits',
  'dash.habitsSub': 'daily habits',
  'dash.progress': 'Today\'s Progress',
  'dash.progressEmpty': 'No daily tasks yet',
  'dash.progressMotiv': 'Keep going, almost there!',
  'dash.tasks': 'Tasks',
  'dash.tab.today': 'Daily',
  'dash.tab.week': 'Weekly',
  'dash.tab.month': 'Monthly',
  'dash.empty': 'No tasks in this category',
  'dash.addTask': 'Add Task',
  'dash.habitsToday': 'Today\'s Habits',
  'dash.habitsEmpty': 'No habits yet. Add one from the Habit Tracker page.',
  'dash.tip': 'Tip',
  'dash.tip.desc': 'Don\'t break your streak! Check off today\'s habit before bed.',
  'dash.days': 'days',

  'tasks.title': 'Tasks',
  'tasks.sub': 'Manage all your tasks in one place',
  'tasks.search': 'Search tasks...',
  'tasks.all': 'All',
  'tasks.daily': 'Daily',
  'tasks.weekly': 'Weekly',
  'tasks.monthly': 'Monthly',
  'tasks.todo': 'To Do',
  'tasks.done': 'Done',
  'tasks.emptyAll': 'No tasks yet. Add your first task!',
  'tasks.emptyFilter': 'No tasks match this filter.',
  'tasks.addFirst': 'Add First Task',

  'habits.title': 'Habit Tracker',
  'habits.sub': 'Build consistency, don\'t break your streak',
  'habits.new': 'New Habit',
  'habits.today': 'Today',
  'habits.todayVal': 'done',
  'habits.totalStreak': 'Total Streak',
  'habits.totalStreakVal': 'days',
  'habits.best': 'Best Record',
  'habits.bestVal': 'days',
  'habits.empty': 'No habits yet. Add your first habit to start building a streak!',
  'habits.thisWeek': 'This week',
  'habits.bestLabel': 'Best:',
  'habits.days': 'days',

  'settings.title': 'Settings',
  'settings.sub': 'Customize We Do to your preference',
  'settings.profile': 'Profile',
  'settings.appearance': 'Appearance',
  'settings.theme': 'Theme',
  'settings.themeDesc': 'Choose light or dark mode',
  'settings.language': 'Language',
  'settings.languageDesc': 'Choose interface language',
  'settings.notifications': 'Notifications',
  'settings.privacy': 'Privacy & Security',
  'settings.notif.task': 'Task deadline reminder',
  'settings.notif.taskDesc': 'Notification before deadline arrives',
  'settings.notif.habit': 'Daily habit reminder',
  'settings.notif.habitDesc': 'Reminder to check off today\'s habit',
  'settings.notif.streak': 'Streak warning',
  'settings.notif.streakDesc': 'Warning before your streak breaks',
  'settings.notif.email': 'Email notifications',
  'settings.notif.emailDesc': 'Weekly summary via email',
  'settings.changePw': 'Change password',
  'settings.changePwDesc': 'Update your account password',
  'settings.export': 'Export data',
  'settings.exportDesc': 'Download all your tasks & habits data',
  'settings.signOut': 'Sign out of We Do',
  'settings.edit': 'Edit',

  'modal.addTask': 'Add New Task',
  'modal.editTask': 'Edit Task',
  'modal.addHabit': 'Add New Habit',
  'modal.editHabit': 'Edit Habit',
  'modal.taskTitle': 'Task Title',
  'modal.taskTitlePh': 'e.g. Revise Chapter 3 Thesis',
  'modal.desc': 'Description',
  'modal.descPh': 'Brief details...',
  'modal.optional': '(optional)',
  'modal.category': 'Category',
  'modal.deadline': 'Deadline',
  'modal.time': 'Time',
  'modal.priority': 'Priority',
  'modal.habitName': 'Habit Name',
  'modal.habitNamePh': 'e.g. Read 20 pages',
  'modal.color': 'Color',
  'modal.cancel': 'Cancel',
  'modal.saveTask': 'Save Task',
  'modal.saveHabit': 'Save Habit',
  'modal.updateTask': 'Update Task',
  'modal.updateHabit': 'Update Habit',

  'cat.daily': 'Daily',
  'cat.weekly': 'Weekly',
  'cat.monthly': 'Monthly',
  'prio.low': 'Low',
  'prio.medium': 'Medium',
  'prio.high': 'High',

  'rel.overdue': 'Overdue',
  'rel.today': 'Today',
  'rel.tomorrow': 'Tomorrow',
  'rel.daysLeft': 'days left',

  'day.mon': 'Monday',
  'day.tue': 'Tuesday',
  'day.wed': 'Wednesday',
  'day.thu': 'Thursday',
  'day.fri': 'Friday',
  'day.sat': 'Saturday',
  'day.sun': 'Sunday',
  'day.monShort': 'Mon',
  'day.tueShort': 'Tue',
  'day.wedShort': 'Wed',
  'day.thuShort': 'Thu',
  'day.friShort': 'Fri',
  'day.satShort': 'Sat',
  'day.sunShort': 'Sun',

  'color.brand': 'Blue',
  'color.accent': 'Orange',
  'color.sky': 'Sky',
  'color.violet': 'Violet',

  'misc.user': 'User',
  'misc.version': 'We Do v1.0 · © 2026',
};

const dicts: Record<Lang, Dict> = { id, en };

type LanguageContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { profile } = useAuth();
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === 'undefined') return 'id';
    return (localStorage.getItem('wedo-lang') as Lang) || 'id';
  });

  useEffect(() => {
    if (profile?.language === 'en' || profile?.language === 'id') {
      setLangState(profile.language);
    }
  }, [profile?.language]);

  useEffect(() => {
    localStorage.setItem('wedo-lang', lang);
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
  };

  const t = (key: string): string => {
    return dicts[lang][key] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
}
