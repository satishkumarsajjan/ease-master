"use client"

import * as React from "react"
import { motion } from "motion/react"
import { SPRING } from "@/lib/motion"
import {
  Faq,
  FaqHeader,
  FaqEyebrow,
  FaqTitle,
  FaqDescription,
  FaqCategoryTabs,
  FaqContactDock,
  FaqList,
  FaqItem,
  FaqTrigger,
  FaqContent,
  useFaq,
  FAQ_ITEMS,
  type FaqItem as FaqItemType,
  type FaqProps,
} from "./faq"

export type { FaqItem, FaqCategory } from "./faq"

export interface FaqVariant1Props extends Omit<FaqProps, "children"> {
  eyebrow?: string
  heading?: string
  description?: string
  items?: FaqItemType[]
  children?: React.ReactNode
}

/* ==========================================================================
   INTERNAL COMPONENT: ACCORDION LIST WITH CATEGORY FILTERING & REFLOW
   ========================================================================== */

export function FaqV1AccordionList({
  items = FAQ_ITEMS,
  className,
}: {
  items?: FaqItemType[]
  className?: string
}) {
  const { selectedCategory } = useFaq()

  const filteredItems = React.useMemo(() => {
    if (selectedCategory === "all") return items
    return items.filter((item) => item.category === selectedCategory)
  }, [items, selectedCategory])

  return (
    <FaqList
      animateLayout
      className={className ?? "relative flex flex-col space-y-3 lg:col-span-8"}
    >
      {filteredItems.map((item) => (
        <motion.div
          key={item.id}
          layout="position"
          initial={{ opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.98 }}
          transition={SPRING.card}
          className="w-full"
        >
          <FaqItem
            value={item.id}
            category={item.category}
            categoryLabel={item.categoryLabel}
          >
            <FaqTrigger question={item.question} />
            <FaqContent answer={item.answer} codeSnippet={item.codeSnippet} />
          </FaqItem>
        </motion.div>
      ))}
    </FaqList>
  )
}

/* ==========================================================================
   PRESET WRAPPER: FAQ VARIANT 1 (2-Column Editorial Anchor Layout)
   ========================================================================== */

export function FaqVariant1({
  className,
  eyebrow = "SPECIFICATIONS & OBJECTIONS",
  heading = "Everything you need to know.",
  description = "Detailed architectural answers, licensing terms, and integration patterns for engineers and technical decision-makers.",
  type = "single",
  allowMultiple,
  items = FAQ_ITEMS,
  children,
  ...props
}: FaqVariant1Props) {
  return (
    <Faq
      type={type}
      allowMultiple={allowMultiple}
      className={className}
      jsonLdItems={items}
      {...props}
    >
      {children ?? (
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
          {/* LEFT COLUMN: STICKY EDITORIAL ANCHOR & CATEGORY SWITCHER */}
          <div className="flex flex-col lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
            <FaqHeader>
              {eyebrow && <FaqEyebrow>{eyebrow}</FaqEyebrow>}
              {heading && <FaqTitle>{heading}</FaqTitle>}
              {description && <FaqDescription>{description}</FaqDescription>}
            </FaqHeader>

            <FaqCategoryTabs className="mt-6 flex flex-wrap gap-1.5 lg:flex-col lg:gap-1" />
            <FaqContactDock className="mt-8" />
          </div>

          {/* RIGHT COLUMN: EXPANDING ACCORDION STACK */}
          <FaqV1AccordionList items={items} />
        </div>
      )}
    </Faq>
  )
}
