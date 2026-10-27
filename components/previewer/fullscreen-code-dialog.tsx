"use client"

import { CodeBlock } from "@/components/code-block/code-block"
import { CodeFile } from "@/components/code-block/types"
import { CommandBlock } from "@/components/command-block"
import { DialogContent, DialogTitle } from "@/components/ui/dialog"
import { ComputerTerminal01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

interface FullscreenCodeDialogProps {
  files: Record<string, CodeFile | string>
  componentName: string
  installCommand?: string
}

export function FullscreenCodeDialog({
  files,
  componentName,
  installCommand,
}: FullscreenCodeDialogProps) {
  return (
    <DialogContent className="flex w-[95vw] max-w-300 flex-col overflow-hidden rounded-3xl bg-muted p-0 sm:min-w-[60vw]">
      <DialogTitle className="sr-only">{componentName} Source Code</DialogTitle>

      <div className="flex h-[85vh] w-full flex-col gap-4 p-3 pt-4">
        {/* Header Area */}
        <div className="flex shrink-0 flex-col gap-1.5 px-1">
          <h2 className="flex items-center gap-2 text-[15px] font-semibold tracking-tight text-foreground">
            <HugeiconsIcon
              icon={ComputerTerminal01Icon}
              className="size-5 text-muted-foreground"
            />
            <span>Installation</span>
          </h2>
          <p className="text-[13.5px] leading-relaxed text-muted-foreground">
            Run the command below to add the{" "}
            <span className="inline-flex items-center rounded-md bg-muted px-1.5 py-0.5 text-xs font-medium text-foreground">
              {componentName}
            </span>{" "}
            component to your project.
          </p>
        </div>

        {/* Command Block & Code Block Wrapper */}
        <div className="flex min-h-0 w-full flex-1 flex-col gap-4 rounded-3xl bg-background p-2">
          <div className="shrink-0">
            <CommandBlock
              command={installCommand || ""}
              className="max-w-none"
            />
          </div>

          <div className="relative flex min-h-0 flex-1 overflow-hidden">
            <CodeBlock files={files} className="h-full w-full" />
          </div>
        </div>
      </div>
    </DialogContent>
  )
}
