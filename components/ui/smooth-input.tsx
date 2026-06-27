"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { cn } from "@/lib/utils";

interface SmoothInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  wrapperClassName?: string;
  isSimulating?: boolean;
}

export function SmoothInput({
  className,
  wrapperClassName,
  value,
  defaultValue,
  onChange,
  onBlur,
  type = "text",
  placeholder,
  style,
  isSimulating = false,
  ...props
}: SmoothInputProps) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const caretX = useMotionValue(0);
  const caretOpacity = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);

  const isControlled = value !== undefined;
  const inputValue = isControlled ? String(value) : internalValue;

  const springCaretX = useSpring(caretX, {
    stiffness: 500,
    damping: 30,
    mass: 0.5,
  });

  const syncMeasureSpan = () => {
    const input = inputRef.current;
    const measureSpan = measureRef.current;
    if (!input || !measureSpan) return;

    const styles = window.getComputedStyle(input);
    measureSpan.style.font = `${styles.fontStyle} ${styles.fontWeight} ${styles.fontSize} ${styles.fontFamily}`;
    measureSpan.style.letterSpacing = styles.letterSpacing;
  };

  const measurePrefixWidth = (text: string) => {
    const input = inputRef.current;
    const measureSpan = measureRef.current;
    if (!input || !measureSpan) return 0;

    syncMeasureSpan();
    measureSpan.textContent = text;
    return measureSpan.offsetWidth;
  };

  const updateCaret = (text: string, isFocused: boolean) => {
    const absoluteWidth = measurePrefixWidth(text);
    const input = inputRef.current;
    if (!input) return;

    const paddingLeft = parseFloat(window.getComputedStyle(input).paddingLeft) || 0;
    const caretPosition = absoluteWidth + paddingLeft;

    caretX.set(caretPosition);
    if (isFocused || isSimulating) {
      caretOpacity.set(1);
    } else {
      caretOpacity.set(0);
    }
  };

  useEffect(() => {
    const isFocused = document.activeElement === inputRef.current;
    updateCaret(String(inputValue), isFocused);
  }, [inputValue, isSimulating]);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const handleFocus = () => updateCaret(String(inputValue), true);
    const handleBlur = () => {
      if (!isSimulating) caretOpacity.set(0);
    };

    input.addEventListener("focus", handleFocus);
    input.addEventListener("blur", handleBlur);
    return () => {
      input.removeEventListener("focus", handleFocus);
      input.removeEventListener("blur", handleBlur);
    };
  }, [inputValue, isSimulating]);

  return (
    <div className={cn(
      "bg-zinc-950 border border-zinc-800 focus-within:border-zinc-700 relative w-full rounded-xl px-4 py-3 flex items-center transition-all duration-300",
      wrapperClassName
    )}>
      <div
        ref={containerRef}
        className="relative grid grid-cols-1 w-full p-0"
        style={{ caretColor: "transparent" }}
      >
        <input
          {...props}
          ref={inputRef}
          type={type}
          placeholder={placeholder}
          className={cn(
            "col-start-1 col-end-2 row-start-1 row-end-2 w-full bg-transparent outline-none placeholder:text-zinc-600 text-white font-mono text-sm",
            className
          )}
          style={style}
          value={inputValue}
          onChange={(e) => {
            if (!isControlled) setInternalValue(e.target.value);
            onChange?.(e);
          }}
        />
        <span
          ref={measureRef}
          aria-hidden
          className="pointer-events-none invisible absolute top-0 left-0 whitespace-pre font-mono text-sm"
        />
        <motion.div
          className="bg-white pointer-events-none col-start-1 col-end-2 row-start-1 row-end-2 h-4 w-1.5 self-center"
          style={{ x: springCaretX, opacity: caretOpacity }}
        />
      </div>
    </div>
  );
}
