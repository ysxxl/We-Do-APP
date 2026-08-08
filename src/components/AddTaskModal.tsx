import { useState, useEffect } from 'react';
import { Modal } from './ui/Modal';
import { cn } from '@/lib/utils';
import { categoryMeta, type Category, type Task } from '@/data/mockData';
import { useLang } from '@/context/LanguageContext';

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'status'>) => void;
  editTask?: Task | null;
  onUpdate?: (id: string, task: Omit<Task, 'id' | 'status'>) => void;
};

export function AddTaskModal({ open, onClose, onSave, editTask, onUpdate }: Props) {
  const { t } = useLang();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('daily');
  const [deadline, setDeadline] = useState('');
  const [time, setTime] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('medium');

  const isEdit = !!editTask;

  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title);
      setDescription(editTask.description ?? '');
      setCategory(editTask.category);
      const d = new Date(editTask.deadline);
      setDeadline(d.toISOString().slice(0, 10));
      setTime(d.toTimeString().slice(0, 5));
      setPriority(editTask.priority);
    } else {
      setTitle(''); setDescription(''); setCategory('daily'); setDeadline(''); setTime(''); setPriority('medium');
    }
  }, [editTask, open]);

  const reset = () => {
    setTitle(''); setDescription(''); setCategory('daily'); setDeadline(''); setTime(''); setPriority('medium');
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const iso = deadline ? new Date(`${deadline}T${time || '09:00'}`).toISOString() : new Date().toISOString();
    const payload = { title: title.trim(), description: description.trim() || undefined, category, deadline: iso, priority };
    if (isEdit && onUpdate && editTask) {
      onUpdate(editTask.id, payload);
    } else {
      onSave(payload);
    }
    reset();
    onClose();
  };

  const priorities = [
    { id: 'low' as const, label: t('prio.low') },
    { id: 'medium' as const, label: t('prio.medium') },
    { id: 'high' as const, label: t('prio.high') },
  ];

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? t('modal.editTask') : t('modal.addTask')}>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{t('modal.taskTitle')}</label>
          <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('modal.taskTitlePh')} className="input" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{t('modal.desc')} <span className="text-slate-400 font-normal">{t('modal.optional')}</span></label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder={t('modal.descPh')} className="input resize-none" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{t('modal.category')}</label>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(categoryMeta) as Category[]).map((k) => (
              <button key={k} type="button" onClick={() => setCategory(k)} className={cn('px-3 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all', category === k ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400' : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600')}>
                {t(`cat.${k}`)}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{t('modal.deadline')}</label>
            <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="input" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{t('modal.time')}</label>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="input" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{t('modal.priority')}</label>
          <div className="grid grid-cols-3 gap-2">
            {priorities.map((p) => (
              <button key={p.id} type="button" onClick={() => setPriority(p.id)} className={cn('px-3 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all', priority === p.id ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400' : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600')}>
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">{t('modal.cancel')}</button>
          <button type="submit" className="btn-primary flex-1">{isEdit ? t('modal.updateTask') : t('modal.saveTask')}</button>
        </div>
      </form>
    </Modal>
  );
}
