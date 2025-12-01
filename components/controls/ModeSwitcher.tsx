'use client';
import { useEaseStore } from '@/store/useEaseStore';
import { clsx } from 'clsx';

export const ModeSwitcher = () => {
  const { mode, setMode } = useEaseStore();

  return (
    <div className='mb-6 flex items-center justify-between'>
      <h2 className='text-sm font-semibold uppercase tracking-wider text-slate-500'>
        Configuration
      </h2>
      <div className='flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800'>
        <button
          onClick={() => setMode('bezier')}
          className={clsx(
            'rounded-md px-3 py-1 text-xs font-bold transition-all',
            mode === 'bezier'
              ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
              : 'text-slate-500 hover:text-slate-700'
          )}
        >
          Bezier
        </button>
        <button
          onClick={() => setMode('spring')}
          className={clsx(
            'rounded-md px-3 py-1 text-xs font-bold transition-all',
            mode === 'spring'
              ? 'bg-white text-blue-600 shadow-sm dark:bg-slate-700 dark:text-blue-400'
              : 'text-slate-500 hover:text-slate-700'
          )}
        >
          Spring
        </button>
      </div>
    </div>
  );
};
