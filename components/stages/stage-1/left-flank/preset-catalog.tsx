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
import { CustomEase, EaseDossier, StackLevel } from "../stage-1-types"
import {
  BEZIER_FAMILIES,
  SPRING_FAMILIES,
  POPULAR_PRESET_IDS,
} from "../stage-1-curves"
import { PresetCurveStage } from "./preset-curve-stage"

interface PresetCatalogProps {
  activeEngine: "bezier" | "spring"
  setActiveEngine: (engine: "bezier" | "spring") => void
  activePresetId: string
  setActivePresetId: (id: string) => void
  customCurves: CustomEase[]
  setCustomCurves: React.Dispatch<React.SetStateAction<CustomEase[]>>
  navStack: StackLevel
  setNavStack: React.Dispatch<React.SetStateAction<StackLevel>>
  resolveEase: (id: string) => EaseDossier | undefined
  triggerSingleAnimation: () => void
}

export function PresetCatalog({
  activeEngine,
  setActiveEngine,
  activePresetId,
  setActivePresetId,
  customCurves,
  setCustomCurves,
  navStack,
  setNavStack,
  resolveEase,
  triggerSingleAnimation,
}: PresetCatalogProps) {
  const [searchQuery, setSearchQuery] = React.useState<string>("")
  const [catalogFilter, setCatalogFilter] = React.useState<"all" | "popular">(
    "all"
  )

  const activeDossier = React.useMemo(() => {
    return navStack.level === 1 ? resolveEase(navStack.curveId) : undefined
  }, [navStack, resolveEase])

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

  // Re-check scroll metrics whenever active dossier or navigation stack changes
  React.useEffect(() => {
    updateDetailScrollState()
  }, [activeDossier, navStack, updateDetailScrollState])

  // Observe container resizes (e.g. window resize or layout flex)
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

  // Dynamic alpha mask: fades edges only when scrollable content extends beyond view
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

  const handleCustomCurveClick = (curve: CustomEase) => {
    setActivePresetId(curve.id)
    setActiveEngine(curve.engine)
    triggerSingleAnimation()
  }

  const idCounterRef = React.useRef(1)
  const getUniqueId = React.useCallback((prefix: string) => {
    idCounterRef.current += 1
    return `${prefix}-${idCounterRef.current}`
  }, [])

  const handleForkPreset = React.useCallback(
    (presetId: string) => {
      const dossier = resolveEase(presetId)
      if (!dossier) return
      const newCustomId = getUniqueId(`custom-${dossier.id}`)
      const newCustom: CustomEase = {
        id: newCustomId,
        name: `${dossier.name} (Custom)`,
        label: "Main",
        parentPreset: dossier.name,
        engine: dossier.engine,
        values: dossier.values,
        bezier: dossier.bezier ? { ...dossier.bezier } : undefined,
        spring: dossier.spring ? { ...dossier.spring } : undefined,
        duration: dossier.duration,
        desc: `Custom branch of ${dossier.name}`,
        guidance: dossier.kinetics.choreographyLaw,
        targetSettle: dossier.kinetics.timingSweetSpot,
        variants: [],
      }
      setCustomCurves((prev) => [newCustom, ...prev])
      setActivePresetId(newCustom.id)
      setActiveEngine(newCustom.engine)
      setNavStack({ level: 1, curveId: newCustom.id })
    },
    [
      resolveEase,
      getUniqueId,
      setCustomCurves,
      setActivePresetId,
      setActiveEngine,
      setNavStack,
    ]
  )

  const handleAddVariant = React.useCallback(() => {
    if (!currentCurve) return
    const newIndex = (currentCurve.variants?.length ?? 0) + 1
    const newVariant: CustomEase = {
      id: getUniqueId(`${currentCurve.id}-v${newIndex}`),
      name: `Variant ${newIndex}`,
      label: `Variant ${newIndex}`,
      parentPreset: currentCurve.name,
      engine: currentCurve.engine,
      values: currentCurve.values,
      bezier: currentCurve.bezier ? { ...currentCurve.bezier } : undefined,
      spring: currentCurve.spring ? { ...currentCurve.spring } : undefined,
      duration: currentCurve.duration,
      desc: `Branch ${newIndex} of ${currentCurve.name}`,
    }
    setCustomCurves((prev) =>
      prev.map((c) =>
        c.id === currentCurve.id
          ? { ...c, variants: [...(c.variants ?? []), newVariant] }
          : c
      )
    )
    setActivePresetId(newVariant.id)
    setActiveEngine(newVariant.engine)
  }, [
    currentCurve,
    getUniqueId,
    setCustomCurves,
    setActivePresetId,
    setActiveEngine,
  ])

  const handleAddFlavor = React.useCallback(() => {
    if (!currentCurve || !currentVariant) return
    const newIndex = (currentVariant.variants?.length ?? 0) + 1
    const newFlavor: CustomEase = {
      id: getUniqueId(`${currentVariant.id}-f${newIndex}`),
      name: `Flavor ${newIndex}`,
      label: `Flavor ${newIndex}`,
      parentPreset: currentVariant.name,
      engine: currentVariant.engine,
      values: currentVariant.values,
      bezier: currentVariant.bezier ? { ...currentVariant.bezier } : undefined,
      spring: currentVariant.spring ? { ...currentVariant.spring } : undefined,
      duration: currentVariant.duration,
      desc: `Calibrated flavor ${newIndex} of ${currentVariant.name}`,
    }
    setCustomCurves((prev) =>
      prev.map((c) =>
        c.id === currentCurve.id
          ? {
              ...c,
              variants: (c.variants ?? []).map((v) =>
                v.id === currentVariant.id
                  ? { ...v, variants: [...(v.variants ?? []), newFlavor] }
                  : v
              ),
            }
          : c
      )
    )
    setActivePresetId(newFlavor.id)
    setActiveEngine(newFlavor.engine)
  }, [
    currentCurve,
    currentVariant,
    getUniqueId,
    setCustomCurves,
    setActivePresetId,
    setActiveEngine,
  ])

  return (
    <div className="relative min-h-0 w-full flex-1 overflow-hidden">
      {/* LEVEL 0: ROOT CATALOG BLOCK (THE PHYSICAL MONOLITHIC SLAB) */}
      <section
        aria-label="Block 02: Preset Catalog"
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
                      onClick={() => handleCustomCurveClick(curve)}
                      onDoubleClick={() =>
                        setNavStack({ level: 1, curveId: curve.id })
                      }
                      title={
                        variantCount > 0
                          ? `${curve.name} · Click to audition · Double-click to expand variants`
                          : `${curve.name} · Double-click to expand`
                      }
                      className={cn(
                        "relative flex w-full cursor-pointer flex-col items-center rounded-[10px] p-0.5 transition-all",
                        isSelected
                          ? "bg-foreground text-background"
                          : "bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground"
                      )}
                    >
                      {/* Inner Mini Graph Box (Sleek Screen with Breathing Room) */}
                      <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-[8px] bg-background p-1">
                        {/* Top-Left Variant Badge */}
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
                        setNavStack({ level: 1, curveId: curve.id })
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
                setActiveEngine("bezier")
                setActivePresetId("ease")
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
                setActiveEngine("spring")
                setActivePresetId("spring-standard")
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
                                setActivePresetId(item.id)
                                setActiveEngine(activeEngine)
                                triggerSingleAnimation()
                              }}
                              onDoubleClick={() =>
                                setNavStack({ level: 1, curveId: item.id })
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
                                      ? (item.value as SpringConfig)
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
                                setNavStack({ level: 1, curveId: item.id })
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
        aria-label="Block 02: Ease Studio"
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

            {/* TIER 2: SCROLLABLE MIDDLE RUNWAY (flex-1 min-h-0 overflow-y-auto with dynamic CSS alpha mask) */}
            <div
              ref={detailScrollRef}
              data-testid="preset-detail-scroll-container"
              onScroll={updateDetailScrollState}
              style={detailMaskStyle}
              className="no-scrollbar flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-0.5"
            >
              {/* 1:1 Square Kinetic Curve Stage (Self-contained high-performance stage) */}
              <PresetCurveStage
                key={activeDossier.id}
                curveId={activeDossier.id}
                engine={activeDossier.engine}
                duration={activeDossier.duration}
                bezier={activeDossier.bezier}
                spring={activeDossier.spring}
              />

              {/* Title, Taxonomy & Description (Left-aligned) */}
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

                {/* Kinetic Telemetry Rows: Calm, Balanced Typography */}
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
                              setActivePresetId(v.id)
                              setActiveEngine(v.engine)
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
                            {/* Inner Mini Graph Box (Clean 1:1 Squircle Screen) */}
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

                            {/* Grounded Name Strip Snug Underneath */}
                            <div className="flex h-5 w-full items-center justify-center px-1">
                              <span className="truncate font-sans text-[11px] leading-none font-medium tracking-tight">
                                {v.name}
                              </span>
                            </div>
                          </button>

                          {/* Quick open button on hover (Top-Right of Inner Box) */}
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

                    {/* Action Tile: + Add Variant (Clean 1:1 Squircle) */}
                    <button
                      type="button"
                      onClick={handleAddVariant}
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
                  onClick={() => handleForkPreset(activeDossier.id)}
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
        aria-label="Block 02: Variant Tuning"
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
                          // CLICK ONLY AUDITIONS IT (DOES NOT MUTATE CURRENT VARIANT DOSSIER)
                          setActivePresetId(sv.id)
                          setActiveEngine(sv.engine)
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
                  onClick={handleAddFlavor}
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
