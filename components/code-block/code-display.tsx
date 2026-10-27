import React from "react"

import { cn } from "@/lib/utils"
import { COLLAPSED_HEIGHT, scrollbarClasses } from "./constants"

export interface CodeDisplayProps {
  highlightedHtml?: string
  rawCode: string
  isTerminalMode: boolean
  showLineNumbers: boolean
  expandable: boolean
  isExpanded: boolean
  scrollRef: React.RefObject<HTMLDivElement | null>
}

export function CodeDisplay({
  highlightedHtml,
  rawCode,
  isTerminalMode,
  showLineNumbers,
  expandable,
  isExpanded,
  scrollRef,
}: CodeDisplayProps) {
  return (
    <div
      ref={scrollRef}
      className={cn(
        "h-full w-full overflow-auto",
        scrollbarClasses,
        expandable && !isExpanded && "overflow-y-hidden"
      )}
      style={{
        maxHeight:
          expandable && !isExpanded
            ? `${COLLAPSED_HEIGHT}px`
            : expandable
              ? "85vh"
              : undefined,
        transition: "max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div
        className={cn(
          "w-fit min-w-full py-4 font-mono text-[13px] leading-6",
          "[&_pre]:m-0[&_pre]:p-0 [&_pre]:!bg-transparent",
          "[&_code]:grid [&_code]:min-w-full",
          "[&_span.line]:px-4[&_span.line]:min-h-[1.5rem] [&_span.line]:block [&_span.line]:w-full",
          "[&_span.line]:border-l-[3px] [&_span.line]:border-l-transparent",
          "transition-colors",
          showLineNumbers &&
            !isTerminalMode && [
              "[&_code]:[counter-reset:line]",
              "[&_span.line::before]:[counter-increment:line]",
              "[&_span.line::before]:[content:counter(line)]",
              "[&_span.line::before]:inline-block",
              "[&_span.line::before]:w-10",
              "[&_span.line::before]:mr-4",
              "[&_span.line::before]:text-right",
              "[&_span.line::before]:text-muted-foreground",
              "[&_span.line::before]:select-none",
            ],
          isTerminalMode && [
            "[&_span.line::before]:content-['$']",
            "[&_span.line::before]:inline-block",
            "[&_span.line::before]:mr-3",
            "[&_span.line::before]:text-primary",
            "[&_span.line::before]:select-none",
            "[&_span.line:empty::before]:content-none",
          ],
          "[&_span.is-highlighted]:border-r-2 [&_span.is-highlighted]:border-r-primary [&_span.is-highlighted]:bg-muted",
          "[&_span.is-added]:border-l-primary [&_span.is-added]:bg-muted",
          "[&_span.is-added::before]:!text-primary",
          "[&_span.is-added::before]:[content:'++_'counter(line)]",
          "[&_span.is-removed]:border-l-destructive [&_span.is-removed]:bg-muted",
          "[&_span.is-removed]:opacity-50",
          "[&_span.is-removed::before]:!text-destructive",
          "[&_span.is-removed::before]:[content:'--_'counter(line)]",
          "[&_span.is-blurred]:opacity-30 [&_span.is-blurred]:blur-[1px]",
          "transition-all duration-300 hover:[&_span.is-blurred]:opacity-100 hover:[&_span.is-blurred]:blur-none"
        )}
      >
        {highlightedHtml ? (
          <div
            dangerouslySetInnerHTML={{
              __html: highlightedHtml,
            }}
          />
        ) : (
          <pre>
            <code>
              {rawCode.split("\n").map((line, i) => (
                <span key={i} className="line">
                  {line}
                </span>
              ))}
            </code>
          </pre>
        )}
      </div>
    </div>
  )
}
