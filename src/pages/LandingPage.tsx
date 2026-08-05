import {
  ArrowRight, CheckCircle2, Flame, Moon, Repeat, Sparkles, ListTodo, Bell, Filter, Smartphone, Quote,
} from 'lucide-react';
import { useRouter } from '@/context/RouterContext';
import { useLang } from '@/context/LanguageContext';
import { Logo } from '@/components/Logo';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { ProgressRing } from '@/components/ui/ProgressRing';

export function LandingPage() {
  const { navigate } = useRouter();
  const { t } = useLang();

  const features = [
    { icon: ListTodo, title: t('feat.todo.title'), desc: t('feat.todo.desc') },
    { icon: Repeat, title: t('feat.habit.title'), desc: t('feat.habit.desc') },
    { icon: Moon, title: t('feat.dark.title'), desc: t('feat.dark.desc') },
    { icon: Filter, title: t('feat.filter.title'), desc: t('feat.filter.desc') },
    { icon: Bell, title: t('feat.bell.title'), desc: t('feat.bell.desc') },
    { icon: Smartphone, title: t('feat.phone.title'), desc: t('feat.phone.desc') },
  ];

  const steps = [
    { n: '01', title: t('step.1.title'), desc: t('step.1.desc') },
    { n: '02', title: t('step.2.title'), desc: t('step.2.desc') },
    { n: '03', title: t('step.3.title'), desc: t('step.3.desc') },
  ];

  const testimonials = [
    { name: 'Dinda, 21', role: 'Mahasiswa Tingkat Akhir', text: 'Akhirnya deadline skripsi dan kebiasaan nulis 30 menit/hari ada di satu tempat. Streak-nya bikin saya konsisten.' },
    { name: 'Reza, 27', role: 'Remote Developer', text: 'Dark mode-nya bikin enak begadang ngerjain sprint. Habit tracker bantu jaga olahraga rutin meski WFH.' },
    { name: 'Sari, 24', role: 'Freelance Content Writer', text: 'Bisa bedain task klien mingguan vs target konten bulanan. Dashboard-nya ringkas, gak ribet kayak Notion.' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 overflow-x-hidden">
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-slate-950/80 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <a href="#fitur" className="hover:text-brand-600 dark:hover:text-brand-400 transition">{t('landing.nav.features')}</a>
            <a href="#cara" className="hover:text-brand-600 dark:hover:text-brand-400 transition">{t('landing.nav.how')}</a>
            <a href="#cerita" className="hover:text-brand-600 dark:hover:text-brand-400 transition">{t('landing.nav.stories')}</a>
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle className="hidden sm:inline-flex" />
            <button onClick={() => navigate('login')} className="btn-ghost text-sm">{t('landing.nav.login')}</button>
            <button onClick={() => navigate('signup')} className="btn-primary text-sm">{t('landing.nav.start')}</button>
          </div>
        </div>
      </header>

      <section className="relative">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand-200/30 dark:bg-brand-500/10 blur-[120px] rounded-full" />
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/20 text-brand-700 dark:text-brand-400 text-xs font-semibold mb-6 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5" /> {t('landing.badge')}
          </div>
          <h1 className="font-display font-extrabold tracking-tight text-slate-900 dark:text-white text-4xl sm:text-5xl lg:text-6xl leading-[1.1] max-w-3xl mx-auto animate-fade-in">
            {t('landing.hero.title1')}<span className="text-brand-500">{t('landing.hero.title2')}</span>{t('landing.hero.title3')}<span className="text-brand-500">{t('landing.hero.title4')}</span>
          </h1>
          <p className="mt-5 text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto animate-fade-in">
            {t('landing.hero.desc')}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in">
            <button onClick={() => navigate('signup')} className="btn-primary text-base px-7 py-3 group">
              {t('landing.hero.cta1')} <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button onClick={() => navigate('dashboard')} className="btn-secondary text-base px-7 py-3">{t('landing.hero.cta2')}</button>
          </div>
          <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">{t('landing.hero.note')}</p>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
          <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-3 shadow-2xl animate-scale-in">
            <div className="rounded-xl bg-white dark:bg-slate-950 overflow-hidden border border-slate-100 dark:border-slate-800">
              <div className="grid sm:grid-cols-3 gap-0">
                <div className="p-6 sm:border-r border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-brand-50/50 to-transparent dark:from-brand-500/5">
                  <ProgressRing value={68} size="lg" />
                  <div>
                    <p className="font-display font-bold text-slate-800 dark:text-slate-100">{t('landing.mock.today')}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{t('landing.mock.todaySub')}</p>
                  </div>
                </div>
                <div className="p-5 sm:border-r border-slate-100 dark:border-slate-800 space-y-2.5">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">{t('landing.mock.tasksTitle')}</p>
                  {[
                    { t: 'Review PR #124', d: true },
                    { t: 'Bimbingan skripsi', d: false },
                    { t: 'Revisi Bab 3', d: false },
                    { t: 'Kirim draft klien', d: false },
                  ].map((x, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${x.d ? 'bg-brand-500 border-brand-500' : 'border-slate-300 dark:border-slate-600'}`}>
                        {x.d && <CheckCircle2 className="w-3 h-3 text-white" />}
                      </div>
                      <span className={`text-sm ${x.d ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-200'}`}>{x.t}</span>
                    </div>
                  ))}
                </div>
                <div className="p-5 space-y-2.5">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">{t('landing.mock.habitTitle')}</p>
                  {[
                    { t: 'Menulis skripsi', s: 12, c: 'text-brand-500' },
                    { t: 'Olahraga pagi', s: 5, c: 'text-accent-500' },
                    { t: 'Membaca 20 hal', s: 21, c: 'text-sky-500' },
                  ].map((x, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm text-slate-700 dark:text-slate-200">{x.t}</span>
                      <span className={`inline-flex items-center gap-1 text-sm font-bold ${x.c}`}><Flame className="w-3.5 h-3.5" />{x.s}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="fitur" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white">{t('landing.features.title')}</h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400">{t('landing.features.desc')}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="card p-6 hover:shadow-glow hover:-translate-y-0.5 transition-all duration-200">
                <div className="w-11 h-11 rounded-xl bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-lg text-slate-800 dark:text-slate-100">{f.title}</h3>
                <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section id="cara" className="bg-slate-50 dark:bg-slate-900/40 border-y border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white">{t('landing.how.title')}</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400">{t('landing.how.desc')}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((s) => (
              <div key={s.n} className="relative">
                <div className="font-display font-extrabold text-5xl text-brand-200 dark:text-brand-500/30">{s.n}</div>
                <h3 className="mt-2 font-display font-bold text-xl text-slate-800 dark:text-slate-100">{s.title}</h3>
                <p className="mt-1.5 text-slate-500 dark:text-slate-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="cerita" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white">{t('landing.stories.title')}</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((tm) => (
            <div key={tm.name} className="card p-6 flex flex-col gap-4">
              <Quote className="w-7 h-7 text-brand-400" />
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed flex-1">{tm.text}</p>
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-100">{tm.name}</p>
                <p className="text-sm text-slate-400 dark:text-slate-500">{tm.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 px-6 sm:px-12 py-12 sm:py-16 text-center">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          <div className="relative">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white">{t('landing.cta.title')}</h2>
            <p className="mt-3 text-brand-50 max-w-md mx-auto">{t('landing.cta.desc')}</p>
            <button onClick={() => navigate('signup')} className="mt-7 inline-flex items-center gap-2 bg-white text-brand-700 font-bold px-7 py-3 rounded-xl hover:bg-brand-50 active:scale-[0.98] transition shadow-lg">
              {t('landing.cta.button')} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo />
          <p className="text-sm text-slate-400 dark:text-slate-500">{t('landing.footer')}</p>
        </div>
      </footer>
    </div>
  );
}
