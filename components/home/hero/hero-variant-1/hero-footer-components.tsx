"use client"

import * as React from "react"
import { logger } from "@/lib/logger"
import { cn } from "@/lib/utils"
import { ROUTES } from "@/lib/routes"
import { motion } from "motion/react"
import Image from "next/image"
import Link from "next/link"
import { REPO } from "@/lib/social-links"

// ==========================================
// DATA HOOK: Live GitHub Stars (Zero-Key Safe)
// ==========================================
export function useGithubStars(repo: string = REPO) {
  const [stars, setStars] = React.useState<string>("...")

  React.useEffect(() => {
    let isMounted = true
    const fetchStars = async () => {
      try {
        const res = await fetch(`https://api.github.com/repos/${repo}`)
        if (!res.ok) {
          if (isMounted) setStars("1k+")
          return
        }
        const data = (await res.json()) as { stargazers_count?: number }
        if (data.stargazers_count && isMounted) {
          const formatted = Intl.NumberFormat("en-US", {
            notation: "compact",
            maximumFractionDigits: 1,
          }).format(data.stargazers_count)
          setStars(formatted)
        }
      } catch (error) {
        logger.error("Failed to fetch GitHub stars", error)
        if (isMounted) setStars("1k+")
      }
    }
    fetchStars()
    return () => {
      isMounted = false
    }
  }, [repo])

  return stars
}

// ==========================================
// 1. DESKTOP GITHUB BUTTON
// ==========================================
export function DesktopGithubButton({
  repo = REPO,
  className,
}: {
  repo?: string
  className?: string
}) {
  const stars = useGithubStars(repo)
  const [isHovered, setIsHovered] = React.useState(false)

  return (
    <a
      href={`https://github.com/${repo}`}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group flex h-[56px] items-center gap-4 px-2 transition-all focus-visible:outline-none",
        className
      )}
    >
      <div className="relative size-5 shrink-0 opacity-70 transition-opacity duration-300 group-hover:opacity-100">
        <Image
          src="/github-mark.svg"
          alt="GitHub"
          fill
          className="block object-contain dark:hidden"
        />
        <Image
          src="/github-mark-white.svg"
          alt="GitHub"
          fill
          className="hidden object-contain dark:block"
        />
      </div>

      <div className="relative h-[20px] overflow-hidden">
        <motion.div
          className="flex flex-col"
          initial={false}
          animate={{ y: isHovered ? -20 : 0 }}
          transition={{ type: "spring", bounce: 0, duration: 0.4 }}
        >
          <span className="flex h-[20px] items-center gap-1.5 font-sans text-sm font-semibold tracking-wide text-muted-foreground transition-colors group-hover:text-foreground">
            {stars}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="-mt-[1px] size-3.5 text-amber-500 drop-shadow-xs"
            >
              <path
                fillRule="evenodd"
                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                clipRule="evenodd"
              />
            </svg>
          </span>

          <span className="flex h-[20px] items-center gap-1.5 font-sans text-sm font-semibold tracking-wide text-primary">
            Star on GitHub
          </span>
        </motion.div>
      </div>
    </a>
  )
}

// ==========================================
// 2. MOBILE MEDIA CARD
// ==========================================
export interface MobileMediaCardProps {
  isRevealed?: boolean
  videoAspectRatio?: string
  buttonHeight?: number
  padding?: number
  gap?: number
  canvasRadius?: number
  videoRadius?: number
  buttonRadius?: number
  videoSrc?: string
  videoPoster?: string
  exploreText?: React.ReactNode
  exploreHref?: string
  repo?: string
  containerClassName?: string
  videoContainerClassName?: string
  actionRowClassName?: string
  exploreButtonClassName?: string
  githubButtonClassName?: string
}

export function MobileMediaCard({
  isRevealed = false,
  videoAspectRatio = "16 / 9",
  buttonHeight = 48,
  padding = 8,
  gap = 8,
  canvasRadius = 24,
  videoRadius = 16,
  buttonRadius = 16,
  videoSrc: propVideoSrc,
  videoPoster: propVideoPoster,
  exploreText = "Explore components",
  exploreHref = ROUTES.docsComponents,
  repo = REPO,
  containerClassName,
  videoContainerClassName,
  actionRowClassName,
  exploreButtonClassName,
  githubButtonClassName,
}: MobileMediaCardProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const stars = useGithubStars(repo)

  const effectiveVideoSrc = propVideoSrc || ""
  const effectivePoster = propVideoPoster || ""

  React.useEffect(() => {
    if (isRevealed && videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }, [isRevealed])

  const canvasBaseTransition = {
    duration: 0.4,
    ease: "easeOut" as const,
    delay: isRevealed ? 0 : 0.2,
  }

  const curtainTransition = {
    duration: 0.25,
    ease: "linear" as const,
    delay: isRevealed ? 0.2 : 0,
  }

  const growthTransition = {
    type: "spring" as const,
    bounce: 0,
    duration: 0.65,
    delay: isRevealed ? 0.15 : 0.05,
  }

  return (
    <div className={cn("relative flex w-full flex-col", containerClassName)}>
      {/* LAYER 1: CANVAS BACKGROUND */}
      <motion.div
        className="absolute inset-0 z-0 bg-muted"
        initial={false}
        animate={{
          opacity: isRevealed ? 1 : 0,
          borderRadius: isRevealed ? canvasRadius : buttonRadius,
        }}
        transition={canvasBaseTransition}
      />

      {/* LAYER 2: IN-FLOW CONTENT WRAPPER */}
      <motion.div
        className="relative z-10 flex w-full flex-col"
        initial={false}
        animate={{ padding: isRevealed ? padding : 0 }}
        transition={canvasBaseTransition}
      >
        {/* VIDEO EXPANSION */}
        <motion.div
          className="w-full origin-bottom overflow-hidden"
          initial={false}
          animate={{ height: isRevealed ? "auto" : 0 }}
          transition={growthTransition}
        >
          <div
            className="w-full"
            style={{
              paddingBottom: isRevealed ? gap : 0,
              transition: `padding ${growthTransition.duration}s`,
            }}
          >
            <motion.div
              className={cn(
                "relative w-full overflow-hidden bg-muted",
                videoContainerClassName
              )}
              style={{
                aspectRatio: videoAspectRatio,
                borderRadius: videoRadius,
              }}
              initial={false}
              animate={{ y: isRevealed ? 0 : "100%" }}
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

              {/* PRIMARY CURTAIN */}
              <motion.div
                className="absolute inset-0 z-30 bg-primary"
                initial={false}
                animate={{ opacity: isRevealed ? 0 : 1 }}
                transition={curtainTransition}
              />
            </motion.div>
          </div>
        </motion.div>

        {/* LAYER 3: ACTION BUTTON ROW */}
        <div
          className={cn(
            "relative z-20 flex w-full shrink-0 items-center justify-between",
            actionRowClassName
          )}
          style={{ height: buttonHeight, gap }}
        >
          <Link
            href={exploreHref}
            className={cn(
              "flex h-full w-[60%] shrink-0 cursor-pointer items-center justify-center bg-foreground px-2 text-background transition-transform focus-visible:outline-none active:scale-[0.98]",
              exploreButtonClassName
            )}
            style={{ borderRadius: buttonRadius }}
          >
            <span className="overflow-hidden font-heading text-[13px] font-medium tracking-wide text-ellipsis whitespace-nowrap">
              {exploreText}
            </span>
          </Link>

          <a
            href={`https://github.com/${repo}`}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "flex h-full flex-1 items-center justify-center gap-3 bg-transparent px-2 transition-transform focus-visible:outline-none active:scale-[0.98]",
              githubButtonClassName
            )}
            style={{ borderRadius: buttonRadius }}
          >
            <div className="relative size-4 shrink-0 opacity-70">
              <Image
                src="/github-mark.svg"
                alt="GitHub"
                fill
                className="block object-contain dark:hidden"
              />
              <Image
                src="/github-mark-white.svg"
                alt="GitHub"
                fill
                className="hidden object-contain dark:block"
              />
            </div>

            <span className="flex items-center gap-1.5 font-sans text-[13px] font-semibold tracking-wide text-muted-foreground">
              {stars}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="-mt-[1px] size-3.5 text-amber-500 drop-shadow-xs"
              >
                <path
                  fillRule="evenodd"
                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </a>
        </div>
      </motion.div>
    </div>
  )
}
