import { ReactNode } from "react";

// FRAMER COMPONENTS
export interface FadeInProps {
    children: React.ReactNode;
    delay?: number;
    duration?: number;
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
    className?: string;
}

export interface StaggerContainerProps {
    children: React.ReactNode;
    className?: string;
    delayChildren?: number;
    staggerChildren?: number;
}

export interface StaggerItemProps {
    children: React.ReactNode;
    className?: string;
}

export interface ScaleInProps {
    children: React.ReactNode;
    delay?: number;
    duration?: number;
    className?: string;
}

export interface TextRevealProps {
    children: React.ReactNode;
    delay?: number;
    className?: string;
}

export interface AnimatePresenceProps {
  children: ReactNode;
  mode?: "sync" | "wait" | "popLayout";
  initial?: boolean;
  onExitComplete?: () => void;
}