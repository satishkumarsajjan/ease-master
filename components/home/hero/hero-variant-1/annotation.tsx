"use client"

import React, { useEffect, useState, useRef } from "react"
import { cn } from "@/lib/utils"

export interface AnnotationProps {
  targetId: string
  targetAnchor?: { x: number; y: number }
  targetOffset?: { x: number; y: number }
  svgAnchor?: { x: number; y: number }
  size?: number
  width?: number
  height?: number

  // Content
  title?: React.ReactNode
  children?: React.ReactNode

  // Line Asset (either single SVG path or dedicated arrow component)
  path?: string
  arrow?: React.ReactNode
  drawFrom?: "start" | "end"

  // Positioning
  textPosition?: string
  svgRotation?: string

  // Styling
  textClassName?: string
  svgClassName?: string
  strokeWidth?: number
  strokeColor?: string

  // Timing
  delay?: number
  duration?: number
}

export const Annotation: React.FC<AnnotationProps> = ({
  targetId,
  targetAnchor = { x: 0.5, y: 0.5 },
  targetOffset,
  svgAnchor = { x: 1, y: 1 },
  size = 60,
  width: customWidth,
  height: customHeight,
  title,
  children,
  path,
  arrow,
  drawFrom = "start",
  textPosition = "bottom-full mb-2 left-0",
  svgRotation = "",
  textClassName,
  svgClassName,
  strokeWidth = 1.5,
  strokeColor = "currentColor",
  delay = 1000,
  duration = 1.2,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const isInitialized = useRef(false)

  const [pathLength, setPathLength] = useState(0)
  const [step, setStep] = useState(0)
  const [isReady, setIsReady] = useState(false)

  const actualWidth = customWidth ?? size
  const actualHeight = customHeight ?? size

  // Hardware-Accelerated Viewport Tracking (native scroll coordinate sync)
  useEffect(() => {
    let rafId: number
    const loop = () => {
      const el = document.getElementById(targetId)
      const container = containerRef.current

      if (el && container) {
        const targetRect = el.getBoundingClientRect()
        const parent = container.offsetParent as HTMLElement | null
        const parentRect = parent
          ? parent.getBoundingClientRect()
          : { left: 0, top: 0 }

        const parentBorderLeft = parent
          ? parseFloat(getComputedStyle(parent).borderLeftWidth) || 0
          : 0
        const parentBorderTop = parent
          ? parseFloat(getComputedStyle(parent).borderTopWidth) || 0
          : 0

        const targetPxX =
          targetRect.left +
          targetRect.width * targetAnchor.x +
          (targetOffset?.x ?? 0)
        const targetPxY =
          targetRect.top +
          targetRect.height * targetAnchor.y +
          (targetOffset?.y ?? 0)

        const finalX =
          targetPxX -
          parentRect.left -
          parentBorderLeft -
          actualWidth * svgAnchor.x
        const finalY =
          targetPxY -
          parentRect.top -
          parentBorderTop -
          actualHeight * svgAnchor.y

        container.style.transform = `translate3d(${finalX}px, ${finalY}px, 0)`

        if (!isInitialized.current) {
          isInitialized.current = true
          setIsReady(true)
        }
      }
      rafId = requestAnimationFrame(loop)
    }
    loop()
    return () => cancelAnimationFrame(rafId)
  }, [
    targetId,
    targetAnchor,
    targetOffset?.x,
    targetOffset?.y,
    svgAnchor,
    actualWidth,
    actualHeight,
  ])

  // Measure path length and sequence animation steps
  useEffect(() => {
    if (arrow) {
      const timer1 = setTimeout(() => setStep(1), delay)
      const timer2 = setTimeout(() => setStep(2), delay + duration * 1000)
      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
      }
    }

    if (!path) return

    const checkInit = setInterval(() => {
      if (isInitialized.current && pathRef.current) {
        clearInterval(checkInit)
        const length = pathRef.current.getTotalLength()
        setPathLength(length)

        setTimeout(() => setStep(1), delay)
        setTimeout(() => setStep(2), delay + duration * 1000)
      }
    }, 50)
    return () => clearInterval(checkInit)
  }, [delay, duration, path, arrow])

  return (
    <div
      ref={containerRef}
      className={cn(
        "pointer-events-none absolute top-0 left-0 z-10 transition-opacity duration-150",
        (!isReady || (step === 0 && !arrow)) && "opacity-0"
      )}
      style={{ width: actualWidth, height: actualHeight }}
    >
      {/* Hand-drawn Caveat text note */}
      <div
        className={cn(
          "pointer-events-auto absolute w-max max-w-[280px] transition-all ease-out",
          "font-(family-name:--font-caveat) text-base leading-snug tracking-wide text-foreground select-none sm:text-[18px]",
          (arrow ? step >= 1 : step >= 2)
            ? "translate-y-0 opacity-100"
            : "translate-y-1 opacity-0",
          textPosition,
          textClassName
        )}
        style={{
          transitionDuration: `${Math.min(duration * 0.75, 0.35)}s`,
        }}
      >
        {title}
        {children}
      </div>

      {/* Hand-drawn Arrow Asset */}
      {arrow ? (
        <div
          className={cn(
            "absolute inset-0 h-full w-full",
            svgRotation,
            svgClassName
          )}
          style={{
            transformOrigin: `${svgAnchor.x * 100}% ${svgAnchor.y * 100}%`,
          }}
        >
          {arrow}
        </div>
      ) : path ? (
        <svg
          className={cn(
            "absolute inset-0 h-full w-full text-muted-foreground",
            svgRotation,
            svgClassName
          )}
          viewBox="0 0 101 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            transformOrigin: `${svgAnchor.x * 100}% ${svgAnchor.y * 100}%`,
          }}
        >
          <path
            ref={pathRef}
            d={path}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: pathLength || 1000,
              strokeDashoffset:
                step >= 1
                  ? 0
                  : drawFrom === "start"
                    ? pathLength || 1000
                    : -(pathLength || 1000),
              transition:
                step >= 1
                  ? `stroke-dashoffset ${duration}s cubic-bezier(0.4, 0, 0.2, 1)`
                  : "none",
              opacity: pathLength > 0 ? 1 : 0,
            }}
          />
        </svg>
      ) : null}
    </div>
  )
}
