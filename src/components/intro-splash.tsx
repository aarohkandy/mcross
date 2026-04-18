"use client";

import { useEffect, useRef, useState } from "react";

type WashSection = {
  curveDepth: number;
  delay: number;
  duration: number;
  left: number;
  right: number;
  targetY: number;
};

const INTRO_DURATION_MS = 2050;

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function easeOutQuart(value: number) {
  return 1 - (1 - value) ** 4;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function shuffle<T>(items: T[]) {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }

  return copy;
}

function createSectionDelays(count: number) {
  const slotStep = 58;
  const minNeighborGap = 96;
  const remaining = shuffle(
    Array.from({ length: count }, (_, index) => index * slotStep)
  );
  const ordered: number[] = [];

  while (remaining.length > 0) {
    if (ordered.length === 0) {
      ordered.push(remaining.pop() ?? 0);
      continue;
    }

    const previous = ordered[ordered.length - 1];
    let candidateIndex = -1;
    let bestGap = -1;

    for (let index = 0; index < remaining.length; index += 1) {
      const gap = Math.abs(remaining[index] - previous);

      if (gap >= minNeighborGap) {
        candidateIndex = index;
        break;
      }

      if (gap > bestGap) {
        bestGap = gap;
        candidateIndex = index;
      }
    }

    const [chosenDelay] = remaining.splice(candidateIndex, 1);
    ordered.push(chosenDelay);
  }

  return ordered.map((delay) => Math.max(0, delay + randomBetween(-16, 16)));
}

function createWashSections(width: number, height: number) {
  const count = clamp(Math.round(width / 155), 8, 10);
  const slotWidth = width / count;
  const overlap = slotWidth * 0.12;
  const delays = createSectionDelays(count);

  return Array.from({ length: count }, (_, index): WashSection => {
    const curveDepth = clamp(slotWidth * 0.22, 24, 54);

    return {
      curveDepth,
      delay: delays[index],
      duration: randomBetween(860, 1040),
      left: index * slotWidth - overlap * 0.5,
      right: (index + 1) * slotWidth + overlap * 0.5,
      targetY: height + curveDepth + randomBetween(22, 34),
    };
  });
}

export function IntroSplash() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setVisible(false);
    }, INTRO_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (mediaQuery.matches) {
      return;
    }

    let animationFrame = 0;
    let startTime = 0;
    let revealCompleteAt = 0;
    let viewport = { height: 0, width: 0 };
    let sections: WashSection[] = [];

    const resizeCanvas = () => {
      const bounds = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      viewport = { height: bounds.height, width: bounds.width };
      canvas.width = Math.max(1, Math.round(bounds.width * dpr));
      canvas.height = Math.max(1, Math.round(bounds.height * dpr));

      context.setTransform(1, 0, 0, 1, 0, 0);
      context.scale(dpr, dpr);

      sections = createWashSections(bounds.width, bounds.height);
      revealCompleteAt = sections.reduce(
        (max, section) => Math.max(max, section.delay + section.duration),
        0
      );
    };

    const drawOverlay = (width: number, height: number) => {
      const fill = context.createLinearGradient(0, 0, 0, height);
      fill.addColorStop(0, "#869c73");
      fill.addColorStop(0.5, "#677b58");
      fill.addColorStop(1, "#495a41");
      context.fillStyle = fill;
      context.fillRect(0, 0, width, height);

      const wash = context.createRadialGradient(
        width * 0.5,
        -height * 0.04,
        height * 0.02,
        width * 0.5,
        -height * 0.04,
        height * 0.78
      );
      wash.addColorStop(0, "rgba(255,255,255,0.18)");
      wash.addColorStop(0.48, "rgba(255,255,255,0.05)");
      wash.addColorStop(1, "rgba(255,255,255,0)");
      context.fillStyle = wash;
      context.fillRect(0, 0, width, height);

      context.fillStyle = "rgba(17, 23, 14, 0.18)";
      context.fillRect(0, 0, width, height);
    };

    const drawWashSection = (section: WashSection, elapsed: number) => {
      const localElapsed = elapsed - section.delay;

      if (localElapsed <= 0) {
        return;
      }

      const progress = Math.min(localElapsed / section.duration, 1);
      const eased = easeOutQuart(progress);
      const headY = -section.curveDepth + section.targetY * eased;
      const centerX = (section.left + section.right) * 0.5;
      const topY = -4;

      context.beginPath();
      context.moveTo(section.left, topY);
      context.lineTo(section.left, headY);
      context.quadraticCurveTo(
        section.left,
        headY + section.curveDepth,
        centerX,
        headY + section.curveDepth
      );
      context.quadraticCurveTo(
        section.right,
        headY + section.curveDepth,
        section.right,
        headY
      );
      context.lineTo(section.right, topY);
      context.closePath();
      context.fill();
    };

    const render = (timestamp: number) => {
      if (!startTime) {
        startTime = timestamp;
      }

      const elapsed = timestamp - startTime;
      const { height, width } = viewport;

      context.clearRect(0, 0, width, height);
      drawOverlay(width, height);

      context.save();
      context.globalCompositeOperation = "destination-out";
      context.fillStyle = "rgba(0, 0, 0, 1)";
      sections.forEach((section) => drawWashSection(section, elapsed));
      context.restore();

      if (elapsed >= revealCompleteAt + 120) {
        context.clearRect(0, 0, width, height);
      }

      if (elapsed < INTRO_DURATION_MS - 180) {
        animationFrame = window.requestAnimationFrame(render);
      }
    };

    resizeCanvas();
    animationFrame = window.requestAnimationFrame(render);
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="intro-overlay pointer-events-none fixed inset-0 z-50 overflow-hidden"
      style={{ animationDuration: `${INTRO_DURATION_MS}ms` }}
    >
      <canvas ref={canvasRef} className="intro-canvas h-full w-full" />
    </div>
  );
}
