"use client"

import * as React from "react"
import { CURATED_GRID_LOGOS, type LogoItem } from "./logo-cloud-data"
import {
  LogoCloud,
  LogoCloudHeader,
  LogoCloudEyebrow,
  LogoCloudTitle,
  LogoCloudGrid,
  LogoCloudItem,
  type LogoCloudProps,
} from "./logo-cloud"

export interface LogoCloudVariant2Props extends LogoCloudProps {
  eyebrow?: React.ReactNode
  title?: React.ReactNode
  logos?: LogoItem[]
  columns?: 4 | 6
  showNames?: boolean
}

export function LogoCloudVariant2({
  className,
  eyebrow = "Integrated across the modern stack",
  title,
  logos = CURATED_GRID_LOGOS,
  columns = 6,
  showNames = true,
  children,
  ...props
}: LogoCloudVariant2Props) {
  return (
    <LogoCloud className={className} {...props}>
      {children ?? (
        <>
          {(eyebrow || title) && (
            <LogoCloudHeader>
              {eyebrow && <LogoCloudEyebrow>{eyebrow}</LogoCloudEyebrow>}
              {title && <LogoCloudTitle>{title}</LogoCloudTitle>}
            </LogoCloudHeader>
          )}

          <LogoCloudGrid columns={columns}>
            {logos.map((logo) => (
              <LogoCloudItem
                key={logo.id}
                name={logo.name}
                icon={logo.icon}
                href={logo.href}
                showName={showNames}
              />
            ))}
          </LogoCloudGrid>
        </>
      )}
    </LogoCloud>
  )
}
