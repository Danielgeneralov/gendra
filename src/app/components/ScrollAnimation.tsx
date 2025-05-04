// /components/ScrollAnimation.tsx
'use client';

import { ReactNode, useRef } from "react";
import { motion, useInView } from "framer-motion";

interface ScrollAnimationProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  threshold?: number;
  once?: boolean;
}

export function ScrollAnimation({
  children,
  delay = 0,
  className = "",
  threshold = 0.15,
  once = true,
}: ScrollAnimationProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: threshold, once });

  const variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.4,
        delay,
        ease: [0.2, 0.0, 0.2, 1.0],
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
