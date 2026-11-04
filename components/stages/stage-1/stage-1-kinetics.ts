import { BezierConfig, SpringConfig } from "@/core/types"
import { solveSpring } from "@/core/math/spring"
import { BEZIER_PRESETS, SPRING_PRESETS } from "@/core/presets"
import { CustomEase, KineticAnatomy, ActivePresetMeta } from "./stage-1-types"

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

export function computeKineticIntel(params: {
  id: string
  name: string
  engine: "bezier" | "spring"
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

  // Fallback
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

export function getActivePresetMeta(
  customCurves: CustomEase[],
  activePresetId: string,
  activeEngine: "bezier" | "spring"
): ActivePresetMeta {
  // 1. Check customCurves hierarchy
  for (const c of customCurves) {
    if (activePresetId === c.id) {
      return {
        name: c.name,
        subtitle: c.desc ?? `Custom · Forked from ${c.parentPreset}`,
        engine: c.engine,
        values: c.values,
        bezier: c.bezier,
        spring: c.spring,
        duration: c.duration,
      }
    }
    if (c.variants) {
      for (const v of c.variants) {
        if (activePresetId === v.id) {
          return {
            name: `${c.name} · ${v.name}`,
            subtitle: v.desc ?? `Variant · Forked from ${c.name}`,
            engine: v.engine,
            values: v.values,
            bezier: v.bezier,
            spring: v.spring,
            duration: v.duration,
          }
        }
        if (v.variants) {
          for (const sv of v.variants) {
            if (activePresetId === sv.id) {
              return {
                name: `${c.name} · ${v.name} · ${sv.name}`,
                subtitle: sv.desc ?? `Flavor · Forked from ${v.name}`,
                engine: sv.engine,
                values: sv.values,
                bezier: sv.bezier,
                spring: sv.spring,
                duration: sv.duration,
              }
            }
          }
        }
      }
    }
  }

  // 2. Find in system presets
  const allPresets = activeEngine === "bezier" ? BEZIER_PRESETS : SPRING_PRESETS
  const found = allPresets.find((p) => p.id === activePresetId) ?? allPresets[0]
  const bConf =
    activeEngine === "bezier" ? (found.value as BezierConfig) : undefined
  const sConf =
    activeEngine === "spring" ? (found.value as SpringConfig) : undefined
  const valuesStr =
    activeEngine === "bezier" && bConf
      ? `${bConf.p1.x.toFixed(2)}, ${bConf.p1.y.toFixed(2)}, ${bConf.p2.x.toFixed(2)}, ${bConf.p2.y.toFixed(2)}`
      : sConf
        ? `m:${sConf.mass} s:${sConf.stiffness} d:${sConf.damping}`
        : ""

  return {
    name: found.label,
    subtitle: found.description,
    engine: activeEngine,
    values: valuesStr,
    bezier: bConf,
    spring: sConf,
    duration: 320,
  }
}

export function getEasedValue(
  progressPct: number,
  meta: {
    engine: "bezier" | "spring"
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
