import { PresetSidebar } from '@/components/layout/PresetSidebar';
import { BezierGraph } from '@/components/visualizer/BezierGraph';
import { ControlsBar } from '@/components/layout/ControlsBar';
import { PreviewPanel } from '@/components/preview/PreviewPanel';
import { ExportPanel } from '@/components/export/ExportPanel';
import { InfoPanel } from '@/components/info/InfoPanel';

export default function Home() {
  return (
    <main className='flex h-screen w-screen overflow-hidden bg-[#121212] text-white font-sans selection:bg-lime-500/30'>
      {/* 1. LEFT SIDEBAR (Presets) */}
      <aside className='w-[320px] shrink-0 border-r border-slate-800 bg-[#1e1e1e]'>
        <PresetSidebar />
      </aside>

      {/* 2. CENTER COLUMN (Graph + Preview) */}
      <section className='flex flex-1 flex-col min-w-0 relative'>
        {/* Title Overlay */}
        <div className='absolute top-8 left-8 z-10 pointer-events-none opacity-50'>
          <h1 className='text-lime-400 font-mono text-xs tracking-wider font-bold'>
            EASE MASTER{' '}
            <span className='text-slate-500 font-normal ml-2'>v1.0</span>
          </h1>
        </div>

        {/* TOP: Editor Workspace */}
        <div className='flex-1 flex flex-col items-center justify-center p-6 bg-[#121212] overflow-y-auto'>
          {/* We wrap these in a div to ensure they stay centered and don't stretch weirdly */}
          <div className='flex flex-col items-center w-full max-w-[600px]'>
            <BezierGraph />
            <ControlsBar />
          </div>
        </div>

        {/* BOTTOM: Preview Panel (Full Width) */}
        {/* We give it a fixed percentage or min-height to ensure it's always usable */}
        <div className='h-[35%] min-h-[280px] border-t border-slate-800 z-20'>
          <PreviewPanel />
        </div>
      </section>

      {/* 3. RIGHT SIDEBAR (Export Only) */}
      <aside className='w-[380px] shrink-0 flex flex-col border-l border-slate-800 bg-[#181818]'>
        {/* TOP: Info Panel (Dynamic Height or Fixed) */}
        <div className='min-h-[250px]'>
          <InfoPanel />
        </div>

        {/* BOTTOM: Export Panel (Fills rest) */}
        <div className='flex-1 min-h-0'>
          <ExportPanel />
        </div>
      </aside>
    </main>
  );
}
