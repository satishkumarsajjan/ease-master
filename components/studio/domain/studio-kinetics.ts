import { BezierConfig, SpringConfig } from "@/core/types"
import { solveSpring } from "@/core/math/spring"
import { BEZIER_PRESETS, SPRING_PRESETS } from "@/core/presets"
import {
  CustomEase,
  KineticAnatomy,
  EaseDossier,
  EngineType,
} from "./studio-types"

/**
 * High-precision cubic-bezier solver (evaluates y for a given x/t using binary bisection).
 */
export function solveCubicBezier(
  p1x: number,
  p1y: number,
  p2x: number,
  p2y: number,
  t: number
): number {
  if (t <= 0) return 0
  if (t >= 1) return 1
  let low = 0
  let high = 1
  let tParam = t
  for (let i = 0; i < 10; i++) {
    const currentX =
      3 * (1 - tParam) * (1 - tParam) * tParam * p1x +
      3 * (1 - tParam) * tParam * tParam * p2x +
      tParam * tParam * tParam
    if (Math.abs(currentX - t) < 0.001) break
    if (currentX < t) low = tParam
    else high = tParam
    tParam = (low + high) / 2
  }
  return (
    3 * (1 - tParam) * (1 - tParam) * tParam * p1y +
    3 * (1 - tParam) * tParam * tParam * p2y +
    tParam * tParam * tParam
  )
}

/**
 * Derives kinetic intelligence and UX choreography rules from curve physics.
 */
export function computeKineticIntel(params: {
  id: string
  name: string
  engine: EngineType
  description?: string
  bezier?: BezierConfig
  spring?: SpringConfig
  custom?: CustomEase
}): KineticAnatomy {
  const { id, engine, description, bezier, spring, custom } = params
  const lowerId = id.toLowerCase()

  // 1. BEZIER ENGINE KINETICS
  if (engine === "bezier" && bezier) {
    const { p1, p2 } = bezier
    const dx1 = Math.max(0.01, p1.x)
    const dy1 = p1.y
    const initialSlope = dy1 / dx1

    // Role classification
    let role = "Transit S-Curve"
    if (p1.y < 0 || p2.y > 1.0 || p1.y > 1.0) {
      role = "Expressive Rebound"
    } else if (
      lowerId.includes("exit") ||
      lowerId.includes("accelerate") ||
      lowerId === "ease-in" ||
      (lowerId.includes("-in") && !lowerId.includes("-in-out"))
    ) {
      role = "Exit Dismissal"
    } else if (
      lowerId.includes("decel") ||
      lowerId.includes("modal") ||
      lowerId.includes("sheet") ||
      lowerId === "ease-out" ||
      (lowerId.includes("-out") && !lowerId.includes("-in-out")) ||
      lowerId.includes("fluid")
    ) {
      role = "Entrance Decel"
    } else if (lowerId.includes("fast") || lowerId.includes("snap")) {
      role = "Tactile Micro-Snap"
    } else if (
      lowerId.includes("cinematic") ||
      lowerId.includes("emphasized")
    ) {
      role = "Dramatic Hero Arc"
    } else if (lowerId.includes("linear") || lowerId.includes("step")) {
      role = "Mechanical Step"
    }

    // Launch impulse analysis
    let launchVelocity = "Smooth progressive ramp-up"
    if (p1.y < 0) {
      launchVelocity = `Anticipatory back-pull (${Math.round(p1.y * 100)}% counter-impulse)`
    } else if (p1.x <= 0.1 && p1.y >= 0.7) {
      launchVelocity = "Instant peak impulse at t=0"
    } else if (initialSlope >= 2.2) {
      launchVelocity = "Swift acceleration from rest"
    } else if (p1.y <= 0.05 && p1.x >= 0.35) {
      launchVelocity = "Suppressed launch delay (Heavy inertia)"
    } else if (initialSlope <= 0.45) {
      launchVelocity = "Gentle progressive inertia build-up"
    }

    // Settle & Deceleration analysis
    let settleCharacter = "Symmetric deceleration into destination"
    if (p2.y > 1.0) {
      const overshoot = Math.round((p2.y - 1) * 100)
      settleCharacter = `Controlled +${overshoot}% overshoot rebound`
    } else if (p1.y > 1.0) {
      const crest = Math.round((p1.y - 1) * 100)
      settleCharacter = `Controlled +${crest}% launch crest deceleration`
    } else if (
      p2.y <= 0.55 &&
      (lowerId.includes("-in") || lowerId.includes("accelerate"))
    ) {
      settleCharacter = "Maintains terminal exit velocity off-screen"
    } else if (p2.x <= 0.25 && p2.y >= 0.95) {
      settleCharacter = "Near-instantaneous magnetic latch"
    } else if (p2.x >= 0.35 && p2.y >= 0.95) {
      settleCharacter = "Asymptotic friction cushion (0% overshoot)"
    }

    // Optimal duration & sweet spot calibration
    let optimalDuration = 320
    let timingSweetSpot = "240ms – 360ms"
    if (lowerId === "ultra-fast") {
      optimalDuration = 180
      timingSweetSpot = "140ms – 220ms"
    } else if (lowerId.includes("power1")) {
      optimalDuration = 240
      timingSweetSpot = "180ms – 280ms"
    } else if (lowerId.includes("power2") || lowerId.includes("decel")) {
      optimalDuration = 300
      timingSweetSpot = "240ms – 350ms"
    } else if (
      lowerId.includes("power3") ||
      lowerId === "material-emphasized"
    ) {
      optimalDuration = 380
      timingSweetSpot = "300ms – 440ms"
    } else if (lowerId.includes("power4") || lowerId.includes("expo")) {
      optimalDuration = 480
      timingSweetSpot = "400ms – 560ms"
    } else if (
      lowerId.includes("cinematic") ||
      lowerId.includes("circ-in-out")
    ) {
      optimalDuration = 650
      timingSweetSpot = "500ms – 800ms"
    } else if (role === "Exit Dismissal") {
      optimalDuration = 200
      timingSweetSpot = "160ms – 240ms"
    } else if (role === "Expressive Rebound") {
      optimalDuration = 400
      timingSweetSpot = "340ms – 460ms"
    }

    if (custom?.duration) optimalDuration = custom.duration
    if (custom?.targetSettle) timingSweetSpot = custom.targetSettle

    return {
      role,
      launchVelocity,
      settleCharacter,
      feel: description || "Calibrated cubic bezier transition",
      choreographyLaw:
        custom?.guidance ||
        description ||
        "Standard interface kinetic transition",
      timingSweetSpot,
      optimalDuration,
    }
  }

  // 2. SPRING ENGINE KINETICS
  if (engine === "spring" && spring) {
    const mass = Math.max(0.1, spring.mass || 1)
    const stiffness = Math.max(1, spring.stiffness)
    const damping = Math.max(0.1, spring.damping)

    // Damping Ratio: ζ = damping / (2 * sqrt(mass * stiffness))
    const zeta = damping / (2 * Math.sqrt(mass * stiffness))
    const omegaN = Math.sqrt(stiffness / mass)

    // Settle time approximation (to ~2% threshold)
    const rawSettleSec =
      (zeta < 0.35 ? 4.8 : 4.0) / Math.max(0.1, zeta * omegaN)
    const computedDuration = Math.round(
      Math.min(950, Math.max(140, rawSettleSec * 1000))
    )

    // Role classification
    let role = "Critically Damped Snap"
    if (zeta < 0.25) {
      role = "High-Resonance Spring"
    } else if (zeta < 0.7) {
      role = "Expressive Pop"
    } else if (zeta < 0.95) {
      role = "Tactile Micro-Snap"
    } else if (zeta <= 1.15) {
      role = "Critically Damped Glide"
    } else {
      role = "Overdamped Viscous Drag"
    }

    // Launch impulse analysis
    let launchVelocity = `Standard mechanical impulse (${stiffness} N/m)`
    if (stiffness >= 600) {
      launchVelocity = `High-tension instant trigger (${stiffness} N/m)`
    } else if (mass >= 2) {
      launchVelocity = `Heavy inertial mass response (${mass}kg)`
    } else if (mass <= 0.5) {
      launchVelocity = `Near-zero mass hair-trigger (${mass}kg)`
    } else if (stiffness <= 100) {
      launchVelocity = `Soft low-tension deflection (${stiffness} N/m)`
    }

    // Settle & Deceleration analysis
    let settleCharacter = "Critically damped (Zero bounce, optimal settling)"
    if (zeta < 0.25) {
      const reboundPct = Math.round((1 - zeta) * 90)
      settleCharacter = `Resonant underdamped oscillation (~${reboundPct}% rebound)`
    } else if (zeta < 0.7) {
      const bouncePct = Math.round((0.75 - zeta) * 60)
      settleCharacter = `Tactile overshoot with cushion (~${bouncePct}% bounce)`
    } else if (zeta < 0.95) {
      settleCharacter = "Sub-critically damped snap (Minimal ringing)"
    } else if (zeta <= 1.15) {
      settleCharacter = "Critically damped (Zero bounce, optimal settling)"
    } else {
      settleCharacter = `Overdamped viscous friction (Damping ratio ζ = ${zeta.toFixed(2)})`
    }

    const optimalDuration = custom?.duration || computedDuration
    const minRange = Math.max(120, Math.round(optimalDuration * 0.8))
    const maxRange = Math.round(optimalDuration * 1.25)
    const timingSweetSpot =
      custom?.targetSettle || `${minRange}ms – ${maxRange}ms`

    return {
      role,
      launchVelocity,
      settleCharacter,
      feel: description || "Physical mass-spring-damper kinetics",
      choreographyLaw:
        custom?.guidance ||
        description ||
        "Direct tactile manipulation spring response",
      timingSweetSpot,
      optimalDuration,
    }
  }

  // 3. Fallback
  return {
    role: "Standard Kinetic",
    launchVelocity: "Instant acceleration",
    settleCharacter: "Asymptotic cushion",
    feel: description || "Interface transition",
    choreographyLaw:
      custom?.guidance ||
      description ||
      "Standard interface kinetic transition",
    timingSweetSpot: "200ms – 320ms",
    optimalDuration: 300,
  }
}

/**
 * Recursively locates a custom curve or any of its nested variants by ID.
 */
export function findCustomCurve(
  id: string,
  curves: CustomEase[]
): CustomEase | null {
  for (const c of curves) {
    if (c.id === id) return c
    if (c.variants && c.variants.length > 0) {
      const match = findCustomCurve(id, c.variants)
      if (match) return match
    }
  }
  return null
}

/**
 * Authoritative, engine-agnostic ease resolver.
 * Searches: Custom Curves Hierarchy -> Bezier Presets -> Spring Presets -> Default Fallback.
 * Guarantees correct engine detection and kinetic dossier assembly.
 */
export function resolveEase(
  id: string,
  customCurves: CustomEase[]
): EaseDossier {
  // 1. Recursive search in custom curves
  const custom = findCustomCurve(id, customCurves)
  if (custom) {
    const kinetics = computeKineticIntel({
      id: custom.id,
      name: custom.name,
      engine: custom.engine,
      description: custom.desc,
      bezier: custom.bezier,
      spring: custom.spring,
      custom,
    })
    return {
      id: custom.id,
      name: custom.name,
      origin: custom.parentPreset
        ? `Custom · Forked from ${custom.parentPreset}`
        : "Custom Curve",
      isCustom: true,
      engine: custom.engine,
      values: custom.values,
      bezier: custom.bezier,
      spring: custom.spring,
      duration: custom.duration,
      description: custom.desc || "Custom calibrated motion curve",
      useCases: custom.useCases || [],
      kinetics,
      variants: custom.variants,
      parentPreset: custom.parentPreset,
    }
  }

  // 2. Search in BEZIER_PRESETS
  const bezierPreset = BEZIER_PRESETS.find((p) => p.id === id)
  if (bezierPreset) {
    const b = bezierPreset.value
    const values = `${b.p1.x.toFixed(2)}, ${b.p1.y.toFixed(2)}, ${b.p2.x.toFixed(2)}, ${b.p2.y.toFixed(2)}`
    const kinetics = computeKineticIntel({
      id: bezierPreset.id,
      name: bezierPreset.label,
      engine: "bezier",
      description: bezierPreset.description,
      bezier: b,
    })
    return {
      id: bezierPreset.id,
      name: bezierPreset.label,
      origin: "Standard Bezier Preset",
      isCustom: false,
      engine: "bezier",
      values,
      bezier: b,
      duration: kinetics.optimalDuration || 320,
      description: bezierPreset.description,
      useCases: bezierPreset.useCases,
      kinetics,
    }
  }

  // 3. Search in SPRING_PRESETS
  const springPreset = SPRING_PRESETS.find((p) => p.id === id)
  if (springPreset) {
    const s = springPreset.value
    const values = `m:${s.mass} s:${s.stiffness} d:${s.damping}`
    const kinetics = computeKineticIntel({
      id: springPreset.id,
      name: springPreset.label,
      engine: "spring",
      description: springPreset.description,
      spring: s,
    })
    return {
      id: springPreset.id,
      name: springPreset.label,
      origin: "Physical Spring Preset",
      isCustom: false,
      engine: "spring",
      values,
      spring: s,
      duration: kinetics.optimalDuration || 350,
      description: springPreset.description,
      useCases: springPreset.useCases,
      kinetics,
    }
  }

  // 4. Default Fallback (Standard Ease)
  const fallback = BEZIER_PRESETS[0]
  const b = fallback.value
  const values = `${b.p1.x.toFixed(2)}, ${b.p1.y.toFixed(2)}, ${b.p2.x.toFixed(2)}, ${b.p2.y.toFixed(2)}`
  const kinetics = computeKineticIntel({
    id: fallback.id,
    name: fallback.label,
    engine: "bezier",
    description: fallback.description,
    bezier: b,
  })
  return {
    id: fallback.id,
    name: fallback.label,
    origin: "Default Ease",
    isCustom: false,
    engine: "bezier",
    values,
    bezier: b,
    duration: 320,
    description: fallback.description,
    useCases: fallback.useCases,
    kinetics,
  }
}

/**
 * Calculates the current animation value [0..1] at a given progress percentage [0..100].
 */
export function getEasedValue(
  progressPct: number,
  meta: {
    engine: EngineType
    bezier?: BezierConfig
    spring?: SpringConfig
  },
  isReducedMotion: boolean = false
): number {
  const t = Math.max(0, Math.min(1, progressPct / 100))
  if (isReducedMotion) {
    return t > 0.05 ? 1 : t * 20
  }
  if (meta.engine === "bezier" && meta.bezier) {
    const { p1, p2 } = meta.bezier
    return solveCubicBezier(p1.x, p1.y, p2.x, p2.y, t)
  }
  if (meta.engine === "spring" && meta.spring) {
    const springRes = solveSpring(
      meta.spring.mass,
      meta.spring.stiffness,
      meta.spring.damping
    )
    const count = springRes.points.length
    if (count === 0) return t
    const idx = Math.min(count - 1, Math.floor(t * (count - 1)))
    return springRes.points[idx] ?? t
  }
  return t
}
