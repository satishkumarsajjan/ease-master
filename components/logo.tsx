import { ComponentPropsWithoutRef } from 'react';

interface LogoBezierProps extends ComponentPropsWithoutRef<'svg'> {
  className?: string;
}

export const LogoBezier = ({ className, ...props }: LogoBezierProps) => (
  <svg
    viewBox='0 0 100 100'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    className={className}
    role='img'
    aria-label='Bezier curve logo'
    {...props}
  >
    {/* Background Shape */}
    <rect width='100' height='100' rx='24' fill='#1e1e1e' />

    {/* Grid hints (Start/End Points) */}
    <circle cx='25' cy='75' r='3' fill='#52525b' />
    <circle cx='75' cy='25' r='3' fill='#52525b' />

    {/* Handle 1 (Bottom Left - Start Control) */}
    <line
      x1='25'
      y1='75'
      x2='65'
      y2='75'
      stroke='#52525b'
      strokeWidth='2'
      strokeDasharray='4 4'
    />
    <circle cx='65' cy='75' r='4' fill='#84cc16' />

    {/* Handle 2 (Top Right - End Control) - Added for symmetry */}
    <line
      x1='75'
      y1='25'
      x2='35'
      y2='25'
      stroke='#52525b'
      strokeWidth='2'
      strokeDasharray='4 4'
    />
    <circle cx='35' cy='25' r='4' fill='#84cc16' />

    {/* The Curve */}
    <path
      d='M25 75C65 75 35 25 75 25'
      stroke='#84cc16'
      strokeWidth='6'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);
