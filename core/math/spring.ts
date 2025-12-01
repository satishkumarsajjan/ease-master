// src/core/math/spring.ts

export interface SpringResult {
  points: number[];
  duration: number;
}

export const solveSpring = (
  mass: number,
  stiffness: number,
  damping: number,
  velocity: number = 0, // Initial velocity
  precision: number = 0.005 // Tighter precision (0.5%) for smoother ends
): SpringResult => {
  // Safety: Prevent divide by zero or imaginary numbers
  if (mass <= 0 || stiffness <= 0) {
    return { points: [0, 1], duration: 1 };
  }

  const w0 = Math.sqrt(stiffness / mass); // Natural frequency
  const zeta = damping / (2 * Math.sqrt(stiffness * mass)); // Damping ratio

  let t = 0;
  const step = 1 / 60; // 60fps
  let isMoving = true;
  const values: number[] = [];

  // --- SOLVER LOGIC ---
  const getPosition = (t: number): number => {
    let envelope;

    // 1. Under-damped (Bouncy)
    if (zeta < 1) {
      envelope = Math.exp(-zeta * w0 * t);
      const wd = w0 * Math.sqrt(1 - zeta * zeta); // Damped frequency
      const oscillation =
        Math.cos(wd * t) +
        (zeta / Math.sqrt(1 - zeta * zeta)) * Math.sin(wd * t);
      return 1 - envelope * oscillation;
    }

    // 2. Critically Damped (No Bounce, Fast)
    else if (zeta === 1) {
      envelope = Math.exp(-w0 * t);
      return 1 - envelope * (1 + w0 * t);
    }

    // 3. Over-damped (Slow, No Bounce)
    else {
      const wd = w0 * Math.sqrt(zeta * zeta - 1);
      const z1 = -zeta * w0 + wd;
      const z2 = -zeta * w0 - wd;

      // BUG FIX: The original formula started at 2.
      // Correct derivation for x(0)=0 implies a different sign structure.
      // x(t) = 1 + (z2 * e^(z1*t) - z1 * e^(z2*t)) / (z1 - z2)
      // Denominator (z1 - z2) = 2*wd
      return (
        1 + (1 / (2 * wd)) * (z2 * Math.exp(z1 * t) - z1 * Math.exp(z2 * t))
      );
    }
  };

  // --- SIMULATION LOOP ---
  let consecutiveSettledFrames = 0;

  while (isMoving) {
    const position = getPosition(t);
    values.push(position);

    // Check if settled
    // We require 3 consecutive frames of "settled" state to ensure we aren't just passing through 1.0
    if (Math.abs(1 - position) < precision) {
      consecutiveSettledFrames++;
      if (consecutiveSettledFrames > 10) {
        isMoving = false;
      }
    } else {
      consecutiveSettledFrames = 0;
    }

    t += step;

    // Hard Stop at 10s to prevent infinite loops in broken physics configs
    if (t > 10) isMoving = false;
  }

  // BUG FIX: Ensure the final value is exactly 1 to avoid a visual "snap"
  if (values[values.length - 1] !== 1) {
    values.push(1);
  }

  return {
    points: values,
    duration: parseFloat(t.toFixed(2)),
  };
};

/**
 * Smart Sampling for CSS linear()
 * Preserves Peaks/Valleys while reducing point count
 */
export const pointsToLinear = (points: number[]): string => {
  if (points.length === 0) return 'linear(0, 1)';

  // We want roughly 50 points max for CSS string length sanity
  const targetCount = 50;
  const totalPoints = points.length;

  // If short animation, return all
  if (totalPoints <= targetCount) {
    return `linear(${points.map(formatNum).join(', ')})`;
  }

  // Smart Sampling
  const sampled: number[] = [];
  sampled.push(points[0]); // Always keep start

  const step = Math.floor(totalPoints / targetCount);

  for (let i = 1; i < totalPoints - 1; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const next = points[i + 1];

    // 1. Peak Detection (Local Maxima)
    const isPeak = curr > prev && curr > next;
    // 2. Valley Detection (Local Minima)
    const isValley = curr < prev && curr < next;
    // 3. Regular Interval
    const isInterval = i % step === 0;

    // BUG FIX: Always include peaks/valleys to prevent the graph from looking "clipped"
    if (isPeak || isValley || isInterval) {
      sampled.push(curr);
    }
  }

  sampled.push(1); // Always keep end

  // Use percentages for linear() to be 100% accurate with uneven sampling
  // However, simple linear() support (without %) is better for cross-browser "copy-paste" safety
  // So we stick to values, but reliance on Peak Detection makes it visually accurate.
  return `linear(${sampled.map(formatNum).join(', ')})`;
};

// Helper for string formatting
const formatNum = (n: number) => n.toFixed(3).replace(/\.?0+$/, '');
