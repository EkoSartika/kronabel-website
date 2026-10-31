import React from "react";
import Link from "next/link";
import { SITE_CONFIG } from "@/config/site";

interface BrandLogoProps {
  className?: string;
  showBadge?: boolean;
  size?: "sm" | "md" | "lg";
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = "",
  showBadge = true,
  size = "md",
}) => {
  const iconSizes = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-11 h-11",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 font-bold tracking-tight text-forest-900 transition-opacity hover:opacity-90 ${className}`}
    >
      {/* Geometric Bell Icon */}
      <div
        className={`${iconSizes[size]} relative flex items-center justify-center rounded-xl bg-gradient-to-br from-forest-900 via-forest-950 to-forest-dark p-2 text-gold-400 shadow-md ring-1 ring-gold-accent/40`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-full w-full drop-shadow-sm"
        >
          {/* Bell Body */}
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          {/* Bell Clapper */}
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          {/* Little Sound / Clock tick indicator */}
          <circle cx="12" cy="3" r="1" fill="#fde68a" stroke="none" />
        </svg>
      </div>

      <div className="flex flex-col">
        <span className={`font-black tracking-wider text-forest-950 ${textSizes[size]}`}>
          {SITE_CONFIG.brandName}
        </span>
        <span className="hidden text-[10px] font-medium tracking-normal text-slate-500 sm:inline-block">
          {SITE_CONFIG.brandSubtitle}
        </span>
      </div>
    </Link>
  );
};

