import { BezierConfig, SpringConfig } from "@/core/types"

export interface CustomEase {
  id: string
  name: string
  label?: string
  parentPreset: string
  engine: "bezier" | "spring"
  values: string
  bezier?: BezierConfig
  spring?: SpringConfig
  duration: number
  guidance?: string
  targetSettle?: string
  desc?: string
  useCases?: string[]
  variants?: CustomEase[]
}

export interface KineticAnatomy {
  role: string
  launchVelocity: string
  settleCharacter: string
  feel: string
  choreographyLaw: string
  timingSweetSpot: string
  optimalDuration: number
}

export interface EaseDossier {
  id: string
  name: string
  origin: string
  isCustom: boolean
  engine: "bezier" | "spring"
  values: string
  bezier?: BezierConfig
  spring?: SpringConfig
  duration: number
  description: string
  useCases: string[]
  kinetics: KineticAnatomy
  variants?: CustomEase[]
  parentPreset?: string
}

export interface PresetFamily {
  id: string
  label: string
  presetIds: string[]
}

export type ArchetypeKey = "button"

export interface ArchetypeScenario {
  id: ArchetypeKey
  name: string
  role: string
  description: string
}

export type StackLevel =
  | { level: 0 }
  | { level: 1; curveId: string }
  | { level: 2; curveId: string; variantId: string }

export interface ActivePresetMeta {
  name: string
  subtitle?: string
  engine: "bezier" | "spring"
  values: string
  bezier?: BezierConfig
  spring?: SpringConfig
  duration: number
}
