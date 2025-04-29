"use client";

import React from "react";
import { motion } from "framer-motion";

type MotionCardProps = {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: "feature" | "info" | "plain";
};

export function MotionCard({
  children,
  className = "",
  onClick,
  icon,
  title,
  description,
  variant = "plain",
}: MotionCardProps) {
  // Base styles for different variants
  const baseStyles = 
    variant === "feature"
      ? "bg-slate-800/70 p-8 rounded-xl shadow-md border border-slate-700"
      : variant === "info" 
      ? "bg-white/5 p-6 rounded-lg shadow-sm border border-white/10"
      : ""; // plain variant has no default styling

  // Common styles for all cards
  const commonStyles = `
    h-full flex flex-col transition-all duration-400
    ${baseStyles} ${className}
  `;

  // Animation variants
  const cardVariants = {
    initial: {
      y: 0,
      backgroundColor: "rgba(30, 41, 59, 0.7)", // slate-800/70
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    },
    hover: {
      y: -4,
      backgroundColor: "rgba(58, 69, 104, 0.75)", // mix of slate and indigo
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    }
  };

  // Text animation variants
  const textVariants = {
    initial: {
      color: "rgb(148, 163, 184)" // text-slate-300
    },
    hover: {
      color: "rgb(203, 213, 225)" // text-slate-200
    }
  };

  // Title animation variants
  const titleVariants = {
    initial: {
      color: "rgb(255, 255, 255)" // text-white
    },
    hover: {
      color: "rgb(224, 231, 255)" // text-indigo-100
    }
  };

  // If using the structured card layout (icon, title, description)
  if (variant !== "plain" && (icon || title || description)) {
    return (
      <motion.div
        className={commonStyles}
        initial="initial"
        whileHover="hover"
        variants={cardVariants}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1.0] }}
        onClick={onClick}
      >
        {icon && (
          <div className="flex justify-center mb-6">
            {icon}
          </div>
        )}
        
        {title && (
          <motion.h3 
            className="text-2xl font-light tracking-tight text-white mb-4"
            variants={titleVariants}
          >
            {title}
          </motion.h3>
        )}
        
        {description && (
          <motion.p 
            className="text-slate-300 leading-relaxed flex-grow"
            variants={textVariants}
          >
            {description}
          </motion.p>
        )}
        
        {children}
      </motion.div>
    );
  }

  // For plain variant, just render the children with animations
  return (
    <motion.div
      className={commonStyles}
      initial="initial"
      whileHover="hover"
      variants={cardVariants}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1.0] }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
} 