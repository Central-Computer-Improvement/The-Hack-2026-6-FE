"use client";

import { AnimatePresence as FramerAnimatePresence } from "framer-motion";
import { AnimatePresenceProps } from "@/types"; 

export default function AnimatePresence({ 
  children, 
  ...props 
}: AnimatePresenceProps) {
  return (
    <FramerAnimatePresence {...props}>
      {children}
    </FramerAnimatePresence>
  );
}