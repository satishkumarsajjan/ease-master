"use client"

import * as React from "react"
import {
  ArrowUpRight01Icon,
  ArrowLeft01Icon,
  Search01Icon,
  Cancel01Icon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { MiniGraph } from "@/components/ui/mini-graph"
import { BEZIER_PRESETS, SPRING_PRESETS } from "@/core/presets"
import { BezierConfig, SpringConfig } from "@/core/types"
import { cn } from "@/lib/utils"
import {
  BEZIER_FAMILIES,
  SPRING_FAMILIES,
  POPULAR_PRESET_IDS,
} from "@/components/studio/domain/studio-curves"
import { resolveEase } from "@/components/studio/domain/studio-kinetics"
import { useStudioStore } from "@/store/useStudioStore"
import { PresetCurveStage } from "./preset-curve-stage"

export function PresetCatalog() {
  const activeEngine = useStudioStore((s) => s.activeEngine)
  const activePresetId = useStudioStore((s) => s.activeCurveId)
  const customCurves = useStudioStore((s) => s.customCurves)
  const navStack = useStudioStore((s) => s.navStack)
  const selectEase = useStudioStore((s) => s.selectEase)
  const setNavStack = useStudioStore((s) => s.setNavStack)
  const forkCurve = useStudioStore((s) => s.forkCurve)
  const addVariant = useStudioStore((s) => s.addVariant)
  const addFlavor = useStudioStore((s) => s.addFlavor)

  const [searchQuery, setSearchQuery] = React.useState<string>("")
  const [catalogFilter, setCatalogFilter] = React.useState<"all" | "popular">(
    "all"
  )

  const activeDossier = React.useMemo(() => {
    return navStack.level === 1
      ? resolveEase(navStack.curveId, customCurves)
      : undefined
  }, [navStack, customCurves])

  const currentCurve =
    navStack.level !== 0
      ? customCurves.find((c) => c.id === navStack.curveId)
      : undefined

  const currentVariant =
    navStack.level === 2 && currentCurve?.variants
      ? currentCurve.variants.find((v) => v.id === navStack.variantId)
      : undefined

  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [isScrolledTop, setIsScrolledTop] = React.useState(false)
  const [isScrolledBottom, setIsScrolledBottom] = React.useState(false)

  // Level 1 detail slide dynamic scroll mask state
  const detailScrollRef = React.useRef<HTMLDivElement>(null)
  const [detailScrollState, setDetailScrollState] = React.useState<{
    canScrollUp: boolean
    canScrollDown: boolean
  }>({
    canScrollUp: false,
    canScrollDown: false,
  })

  const updateDetailScrollState = React.useCallback(() => {
    const el = detailScrollRef.current
    if (!el) return

    const { scrollTop, scrollHeight, clientHeight } = el
    const maxScroll = scrollHeight - clientHeight
    const hasOverflow = maxScroll > 2

    setDetailScrollState({
      canScrollUp: hasOverflow && scrollTop > 2,
      canScrollDown: hasOverflow && scrollTop < maxScroll - 2,
    })
  }, [])

  React.useEffect(() => {
    updateDetailScrollState()
  }, [activeDossier, navStack, updateDetailScrollState])

  React.useEffect(() => {
    const el = detailScrollRef.current
    if (!el) return

    updateDetailScrollState()

    const ro = new ResizeObserver(() => {
      updateDetailScrollState()
    })
    ro.observe(el)

    return () => ro.disconnect()
  }, [updateDetailScrollState])

  const detailMaskStyle = React.useMemo<React.CSSProperties>(() => {
    const { canScrollUp, canScrollDown } = detailScrollState
    if (!canScrollUp && !canScrollDown) {
      return {}
    }

    const fadeSize = "16px"

    let mask = ""
    if (canScrollUp && canScrollDown) {
      mask = `linear-gradient(to bottom, transparent 0px, black ${fadeSize}, black calc(100% - ${fadeSize}), transparent 100%)`
    } else if (canScrollUp) {
      mask = `linear-gradient(to bottom, transparent 0px, black ${fadeSize}, black 100%)`
    } else if (canScrollDown) {
      mask = `linear-gradient(to bottom, black 0%, black calc(100% - ${fadeSize}), transparent 100%)`
    }

    return {
      WebkitMaskImage: mask,
      maskImage: mask,
    }
  }, [detailScrollState])

  const checkScroll = React.useCallback(() => {
    if (!scrollRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
    setIsScrolledTop(scrollTop > 0)
    setIsScrolledBottom(Math.ceil(scrollTop + clientHeight) < scrollHeight - 1)
  }, [])

  React.useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    checkScroll()
    const ro = new ResizeObserver(() => checkScroll())
    const mo = new MutationObserver(() => checkScroll())
    ro.observe(el)
    mo.observe(el, { childList: true, subtree: true, attributes: true })
    return () => {
      ro.disconnect()
      mo.disconnect()
    }
  }, [checkScroll])

  const groupedSystemPresets = React.useMemo(() => {
    const list = activeEngine === "bezier" ? BEZIER_PRESETS : SPRING_PRESETS
    const families =
      activeEngine === "bezier" ? BEZIER_FAMILIES : SPRING_FAMILIES
    const query = searchQuery.trim().toLowerCase()

    const filtered = list.filter((p) => {
      if (catalogFilter === "popular" && !POPULAR_PRESET_IDS.has(p.id)) {
        return false
      }
      if (!query) return true
      const matchName = p.label.toLowerCase().includes(query)
      const matchDesc = p.description.toLowerCase().includes(query)
      const matchUse = p.useCases.some((u) => u.toLowerCase().includes(query))
      return matchName || matchDesc || matchUse
    })

    const filteredMap = new Map(filtered.map((p) => [p.id, p]))

    const groups = families
      .map((f) => ({
        id: f.id,
        label: f.label,
        presets: f.presetIds
          .map((id) => filteredMap.get(id))
          .filter((p): p is (typeof list)[number] => p !== undefined),
      }))
      .filter((g) => g.presets.length > 0)

    const assignedIds = new Set(families.flatMap((f) => f.presetIds))
    const unassigned = filtered.filter((p) => !assignedIds.has(p.id))
    if (unassigned.length > 0) {
      groups.push({
        id: "other",
        label: "Additional Curves",
        presets: unassigned,
      })
    }

    const totalCount = groups.reduce((acc, g) => acc + g.presets.length, 0)

    return { groups, totalCount }
  }, [activeEngine, searchQuery, catalogFilter])

  return (
    <div className="relative min-h-0 w-full flex-1 overflow-hidden">
      {/* LEVEL 0: ROOT CATALOG BLOCK (THE PHYSICAL MONOLITHIC SLAB) */}
      <section
        aria-label="Preset Catalog"
        className={cn(
          "absolute inset-0 flex flex-col rounded-[20px] bg-background p-2.5 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] select-none",
          navStack.level === 0
            ? "pointer-events-auto translate-x-0"
            : "pointer-events-none -translate-x-[calc(100%+8px)]"
        )}
      >
        {/* 1. APEX: CUSTOM CURVES */}
        {customCurves.length > 0 && (
          <div className="mb-1 flex shrink-0 flex-col gap-1.5 pb-3.5">
            <div className="flex items-center justify-between px-0.5">
              <span className="font-heading text-xs font-semibold text-foreground">
                Custom curves
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              {customCurves.map((curve) => {
                const isSelected =
                  activePresetId === curve.id ||
                  Boolean(
                    curve.variants?.some(
                      (v) =>
                        v.id === activePresetId ||
                        v.variants?.some((sv) => sv.id === activePresetId)
                    )
                  )
                const variantCount = curve.variants?.length ?? 0

                return (
                  <div
                    key={curve.id}
                    className="group relative flex w-full flex-col"
                  >
                    <button
                      type="button"
                      onClick={() => selectEase(curve.id, { audition: true })}
                      onDoubleClick={() =>
                        selectEase(curve.id, {
                          audition: true,
                          openSlide: true,
                        })
                      }
                      title={
                        variantCount > 0
                          ? `${curve.name} · Click to audition · Double-click to expand variants`
                          : `${curve.name} · Click to audition · Double-click to expand`
                      }
                      className={cn(
                        "relative flex w-full cursor-pointer flex-col items-center rounded-[10px] p-0.5 transition-all",
                        isSelected
                          ? "bg-foreground text-background"
                          : "bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground"
                      )}
                    >
                      {/* Inner Mini Graph Box */}
                      <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-[8px] bg-background p-1">
                        {variantCount > 0 && (
                          <span className="pointer-events-none absolute top-1 left-1.5 font-sans text-[9px] font-semibold tracking-tight text-muted-foreground">
                            +{variantCount}
                          </span>
                        )}

                        <MiniGraph
                          mode={curve.engine}
                          bezier={curve.bezier}
                          spring={curve.spring}
                          className={cn(
                            "h-full w-full stroke-2 transition-colors",
                            isSelected
                              ? "stroke-foreground"
                              : "stroke-muted-foreground group-hover:stroke-foreground"
                          )}
                        />
                      </div>

                      {/* Grounded Name Strip in Outer Box */}
                      <div className="flex h-4.5 w-full items-center justify-center px-0.5">
                        <span className="truncate font-sans text-[10px] leading-none font-medium tracking-tight">
                          {curve.name}
                        </span>
                      </div>
                    </button>

                    {/* Quick Inspect Button on Hover (Top-Right of Inner Box) */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        selectEase(curve.id, {
                          audition: true,
                          openSlide: true,
                        })
                      }}
                      title="Open Ease Studio"
                      className="absolute top-1.5 right-1.5 z-10 flex size-4 cursor-pointer items-center justify-center rounded-[4px] bg-background text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground"
                    >
                      <HugeiconsIcon
                        icon={ArrowUpRight01Icon}
                        className="size-2.5"
                      />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* 2. LIBRARY QUERY CONTROLS (ENGINE SWITCHER + SEARCH + CATEGORY FILTER) */}
        <div className="flex shrink-0 flex-col gap-1.5 pt-0.5">
          {/* Engine Switcher */}
          <div className="flex h-7 w-full shrink-0 items-center rounded-[10px] bg-muted p-0.5">
            <button
              type="button"
              onClick={() => {
                selectEase("ease", { audition: true })
              }}
              className={cn(
                "h-full flex-1 cursor-pointer rounded-[8px] text-center font-heading text-[11px] font-medium transition-colors",
                activeEngine === "bezier"
                  ? "bg-background text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Bezier ({BEZIER_PRESETS.length})
            </button>
            <button
              type="button"
              onClick={() => {
                selectEase("button", { audition: true })
              }}
              className={cn(
                "h-full flex-1 cursor-pointer rounded-[8px] text-center font-heading text-[11px] font-medium transition-colors",
                activeEngine === "spring"
                  ? "bg-background text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Spring ({SPRING_PRESETS.length})
            </button>
          </div>

          {/* Flush Search Bar */}
          <div className="relative flex h-7 w-full shrink-0 items-center">
            <HugeiconsIcon
              icon={Search01Icon}
              className="pointer-events-none absolute left-2 size-3.5 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search curves..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-7 w-full rounded-[8px] bg-muted pr-7 pl-7 font-sans text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2 cursor-pointer text-muted-foreground hover:text-foreground"
              >
                <HugeiconsIcon icon={Cancel01Icon} className="size-3" />
              </button>
            )}
          </div>
        </div>

        {/* 3. LIBRARY HEADER + FILTER DOCK */}
        <div className="mt-2.5 flex h-5 shrink-0 items-center justify-between px-0.5">
          <div className="flex items-center gap-1.5">
            <span className="font-heading text-xs font-semibold text-foreground">
              Library
            </span>
            <span className="font-sans text-[11px] font-normal text-muted-foreground">
              ({groupedSystemPresets.totalCount})
            </span>
          </div>

          {/* All vs Popular Filter Pill */}
          <div className="flex h-5 items-center rounded-[6px] bg-muted p-0.5 font-sans text-[10px]">
            <button
              type="button"
              onClick={() => setCatalogFilter("all")}
              className={cn(
                "cursor-pointer rounded-[4px] px-1.5 py-0.5 transition-colors",
                catalogFilter === "all"
                  ? "bg-background font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setCatalogFilter("popular")}
              className={cn(
                "cursor-pointer rounded-[4px] px-1.5 py-0.5 transition-colors",
                catalogFilter === "popular"
                  ? "bg-background font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              ★ Popular
            </button>
          </div>
        </div>

        {/* 4. SCROLLABLE LIBRARY GRID WITH PROGRESSIVE BLUR VIGNETTES */}
        <div className="relative mt-1.5 flex min-h-0 flex-1 flex-col overflow-hidden">
          {/* Top Progressive Blur Vignette */}
          <div
            aria-hidden="true"
            className={cn(
              "progressive-blur-top pointer-events-none absolute top-0 right-0 left-0 z-20 h-6 transition-opacity duration-300 select-none",
              isScrolledTop ? "opacity-100" : "opacity-0"
            )}
          />

          {/* Scrollable Container (Zero Scrollbar) */}
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="no-scrollbar min-h-0 flex-1 overflow-y-auto pt-0.5 pb-2"
          >
            {groupedSystemPresets.totalCount === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="mb-2 flex size-9 items-center justify-center rounded-[10px] bg-muted text-muted-foreground">
                  <HugeiconsIcon icon={Search01Icon} className="size-4" />
                </div>
                <span className="font-heading text-xs font-semibold text-foreground">
                  No curves found
                </span>
                <p className="mt-0.5 font-sans text-[11px] text-muted-foreground">
                  {searchQuery
                    ? `No matches for "${searchQuery}"`
                    : "No curves in this view"}
                </p>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="mt-2.5 cursor-pointer rounded-[6px] bg-secondary px-2.5 py-1 font-sans text-[11px] font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {groupedSystemPresets.groups.map((group) => (
                  <div key={group.id} className="flex flex-col gap-1.5">
                    {/* Family Section Subhead */}
                    <div className="flex items-center justify-between px-0.5 pt-0.5">
                      <span className="font-heading text-[11px] font-semibold text-muted-foreground">
                        {group.label}
                      </span>
                      <span className="font-sans text-[10px] text-muted-foreground">
                        {group.presets.length}
                      </span>
                    </div>

                    {/* 3-Column Squircle Grid */}
                    <div className="grid grid-cols-3 gap-1.5">
                      {group.presets.map((item) => {
                        const isActive = activePresetId === item.id
                        return (
                          <div
                            key={item.id}
                            className="group relative flex w-full flex-col"
                          >
                            <button
                              type="button"
                              onClick={() => {
                                selectEase(item.id, { audition: true })
                              }}
                              onDoubleClick={() =>
                                selectEase(item.id, {
                                  audition: true,
                                  openSlide: true,
                                })
                              }
                              title={`${item.label} · Click to audition · Double-click to open slide`}
                              className={cn(
                                "relative flex w-full cursor-pointer flex-col items-center rounded-[10px] p-0.5 transition-all",
                                isActive
                                  ? "bg-foreground text-background"
                                  : "bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground"
                              )}
                            >
                              {/* Inner Mini Graph Box (Screen) */}
                              <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-[8px] bg-background p-1">
                                <MiniGraph
                                  mode={activeEngine}
                                  bezier={
                                    activeEngine === "bezier"
                                      ? (item.value as BezierConfig)
                                      : undefined
                                  }
                                  spring={
                                    activeEngine === "spring"
                                      ? (item.value as unknown as SpringConfig)
                                      : undefined
                                  }
                                  className={cn(
                                    "h-full w-full stroke-2 transition-colors",
                                    isActive
                                      ? "stroke-foreground"
                                      : "stroke-muted-foreground group-hover:stroke-foreground"
                                  )}
                                />
                              </div>

                              {/* Grounded Name Strip in Outer Box */}
                              <div className="flex h-4.5 w-full items-center justify-center px-0.5">
                                <span className="truncate font-sans text-[10px] leading-none font-medium tracking-tight">
                                  {item.label}
                                </span>
                              </div>
                            </button>

                            {/* Quick Inspect Button on Hover (Top-Right of Inner Box) */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                selectEase(item.id, {
                                  audition: true,
                                  openSlide: true,
                                })
                              }}
                              title={`Open ${item.label} slide`}
                              className="absolute top-1.5 right-1.5 z-10 flex size-4 cursor-pointer items-center justify-center rounded-[4px] bg-background text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground"
                            >
                              <HugeiconsIcon
                                icon={ArrowUpRight01Icon}
                                className="size-2.5"
                              />
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Progressive Blur Vignette */}
          <div
            aria-hidden="true"
            className={cn(
              "progressive-blur-bottom pointer-events-none absolute right-0 bottom-0 left-0 z-20 h-8 transition-opacity duration-300 select-none",
              isScrolledBottom ? "opacity-100" : "opacity-0"
            )}
          />
        </div>
      </section>

      {/* LEVEL 1: EASE STUDIO BLOCK (THE PHYSICAL MONOLITHIC SLAB) */}
      <section
        aria-label="Ease Studio"
        className={cn(
          "absolute inset-0 flex flex-col rounded-[20px] bg-background p-2.5 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] select-none",
          navStack.level === 1
            ? "pointer-events-auto translate-x-0"
            : navStack.level === 0
              ? "pointer-events-none translate-x-[calc(100%+8px)]"
              : "pointer-events-none -translate-x-[calc(100%+8px)]"
        )}
      >
        {activeDossier && (
          <div className="flex h-full min-h-0 flex-col select-none">
            {/* TIER 1: PINNED TOP NAVIGATION BAR (shrink-0) */}
            <div className="flex shrink-0 items-center justify-between pb-2.5">
              <button
                type="button"
                onClick={() => setNavStack({ level: 0 })}
                className="group flex cursor-pointer items-center gap-1.5 rounded-[8px] bg-secondary px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted"
              >
                <HugeiconsIcon
                  icon={ArrowLeft01Icon}
                  className="size-3.5 transition-transform group-hover:-translate-x-0.5"
                />
                <span className="font-heading">Presets</span>
              </button>
              <span className="rounded-[6px] bg-secondary px-2 py-0.5 font-mono text-[11px] font-medium text-muted-foreground">
                {activeDossier.duration}ms
              </span>
            </div>

            {/* TIER 2: SCROLLABLE MIDDLE RUNWAY with dynamic CSS alpha mask */}
            <div
              ref={detailScrollRef}
              data-testid="preset-detail-scroll-container"
              onScroll={updateDetailScrollState}
              style={detailMaskStyle}
              className="no-scrollbar flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-0.5"
            >
              {/* 1:1 Square Kinetic Curve Stage */}
              <PresetCurveStage
                key={activeDossier.id}
                curveId={activeDossier.id}
                engine={activeDossier.engine}
                duration={activeDossier.duration}
                bezier={activeDossier.bezier}
                spring={activeDossier.spring}
              />

              {/* Title, Taxonomy & Description */}
              <div className="flex shrink-0 flex-col gap-1 text-left">
                <div className="flex flex-col gap-0.5">
                  <h3 className="font-heading text-sm font-semibold tracking-tight text-foreground">
                    {activeDossier.name}
                  </h3>
                  <p className="truncate font-sans text-[11px] text-muted-foreground">
                    {activeDossier.engine === "bezier"
                      ? "Cubic Bézier"
                      : "Physics Spring"}{" "}
                    · {activeDossier.origin}
                  </p>
                </div>
                <p className="font-sans text-xs leading-relaxed text-muted-foreground">
                  {activeDossier.description ||
                    activeDossier.kinetics.choreographyLaw}
                </p>
              </div>

              {/* Unified Property Inspector Slab */}
              <div className="flex flex-col gap-2 rounded-[12px] bg-secondary p-3">
                {/* Parameters: Spring (3-col) or Bézier (2-col Anchors) */}
                {activeDossier.engine === "spring" && activeDossier.spring ? (
                  <div className="grid grid-cols-3 divide-x divide-muted font-sans text-xs">
                    <div className="flex flex-col items-start gap-0.5 pr-2 text-left">
                      <span className="text-[10px] text-muted-foreground">
                        Mass
                      </span>
                      <span className="font-mono text-xs font-medium text-foreground">
                        {activeDossier.spring.mass ?? 1}
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-0.5 px-2 text-center">
                      <span className="text-[10px] text-muted-foreground">
                        Stiffness
                      </span>
                      <span className="font-mono text-xs font-medium text-foreground">
                        {activeDossier.spring.stiffness}
                      </span>
                    </div>
                    <div className="flex flex-col items-end gap-0.5 pl-2 text-right">
                      <span className="text-[10px] text-muted-foreground">
                        Damping
                      </span>
                      <span className="font-mono text-xs font-medium text-foreground">
                        {activeDossier.spring.damping}
                      </span>
                    </div>
                  </div>
                ) : activeDossier.bezier ? (
                  <div className="grid grid-cols-2 divide-x divide-muted font-sans">
                    <div className="flex flex-col items-start gap-0.5 pr-3 text-left">
                      <span className="text-[10px] text-muted-foreground">
                        Anchor P1
                      </span>
                      <span className="font-mono text-xs font-medium text-foreground">
                        {activeDossier.bezier.p1.x.toFixed(2)},{" "}
                        {activeDossier.bezier.p1.y.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex flex-col items-end gap-0.5 pl-3 text-right">
                      <span className="text-[10px] text-muted-foreground">
                        Anchor P2
                      </span>
                      <span className="font-mono text-xs font-medium text-foreground">
                        {activeDossier.bezier.p2.x.toFixed(2)},{" "}
                        {activeDossier.bezier.p2.y.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="shrink-0 text-muted-foreground">
                      Control points
                    </span>
                    <span className="truncate font-mono text-xs font-medium text-foreground">
                      {activeDossier.values}
                    </span>
                  </div>
                )}

                <div className="border-t border-muted" />

                {/* Kinetic Telemetry Rows */}
                <div className="flex flex-col gap-1.5 font-sans text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="shrink-0 text-muted-foreground">
                      Sweet spot
                    </span>
                    <span className="truncate font-medium text-foreground">
                      {activeDossier.kinetics.timingSweetSpot}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="shrink-0 text-muted-foreground">
                      Motion feel
                    </span>
                    <span className="truncate font-medium text-foreground">
                      {activeDossier.kinetics.role}
                    </span>
                  </div>
                  {activeDossier.engine === "spring" ? (
                    <div className="flex items-center justify-between gap-2">
                      <span className="shrink-0 text-muted-foreground">
                        Bounce
                      </span>
                      <span className="truncate font-medium text-foreground">
                        {activeDossier.kinetics.settleCharacter.includes(
                          "Zero bounce"
                        )
                          ? "None (0%)"
                          : activeDossier.kinetics.settleCharacter.includes(
                                "bounce"
                              )
                            ? (activeDossier.kinetics.settleCharacter.match(
                                /~?\d+%\s*bounce/
                              )?.[0] ?? "Subtle")
                            : activeDossier.kinetics.settleCharacter.includes(
                                  "rebound"
                                )
                              ? (activeDossier.kinetics.settleCharacter.match(
                                  /~?\d+%\s*rebound/
                                )?.[0] ?? "Oscillating")
                              : "Minimal"}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-2">
                      <span className="shrink-0 text-muted-foreground">
                        Deceleration
                      </span>
                      <span className="truncate font-medium text-foreground">
                        {activeDossier.kinetics.settleCharacter.includes(
                          "overshoot"
                        )
                          ? "Overshoot cushion"
                          : activeDossier.kinetics.settleCharacter.includes(
                                "friction"
                              )
                            ? "Asymptotic cushion"
                            : "Symmetric ease"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Recommended For Use Cases */}
              {activeDossier.useCases && activeDossier.useCases.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  <span className="font-sans text-[10px] font-medium text-muted-foreground">
                    Recommended for
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {activeDossier.useCases.map((uc) => (
                      <span
                        key={uc}
                        className="rounded-[6px] bg-secondary px-2 py-0.5 font-sans text-[11px] text-muted-foreground"
                      >
                        {uc}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom Variants Grid (if custom) */}
              {activeDossier.isCustom && (
                <div className="flex flex-col gap-2">
                  <div className="flex shrink-0 items-center justify-between px-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-heading text-xs font-semibold text-foreground">
                        Variants
                      </span>
                      <span className="rounded-[6px] bg-secondary px-1.5 py-0.5 font-sans text-[10px] text-muted-foreground">
                        {activeDossier.variants?.length ?? 0}
                      </span>
                    </div>
                    <span className="font-sans text-[10px] text-muted-foreground">
                      2x: open slide
                    </span>
                  </div>

                  {/* Clean 1:1 Squircle 2-Column Grid */}
                  <div className="grid grid-cols-2 gap-2">
                    {(activeDossier.variants ?? []).map((v) => {
                      const isSelected = activePresetId === v.id
                      const subVariantCount = v.variants?.length ?? 0

                      return (
                        <div
                          key={v.id}
                          className="group relative flex w-full flex-col"
                        >
                          <button
                            type="button"
                            onClick={() => {
                              selectEase(v.id, { audition: true })
                            }}
                            onDoubleClick={() => {
                              setNavStack({
                                level: 2,
                                curveId: activeDossier.id,
                                variantId: v.id,
                              })
                            }}
                            title={`${v.name} · Click to audition · Double-click to open slide`}
                            className={cn(
                              "group relative flex w-full cursor-pointer flex-col items-center rounded-[12px] p-1 transition-all",
                              isSelected
                                ? "bg-foreground text-background"
                                : "bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground"
                            )}
                          >
                            <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-[9px] bg-background p-2">
                              {subVariantCount > 0 && (
                                <span className="pointer-events-none absolute top-1.5 left-2 font-sans text-[9px] font-semibold tracking-tight text-muted-foreground">
                                  +{subVariantCount}
                                </span>
                              )}

                              <MiniGraph
                                mode={v.engine}
                                bezier={v.bezier}
                                spring={v.spring}
                                className={cn(
                                  "h-full w-full stroke-2 transition-colors",
                                  isSelected
                                    ? "stroke-foreground"
                                    : "stroke-muted-foreground group-hover:stroke-foreground"
                                )}
                              />
                            </div>

                            <div className="flex h-5 w-full items-center justify-center px-1">
                              <span className="truncate font-sans text-[11px] leading-none font-medium tracking-tight">
                                {v.name}
                              </span>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setNavStack({
                                level: 2,
                                curveId: activeDossier.id,
                                variantId: v.id,
                              })
                            }}
                            title={`Open ${v.name} slide`}
                            className="absolute top-2 right-2 z-10 flex size-4.5 cursor-pointer items-center justify-center rounded-[5px] bg-background text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground"
                          >
                            <HugeiconsIcon
                              icon={ArrowUpRight01Icon}
                              className="size-2.5"
                            />
                          </button>
                        </div>
                      )
                    })}

                    {/* Action Tile: + Add Variant */}
                    <button
                      type="button"
                      onClick={() => addVariant(activeDossier.id)}
                      title="Add variant"
                      className="group flex w-full cursor-pointer flex-col items-center rounded-[12px] bg-muted p-1 text-muted-foreground transition-all hover:bg-secondary hover:text-foreground"
                    >
                      <div className="relative flex aspect-square w-full items-center justify-center rounded-[9px] bg-background p-2">
                        <HugeiconsIcon
                          icon={PlusSignIcon}
                          className="size-5 text-muted-foreground group-hover:text-foreground"
                        />
                      </div>
                      <div className="flex h-5 w-full items-center justify-center px-1">
                        <span className="truncate font-sans text-[11px] leading-none font-medium tracking-tight">
                          + Add Variant
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* TIER 3: PINNED BOTTOM ACTION CTA (shrink-0) */}
            {!activeDossier.isCustom && (
              <div className="shrink-0 border-t border-muted bg-background pt-2">
                <button
                  type="button"
                  onClick={() => forkCurve(activeDossier.id)}
                  className="flex h-8 w-full cursor-pointer items-center justify-center gap-2 rounded-[8px] bg-secondary px-3.5 font-heading text-xs font-medium text-foreground transition-colors hover:bg-muted active:scale-95"
                >
                  <HugeiconsIcon icon={PlusSignIcon} className="size-3.5" />
                  <span>Customize Parameters</span>
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* LEVEL 2: VARIANT TUNING BLOCK (THE PHYSICAL MONOLITHIC SLAB) */}
      <section
        aria-label="Variant Tuning"
        className={cn(
          "absolute inset-0 flex flex-col rounded-[20px] bg-background p-2.5 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] select-none",
          navStack.level === 2
            ? "pointer-events-auto translate-x-0"
            : "pointer-events-none translate-x-[calc(100%+8px)]"
        )}
      >
        {currentCurve && currentVariant && (
          <div className="flex h-full flex-col gap-3">
            {/* TOP: MINIMALIST ESSENTIAL VARIANT DOSSIER */}
            <div className="flex shrink-0 flex-col gap-2.5">
              {/* Top Navigation */}
              <div className="flex shrink-0 items-center justify-between">
                <button
                  type="button"
                  onClick={() =>
                    setNavStack({ level: 1, curveId: currentCurve.id })
                  }
                  className="group flex cursor-pointer items-center gap-1.5 rounded-[8px] bg-muted px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
                >
                  <HugeiconsIcon
                    icon={ArrowLeft01Icon}
                    className="size-3.5 transition-transform group-hover:-translate-x-0.5"
                  />
                  <span className="font-heading">{currentCurve.name}</span>
                </button>
                <span className="font-sans text-[11px] font-medium text-muted-foreground">
                  {currentVariant.duration}ms
                </span>
              </div>

              {/* Title & Origin Pedigree */}
              <div className="flex shrink-0 flex-col gap-0.5">
                <h3 className="font-heading text-sm font-semibold tracking-tight text-foreground">
                  {currentVariant.name}
                </h3>
                <p className="truncate font-sans text-[11px] text-muted-foreground">
                  Branch of {currentCurve.name} · Kinetic Variant
                </p>
              </div>

              {/* Variant Description */}
              {currentVariant.desc && (
                <p className="font-sans text-xs leading-relaxed text-muted-foreground">
                  {currentVariant.desc}
                </p>
              )}

              {/* Formula Specification */}
              <div className="flex h-7 w-full items-center rounded-[8px] bg-muted px-2.5">
                <span className="font-mono text-xs font-semibold tracking-tight text-foreground">
                  {currentVariant.values}
                </span>
              </div>
            </div>

            {/* BOTTOM: COMPACT, TACTILE FLAVORS SQUIRCLE GRID */}
            <div className="flex flex-col gap-2">
              <div className="flex shrink-0 items-center justify-between px-0.5">
                <span className="font-heading text-xs font-semibold text-foreground">
                  Flavors
                </span>
                <span className="rounded-[6px] bg-secondary px-1.5 py-0.5 font-sans text-[10px] text-muted-foreground">
                  {currentVariant.variants?.length ?? 0}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {(currentVariant.variants ?? []).map((sv) => {
                  const isSelected = activePresetId === sv.id
                  return (
                    <div
                      key={sv.id}
                      className="group relative flex w-full flex-col"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          selectEase(sv.id, { audition: true })
                        }}
                        title={`${sv.name} · Click to audition`}
                        className={cn(
                          "group relative flex w-full cursor-pointer flex-col items-center rounded-[12px] p-1 transition-all",
                          isSelected
                            ? "bg-foreground text-background"
                            : "bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground"
                        )}
                      >
                        <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-[9px] bg-background p-2">
                          <MiniGraph
                            mode={sv.engine}
                            bezier={sv.bezier}
                            spring={sv.spring}
                            className={cn(
                              "h-full w-full stroke-2 transition-colors",
                              isSelected
                                ? "stroke-foreground"
                                : "stroke-muted-foreground group-hover:stroke-foreground"
                            )}
                          />
                        </div>
                        <div className="flex h-5 w-full items-center justify-center px-1">
                          <span className="truncate font-sans text-[11px] leading-none font-medium tracking-tight">
                            {sv.name}
                          </span>
                        </div>
                      </button>
                    </div>
                  )
                })}

                {/* Action Tile: + Add Flavor (Clean 1:1 Squircle) */}
                <button
                  type="button"
                  onClick={() => addFlavor(currentCurve.id, currentVariant.id)}
                  title="Add flavor"
                  className="group flex w-full cursor-pointer flex-col items-center rounded-[12px] bg-muted p-1 text-muted-foreground transition-all hover:bg-secondary hover:text-foreground"
                >
                  <div className="relative flex aspect-square w-full items-center justify-center rounded-[9px] bg-background p-2">
                    <HugeiconsIcon
                      icon={PlusSignIcon}
                      className="size-5 text-muted-foreground group-hover:text-foreground"
                    />
                  </div>
                  <div className="flex h-5 w-full items-center justify-center px-1">
                    <span className="truncate font-sans text-[11px] leading-none font-medium tracking-tight">
                      + Add Flavor
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
