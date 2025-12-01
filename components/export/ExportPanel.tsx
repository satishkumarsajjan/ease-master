'use client';

import { useState, useMemo } from 'react';
import { useEaseStore } from '@/store/useEaseStore';
import { solveSpring, pointsToLinear } from '@/core/math/spring';
import { ExportTarget } from '@/core/types';
import { Copy, Check } from 'lucide-react';
import { clsx } from 'clsx';

const TABS: { id: ExportTarget; label: string }[] = [
  { id: 'css', label: 'CSS' },
  { id: 'tailwind', label: 'Tailwind' },
  { id: 'motion', label: 'Motion' },
  { id: 'gsap', label: 'GSAP' },
];

export const ExportPanel = () => {
  const state = useEaseStore();
  const [activeTab, setActiveTab] = useState<ExportTarget>('css');
  const [copied, setCopied] = useState(false);

  // Helper to format numbers (0.33333 -> 0.333)
  const f = (n: number) => n.toFixed(3).replace(/\.?0+$/, '');

  // 1. Calculate Real Physics & Generate Strings
  const { cssCode, tailwindCode, motionCode, gsapCode, calculatedDuration } =
    useMemo(() => {
      let duration = state.duration;
      let timingFunc = '';
      let gsapEase = '';
      let springProps = ''; // For Framer Motion

      if (state.mode === 'bezier') {
        // BEZIER LOGIC
        duration = state.duration;
        const { p1, p2 } = state.bezier;
        timingFunc = `cubic-bezier(${f(p1.x)}, ${f(p1.y)}, ${f(p2.x)}, ${f(
          p2.y
        )})`;
        gsapEase = `"cubic-bezier(${f(p1.x)},${f(p1.y)},${f(p2.x)},${f(
          p2.y
        )})"`;
      } else {
        // SPRING LOGIC
        const result = solveSpring(
          state.spring.mass,
          state.spring.stiffness,
          state.spring.damping
        );
        duration = result.duration;

        // CSS Linear()
        timingFunc = pointsToLinear(result.points);

        // GSAP CustomEase Path (M0,0 L...)
        const pathData = result.points
          .map((y, i) => {
            const x = i / (result.points.length - 1);
            return `${x === 0 ? 'M' : 'L'}${f(x)},${f(y)}`;
          })
          .join(' ');
        gsapEase = `CustomEase.create("custom", "${pathData}")`;

        // Framer Motion Object
        springProps = `
  type: "spring",
  stiffness: ${state.spring.stiffness},
  damping: ${state.spring.damping},
  mass: ${state.spring.mass}`;
      }

      // --- GENERATE FINAL STRINGS ---

      const css = `.ease-element {
  transition: all ${duration}s;
  transition-timing-function: ${timingFunc};
}`;

      const tailwind = `<div className="
  transition-all
  duration-[${Math.round(duration * 1000)}ms]
  ease-[${timingFunc.replace(/, /g, ',')}]
" />`;

      const motion = `<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{${
    state.mode === 'bezier'
      ? `
    duration: ${duration},
    ease: [${f(state.bezier.p1.x)}, ${f(state.bezier.p1.y)}, ${f(
          state.bezier.p2.x
        )}, ${f(state.bezier.p2.y)}]`
      : springProps
  }
  }}
/>`;

      const gsap = `gsap.registerPlugin(CustomEase);\n
gsap.to(".element", {
  duration: ${duration},
  ease: ${gsapEase}
});`;

      return {
        cssCode: css,
        tailwindCode: tailwind,
        motionCode: motion,
        gsapCode: gsap,
        calculatedDuration: duration,
      };
    }, [state.mode, state.bezier, state.spring, state.duration]);

  // 2. Select Active Code for Clipboard
  const getActiveCode = () => {
    switch (activeTab) {
      case 'css':
        return cssCode;
      case 'tailwind':
        return tailwindCode;
      case 'motion':
        return motionCode;
      case 'gsap':
        return gsapCode;
      default:
        return '';
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(getActiveCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // --- RENDERERS (JSX Display) ---

  return (
    <div className='flex h-full w-full flex-col bg-[#181818] border-t border-slate-800'>
      {/* HEADER */}
      <div className='flex flex-col gap-2 p-4 pb-0'>
        <div className='flex items-center justify-between'>
          <h2 className='text-sm font-bold text-lime-400 font-mono tracking-wider mb-2'>
            Export Code
          </h2>
        </div>
        <div className='grid grid-cols-4 gap-1 rounded-lg bg-[#0a0a0a] p-1 border border-slate-800'>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                'py-1.5 text-[10px] font-bold rounded uppercase tracking-wider transition-all',
                activeTab === tab.id
                  ? 'bg-slate-800 text-lime-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* CODE BLOCK */}
      <div className='flex-1 p-4 relative group'>
        <div className='h-full w-full rounded-lg bg-[#0a0a0a] border border-slate-800 p-4 font-mono text-xs leading-5 overflow-auto custom-scrollbar whitespace-pre'>
          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className={clsx(
              'absolute top-6 right-6 p-2 rounded-md transition-all shadow-lg border border-slate-700 backdrop-blur-sm z-10',
              copied
                ? 'bg-lime-500/20 text-lime-400 border-lime-500/50'
                : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 opacity-0 group-hover:opacity-100'
            )}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>

          {/* Syntax Highlighted Output */}
          {activeTab === 'css' && (
            <div>
              <span className='text-purple-400'>.ease-element</span>{' '}
              <span className='text-slate-500'>{`{`}</span>
              <br />
              <span className='pl-4 text-blue-400'>transition</span>
              <span className='text-slate-500'>:</span>{' '}
              <span className='text-orange-300'>all</span>{' '}
              <span className='text-yellow-300'>{calculatedDuration}s</span>;
              <br />
              <span className='pl-4 text-blue-400'>
                transition-timing-function
              </span>
              <span className='text-slate-500'>:</span>{' '}
              <span className='text-lime-400 text-wrap break-all'>
                {state.mode === 'bezier'
                  ? `cubic-bezier(${f(state.bezier.p1.x)}, ${f(
                      state.bezier.p1.y
                    )}, ${f(state.bezier.p2.x)}, ${f(state.bezier.p2.y)})`
                  : cssCode.match(/linear\(.*\)/)?.[0]}
              </span>
              ;<br />
              <span className='text-slate-500'>{`}`}</span>
            </div>
          )}

          {activeTab === 'tailwind' && (
            <div>
              <span className='text-slate-500'>{`<`}</span>
              <span className='text-purple-400'>div</span>{' '}
              <span className='text-blue-400'>className</span>
              <span className='text-slate-500'>=</span>
              <span className='text-green-300'>"</span>
              <br />
              <span className='pl-4 text-orange-300'>transition-all</span>
              <br />
              <span className='pl-4 text-orange-300'>
                duration-[{Math.round(calculatedDuration * 1000)}ms]
              </span>
              <br />
              <span className='pl-4 text-lime-400 text-wrap break-all'>
                ease-[
                {state.mode === 'bezier'
                  ? `cubic-bezier(${f(state.bezier.p1.x)},${f(
                      state.bezier.p1.y
                    )},${f(state.bezier.p2.x)},${f(state.bezier.p2.y)})`
                  : cssCode.match(/linear\(.*\)/)?.[0].replace(/, /g, ',')}
                ]
              </span>
              <br />
              <span className='text-green-300'>"</span>
              <span className='text-slate-500'>/{`>`}</span>
            </div>
          )}

          {activeTab === 'motion' && (
            // We can just render the raw string logic wrapped in spans for simplicity
            // or split it like before. Here we use the pre-calced string logic re-applied:
            <div>
              <span className='text-slate-500'>{`<`}</span>
              <span className='text-purple-400'>motion.div</span>
              <br />
              <span className='pl-4 text-blue-400'>initial</span>
              <span className='text-slate-500'>=</span>
              <span className='text-slate-300'>{`{{`}</span>{' '}
              <span className='text-blue-300'>opacity</span>
              <span className='text-slate-500'>:</span>{' '}
              <span className='text-orange-300'>0</span>{' '}
              <span className='text-slate-300'>{`}}`}</span>
              <br />
              <span className='pl-4 text-blue-400'>animate</span>
              <span className='text-slate-500'>=</span>
              <span className='text-slate-300'>{`{{`}</span>{' '}
              <span className='text-blue-300'>opacity</span>
              <span className='text-slate-500'>:</span>{' '}
              <span className='text-orange-300'>1</span>{' '}
              <span className='text-slate-300'>{`}}`}</span>
              <br />
              <span className='pl-4 text-blue-400'>transition</span>
              <span className='text-slate-500'>=</span>
              <span className='text-slate-300'>{`{{`}</span>
              <br />
              {state.mode === 'bezier' ? (
                <>
                  <span className='pl-8 text-blue-300'>duration</span>
                  <span className='text-slate-500'>:</span>{' '}
                  <span className='text-orange-300'>{state.duration}</span>,
                  <br />
                  <span className='pl-8 text-blue-300'>ease</span>
                  <span className='text-slate-500'>:</span> [
                  <span className='text-orange-300'>
                    {f(state.bezier.p1.x)}
                  </span>
                  ,{' '}
                  <span className='text-orange-300'>
                    {f(state.bezier.p1.y)}
                  </span>
                  ,{' '}
                  <span className='text-orange-300'>
                    {f(state.bezier.p2.x)}
                  </span>
                  ,{' '}
                  <span className='text-orange-300'>
                    {f(state.bezier.p2.y)}
                  </span>
                  ]
                </>
              ) : (
                <>
                  <span className='pl-8 text-blue-300'>type</span>
                  <span className='text-slate-500'>:</span>{' '}
                  <span className='text-green-300'>"spring"</span>,<br />
                  <span className='pl-8 text-blue-300'>stiffness</span>
                  <span className='text-slate-500'>:</span>{' '}
                  <span className='text-orange-300'>
                    {state.spring.stiffness}
                  </span>
                  ,<br />
                  <span className='pl-8 text-blue-300'>damping</span>
                  <span className='text-slate-500'>:</span>{' '}
                  <span className='text-orange-300'>
                    {state.spring.damping}
                  </span>
                  ,<br />
                  <span className='pl-8 text-blue-300'>mass</span>
                  <span className='text-slate-500'>:</span>{' '}
                  <span className='text-orange-300'>{state.spring.mass}</span>
                </>
              )}
              <br />
              <span className='pl-4 text-slate-300'>{`}}`}</span>
              <br />
              <span className='text-slate-500'>/{`>`}</span>
            </div>
          )}

          {activeTab === 'gsap' && (
            <div>
              <span className='text-slate-500'>
                // Requires CustomEase Plugin
              </span>
              <br />
              <span className='text-purple-400'>gsap</span>.
              <span className='text-blue-300'>registerPlugin</span>(
              <span className='text-orange-300'>CustomEase</span>);
              <br />
              <br />
              <span className='text-purple-400'>gsap</span>.
              <span className='text-blue-300'>to</span>(
              <span className='text-green-300'>".element"</span>,{' '}
              <span className='text-slate-300'>{`{`}</span>
              <br />
              <span className='pl-4 text-blue-300'>duration</span>
              <span className='text-slate-500'>:</span>{' '}
              <span className='text-orange-300'>{calculatedDuration}</span>,
              <br />
              <span className='pl-4 text-blue-300'>ease</span>
              <span className='text-slate-500'>:</span>{' '}
              <span className='text-lime-400 text-wrap break-all'>
                {gsapCode.match(/ease: (.*)/)?.[1]}
              </span>
              <br />
              <span className='text-slate-300'>{`});`}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
