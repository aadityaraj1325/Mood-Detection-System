import { animate, motion, useMotionValue } from 'framer-motion';
import { useEffect, useState } from 'react';

function AnimatedCounter({ value = 0, suffix = '', className = '' }) {
  const base = Number.isFinite(value) ? value : 0;
  const motionValue = useMotionValue(0);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const unsubscribe = motionValue.on('change', (latest) => {
      setDisplayValue(Math.round(latest));
    });

    return () => unsubscribe();
  }, [motionValue]);

  useEffect(() => {
    const controls = animate(motionValue, base, {
      duration: 1.1,
      ease: 'easeOut'
    });

    return () => controls.stop();
  }, [base, motionValue]);

  return (
    <motion.span className={className}>
      {displayValue}
      {suffix}
    </motion.span>
  );
}

export default AnimatedCounter;
