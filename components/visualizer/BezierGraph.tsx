// src/components/visualizer/BezierGraph.tsx
'use client';

import React, { useRef, useState, useMemo } from 'react';
import { useEaseStore } from '@/store/useEaseStore';
import { mathToSvg, svgToMath } from '@/core/transform';
import { solveSpring } from '@/core/math/spring';
import { clsx } from 'clsx';

// Visual Configuration
const CANVAS_SIZE = { width: 400, height: 400, padding: 60 };
const GRID_COLOR = 'stroke-slate-200 dark:stroke-slate-800';

export const BezierGraph = () => {
  // 1. Connect to Global Store
  const { mode, bezier, spring, updateBezier } = useEaseStore();
  const svgRef = useRef<SVGSVGElement>(null);

  // 2. Local State for Dragging
  const [dragging, setDragging] = useState<'p1' | 'p2' | null>(null);

  // 3. Pre-calculate SVG Points for Grid (0,0 to 1,1)
  const start = mathToSvg({ x: 0, y: 0 }, CANVAS_SIZE);
  const end = mathToSvg({ x: 1, y: 1 }, CANVAS_SIZE);
  const p1 = mathToSvg(bezier.p1, CANVAS_SIZE);
  const p2 = mathToSvg(bezier.p2, CANVAS_SIZE);

  // 4. Heavy Math: Calculate Spring Points & ViewBox
  // We use useMemo to prevent re-calculating physics 60fps when dragging UI
  const { springPath, dynamicViewBox } = useMemo(() => {
    // Default ViewBox
    let viewBox = `0 0 ${CANVAS_SIZE.width} ${CANVAS_SIZE.height}`;
    let path = '';

    if (mode === 'spring') {
      const result = solveSpring(spring.mass, spring.stiffness, spring.damping);
      const points = result.points;

      // Track pixel bounds to auto-fit the graph
      let minPixelY = Infinity;
      let maxPixelY = -Infinity;

      path = points
        .map((val, index) => {
          const mathX = index / (points.length - 1);
          const svgPoint = mathToSvg({ x: mathX, y: val }, CANVAS_SIZE);

          // Update bounds
          if (svgPoint.y < minPixelY) minPixelY = svgPoint.y;
          if (svgPoint.y > maxPixelY) maxPixelY = svgPoint.y;

          return `${index === 0 ? 'M' : 'L'} ${svgPoint.x} ${svgPoint.y}`;
        })
        .join(' ');

      // LOGIC: If points go outside the canvas, expand the camera (ViewBox)
      // Standard Top is 0, Standard Bottom is 400.
      const paddingBuffer = 20; // Extra breathing room
      const requiredTop = Math.min(0, minPixelY - paddingBuffer);
      const requiredBottom = Math.max(
        CANVAS_SIZE.height,
        maxPixelY + paddingBuffer
      );
      const newHeight = requiredBottom - requiredTop;

      viewBox = `0 ${requiredTop} ${CANVAS_SIZE.width} ${newHeight}`;
    }

    return { springPath: path, dynamicViewBox: viewBox };
  }, [mode, spring]); // Only re-run if spring config or mode changes

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

    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rawMathPoint = svgToMath({ x, y }, CANVAS_SIZE);

    // Note: If viewbox is zoomed out, interaction might drift slightly unless
    // we apply the scale factor, but for Bezier mode (which uses dragging)
    // the viewBox is always fixed 0-400, so this logic remains safe.

    const constrainedPoint = {
      x: Math.max(0, Math.min(1, rawMathPoint.x)),
      y: rawMathPoint.y,
    };

    updateBezier(dragging, constrainedPoint);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setDragging(null);
    if (e.target instanceof Element) {
      e.target.releasePointerCapture(e.pointerId);
    }
  };

  return (
    <div className='relative flex flex-col items-center w-full'>
      {/* Container Frame */}
      {/* Added overflow-hidden to ensure rounded corners clip the content if zoomed */}
      <div className='w-full max-w-[400px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950'>
        <svg
          ref={svgRef}
          // Dynamic ViewBox is the key fix here
          viewBox={dynamicViewBox}
          // Remove fixed width/height to allow responsive CSS scaling
          className='w-full h-auto touch-none select-none'
          // We keep the aspect ratio instructions to ensure it centers nicely
          preserveAspectRatio='xMidYMid meet'
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          {/* --- LAYER 1: GRID --- */}
          {/* Diagonal Guide */}
          <line
            x1={start.x}
            y1={start.y}
            x2={end.x}
            y2={end.y}
            className='stroke-slate-100 stroke-2 dark:stroke-slate-800'
          />

          {/* Axes */}
          <line
            x1={0}
            y1={start.y}
            x2={CANVAS_SIZE.width}
            y2={start.y}
            className={GRID_COLOR}
          />
          <line
            x1={start.x}
            y1={0}
            x2={start.x}
            y2={CANVAS_SIZE.height}
            className={GRID_COLOR}
          />

          {/* Start/End Points */}
          <circle cx={start.x} cy={start.y} r={4} className='fill-slate-300' />
          <circle cx={end.x} cy={end.y} r={4} className='fill-slate-300' />

          {/* --- LAYER 2: DATA CURVES --- */}
          {mode === 'spring' ? (
            <path
              d={springPath}
              fill='none'
              // non-scaling-stroke ensures line doesn't get thin when we zoom out
              vectorEffect='non-scaling-stroke'
              className='stroke-blue-500 stroke-3'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          ) : (
            <>
              {/* Connector Arms */}
              <line
                x1={start.x}
                y1={start.y}
                x2={p1.x}
                y2={p1.y}
                className='stroke-purple-200 stroke-2 dark:stroke-purple-900'
              />
              <line
                x1={end.x}
                y1={end.y}
                x2={p2.x}
                y2={p2.y}
                className='stroke-pink-200 stroke-2 dark:stroke-pink-900'
              />

              {/* The Curve */}
              <path
                d={`M ${start.x} ${start.y} C ${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${end.x} ${end.y}`}
                fill='none'
                className='stroke-slate-900 stroke-3 dark:stroke-white'
                strokeLinecap='round'
              />

              {/* Handles */}
              <g
                className='cursor-grab active:cursor-grabbing'
                onPointerDown={(e) => handlePointerDown(e, 'p1')}
              >
                <circle cx={p1.x} cy={p1.y} r={20} fill='transparent' />
                <circle
                  cx={p1.x}
                  cy={p1.y}
                  r={6}
                  className={clsx(
                    'fill-purple-500 transition-transform',
                    dragging === 'p1' && 'scale-125'
                  )}
                />
                <circle
                  cx={p1.x}
                  cy={p1.y}
                  r={12}
                  className='fill-purple-500/20 stroke-purple-500'
                />
              </g>

              <g
                className='cursor-grab active:cursor-grabbing'
                onPointerDown={(e) => handlePointerDown(e, 'p2')}
              >
                <circle cx={p2.x} cy={p2.y} r={20} fill='transparent' />
                <circle
                  cx={p2.x}
                  cy={p2.y}
                  r={6}
                  className={clsx(
                    'fill-pink-500 transition-transform',
                    dragging === 'p2' && 'scale-125'
                  )}
                />
                <circle
                  cx={p2.x}
                  cy={p2.y}
                  r={12}
                  className='fill-pink-500/20 stroke-pink-500'
                />
              </g>
            </>
          )}
        </svg>
      </div>

      {/* Legend */}
      <div className='mt-4 flex gap-8 text-xs font-medium text-slate-500'>
        {mode === 'bezier' ? (
          <>
            <div className='flex items-center gap-2'>
              <div className='h-2 w-2 rounded-full bg-purple-500' />
              <span>Ease In (Start)</span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='h-2 w-2 rounded-full bg-pink-500' />
              <span>Ease Out (End)</span>
            </div>
          </>
        ) : (
          <div className='flex items-center gap-2'>
            <div className='h-2 w-2 rounded-full bg-blue-500' />
            <span>Physics Simulation</span>
          </div>
        )}
      </div>
    </div>
  );
};
