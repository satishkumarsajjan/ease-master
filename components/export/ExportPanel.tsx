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

  // Helper to format numbers
  const f = (n: number) => n.toFixed(3).replace(/\.?0+$/, '');

  // 1. Calculate Real Physics & Generate Strings
  const { cssCode, tailwindCode, motionCode, gsapCode, calculatedDuration } =
    useMemo(() => {
      let duration = state.duration;
      let timingFunc = '';
      let gsapEase = '';
      let springProps = '';

      if (state.mode === 'bezier') {
        duration = state.duration;
        const { p1, p2 } = state.bezier;
        timingFunc = `cubic-bezier(${f(p1.x)}, ${f(p1.y)}, ${f(p2.x)}, ${f(
          p2.y
        )})`;
        gsapEase = `"cubic-bezier(${f(p1.x)},${f(p1.y)},${f(p2.x)},${f(
          p2.y
        )})"`;
      } else {
        const result = solveSpring(
          state.spring.mass,
          state.spring.stiffness,
          state.spring.damping
        );
        duration = result.duration;
        timingFunc = pointsToLinear(result.points);

        const pathData = result.points
          .map((y, i) => {
            const x = i / (result.points.length - 1);
            return `${x === 0 ? 'M' : 'L'}${f(x)},${f(y)}`;
          })
          .join(' ');
        gsapEase = `CustomEase.create("custom", "${pathData}")`;

        springProps = `
  type: "spring",
  stiffness: ${state.spring.stiffness},
  damping: ${state.spring.damping},
  mass: ${state.spring.mass}`;
      }

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

  // 2. Select Active Code
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

  // --- RENDERERS ---
  // Using semantic theme colors:
  // chart-1: Yellow/Orangeish (Values)
  // chart-2: Greenish (Strings)
  // chart-4: Purpleish (Selectors/Tags)
  // chart-5: Blueish (Properties)
  // primary: Key functions (cubic-bezier, linear)
  // muted-foreground: Punctuation

  return (
    <div className='flex h-full w-full flex-col bg-sidebar border-t border-sidebar-border'>
      {/* HEADER */}
      <div className='flex flex-col gap-2 p-4 pb-0'>
        <div className='flex items-center justify-between'>
          <h2 className='text-sm font-bold text-primary font-mono tracking-wider mb-2'>
            Export Code
          </h2>
        </div>
        <div className='grid grid-cols-4 gap-1 rounded-lg bg-sidebar-accent/50 p-1 border border-sidebar-border'>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                'py-1.5 text-[10px] font-bold rounded uppercase tracking-wider transition-all',
                activeTab === tab.id
                  ? 'bg-sidebar text-primary shadow-sm ring-1 ring-sidebar-border'
                  : 'text-muted-foreground hover:text-foreground hover:bg-sidebar-accent'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* CODE BLOCK */}
      <div className='flex-1 p-4 relative group'>
        <div className='h-full w-full rounded-lg bg-muted/30 border border-sidebar-border p-4 font-mono text-xs leading-5 overflow-auto custom-scrollbar whitespace-pre text-sidebar-foreground'>
          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className={clsx(
              'absolute top-6 right-6 p-2 rounded-md transition-all shadow-sm border z-10 backdrop-blur-sm',
              copied
                ? 'bg-primary/10 text-primary border-primary/20'
                : 'bg-background/80 text-muted-foreground hover:text-foreground border-sidebar-border opacity-0 group-hover:opacity-100'
            )}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>

          {/* CSS */}
          {activeTab === 'css' && (
            <div>
              <span className='text-chart-4'>.ease-element</span>{' '}
              <span className='text-muted-foreground'>{`{`}</span>
              <br />
              <span className='pl-4 text-chart-5'>transition</span>
              <span className='text-muted-foreground'>:</span>{' '}
              <span className='text-chart-3'>all</span>{' '}
              <span className='text-chart-1'>{calculatedDuration}s</span>;
              <br />
              <span className='pl-4 text-chart-5'>
                transition-timing-function
              </span>
              <span className='text-muted-foreground'>:</span>{' '}
              <span className='text-primary text-wrap break-all'>
                {state.mode === 'bezier'
                  ? `cubic-bezier(${f(state.bezier.p1.x)}, ${f(
                      state.bezier.p1.y
                    )}, ${f(state.bezier.p2.x)}, ${f(state.bezier.p2.y)})`
                  : cssCode.match(/linear\(.*\)/)?.[0]}
              </span>
              ;<br />
              <span className='text-muted-foreground'>{`}`}</span>
            </div>
          )}

          {/* TAILWIND */}
          {activeTab === 'tailwind' && (
            <div>
              <span className='text-muted-foreground'>{`<`}</span>
              <span className='text-chart-4'>div</span>{' '}
              <span className='text-chart-5'>className</span>
              <span className='text-muted-foreground'>=</span>
              <span className='text-chart-2'>"</span>
              <br />
              <span className='pl-4 text-chart-3'>transition-all</span>
              <br />
              <span className='pl-4 text-chart-3'>
                duration-[{Math.round(calculatedDuration * 1000)}ms]
              </span>
              <br />
              <span className='pl-4 text-primary text-wrap break-all'>
                ease-[
                {state.mode === 'bezier'
                  ? `cubic-bezier(${f(state.bezier.p1.x)},${f(
                      state.bezier.p1.y
                    )},${f(state.bezier.p2.x)},${f(state.bezier.p2.y)})`
                  : cssCode.match(/linear\(.*\)/)?.[0].replace(/, /g, ',')}
                ]
              </span>
              <br />
              <span className='text-chart-2'>"</span>
              <span className='text-muted-foreground'>/{`>`}</span>
            </div>
          )}

          {/* MOTION */}
          {activeTab === 'motion' && (
            <div>
              <span className='text-muted-foreground'>{`<`}</span>
              <span className='text-chart-4'>motion.div</span>
              <br />
              <span className='pl-4 text-chart-5'>initial</span>
              <span className='text-muted-foreground'>=</span>
              <span className='text-muted-foreground'>{`{{`}</span>{' '}
              <span className='text-chart-5'>opacity</span>
              <span className='text-muted-foreground'>:</span>{' '}
              <span className='text-chart-1'>0</span>{' '}
              <span className='text-muted-foreground'>{`}}`}</span>
              <br />
              <span className='pl-4 text-chart-5'>animate</span>
              <span className='text-muted-foreground'>=</span>
              <span className='text-muted-foreground'>{`{{`}</span>{' '}
              <span className='text-chart-5'>opacity</span>
              <span className='text-muted-foreground'>:</span>{' '}
              <span className='text-chart-1'>1</span>{' '}
              <span className='text-muted-foreground'>{`}}`}</span>
              <br />
              <span className='pl-4 text-chart-5'>transition</span>
              <span className='text-muted-foreground'>=</span>
              <span className='text-muted-foreground'>{`{{`}</span>
              <br />
              {state.mode === 'bezier' ? (
                <>
                  <span className='pl-8 text-chart-5'>duration</span>
                  <span className='text-muted-foreground'>:</span>{' '}
                  <span className='text-chart-1'>{state.duration}</span>,
                  <br />
                  <span className='pl-8 text-chart-5'>ease</span>
                  <span className='text-muted-foreground'>:</span> [
                  <span className='text-chart-1'>{f(state.bezier.p1.x)}</span>,{' '}
                  <span className='text-chart-1'>{f(state.bezier.p1.y)}</span>,{' '}
                  <span className='text-chart-1'>{f(state.bezier.p2.x)}</span>,{' '}
                  <span className='text-chart-1'>{f(state.bezier.p2.y)}</span>]
                </>
              ) : (
                <>
                  <span className='pl-8 text-chart-5'>type</span>
                  <span className='text-muted-foreground'>:</span>{' '}
                  <span className='text-chart-2'>"spring"</span>,<br />
                  <span className='pl-8 text-chart-5'>stiffness</span>
                  <span className='text-muted-foreground'>:</span>{' '}
                  <span className='text-chart-1'>{state.spring.stiffness}</span>
                  ,
                  <br />
                  <span className='pl-8 text-chart-5'>damping</span>
                  <span className='text-muted-foreground'>:</span>{' '}
                  <span className='text-chart-1'>{state.spring.damping}</span>,
                  <br />
                  <span className='pl-8 text-chart-5'>mass</span>
                  <span className='text-muted-foreground'>:</span>{' '}
                  <span className='text-chart-1'>{state.spring.mass}</span>
                </>
              )}
              <br />
              <span className='pl-4 text-muted-foreground'>{`}}`}</span>
              <br />
              <span className='text-muted-foreground'>/{`>`}</span>
            </div>
          )}

          {/* GSAP */}
          {activeTab === 'gsap' && (
            <div>
              <span className='text-muted-foreground'>
                // Requires CustomEase Plugin
              </span>
              <br />
              <span className='text-chart-4'>gsap</span>.
              <span className='text-chart-5'>registerPlugin</span>(
              <span className='text-chart-3'>CustomEase</span>);
              <br />
              <br />
              <span className='text-chart-4'>gsap</span>.
              <span className='text-chart-5'>to</span>(
              <span className='text-chart-2'>".element"</span>,{' '}
              <span className='text-muted-foreground'>{`{`}</span>
              <br />
              <span className='pl-4 text-chart-5'>duration</span>
              <span className='text-muted-foreground'>:</span>{' '}
              <span className='text-chart-1'>{calculatedDuration}</span>,
              <br />
              <span className='pl-4 text-chart-5'>ease</span>
              <span className='text-muted-foreground'>:</span>{' '}
              <span className='text-primary text-wrap break-all'>
                {gsapCode.match(/ease: (.*)/)?.[1]}
              </span>
              <br />
              <span className='text-muted-foreground'>{`});`}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
