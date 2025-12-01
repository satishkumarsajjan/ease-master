// src/store/useEaseStore.ts
import { create } from 'zustand';
import {
  EditorState,
  EaseMode,
  Point,
  BezierConfig,
  SpringConfig,
} from '@/core/types';

interface StoreActions {
  setMode: (mode: EaseMode) => void;
  updateBezier: (handle: 'p1' | 'p2', value: Point) => void;
  updateSpring: (key: keyof EditorState['spring'], value: number) => void;
  setDuration: (sec: number) => void;
  setBezierConfig: (config: BezierConfig) => void;
  setSpringConfig: (config: SpringConfig) => void;
}

// Default Standard Ease (Ease-in-outish)
const DEFAULT_BEZIER = {
  p1: { x: 0.4, y: 0 },
  p2: { x: 0.2, y: 1 },
};

const DEFAULT_SPRING = {
  mass: 1,
  stiffness: 100,
  damping: 10,
  velocity: 0,
};

export const useEaseStore = create<EditorState & StoreActions>((set) => ({
  // Initial State
  mode: 'bezier',
  bezier: DEFAULT_BEZIER,
  spring: DEFAULT_SPRING,
  duration: 1.0,

  // Actions
  setMode: (mode) => set({ mode }),

  updateBezier: (handle, value) =>
    set((state) => ({
      bezier: {
        ...state.bezier,
        [handle]: value,
      },
    })),

  updateSpring: (key, value) =>
    set((state) => ({
      spring: {
        ...state.spring,
        [key]: value,
      },
    })),

  setDuration: (duration) => set({ duration }),
  setBezierConfig: (config) => set({ bezier: config }),
  setSpringConfig: (config) => set({ spring: config }),
}));
