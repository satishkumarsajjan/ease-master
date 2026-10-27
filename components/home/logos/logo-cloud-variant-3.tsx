"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
  TECH_STACK_LOGOS,
  PARTNER_LOGOS,
  type LogoItem,
} from "./logo-cloud-data"
import {
  LogoCloud,
  LogoCloudHeader,
  LogoCloudEyebrow,
  LogoCloudTitle,
  LogoCloudDescription,
  LogoCloudMarquee,
  LogoCloudItem,
  LogoCloudCallout,
  type LogoCloudProps,
  type LogoCloudSpeed,
} from "./logo-cloud"

export interface LogoCloudVariant3Props extends LogoCloudProps {
  eyebrow?: React.ReactNode
  title?: React.ReactNode
  description?: React.ReactNode
  track1Logos?: LogoItem[]
  track2Logos?: LogoItem[]
  speed?: LogoCloudSpeed
  showCallout?: boolean
  pauseOnHover?: boolean
}

export function LogoCloudVariant3({
  className,
  eyebrow,
  title = "Designed for the modern developer toolkit",
  description,
  track1Logos = TECH_STACK_LOGOS,
  track2Logos = PARTNER_LOGOS,
  speed = "normal",
  showCallout = false,
  pauseOnHover = true,
  children,
  ...props
}: LogoCloudVariant3Props) {
  return (
    <LogoCloud className={className} {...props}>
      {children ?? (
        <>
          {(eyebrow || title || description) && (
            <LogoCloudHeader>
              {eyebrow && <LogoCloudEyebrow>{eyebrow}</LogoCloudEyebrow>}
              {title && (
                <LogoCloudTitle
                  className={cn(
                    "text-xl font-medium tracking-tight text-foreground sm:text-2xl",
                    eyebrow && "mt-2"
                  )}
                >
                  {title}
                </LogoCloudTitle>
              )}
              {description && (
                <LogoCloudDescription>{description}</LogoCloudDescription>
              )}
            </LogoCloudHeader>
          )}

          <div className="flex flex-col gap-6 sm:gap-8">
            <LogoCloudMarquee
              direction="left"
              speed={speed}
              pauseOnHover={pauseOnHover}
            >
              {track1Logos.map((logo) => (
                <LogoCloudItem
                  key={logo.id}
                  name={logo.name}
                  icon={logo.icon}
                  href={logo.href}
                />
              ))}
            </LogoCloudMarquee>

            <LogoCloudMarquee
              direction="right"
              speed={speed}
              pauseOnHover={pauseOnHover}
            >
              {track2Logos.map((logo) => (
                <LogoCloudItem
                  key={logo.id}
                  name={logo.name}
                  icon={logo.icon}
                  href={logo.href}
                />
              ))}
            </LogoCloudMarquee>
          </div>

          {showCallout && <LogoCloudCallout />}
        </>
      )}
    </LogoCloud>
  )
}
