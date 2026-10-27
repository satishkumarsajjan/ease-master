"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
  Faq,
  FaqHeader,
  FaqEyebrow,
  FaqTitle,
  FaqDescription,
  FaqList,
  FaqItem,
  FaqTrigger,
  FaqContent,
  FormattedFaqAnswer,
  ESSENTIAL_FAQS,
  type MinimalFaqItem as MinimalFaqItemType,
  type FaqProps,
} from "./faq"

export type { MinimalFaqItem } from "./faq"

export interface FaqVariant2Props extends Omit<FaqProps, "children"> {
  eyebrow?: string
  heading?: string
  description?: string
  items?: MinimalFaqItemType[]
  children?: React.ReactNode
}

/* ==========================================================================
   PRESET WRAPPER: FAQ VARIANT 2 (Centered Minimalist Essential 5)
   ========================================================================== */

export function FaqVariant2({
  className,
  eyebrow = "FREQUENTLY ASKED QUESTIONS",
  heading = "Answers to common inquiries.",
  description = "Short, direct answers to the most important questions about Satisium.",
  type = "single",
  allowMultiple,
  defaultOpenId = "essential-difference",
  items = ESSENTIAL_FAQS,
  children,
  ...props
}: FaqVariant2Props) {
  return (
    <Faq
      id="faq-minimal"
      type={type}
      allowMultiple={allowMultiple}
      defaultOpenId={defaultOpenId}
      jsonLdItems={items}
      className={cn(
        "relative mx-auto flex w-full max-w-3xl flex-col items-center px-0 select-none sm:px-6",
        className
      )}
      {...props}
    >
      {children ?? (
        <>
          {/* 1. TYPOGRAPHIC HEADER */}
          <FaqHeader align="center">
            {eyebrow && <FaqEyebrow>{eyebrow}</FaqEyebrow>}
            {heading && <FaqTitle>{heading}</FaqTitle>}
            {description && (
              <FaqDescription className="max-w-md">
                {description}
              </FaqDescription>
            )}
          </FaqHeader>

          {/* 2. THE ESSENTIAL 5 ACCORDION STACK */}
          <FaqList className="mt-10 flex w-full flex-col space-y-3 sm:mt-12 sm:space-y-3.5">
            {items.map((faq) => (
              <FaqItem
                key={faq.id}
                value={faq.id}
                className="bg-muted hover:bg-secondary"
              >
                <FaqTrigger className="items-center p-5 sm:p-5.5">
                  <span className="font-heading text-xs font-semibold tracking-tight text-foreground sm:text-[14px]">
                    {faq.question}
                  </span>
                </FaqTrigger>
                <FaqContent className="px-5 pt-0 pb-5 sm:px-5.5 sm:pb-6">
                  <FormattedFaqAnswer text={faq.answer} />
                </FaqContent>
              </FaqItem>
            ))}
          </FaqList>
        </>
      )}
    </Faq>
  )
}
