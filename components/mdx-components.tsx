import { cn } from "@/lib/utils"
import Link from "next/link"
import * as React from "react"
import { CodeBlock } from "./code-block/code-block"

import { CommandBlock } from "@/components/command-block"
import { Badge } from "@/components/ui/badge"
import { Callout } from "./callout"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Kbd, KbdShortcut } from "@/components/ui/kbd"
import { Steps, Step } from "./mdx/steps"
import { PromptBlock } from "./mdx/prompt-block"
import { FileTree } from "./mdx/file-tree"
import { EmptyState } from "@/components/ui/empty-state"
import { LoadingState, Spinner } from "@/components/ui/loading-state"
import { ErrorState } from "@/components/ui/error-state"
import { StatCard } from "@/components/ui/stat-card"
import { DescriptionList } from "@/components/ui/description-list"

export const defaultMdxComponents = {
  h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className={cn("mt-2 scroll-m-20 text-foreground", className)}
      {...props}
    />
  ),
  h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className={cn("mt-12 mb-6 scroll-m-20 pb-2 text-foreground", className)}
      {...props}
    />
  ),
  h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className={cn("mt-8 mb-4 scroll-m-20 text-foreground", className)}
      {...props}
    />
  ),
  h4: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4
      className={cn("mt-8 mb-4 scroll-m-20 text-foreground", className)}
      {...props}
    />
  ),
  p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className={cn(
        "leading-7 text-muted-foreground not-first:mt-6",
        className
      )}
      {...props}
    />
  ),
  ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul
      className={cn(
        "my-6 ml-6 list-disc text-muted-foreground marker:text-primary",
        className
      )}
      {...props}
    />
  ),
  ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol
      className={cn("my-6 ml-6 list-decimal text-muted-foreground", className)}
      {...props}
    />
  ),
  li: ({ className, ...props }: React.LiHTMLAttributes<HTMLLIElement>) => (
    <li className={cn("mt-2 leading-7", className)} {...props} />
  ),
  blockquote: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <blockquote
      className={cn(
        "mt-6 border-l-2 border-primary pl-6 leading-7 text-muted-foreground italic",
        className
      )}
      {...props}
    />
  ),
  a: ({
    className,
    href,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const isExternal = href?.startsWith("http")
    const Comp = isExternal ? "a" : Link
    return (
      <Comp
        href={href as string}
        className={cn(
          "font-medium text-primary underline underline-offset-4 transition-colors hover:text-primary",
          className
        )}
        {...(isExternal
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
        {...props}
      />
    )
  },
  strong: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <strong className={cn("font-bold text-foreground", className)} {...props} />
  ),
  code: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <code
      className={cn(
        "relative rounded-md bg-muted px-[0.6rem] py-[0.2rem] font-mono text-sm font-medium text-primary",
        className
      )}
      {...props}
    />
  ),
  pre: ({ className, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
    <pre
      className={cn(
        "mt-6 mb-4 overflow-x-auto rounded-xl border border-border bg-sidebar p-4 shadow-sm",
        className
      )}
      {...props}
    />
  ),
  table: ({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 w-full overflow-x-auto rounded-3xl bg-muted p-2">
      <table
        className={cn(
          "w-full border-separate border-spacing-0 text-left text-sm text-muted-foreground",
          className
        )}
        {...props}
      />
    </div>
  ),
  thead: ({
    className,
    ...props
  }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead className={cn("", className)} {...props} />
  ),
  tbody: ({
    className,
    ...props
  }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <tbody
      className={cn(
        "[&_td]:bg-background",
        "[&_tr:first-child_td:first-child]:rounded-tl-2xl",
        "[&_tr:first-child_td:last-child]:rounded-tr-2xl",
        "[&_tr:last-child_td:first-child]:rounded-bl-2xl",
        "[&_tr:last-child_td:last-child]:rounded-br-2xl",
        "[&_tr:hover_td]:bg-muted",
        className
      )}
      {...props}
    />
  ),
  tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr className={cn("group transition-colors", className)} {...props} />
  ),
  th: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className={cn(
        "px-4 pt-1 pb-3 align-bottom font-medium text-foreground [&:has([align=center])]:text-center [&:has([align=right])]:text-right",
        className
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td
      className={cn(
        "p-4 align-middle leading-relaxed transition-colors duration-200 [&:has([align=center])]:text-center [&:has([align=right])]:text-right",
        className
      )}
      {...props}
    />
  ),

  // 2. Export them so Fumadocs can use them globally
  Callout,
  CommandBlock,
  Badge,
  CodeBlock,
  Steps,
  Step,
  PromptBlock,
  FileTree,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Kbd,
  KbdShortcut,
  EmptyState,
  LoadingState,
  Spinner,
  ErrorState,
  StatCard,
  DescriptionList,
}
