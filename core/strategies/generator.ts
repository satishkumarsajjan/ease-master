// src/core/strategies/generator.ts
import { EditorState, ExportTarget } from '@/core/types';
import { solveSpring, pointsToLinear } from '@/core/math/spring';

const f = (n: number) => n.toFixed(3).replace(/\.?0+$/, '');

export const generateCode = (
  target: ExportTarget,
  state: EditorState
): string => {
  const { mode, bezier, spring, duration } = state;

  // --- PRE-CALCULATE SPRING IF NEEDED ---
  let springLinear = '';
  let springDuration = duration;

  if (mode === 'spring') {
    const result = solveSpring(spring.mass, spring.stiffness, spring.damping);
    springLinear = pointsToLinear(result.points);
    springDuration = result.duration;
  }

  // --- CSS STRATEGY ---
  if (target === 'css') {
    if (mode === 'bezier') {
      const { p1, p2 } = bezier;
      return `transition: all ${duration}s cubic-bezier(${f(p1.x)}, ${f(
        p1.y
      )}, ${f(p2.x)}, ${f(p2.y)});`;
    }
    // Spring Mode
    return `/* Duration calculated by physics */\ntransition-duration: ${springDuration}s;\ntransition-timing-function: ${springLinear};`;
  }

  // --- TAILWIND STRATEGY ---
  if (target === 'tailwind') {
    if (mode === 'bezier') {
      const { p1, p2 } = bezier;
      return `ease-[cubic-bezier(${f(p1.x)},${f(p1.y)},${f(p2.x)},${f(
        p2.y
      )})]\nduration-[${duration * 1000}ms]`;
    }
    // Spring Mode
    // Note: Arbitrary values in Tailwind can't easily handle spaces in linear(), so we remove them
    const cleanLinear = springLinear.replace(/, /g, ',');
    return `ease-[${cleanLinear}]\nduration-[${Math.round(
      springDuration * 1000
    )}ms]`;
  }

  // --- FRAMER MOTION STRATEGY ---
  if (target === 'motion') {
    if (mode === 'bezier') {
      const { p1, p2 } = bezier;
      return `transition: {\n  duration: ${duration},\n  ease: [${f(p1.x)}, ${f(
        p1.y
      )}, ${f(p2.x)}, ${f(p2.y)}]\n}`;
    }
    return `transition: {\n  type: "spring",\n  stiffness: ${spring.stiffness},\n  damping: ${spring.damping},\n  mass: ${spring.mass}\n}`;
  }

  // --- GSAP STRATEGY ---
  if (target === 'gsap') {
    if (mode === 'bezier') {
      const { p1, p2 } = bezier;
      return `gsap.to(target, {\n  duration: ${duration},\n  ease: CustomEase.create("custom", "M0,0 C${f(
        p1.x
      )},${f(p1.y)} ${f(p2.x)},${f(p2.y)} 1,1")\n});`;
    }
    // GSAP has a standard elastic, but for full physics matching, it's complex.
    // We will use the simplified elastic helper for now.
    return `gsap.to(target, {\n  duration: ${springDuration},\n  ease: "elastic.out(${spring.mass}, 0.3)" // Approx\n});`;
  }

  return '';
};
