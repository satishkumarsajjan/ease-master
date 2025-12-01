'use client';

import { useEaseStore } from '@/store/useEaseStore';
import { BEZIER_PRESETS, SPRING_PRESETS } from '@/core/presets';
import { clsx } from 'clsx';

export const PresetSelector = () => {
  const { mode, setBezierConfig, setSpringConfig } = useEaseStore();

  const presets = mode === 'bezier' ? BEZIER_PRESETS : SPRING_PRESETS;

  const handleSelect = (value: any) => {
    if (mode === 'bezier') setBezierConfig(value);
    else setSpringConfig(value);
  };

  return (
    <div className='mb-6'>
      <label className='mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500'>
        Quick Presets
      </label>
      <div className='flex flex-wrap gap-2'>
        {presets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => handleSelect(preset.value)}
            className={clsx(
              'rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600 transition-all dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400',
              'hover:border-purple-200 hover:bg-purple-50 hover:text-purple-600 dark:hover:border-purple-900 dark:hover:bg-purple-900/20 dark:hover:text-purple-400',
              'active:scale-95'
            )}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
};
