"use client"

import * as React from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import type { IconType } from "@icons-pack/react-simple-icons"
import { cn } from "@/lib/utils"

export const LOGO_CLOUD_SPEED_SECONDS = {
  slow: 55,
  normal: 35,
  fast: 22,
} as const

export type LogoCloudSpeed = keyof typeof LOGO_CLOUD_SPEED_SECONDS

/**
 * ============================================================================
 * LOGO CLOUD: Architectural Root Container
 * ============================================================================
 */
export interface LogoCloudProps extends Omit<
  React.ComponentProps<"section">,
  "title"
> {
  className?: string
  children?: React.ReactNode
}

export function LogoCloud({ className, children, ...props }: LogoCloudProps) {
  return (
    <section
      aria-label="Technology and partner ecosystem"
      className={cn(
        "relative mx-auto w-full max-w-7xl overflow-hidden py-0",
        className
      )}
      {...props}
    >
      {children}
    </section>
  )
}

/**
 * ============================================================================
 * LOGO CLOUD HEADER: Typographic Stage Wrapper
 * ============================================================================
 */
export interface LogoCloudHeaderProps extends React.ComponentProps<"div"> {
  className?: string
  children?: React.ReactNode
}

export function LogoCloudHeader({
  className,
  children,
  ...props
}: LogoCloudHeaderProps) {
  return (
    <div
      className={cn("mx-auto mb-8 max-w-2xl text-center sm:mb-10", className)}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * ============================================================================
 * LOGO CLOUD EYEBROW: Mono Uppercase Status/Context Pill
 * ============================================================================
 */
export interface LogoCloudEyebrowProps extends React.ComponentProps<"p"> {
  className?: string
  children?: React.ReactNode
}

export function LogoCloudEyebrow({
  className,
  children,
  ...props
}: LogoCloudEyebrowProps) {
  return (
    <p
      className={cn(
        "font-mono text-[11px] font-medium tracking-widest text-muted-foreground uppercase sm:text-xs",
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
}

/**
 * ============================================================================
 * LOGO CLOUD TITLE: Clean Architectural Heading
 * ============================================================================
 */
export interface LogoCloudTitleProps extends React.ComponentProps<"h2"> {
  className?: string
  children?: React.ReactNode
}

export function LogoCloudTitle({
  className,
  children,
  ...props
}: LogoCloudTitleProps) {
  return (
    <h2
      className={cn(
        "mt-2 font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl md:text-3xl",
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
 * LOGO CLOUD DESCRIPTION: Secondary Narrative
 * ============================================================================
 */
export interface LogoCloudDescriptionProps extends React.ComponentProps<"p"> {
  className?: string
  children?: React.ReactNode
}

export function LogoCloudDescription({
  className,
  children,
  ...props
}: LogoCloudDescriptionProps) {
  return (
    <p
      className={cn(
        "mt-2 text-sm text-muted-foreground sm:text-base",
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
}

/**
 * ============================================================================
 * LOGO CLOUD ITEM: Individual Brand Vector Unit
 * ============================================================================
 */
export interface LogoCloudItemProps extends React.ComponentProps<"div"> {
  name?: string
  icon?:
    | IconType
    | React.ComponentType<{ className?: string; size?: string | number }>
  href?: string
  showName?: boolean
  className?: string
  children?: React.ReactNode
}

export function LogoCloudItem({
  name,
  icon: Icon,
  href,
  showName = true,
  className,
  children,
  ...props
}: LogoCloudItemProps) {
  const itemContent = children ?? (
    <div
      className={cn(
        "group/item relative flex shrink-0 items-center gap-2.5 py-1.5",
        "text-muted-foreground transition-colors duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]",
        "hover:text-foreground",
        "cursor-default select-none",
        className
      )}
      {...props}
    >
      {Icon && (
        <div className="relative flex h-5 w-5 shrink-0 items-center justify-center sm:h-6 sm:w-6">
          <Icon
            size="100%"
            className="h-full w-full fill-current transition-colors duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]"
          />
        </div>
      )}

      {name && showName && (
        <span className="font-heading text-xs font-medium tracking-tight whitespace-nowrap text-muted-foreground transition-colors duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/item:text-foreground sm:text-sm">
          {name}
        </span>
      )}
    </div>
  )

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={name ? `${name} official site` : "External link"}
        className="rounded-md focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
      >
        {itemContent}
      </a>
    )
  }

  return <>{itemContent}</>
}

/**
 * ============================================================================
 * LOGO CLOUD MARQUEE: Flywheel Dual-Track Kinetic Ticker
 * Automatically duplicates children for seamless, mathematically perfect loops.
 * ============================================================================
 */
export interface LogoCloudMarqueeProps extends React.ComponentProps<"div"> {
  direction?: "left" | "right"
  speed?: LogoCloudSpeed
  pauseOnHover?: boolean
  hoverBehavior?: "slow-mo" | "pause"
  className?: string
  trackClassName?: string
  children?: React.ReactNode
}

export function LogoCloudMarquee({
  direction = "left",
  speed = "normal",
  pauseOnHover = true,
  hoverBehavior = "slow-mo",
  className,
  trackClassName,
  children,
  ...props
}: LogoCloudMarqueeProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const trackRef = React.useRef<HTMLDivElement>(null)
  const tweenRef = React.useRef<gsap.core.Tween | null>(null)

  const duration = LOGO_CLOUD_SPEED_SECONDS[speed]

  useGSAP(
    () => {
      if (!trackRef.current) return

      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches

      if (prefersReducedMotion) return

      const tween =
        direction === "left"
          ? gsap.to(trackRef.current, {
              xPercent: -50,
              ease: "none",
              duration,
              repeat: -1,
              force3D: true,
            })
          : gsap.fromTo(
              trackRef.current,
              { xPercent: -50 },
              {
                xPercent: 0,
                ease: "none",
                duration,
                repeat: -1,
                force3D: true,
              }
            )

      tweenRef.current = tween

      return () => {
        tween.kill()
      }
    },
    { scope: containerRef, dependencies: [duration, direction] }
  )

  const handleMouseEnter = React.useCallback(() => {
    if (!pauseOnHover || !tweenRef.current) return
    const targetScale = hoverBehavior === "pause" ? 0 : 0.12
    gsap.to(tweenRef.current, {
      timeScale: targetScale,
      duration: 0.75,
      ease: "power2.out",
    })
  }, [pauseOnHover, hoverBehavior])

  const handleMouseLeave = React.useCallback(() => {
    if (!pauseOnHover || !tweenRef.current) return
    gsap.to(tweenRef.current, {
      timeScale: 1,
      duration: 0.75,
      ease: "power2.inOut",
    })
  }, [pauseOnHover])

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "group relative flex w-full overflow-hidden select-none",
        "[mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]",
        "[-webkit-mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]",
        className
      )}
      {...props}
    >
      <div
        ref={trackRef}
        className={cn(
          "flex w-max shrink-0 transform-gpu items-center py-2 will-change-transform",
          trackClassName
        )}
      >
        {/* Track A */}
        <div className="flex shrink-0 items-center gap-8 pr-8 sm:gap-12 sm:pr-12 md:gap-16 md:pr-16">
          {children}
        </div>

        {/* Track B (Identical clone for seamless wrap) */}
        <div
          className="flex shrink-0 items-center gap-8 pr-8 sm:gap-12 sm:pr-12 md:gap-16 md:pr-16"
          aria-hidden="true"
        >
          {children}
        </div>
      </div>
    </div>
  )
}

/**
 * ============================================================================
 * LOGO CLOUD GRID: Static Matrix Layout
 * ============================================================================
 */
export interface LogoCloudGridProps extends React.ComponentProps<"div"> {
  columns?: 4 | 6
  className?: string
  children?: React.ReactNode
}

export function LogoCloudGrid({
  columns = 6,
  className,
  children,
  ...props
}: LogoCloudGridProps) {
  return (
    <div
      className={cn(
        "grid items-center justify-items-center gap-x-8 gap-y-8 sm:gap-x-12 sm:gap-y-12 md:gap-x-16",
        columns === 4
          ? "grid-cols-2 sm:grid-cols-4"
          : "grid-cols-3 sm:grid-cols-4 md:grid-cols-6",
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
 * LOGO CLOUD CALLOUT: Signature Hand-Drawn Caveat Ink Stroke
 * ============================================================================
 */
export interface LogoCloudCalloutProps extends React.ComponentProps<"div"> {
  className?: string
  children?: React.ReactNode
}

export function LogoCloudCallout({
  className,
  children,
  ...props
}: LogoCloudCalloutProps) {
  return (
    <div
      className={cn(
        "mt-6 flex items-center justify-center gap-2 text-center sm:mt-8",
        className
      )}
      {...props}
    >
      <span className="-rotate-2 font-(family-name:--font-caveat) text-lg text-muted-foreground sm:text-xl">
        {children ?? "✦ zero lock-in, works out of the box"}
      </span>
    </div>
  )
}
