'use client';

import { useEaseStore } from '@/store/useEaseStore';
import { CheckCircle2, Info } from 'lucide-react';

export const InfoPanel = () => {
  const { presetInfo } = useEaseStore();

  return (
    <div className='flex h-full w-full flex-col bg-sidebar p-6 border-b border-sidebar-border'>
      {/* Title Header */}
      <div className='flex items-center gap-2 mb-3'>
        <Info size={16} className='text-primary' />
        <h2 className='text-sm font-bold text-sidebar-foreground font-mono tracking-wider uppercase'>
          {presetInfo.label}
        </h2>
      </div>

      {/* Description */}
      <p className='text-xs leading-relaxed text-muted-foreground mb-6 border-l-2 border-sidebar-border pl-3'>
        {presetInfo.description}
      </p>

      {/* Use Cases */}
      <div>
        <h3 className='text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3'>
          Best Use Cases
        </h3>
        <ul className='space-y-2'>
          {presetInfo.useCases.map((useCase, index) => (
            <li
              key={index}
              className='flex items-start gap-2 text-xs text-sidebar-foreground'
            >
              <CheckCircle2
                size={14}
                className='text-primary mt-0.5 shrink-0'
              />
              <span>{useCase}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
