// src/components/preview/AnimationPreview.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useEaseStore } from '@/store/useEaseStore';
import { Play, RotateCcw } from 'lucide-react';
import { clsx } from 'clsx';
import { pointsToLinear, solveSpring } from '@/core/math/spring';

export const AnimationPreview = () => {
  const { mode, bezier, duration, spring } = useEaseStore();
  const [isPlaying, setIsPlaying] = useState(false);

  const boxRef = useRef<HTMLDivElement>(null);

  // Generate the CSS string
  const cssEasing =
    mode === 'bezier'
      ? `cubic-bezier(${bezier.p1.x}, ${bezier.p1.y}, ${bezier.p2.x}, ${bezier.p2.y})`
      : `linear`;

  const handlePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      setTimeout(() => setIsPlaying(true), 50);
    } else {
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    // Optional: Auto-play on change
    // handlePlay();
  }, [bezier]);
  let activeDuration = duration;
  let activeEase = `cubic-bezier(${bezier.p1.x}, ${bezier.p1.y}, ${bezier.p2.x}, ${bezier.p2.y})`;

  if (mode === 'spring') {
    const result = solveSpring(spring.mass, spring.stiffness, spring.damping);
    activeDuration = result.duration;
    activeEase = pointsToLinear(result.points);
  }
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <h3 className='text-sm font-semibold text-slate-500 uppercase tracking-wider'>
          Preview
        </h3>
        <button
          onClick={handlePlay}
          className='flex items-center gap-2 rounded-md bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200 active:scale-95 transition-all dark:bg-slate-800 dark:text-slate-300'
        >
          {isPlaying ? <RotateCcw size={14} /> : <Play size={14} />}
          {isPlaying ? 'Replay' : 'Play'}
        </button>
      </div>

      {/* The Track */}
      <div
        className='relative h-32 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50'
        // FIX 1: Explicitly define this element as a container for 'cqw' units
        style={{ containerType: 'inline-size' }}
      >
        {/* Grid Lines */}
        <div className='absolute inset-0 flex justify-between px-4'>
          <div className='h-full w-px border-l border-dashed border-slate-200 dark:border-slate-800' />
          <div className='h-full w-px border-l border-dashed border-slate-200 dark:border-slate-800' />
          <div className='h-full w-px border-l border-dashed border-slate-200 dark:border-slate-800' />
        </div>

        {/* The Moving Object Container */}
        <div className='relative flex h-full w-full items-center px-4'>
          <div
            ref={boxRef}
            style={{
              // @ts-ignore
              '--ease': activeEase,
              '--duration': `${activeDuration}s`,
            }}
            className={clsx(
              'h-16 w-16 rounded-xl shadow-lg bg-linear-to-br from-purple-500 to-pink-600 z-10',
              // FIX 2: Adjusted Math
              // 100cqw (Container Width)
              // - 4rem (Box Width)
              // - 2rem (Padding Left + Padding Right from parent)
              // = -6rem
              isPlaying ? 'translate-x-[calc(100cqw-6rem)]' : 'translate-x-0',
              'transition-transform will-change-transform'
            )}
            onTransitionEnd={() => setIsPlaying(false)}
          />
          <style jsx>{`
            div[class*='transition-transform'] {
              transition-duration: var(--duration);
              transition-timing-function: var(--ease);
            }
          `}</style>
        </div>
      </div>
    </div>
  );
};
