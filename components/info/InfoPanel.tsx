'use client';

import { useEaseStore } from '@/store/useEaseStore';
import { Info, CheckCircle2 } from 'lucide-react';

export const InfoPanel = () => {
  const { presetInfo } = useEaseStore();

  return (
    <div className='flex h-full w-full flex-col bg-[#181818] p-6 border-b border-slate-800'>
      {/* Title Header */}
      <div className='flex items-center gap-2 mb-3'>
        <Info size={16} className='text-lime-400' />
        <h2 className='text-sm font-bold text-white font-mono tracking-wider uppercase'>
          {presetInfo.label}
        </h2>
      </div>

      {/* Description */}
      <p className='text-xs leading-relaxed text-slate-400 mb-6 border-l-2 border-slate-700 pl-3'>
        {presetInfo.description}
      </p>

      {/* Use Cases */}
      <div>
        <h3 className='text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3'>
          Best Use Cases
        </h3>
        <ul className='space-y-2'>
          {presetInfo.useCases.map((useCase, index) => (
            <li
              key={index}
              className='flex items-start gap-2 text-xs text-slate-300'
            >
              <CheckCircle2
                size={14}
                className='text-slate-600 mt-0.5 shrink-0'
              />
              <span>{useCase}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
