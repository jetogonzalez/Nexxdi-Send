"use client";

import { useState, useEffect, useRef } from 'react';

interface AnimatedBalanceProps {
  value: number;
  duration?: number; // Duration in ms
  formatValue?: (value: number) => string;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Component that animates number changes with a counting effect
 * Counts up when value increases, counts down when value decreases
 */
export function AnimatedBalance({
  value,
  duration = 500,
  formatValue,
  style,
  className,
}: AnimatedBalanceProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const animationRef = useRef<number | null>(null);
  const previousValueRef = useRef(value);

  useEffect(() => {
    const previousValue = previousValueRef.current;
    
    // If value hasn't changed, don't animate
    if (previousValue === value) return;
    
    const startValue = previousValue;
    const endValue = value;
    const difference = endValue - startValue;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out cubic)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      const currentValue = startValue + (difference * easeOut);
      setDisplayValue(currentValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(endValue);
        previousValueRef.current = endValue;
      }
    };

    // Cancel any ongoing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, duration]);

  // Update previous value ref when component mounts with new value
  useEffect(() => {
    previousValueRef.current = value;
    setDisplayValue(value);
  }, []);

  const formattedValue = formatValue ? formatValue(displayValue) : displayValue.toFixed(2);

  return (
    <span style={style} className={className}>
      {formattedValue}
    </span>
  );
}
