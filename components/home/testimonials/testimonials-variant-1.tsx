"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
  Testimonials,
  TestimonialsHeader,
  TestimonialsEyebrow,
  TestimonialsTitle,
  TestimonialsDescription,
  TestimonialsMarquee,
  TestimonialsVelocityTrack,
  ROW_1_TESTIMONIALS,
  ROW_2_TESTIMONIALS,
  type TestimonialItem,
  type TestimonialPlatform,
} from "./testimonials"

export type { TestimonialItem, TestimonialPlatform }

export interface TestimonialsVariant1Props extends React.ComponentProps<"section"> {
  className?: string
  eyebrow?: string
  heading?: string
  description?: string
  row1Items?: TestimonialItem[]
  row2Items?: TestimonialItem[]
}

export function TestimonialsVariant1({
  className,
  eyebrow = "PROOF & MOMENTUM",
  heading = "Crafted for engineers who value precision.",
  description = "What teams and independent builders are saying about Satisium.",
  row1Items = ROW_1_TESTIMONIALS,
  row2Items = ROW_2_TESTIMONIALS,
  ...props
}: TestimonialsVariant1Props) {
  return (
    <Testimonials className={cn(className)} {...props}>
      {/* 1. TYPOGRAPHIC HEADER */}
      <TestimonialsHeader>
        {eyebrow && <TestimonialsEyebrow>{eyebrow}</TestimonialsEyebrow>}
        {heading && <TestimonialsTitle>{heading}</TestimonialsTitle>}
        {description && (
          <TestimonialsDescription>{description}</TestimonialsDescription>
        )}
      </TestimonialsHeader>

      {/* 2. DUAL-TRACK VELOCITY MARQUEE STREAM */}
      <TestimonialsMarquee>
        <TestimonialsVelocityTrack items={row1Items} baseVelocity={-0.65} />
        <TestimonialsVelocityTrack items={row2Items} baseVelocity={0.65} />
      </TestimonialsMarquee>
    </Testimonials>
  )
}
