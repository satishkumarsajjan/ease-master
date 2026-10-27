"use client"

import * as React from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import Link from "next/link"

import { SatisiumLogo } from "@/components/satisium-logo"
import { MinimalThemeSwitcher } from "@/components/home/minimal-theme-switcher"
import { CommandMenuTrigger } from "@/components/layout/command-menu"
import { Badge } from "@/components/ui/badge"
import { ROUTES } from "@/lib/routes"
import { REPO } from "@/lib/social-links"
import { cn } from "@/lib/utils"

import { PianoTypewriter } from "../hero-variant-1/piano-typewriter"
import { Annotation } from "../hero-variant-1/annotation"
import { DesktopGithubButton } from "../hero-variant-1/hero-footer-components"
import { ScrollVideoStage } from "./scroll-video-stage"
import { ArrowLoopDownRight } from "@/components/ui/hand-drawn-arrows"

export interface HeroVariant2ContextValue {
  isTypingComplete: boolean
  isAtRest: boolean
  setIsTypingComplete: React.Dispatch<React.SetStateAction<boolean>>
  headerRef: React.RefObject<HTMLElement | null>
  headlineBlockRef: React.RefObject<HTMLDivElement | null>
  actionUnitRef: React.RefObject<HTMLDivElement | null>
  videoStageRef: React.RefObject<HTMLDivElement | null>
  textWrapperRef: React.RefObject<HTMLDivElement | null>
  squircleRef: React.RefObject<HTMLDivElement | null>
  badgeRef: React.RefObject<HTMLDivElement | null>
}

const HeroVariant2Context =
  React.createContext<HeroVariant2ContextValue | null>(null)

export function useHeroVariant2() {
  const context = React.useContext(HeroVariant2Context)
  if (!context) {
    throw new Error(
      "HeroVariant2 compound subcomponents must be used within <HeroVariant2>."
    )
  }
  return context
}

export interface HeroVariant2Props extends React.ComponentProps<"div"> {
  className?: string
  children?: React.ReactNode
  text?: string
  badgeText?: string
  prefixLength?: number
  description?: React.ReactNode
  exploreHref?: string
  exploreText?: string
  repo?: string
  annotationText?: React.ReactNode
  annotation1Text?: React.ReactNode
  annotation2Text?: React.ReactNode
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

export interface HeroVariant2TopBarProps extends React.ComponentProps<"header"> {
  className?: string
  children?: React.ReactNode
}

export function HeroVariant2TopBar({
  className,
  children,
  ...props
}: HeroVariant2TopBarProps) {
  const { headerRef } = useHeroVariant2()
  return (
    <header
      ref={headerRef as React.Ref<HTMLElement>}
      style={{ opacity: 0 }}
      className={cn(
        "relative z-10 flex w-full items-center justify-between will-change-transform",
        className
      )}
      {...props}
    >
      {children ?? (
        <>
          <div className="flex h-7 w-7 items-center justify-center sm:h-8 sm:w-8">
            <SatisiumLogo size="100%" />
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <MinimalThemeSwitcher />
            <CommandMenuTrigger variant="icon" />
          </div>
        </>
      )}
    </header>
  )
}

export interface HeroVariant2BadgeProps extends React.ComponentProps<"div"> {
  className?: string
  children?: React.ReactNode
}

export function HeroVariant2Badge({
  className,
  children,
  ...props
}: HeroVariant2BadgeProps) {
  const { badgeRef } = useHeroVariant2()

  return (
    <div
      ref={badgeRef as React.Ref<HTMLDivElement>}
      className={cn(
        "-mt-0.5 ml-1.5 shrink-0 self-start opacity-0 will-change-transform sm:-mt-1 sm:ml-2",
        className
      )}
      {...props}
    >
      <Badge className="h-3.5 rounded-[4px] border-none bg-primary px-1.5 font-mono text-[9px] font-medium text-primary-foreground select-none hover:bg-primary sm:h-4.5 sm:rounded-[5px] sm:px-2 sm:text-[10px]">
        {children}
      </Badge>
    </div>
  )
}

export interface HeroVariant2HeadlineProps extends React.ComponentProps<"div"> {
  className?: string
  text?: string
  badgeText?: string
  annotation?: React.ReactNode
  children?: React.ReactNode
}

export function HeroVariant2Headline({
  className,
  text = "tool.satisium.com",
  badgeText = "v1.0",
  annotation,
  children,
  ...props
}: HeroVariant2HeadlineProps) {
  const {
    headlineBlockRef,
    textWrapperRef,
    squircleRef,
    isAtRest,
    setIsTypingComplete,
  } = useHeroVariant2()

  return (
    <div
      ref={headlineBlockRef as React.Ref<HTMLDivElement>}
      className={cn(
        "relative z-10 flex flex-col items-center justify-center px-0 pt-20 text-center will-change-transform sm:px-4 sm:pt-28 md:pt-36 lg:pt-40",
        className
      )}
      {...props}
    >
      {/* Unified In-Flow Centered Unit (Main text + Superscript badge centered as one complete unit) */}
      <div className="inline-flex items-center justify-center">
        <div
          ref={textWrapperRef as React.Ref<HTMLDivElement>}
          className="relative inline-block text-left"
        >
          <div
            id="hero-squircle"
            ref={squircleRef as React.Ref<HTMLDivElement>}
            className={cn(
              "pointer-events-none absolute top-0 left-0 z-0 rounded-[8px] bg-primary opacity-0 transition-[filter] duration-500 ease-out will-change-transform sm:rounded-[12px]",
              isAtRest && "drop-shadow-2xl"
            )}
          />

          <PianoTypewriter
            text={text}
            as="h1"
            className="relative z-10 font-heading text-2xl leading-tight font-semibold tracking-tight text-foreground min-[400px]:text-3xl sm:text-4xl md:text-[42px] lg:text-[44px]"
            cursorClassName="hidden"
            delay={0.12}
            blinkCount={0}
            pauseOnPunctuation={false}
            postWaitDelay={0.22}
            baseSpeed={0.042}
            variance={0.016}
            onComplete={() => {
              setIsTypingComplete(true)
            }}
          />
        </div>

        {badgeText && <HeroVariant2Badge>{badgeText}</HeroVariant2Badge>}
      </div>

      {children}

      {/* Caveat Hand-Drawn Arrow Annotation */}
      {isAtRest && annotation && (
        <div className="pointer-events-none absolute inset-0 z-20 hidden md:block">
          <Annotation
            targetId="hero-squircle"
            targetAnchor={{ x: 0.02, y: 0 }}
            targetOffset={{ x: -5, y: -9 }}
            svgAnchor={{ x: 0.953, y: 0.83 }}
            width={72}
            height={81.5}
            delay={140}
            arrow={
              <ArrowLoopDownRight
                animated
                delay={0.14}
                duration={0.4}
                strokeWidth={3.2}
                className="h-full w-full text-muted-foreground"
              />
            }
            textClassName="text-muted-foreground -rotate-2"
            textPosition="right-full -top-2 mr-3.5 text-right"
          >
            {annotation}
          </Annotation>
        </div>
      )}
    </div>
  )
}

export interface HeroVariant2ActionUnitProps extends React.ComponentProps<"div"> {
  className?: string
  description?: React.ReactNode
  exploreHref?: string
  exploreText?: string
  repo?: string
  children?: React.ReactNode
}

export function HeroVariant2ActionUnit({
  className,
  description,
  exploreHref = ROUTES.docs,
  exploreText = "Get started",
  repo = REPO,
  children,
  ...props
}: HeroVariant2ActionUnitProps) {
  const { actionUnitRef } = useHeroVariant2()

  return (
    <div
      ref={actionUnitRef as React.Ref<HTMLDivElement>}
      style={{ opacity: 0 }}
      className={cn(
        "mt-5 flex flex-col items-center will-change-transform sm:mt-6",
        className
      )}
      {...props}
    >
      {children ?? (
        <>
          {description && (
            <p className="max-w-md text-center font-sans text-xs leading-relaxed text-muted-foreground sm:text-sm sm:leading-[1.65]">
              {description}
            </p>
          )}

          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:mt-5 sm:gap-4">
            <DesktopGithubButton repo={repo} className="h-9.5 sm:h-10" />

            <Link
              href={exploreHref}
              className="flex h-9.5 cursor-pointer items-center justify-center rounded-[12px] bg-foreground px-5 text-background transition-all hover:bg-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none active:scale-[0.98] sm:h-10"
            >
              <span className="font-sans text-xs font-medium sm:text-sm">
                {exploreText}
              </span>
            </Link>
          </div>
        </>
      )}
    </div>
  )
}

export interface HeroVariant2VideoStageProps extends React.ComponentProps<"div"> {
  className?: string
  children?: React.ReactNode
}

export function HeroVariant2VideoStage({
  className,
  children,
  ...props
}: HeroVariant2VideoStageProps) {
  const { videoStageRef } = useHeroVariant2()

  return (
    <div
      ref={videoStageRef as React.Ref<HTMLDivElement>}
      style={{ opacity: 0 }}
      className={cn("relative w-full will-change-transform", className)}
      {...props}
    >
      {children ?? <ScrollVideoStage />}
    </div>
  )
}

export function HeroVariant2({
  className,
  children,
  text = "tool.satisium.com",
  badgeText = "v1.0",
  prefixLength = 4,
  description = (
    <>
      The developer-first workspace for modern design engineering.
      <br className="hidden sm:inline" />
      Build, preview, and ship cinematic interfaces with zero friction.
    </>
  ),
  exploreHref = ROUTES.docs,
  exploreText = "Get started",
  repo = REPO,
  annotationText,
  annotation1Text = (
    <span className="inline-block leading-tight select-none">
      <span className="block text-base font-medium text-muted-foreground sm:text-[18px]">
        Zero config,
      </span>
      <span className="-mt-0.5 block text-[19px] font-semibold tracking-tight text-foreground sm:text-[21px]">
        Instant setup
      </span>
    </span>
  ),
  ...props
}: HeroVariant2Props) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const headerRef = React.useRef<HTMLElement>(null)
  const headlineBlockRef = React.useRef<HTMLDivElement>(null)
  const actionUnitRef = React.useRef<HTMLDivElement>(null)
  const videoStageRef = React.useRef<HTMLDivElement>(null)
  const textWrapperRef = React.useRef<HTMLDivElement>(null)
  const squircleRef = React.useRef<HTMLDivElement>(null)
  const badgeRef = React.useRef<HTMLDivElement>(null)

  const [isTypingComplete, setIsTypingComplete] = React.useState(false)
  const [isAtRest, setIsAtRest] = React.useState(false)
  const isSettledRef = React.useRef(false)
  const activeTimelineRef = React.useRef<gsap.core.Timeline | null>(null)

  // Track scroll position in sessionStorage so reloads on downstream sections are known instantly
  React.useEffect(() => {
    const onScroll = () => {
      try {
        sessionStorage.setItem(SCROLL_KEY, String(window.scrollY || 0))
      } catch {}
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const calculateMetrics = React.useCallback(() => {
    if (!textWrapperRef.current || !squircleRef.current) return null

    const chars = textWrapperRef.current.querySelectorAll(
      ".piano-char-container"
    ) as NodeListOf<HTMLElement>
    if (!chars || chars.length === 0) return null

    const prefixChars = Array.from(chars).slice(0, prefixLength)
    const rightSideChars = Array.from(chars).slice(prefixLength)
    if (prefixChars.length === 0) return null

    const firstChar = prefixChars[0]
    const lastPrefixChar = prefixChars[prefixChars.length - 1]

    const left = firstChar.offsetLeft
    const top = firstChar.offsetTop
    const textWidth =
      lastPrefixChar.offsetLeft + lastPrefixChar.offsetWidth - left
    const textHeight = firstChar.offsetHeight

    // Read the exact computed font size from the rendered character
    const computed = window.getComputedStyle(firstChar)
    const fontSize = parseFloat(computed.fontSize) || 24

    // Symmetrical 1:1 squircle for prefixLength <= 2 (e.g. "ui"), or pill for longer prefixes
    const isSquare = prefixLength <= 2
    const squircleHeight = Math.round(fontSize * 1.3)
    const squircleWidth = isSquare
      ? squircleHeight
      : textWidth + Math.round(fontSize * 0.45)

    const width = isSquare
      ? Math.max(squircleWidth, textWidth + Math.round(fontSize * 0.32))
      : squircleWidth
    const height = isSquare ? width : squircleHeight
    const cornerRadius = Math.round(height * 0.22) // Invariant 22% Apple squircle curvature

    const centerX = left + textWidth / 2
    const centerY = top + textHeight / 2
    const squircleX = centerX - width / 2
    const squircleY = centerY - height / 2

    // Proportional optical gap between squircle right edge and suffix text/dot
    const gap = Math.max(5, Math.round(fontSize * 0.18))
    const slideAmount = squircleX + width - (left + textWidth) + gap

    return {
      prefixChars,
      rightSideChars,
      width,
      height,
      squircleX,
      squircleY,
      slideAmount,
      cornerRadius,
    }
  }, [prefixLength])

  /**
   * Settle to Resting State:
   * Instantly snaps all elements to their final resting state at the top of the page.
   * Completely clears props, kills active intro timelines, and removes transforms so
   * nothing bleeds or animates over downstream sections.
   */
  const settleToRestingState = React.useCallback(() => {
    isSettledRef.current = true
    if (activeTimelineRef.current) {
      activeTimelineRef.current.progress(1).kill()
      activeTimelineRef.current = null
    }

    if (headlineBlockRef.current) {
      gsap.set(headlineBlockRef.current, { y: 0, clearProps: "transform" })
    }
    if (headerRef.current) {
      gsap.set(headerRef.current, { opacity: 1, y: 0, clearProps: "all" })
    }
    if (actionUnitRef.current) {
      gsap.set(actionUnitRef.current, { opacity: 1, y: 0, clearProps: "all" })
    }
    if (videoStageRef.current) {
      gsap.set(videoStageRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        clearProps: "all",
      })
    }

    const m = calculateMetrics()
    if (m && squircleRef.current && badgeRef.current) {
      gsap.set(squircleRef.current, {
        left: m.squircleX,
        top: m.squircleY,
        width: m.width,
        height: m.height,
        borderRadius: m.cornerRadius,
        scale: 1,
        opacity: 1,
        transformOrigin: "center center",
        force3D: true,
      })
      gsap.set(badgeRef.current, {
        scale: 1,
        opacity: 1,
        x: m.slideAmount,
        transformOrigin: "center center",
        force3D: true,
      })
      gsap.set(m.rightSideChars, {
        x: m.slideAmount,
        force3D: true,
      })
      const prefixVisible = m.prefixChars.map(
        (el) => el.querySelector(".piano-visible") || el
      )
      gsap.set([...m.prefixChars, ...prefixVisible], {
        color: "var(--primary-foreground)",
      })
    }

    setIsTypingComplete(true)
    setIsAtRest(true)
  }, [calculateMetrics])

  /**
   * Safe Centering Offset:
   * Places headline in the center of the first screen.
   * Strictly clamped between 40px and 200px. Returns 0 if scrolled down.
   */
  const getCenterOffset = React.useCallback(() => {
    if (typeof window === "undefined" || !headlineBlockRef.current) return 140
    if (wasScrolledOnLoad()) return 0

    const currentY =
      (gsap.getProperty(headlineBlockRef.current, "y") as number) || 0
    const rect = headlineBlockRef.current.getBoundingClientRect()
    const naturalDocMidY =
      rect.top + (window.scrollY || 0) - currentY + rect.height / 2
    const firstScreenMidY = window.innerHeight / 2

    const deltaY = firstScreenMidY - naturalDocMidY
    return Math.max(Math.min(deltaY, 200), 40)
  }, [])

  // Staging: Headline starts centered in viewport while header, actions, and video stage are quietly hidden
  useGSAP(
    () => {
      if (wasScrolledOnLoad()) {
        settleToRestingState()
        return
      }

      const mm = gsap.matchMedia()

      // Mobile (< 640px): Immediate resting state, zero theatrical delay or displacement
      mm.add("(max-width: 639px)", () => {
        settleToRestingState()
      })

      // Desktop (>= 640px): Full theatrical staging
      mm.add("(min-width: 640px)", () => {
        // Initial top-of-page intro staging
        const deltaY = getCenterOffset()
        if (headlineBlockRef.current && deltaY > 0) {
          gsap.set(headlineBlockRef.current, { y: deltaY })
        }
        if (headerRef.current) {
          gsap.set(headerRef.current, { opacity: 0, y: -16 })
        }
        if (actionUnitRef.current) {
          gsap.set(actionUnitRef.current, { opacity: 0, y: 24 })
        }
        if (videoStageRef.current) {
          gsap.set(videoStageRef.current, { opacity: 0, y: 48, scale: 0.98 })
        }

        // Fast-forward guard if the user scrolls down mid-animation
        const handleScrollOrRestore = () => {
          if (
            !isSettledRef.current &&
            (window.scrollY || document.documentElement.scrollTop || 0) > 50
          ) {
            settleToRestingState()
          }
        }

        window.addEventListener("scroll", handleScrollOrRestore, {
          passive: true,
        })
        const rafId = requestAnimationFrame(handleScrollOrRestore)

        return () => {
          window.removeEventListener("scroll", handleScrollOrRestore)
          cancelAnimationFrame(rafId)
        }
      })
    },
    {
      scope: containerRef,
      dependencies: [settleToRestingState, getCenterOffset],
    }
  )

  // Orchestrated Climax & Catalyst Ascension: Runs on typing completion
  useGSAP(
    () => {
      if (
        !isTypingComplete ||
        isSettledRef.current ||
        !textWrapperRef.current ||
        !squircleRef.current ||
        !badgeRef.current
      )
        return

      const metrics = calculateMetrics()
      if (!metrics) return

      if (
        wasScrolledOnLoad() ||
        (typeof window !== "undefined" && window.innerWidth < 640)
      ) {
        settleToRestingState()
        return
      }

      // Normal Intro Sequence when user is at the top of the page
      gsap.set(squircleRef.current, {
        left: metrics.squircleX,
        top: metrics.squircleY,
        width: metrics.width,
        height: metrics.height,
        borderRadius: metrics.cornerRadius,
        scale: 0.5,
        opacity: 0,
        transformOrigin: "center center",
        force3D: true,
      })

      gsap.set(badgeRef.current, {
        scale: 0.5,
        opacity: 0,
        transformOrigin: "center center",
        force3D: true,
      })

      const tl = gsap.timeline({
        onComplete: () => {
          isSettledRef.current = true
          activeTimelineRef.current = null
          setIsAtRest(true)
        },
      })
      activeTimelineRef.current = tl

      // 1. Suffix text & badge slide right with silky hydraulic glide
      tl.to([...metrics.rightSideChars, badgeRef.current], {
        x: metrics.slideAmount,
        duration: 0.68,
        ease: "power2.inOut",
        force3D: true,
      })

      // 2. Squircle & badge bloom in with a gentle, luxurious cushion
      tl.to(
        [squircleRef.current, badgeRef.current],
        {
          scale: 1,
          opacity: 1,
          duration: 0.52,
          ease: "back.out(1.25)",
          force3D: true,
        },
        "-=0.45"
      )

      // 3. Contrast text color shift for stationary prefix text ("tool")
      const prefixVisible = metrics.prefixChars.map(
        (el) => el.querySelector(".piano-visible") || el
      )
      tl.to(
        [...metrics.prefixChars, ...prefixVisible],
        {
          color: "var(--primary-foreground)",
          duration: 0.35,
          ease: "power1.inOut",
        },
        "<"
      )

      // 4. THE CATALYST ASCENSION: Weighted, poetic lift with momentum
      if (headlineBlockRef.current) {
        tl.to(
          headlineBlockRef.current,
          {
            y: 0,
            duration: 0.85,
            ease: "power3.inOut",
            force3D: true,
            clearProps: "transform",
          },
          "-=0.1"
        )
      }

      // 5. Header drops in from above with poise
      if (headerRef.current) {
        tl.to(
          headerRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
            clearProps: "all",
          },
          "<0.12"
        )
      }

      // 6. Action Unit (subtitle + buttons) unfolds downward beneath the headline
      if (actionUnitRef.current) {
        tl.to(
          actionUnitRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: "power3.out",
            clearProps: "all",
          },
          "<0.1"
        )
      }

      // 7. Video Stage glides smoothly upward into place from below
      if (videoStageRef.current) {
        tl.to(
          videoStageRef.current,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.85,
            ease: "power3.out",
            clearProps: "all",
            force3D: true,
          },
          "<0.1"
        )
      }

      // Safety: If the user begins scrolling down while intro is playing, fast-forward immediately
      const handleScrollDuringIntro = () => {
        if (
          (window.scrollY || document.documentElement.scrollTop || 0) > 50 &&
          tl.progress() < 1
        ) {
          settleToRestingState()
        }
      }
      window.addEventListener("scroll", handleScrollDuringIntro, {
        passive: true,
      })

      const handleResize = () => {
        const m = calculateMetrics()
        if (!m || !squircleRef.current || !badgeRef.current) return
        gsap.set(squircleRef.current, {
          left: m.squircleX,
          top: m.squircleY,
          width: m.width,
          height: m.height,
          borderRadius: m.cornerRadius,
        })
        if (tl.progress() === 1 || isSettledRef.current) {
          gsap.set([...m.rightSideChars, badgeRef.current], {
            x: m.slideAmount,
          })
        }
      }

      window.addEventListener("resize", handleResize)
      return () => {
        window.removeEventListener("resize", handleResize)
        window.removeEventListener("scroll", handleScrollDuringIntro)
      }
    },
    {
      scope: containerRef,
      dependencies: [isTypingComplete, calculateMetrics, settleToRestingState],
    }
  )

  const contextValue = React.useMemo<HeroVariant2ContextValue>(
    () => ({
      isTypingComplete,
      isAtRest,
      setIsTypingComplete,
      headerRef,
      headlineBlockRef,
      actionUnitRef,
      videoStageRef,
      textWrapperRef,
      squircleRef,
      badgeRef,
    }),
    [isTypingComplete, isAtRest]
  )

  const resolvedAnnotation = annotationText ?? annotation1Text

  return (
    <HeroVariant2Context.Provider value={contextValue}>
      <div
        ref={containerRef}
        className={cn(
          "relative flex min-h-[calc(100dvh-3.5rem)] w-full flex-col justify-between select-none sm:min-h-0",
          className
        )}
        {...props}
      >
        {children ?? (
          <>
            <HeroVariant2TopBar />
            <HeroVariant2Headline
              text={text}
              badgeText={badgeText}
              annotation={resolvedAnnotation}
            >
              <HeroVariant2ActionUnit
                description={description}
                exploreHref={exploreHref}
                exploreText={exploreText}
                repo={repo}
              />
            </HeroVariant2Headline>
            <HeroVariant2VideoStage />
          </>
        )}
      </div>
    </HeroVariant2Context.Provider>
  )
}
