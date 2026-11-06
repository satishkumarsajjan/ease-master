"use client"

import { useMemo } from "react"
import { BezierConfig, SpringConfig } from "@/core/types"
import { mathToSvg } from "@/core/transform"
import { solveSpring } from "@/core/math/spring"

interface MiniGraphProps {
  mode: "bezier" | "spring"
  bezier?: BezierConfig
  spring?: SpringConfig
  className?: string
  dot?: { x: number; y: number }
  showDiagonal?: boolean
}

// Fixed small coordinate system for icons
const ICON_SIZE = { width: 100, height: 100, padding: 10 }

export const MiniGraph = ({
  mode,
  bezier,
  spring,
  className,
  dot,
  showDiagonal,
}: MiniGraphProps) => {
  const pathData = useMemo(() => {
    // 1. BEZIER LOGIC
    if (mode === "bezier" && bezier) {
      const start = mathToSvg({ x: 0, y: 0 }, ICON_SIZE)
      const end = mathToSvg({ x: 1, y: 1 }, ICON_SIZE)
      const p1 = mathToSvg(bezier.p1, ICON_SIZE)
      const p2 = mathToSvg(bezier.p2, ICON_SIZE)
      return `M ${start.x} ${start.y} C ${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${end.x} ${end.y}`
    }

    // 2. SPRING LOGIC
    if (mode === "spring" && spring) {
      // Lower precision for icons to save performance (we don't need 1000 points for a 40px icon)
      const result = solveSpring(
        spring.mass,
        spring.stiffness,
        spring.damping,
        spring.velocity,
        0.05
      )
      const points = result.points

      return points
        .map((val, index) => {
          const mathX = index / (points.length - 1)
          // Clamp visual Y for icons so they don't clip wildly
          const svgPoint = mathToSvg({ x: mathX, y: val }, ICON_SIZE)
          return `${index === 0 ? "M" : "L"} ${svgPoint.x} ${svgPoint.y}`
        })
        .join(" ")
    }

    return ""
  }, [mode, bezier, spring])

  return (
    <svg
      viewBox={`0 0 ${ICON_SIZE.width} ${ICON_SIZE.height}`}
      className={className}
      preserveAspectRatio="none"
      suppressHydrationWarning
    >
      {showDiagonal && (
        <line
          x1={mathToSvg({ x: 0, y: 0 }, ICON_SIZE).x}
          y1={mathToSvg({ x: 0, y: 0 }, ICON_SIZE).y}
          x2={mathToSvg({ x: 1, y: 1 }, ICON_SIZE).x}
          y2={mathToSvg({ x: 1, y: 1 }, ICON_SIZE).y}
          strokeDasharray="2 3"
          strokeWidth="1"
          className="stroke-muted"
        />
      )}
      <path
        d={pathData}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        suppressHydrationWarning
      />
      {dot && (
        <circle
          cx={
            mathToSvg(
              { x: Math.max(0, Math.min(1, dot.x)), y: dot.y },
              ICON_SIZE
            ).x
          }
          cy={
            mathToSvg(
              { x: Math.max(0, Math.min(1, dot.x)), y: dot.y },
              ICON_SIZE
            ).y
          }
          r={3.5}
          className="fill-foreground"
        />
      )}
    </svg>
  )
}
