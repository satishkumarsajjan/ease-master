"use client"

import * as React from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { cn } from "@/lib/utils"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export interface PianoTypewriterProps extends React.HTMLAttributes<HTMLElement> {
  text: string
  as?: React.ElementType
  cursorClassName?: string
  baseSpeed?: number
  variance?: number
  delay?: number
  blinkCount?: number
  pauseOnPunctuation?: boolean
  skipPostWait?: boolean
  postWaitDelay?: number
  viewportOnce?: boolean
  triggerStart?: string
  onComplete?: () => void
  prefixLength?: number
  prefixBadgeId?: string
  prefixBadgeRef?: React.Ref<HTMLSpanElement>
  isMorphed?: boolean
  prefixBadgeClassName?: string
}

const SCROLL_KEY = "satisium_scroll_y"

function wasScrolledOnLoad(): boolean {
  if (typeof window === "undefined") return false
  const currentScroll =
    window.scrollY || document.documentElement.scrollTop || 0
  if (currentScroll > 50) return true
  try {
    const saved = sessionStorage.getItem(SCROLL_KEY)
    if (saved && Number(saved) > 50) return true
  } catch {}
  return false
}

export const PianoTypewriter = React.forwardRef<
  HTMLElement,
  PianoTypewriterProps
>(
  (
    {
      text,
      as: ComponentTag = "h1",
      className,
      cursorClassName = "bg-primary",
      baseSpeed = 0.08,
      variance = 0.04,
      delay = 0.4,
      blinkCount = 2,
      pauseOnPunctuation = true,
      skipPostWait = false,
      postWaitDelay,
      viewportOnce = true,
      triggerStart = "top 90%",
      onComplete,
      ...props
    },
    ref
  ) => {
    const containerRef = React.useRef<HTMLElement | null>(null)
    const cursorRef = React.useRef<HTMLSpanElement | null>(null)

    React.useImperativeHandle(ref, () => containerRef.current as HTMLElement)

    React.useEffect(() => {
      const onScroll = () => {
        try {
          sessionStorage.setItem(SCROLL_KEY, String(window.scrollY || 0))
        } catch {}
      }
      window.addEventListener("scroll", onScroll, { passive: true })
      return () => window.removeEventListener("scroll", onScroll)
    }, [])

    useGSAP(
      () => {
        if (!containerRef.current || !cursorRef.current) return

        const charContainers = gsap.utils.toArray<HTMLElement>(
          ".piano-char-container",
          containerRef.current
        )
        if (charContainers.length === 0) return

        const mm = gsap.matchMedia()

        // Mobile (< 640px): Immediate resting state, zero intro delay or staggered typing
        mm.add("(max-width: 639px)", () => {
          if (!containerRef.current) return
          const visibleChars =
            containerRef.current.querySelectorAll(".piano-visible")
          gsap.set(visibleChars, {
            opacity: 1,
            rotateX: 0,
            scale: 1,
            y: 0,
            clearProps: "all",
          })
          if (cursorRef.current) {
            gsap.set(cursorRef.current, { display: "none" })
          }
          onComplete?.()
        })

        // Desktop (>= 640px): Full typing animation sequence
        mm.add(
          "(min-width: 640px) and (prefers-reduced-motion: no-preference)",
          () => {
            if (!cursorRef.current || !containerRef.current) return

            // If loaded or refreshed while already scrolled down, immediately reveal resting text
            if (wasScrolledOnLoad()) {
              const visibleChars =
                containerRef.current.querySelectorAll(".piano-visible")
              gsap.set(visibleChars, {
                opacity: 1,
                rotateX: 0,
                scale: 1,
                y: 0,
                clearProps: "all",
              })
              gsap.set(cursorRef.current, { display: "none" })
              onComplete?.()
              return
            }

            // Subpixel-accurate cursor coordinate helper relative to root h1 container
            const getCursorPos = (targetEl: HTMLElement, atEnd = false) => {
              const root = containerRef.current!.getBoundingClientRect()
              const r = targetEl.getBoundingClientRect()
              return {
                x: atEnd ? r.right - root.left : r.left - root.left,
                y: r.top - root.top,
              }
            }

            // 1. Initial State
            const initialPos = getCursorPos(charContainers[0], false)
            gsap.set(cursorRef.current, {
              x: initialPos.x,
              y: initialPos.y,
              opacity: 1,
              display: "inline-block",
            })

            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: containerRef.current,
                start: triggerStart,
                once: viewportOnce,
              },
            })

            let timePos = delay

            // 2. The Anticipation (Blink if blinkCount > 0)
            const blinkSpeed = 0.35
            for (let i = 0; i < blinkCount; i++) {
              tl.to(
                cursorRef.current,
                { opacity: 0, duration: blinkSpeed, ease: "power1.inOut" },
                timePos
              )
              timePos += blinkSpeed
              tl.to(
                cursorRef.current,
                { opacity: 1, duration: blinkSpeed, ease: "power1.inOut" },
                timePos
              )
              timePos += blinkSpeed
            }

            if (blinkCount > 0) {
              timePos += 0.2
            }

            // 3. Human Typing Sequence
            charContainers.forEach((container, i) => {
              const charText = container.getAttribute("data-char") || ""
              const isLast = i === charContainers.length - 1

              let nextX: number
              let nextY: number
              if (isLast) {
                const lastPos = getCursorPos(container, true)
                nextX = lastPos.x
                nextY = lastPos.y
              } else {
                const nextPos = getCursorPos(charContainers[i + 1], false)
                nextX = nextPos.x
                nextY = nextPos.y
              }

              const currentPos = getCursorPos(container, false)
              const isLineBreak = nextY > currentPos.y + 5
              let duration = baseSpeed + Math.random() * variance

              if (isLineBreak) duration = 0.2
              else if (charText === " ") duration = baseSpeed * 1.8

              // Move Cursor
              tl.to(
                cursorRef.current,
                {
                  x: nextX,
                  y: nextY,
                  duration,
                  ease: isLineBreak ? "power2.inOut" : "none",
                },
                timePos
              )

              // Reveal Character
              const visibleChar = container.querySelector(".piano-visible")
              const charAnimDuration = 0.46
              if (visibleChar) {
                tl.fromTo(
                  visibleChar,
                  { opacity: 0, rotateX: -60, y: 15, scale: 0.8 },
                  {
                    opacity: 1,
                    rotateX: 0,
                    y: 0,
                    scale: 1,
                    duration: charAnimDuration,
                    ease: "back.out(2)",
                    force3D: true,
                    clearProps: "transform,scale,opacity",
                  },
                  timePos
                )
              }

              if (isLast) {
                // Exact timestamp when the last character completely finishes its 3D entrance
                timePos = timePos + charAnimDuration
              } else {
                timePos += duration
                if (pauseOnPunctuation && /[.,!?]/.test(charText)) {
                  timePos += 0.3
                }
              }
            })

            // 4. Post-Typing Equilibrium & Cognitive Breath (Act 1 Rest):
            // At this exact moment, all 3D character oscillations are 100% finished and cleared.
            // We hold in absolute quiet (calibrated 450ms) so the eye enjoys the completed, resting text.
            const cognitiveHold = postWaitDelay ?? (skipPostWait ? 0.3 : 0.45)

            if (cognitiveHold > 0) {
              // Dissolve cursor softly during the breath
              tl.to(
                cursorRef.current,
                { opacity: 0, duration: 0.22, ease: "power2.out" },
                timePos
              )

              timePos += cognitiveHold

              tl.add(() => {
                if (onComplete) onComplete()
              }, timePos)
            } else {
              tl.add(() => {
                if (onComplete) onComplete()
              }, timePos)

              tl.to(
                cursorRef.current,
                { opacity: 0, duration: 0.22, ease: "power2.out" },
                timePos
              )
            }

            const handleResize = () => {
              if (!containerRef.current || !cursorRef.current) return
              if (tl.progress() > 0 && tl.progress() < 1) tl.progress(1)

              const last = charContainers[charContainers.length - 1]
              if (last) {
                const lastPos = getCursorPos(last, true)
                gsap.set(cursorRef.current, {
                  x: lastPos.x,
                  y: lastPos.y,
                })
              }
            }

            const handleScroll = () => {
              if (
                (window.scrollY || document.documentElement.scrollTop || 0) >
                  50 &&
                tl.progress() < 1
              ) {
                tl.progress(1)
              }
            }

            window.addEventListener("resize", handleResize)
            window.addEventListener("scroll", handleScroll, { passive: true })
            const rafId = requestAnimationFrame(handleScroll)

            return () => {
              window.removeEventListener("resize", handleResize)
              window.removeEventListener("scroll", handleScroll)
              cancelAnimationFrame(rafId)
            }
          }
        )

        mm.add("(prefers-reduced-motion: reduce)", () => {
          if (!cursorRef.current || !containerRef.current) return
          gsap.set(cursorRef.current, { display: "none" })
          const visibleChars = gsap.utils.toArray(
            ".piano-visible",
            containerRef.current
          )
          gsap.fromTo(
            visibleChars,
            { opacity: 0 },
            {
              opacity: 1,
              duration: 0.5,
              stagger: 0.02,
              ease: "none",
              onComplete: () => {
                if (onComplete) onComplete()
              },
            }
          )
        })

        return () => mm.revert()
      },
      {
        scope: containerRef,
        dependencies: [baseSpeed, variance, delay, triggerStart, viewportOnce],
      }
    )

    const ssrInitialStyles: React.CSSProperties = {
      opacity: 0,
      transform: "translateY(15px) rotateX(-60deg) scale(0.8)",
      transformOrigin: "bottom center",
      willChange: "transform, opacity",
    }

    const words = text.split(/(\s+)/)
    const Component = ComponentTag

    const renderChar = (char: string, key: string) => (
      <span
        key={key}
        className="piano-char-container inline-grid items-center justify-items-center leading-none [grid-template-areas:'stack']"
        data-char={char}
      >
        <span className="invisible [grid-area:stack]">{char}</span>
        <span
          className="piano-visible [grid-area:stack]"
          style={ssrInitialStyles}
        >
          {char}
        </span>
      </span>
    )

    return (
      <Component
        ref={containerRef}
        aria-label={text}
        className={cn("relative text-left whitespace-pre-wrap", className)}
        style={{ perspective: "800px", padding: "0.2em 0" }}
        {...props}
      >
        <span aria-hidden="true" className="flex flex-wrap items-center">
          {words.map((word, wordIndex) => {
            if (word.match(/\s+/)) {
              return (
                <span
                  key={wordIndex}
                  className="piano-char-container inline-block whitespace-pre"
                  data-char={word}
                >
                  {word}
                </span>
              )
            }

            return (
              <span key={wordIndex} className="inline-block whitespace-nowrap">
                {word
                  .split("")
                  .map((char, charIndex) =>
                    renderChar(char, `${wordIndex}-${charIndex}`)
                  )}
              </span>
            )
          })}
        </span>
        <span
          ref={cursorRef}
          className={cn(
            "absolute top-0 left-0 z-10 hidden rounded-[1px] will-change-transform",
            "mt-[0.05em] h-[1.15em] w-[0.1em]",
            cursorClassName
          )}
        />
      </Component>
    )
  }
)

PianoTypewriter.displayName = "PianoTypewriter"
