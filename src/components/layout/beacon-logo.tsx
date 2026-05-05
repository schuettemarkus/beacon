"use client";

import { motion } from "framer-motion";

interface BeaconLogoProps {
  size?: number;
  className?: string;
}

export function BeaconLogo({ size = 32, className }: BeaconLogoProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-label="Beacon logo"
    >
      {/* Outer ring */}
      <motion.circle
        cx="16"
        cy="16"
        r="14"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity={0.3}
        animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.15, 0.3] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ originX: "50%", originY: "50%" }}
        className="motion-reduce:animate-none"
      />
      {/* Middle ring */}
      <motion.circle
        cx="16"
        cy="16"
        r="9.5"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity={0.5}
        animate={{ scale: [1, 1.03, 1], opacity: [0.5, 0.3, 0.5] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.4,
        }}
        style={{ originX: "50%", originY: "50%" }}
        className="motion-reduce:animate-none"
      />
      {/* Inner ring */}
      <motion.circle
        cx="16"
        cy="16"
        r="5"
        stroke="currentColor"
        strokeWidth="2"
        opacity={0.8}
        animate={{ scale: [1, 1.02, 1], opacity: [0.8, 0.6, 0.8] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.8,
        }}
        style={{ originX: "50%", originY: "50%" }}
        className="motion-reduce:animate-none"
      />
      {/* Center dot */}
      <circle cx="16" cy="16" r="2" fill="currentColor" />
    </motion.svg>
  );
}
