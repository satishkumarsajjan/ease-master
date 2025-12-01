// src/components/controls/CodeExport.tsx
'use client';

import { useState } from 'react';
import { useEaseStore } from '@/store/useEaseStore';
import { generateCode } from '@/core/strategies/generator';
import { ExportTarget } from '@/core/types';
import { Check, Copy } from 'lucide-react';
import { clsx } from 'clsx';

const TABS: { id: ExportTarget; label: string }[] = [
  { id: 'css', label: 'CSS' },
  { id: 'tailwind', label: 'Tailwind' },
  { id: 'motion', label: 'Motion' },
  { id: 'gsap', label: 'GSAP' },
];

export const CodeExport = () => {
  const state = useEaseStore();
  const [activeTab, setActiveTab] = useState<ExportTarget>('css');
  const [copied, setCopied] = useState(false);

  const code = generateCode(activeTab, state);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className='flex flex-col gap-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950'>
      {/* Tabs Header */}
      <div className='flex border-b border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50'>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={clsx(
              'flex-1 px-4 py-3 text-xs font-semibold transition-colors',
              activeTab === tab.id
                ? 'border-b-2 border-purple-500 text-purple-600 dark:text-purple-400'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Code Area */}
      <div className='group relative'>
        <pre className='overflow-x-auto p-4 font-mono text-xs leading-relaxed text-slate-700 dark:text-slate-300'>
          {code}
        </pre>

        {/* Copy Button (Floating) */}
        <button
          onClick={handleCopy}
          className={clsx(
            'absolute right-2 top-2 flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium shadow-sm transition-all',
            copied
              ? 'bg-green-500 text-white'
              : 'bg-white text-slate-700 hover:bg-slate-50 opacity-0 group-hover:opacity-100 dark:bg-slate-800 dark:text-slate-200'
          )}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
};
