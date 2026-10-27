"use client"

import * as React from "react"
import { DEFAULT_LOGOS, type LogoItem } from "./logo-cloud-data"
import {
  LogoCloud,
  LogoCloudHeader,
  LogoCloudEyebrow,
  LogoCloudTitle,
  LogoCloudDescription,
  LogoCloudMarquee,
  LogoCloudItem,
  type LogoCloudProps,
  type LogoCloudSpeed,
} from "./logo-cloud"

export interface LogoCloudVariant1Props extends LogoCloudProps {
  eyebrow?: React.ReactNode
  title?: React.ReactNode
  description?: React.ReactNode
  logos?: LogoItem[]
  speed?: LogoCloudSpeed
  showNames?: boolean
  pauseOnHover?: boolean
  hoverBehavior?: "slow-mo" | "pause"
}

export function LogoCloudVariant1({
  className,
  eyebrow = "Powered by modern web primitives",
  title,
  description,
  logos = DEFAULT_LOGOS,
  speed = "normal",
  showNames = true,
  pauseOnHover = true,
  hoverBehavior = "slow-mo",
  children,
  ...props
}: LogoCloudVariant1Props) {
  return (
    <LogoCloud className={className} {...props}>
      {children ?? (
        <>
          {(eyebrow || title || description) && (
            <LogoCloudHeader>
              {eyebrow && <LogoCloudEyebrow>{eyebrow}</LogoCloudEyebrow>}
              {title && <LogoCloudTitle>{title}</LogoCloudTitle>}
              {description && (
                <LogoCloudDescription>{description}</LogoCloudDescription>
              )}
            </LogoCloudHeader>
          )}

          <LogoCloudMarquee
            speed={speed}
            pauseOnHover={pauseOnHover}
            hoverBehavior={hoverBehavior}
          >
            {logos.map((logo) => (
              <LogoCloudItem
                key={logo.id}
                name={logo.name}
                icon={logo.icon}
                href={logo.href}
                showName={showNames}
              />
            ))}
          </LogoCloudMarquee>
        </>
      )}
    </LogoCloud>
  )
}
