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

  // --- MATERIAL DESIGN (Google) ---
  {
    id: 'material-standard',
    label: 'Material Standard',
    value: { p1: { x: 0.4, y: 0.0 }, p2: { x: 0.2, y: 1 } },
    description:
      'The standard curve for Material Design 2. Used for moving elements within the screen bounds.',
    useCases: ['Tabs switching', 'Card expansion', 'List item reordering'],
  },
  {
    id: 'material-emphasized',
    label: 'Material Emphasized',
    value: { p1: { x: 0.2, y: 0.0 }, p2: { x: 0.0, y: 1.0 } },
    description:
      'Material 3 Emphasized. A dramatic curve for elements that need to capture attention immediately.',
    useCases: [
      'FAB (Floating Action Button)',
      'Modal openings',
      'Important alerts',
    ],
  },
  {
    id: 'material-decelerate',
    label: 'Material Decelerate',
    value: { p1: { x: 0.0, y: 0.0 }, p2: { x: 0.2, y: 1 } },
    description:
      'Incoming elements. Starts at peak velocity and slows down. Very responsive.',
    useCases: ['Toasts entering', 'Drawers sliding in', 'New content loading'],
  },
  {
    id: 'material-accelerate',
    label: 'Material Accelerate',
    value: { p1: { x: 0.4, y: 0.0 }, p2: { x: 1, y: 1 } },
    description:
      'Outgoing elements. Starts moving and keeps accelerating off-screen.',
    useCases: [
      'Closing modals',
      'Deleting list items',
      'Notifications exiting',
    ],
  },

  // --- MODERN / CINEMATIC ---
  {
    id: 'ultra-fast',
    label: 'Ultra Fast',
    value: { p1: { x: 0.05, y: 0.7 }, p2: { x: 0.1, y: 1 } },
    description:
      'Almost instant movement with a tiny amount of smoothing at the very end.',
    useCases: ['Hover states', 'Micro-interactions', 'Fast feedback'],
  },
  {
    id: 'cinematic-slow',
    label: 'Cinematic',
    value: { p1: { x: 0.7, y: 0 }, p2: { x: 0.3, y: 1 } },
    description:
      'Slow start, fast middle, slow end. A very exaggerated Ease-In-Out for dramatic effect.',
    useCases: ['Hero section intros', 'Full-page transitions', 'Logo reveals'],
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
  // --- UI PATTERNS ---
  {
    id: 'button',
    label: 'Button Press',
    value: { stiffness: 600, damping: 35, mass: 0.5, velocity: 0 },
    description:
      'Ultra fast with almost no overshoot. Feels responsive and tactile.',
    useCases: ['Active buttons', 'Toggle switches', 'Micro-interactions'],
  },
  {
    id: 'toast',
    label: 'Toast Snap',
    value: { stiffness: 350, damping: 22, mass: 1, velocity: 0 },
    description: 'Quick entry with a subtle, friendly settlement.',
    useCases: ['Notifications', 'Alerts', 'Dropdown lists'],
  },
  {
    id: 'drawer',
    label: 'Drawer Open',
    value: { stiffness: 250, damping: 25, mass: 1, velocity: 0 },
    description: 'Controlled slide with a solid finish.',
    useCases: ['Sidebars', 'Modals', 'Overlay menus'],
  },

  // --- OS & FRAMEWORKS ---
  {
    id: 'ios-fluid',
    label: 'Fluid (iOS)',
    value: { stiffness: 380, damping: 30, mass: 1, velocity: 0 },
    description:
      'High energy but perfectly damped. Mimics the "Fluid" feel of modern mobile OS.',
    useCases: ['Page navigation', 'Swipe gestures', 'App launching'],
  },
  {
    id: 'material-pop',
    label: 'Soft Pop',
    value: { stiffness: 280, damping: 18, mass: 1, velocity: 0 },
    description:
      'Classic material design feel. Distinct overshoot that feels friendly.',
    useCases: [
      'FAB (Floating Action Button)',
      'Card expansion',
      'Dialog opening',
    ],
  },
  {
    id: 'react-default',
    label: 'React Default',
    value: { stiffness: 170, damping: 26, mass: 1, velocity: 0 },
    description:
      'The standard feel for React Spring. Balanced and slightly soft.',
    useCases: ['General component transitions', 'List reordering'],
  },

  // --- NATURAL / ORGANIC ---
  {
    id: 'soap-bubble',
    label: 'Soap Bubble',
    value: { stiffness: 150, damping: 8, mass: 1.2, velocity: 0 },
    description:
      'Wobbly and slow to settle, like a bubble floating in the air.',
    useCases: ['Playful logos', 'Idle animations', 'Kid-friendly UI'],
  },
  {
    id: 'underwater',
    label: 'Underwater',
    value: { stiffness: 60, damping: 30, mass: 2, velocity: 0 },
    description:
      'High drag/damping. Movements feel resistant and slow, like moving through water.',
    useCases: ['Parallax effects', 'Smooth scrolling elements'],
  },
  {
    id: 'rubber-band',
    label: 'Rubber Band',
    value: { stiffness: 300, damping: 10, mass: 0.8, velocity: 0 },
    description: 'High elasticity. Snaps back forth rapidly before settling.',
    useCases: ['Pull-to-refresh', 'Limit reached feedback'],
  },

  // --- MECHANICAL ---
  {
    id: 'mechanical-arm',
    label: 'Robot Arm',
    value: { stiffness: 700, damping: 60, mass: 2, velocity: 0 },
    description:
      'High stiffness and high mass. Stops precisely without wobble.',
    useCases: ['Industrial dashboards', 'Precision tools', 'Grid snapping'],
  },
  {
    id: 'hard-snap',
    label: 'Hard Snap',
    value: { stiffness: 800, damping: 45, mass: 1, velocity: 0 },
    description: 'Instantaneous movement with a harsh stop. No playfulness.',
    useCases: ['Technical alerts', 'Camera shutters', 'Fast UI changes'],
  },

  // --- PHYSICAL MATERIALS ---
  {
    id: 'heavy',
    label: 'Heavy Chain',
    value: { stiffness: 250, damping: 40, mass: 4, velocity: 0 },
    description:
      'High mass creates a slow start and a heavy, thud-like finish.',
    useCases: ['Industrial UI', 'Loading heavy data', 'Draggable elements'],
  },
  {
    id: 'helium',
    label: 'Helium Balloon',
    value: { stiffness: 90, damping: 10, mass: 0.5, velocity: 0 },
    description: 'Low mass and stiffness creates a floaty, drifting effect.',
    useCases: ['Floating badges', 'Background animations', 'Gentle hovers'],
  },
  {
    id: 'super-bouncy',
    label: 'Super Bouncy',
    value: { stiffness: 200, damping: 5, mass: 1, velocity: 0 },
    description:
      'Very low damping causes extreme oscillation. Use with caution.',
    useCases: ['Game UI', 'Success animations', 'Attention grabbers'],
  },

  // --- SPECIAL EFFECTS ---
  {
    id: 'trampoline',
    label: 'Trampoline',
    value: { stiffness: 120, damping: 5, mass: 2, velocity: 0 },
    description: 'Heavy mass on a loose spring. Bounces for a long time.',
    useCases: ['Loading indicators', 'Playful "Boing" effects'],
  },
  {
    id: 'glitch',
    label: 'Glitch Vibrate',
    value: { stiffness: 1000, damping: 15, mass: 0.1, velocity: 0 },
    description: 'Extreme stiffness and low mass creates a buzzing vibration.',
    useCases: ['Error states', 'Access denied', 'High tension alerts'],
  },

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
