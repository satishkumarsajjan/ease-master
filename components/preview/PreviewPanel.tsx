'use client';

import { pointsToLinear, solveSpring } from '@/core/math/spring';
import { useEaseStore } from '@/store/useEaseStore';
import { clsx } from 'clsx';
import {
  Eye,
  LayoutGrid,
  Maximize,
  MoveRight,
  Pause,
  Play,
  Repeat,
  RotateCcw,
  RotateCw,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

// --- HELPER: GENERIC PREVIEW BOX ---
const PreviewBox = ({
  label,
  icon: Icon,
  type,
  cssEase,
  duration,
  isPlaying,
  animKey,
  className,
}: any) => (
  <div
    className={clsx(
      'relative flex items-center justify-center overflow-hidden bg-background group border-border',
      className
    )}
  >
    {/* Label Overlay */}
    <div className='absolute top-3 left-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors z-10'>
      <Icon size={12} />
      <span>{label}</span>
    </div>

    {/* Grid Background */}
    <div
      className='absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-foreground'
      style={{
        maskImage: 'radial-gradient(circle, black 1px, transparent 1px)',
        maskSize: '16px 16px',
      }}
    />

    {/* Reference Box (Ghost) */}
    <div className='absolute h-16 w-16 rounded bg-muted/50 border border-border' />

    {/* Moving Box */}
    <div
      key={animKey}
      style={{
        animationName: `anim-${type}`,
        animationDuration: `${duration}s`,
        animationTimingFunction: cssEase,
        animationFillMode: 'forwards',
        animationPlayState: isPlaying ? 'running' : 'paused',
      }}
      className='h-16 w-16 rounded bg-primary shadow-lg shadow-primary/20'
    >
      <div className='absolute inset-0 flex items-center justify-center'>
        <div className='h-1.5 w-1.5 bg-background/30 rounded-full' />
      </div>
    </div>
  </div>
);

export const PreviewPanel = () => {
  const { mode, bezier, spring, duration, setDuration } = useEaseStore();

  // State
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLooping, setIsLooping] = useState(true);
  const [activeView, setActiveView] = useState('translate');
  const [key, setKey] = useState(0);
  const [loopDelay, setLoopDelay] = useState(500);

  // 1. Math Calculation
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
    if (!isPlaying || !isLooping) return;
    const totalTime = calculatedDuration * 1000 + loopDelay;
    const interval = setInterval(() => setKey((k) => k + 1), totalTime);
    return () => clearInterval(interval);
  }, [isPlaying, isLooping, calculatedDuration, loopDelay]);

  const handleReplay = () => {
    setIsPlaying(true);
    setKey((k) => k + 1);
  };

  // Reusable slider class
  const sliderClass =
    'flex-1 h-1.5 bg-secondary rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background transition-all hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <div className='flex h-full w-full flex-col bg-card text-card-foreground'>
      {/* --- CSS Keyframes Injection --- */}
      <style>{`
        @keyframes anim-translate { from { transform: translateX(0); } to { transform: translateX(calc(100cqw - 4rem)); } }
        @keyframes anim-scale { from { transform: scale(0.3); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes anim-opacity { from { opacity: 0; } to { opacity: 1; } }
        @keyframes anim-rotate { from { transform: rotate(-90deg) scale(0.5); opacity: 0; } to { transform: rotate(0deg) scale(1); opacity: 1; } }
        .preview-container { container-type: inline-size; }
      `}</style>

      {/* HEADER */}
      <div className='flex items-center justify-between border-b border-border p-4 bg-muted/20'>
        <div className='flex items-center gap-6'>
          <h2 className='text-sm font-bold text-primary font-mono tracking-wider hidden md:block'>
            Preview
          </h2>

          {/* View Selector */}
          <div className='flex bg-input/50 rounded-md p-0.5 border border-input'>
            {[
              { id: 'translate', icon: MoveRight, tooltip: 'Position' },
              { id: 'scale', icon: Maximize, tooltip: 'Scale' },
              { id: 'opacity', icon: Eye, tooltip: 'Opacity' },
              { id: 'rotate', icon: RotateCw, tooltip: 'Rotate' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.id);
                  handleReplay();
                }}
                title={item.tooltip}
                className={clsx(
                  'p-1.5 rounded transition-all flex items-center justify-center w-8',
                  activeView === item.id
                    ? 'bg-background text-primary shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <item.icon size={14} />
              </button>
            ))}

            <div className='w-px bg-border mx-1 my-1'></div>

            {/* "View All" Button */}
            <button
              onClick={() => {
                setActiveView('all');
                handleReplay();
              }}
              title='View Grid'
              className={clsx(
                'p-1.5 rounded transition-all flex items-center justify-center w-8',
                activeView === 'all'
                  ? 'bg-background text-primary shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <LayoutGrid size={14} />
            </button>
          </div>
        </div>

        <div className='flex gap-2'>
          <button
            onClick={() => setIsLooping(!isLooping)}
            className={clsx(
              'p-1 transition-colors',
              isLooping
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
            title='Loop'
          >
            <Repeat size={14} />
          </button>
          <button
            onClick={handleReplay}
            className='p-1 hover:text-primary text-muted-foreground transition-colors'
            title='Replay'
          >
            <RotateCcw size={14} />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className='p-1 hover:text-primary text-muted-foreground transition-colors'
            title='Play/Pause'
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>
        </div>
      </div>

      {/* --- MAIN CANVAS AREA --- */}
      <div className='flex-1 relative overflow-hidden bg-background/50 flex'>
        {/* 1. TRANSLATE TRACK */}
        <div
          className={clsx(
            'relative flex-col items-center justify-center bg-background/50 p-6 transition-all duration-300',
            activeView === 'translate'
              ? 'flex w-full h-full'
              : activeView === 'all'
              ? 'flex w-full lg:w-2/3 border-b lg:border-b-0 lg:border-r border-border'
              : 'hidden'
          )}
        >
          <div className='absolute top-3 left-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground'>
            <MoveRight size={12} />
            <span>Position</span>
          </div>

          <div
            className='absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-foreground'
            style={{
              maskImage: 'radial-gradient(circle, black 1px, transparent 1px)',
              maskSize: '40px 40px',
            }}
          />

          <div className='relative w-full h-32 flex items-center preview-container'>
            <div className='absolute left-0 h-16 w-16 rounded bg-muted/50 border border-border' />
            <div className='absolute right-0 h-16 w-16 rounded bg-muted/50 border border-border' />
            <div className='relative w-full h-full'>
              <div
                key={key}
                style={{
                  animationName: 'anim-translate',
                  animationDuration: `${calculatedDuration}s`,
                  animationTimingFunction: cssEase,
                  animationFillMode: 'forwards',
                  animationPlayState: isPlaying ? 'running' : 'paused',
                }}
                className='absolute top-1/2 -mt-8 left-0 h-16 w-16 rounded bg-primary shadow-xl shadow-primary/25'
              >
                <div className='absolute inset-0 flex items-center justify-center'>
                  <div className='h-1.5 w-1.5 bg-background/30 rounded-full' />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. SECONDARY BOXES */}
        <div
          className={clsx(
            'bg-background',
            activeView === 'all'
              ? 'flex w-full lg:w-1/3 flex-col h-full'
              : 'contents'
          )}
        >
          {/* Scale Box */}
          <PreviewBox
            label='Scale'
            icon={Maximize}
            type='scale'
            cssEase={cssEase}
            duration={calculatedDuration}
            isPlaying={isPlaying}
            animKey={key}
            className={clsx(
              activeView === 'scale'
                ? 'w-full h-full flex'
                : activeView === 'all'
                ? 'flex-1 border-b border-border'
                : 'hidden'
            )}
          />
          {/* Opacity Box */}
          <PreviewBox
            label='Opacity'
            icon={Eye}
            type='opacity'
            cssEase={cssEase}
            duration={calculatedDuration}
            isPlaying={isPlaying}
            animKey={key}
            className={clsx(
              activeView === 'opacity'
                ? 'w-full h-full flex'
                : activeView === 'all'
                ? 'flex-1 border-b border-border'
                : 'hidden'
            )}
          />
          {/* Rotate Box */}
          <PreviewBox
            label='Rotate'
            icon={RotateCw}
            type='rotate'
            cssEase={cssEase}
            duration={calculatedDuration}
            isPlaying={isPlaying}
            animKey={key}
            className={clsx(
              activeView === 'rotate'
                ? 'w-full h-full flex'
                : activeView === 'all'
                ? 'flex-1'
                : 'hidden'
            )}
          />
        </div>
      </div>

      {/* SLIDERS */}
      <div className='border-t border-border p-4 space-y-3 bg-card z-10'>
        <div className='flex items-center gap-4'>
          <label className='w-24 text-[10px] uppercase tracking-widest text-muted-foreground font-bold'>
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
            className={sliderClass}
          />
          <span className='w-12 text-right text-xs font-mono text-primary'>
            {(mode === 'spring' ? calculatedDuration : duration).toFixed(1)}s
          </span>
        </div>

        <div
          className={clsx(
            'flex items-center gap-4 transition-opacity',
            isLooping ? 'opacity-100' : 'opacity-30 pointer-events-none'
          )}
        >
          <label className='w-24 text-[10px] uppercase tracking-widest text-muted-foreground font-bold'>
            Loop Delay
          </label>
          <input
            type='range'
            min='0'
            max='2000'
            step='100'
            value={loopDelay}
            onChange={(e) => setLoopDelay(parseInt(e.target.value))}
            className={sliderClass}
          />
          <span className='w-12 text-right text-xs font-mono text-primary'>
            {loopDelay}ms
          </span>
        </div>
      </div>
    </div>
  );
};
