'use client';

import { solveSpring } from '@/core/math/spring';
import { mathToSvg, svgToMath } from '@/core/transform';
import { useEaseStore } from '@/store/useEaseStore';
import React, { useMemo, useRef, useState } from 'react';

const CANVAS_SIZE = { width: 500, height: 500, padding: 60 };

export const BezierGraph = () => {
  const { mode, bezier, spring, updateBezier } = useEaseStore();
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState<'p1' | 'p2' | null>(null);

  // Points
  const start = mathToSvg({ x: 0, y: 0 }, CANVAS_SIZE);
  const end = mathToSvg({ x: 1, y: 1 }, CANVAS_SIZE);
  const p1 = mathToSvg(bezier.p1, CANVAS_SIZE);
  const p2 = mathToSvg(bezier.p2, CANVAS_SIZE);

  // --- LOGIC 1: DYNAMIC VIEWBOX (Auto-Zoom) ---
  const { springPath, dynamicViewBox } = useMemo(() => {
    let viewBox = `0 0 ${CANVAS_SIZE.width} ${CANVAS_SIZE.height}`;
    let path = '';

    // Track min/max pixels to determine if we need to zoom out
    let minPixelY = 0; // Top of standard canvas
    let maxPixelY = CANVAS_SIZE.height; // Bottom of standard canvas

    if (mode === 'spring') {
      const result = solveSpring(spring.mass, spring.stiffness, spring.damping);
      const points = result.points;

      path = points
        .map((val, index) => {
          const mathX = index / (points.length - 1);
          const svgPoint = mathToSvg({ x: mathX, y: val }, CANVAS_SIZE);

          // Track Bounds
          if (svgPoint.y < minPixelY) minPixelY = svgPoint.y;
          if (svgPoint.y > maxPixelY) maxPixelY = svgPoint.y;

          return `${index === 0 ? 'M' : 'L'} ${svgPoint.x} ${svgPoint.y}`;
        })
        .join(' ');
    } else if (mode === 'bezier') {
      // Calculate Bezier Handle Bounds
      const p1Svg = mathToSvg(bezier.p1, CANVAS_SIZE);
      const p2Svg = mathToSvg(bezier.p2, CANVAS_SIZE);

      // Check if handles go outside standard bounds
      minPixelY = Math.min(0, p1Svg.y, p2Svg.y);
      maxPixelY = Math.max(CANVAS_SIZE.height, p1Svg.y, p2Svg.y);
    }

    // Apply Padding/Buffer so handles aren't cut off exactly at the edge
    const paddingBuffer = 40;
    const requiredTop = Math.min(0, minPixelY - paddingBuffer);
    const requiredBottom = Math.max(
      CANVAS_SIZE.height,
      maxPixelY + paddingBuffer
    );
    const newHeight = requiredBottom - requiredTop;

    // ViewBox: min-x, min-y, width, height
    viewBox = `0 ${requiredTop} ${CANVAS_SIZE.width} ${newHeight}`;

    return { springPath: path, dynamicViewBox: viewBox };
  }, [mode, bezier, spring]);

  // --- INTERACTION HANDLERS ---

  const handlePointerDown = (e: React.PointerEvent, handle: 'p1' | 'p2') => {
    if (mode === 'spring') return;
    e.preventDefault();
    e.stopPropagation();
    setDragging(handle);
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging || !svgRef.current) return;

    // --- LOGIC 2: COORDINATE MAPPING ---
    const rect = svgRef.current.getBoundingClientRect();
    const [vbX, vbY, vbW, vbH] = dynamicViewBox.split(' ').map(parseFloat);

    // Calculate Ratio (SVG Units per Screen Pixel)
    const scaleX = vbW / rect.width;
    const scaleY = vbH / rect.height;

    // 1. Get Mouse relative to top-left of SVG Element (Screen Pixels)
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    // 2. Convert to SVG Coordinate Space (Apply Scaling + ViewBox Offset)
    const svgX = vbX + clientX * scaleX;
    const svgY = vbY + clientY * scaleY;

    // 3. Convert SVG Coordinate to Math Value (0-1) using existing helper
    const rawMathPoint = svgToMath({ x: svgX, y: svgY }, CANVAS_SIZE);

    // 4. Update Store (Clamp X to 0-1, allow Y to be anything)
    updateBezier(dragging, {
      x: Math.max(0, Math.min(1, rawMathPoint.x)),
      y: rawMathPoint.y,
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setDragging(null);
    if (e.target instanceof Element)
      e.target.releasePointerCapture(e.pointerId);
  };

  return (
    <div className='relative w-full mt-20 aspect-square max-w-[500px] rounded-xl bg-card border border-border shadow-sm overflow-hidden'>
      {/* Grid Pattern Background */}
      <div
        className='absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-foreground'
        style={{
          maskImage: 'radial-gradient(circle, black 1px, transparent 1px)',
          maskSize: '20px 20px',
        }}
      ></div>

      <svg
        ref={svgRef}
        viewBox={dynamicViewBox}
        className='w-full h-full touch-none'
        preserveAspectRatio='xMidYMid meet'
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* --- AXES --- */}
        <line
          x1={0}
          y1={start.y}
          x2={CANVAS_SIZE.width}
          y2={start.y}
          className='stroke-border stroke-1 dashed'
          strokeDasharray='4 4'
        />
        <line
          x1={start.x}
          y1={0}
          x2={start.x}
          y2={CANVAS_SIZE.height}
          className='stroke-border stroke-1'
        />

        {/* Target Line */}
        <line
          x1={0}
          y1={end.y}
          x2={CANVAS_SIZE.width}
          y2={end.y}
          className='stroke-primary/20 stroke-1'
        />

        {/* Start/End Dots */}
        <circle
          cx={start.x}
          cy={start.y}
          r={3}
          className='fill-muted-foreground'
        />
        <circle cx={end.x} cy={end.y} r={3} className='fill-muted-foreground' />

        {/* --- CURVES --- */}
        {mode === 'spring' ? (
          <path
            d={springPath}
            fill='none'
            vectorEffect='non-scaling-stroke'
            className='stroke-primary stroke-3'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        ) : (
          <>
            {/* Arms - Note: We use vector-effect so lines stay thin when zoomed out */}
            <line
              x1={start.x}
              y1={start.y}
              x2={p1.x}
              y2={p1.y}
              vectorEffect='non-scaling-stroke'
              className='stroke-muted-foreground/30 stroke-1'
            />
            <line
              x1={end.x}
              y1={end.y}
              x2={p2.x}
              y2={p2.y}
              vectorEffect='non-scaling-stroke'
              className='stroke-muted-foreground/30 stroke-1'
            />

            {/* Main Curve */}
            <path
              d={`M ${start.x} ${start.y} C ${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${end.x} ${end.y}`}
              fill='none'
              vectorEffect='non-scaling-stroke'
              className='stroke-primary stroke-4'
              strokeLinecap='round'
            />

            {/* Handles */}
            <g
              className='cursor-grab active:cursor-grabbing'
              onPointerDown={(e) => handlePointerDown(e, 'p1')}
            >
              {/* Invisible Hit Area (Large) */}
              <circle
                cx={p1.x}
                cy={p1.y}
                r={30}
                fill='transparent'
                vectorEffect='non-scaling-stroke'
              />
              {/* Visible Handle */}
              <circle
                cx={p1.x}
                cy={p1.y}
                r={6}
                vectorEffect='non-scaling-stroke'
                className='fill-background stroke-primary stroke-2 hover:scale-125 transition-transform'
              />
            </g>

            <g
              className='cursor-grab active:cursor-grabbing'
              onPointerDown={(e) => handlePointerDown(e, 'p2')}
            >
              <circle
                cx={p2.x}
                cy={p2.y}
                r={30}
                fill='transparent'
                vectorEffect='non-scaling-stroke'
              />
              <circle
                cx={p2.x}
                cy={p2.y}
                r={6}
                vectorEffect='non-scaling-stroke'
                className='fill-background stroke-primary stroke-2 hover:scale-125 transition-transform'
              />
            </g>
          </>
        )}
      </svg>
    </div>
  );
};
