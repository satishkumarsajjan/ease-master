'use client';

import { useEaseStore } from '@/store/useEaseStore';
import { clsx } from 'clsx';

export const ControlsBar = () => {
  const { mode, bezier, spring, updateBezier, updateSpring } = useEaseStore();

  return (
    <div className='w-full max-w-[500px] mt-6 rounded-lg bg-[#1e1e1e] p-4 border border-slate-800'>
      {/* BEZIER CONTROLS */}
      {mode === 'bezier' && (
        <div className='grid grid-cols-2 gap-6'>
          <div className='space-y-2'>
            <label className='text-[10px] uppercase tracking-widest text-slate-500 font-bold'>
              Start Handle
            </label>
            <div className='flex gap-2'>
              <input
                type='number'
                step='0.01'
                className='bg-[#121212] border border-slate-700 text-slate-300 text-xs rounded px-2 py-1 w-full focus:border-lime-400 outline-none'
                value={bezier.p1.x}
                onChange={(e) =>
                  updateBezier('p1', {
                    ...bezier.p1,
                    x: parseFloat(e.target.value),
                  })
                }
              />
              <input
                type='number'
                step='0.01'
                className='bg-[#121212] border border-slate-700 text-slate-300 text-xs rounded px-2 py-1 w-full focus:border-lime-400 outline-none'
                value={bezier.p1.y}
                onChange={(e) =>
                  updateBezier('p1', {
                    ...bezier.p1,
                    y: parseFloat(e.target.value),
                  })
                }
              />
            </div>
          </div>
          <div className='space-y-2'>
            <label className='text-[10px] uppercase tracking-widest text-slate-500 font-bold'>
              End Handle
            </label>
            <div className='flex gap-2'>
              <input
                type='number'
                step='0.01'
                className='bg-[#121212] border border-slate-700 text-slate-300 text-xs rounded px-2 py-1 w-full focus:border-lime-400 outline-none'
                value={bezier.p2.x}
                onChange={(e) =>
                  updateBezier('p2', {
                    ...bezier.p2,
                    x: parseFloat(e.target.value),
                  })
                }
              />
              <input
                type='number'
                step='0.01'
                className='bg-[#121212] border border-slate-700 text-slate-300 text-xs rounded px-2 py-1 w-full focus:border-lime-400 outline-none'
                value={bezier.p2.y}
                onChange={(e) =>
                  updateBezier('p2', {
                    ...bezier.p2,
                    y: parseFloat(e.target.value),
                  })
                }
              />
            </div>
          </div>
        </div>
      )}

      {/* SPRING CONTROLS */}
      {mode === 'spring' && (
        <div className='space-y-4'>
          {/* Stiffness */}
          <div className='flex items-center gap-4'>
            <label className='w-20 text-[10px] uppercase tracking-widest text-slate-500 font-bold'>
              Stiffness
            </label>
            <input
              type='range'
              min='1'
              max='500'
              className='flex-1 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-lime-400 [&::-webkit-slider-thumb]:rounded-full'
              value={spring.stiffness}
              onChange={(e) =>
                updateSpring('stiffness', parseFloat(e.target.value))
              }
            />
            <span className='w-8 text-right text-xs text-lime-400 font-mono'>
              {spring.stiffness}
            </span>
          </div>
          {/* Damping */}
          <div className='flex items-center gap-4'>
            <label className='w-20 text-[10px] uppercase tracking-widest text-slate-500 font-bold'>
              Damping
            </label>
            <input
              type='range'
              min='1'
              max='100'
              className='flex-1 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-lime-400 [&::-webkit-slider-thumb]:rounded-full'
              value={spring.damping}
              onChange={(e) =>
                updateSpring('damping', parseFloat(e.target.value))
              }
            />
            <span className='w-8 text-right text-xs text-lime-400 font-mono'>
              {spring.damping}
            </span>
          </div>
          {/* Mass */}
          <div className='flex items-center gap-4'>
            <label className='w-20 text-[10px] uppercase tracking-widest text-slate-500 font-bold'>
              Mass
            </label>
            <input
              type='range'
              min='0.1'
              max='5'
              step='0.1'
              className='flex-1 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-lime-400 [&::-webkit-slider-thumb]:rounded-full'
              value={spring.mass}
              onChange={(e) => updateSpring('mass', parseFloat(e.target.value))}
            />
            <span className='w-8 text-right text-xs text-lime-400 font-mono'>
              {spring.mass}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
