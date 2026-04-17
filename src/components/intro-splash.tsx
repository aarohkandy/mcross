"use client";

import { useEffect, useRef, useState } from "react";

type Drop = {
  delay: number;
  drift: number;
  duration: number;
  endY: number;
  highlight: number;
  headFadeStart: number;
  radius: number;
  trailLength: number;
  x: number;
};

const INTRO_DURATION_MS = 2550;

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

function createDrops(width: number, height: number) {
  const count = Math.max(18, Math.min(28, Math.round(width / 74)));
  const slotWidth = width / count;
  const xPositions = shuffle(
    Array.from({ length: count }, (_, index) => {
      const center = slotWidth * (index + 0.5);
      return center + randomBetween(-slotWidth * 0.34, slotWidth * 0.34);
    })
  );

  return Array.from({ length: count }, (_, index): Drop => {
    const radius = randomBetween(7, 15);
    const baseDelay = (index / Math.max(count - 1, 1)) * 1260;

    return {
      delay: Math.max(0, baseDelay + randomBetween(-85, 95)),
      drift: randomBetween(-22, 22),
      duration: randomBetween(980, 1680),
      endY: height + randomBetween(height * 0.04, height * 0.16),
      headFadeStart: randomBetween(height * 0.72, height * 0.86),
      highlight: randomBetween(0.22, 0.54),
      radius,
      trailLength: randomBetween(height * 0.12, height * 0.24),
      x: clamp(xPositions[index], radius * 2, width - radius * 2),
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
    let viewport = { height: 0, width: 0 };
    let drops: Drop[] = [];

    const resizeCanvas = () => {
      const bounds = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      viewport = { height: bounds.height, width: bounds.width };
      canvas.width = Math.max(1, Math.round(bounds.width * dpr));
      canvas.height = Math.max(1, Math.round(bounds.height * dpr));

      context.setTransform(1, 0, 0, 1, 0, 0);
      context.scale(dpr, dpr);
      context.lineCap = "round";
      context.lineJoin = "round";

      drops = createDrops(bounds.width, bounds.height);
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

    const drawCutout = (drop: Drop, elapsed: number, height: number) => {
      const localElapsed = elapsed - drop.delay;

      if (localElapsed <= 0) {
        return;
      }

      const progress = Math.min(localElapsed / drop.duration, 1);
      const eased = easeOutQuart(progress);
      const x = drop.x + drop.drift * eased;
      const headY = -drop.trailLength + (drop.endY + drop.trailLength) * eased;
      const trailTop = -drop.radius * 2;
      const headFade = clamp(
        1 - (headY - drop.headFadeStart) / (height * 0.18),
        0,
        1
      );

      context.strokeStyle = "rgba(0, 0, 0, 1)";
      context.fillStyle = "rgba(0, 0, 0, 1)";
      context.lineWidth = drop.radius * 1.45;
      context.beginPath();
      context.moveTo(x, trailTop);
      context.lineTo(x, headY);
      context.stroke();

      if (headFade > 0.06) {
        context.beginPath();
        context.globalAlpha = headFade;
        context.arc(x, headY, drop.radius * 1.08, 0, Math.PI * 2);
        context.fill();
        context.globalAlpha = 1;
      }
    };

    const drawHighlight = (drop: Drop, elapsed: number, height: number) => {
      const localElapsed = elapsed - drop.delay;

      if (localElapsed <= 0) {
        return;
      }

      const progress = Math.min(localElapsed / drop.duration, 1);
      const eased = easeOutQuart(progress);
      const x = drop.x + drop.drift * eased;
      const headY = -drop.trailLength + (drop.endY + drop.trailLength) * eased;
      const trailTop = Math.max(headY - drop.trailLength * 0.3, -drop.radius * 2);
      const bodyAlpha = drop.highlight * (1 - progress * 0.18);
      const headFade = clamp(
        1 - (headY - drop.headFadeStart) / (height * 0.18),
        0,
        1
      );

      context.strokeStyle = `rgba(228, 247, 255, ${bodyAlpha})`;
      context.lineWidth = Math.max(1.4, drop.radius * 0.3);
      context.beginPath();
      context.moveTo(x, trailTop);
      context.lineTo(x, headY);
      context.stroke();

      context.fillStyle = `rgba(248, 253, 255, ${0.22 + drop.highlight * 0.5})`;
      context.beginPath();
      context.ellipse(
        x,
        headY,
        drop.radius * 0.54,
        drop.radius * 0.82,
        0,
        0,
        Math.PI * 2
      );
      context.globalAlpha = headFade;
      context.fill();
      context.globalAlpha = 1;

      if (headFade <= 0.06) {
        context.strokeStyle = "rgba(248, 253, 255, 0.08)";
        context.lineWidth = Math.max(0.8, drop.radius * 0.12);
        context.beginPath();
        context.moveTo(x - drop.radius * 0.55, height - drop.radius * 0.28);
        context.lineTo(x + drop.radius * 0.55, height - drop.radius * 0.28);
        context.stroke();
      }
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
      drops.forEach((drop) => drawCutout(drop, elapsed, height));
      context.restore();

      drops.forEach((drop) => drawHighlight(drop, elapsed, height));

      if (elapsed < INTRO_DURATION_MS - 220) {
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
    >
      <canvas ref={canvasRef} className="intro-canvas h-full w-full" />
    </div>
  );
}
