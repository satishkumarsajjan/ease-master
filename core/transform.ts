// src/core/transform.ts
import { Point } from './types';

interface CanvasDimensions {
  width: number;
  height: number;
  padding: number; // To ensure handles don't get cut off at edges
}

/**
 * Converts a Math Point (0-1) to an SVG Pixel Point
 */
export const mathToSvg = (point: Point, dim: CanvasDimensions): Point => {
  const availableWidth = dim.width - dim.padding * 2;
  const availableHeight = dim.height - dim.padding * 2;

  return {
    // X: simple scale + left padding
    x: point.x * availableWidth + dim.padding,

    // Y: INVERTED scale + top padding
    // (1 - y) because SVG 0 is at top, Math 1 is at top
    y: (1 - point.y) * availableHeight + dim.padding,
  };
};

/**
 * Converts an SVG Pixel Point back to Math (0-1)
 * Used when dragging handles
 */
export const svgToMath = (point: Point, dim: CanvasDimensions): Point => {
  const availableWidth = dim.width - dim.padding * 2;
  const availableHeight = dim.height - dim.padding * 2;

  return {
    x: (point.x - dim.padding) / availableWidth,
    // Un-invert the Y
    y: 1 - (point.y - dim.padding) / availableHeight,
  };
};
