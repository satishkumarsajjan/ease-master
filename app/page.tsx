import { ExportPanel } from '@/components/export/ExportPanel';
import { InfoPanel } from '@/components/info/InfoPanel';
import { ControlsBar } from '@/components/layout/ControlsBar';
import { Footer } from '@/components/layout/Footer'; // Import Footer
import { PresetSidebar } from '@/components/layout/PresetSidebar';
import { LogoBezier } from '@/components/logo';
import { PreviewPanel } from '@/components/preview/PreviewPanel';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BezierGraph } from '@/components/visualizer/BezierGraph';

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
        <div className='absolute top-8 left-8 z-10 pointer-events-none opacity-90 flex items-center gap-3'>
          <LogoBezier className='w-10 h-10 shadow-lg' />
          <div>
            <h1 className='text-primary font-mono text-xs tracking-wider font-bold leading-none'>
              EASE MASTER
            </h1>
            <span className='text-[10px] text-muted-foreground font-medium'>
              v1.0
            </span>
          </div>
        </div>

        {/* TOP: Editor Workspace */}

        <ScrollArea className='flex-1 flex flex-col items-center justify-center overflow-y-auto scrollbar-hide mx-auto w-full'>
          <div className='flex flex-col items-center justify-center w-full py-6 gap-6 '>
            <BezierGraph />
            <ControlsBar />
          </div>
        </ScrollArea>

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
