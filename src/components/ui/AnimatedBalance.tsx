"use client";

import { useState, useEffect, useRef } from 'react';

const LAST_DISPLAYED_KEY = 'nexxdi_last_displayed_balances';

interface AnimatedBalanceProps {
  value: number;
  balanceKey: string; // Unique key to track this balance (e.g., 'usd', 'cop', 'visa')
  duration?: number; // Duration in ms
  formatValue?: (value: number) => string;
  style?: React.CSSProperties;
  className?: string;
}

// Get last displayed value from sessionStorage
const getLastDisplayedValue = (key: string): number | null => {
  if (typeof window === 'undefined') return null;
  try {
    const stored = sessionStorage.getItem(LAST_DISPLAYED_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed[key] ?? null;
    }
  } catch {
    // Ignore errors
  }
  return null;
};

// Save last displayed value to sessionStorage
const saveLastDisplayedValue = (key: string, value: number) => {
  if (typeof window === 'undefined') return;
  try {
    const stored = sessionStorage.getItem(LAST_DISPLAYED_KEY);
    const current = stored ? JSON.parse(stored) : {};
    current[key] = value;
    sessionStorage.setItem(LAST_DISPLAYED_KEY, JSON.stringify(current));
  } catch {
    // Ignore errors
  }
};

/**
 * Component that animates number changes with a counting effect
 * Only animates when value actually changes (from transactions)
 * Persists last displayed value to avoid animation on remount
 */
export function AnimatedBalance({
  value,
  balanceKey,
  duration = 600,
  formatValue,
  style,
  className,
}: AnimatedBalanceProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [isInitialized, setIsInitialized] = useState(false);
  const animationRef = useRef<number | null>(null);
  const previousValueRef = useRef<number | null>(null);

  // Initialize with last displayed value from storage
  useEffect(() => {
    const lastDisplayed = getLastDisplayedValue(balanceKey);
    if (lastDisplayed !== null) {
      previousValueRef.current = lastDisplayed;
      // If current value is same as last displayed, just show it
      if (Math.abs(lastDisplayed - value) < 0.01) {
        setDisplayValue(value);
      } else {
        // Value changed while away - animate from last displayed
        setDisplayValue(lastDisplayed);
      }
    } else {
      // First time - no animation, just show current value
      previousValueRef.current = value;
      setDisplayValue(value);
      saveLastDisplayedValue(balanceKey, value);
    }
    setIsInitialized(true);
  }, [balanceKey]);

  // Animate when value changes after initialization
  useEffect(() => {
    if (!isInitialized) return;
    
    const previousValue = previousValueRef.current;
    
    // If no previous value or value hasn't changed significantly, don't animate
    if (previousValue === null || Math.abs(previousValue - value) < 0.01) {
      setDisplayValue(value);
      saveLastDisplayedValue(balanceKey, value);
      return;
    }
    
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
        saveLastDisplayedValue(balanceKey, endValue);
      }
    };

    // Cancel any ongoing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    previousValueRef.current = value;
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, duration, isInitialized, balanceKey]);

  const formattedValue = formatValue ? formatValue(displayValue) : displayValue.toFixed(2);

  return (
    <span style={style} className={className}>
      {formattedValue}
    </span>
  );
}
