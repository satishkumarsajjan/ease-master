// src/core/types.ts

export type Point = { x: number; y: number };

// Mode Selection
export type EaseMode = 'bezier' | 'spring';

// 1. Bezier Configuration
export interface BezierConfig {
  p1: Point; // Handle 1 (Start)
  p2: Point; // Handle 2 (End)
}

// 2. Spring Configuration
export interface SpringConfig {
  mass: number;
  stiffness: number;
  damping: number;
  velocity: number; // usually 0
}

// 3. The Supported Frameworks for Export
export type ExportTarget = 'css' | 'tailwind' | 'motion' | 'gsap';

// 4. The Global State Interface
export interface EditorState {
  mode: EaseMode;
  bezier: BezierConfig;
  spring: SpringConfig;
  duration: number; // in seconds (for preview & css export)
}
