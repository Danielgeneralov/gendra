"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

type MotionButtonProps = {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  primary?: boolean;
};

export function MotionButton({
  children,
  className = "",
  href,
  onClick,
  type = "button",
  disabled = false,
  primary = true,
}: MotionButtonProps) {
  // Base styles depending on primary/secondary
  const baseStyles = primary
    ? "bg-blue-600 hover:bg-blue-700 text-white border border-blue-500"
    : "bg-transparent hover:bg-white/10 text-white border border-white/30";

  // Common styles for all buttons
  const commonStyles = `
    rounded-lg px-8 py-4 text-lg font-medium transition-all duration-200
    inline-flex items-center justify-center
    ${className}
  `;

  // Animation variants
  const buttonVariants = {
    initial: { 
      scale: 1,
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
    },
    hover: { 
      scale: 1.02,
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      y: -2,
    },
    tap: { 
      scale: 0.95
    },
    disabled: {
      opacity: 0.7,
      scale: 1,
      boxShadow: "none"
    }
  };
  
  // If disabled, don't apply hover animations
  const animationState = disabled ? "disabled" : "initial";

  // If button has an href, render it as a Link
  if (href) {
    return (
      <Link href={href} passHref>
        <motion.span
          className={`${commonStyles} ${baseStyles} cursor-pointer`}
          initial="initial"
          whileHover={!disabled ? "hover" : undefined}
          whileTap={!disabled ? "tap" : undefined}
          variants={buttonVariants}
          transition={{ duration: 0.1, ease: [0.25, 0.1, 0.25, 1.0] }}
        >
          {children}
        </motion.span>
      </Link>
    );
  }

  // Otherwise, render it as a button
  return (
    <motion.button
      type={type}
      className={`${commonStyles} ${baseStyles}`}
      onClick={onClick}
      disabled={disabled}
      initial="initial"
      animate={animationState}
      whileHover={!disabled ? "hover" : undefined}
      whileTap={!disabled ? "tap" : undefined}
      variants={buttonVariants}
      transition={{ duration: 0.1, ease: [0.25, 0.1, 0.25, 1.0] }}
    >
      {children}
    </motion.button>
  );
} 