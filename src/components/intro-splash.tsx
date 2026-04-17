"use client";

import { useEffect, useState } from "react";

export function IntroSplash() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setVisible(false);
    }, 1550);

    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="intro-overlay pointer-events-none fixed inset-0 z-50 overflow-hidden"
    >
      <div className="intro-sheet absolute inset-0" />
      <div className="intro-clean-edge absolute inset-x-0 top-0" />
      <div className="intro-water absolute inset-x-0 top-0">
        <div className="intro-water-bar" />
        <span className="intro-water-streak intro-water-streak--1" />
        <span className="intro-water-streak intro-water-streak--2" />
        <span className="intro-water-streak intro-water-streak--3" />
        <span className="intro-water-streak intro-water-streak--4" />
        <span className="intro-water-streak intro-water-streak--5" />
      </div>
    </div>
  );
}
