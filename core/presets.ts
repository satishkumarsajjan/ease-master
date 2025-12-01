// src/core/presets.ts
import { BezierConfig, SpringConfig } from './types';

type Preset<T> = {
  id: string;
  label: string;
  value: T;
};

export const BEZIER_PRESETS: Preset<BezierConfig>[] = [
  // --- CSS STANDARDS ---
  {
    id: 'ease',
    label: 'Default Ease',
    value: { p1: { x: 0.25, y: 0.1 }, p2: { x: 0.25, y: 1 } },
  },
  {
    id: 'ease-in',
    label: 'Ease In',
    value: { p1: { x: 0.42, y: 0 }, p2: { x: 1, y: 1 } },
  },
  {
    id: 'ease-out',
    label: 'Ease Out',
    value: { p1: { x: 0, y: 0 }, p2: { x: 0.58, y: 1 } },
  },
  {
    id: 'ease-in-out',
    label: 'Ease In Out',
    value: { p1: { x: 0.42, y: 0 }, p2: { x: 0.58, y: 1 } },
  },

  // --- GSAP POWER 1 (Quad) ---
  {
    id: 'power1-in',
    label: 'Power1 In (Quad)',
    value: { p1: { x: 0.55, y: 0.085 }, p2: { x: 0.68, y: 0.53 } },
  },
  {
    id: 'power1-out',
    label: 'Power1 Out (Quad)',
    value: { p1: { x: 0.25, y: 0.46 }, p2: { x: 0.45, y: 0.94 } },
  },
  {
    id: 'power1-in-out',
    label: 'Power1 InOut (Quad)',
    value: { p1: { x: 0.455, y: 0.03 }, p2: { x: 0.515, y: 0.955 } },
  },

  // --- GSAP POWER 2 (Cubic) ---
  {
    id: 'power2-in',
    label: 'Power2 In (Cubic)',
    value: { p1: { x: 0.55, y: 0.055 }, p2: { x: 0.675, y: 0.19 } },
  },
  {
    id: 'power2-out',
    label: 'Power2 Out (Cubic)',
    value: { p1: { x: 0.215, y: 0.61 }, p2: { x: 0.355, y: 1 } },
  },
  {
    id: 'power2-in-out',
    label: 'Power2 InOut (Cubic)',
    value: { p1: { x: 0.645, y: 0.045 }, p2: { x: 0.355, y: 1 } },
  },

  // --- GSAP POWER 3 (Quart) ---
  {
    id: 'power3-in',
    label: 'Power3 In (Quart)',
    value: { p1: { x: 0.895, y: 0.03 }, p2: { x: 0.685, y: 0.22 } },
  },
  {
    id: 'power3-out',
    label: 'Power3 Out (Quart)',
    value: { p1: { x: 0.165, y: 0.84 }, p2: { x: 0.44, y: 1 } },
  },
  {
    id: 'power3-in-out',
    label: 'Power3 InOut (Quart)',
    value: { p1: { x: 0.77, y: 0 }, p2: { x: 0.175, y: 1 } },
  },

  // --- GSAP POWER 4 (Quint) ---
  {
    id: 'power4-in',
    label: 'Power4 In (Quint)',
    value: { p1: { x: 0.755, y: 0.05 }, p2: { x: 0.855, y: 0.06 } },
  },
  {
    id: 'power4-out',
    label: 'Power4 Out (Quint)',
    value: { p1: { x: 0.23, y: 1 }, p2: { x: 0.32, y: 1 } },
  },
  {
    id: 'power4-in-out',
    label: 'Power4 InOut (Quint)',
    value: { p1: { x: 0.86, y: 0 }, p2: { x: 0.07, y: 1 } },
  },

  // --- GSAP EXPO ---
  {
    id: 'expo-in',
    label: 'Expo In',
    value: { p1: { x: 0.95, y: 0.05 }, p2: { x: 0.795, y: 0.035 } },
  },
  {
    id: 'expo-out',
    label: 'Expo Out',
    value: { p1: { x: 0.19, y: 1 }, p2: { x: 0.22, y: 1 } },
  },
  {
    id: 'expo-in-out',
    label: 'Expo InOut',
    value: { p1: { x: 1, y: 0 }, p2: { x: 0, y: 1 } },
  },

  // --- GSAP CIRC ---
  {
    id: 'circ-in',
    label: 'Circ In',
    value: { p1: { x: 0.6, y: 0.04 }, p2: { x: 0.98, y: 0.335 } },
  },
  {
    id: 'circ-out',
    label: 'Circ Out',
    value: { p1: { x: 0.075, y: 0.82 }, p2: { x: 0.165, y: 1 } },
  },
  {
    id: 'circ-in-out',
    label: 'Circ InOut',
    value: { p1: { x: 0.785, y: 0.135 }, p2: { x: 0.15, y: 0.86 } },
  },

  // --- GSAP BACK ---
  {
    id: 'back-in',
    label: 'Back In',
    value: { p1: { x: 0.6, y: -0.28 }, p2: { x: 0.735, y: 0.045 } },
  },
  {
    id: 'back-out',
    label: 'Back Out',
    value: { p1: { x: 0.175, y: 0.885 }, p2: { x: 0.32, y: 1.275 } },
  },
  {
    id: 'back-in-out',
    label: 'Back InOut',
    value: { p1: { x: 0.68, y: -0.55 }, p2: { x: 0.265, y: 1.55 } },
  },
];

export const SPRING_PRESETS: Preset<SpringConfig>[] = [
  // --- GSAP ELASTIC EQUIVALENTS ---
  {
    id: 'elastic-out',
    label: 'Elastic Out',
    value: { stiffness: 200, damping: 10, mass: 1, velocity: 0 },
  },
  {
    id: 'elastic-soft',
    label: 'Elastic Soft',
    value: { stiffness: 100, damping: 10, mass: 1, velocity: 0 },
  },
  {
    id: 'elastic-hard',
    label: 'Elastic Hard',
    value: { stiffness: 500, damping: 15, mass: 1, velocity: 0 },
  },

  // --- STANDARD PRESETS ---
  {
    id: 'gentle',
    label: 'Gentle',
    value: { stiffness: 120, damping: 14, mass: 1, velocity: 0 },
  },
  {
    id: 'wobbly',
    label: 'Wobbly',
    value: { stiffness: 180, damping: 12, mass: 1, velocity: 0 },
  },
  {
    id: 'stiff',
    label: 'Stiff',
    value: { stiffness: 210, damping: 20, mass: 1, velocity: 0 },
  },

  // --- EXTREMES ---
  {
    id: 'slow',
    label: 'Slow & Heavy',
    value: { stiffness: 80, damping: 20, mass: 2, velocity: 0 },
  },
  {
    id: 'molasses',
    label: 'Molasses (No Bounce)',
    value: { stiffness: 400, damping: 100, mass: 1, velocity: 0 },
  },
  {
    id: 'rapid',
    label: 'Rapid',
    value: { stiffness: 400, damping: 30, mass: 1, velocity: 0 },
  },
];
