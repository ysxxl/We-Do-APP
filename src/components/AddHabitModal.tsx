import { useState, useEffect } from 'react';
import { Modal } from './ui/Modal';
import { cn } from '@/lib/utils';
import { useLang } from '@/context/LanguageContext';
import type { Habit } from '@/data/mockData';

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (title: string, color: string) => void;
  editHabit?: Habit | null;
  onUpdate?: (id: string, title: string, color: string) => void;
};

const colorIds = ['brand', 'accent', 'sky', 'violet'] as const;

export function AddHabitModal({ open, onClose, onSave, editHabit, onUpdate }: Props) {
  const { t } = useLang();
  const [title, setTitle] = useState('');
  const [color, setColor] = useState('brand');

  const isEdit = !!editHabit;

  useEffect(() => {
    if (editHabit) {
      setTitle(editHabit.title);
      setColor(editHabit.color);
    } else {
      setTitle(''); setColor('brand');
    }
  }, [editHabit, open]);

  const reset = () => { setTitle(''); setColor('brand'); };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    if (isEdit && onUpdate && editHabit) {
      onUpdate(editHabit.id, title.trim(), color);
    } else {
      onSave(title.trim(), color);
    }
    reset();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? t('modal.editHabit') : t('modal.addHabit')}>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{t('modal.habitName')}</label>
          <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('modal.habitNamePh')} className="input" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">{t('modal.color')}</label>
          <div className="grid grid-cols-4 gap-2">
            {colorIds.map((cid) => (
              <button key={cid} type="button" onClick={() => setColor(cid)} className={cn('flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold border-2 transition-all', color === cid ? 'border-slate-400 dark:border-slate-500 bg-slate-50 dark:bg-slate-800' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600')}>
                <span className={cn('w-6 h-6 rounded-full', colorMap[cid])} />
                {t(`color.${cid}`)}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary flex-1">{t('modal.cancel')}</button>
          <button type="submit" className="btn-primary flex-1">{isEdit ? t('modal.updateHabit') : t('modal.saveHabit')}</button>
        </div>
      </form>
    </Modal>
  );
}

const colorMap: Record<string, string> = {
  brand: 'bg-brand-500',
  accent: 'bg-accent-500',
  sky: 'bg-sky-500',
  violet: 'bg-violet-500',
};
