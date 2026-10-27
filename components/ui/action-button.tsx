"use client"

import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { type VariantProps } from "class-variance-authority"
import { AnimatePresence, motion } from "motion/react"
import Link from "next/link"
import React, { useState } from "react"

export interface ActionButtonProps
  extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  label: string
  icon?: React.ReactNode
  successLabel?: string
  successIcon?: React.ReactNode
  actionTimeout?: number
  href?: string
  isExternal?: boolean
}

export const ActionButton = React.forwardRef<
  HTMLButtonElement,
  ActionButtonProps
>(
  (
    {
      label,
      icon,
      successLabel,
      successIcon,
      actionTimeout = 2000,
      href,
      isExternal,
      onClick,
      className,
      variant = "default",
      size = "default",
      ...props
    },
    ref
  ) => {
    const [isSuccess, setIsSuccess] = useState(false)

    const handleClick = async (e: React.MouseEvent<HTMLElement>) => {
      if (onClick) {
        await Promise.resolve(onClick(e as React.MouseEvent<HTMLButtonElement>))
      }

      if (successLabel) {
        setIsSuccess(true)
        setTimeout(() => setIsSuccess(false), actionTimeout)
      }
    }

    const InnerContent = () => (
      <div className="relative grid items-center justify-items-center">
        {/* Ghost layer for default sizing (keeps width perfectly stable) */}
        <div className="invisible col-start-1 row-start-1 flex items-center gap-1.5">
          {icon && <span className="inline-flex shrink-0">{icon}</span>}
          <span className="sr-only truncate tracking-wide sm:not-sr-only sm:inline-block">
            {label}
          </span>
        </div>

        {/* Ghost layer for success sizing (keeps width perfectly stable) */}
        {successLabel && (
          <div className="invisible col-start-1 row-start-1 flex items-center gap-1.5">
            {successIcon && (
              <span className="inline-flex shrink-0">{successIcon}</span>
            )}
            <span className="sr-only truncate tracking-wide sm:not-sr-only sm:inline-block">
              {successLabel}
            </span>
          </div>
        )}

        {/* 🌟 The Snappy Scale Animation */}
        <AnimatePresence mode="wait" initial={false}>
          {isSuccess && successLabel ? (
            <motion.div
              key="success"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="col-start-1 row-start-1 flex items-center gap-1.5 text-emerald-500 dark:text-emerald-400"
            >
              {successIcon && (
                <span className="inline-flex shrink-0">{successIcon}</span>
              )}
              <span className="sr-only truncate tracking-wide sm:not-sr-only sm:inline-block">
                {successLabel}
              </span>
            </motion.div>
          ) : (
            <motion.div
              key="default"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="col-start-1 row-start-1 flex items-center gap-1.5"
            >
              {icon && (
                <span className="inline-flex shrink-0 transition-transform duration-300 ease-out">
                  {icon}
                </span>
              )}
              <span className="sr-only truncate tracking-wide sm:not-sr-only sm:inline-block">
                {label}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )

    const baseClasses = cn(
      "group cursor-pointer overflow-hidden rounded-[12px] border border-border bg-muted text-xs drop-shadow-2xl ease-out hover:bg-background dark:drop-shadow-none",
      className
    )

    const handleAnchorClick: React.MouseEventHandler<HTMLAnchorElement> = (
      e
    ) => {
      void handleClick(e)
    }

    const handleButtonClick: React.MouseEventHandler<HTMLButtonElement> = (
      e
    ) => {
      void handleClick(e)
    }

    if (href) {
      return (
        <Button
          asChild
          variant={variant}
          size={size}
          className={baseClasses}
          {...props}
        >
          <Link
            href={href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            onClick={handleAnchorClick}
            title={label}
          >
            <InnerContent />
          </Link>
        </Button>
      )
    }

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={baseClasses}
        onClick={handleButtonClick}
        disabled={props.disabled || isSuccess}
        title={label}
        {...props}
      >
        <InnerContent />
      </Button>
    )
  }
)
ActionButton.displayName = "ActionButton"
