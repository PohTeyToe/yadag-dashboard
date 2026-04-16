import { useEffect, useState } from 'react';
import { useMotionValue, useSpring, useTransform } from 'framer-motion';

export function useCountUp(target: number, durationMs = 1200, delayMs = 0) {
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 70, damping: 20, mass: 1 });
  const rounded = useTransform(spring, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => {
      mv.set(target);
    }, delayMs);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, delayMs]);

  useEffect(() => {
    const unsubscribe = rounded.on('change', (v) => setDisplay(v));
    return () => unsubscribe();
  }, [rounded]);

  // durationMs is kept for API compatibility; spring controls feel.
  void durationMs;

  return display;
}
