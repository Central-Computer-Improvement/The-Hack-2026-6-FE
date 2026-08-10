import { useMotionValue, useMotionValueEvent, useScroll } from "framer-motion";

export function useNavbarScroll(navHeight: number = 80) {
  const { scrollY } = useScroll();
  const y = useMotionValue(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (previous === undefined) return;

    const delta = latest - previous;

    if (latest <= 0) {
      y.set(0);
      return;
    }

    const currentY = y.get();
    let nextY = currentY - delta;
    
    nextY = Math.max(-navHeight, Math.min(0, nextY));   
    y.set(nextY);
  });

  return y;
}