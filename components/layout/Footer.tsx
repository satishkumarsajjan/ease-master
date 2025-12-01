'use client';

import { clsx } from 'clsx';
import { Github, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export const Footer = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), []);

  return (
    <div className='flex items-center justify-between border-t border-sidebar-border bg-sidebar p-4 text-xs text-sidebar-foreground'>
      {/* Attribution */}
      <div className='flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity'>
        <span>Made by</span>
        <a
          href='https://github.com/satish-kumar' // Replace with your actual link
          target='_blank'
          rel='noreferrer'
          className='font-medium hover:text-primary hover:underline underline-offset-2'
        >
          Satish Kumar
        </a>
      </div>

      {/* Tools */}
      <div className='flex items-center gap-1'>
        {/* GitHub Link */}
        <a
          href='https://github.com/your-repo' // Replace with repo link
          target='_blank'
          rel='noreferrer'
          className={clsx(
            'p-2 rounded-md transition-colors',
            'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-muted-foreground'
          )}
          title='View Source on GitHub'
        >
          <Github size={14} />
        </a>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className={clsx(
            'p-2 rounded-md transition-colors',
            'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-muted-foreground'
          )}
          title='Toggle Theme'
        >
          {mounted && theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
        </button>
      </div>
    </div>
  );
};
