// src/core/presets.ts
import { BezierConfig, SpringConfig } from './types';

export type Preset<T> = {
  id: string;
  label: string;
  value: T;
  description: string;
  useCases: string[];
};

export const BEZIER_PRESETS: Preset<BezierConfig>[] = [
  // --- CSS STANDARDS ---
  {
    id: 'ease',
    label: 'Default Ease',
    value: { p1: { x: 0.25, y: 0.1 }, p2: { x: 0.25, y: 1 } },
    description:
      'The browser default. Starts slightly slow, speeds up, then slows down gently. A safe, general-purpose curve.',
    useCases: [
      'General transitions',
      'Button hovers',
      'Simple opacity changes',
    ],
  },
  {
    id: 'ease-in',
    label: 'Ease In',
    value: { p1: { x: 0.42, y: 0 }, p2: { x: 1, y: 1 } },
    description:
      'Starts slowly and accelerates until the end. Feels like an object falling or moving away from the camera.',
    useCases: [
      'Exiting elements',
      'Fade outs',
      'Background elements moving away',
    ],
  },
  {
    id: 'ease-out',
    label: 'Ease Out',
    value: { p1: { x: 0, y: 0 }, p2: { x: 0.58, y: 1 } },
    description:
      'Starts quickly and decelerates to a stop. This is the most natural curve for UI entrances, mimicking friction.',
    useCases: [
      'Entering elements',
      'Modals appearing',
      'Navigation sliding in',
    ],
  },
  {
    id: 'ease-in-out',
    label: 'Ease In Out',
    value: { p1: { x: 0.42, y: 0 }, p2: { x: 0.58, y: 1 } },
    description:
      'Starts slow, speeds up in the middle, ends slow. Perfect for moving an element from Point A to Point B on screen.',
    useCases: [
      'Point-to-point movement',
      'Sidebars toggling',
      'Carousel slides',
    ],
  },

  // --- GSAP POWER 1 (Quad) ---
  {
    id: 'power1-in',
    label: 'Power1 In (Quad)',
    value: { p1: { x: 0.55, y: 0.085 }, p2: { x: 0.68, y: 0.53 } },
    description:
      'A gentle quadratic acceleration. Smoother and less aggressive than the standard Ease In.',
    useCases: ['Subtle exits', 'Minor UI elements'],
  },
  {
    id: 'power1-out',
    label: 'Power1 Out (Quad)',
    value: { p1: { x: 0.25, y: 0.46 }, p2: { x: 0.45, y: 0.94 } },
    description:
      'A gentle quadratic deceleration. ideal for simple, non-distracting UI entrances.',
    useCases: ['Tooltip appearance', 'Dropdown menus', 'Toast notifications'],
  },
  {
    id: 'power1-in-out',
    label: 'Power1 InOut (Quad)',
    value: { p1: { x: 0.455, y: 0.03 }, p2: { x: 0.515, y: 0.955 } },
    description:
      'A standard quadratic ease-in-out. Good for moderate speed transitions.',
    useCases: ['General movement', 'Page transitions'],
  },

  // --- GSAP POWER 2 (Cubic) ---
  {
    id: 'power2-in',
    label: 'Power2 In (Cubic)',
    value: { p1: { x: 0.55, y: 0.055 }, p2: { x: 0.675, y: 0.19 } },
    description:
      'Cubic acceleration. Feels heavier and more deliberate than Quad.',
    useCases: ['Heavy objects exiting', 'Longer duration fades'],
  },
  {
    id: 'power2-out',
    label: 'Power2 Out (Cubic)',
    value: { p1: { x: 0.215, y: 0.61 }, p2: { x: 0.355, y: 1 } },
    description:
      "Cubic deceleration. The 'Gold Standard' for modern UI entrances. Feels snappy yet smooth.",
    useCases: ['Card entrances', 'Modal popups', 'Sidebar sliding in'],
  },
  {
    id: 'power2-in-out',
    label: 'Power2 InOut (Cubic)',
    value: { p1: { x: 0.645, y: 0.045 }, p2: { x: 0.355, y: 1 } },
    description:
      'Cubic in-out. Offers a sharp acceleration and visible slowdown.',
    useCases: ['Full screen transitions', 'Complex data movements'],
  },

  // --- GSAP POWER 3 (Quart) ---
  {
    id: 'power3-in',
    label: 'Power3 In (Quart)',
    value: { p1: { x: 0.895, y: 0.03 }, p2: { x: 0.685, y: 0.22 } },
    description:
      'Quartic acceleration. Very slow start with a sudden snap at the end.',
    useCases: ['Dramatic exits', 'Objects zooming away'],
  },
  {
    id: 'power3-out',
    label: 'Power3 Out (Quart)',
    value: { p1: { x: 0.165, y: 0.84 }, p2: { x: 0.44, y: 1 } },
    description:
      'Quartic deceleration. Starts very fast and spends a long time settling. Very premium feel.',
    useCases: [
      'Luxury UI transitions',
      'Hero section animations',
      'Text revealing',
    ],
  },
  {
    id: 'power3-in-out',
    label: 'Power3 InOut (Quart)',
    value: { p1: { x: 0.77, y: 0 }, p2: { x: 0.175, y: 1 } },
    description: 'Quartic in-out. Dramatic speed-up in the middle.',
    useCases: ['Intro animations', 'Logo reveals'],
  },

  // --- GSAP POWER 4 (Quint) ---
  {
    id: 'power4-in',
    label: 'Power4 In (Quint)',
    value: { p1: { x: 0.755, y: 0.05 }, p2: { x: 0.855, y: 0.06 } },
    description:
      'Quintic acceleration. Almost immobile at start, then instant movement.',
    useCases: ['Rocket launch effects', 'Aggressive exits'],
  },
  {
    id: 'power4-out',
    label: 'Power4 Out (Quint)',
    value: { p1: { x: 0.23, y: 1 }, p2: { x: 0.32, y: 1 } },
    description:
      'Quintic deceleration. Extremely fast entry with a long, subtle settle.',
    useCases: ['Magazine style layouts', 'High-speed interaction responses'],
  },
  {
    id: 'power4-in-out',
    label: 'Power4 InOut (Quint)',
    value: { p1: { x: 0.86, y: 0 }, p2: { x: 0.07, y: 1 } },
    description: 'Quintic in-out. The most dramatic standard curve.',
    useCases: ['Showcase animations', 'Hardware-accelerated moves'],
  },

  // --- GSAP EXPO ---
  {
    id: 'expo-in',
    label: 'Expo In',
    value: { p1: { x: 0.95, y: 0.05 }, p2: { x: 0.795, y: 0.035 } },
    description: 'Exponential acceleration. Based on powers of 2.',
    useCases: ['Flashy transitions', 'Strobe effects'],
  },
  {
    id: 'expo-out',
    label: 'Expo Out',
    value: { p1: { x: 0.19, y: 1 }, p2: { x: 0.22, y: 1 } },
    description: "Exponential deceleration. The sharpest 'standard' ease.",
    useCases: ['Modern web design', 'Apple-style reveals'],
  },
  {
    id: 'expo-in-out',
    label: 'Expo InOut',
    value: { p1: { x: 1, y: 0 }, p2: { x: 0, y: 1 } },
    description: 'Exponential in-out. Extremely sharp middle transition.',
    useCases: ['Camera cuts', 'Scene changes'],
  },

  // --- GSAP CIRC ---
  {
    id: 'circ-in',
    label: 'Circ In',
    value: { p1: { x: 0.6, y: 0.04 }, p2: { x: 0.98, y: 0.335 } },
    description: 'Circular acceleration. Based on a quarter circle equation.',
    useCases: ['Mechanical movements', 'Robotic motion'],
  },
  {
    id: 'circ-out',
    label: 'Circ Out',
    value: { p1: { x: 0.075, y: 0.82 }, p2: { x: 0.165, y: 1 } },
    description: 'Circular deceleration. A very distinctive, rounded feel.',
    useCases: ['Bubble expansions', 'Soft UI elements'],
  },
  {
    id: 'circ-in-out',
    label: 'Circ InOut',
    value: { p1: { x: 0.785, y: 0.135 }, p2: { x: 0.15, y: 0.86 } },
    description: 'Circular in-out.',
    useCases: ['Specific mechanical simulations'],
  },

  // --- GSAP BACK ---
  {
    id: 'back-in',
    label: 'Back In',
    value: { p1: { x: 0.6, y: -0.28 }, p2: { x: 0.735, y: 0.045 } },
    description: 'Anticipates (pulls back) before moving forward.',
    useCases: ['Preparing to throw', 'Rocket launch anticipation'],
  },
  {
    id: 'back-out',
    label: 'Back Out',
    value: { p1: { x: 0.175, y: 0.885 }, p2: { x: 0.32, y: 1.275 } },
    description: 'Overshoots the target and settles back. Adds playfulness.',
    useCases: ['Popups', 'Success badges', 'Call to Action buttons'],
  },
  {
    id: 'back-in-out',
    label: 'Back InOut',
    value: { p1: { x: 0.68, y: -0.55 }, p2: { x: 0.265, y: 1.55 } },
    description: 'Anticipates at start and overshoots at end.',
    useCases: ['Elastic UI elements', 'Bouncy transitions'],
  },
];

export const SPRING_PRESETS: Preset<SpringConfig>[] = [
  // --- GSAP ELASTIC EQUIVALENTS ---
  {
    id: 'elastic-out',
    label: 'Elastic Out',
    value: { stiffness: 200, damping: 10, mass: 1, velocity: 0 },
    description:
      'A loose spring that oscillates significantly before settling.',
    useCases: ['Attention grabbers', 'Notifications', 'Rubber band effects'],
  },
  {
    id: 'elastic-soft',
    label: 'Elastic Soft',
    value: { stiffness: 100, damping: 10, mass: 1, velocity: 0 },
    description: 'A gentle, slow oscillation. Very organic.',
    useCases: ['Floating elements', 'Underwater effects'],
  },
  {
    id: 'elastic-hard',
    label: 'Elastic Hard',
    value: { stiffness: 500, damping: 15, mass: 1, velocity: 0 },
    description: 'High tension spring. Snaps into place with vibration.',
    useCases: ['Impact effects', 'Collisions'],
  },

  // --- STANDARD PRESETS ---
  {
    id: 'gentle',
    label: 'Gentle',
    value: { stiffness: 120, damping: 14, mass: 1, velocity: 0 },
    description: 'A balanced spring with minimal overshoot. Soft and pleasing.',
    useCases: ['General UI movement', 'Card transitions'],
  },
  {
    id: 'wobbly',
    label: 'Wobbly',
    value: { stiffness: 180, damping: 12, mass: 1, velocity: 0 },
    description: 'Low damping causes a noticeable wobble.',
    useCases: ['Error states (shaking)', 'Playful interactions'],
  },
  {
    id: 'stiff',
    label: 'Stiff',
    value: { stiffness: 210, damping: 20, mass: 1, velocity: 0 },
    description: 'High stiffness. Fast and responsive with little bounce.',
    useCases: ['Toggle switches', 'Checkboxes', 'Micro-interactions'],
  },

  // --- EXTREMES ---
  {
    id: 'slow',
    label: 'Slow & Heavy',
    value: { stiffness: 80, damping: 20, mass: 2, velocity: 0 },
    description: 'Simulates a heavy object. Takes time to accelerate and stop.',
    useCases: ['Large modal backdrops', 'Page transitions'],
  },
  {
    id: 'molasses',
    label: 'Molasses',
    value: { stiffness: 400, damping: 100, mass: 1, velocity: 0 },
    description:
      'Critically damped. No bounce at all. Like moving through honey.',
    useCases: ['Opacity fades', 'Color transitions', 'Strict UI'],
  },
  {
    id: 'rapid',
    label: 'Rapid',
    value: { stiffness: 400, damping: 30, mass: 1, velocity: 0 },
    description: 'High speed, high damping. Instantly snaps to target.',
    useCases: ['Hover effects', 'Active states'],
  },
];
