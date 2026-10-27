"use client"

import * as React from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { motion } from "motion/react"

import { SatisiumLogo } from "@/components/satisium-logo"
import { MinimalThemeSwitcher } from "@/components/home/minimal-theme-switcher"
import { CommandMenuTrigger } from "@/components/layout/command-menu"
import { Badge } from "@/components/ui/badge"
import { ROUTES } from "@/lib/routes"
import { REPO } from "@/lib/social-links"
import { EASE } from "@/lib/motion"
import { cn } from "@/lib/utils"

import { PianoTypewriter } from "./piano-typewriter"
import { Annotation } from "./annotation"
import { VideoExploreButton } from "./video-explore-button"
import { DesktopGithubButton, MobileMediaCard } from "./hero-footer-components"
import {
  ArrowLoopDownRight,
  ArrowLoopDownLeft,
  ArrowLoopUpRight,
} from "@/components/ui/hand-drawn-arrows"

const DEFAULT_VIDEO_URL =
  "https://cdn.jsdelivr.net/gh/satisium/ui-assets@main/v2/previews/components/videos/teaser.mp4"

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

export interface HeroVariant1Props {
  className?: string
  text?: string
  badgeText?: string
  prefixLength?: number
  videoSrc?: string
  videoPoster?: string
  exploreHref?: string
  exploreText?: string
  repo?: string
}

export interface HeroContextValue {
  isRevealed: boolean
  isScrolledOnLoad: boolean
  isAtRest: boolean
  setIsTypingRevealed: React.Dispatch<React.SetStateAction<boolean>>
  setIsAtRest: React.Dispatch<React.SetStateAction<boolean>>
  textWrapperRef: React.RefObject<HTMLDivElement | null>
  squircleRef: React.RefObject<HTMLDivElement | null>
  badgeRef: React.RefObject<HTMLDivElement | null>
}

const HeroContext = React.createContext<HeroContextValue | null>(null)

export function useHero() {
  const context = React.useContext(HeroContext)
  if (!context) {
    throw new Error(
      "Hero compound components must be rendered within a <Hero> component."
    )
  }
  return context
}

export interface HeroProps extends React.ComponentProps<"div"> {
  className?: string
  children?: React.ReactNode
}

/**
 * ============================================================================
 * HERO ROOT: The Architectural Viewport Shell
 * Manages scroll restoration, typing reveal choreography, and provides HeroContext.
 * ============================================================================
 */
export function Hero({ className, children, ...props }: HeroProps) {
  const textWrapperRef = React.useRef<HTMLDivElement>(null)
  const squircleRef = React.useRef<HTMLDivElement>(null)
  const badgeRef = React.useRef<HTMLDivElement>(null)

  // Track external scroll state via useSyncExternalStore to eliminate SSR hydration mismatches
  const isScrolledOnLoad = React.useSyncExternalStore(
    (callback) => {
      window.addEventListener("scroll", callback, { passive: true })
      return () => window.removeEventListener("scroll", callback)
    },
    wasScrolledOnLoad,
    () => false
  )

  const [isTypingRevealed, setIsTypingRevealed] = React.useState(false)
  const isRevealed = isScrolledOnLoad || isTypingRevealed
  const [isAtRest, setIsAtRest] = React.useState(false)

  // Save scroll position in sessionStorage + fast-forward reveal on intentional user scroll
  React.useEffect(() => {
    const onScroll = () => {
      const currentScroll =
        window.scrollY || document.documentElement.scrollTop || 0
      try {
        sessionStorage.setItem(SCROLL_KEY, String(currentScroll))
      } catch {}

      if (currentScroll > 35 && !isTypingRevealed) {
        setIsTypingRevealed(true)
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [isTypingRevealed])

  const contextValue = React.useMemo<HeroContextValue>(
    () => ({
      isRevealed,
      isScrolledOnLoad,
      isAtRest,
      setIsTypingRevealed,
      setIsAtRest,
      textWrapperRef,
      squircleRef,
      badgeRef,
    }),
    [isRevealed, isScrolledOnLoad, isAtRest]
  )

  return (
    <HeroContext.Provider value={contextValue}>
      <div
        className={cn(
          "relative flex min-h-[calc(100dvh-3.5rem)] w-full flex-col justify-between sm:min-h-[calc(100dvh-6rem)]",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </HeroContext.Provider>
  )
}

export interface HeroTopBarProps extends React.ComponentProps<
  typeof motion.header
> {
  className?: string
  children?: React.ReactNode
}

export function HeroTopBarBrand({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex h-7 w-7 items-center justify-center sm:h-8 sm:w-8",
        className
      )}
      {...props}
    >
      {children ?? <SatisiumLogo size="100%" />}
    </div>
  )
}

export function HeroTopBarActions({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex items-center gap-1.5 sm:gap-2", className)}
      {...props}
    >
      {children ?? (
        <>
          <MinimalThemeSwitcher />
          <CommandMenuTrigger variant="icon" />
        </>
      )}
    </div>
  )
}

/**
 * ============================================================================
 * HERO TOP BAR: Brand anchor & Global Navigation Utility Dock
 * ============================================================================
 */
export function HeroTopBar({ className, children, ...props }: HeroTopBarProps) {
  const { isRevealed, isScrolledOnLoad } = useHero()

  return (
    <motion.header
      initial={isScrolledOnLoad ? false : { opacity: 0, y: -16 }}
      animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: -16 }}
      transition={{ duration: 0.75, ease: EASE.outExpo }}
      className={cn(
        "relative z-10 flex w-full shrink-0 items-center justify-between",
        className
      )}
      {...props}
    >
      {children ?? (
        <>
          <HeroTopBarBrand />
          <HeroTopBarActions />
        </>
      )}
    </motion.header>
  )
}

export interface HeroBadgeProps extends React.ComponentProps<"div"> {
  className?: string
  children?: React.ReactNode
}

/**
 * ============================================================================
 * HERO BADGE: Architectural Status Indicator
 * Content is passed as pure children (<HeroBadge>Beta</HeroBadge>).
 * ============================================================================
 */
export function HeroBadge({ className, children, ...props }: HeroBadgeProps) {
  const { badgeRef } = useHero()

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

export interface HeroTypewriterProps extends Omit<
  React.ComponentProps<typeof PianoTypewriter>,
  "onComplete"
> {
  onComplete?: () => void
}

/**
 * ============================================================================
 * HERO TYPEWRITER: Pure Piano Keyboard Kinetic Heading
 * ============================================================================
 */
export function HeroTypewriter({
  text = "ui.satisium.com",
  as = "h1",
  className = "relative z-10 font-heading text-2xl leading-tight font-semibold tracking-tight text-foreground min-[400px]:text-3xl sm:text-4xl md:text-[42px] lg:text-[44px]",
  cursorClassName = "hidden",
  delay = 0.12,
  blinkCount = 0,
  pauseOnPunctuation = false,
  postWaitDelay = 0.22,
  baseSpeed = 0.042,
  variance = 0.016,
  onComplete,
  ...props
}: HeroTypewriterProps) {
  const { setIsTypingRevealed } = useHero()

  return (
    <PianoTypewriter
      text={text}
      as={as}
      className={className}
      cursorClassName={cursorClassName}
      delay={delay}
      blinkCount={blinkCount}
      pauseOnPunctuation={pauseOnPunctuation}
      postWaitDelay={postWaitDelay}
      baseSpeed={baseSpeed}
      variance={variance}
      onComplete={() => {
        setIsTypingRevealed(true)
        onComplete?.()
      }}
      {...props}
    />
  )
}

export interface HeroCanvasProps extends React.ComponentProps<"div"> {
  className?: string
  text?: string
  badgeText?: string
  prefixLength?: number
  children?: React.ReactNode
}

/**
 * ============================================================================
 * HERO CANVAS: The 3D Piano Typewriter Stage
 * Coordinates the squircle expansion and typography metrics.
 * ============================================================================
 */
export function HeroCanvas({
  className,
  text = "ui.satisium.com",
  badgeText = "Beta",
  prefixLength = 2,
  children,
  ...props
}: HeroCanvasProps) {
  const {
    isRevealed,
    isAtRest,
    textWrapperRef,
    squircleRef,
    badgeRef,
    setIsAtRest,
  } = useHero()
  const isSettledRef = React.useRef(false)

  // Precision text metrics measurement for the inline prefix squircle
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
  }, [prefixLength, squircleRef, textWrapperRef])

  // THE CLIMAX: Character sliding and squircle bloom isolated inside textWrapperRef scope
  useGSAP(
    () => {
      if (
        !isRevealed ||
        isSettledRef.current ||
        !textWrapperRef.current ||
        !squircleRef.current ||
        !badgeRef.current
      )
        return

      const metrics = calculateMetrics()
      if (!metrics) return

      // Settle instantly if already scrolled down or on mobile screens (< 640px)
      if (
        wasScrolledOnLoad() ||
        (typeof window !== "undefined" && window.innerWidth < 640)
      ) {
        isSettledRef.current = true
        gsap.set(squircleRef.current, {
          left: metrics.squircleX,
          top: metrics.squircleY,
          width: metrics.width,
          height: metrics.height,
          borderRadius: metrics.cornerRadius,
          scale: 1,
          opacity: 1,
        })
        gsap.set(badgeRef.current, {
          scale: 1,
          opacity: 1,
          x: metrics.slideAmount,
        })
        gsap.set(metrics.rightSideChars, {
          x: metrics.slideAmount,
        })
        const prefixVisible = metrics.prefixChars.map(
          (el) => el.querySelector(".piano-visible") || el
        )
        gsap.set([...metrics.prefixChars, ...prefixVisible], {
          color: "var(--primary-foreground)",
        })
        setIsAtRest(true)
        return
      }

      // Initial state before squircle explosion
      gsap.set(squircleRef.current, {
        left: metrics.squircleX,
        top: metrics.squircleY,
        width: metrics.width,
        height: metrics.height,
        borderRadius: metrics.cornerRadius,
        scale: 0.5,
        opacity: 0,
        transformOrigin: "center center",
      })

      gsap.set(badgeRef.current, {
        scale: 0.5,
        opacity: 0,
        transformOrigin: "center center",
      })

      const tl = gsap.timeline({
        onComplete: () => {
          isSettledRef.current = true
          setIsAtRest(true)
        },
      })

      // 1. Suffix text & badge slide right with silky hydraulic glide
      tl.to([...metrics.rightSideChars, badgeRef.current], {
        x: metrics.slideAmount,
        duration: 0.68,
        ease: "power2.inOut",
      })

      // 2. Squircle & badge bloom in with a gentle, luxurious cushion
      tl.to(
        [squircleRef.current, badgeRef.current],
        {
          scale: 1,
          opacity: 1,
          duration: 0.52,
          ease: "back.out(1.25)",
        },
        "-=0.45"
      )

      // 3. Contrast text color shift for stationary prefix text ("ui")
      const prefixVisible = metrics.prefixChars.map(
        (el) => el.querySelector(".piano-visible") || el
      )
      tl.to(
        [...metrics.prefixChars, ...prefixVisible],
        {
          color: "var(--primary-foreground)",
        },
        "<"
      )

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
      return () => window.removeEventListener("resize", handleResize)
    },
    {
      scope: textWrapperRef,
      dependencies: [isRevealed, calculateMetrics, setIsAtRest],
    }
  )

  return (
    <div
      className={cn(
        "relative z-0 my-auto flex flex-1 flex-col items-center justify-center px-0 py-12 text-center sm:px-4 sm:py-16",
        className
      )}
      {...props}
    >
      {/* Unified In-Flow Centered Unit */}
      <div className="inline-flex items-center justify-center">
        <div ref={textWrapperRef} className="relative inline-block text-left">
          {/* Absolute Squircle placed behind text at z-0 */}
          <div
            id="hero-squircle"
            ref={squircleRef}
            className={cn(
              "pointer-events-none absolute top-0 left-0 z-0 rounded-[8px] bg-primary opacity-0 transition-[filter] duration-500 ease-out will-change-transform sm:rounded-[12px]",
              isAtRest && "drop-shadow-2xl"
            )}
          />

          {children ?? <HeroTypewriter text={text} />}
        </div>

        {badgeText && <HeroBadge>{badgeText}</HeroBadge>}
      </div>
    </div>
  )
}

export interface HeroActionsProps extends React.ComponentProps<
  typeof motion.footer
> {
  className?: string
  children?: React.ReactNode
  videoSrc?: string
  videoPoster?: string
  exploreHref?: string
  exploreText?: string
  repo?: string
}

/**
 * ============================================================================
 * HERO ACTIONS: Responsive Action Dock
 * Houses the desktop and mobile action components with declarative motion.
 * ============================================================================
 */
export function HeroActions({
  className,
  children,
  videoSrc = DEFAULT_VIDEO_URL,
  videoPoster,
  exploreHref = ROUTES.docsComponents,
  exploreText = "Explore components",
  repo = REPO,
  ...props
}: HeroActionsProps) {
  const { isRevealed, isScrolledOnLoad } = useHero()

  return (
    <motion.footer
      initial={isScrolledOnLoad ? false : { opacity: 0, y: 16 }}
      animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ duration: 0.75, ease: EASE.outExpo }}
      className={cn(
        "relative z-10 flex w-full shrink-0 flex-col pt-4 pb-0",
        className
      )}
      {...props}
    >
      {children ?? (
        <>
          {/* Mobile View */}
          <div className="flex w-full md:hidden">
            <MobileMediaCard
              isRevealed={isRevealed}
              videoSrc={videoSrc}
              videoPoster={videoPoster}
              exploreHref={exploreHref}
              exploreText={exploreText}
              repo={repo}
            />
          </div>

          {/* Desktop View */}
          <div className="hidden w-full items-end justify-between md:flex">
            <DesktopGithubButton repo={repo} />
            <VideoExploreButton
              href={exploreHref}
              buttonText={exploreText}
              isRevealed={isRevealed}
              videoSrc={videoSrc}
              videoPoster={videoPoster}
            />
          </div>
        </>
      )}
    </motion.footer>
  )
}

export interface HeroAnnotationsProps extends React.ComponentProps<"div"> {
  className?: string
  children?: React.ReactNode
}

/**
 * ============================================================================
 * HERO ANNOTATIONS: Hand-Drawn Caveat Ink Strokes
 * ============================================================================
 */
export function HeroAnnotations({
  className,
  children,
  ...props
}: HeroAnnotationsProps) {
  const { isRevealed } = useHero()

  if (!isRevealed) return null

  return (
    <div className={cn("hidden lg:block", className)} {...props}>
      {children ?? (
        <>
          <Annotation
            targetId="hero-squircle"
            targetAnchor={{ x: 0.04, y: 0.04 }}
            targetOffset={{ x: -6, y: -6 }}
            svgAnchor={{ x: 0.953, y: 0.83 }}
            width={72}
            height={81.5}
            delay={220}
            arrow={
              <ArrowLoopDownRight
                animated
                delay={0.22}
                duration={0.4}
                strokeWidth={3.2}
                className="h-full w-full text-muted-foreground"
              />
            }
            textClassName="text-muted-foreground -rotate-1"
            textPosition="right-full -top-6 mr-4 text-right"
          >
            <span className="inline-block leading-tight select-none">
              <span className="block text-base font-medium text-muted-foreground sm:text-[18px]">
                Components, blocks
                <br />
                and templates built
              </span>
              <span className="-mt-0.5 block text-[19px] font-semibold tracking-tight text-foreground sm:text-[21px]">
                for SHADCN env
              </span>
            </span>
          </Annotation>

          <Annotation
            targetId="hero-squircle"
            targetAnchor={{ x: 0.04, y: 0.96 }}
            targetOffset={{ x: 6, y: 12 }}
            svgAnchor={{ x: 0.796, y: 0.046 }}
            width={60}
            height={71}
            delay={360}
            arrow={
              <ArrowLoopUpRight
                animated
                delay={0.36}
                duration={0.4}
                strokeWidth={3.2}
                className="h-full w-full rotate-12 text-muted-foreground"
              />
            }
            textClassName="text-muted-foreground -rotate-1"
            textPosition="right-full bottom-0 mr-5 text-right"
          >
            <span className="inline-block leading-tight select-none">
              <span className="block text-[19px] font-semibold tracking-tight text-foreground sm:text-[21px]">
                Over 50+
              </span>
              <span className="-mt-0.5 block text-base font-medium text-muted-foreground sm:text-[18px]">
                components
              </span>
            </span>
          </Annotation>

          <Annotation
            targetId="hero-squircle"
            targetAnchor={{ x: 0.96, y: 0.04 }}
            targetOffset={{ x: -32, y: -24 }}
            svgAnchor={{ x: 0.158, y: 0.895 }}
            width={80}
            height={64.7}
            delay={500}
            svgRotation="20deg"
            arrow={
              <ArrowLoopDownLeft
                animated
                delay={0.5}
                duration={0.4}
                strokeWidth={3.2}
                className="h-full w-full -rotate-12 text-muted-foreground"
              />
            }
            textClassName="text-muted-foreground rotate-1"
            textPosition="left-full top-[4px] ml-1.5 text-left"
          >
            <span className="inline-block leading-tight select-none">
              <span className="block text-base font-medium text-muted-foreground sm:text-[18px]">
                Growing, evolving
              </span>
              <span className="-mt-0.5 block text-[19px] font-semibold tracking-tight text-foreground sm:text-[21px]">
                and Open Source
              </span>
            </span>
          </Annotation>
        </>
      )}
    </div>
  )
}

/**
 * ============================================================================
 * HERO VARIANT 1: Presets Wrapper
 * Composes <Hero>, <HeroTopBar>, <HeroCanvas>, <HeroActions>, and <HeroAnnotations>.
 * ============================================================================
 */
export function HeroVariant1({
  className,
  text = "ui.satisium.com",
  badgeText = "Beta",
  prefixLength = 2,
  videoSrc = DEFAULT_VIDEO_URL,
  videoPoster,
  exploreHref = ROUTES.docsComponents,
  exploreText = "Explore components",
  repo = REPO,
}: HeroVariant1Props) {
  return (
    <Hero className={className}>
      <HeroTopBar />
      <HeroCanvas
        text={text}
        badgeText={badgeText}
        prefixLength={prefixLength}
      />
      <HeroActions
        videoSrc={videoSrc}
        videoPoster={videoPoster}
        exploreHref={exploreHref}
        exploreText={exploreText}
        repo={repo}
      />
      <HeroAnnotations />
    </Hero>
  )
}
