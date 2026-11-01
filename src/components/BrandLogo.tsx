import React from "react";
import Link from "next/link";
import Image from "next/image";
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
  const pixelSizes = {
    sm: 32,
    md: 40,
    lg: 48,
  };

  const iconClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
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
      <div className={`relative ${iconClasses[size]} shrink-0 flex items-center justify-center drop-shadow-sm`}>
        <Image
          src="/logo-kronabel.png"
          alt={`Logo Resmi ${SITE_CONFIG.brandName}`}
          width={pixelSizes[size]}
          height={pixelSizes[size]}
          className="h-full w-full object-contain"
          priority
        />
      </div>

      <div className="flex flex-col">
        <span className={`font-black tracking-wider text-forest-950 ${textSizes[size]}`}>
          {SITE_CONFIG.brandName}
        </span>
        {showBadge && (
          <span className="hidden text-[10px] font-medium tracking-normal text-slate-500 sm:inline-block">
            {SITE_CONFIG.brandSubtitle}
          </span>
        )}
      </div>
    </Link>
  );
};
