"use client"

import React, { useId } from "react"
import { cn } from "@/lib/utils"

export interface SatisiumLogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string
  housingColor?: string
  screenColor?: string
  primaryColor?: string
  glassOverlayColor?: string
  glassOpacity?: number
  noiseColor?: string
  blurAmount?: number
  noiseFrequency?: string
  noiseOctaves?: number
  noiseSeed?: number | string
}

export function SatisiumLogo({
  size = 100,
  housingColor = "#0F0F0F",
  screenColor = "#090909",
  primaryColor = "var(--primary, #F2470C)",
  glassOverlayColor = "black",
  glassOpacity = 0.15,
  noiseColor = "rgba(0, 0, 0, 0.25)",
  blurAmount = 12.5,
  noiseFrequency = "2 2",
  noiseOctaves = 3,
  noiseSeed = 7749,
  className,
  ...props
}: SatisiumLogoProps) {
  // Unique IDs for safe multiple-rendering on the same page
  const uniqueId = useId().replace(/:/g, "")
  const clipPathId = `glass-clip-${uniqueId}`
  const blurFilterId = `core-blur-${uniqueId}`
  const noiseFilterId = `glass-noise-${uniqueId}`

  // The exact SVG path for the bottom half of your inner screen
  const bottomHalfPath =
    "M4 54H104V76C104 91.464 91.464 104 76 104H32C16.536 104 4 91.464 4 76V54Z"

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 108 108"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      {...props}
    >
      <defs>
        {/* 1. Native SVG Blur */}
        {/* x, y, width, height are expanded so the blur doesn't hit artificial bounding boxes */}
        <filter id={blurFilterId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation={blurAmount / 2} />
        </filter>

        {/* 2. Native Noise Generation (from your exact Figma export) */}
        <filter
          id={noiseFilterId}
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feTurbulence
            type="fractalNoise"
            baseFrequency={noiseFrequency}
            stitchTiles="stitch"
            numOctaves={noiseOctaves}
            result="noise"
            seed={noiseSeed}
          />
          <feColorMatrix
            in="noise"
            type="luminanceToAlpha"
            result="alphaNoise"
          />
          <feComponentTransfer in="alphaNoise" result="coloredNoise1">
            <feFuncA
              type="discrete"
              tableValues="1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0"
            />
          </feComponentTransfer>
          <feComposite
            operator="in"
            in2="shape"
            in="coloredNoise1"
            result="noise1Clipped"
          />
          <feFlood floodColor={noiseColor} result="color1Flood" />
          <feComposite
            operator="in"
            in2="noise1Clipped"
            in="color1Flood"
            result="color1"
          />
          <feMerge result={`effect_${uniqueId}`}>
            <feMergeNode in="shape" />
            <feMergeNode in="color1" />
          </feMerge>
        </filter>

        {/* 3. The Clipping Mask for the glass area */}
        <clipPath id={clipPathId}>
          <path d={bottomHalfPath} />
        </clipPath>
      </defs>

      {/* --- TOP LAYER: CRISP SHAPES --- */}
      {/* Outer Housing */}
      <rect width="108" height="108" rx="32" fill={housingColor} />
      {/* Inner Screen */}
      <rect x="4" y="4" width="100" height="100" rx="28" fill={screenColor} />
      {/* Top Flame (Sharp) */}
      <rect x="29" y="29" width="50" height="50" rx="25" fill={primaryColor} />

      {/* --- BOTTOM LAYER: FROSTED GLASS COMPOSITE --- */}
      {/* This group is strictly masked to the exact shape of the bottom half */}
      <g clipPath={`url(#${clipPathId})`}>
        {/* A. Redraw the screen base so the blur mixes perfectly into the dark background, preventing white bleed */}
        <rect x="4" y="4" width="100" height="100" rx="28" fill={screenColor} />

        {/* B. Draw the blurred flame. It fades naturally outward with NO rectangular cutoff */}
        <rect
          x="29"
          y="29"
          width="50"
          height="50"
          rx="25"
          fill={primaryColor}
          filter={`url(#${blurFilterId})`}
        />

        {/* C. Apply the glass dark tint shadow */}
        <path
          d={bottomHalfPath}
          fill={glassOverlayColor}
          fillOpacity={glassOpacity}
        />

        {/* D. Apply the noise texture */}
        <path d={bottomHalfPath} filter={`url(#${noiseFilterId})`} />
      </g>
    </svg>
  )
}
