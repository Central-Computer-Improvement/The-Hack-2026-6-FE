// file: src/components/atoms/framer/motion.tsx
"use client";

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

// Bungkusan Dasar
export const MotionDiv = motion.div;
export const MotionNav = motion.nav;
export const MotionSpan = motion.span;
export const MotionHeader = motion.header; 


interface BackdropProps {
  onClick: () => void;
  className?: string;
  children?: React.ReactNode;
}

export const MotionBackdrop = ({ onClick }: BackdropProps) => (
  <MotionDiv
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClick}
    className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm md:hidden"
  />
);

interface DrawerProps {
  children: ReactNode;
}

export const MotionDrawer = ({ children }: DrawerProps) => (
  <MotionDiv
    initial={{ x: "-100%" }}
    animate={{ x: 0 }}
    exit={{ x: "-100%" }}
    transition={{ type: "spring", damping: 25, stiffness: 200 }}
    className="fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col overflow-y-auto bg-[#E8EFF1] shadow-2xl md:hidden"
  >
    {children}
  </MotionDiv>
);