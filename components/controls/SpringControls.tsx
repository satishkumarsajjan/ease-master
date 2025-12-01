// src/components/controls/SpringControls.tsx
'use client';

import { useEaseStore } from '@/store/useEaseStore';

export const SpringControls = () => {
  const { spring, updateSpring } = useEaseStore();

  const handleChange = (key: 'stiffness' | 'damping' | 'mass', val: string) => {
    updateSpring(key, parseFloat(val));
  };

  return (
    <div className='space-y-6'>
      {/* Stiffness */}
      <div className='space-y-2'>
        <div className='flex justify-between text-xs font-medium'>
          <label className='text-slate-500'>Stiffness (Tension)</label>
          <span className='text-slate-900 dark:text-white'>
            {spring.stiffness}
          </span>
        </div>
        <input
          type='range'
          min='1'
          max='500'
          step='1'
          value={spring.stiffness}
          onChange={(e) => handleChange('stiffness', e.target.value)}
          className='h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-purple-600 dark:bg-slate-800'
        />
        <p className='text-[10px] text-slate-400'>Higher = Snappier, Faster</p>
      </div>

      {/* Damping */}
      <div className='space-y-2'>
        <div className='flex justify-between text-xs font-medium'>
          <label className='text-slate-500'>Damping (Friction)</label>
          <span className='text-slate-900 dark:text-white'>
            {spring.damping}
          </span>
        </div>
        <input
          type='range'
          min='1'
          max='100'
          step='1'
          value={spring.damping}
          onChange={(e) => handleChange('damping', e.target.value)}
          className='h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-pink-600 dark:bg-slate-800'
        />
        <p className='text-[10px] text-slate-400'>
          Lower = Bouncy / Higher = No Bounce
        </p>
      </div>

      {/* Mass */}
      <div className='space-y-2'>
        <div className='flex justify-between text-xs font-medium'>
          <label className='text-slate-500'>Mass (Weight)</label>
          <span className='text-slate-900 dark:text-white'>{spring.mass}</span>
        </div>
        <input
          type='range'
          min='0.1'
          max='5'
          step='0.1'
          value={spring.mass}
          onChange={(e) => handleChange('mass', e.target.value)}
          className='h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-blue-600 dark:bg-slate-800'
        />
        <p className='text-[10px] text-slate-400'>
          Higher = Slower to start/stop
        </p>
      </div>
    </div>
  );
};
