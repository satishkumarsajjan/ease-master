// src/components/controls/BezierControls.tsx
'use client';

import { useEaseStore } from '@/store/useEaseStore';

export const BezierControls = () => {
  const { bezier, updateBezier } = useEaseStore();

  const handleInput = (handle: 'p1' | 'p2', axis: 'x' | 'y', value: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) return;

    // Create new point object
    const newPoint = { ...bezier[handle], [axis]: num };
    updateBezier(handle, newPoint);
  };

  return (
    <div className='grid grid-cols-2 gap-4'>
      {/* P1 Controls */}
      <div className='space-y-2'>
        <label className='text-xs font-bold text-purple-500'>P1 (Start)</label>
        <div className='flex gap-2'>
          <div className='relative'>
            <span className='absolute left-2 top-1.5 text-xs text-slate-400'>
              X
            </span>
            <input
              type='number'
              step='0.01'
              min='0'
              max='1'
              value={bezier.p1.x.toFixed(2)}
              onChange={(e) => handleInput('p1', 'x', e.target.value)}
              className='w-full rounded-md border border-slate-200 bg-slate-50 py-1 pl-6 text-sm'
            />
          </div>
          <div className='relative'>
            <span className='absolute left-2 top-1.5 text-xs text-slate-400'>
              Y
            </span>
            <input
              type='number'
              step='0.01'
              value={bezier.p1.y.toFixed(2)}
              onChange={(e) => handleInput('p1', 'y', e.target.value)}
              className='w-full rounded-md border border-slate-200 bg-slate-50 py-1 pl-6 text-sm'
            />
          </div>
        </div>
      </div>

      {/* P2 Controls */}
      <div className='space-y-2'>
        <label className='text-xs font-bold text-pink-500'>P2 (End)</label>
        <div className='flex gap-2'>
          <div className='relative'>
            <span className='absolute left-2 top-1.5 text-xs text-slate-400'>
              X
            </span>
            <input
              type='number'
              step='0.01'
              min='0'
              max='1'
              value={bezier.p2.x.toFixed(2)}
              onChange={(e) => handleInput('p2', 'x', e.target.value)}
              className='w-full rounded-md border border-slate-200 bg-slate-50 py-1 pl-6 text-sm'
            />
          </div>
          <div className='relative'>
            <span className='absolute left-2 top-1.5 text-xs text-slate-400'>
              Y
            </span>
            <input
              type='number'
              step='0.01'
              value={bezier.p2.y.toFixed(2)}
              onChange={(e) => handleInput('p2', 'y', e.target.value)}
              className='w-full rounded-md border border-slate-200 bg-slate-50 py-1 pl-6 text-sm'
            />
          </div>
        </div>
      </div>
    </div>
  );
};
