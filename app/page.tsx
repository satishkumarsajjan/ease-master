import { PresetSidebar } from '@/components/layout/PresetSidebar';
import { BezierGraph } from '@/components/visualizer/BezierGraph';
import { ControlsBar } from '@/components/layout/ControlsBar';
import { PreviewPanel } from '@/components/preview/PreviewPanel';
import { ExportPanel } from '@/components/export/ExportPanel';
import { InfoPanel } from '@/components/info/InfoPanel';
import { Footer } from '@/components/layout/Footer'; // Import Footer

export default function Home() {
  return (
    <main className='flex h-screen w-screen overflow-hidden bg-background text-foreground font-sans selection:bg-primary/30'>
      {/* 1. LEFT SIDEBAR (Presets) */}
      <aside className='w-[320px] shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground'>
        <PresetSidebar />
      </aside>

      {/* 2. CENTER COLUMN (Graph + Preview) */}
      <section className='flex flex-1 flex-col min-w-0 relative bg-background'>
        {/* Title Overlay */}
        <div className='absolute top-8 left-8 z-10 pointer-events-none opacity-50'>
          <h1 className='text-primary font-mono text-xs tracking-wider font-bold'>
            EASE MASTER{' '}
            <span className='text-muted-foreground font-normal ml-2'>v1.0</span>
          </h1>
        </div>

        {/* TOP: Editor Workspace */}
        <div className='flex-1 flex flex-col items-center justify-center p-6 overflow-y-auto scrollbar-hide'>
          <div className='flex flex-col items-center w-full max-w-[600px] gap-6'>
            <BezierGraph />
            <ControlsBar />
          </div>
        </div>

        {/* BOTTOM: Preview Panel */}
        <div className='h-[35%] min-h-[280px] border-t border-border z-20 bg-card'>
          <PreviewPanel />
        </div>
      </section>

      {/* 3. RIGHT SIDEBAR (Info & Export & Footer) */}
      <aside className='w-[380px] shrink-0 flex flex-col border-l border-sidebar-border bg-sidebar text-sidebar-foreground'>
        {/* TOP: Info Panel */}
        <div className='min-h-[250px] border-b border-sidebar-border'>
          <InfoPanel />
        </div>

        {/* MIDDLE: Export Panel (Fills remaining space) */}
        <div className='flex-1 min-h-0 overflow-hidden'>
          <ExportPanel />
        </div>

        {/* BOTTOM: Footer (New) */}
        <Footer />
      </aside>
    </main>
  );
}
