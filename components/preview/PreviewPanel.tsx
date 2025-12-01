'use client';

import { useState, useEffect, useMemo } from 'react';
import { useEaseStore } from '@/store/useEaseStore';
import { solveSpring, pointsToLinear } from '@/core/math/spring';
import { Play, Pause, RotateCcw, Repeat } from 'lucide-react';
import { clsx } from 'clsx';

export const PreviewPanel = () => {
  const { mode, bezier, spring, duration, setDuration } = useEaseStore();

  // Local State
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLooping, setIsLooping] = useState(true);
  const [key, setKey] = useState(0); // Key changes force a DOM reset (Replay)
  const [loopDelay, setLoopDelay] = useState(500); // ms

  // 1. Calculate the Easing String & Duration
  const { cssEase, calculatedDuration } = useMemo(() => {
    if (mode === 'bezier') {
      return {
        cssEase: `cubic-bezier(${bezier.p1.x}, ${bezier.p1.y}, ${bezier.p2.x}, ${bezier.p2.y})`,
        calculatedDuration: duration,
      };
    } else {
      const result = solveSpring(spring.mass, spring.stiffness, spring.damping);
      return {
        cssEase: pointsToLinear(result.points),
        calculatedDuration: result.duration,
      };
    }
  }, [mode, bezier, spring, duration]);

  // 2. Loop Logic
  useEffect(() => {
    // If paused or loop disabled, do nothing
    if (!isPlaying || !isLooping) return;

    const totalTime = calculatedDuration * 1000 + loopDelay;

    const interval = setInterval(() => {
      // Increment key to destroy and recreate the animating element
      setKey((k) => k + 1);
    }, totalTime);

    return () => clearInterval(interval);
  }, [isPlaying, isLooping, calculatedDuration, loopDelay]);

  // 3. Manual Replay Logic
  const handleReplay = () => {
    setIsPlaying(true);
    setKey((k) => k + 1);
  };

  return (
    <div className='flex h-full w-full flex-col bg-[#1e1e1e] text-white'>
      {/* --- CSS INJECTION --- */}
      {/* We inject standard CSS for the animation keyframes. 
          This avoids styled-jsx nesting issues. */}
      <style>{`
        @keyframes slideRight {
          from { transform: translateX(0); }
          to { transform: translateX(calc(100cqw - 4rem)); }
        }
        .preview-container {
          container-type: inline-size;
        }
      `}</style>

      {/* HEADER */}
      <div className='flex items-center justify-between border-b border-slate-800 p-4'>
        <h2 className='text-sm font-bold text-lime-400 font-mono tracking-wider'>
          Preview
        </h2>
        <div className='flex gap-2'>
          <button
            onClick={() => setIsLooping(!isLooping)}
            className={clsx(
              'p-1 transition-colors',
              isLooping
                ? 'text-lime-400'
                : 'text-slate-500 hover:text-slate-300'
            )}
            title={isLooping ? 'Disable Loop' : 'Enable Loop'}
          >
            <Repeat size={14} />
          </button>
          <button
            onClick={handleReplay}
            className='p-1 hover:text-lime-400 text-slate-400 transition-colors'
            title='Replay'
          >
            <RotateCcw size={14} />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className='p-1 hover:text-lime-400 text-slate-400 transition-colors'
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>
        </div>
      </div>

      {/* CANVAS */}
      <div className='flex-1 relative overflow-hidden bg-[#151515] p-8 flex items-center justify-center'>
        {/* Background Grid */}
        <div
          className='absolute inset-0 opacity-10'
          style={{
            backgroundImage:
              'linear-gradient(#444 1px, transparent 1px), linear-gradient(90deg, #444 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Animation Track */}
        <div className='relative w-full h-32 flex items-center preview-container'>
          {/* Ghost Boxes (Start/End Markers) */}
          <div className='absolute left-0 h-16 w-16 rounded bg-slate-800/30 border border-slate-700/50' />
          <div className='absolute right-0 h-16 w-16 rounded bg-slate-800/30 border border-slate-700/50' />

          {/* THE MOVING BOX */}
          <div className='relative w-full h-full'>
            <div
              key={key} // Forces React to unmount/remount this div, resetting animation to 0%
              style={{
                animationName: 'slideRight',
                animationDuration: `${calculatedDuration}s`,
                animationTimingFunction: cssEase,
                animationFillMode: 'forwards', // Keeps box at the end when done
                animationPlayState: isPlaying ? 'running' : 'paused',
              }}
              className='absolute top-1/2 -mt-8 h-16 w-16 rounded bg-lime-500 shadow-[0_0_20px_rgba(132,204,22,0.3)]'
            >
              <div className='absolute inset-0 flex items-center justify-center'>
                <div className='h-1 w-1 bg-black/20 rounded-full'></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SLIDERS */}
      <div className='border-t border-slate-800 p-6 space-y-4 bg-[#1e1e1e]'>
        {/* Duration */}
        <div className='flex items-center gap-4'>
          <label className='w-24 text-[10px] uppercase tracking-widest text-slate-500 font-bold'>
            Duration
          </label>
          <input
            type='range'
            min='0.1'
            max='5'
            step='0.1'
            disabled={mode === 'spring'}
            value={mode === 'spring' ? calculatedDuration : duration}
            onChange={(e) => setDuration(parseFloat(e.target.value))}
            className={clsx(
              'flex-1 h-1 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full',
              mode === 'spring'
                ? 'bg-slate-800 [&::-webkit-slider-thumb]:bg-slate-600 cursor-not-allowed'
                : 'bg-slate-700 [&::-webkit-slider-thumb]:bg-lime-400'
            )}
          />
          <span className='w-12 text-right text-xs font-mono text-slate-300'>
            {(mode === 'spring' ? calculatedDuration : duration).toFixed(1)}s
          </span>
        </div>

        {/* Loop Delay */}
        <div
          className={clsx(
            'flex items-center gap-4 transition-opacity',
            isLooping ? 'opacity-100' : 'opacity-30 pointer-events-none'
          )}
        >
          <label className='w-24 text-[10px] uppercase tracking-widest text-slate-500 font-bold'>
            Loop Delay
          </label>
          <input
            type='range'
            min='0'
            max='2000'
            step='100'
            value={loopDelay}
            onChange={(e) => setLoopDelay(parseInt(e.target.value))}
            className='flex-1 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-lime-400 [&::-webkit-slider-thumb]:rounded-full'
          />
          <span className='w-12 text-right text-xs font-mono text-slate-300'>
            {loopDelay}ms
          </span>
        </div>
      </div>
    </div>
  );
};
