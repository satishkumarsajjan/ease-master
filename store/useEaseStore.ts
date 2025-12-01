// src/store/useEaseStore.ts
import { create } from 'zustand';
import {
  EditorState,
  EaseMode,
  Point,
  BezierConfig,
  SpringConfig,
} from '@/core/types';
import { Preset, BEZIER_PRESETS } from '@/core/presets';

// 1. Info Data Structure
type PresetInfo = {
  label: string;
  description: string;
  useCases: string[];
};

// 2. Store Interface
interface EaseStore extends EditorState {
  presetInfo: PresetInfo;

  // --- ACTIONS ---
  setMode: (mode: EaseMode) => void;
  setDuration: (sec: number) => void;

  // Fine-grained updates (Drag/Sliders)
  updateBezier: (handle: 'p1' | 'p2', value: Point) => void;
  updateSpring: (key: keyof SpringConfig, value: number) => void;

  // Bulk updates (The "Old" way - kept for compatibility)
  setBezierConfig: (config: BezierConfig) => void;
  setSpringConfig: (config: SpringConfig) => void;

  // The "New" way (Updates Info Panel too)
  applyPreset: (mode: EaseMode, preset: Preset<any>) => void;
}

// 3. Defaults
const DEFAULT_PRESET = BEZIER_PRESETS[0];

const DEFAULT_SPRING: SpringConfig = {
  mass: 1,
  stiffness: 100,
  damping: 10,
  velocity: 0,
};

export const useEaseStore = create<EaseStore>((set) => ({
  // --- INITIAL STATE ---
  mode: 'bezier',
  bezier: DEFAULT_PRESET.value,
  spring: DEFAULT_SPRING,
  duration: 1.0,
  presetInfo: {
    label: DEFAULT_PRESET.label,
    description: DEFAULT_PRESET.description,
    useCases: DEFAULT_PRESET.useCases,
  },

  // --- ACTIONS ---

  setMode: (mode) => set({ mode }),
  setDuration: (duration) => set({ duration }),

  // 1. Fine-grained updates
  updateBezier: (handle, value) =>
    set((state) => ({
      bezier: { ...state.bezier, [handle]: value },
      presetInfo: {
        ...state.presetInfo,
        label: 'Custom Bezier',
        description: 'Custom configuration.',
        useCases: ['Custom requirements'],
      },
    })),

  updateSpring: (key, value) =>
    set((state) => ({
      spring: { ...state.spring, [key]: value },
      presetInfo: {
        ...state.presetInfo,
        label: 'Custom Spring',
        description: 'Custom physics simulation.',
        useCases: ['Specific physics needs'],
      },
    })),

  // 2. The "New" Action (Used by PresetSidebar)
  applyPreset: (mode, preset) =>
    set(() => ({
      mode,
      [mode]: preset.value,
      presetInfo: {
        label: preset.label,
        description: preset.description,
        useCases: preset.useCases,
      },
    })),

  // 3. The "Old" Actions (Restored for Compatibility)
  // If these are called, we assume it's a "Custom" setting because we lack metadata
  setBezierConfig: (config) =>
    set((state) => ({
      bezier: config,
      mode: 'bezier',
      presetInfo: {
        ...state.presetInfo,
        label: 'Custom Bezier',
        description: 'Manual configuration loaded.',
        useCases: [],
      },
    })),

  setSpringConfig: (config) =>
    set((state) => ({
      spring: config,
      mode: 'spring',
      presetInfo: {
        ...state.presetInfo,
        label: 'Custom Spring',
        description: 'Manual configuration loaded.',
        useCases: [],
      },
    })),
}));
