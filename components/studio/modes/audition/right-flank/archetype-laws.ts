export interface RecommendedCurve {
  id: string
  label: string
  engine: "bezier" | "spring"
  why: string
}

export interface BestPracticeSpec {
  id: string
  name: string
  guideline: string
  targetDuration: string
  targetDurationIn?: string
  targetDurationOut?: string
  bounce: string
  recommended?: RecommendedCurve[]
  recommendedIn?: RecommendedCurve[]
  recommendedOut?: RecommendedCurve[]
}

export const BEST_PRACTICES: Record<string, BestPracticeSpec> = {
  button: {
    id: "button",
    name: "Button",
    guideline:
      "Buttons should react immediately (<180ms) with zero bounce so clicks feel crisp and responsive.",
    targetDuration: "140ms – 220ms",
    bounce: "None (0%)",
    recommended: [
      {
        id: "button",
        label: "Button Press",
        engine: "spring",
        why: "Ultra-fast tactile recovery with crisp spring physics.",
      },
      {
        id: "ultra-fast",
        label: "Ultra Fast",
        engine: "bezier",
        why: "Sharp 180ms cubic curve for instant UI feedback.",
      },
      {
        id: "stiff",
        label: "Stiff",
        engine: "spring",
        why: "High-tension mechanical snap with no lingering tail.",
      },
    ],
  },
  sheet: {
    id: "sheet",
    name: "Sheet",
    guideline:
      "Sheets should slow down smoothly as they enter, with zero bounce against the screen edge.",
    targetDuration: "300ms – 420ms",
    bounce: "None (0%)",
    recommended: [
      {
        id: "drawer",
        label: "Drawer Open",
        engine: "spring",
        why: "Controlled slide with solid, critically damped finish.",
      },
      {
        id: "modal-sheet",
        label: "Fluid Decel",
        engine: "bezier",
        why: "Swift progressive entry with cushioned friction tail.",
      },
      {
        id: "material-emphasized",
        label: "Material",
        engine: "bezier",
        why: "Expressive cubic curve calibrated for large panels.",
      },
    ],
  },
  modal: {
    id: "modal",
    name: "Modal",
    guideline:
      "Modals feel most natural with asymmetric motion: progressive scale deceleration on arrival, and swift acceleration on dismissal.",
    targetDuration: "In: 220–320ms · Out: 160–220ms",
    targetDurationIn: "220–320ms",
    targetDurationOut: "160–220ms",
    bounce: "Minimal (≤ 2%)",
    recommendedIn: [
      {
        id: "modal-sheet",
        label: "Modal Sheet",
        engine: "bezier",
        why: "Balanced cubic deceleration absorbing modal mass smoothly.",
      },
      {
        id: "power2-out",
        label: "Power2 Out",
        engine: "bezier",
        why: "Smooth quadratic deceleration for subtle dialog reveals.",
      },
      {
        id: "ios-fluid",
        label: "Fluid (iOS)",
        engine: "spring",
        why: "High natural frequency spring for modern mobile OS feel.",
      },
    ],
    recommendedOut: [
      {
        id: "modal-sheet-exit",
        label: "Exit Swift",
        engine: "bezier",
        why: "Steep cubic acceleration clearing the dialog without visual linger.",
      },
      {
        id: "expo-in",
        label: "Expo In",
        engine: "bezier",
        why: "Exponential acceleration for snappy, instant dismissal.",
      },
      {
        id: "ease-in",
        label: "Ease In",
        engine: "bezier",
        why: "Natural cubic acceleration mimicking physical gravity falloff.",
      },
    ],
  },
  toast: {
    id: "toast",
    name: "Toast",
    guideline:
      "Notifications need a swift entrance to catch attention, followed by a quiet, subtle settle.",
    targetDuration: "200ms – 280ms",
    bounce: "Subtle (≤ 4%)",
    recommended: [
      {
        id: "toast",
        label: "Toast Snap",
        engine: "spring",
        why: "Quick entry with a subtle, friendly settlement.",
      },
      {
        id: "ease-out",
        label: "Ease Out",
        engine: "bezier",
        why: "Natural friction deceleration mimicking air drag.",
      },
      {
        id: "material-pop",
        label: "Soft Pop",
        engine: "spring",
        why: "Gentle bounce for affirmative notification banners.",
      },
    ],
  },
  dropdown: {
    id: "dropdown",
    name: "Dropdown",
    guideline:
      "Menus should deploy quickly from their trigger without delaying navigation or covering controls.",
    targetDuration: "140ms – 220ms",
    bounce: "None (0%)",
    recommended: [
      {
        id: "ultra-fast",
        label: "Ultra Fast",
        engine: "bezier",
        why: "Near-instantaneous deployment for menus.",
      },
      {
        id: "power1-out",
        label: "Power1 Out",
        engine: "bezier",
        why: "Gentle linear-decel hybrid for subtle disclosure.",
      },
      {
        id: "button",
        label: "Button Press",
        engine: "spring",
        why: "High-damping snap suitable for popover anchors.",
      },
    ],
  },
  carousel: {
    id: "carousel",
    name: "Carousel",
    guideline:
      "Slides should glide smoothly with momentum and snap cleanly to the next item.",
    targetDuration: "280ms – 400ms",
    bounce: "None (0%)",
    recommended: [
      {
        id: "material-standard",
        label: "Standard",
        engine: "bezier",
        why: "Symmetric ease-in-out for point-to-point sliding.",
      },
      {
        id: "ios-fluid",
        label: "Fluid (iOS)",
        engine: "spring",
        why: "Gesture-ready inertial momentum and zero hard stops.",
      },
      {
        id: "power3-out",
        label: "Power3 Out",
        engine: "bezier",
        why: "Cubic ease-out with generous coasting deceleration.",
      },
    ],
  },
}
