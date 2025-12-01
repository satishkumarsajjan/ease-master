'use client';

import { useEaseStore } from '@/store/useEaseStore';
import { ModeSwitcher } from './ModeSwitcher';
import { BezierControls } from './BezierControls';
import { SpringControls } from './SpringControls';
import { PresetSelector } from './PresetSelector';
import { CodeExport } from './CodeExport';

export const RightPanel = () => {
  const { mode } = useEaseStore();

  return (
    <div className='flex flex-col gap-6'>
      {/* Top Section: Configuration Card */}
      <div className='rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900'>
        {/* 1. Mode Selection (Tabs) */}
        <ModeSwitcher />

        {/* Divider */}
        <div className='my-6 h-px w-full bg-slate-100 dark:bg-slate-800' />

        {/* 2. Presets Library */}
        <PresetSelector />

        {/* Divider */}
        <div className='my-6 h-px w-full bg-slate-100 dark:bg-slate-800' />

        {/* 3. Fine-Tuning Controls (Inputs/Sliders) */}
        {/* We add a small key-based animation to make the switch feel organic */}
        <div key={mode} className='animate-in fade-in zoom-in-95 duration-200'>
          {mode === 'bezier' ? <BezierControls /> : <SpringControls />}
        </div>

        {/* Footer: Engine Status */}
        <div className='mt-8 border-t border-slate-100 pt-6 text-center dark:border-slate-800'>
          <p className='text-[10px] font-medium text-slate-400 uppercase tracking-widest'>
            {mode === 'bezier'
              ? 'Cubic Bezier Generator'
              : 'Spring Physics Engine (Linear Approximation)'}
          </p>
        </div>
      </div>

      {/* Bottom Section: Code Export */}
      <CodeExport />
    </div>
  );
};
