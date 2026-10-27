"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
  Testimonials,
  TestimonialsHeader,
  TestimonialsEyebrow,
  TestimonialsTitle,
  TestimonialsDescription,
  TestimonialsMasonry,
  TestimonialsMasonryColumn,
  COLUMN_1_ITEMS,
  COLUMN_2_ITEMS,
  COLUMN_3_ITEMS,
  type TestimonialItem,
  type TestimonialPlatform,
} from "./testimonials"

export type { TestimonialItem, TestimonialPlatform }

export interface TestimonialsVariant2Props extends React.ComponentProps<"section"> {
  className?: string
  eyebrow?: string
  heading?: string
  description?: string
  column1Items?: TestimonialItem[]
  column2Items?: TestimonialItem[]
  column3Items?: TestimonialItem[]
}

export function TestimonialsVariant2({
  className,
  eyebrow = "VALIDATED AT SCALE",
  heading = "Built for teams with uncompromising standards.",
  description = "See how fast-moving engineering teams ship with Satisium's token-first architecture.",
  column1Items = COLUMN_1_ITEMS,
  column2Items = COLUMN_2_ITEMS,
  column3Items = COLUMN_3_ITEMS,
  ...props
}: TestimonialsVariant2Props) {
  return (
    <Testimonials
      id="testimonials-masonry"
      aria-label="Customer Testimonials Masonry"
      className={cn(className)}
      {...props}
    >
      {/* 1. TYPOGRAPHIC HEADER */}
      <TestimonialsHeader>
        {eyebrow && <TestimonialsEyebrow>{eyebrow}</TestimonialsEyebrow>}
        {heading && <TestimonialsTitle>{heading}</TestimonialsTitle>}
        {description && (
          <TestimonialsDescription>{description}</TestimonialsDescription>
        )}
      </TestimonialsHeader>

      {/* 2. KINETIC MASONRY STAGE (Counter-Current 3-Column Velocity Grid) */}
      <TestimonialsMasonry>
        {/* Column 1: Drifts Upward (-1.8% / ~28px/sec) */}
        <TestimonialsMasonryColumn
          items={column1Items}
          baseVelocity={-1.8}
          className="w-full"
        />

        {/* Column 2: Drifts Downward (+1.8% / ~28px/sec) — Counter-Current Flow (Visible sm+) */}
        <TestimonialsMasonryColumn
          items={column2Items}
          baseVelocity={1.8}
          className="hidden w-full sm:flex"
        />

        {/* Column 3: Drifts Upward with subtle parallax offset (-2.2% / ~35px/sec) (Visible lg+) */}
        <TestimonialsMasonryColumn
          items={column3Items}
          baseVelocity={-2.2}
          className="hidden w-full lg:flex"
        />
      </TestimonialsMasonry>
    </Testimonials>
  )
}
