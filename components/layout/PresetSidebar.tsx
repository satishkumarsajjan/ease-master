'use client';

import { useEaseStore } from '@/store/useEaseStore';
import { BEZIER_PRESETS, SPRING_PRESETS } from '@/core/presets';
import { MiniGraph } from '@/components/ui/mini-graph';
import { ScrollArea } from '@/components/ui/scroll-area';
import { clsx } from 'clsx';

export const PresetSidebar = () => {
  const { mode, bezier, spring, setMode, setBezierConfig, setSpringConfig } =
    useEaseStore();

  // Helper to check if a preset is currently active
  const isActive = (id: string, currentMode: 'bezier' | 'spring') => {
    if (mode !== currentMode) return false;
    // In a real app, we might compare values, but checking ID logic would require storing ID in store.
    // For now, we will just let the user click.
    // (Optimization: You could add 'selectedPresetId' to your store later)
    return false;
  };

  return (
    <div className='flex h-full w-full flex-col border-r border-slate-800 bg-[#1e1e1e] text-white'>
      <ScrollArea className='h-full w-full'>
        <div className='flex flex-col gap-8 p-4'>
          {/* GROUP 1: SPRINGS */}
          <div>
            <h3 className='mb-4 text-xs font-bold uppercase tracking-widest text-slate-500'>
              Springs
            </h3>
            <div className='grid grid-cols-4 gap-2'>
              {SPRING_PRESETS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setMode('spring');
                    setSpringConfig(item.value);
                  }}
                  className={clsx(
                    'group flex flex-col items-center gap-2 rounded-md p-2 transition-all hover:bg-slate-800',
                    // Simple active state check: if mode is spring and stiffness matches (naive check)
                    mode === 'spring' &&
                      spring.stiffness === item.value.stiffness &&
                      spring.damping === item.value.damping
                      ? 'bg-slate-800 ring-1 ring-lime-400'
                      : 'bg-transparent'
                  )}
                >
                  <div className='relative h-12 w-12 opacity-80 transition-opacity group-hover:opacity-100'>
                    <MiniGraph
                      mode='spring'
                      spring={item.value}
                      className={clsx(
                        'h-full w-full stroke-2',
                        // Use the orange color from the image for springs
                        'stroke-orange-400'
                      )}
                    />
                  </div>
                  <span className='text-[10px] font-medium text-slate-400 group-hover:text-white truncate w-full text-center'>
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* GROUP 2: BEZIERS */}
          <div>
            <h3 className='mb-4 text-xs font-bold uppercase tracking-widest text-slate-500'>
              Beziers & Powers
            </h3>
            <div className='grid grid-cols-4 gap-2'>
              {BEZIER_PRESETS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setMode('bezier');
                    setBezierConfig(item.value);
                  }}
                  className={clsx(
                    'group flex flex-col items-center gap-2 rounded-md p-2 transition-all hover:bg-slate-800',
                    mode === 'bezier' &&
                      bezier.p1.x === item.value.p1.x &&
                      bezier.p2.x === item.value.p2.x
                      ? 'bg-slate-800 ring-1 ring-lime-400'
                      : 'bg-transparent'
                  )}
                >
                  <div className='relative h-12 w-12 opacity-80 transition-opacity group-hover:opacity-100'>
                    <MiniGraph
                      mode='bezier'
                      bezier={item.value}
                      className={clsx(
                        'h-full w-full stroke-2',
                        // Use the lime/green color from the image for beziers
                        'stroke-lime-400'
                      )}
                    />
                  </div>
                  <span className='text-[10px] font-medium text-slate-400 group-hover:text-white truncate w-full text-center'>
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
