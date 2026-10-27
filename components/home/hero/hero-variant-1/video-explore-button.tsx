"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { ROUTES } from "@/lib/routes"
import { motion } from "motion/react"
import Link from "next/link"

export interface VideoExploreButtonProps {
  /** The trigger that dictates when the sequence begins */
  isRevealed?: boolean
  buttonWidth?: number
  buttonHeight?: number
  videoHeight?: number
  padding?: number
  gap?: number
  canvasRadius?: number
  videoRadius?: number
  buttonRadius?: number
  /** Direct URL for the video */
  videoSrc?: string
  /** Direct URL for the video poster/thumbnail */
  videoPoster?: string
  buttonText?: React.ReactNode
  href?: string
  buttonClassName?: string
  canvasClassName?: string
  videoContainerClassName?: string
}

export function VideoExploreButton({
  isRevealed = false,
  buttonWidth = 240,
  buttonHeight = 56,
  videoHeight = 135,
  padding = 8,
  gap = 8,
  canvasRadius = 24,
  videoRadius = 16,
  buttonRadius = 16,
  videoSrc: propVideoSrc,
  videoPoster: propVideoPoster,
  buttonText = "Explore components",
  href = ROUTES.docsComponents,
  buttonClassName,
  canvasClassName,
  videoContainerClassName,
}: VideoExploreButtonProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null)

  const effectiveVideoSrc = propVideoSrc || ""
  const effectivePoster = propVideoPoster || ""

  React.useEffect(() => {
    if (isRevealed && videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }, [isRevealed])

  const canvasRestWidth = buttonWidth
  const canvasHoverWidth = buttonWidth + padding * 2

  // Sequence 1: Canvas fades in and wraps the button
  const canvasBaseTransition = {
    duration: 0.4,
    ease: "easeOut" as const,
    delay: isRevealed ? 0 : 0.2,
  }

  // Sequence 2: Canvas grows upward & Video slides into place
  const growthTransition = {
    type: "spring" as const,
    bounce: 0,
    duration: 0.65,
    delay: isRevealed ? 0.15 : 0.05,
  }

  // Sequence 3: The solid Primary curtain dissolves to reveal the video
  const curtainTransition = {
    duration: 0.25,
    ease: "linear" as const,
    delay: isRevealed ? 0.2 : 0,
  }

  return (
    <div
      className="relative z-50 flex items-end justify-center"
      style={{ width: buttonWidth, height: buttonHeight }}
    >
      {/* LAYER 1: THE MUTED CANVAS */}
      <motion.div
        className={cn(
          "absolute bottom-0 left-1/2 flex flex-col justify-end overflow-hidden bg-muted",
          canvasClassName
        )}
        style={{ x: "-50%", transformOrigin: "bottom center" }}
        initial={false}
        animate={{
          width: isRevealed ? canvasHoverWidth : canvasRestWidth,
          padding: isRevealed ? padding : 0,
          y: isRevealed ? padding : 0,
          opacity: isRevealed ? 1 : 0,
          borderRadius: isRevealed ? canvasRadius : buttonRadius,
        }}
        transition={canvasBaseTransition}
      >
        <motion.div
          className="w-full shrink-0"
          initial={false}
          animate={{ height: isRevealed ? videoHeight + gap : 0 }}
          transition={growthTransition}
        />
        <div className="w-full shrink-0" style={{ height: buttonHeight }} />
      </motion.div>

      {/* LAYER 2: THE PRIMARY MASK & VIDEO CONTAINER */}
      <div
        className="pointer-events-none absolute z-10 overflow-hidden"
        style={{
          bottom: buttonHeight,
          left: "50%",
          transform: "translateX(-50%)",
          width: buttonWidth,
          height: videoHeight + gap,
        }}
      >
        <motion.div
          className={cn(
            "absolute top-0 w-full overflow-hidden",
            videoContainerClassName
          )}
          style={{
            height: videoHeight,
            borderRadius: videoRadius,
            willChange: "transform",
          }}
          initial={false}
          animate={{
            y: isRevealed ? 0 : videoHeight + gap,
          }}
          transition={growthTransition}
        >
          <video
            ref={videoRef}
            src={effectiveVideoSrc}
            poster={effectivePoster || undefined}
            className="h-full w-full object-cover"
            muted
            playsInline
            loop
            preload="metadata"
          />

          {/* LAYER 2.5: THE PRIMARY THEATER CURTAIN */}
          <motion.div
            className="absolute inset-0 z-10 bg-primary"
            initial={false}
            animate={{ opacity: isRevealed ? 0 : 1 }}
            transition={curtainTransition}
          />
        </motion.div>
      </div>

      {/* LAYER 3: THE CORE ACTION BUTTON */}
      <Link
        href={href}
        className={cn(
          "absolute bottom-0 left-0 z-20 flex cursor-pointer items-center justify-center bg-foreground text-background transition-transform focus-visible:outline-none active:scale-[0.98]",
          buttonClassName
        )}
        style={{
          width: buttonWidth,
          height: buttonHeight,
          borderRadius: buttonRadius,
        }}
      >
        <span className="font-heading text-sm font-medium tracking-wide">
          {buttonText}
        </span>
      </Link>
    </div>
  )
}
