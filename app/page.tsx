import { BezierGraph } from '@/components/visualizer/BezierGraph';
import { AnimationPreview } from '@/components/preview/AnimationPreview';
import { RightPanel } from '@/components/controls/RightPanel';
import { ArrowRight, Github } from 'lucide-react';

export default function Home() {
  return (
    <main className='min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white'>
      {/* Navbar / Header */}
      <header className='border-b border-slate-200 bg-white/50 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/50'>
        <div className='mx-auto flex max-w-6xl items-center justify-between px-6 py-4'>
          <div className='flex items-center gap-2'>
            <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-purple-600 to-blue-600 font-bold text-white shadow-md'>
              E
            </div>
            <h1 className='text-lg font-bold tracking-tight text-slate-900 dark:text-white'>
              EaseMaster
            </h1>
          </div>

          <div className='flex items-center gap-4'>
            <a
              href='https://github.com'
              target='_blank'
              className='text-slate-400 transition-colors hover:text-slate-900 dark:hover:text-white'
            >
              <Github size={20} />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className='mx-auto max-w-6xl p-6 md:p-12'>
        {/* Hero Text */}
        <div className='mb-10 max-w-2xl'>
          <h2 className='mb-3 text-3xl font-black tracking-tight sm:text-4xl'>
            Design <span className='text-purple-600'>Motion</span> that feels
            real.
          </h2>
          <p className='text-lg text-slate-500'>
            Generate production-ready code for CSS, Tailwind, Framer Motion, and
            GSAP. Visualize Bezier curves and Spring physics in real-time.
          </p>
        </div>

        {/* The Tool Grid */}
        <div className='grid gap-8 lg:grid-cols-[1fr_400px]'>
          {/* Left Column: Visualization & Preview */}
          <div className='flex flex-col gap-6'>
            {/* 1. The Graph Editor */}
            <div className='flex min-h-[400px] flex-col items-center justify-center rounded-2xl bg-white p-8 shadow-sm dark:bg-slate-900'>
              <BezierGraph />
            </div>

            {/* 2. The Animation Preview */}
            <AnimationPreview />

            {/* 3. Pro Tip (Optional Footer) */}
            <div className='flex items-start gap-4 rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-700 dark:border-blue-900/50 dark:bg-blue-900/20 dark:text-blue-200'>
              <div className='mt-0.5 rounded-full bg-blue-200 p-1 dark:bg-blue-800'>
                <ArrowRight size={14} />
              </div>
              <div>
                <p className='font-semibold'>Engineering Note:</p>
                <p className='mt-1 text-blue-600/80 dark:text-blue-300/80'>
                  Spring animations are approximated in CSS using{' '}
                  <code>linear()</code>. For 100% physics accuracy in React, use
                  the <strong>Motion</strong> export tab.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Controls & Export */}
          <div className='flex flex-col gap-6'>
            <RightPanel />
          </div>
        </div>
      </div>
    </main>
  );
}
