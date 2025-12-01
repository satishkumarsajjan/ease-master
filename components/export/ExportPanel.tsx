'use client';

import { useState } from 'react';
import { useEaseStore } from '@/store/useEaseStore';
import { generateCode } from '@/core/strategies/generator';
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

  // Get raw string for Clipboard
  const rawCode = generateCode(activeTab, state);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(rawCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to format numbers for display
  const f = (n: number) => n.toFixed(3).replace(/\.?0+$/, '');

  // --- SYNTAX HIGHLIGHTING RENDERERS ---

  const renderCSS = () => (
    <div>
      <span className='text-purple-400'>.ease-element</span>{' '}
      <span className='text-slate-500'>{`{`}</span>
      <br />
      <span className='pl-4 text-blue-400'>transition</span>
      <span className='text-slate-500'>:</span>{' '}
      <span className='text-orange-300'>all</span>{' '}
      <span className='text-yellow-300'>
        {state.mode === 'spring' ? '1.5s' : state.duration + 's'}
      </span>
      ;<br />
      {state.mode === 'bezier' ? (
        <>
          <span className='pl-4 text-blue-400'>transition-timing-function</span>
          <span className='text-slate-500'>:</span>{' '}
          <span className='text-lime-400'>cubic-bezier</span>(
          <span className='text-orange-300'>{f(state.bezier.p1.x)}</span>,{' '}
          <span className='text-orange-300'>{f(state.bezier.p1.y)}</span>,{' '}
          <span className='text-orange-300'>{f(state.bezier.p2.x)}</span>,{' '}
          <span className='text-orange-300'>{f(state.bezier.p2.y)}</span>);
        </>
      ) : (
        <>
          <span className='pl-4 text-slate-500'>
            /* Linear Approximation */
          </span>
          <br />
          <span className='pl-4 text-blue-400'>transition-timing-function</span>
          <span className='text-slate-500'>:</span>{' '}
          <span className='text-lime-400'>linear</span>(...);
        </>
      )}
      <br />
      <span className='text-slate-500'>{`}`}</span>
    </div>
  );

  const renderTailwind = () => (
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
        duration-[{state.mode === 'spring' ? '1500' : state.duration * 1000}ms]
      </span>
      <br />
      {state.mode === 'bezier' ? (
        <span className='pl-4 text-lime-400'>
          ease-[cubic-bezier({f(state.bezier.p1.x)},{f(state.bezier.p1.y)},
          {f(state.bezier.p2.x)},{f(state.bezier.p2.y)})]
        </span>
      ) : (
        <span className='pl-4 text-lime-400'>ease-[linear(...)]</span>
      )}
      <br />
      <span className='text-green-300'>"</span>
      <span className='text-slate-500'>/{`>`}</span>
    </div>
  );

  const renderMotion = () => (
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
          <span className='text-orange-300'>{state.duration}</span>,<br />
          <span className='pl-8 text-blue-300'>ease</span>
          <span className='text-slate-500'>:</span> [
          <span className='text-orange-300'>{f(state.bezier.p1.x)}</span>,{' '}
          <span className='text-orange-300'>{f(state.bezier.p1.y)}</span>,{' '}
          <span className='text-orange-300'>{f(state.bezier.p2.x)}</span>,{' '}
          <span className='text-orange-300'>{f(state.bezier.p2.y)}</span>]
        </>
      ) : (
        <>
          <span className='pl-8 text-blue-300'>type</span>
          <span className='text-slate-500'>:</span>{' '}
          <span className='text-green-300'>"spring"</span>,<br />
          <span className='pl-8 text-blue-300'>stiffness</span>
          <span className='text-slate-500'>:</span>{' '}
          <span className='text-orange-300'>{state.spring.stiffness}</span>,
          <br />
          <span className='pl-8 text-blue-300'>damping</span>
          <span className='text-slate-500'>:</span>{' '}
          <span className='text-orange-300'>{state.spring.damping}</span>,<br />
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
  );

  const renderGSAP = () => (
    <div>
      <span className='text-purple-400'>gsap</span>.
      <span className='text-blue-300'>to</span>(
      <span className='text-green-300'>".element"</span>,{' '}
      <span className='text-slate-300'>{`{`}</span>
      <br />
      <span className='pl-4 text-blue-300'>duration</span>
      <span className='text-slate-500'>:</span>{' '}
      <span className='text-orange-300'>
        {state.mode === 'spring' ? '1.5' : state.duration}
      </span>
      ,<br />
      {state.mode === 'bezier' ? (
        <>
          <span className='pl-4 text-blue-300'>ease</span>
          <span className='text-slate-500'>:</span>{' '}
          <span className='text-green-300'>
            "cubic-bezier({f(state.bezier.p1.x)},{f(state.bezier.p1.y)},
            {f(state.bezier.p2.x)},{f(state.bezier.p2.y)})"
          </span>
        </>
      ) : (
        <>
          <span className='pl-4 text-blue-300'>ease</span>
          <span className='text-slate-500'>:</span>{' '}
          <span className='text-green-300'>
            "elastic.out({state.spring.mass}, 0.3)"
          </span>
        </>
      )}
      <br />
      <span className='text-slate-300'>{`});`}</span>
    </div>
  );

  return (
    <div className='flex h-full w-full flex-col bg-[#181818] border-t border-slate-800'>
      {/* HEADER WITH 4 TABS */}
      <div className='flex flex-col gap-2 p-4 pb-0'>
        <h2 className='text-sm font-bold text-lime-400 font-mono tracking-wider mb-2'>
          Export Code
        </h2>
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

      {/* CODE DISPLAY AREA */}
      <div className='flex-1 p-4 relative group'>
        <div className='h-full w-full rounded-lg bg-[#0a0a0a] border border-slate-800 p-4 font-mono text-xs leading-5 overflow-auto custom-scrollbar'>
          {/* Floating Copy Button */}
          <button
            onClick={handleCopy}
            className={clsx(
              'absolute top-6 right-6 p-2 rounded-md transition-all shadow-lg border border-slate-700 backdrop-blur-sm',
              copied
                ? 'bg-lime-500/20 text-lime-400 border-lime-500/50'
                : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 opacity-0 group-hover:opacity-100'
            )}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>

          {/* Conditional Rendering based on Tab */}
          {activeTab === 'css' && renderCSS()}
          {activeTab === 'tailwind' && renderTailwind()}
          {activeTab === 'motion' && renderMotion()}
          {activeTab === 'gsap' && renderGSAP()}
        </div>
      </div>
    </div>
  );
};
