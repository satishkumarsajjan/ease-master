import { describe, it, expect, beforeEach } from "vitest"
import {
  resolveEase,
  findCustomCurve,
  computeKineticIntel,
  getEasedValue,
  solveCubicBezier,
} from "@/components/studio/domain/studio-kinetics"
import { INITIAL_CUSTOM_CURVES } from "@/components/studio/domain/studio-curves"
import {
  useStudioStore,
  createStudioStore,
  syncSessionCookie,
} from "@/store/useStudioStore"

describe("Studio Kinetics Resolver", () => {
  it("resolves root custom curve correctly", () => {
    const dossier = resolveEase("modal-sheet", INITIAL_CUSTOM_CURVES)
    expect(dossier.id).toBe("modal-sheet")
    expect(dossier.engine).toBe("bezier")
    expect(dossier.isCustom).toBe(true)
    expect(dossier.kinetics.role).toBe("Entrance Decel")
    expect(dossier.variants).toBeDefined()
    expect(dossier.variants!.length).toBeGreaterThan(0)
  })

  it("resolves nested variant in custom curves recursively", () => {
    const variantDossier = resolveEase(
      "modal-sheet-exit-standard",
      INITIAL_CUSTOM_CURVES
    )
    expect(variantDossier.id).toBe("modal-sheet-exit-standard")
    expect(variantDossier.engine).toBe("bezier")
    expect(variantDossier.isCustom).toBe(true)
    expect(variantDossier.name).toBe("Standard")
    expect(variantDossier.parentPreset).toBe("Exit")
  })

  it("resolves standard bezier preset", () => {
    const dossier = resolveEase("ease-out", INITIAL_CUSTOM_CURVES)
    expect(dossier.id).toBe("ease-out")
    expect(dossier.engine).toBe("bezier")
    expect(dossier.isCustom).toBe(false)
    expect(dossier.bezier).toBeDefined()
    expect(dossier.kinetics.optimalDuration).toBeGreaterThan(0)
  })

  it("resolves physical spring preset with engine 'spring'", () => {
    const dossier = resolveEase("button", INITIAL_CUSTOM_CURVES)
    expect(dossier.id).toBe("button")
    expect(dossier.engine).toBe("spring")
    expect(dossier.isCustom).toBe(false)
    expect(dossier.spring).toBeDefined()
    expect(dossier.spring?.stiffness).toBe(600)
    expect(dossier.kinetics.role).toBe("Critically Damped Glide")
  })

  it("falls back gracefully to standard ease for unknown ID", () => {
    const dossier = resolveEase("non-existent-curve-xyz", INITIAL_CUSTOM_CURVES)
    expect(dossier.id).toBe("ease")
    expect(dossier.engine).toBe("bezier")
  })

  it("computes kinetic intelligence for custom curve", () => {
    const intel = computeKineticIntel({
      id: "test-curve",
      name: "Test Curve",
      engine: "bezier",
      bezier: { p1: { x: 0.1, y: 0.9 }, p2: { x: 0.2, y: 1 } },
    })
    expect(intel.role).toBe("Transit S-Curve")
    expect(intel.optimalDuration).toBeGreaterThan(0)
  })

  it("computes cubic bezier values accurately", () => {
    // Linear (0, 0, 1, 1)
    expect(solveCubicBezier(0, 0, 1, 1, 0)).toBe(0)
    expect(solveCubicBezier(0, 0, 1, 1, 0.5)).toBeCloseTo(0.5, 2)
    expect(solveCubicBezier(0, 0, 1, 1, 1)).toBe(1)
  })

  it("evaluates getEasedValue for bezier, spring, and reduced motion", () => {
    const bezierMeta = {
      engine: "bezier" as const,
      bezier: { p1: { x: 0.25, y: 0.1 }, p2: { x: 0.25, y: 1 } },
    }
    const valAtZero = getEasedValue(0, bezierMeta)
    const valAtFifty = getEasedValue(50, bezierMeta)
    const valAtHundred = getEasedValue(100, bezierMeta)
    expect(valAtZero).toBe(0)
    expect(valAtFifty).toBeGreaterThan(0)
    expect(valAtHundred).toBe(1)

    // Reduced motion test
    const reducedVal = getEasedValue(10, bezierMeta, true)
    expect(reducedVal).toBe(1)

    // Spring test
    const springMeta = {
      engine: "spring" as const,
      spring: { stiffness: 300, damping: 20, mass: 1, velocity: 0 },
    }
    const springVal = getEasedValue(50, springMeta)
    expect(typeof springVal).toBe("number")
    expect(springVal).toBeGreaterThan(0)
  })
})

describe("Studio Zustand Store", () => {
  beforeEach(() => {
    useStudioStore.setState({
      mode: "audition",
      activeCurveId: "modal-sheet",
      activeEngine: "bezier",
      customCurves: INITIAL_CUSTOM_CURVES,
      navStack: { level: 0 },
      isPlaying: false,
      scrubProgress: 0,
      animKey: 0,
      compareQueue: [],
      isTimelineOpen: false,
    })
  })

  it("selectEase switches activeCurveId and activeEngine atomically", () => {
    // Select spring preset
    useStudioStore.getState().selectEase("button")
    expect(useStudioStore.getState().activeCurveId).toBe("button")
    expect(useStudioStore.getState().activeEngine).toBe("spring")

    // Select bezier preset
    useStudioStore.getState().selectEase("ease-in-out")
    expect(useStudioStore.getState().activeCurveId).toBe("ease-in-out")
    expect(useStudioStore.getState().activeEngine).toBe("bezier")
  })

  it("selectEase with audition: true resets scrubProgress and triggers playback", () => {
    useStudioStore.setState({ scrubProgress: 75, isPlaying: false, animKey: 1 })
    useStudioStore.getState().selectEase("button", { audition: true })

    const state = useStudioStore.getState()
    expect(state.isPlaying).toBe(true)
    expect(state.scrubProgress).toBe(0)
    expect(state.animKey).toBe(2)
  })

  it("selectEase with openSlide: true updates navStack to level 1", () => {
    useStudioStore.getState().selectEase("ios-fluid", { openSlide: true })
    expect(useStudioStore.getState().navStack).toEqual({
      level: 1,
      curveId: "ios-fluid",
    })
  })

  it("forkCurve clones preset and adds to customCurves", () => {
    const forkedId = useStudioStore
      .getState()
      .forkCurve("ease-out", "My Custom Out")
    const state = useStudioStore.getState()
    expect(state.activeCurveId).toBe(forkedId)
    expect(state.navStack).toEqual({ level: 1, curveId: forkedId })
    const created = findCustomCurve(forkedId, state.customCurves)
    expect(created).toBeDefined()
    expect(created?.name).toBe("My Custom Out")
    expect(created?.engine).toBe("bezier")
  })

  it("addVariant creates child variant under custom curve", () => {
    const variantId = useStudioStore
      .getState()
      .addVariant("modal-sheet", "Extra Snappy")
    const state = useStudioStore.getState()
    expect(state.activeCurveId).toBe(variantId)
    const variant = findCustomCurve(variantId, state.customCurves)
    expect(variant).toBeDefined()
    expect(variant?.name).toBe("Extra Snappy")
  })

  it("toggleCompare adds and removes IDs from queue", () => {
    useStudioStore.getState().toggleCompare("modal-sheet")
    expect(useStudioStore.getState().compareQueue).toContain("modal-sheet")

    useStudioStore.getState().toggleCompare("modal-sheet")
    expect(useStudioStore.getState().compareQueue).not.toContain("modal-sheet")
  })

  it("toggleTimeline toggles boolean state", () => {
    expect(useStudioStore.getState().isTimelineOpen).toBe(false)
    useStudioStore.getState().toggleTimeline()
    expect(useStudioStore.getState().isTimelineOpen).toBe(true)
  })

  it("addFlavor creates a flavor under an existing variant", () => {
    const flavorId = useStudioStore
      .getState()
      .addFlavor("modal-sheet", "modal-sheet-exit", "Ultra Crisp Exit")
    const state = useStudioStore.getState()
    expect(state.activeCurveId).toBe(flavorId)
    const flavor = findCustomCurve(flavorId, state.customCurves)
    expect(flavor).toBeDefined()
    expect(flavor?.name).toBe("Ultra Crisp Exit")
  })

  it("supports desktop, tablet, mobile, and custom viewport modes", () => {
    useStudioStore.getState().setViewportMode("tablet")
    useStudioStore.getState().setPreviewWidth(768)
    expect(useStudioStore.getState().viewportMode).toBe("tablet")
    expect(useStudioStore.getState().previewWidth).toBe(768)

    useStudioStore.getState().setViewportMode("desktop")
    useStudioStore.getState().setPreviewWidth("100%")
    expect(useStudioStore.getState().viewportMode).toBe("desktop")
    expect(useStudioStore.getState().previewWidth).toBe("100%")
  })

  it("setMode transitions studio modes cleanly", () => {
    useStudioStore.getState().setMode("customize")
    expect(useStudioStore.getState().mode).toBe("customize")
    useStudioStore.getState().setMode("compare")
    expect(useStudioStore.getState().mode).toBe("compare")
    useStudioStore.getState().setMode("audition")
    expect(useStudioStore.getState().mode).toBe("audition")
  })

  it("clears compare queue with clearCompareQueue action", () => {
    useStudioStore.getState().addToCompare("modal-sheet")
    useStudioStore.getState().addToCompare("button")
    expect(useStudioStore.getState().compareQueue).toHaveLength(2)

    useStudioStore.getState().clearCompareQueue()
    expect(useStudioStore.getState().compareQueue).toHaveLength(0)
  })

  it("pre-hydrates initialSession synchronously on createStudioStore", () => {
    const store = createStudioStore({
      initialSession: {
        curve: "button",
        engine: "spring",
        timeline: true,
        scenario: "button",
        viewport: "tablet",
        width: 768,
      },
    })

    const state = store.getState()
    expect(state.activeCurveId).toBe("button")
    expect(state.activeEngine).toBe("spring")
    expect(state.isTimelineOpen).toBe(true)
    expect(state.activeScenarioKey).toBe("button")
    expect(state.viewportMode).toBe("tablet")
    expect(state.previewWidth).toBe(768)
  })

  it("syncSessionCookie writes ease_session and ease_timeline_open cookies", () => {
    syncSessionCookie({
      curve: "button",
      engine: "spring",
      timeline: true,
    })

    expect(document.cookie).toContain("ease_timeline_open=true")
    expect(document.cookie).toContain("ease_session=")
  })
})
