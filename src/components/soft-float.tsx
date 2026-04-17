"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

type SoftFloatProps = {
  children: ReactNode;
  className?: string;
  delayMs?: number;
};

export function SoftFloat({
  children,
  className = "",
  delayMs = 0,
}: SoftFloatProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(node);
        }
      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`soft-float${visible ? " soft-float--visible" : ""}${
        className ? ` ${className}` : ""
      }`}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  );
}
