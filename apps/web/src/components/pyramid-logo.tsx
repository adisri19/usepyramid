import React from "react";

interface PyramidLogoProps {
  className?: string;
  size?: number;
}

export function PyramidLogo({ className = "h-6 w-6", size }: PyramidLogoProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: size } : undefined}
    >
      {/* 3D Wireframe Pyramid Prism */}
      <path
        d="M 50 16 L 78 69 L 41 84 L 22 64 Z"
        stroke="currentColor"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Center Spine */}
      <path
        d="M 50 16 L 41 84"
        stroke="currentColor"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PyramidLogoBadge({ className = "h-10 w-10", iconClassName = "h-6 w-6" }: { className?: string; iconClassName?: string }) {
  return (
    <div className={`flex items-center justify-center rounded-2xl bg-zinc-950 text-white shadow-md dark:bg-white dark:text-zinc-950 ${className}`}>
      <PyramidLogo className={iconClassName} />
    </div>
  );
}
