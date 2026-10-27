"use client"

import * as React from "react"
import { ROUTES } from "@/lib/routes"
import { cn } from "@/lib/utils"

/**
 * ============================================================================
 * SHOWCASE STAGE HEADING
 * ============================================================================
 */
export interface ShowcaseStageHeadingProps extends React.ComponentProps<"h2"> {
  className?: string
  children?: React.ReactNode
}

export function ShowcaseStageHeading({
  className,
  children,
  ...props
}: ShowcaseStageHeadingProps) {
  return (
    <h2
      className={cn(
        "mb-6 text-center font-heading text-xl font-medium tracking-tight text-foreground sm:mb-8 sm:text-2xl",
        className
      )}
      {...props}
    >
      {children}
    </h2>
  )
}

/**
 * ============================================================================
 * SHOWCASE STAGE FRAME: Box-in-Box Concentric Bezel Chassis
 * ============================================================================
 */
export interface ShowcaseStageFrameProps extends React.ComponentProps<"div"> {
  className?: string
  children?: React.ReactNode
}

export function ShowcaseStageFrame({
  className,
  children,
  style,
  ...props
}: ShowcaseStageFrameProps) {
  return (
    <div
      style={{
        maxWidth: "min(1400px, calc(70vh * 16 / 9))",
        maxHeight: "70vh",
        ...style,
      }}
      className={cn(
        "relative mx-auto aspect-video w-full overflow-hidden rounded-2xl bg-muted p-1 sm:rounded-3xl sm:p-1.5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * ============================================================================
 * SHOWCASE STAGE SCREEN: Inner Device / Viewport Canvas
 * ============================================================================
 */
export interface ShowcaseStageScreenProps extends React.ComponentProps<"div"> {
  className?: string
  children?: React.ReactNode
}

export function ShowcaseStageScreen({
  className,
  children,
  ...props
}: ShowcaseStageScreenProps) {
  return (
    <div
      className={cn(
        "relative size-full overflow-hidden rounded-[12px] bg-background sm:rounded-[18px]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * ============================================================================
 * SHOWCASE STAGE IFRAME: Interactive Sandboxed Embed Player
 * ============================================================================
 */
export interface ShowcaseStageIframeProps extends React.ComponentProps<"iframe"> {
  src?: string
  title?: string
  className?: string
}

export function ShowcaseStageIframe({
  src = ROUTES.stage,
  title = "Interactive Stage",
  className,
  ...props
}: ShowcaseStageIframeProps) {
  return (
    <iframe
      src={src}
      title={title}
      loading="lazy"
      className={cn("size-full border-0 bg-background", className)}
      {...props}
    />
  )
}

/**
 * ============================================================================
 * SHOWCASE STAGE: Root Section / Preset Wrapper
 * ============================================================================
 */
export interface ShowcaseStageProps extends React.ComponentProps<"section"> {
  className?: string
  heading?: React.ReactNode
  src?: string
  title?: string
  children?: React.ReactNode
}

export function ShowcaseStage({
  className,
  heading = "See how it feels.",
  src = ROUTES.stage,
  title = "Interactive Stage",
  children,
  ...props
}: ShowcaseStageProps) {
  return (
    <section
      aria-label={typeof heading === "string" ? heading : title}
      className={cn(
        "relative mx-auto flex w-full flex-col items-center justify-center select-none",
        className
      )}
      {...props}
    >
      {children ?? (
        <>
          {heading && <ShowcaseStageHeading>{heading}</ShowcaseStageHeading>}

          <ShowcaseStageFrame>
            <ShowcaseStageScreen>
              <ShowcaseStageIframe src={src} title={title} />
            </ShowcaseStageScreen>
          </ShowcaseStageFrame>
        </>
      )}
    </section>
  )
}
