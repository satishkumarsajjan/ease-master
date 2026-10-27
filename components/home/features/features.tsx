"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * ============================================================================
 * FEATURES ROOT CONTAINER
 * ============================================================================
 */
export interface FeaturesProps extends React.ComponentProps<"section"> {
  className?: string
  children?: React.ReactNode
}

export function Features({ className, children, ...props }: FeaturesProps) {
  return (
    <section
      id="features"
      aria-label="Features"
      className={cn(
        "relative mx-auto flex w-full max-w-6xl flex-col items-center px-0 select-none sm:px-6",
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
 * FEATURES HEADER
 * ============================================================================
 */
export interface FeaturesHeaderProps extends React.ComponentProps<"div"> {
  className?: string
  children?: React.ReactNode
}

export function FeaturesHeader({
  className,
  children,
  ...props
}: FeaturesHeaderProps) {
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
 * FEATURES EYEBROW
 * ============================================================================
 */
export interface FeaturesEyebrowProps extends React.ComponentProps<"p"> {
  className?: string
  children?: React.ReactNode
}

export function FeaturesEyebrow({
  className,
  children,
  ...props
}: FeaturesEyebrowProps) {
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
 * FEATURES HEADING / TITLE
 * ============================================================================
 */
export interface FeaturesHeadingProps extends React.ComponentProps<"h2"> {
  className?: string
  children?: React.ReactNode
}

export function FeaturesHeading({
  className,
  children,
  ...props
}: FeaturesHeadingProps) {
  return (
    <h2
      className={cn(
        "text-center font-heading text-xl font-medium tracking-tight text-foreground sm:text-2xl",
        className
      )}
      {...props}
    >
      {children}
    </h2>
  )
}

export const FeaturesTitle = FeaturesHeading

/**
 * ============================================================================
 * FEATURES DESCRIPTION
 * ============================================================================
 */
export interface FeaturesDescriptionProps extends React.ComponentProps<"p"> {
  className?: string
  children?: React.ReactNode
}

export function FeaturesDescription({
  className,
  children,
  ...props
}: FeaturesDescriptionProps) {
  return (
    <p
      className={cn(
        "mt-2 max-w-md text-center text-sm text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
}
