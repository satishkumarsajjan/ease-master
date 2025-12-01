'use client';

import { useEaseStore } from '@/store/useEaseStore';

export const ControlsBar = () => {
  const { mode, bezier, spring, updateBezier, updateSpring } = useEaseStore();

  // Helper to handle input changes without breaking on empty strings or decimals
  const handleBezierInput = (
    handle: 'p1' | 'p2',
    axis: 'x' | 'y',
    value: string
  ) => {
    if (value === '') {
      // @ts-ignore - allow empty string temporarily for UX
      updateBezier(handle, { ...bezier[handle], [axis]: '' });
      return;
    }
    const num = parseFloat(value);
    if (!isNaN(num)) {
      updateBezier(handle, { ...bezier[handle], [axis]: num });
    }
  };

  // Reusable classes based on Shadcn UI tokens
  const inputClass =
    'w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 placeholder:text-muted-foreground';

  const labelClass =
    'text-[10px] uppercase tracking-widest text-muted-foreground font-bold';

  const sliderClass =
    'flex-1 h-1.5 bg-secondary rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background transition-all hover:bg-secondary/80';

  return (
    <div className='w-full max-w-[500px] mt-6 rounded-lg bg-card p-5 border border-border shadow-sm'>
      {/* BEZIER CONTROLS */}
      {mode === 'bezier' && (
        <div className='grid grid-cols-2 gap-6'>
          {/* Start Handle */}
          <div className='space-y-3'>
            <label className={labelClass}>Start Handle</label>
            <div className='flex gap-2'>
              <input
                type='number'
                step='0.01'
                className={inputClass}
                value={bezier.p1.x}
                onChange={(e) => handleBezierInput('p1', 'x', e.target.value)}
              />
              <input
                type='number'
                step='0.01'
                className={inputClass}
                value={bezier.p1.y}
                onChange={(e) => handleBezierInput('p1', 'y', e.target.value)}
              />
            </div>
          </div>

          {/* End Handle */}
          <div className='space-y-3'>
            <label className={labelClass}>End Handle</label>
            <div className='flex gap-2'>
              <input
                type='number'
                step='0.01'
                className={inputClass}
                value={bezier.p2.x}
                onChange={(e) => handleBezierInput('p2', 'x', e.target.value)}
              />
              <input
                type='number'
                step='0.01'
                className={inputClass}
                value={bezier.p2.y}
                onChange={(e) => handleBezierInput('p2', 'y', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* SPRING CONTROLS */}
      {mode === 'spring' && (
        <div className='space-y-5'>
          {/* Stiffness */}
          <div className='flex items-center gap-4'>
            <label className={`${labelClass} w-20`}>Stiffness</label>
            <input
              type='range'
              min='1'
              max='500'
              className={sliderClass}
              value={spring.stiffness}
              onChange={(e) =>
                updateSpring('stiffness', parseFloat(e.target.value))
              }
            />
            <span className='w-10 text-right text-xs text-primary font-mono'>
              {spring.stiffness}
            </span>
          </div>

          {/* Damping */}
          <div className='flex items-center gap-4'>
            <label className={`${labelClass} w-20`}>Damping</label>
            <input
              type='range'
              min='1'
              max='100'
              className={sliderClass}
              value={spring.damping}
              onChange={(e) =>
                updateSpring('damping', parseFloat(e.target.value))
              }
            />
            <span className='w-10 text-right text-xs text-primary font-mono'>
              {spring.damping}
            </span>
          </div>

          {/* Mass */}
          <div className='flex items-center gap-4'>
            <label className={`${labelClass} w-20`}>Mass</label>
            <input
              type='range'
              min='0.1'
              max='5'
              step='0.1'
              className={sliderClass}
              value={spring.mass}
              onChange={(e) => updateSpring('mass', parseFloat(e.target.value))}
            />
            <span className='w-10 text-right text-xs text-primary font-mono'>
              {spring.mass}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
