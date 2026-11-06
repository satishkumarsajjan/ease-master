"use client"

import * as React from "react"
import { useStudioStore, useActiveDossier } from "@/store/useStudioStore"
import { AuditionView } from "./modes/audition/audition-view"

export function StudioShell() {
  const mode = useStudioStore((s) => s.mode)
  const isPlaying = useStudioStore((s) => s.isPlaying)
  const isScrubbing = useStudioStore((s) => s.isScrubbing)
  const scrubProgress = useStudioStore((s) => s.scrubProgress)
  const setScrubProgress = useStudioStore((s) => s.setScrubProgress)
  const setIsPlaying = useStudioStore((s) => s.setIsPlaying)
  const triggerAudition = useStudioStore((s) => s.triggerAudition)
  const togglePlayback = useStudioStore((s) => s.togglePlayback)
  const toggleTimeline = useStudioStore((s) => s.toggleTimeline)
  const toggleCompare = useStudioStore((s) => s.toggleCompare)
  const activeCurveId = useStudioStore((s) => s.activeCurveId)
  const navStack = useStudioStore((s) => s.navStack)
  const setNavStack = useStudioStore((s) => s.setNavStack)
  const setMode = useStudioStore((s) => s.setMode)
  const playbackSpeed = useStudioStore((s) => s.playbackSpeed)
  const isLooping = useStudioStore((s) => s.isLooping)

  const activeDossier = useActiveDossier()
  const duration = activeDossier.duration || 320

  // Scrub progress ref for stable RAF reading
  const scrubProgressRef = React.useRef(scrubProgress)
  React.useEffect(() => {
    scrubProgressRef.current = scrubProgress
  }, [scrubProgress])

  // Central 60fps RAF Playback Engine
  React.useEffect(() => {
    if (!isPlaying || isScrubbing) return

    let animationFrameId: number
    const totalDuration = duration / playbackSpeed
    const pauseDuration = 600

    const currentProgress = scrubProgressRef.current
    const currentElapsed =
      currentProgress >= 100 ? 0 : (currentProgress / 100) * totalDuration
    let startTime = performance.now() - currentElapsed

    const tick = (now: number) => {
      const elapsed = now - startTime
      if (elapsed < totalDuration) {
        setScrubProgress((elapsed / totalDuration) * 100)
        animationFrameId = requestAnimationFrame(tick)
      } else if (isLooping) {
        if (elapsed < totalDuration + pauseDuration) {
          setScrubProgress(100)
          animationFrameId = requestAnimationFrame(tick)
        } else {
          startTime = performance.now()
          triggerAudition()
          animationFrameId = requestAnimationFrame(tick)
        }
      } else {
        setScrubProgress(100)
        setIsPlaying(false)
      }
    }

    animationFrameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animationFrameId)
  }, [
    isPlaying,
    isScrubbing,
    isLooping,
    playbackSpeed,
    duration,
    setScrubProgress,
    setIsPlaying,
    triggerAudition,
  ])

  // Global Ergonomic Hotkeys
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement
      const isInput =
        activeEl?.tagName === "INPUT" ||
        activeEl?.tagName === "TEXTAREA" ||
        (activeEl instanceof HTMLElement && activeEl.isContentEditable)

      if (e.key === "Escape") {
        setNavStack(
          navStack.level === 2
            ? { level: 1, curveId: navStack.curveId }
            : navStack.level === 1
              ? { level: 0 }
              : navStack
        )
      }

      if (isInput) return

      if (e.key === " ") {
        e.preventDefault()
        togglePlayback()
      } else if (e.key === "r" || e.key === "R") {
        triggerAudition()
      } else if (e.key === "1") {
        setMode("audition")
      } else if (e.key === "2") {
        setMode("customize")
      } else if (e.key === "3") {
        setMode("compare")
      } else if (e.key === "t" || e.key === "T") {
        toggleTimeline()
      } else if (e.key === "c" || e.key === "C") {
        toggleCompare(activeCurveId)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [
    navStack,
    activeCurveId,
    togglePlayback,
    triggerAudition,
    setMode,
    toggleTimeline,
    toggleCompare,
    setNavStack,
  ])

  return (
    <div className="h-dvh w-full overflow-hidden bg-muted p-2 font-sans select-none">
      {mode === "audition" && <AuditionView />}
      {mode !== "audition" && <AuditionView />}
    </div>
  )
}
