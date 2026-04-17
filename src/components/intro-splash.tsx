"use client";

import { useEffect, useRef, useState } from "react";

type Drop = {
  delay: number;
  drift: number;
  duration: number;
  endY: number;
  highlight: number;
  radius: number;
  splashWidth: number;
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

function createDrops(width: number, height: number) {
  const count = Math.max(12, Math.min(18, Math.round(width / 96)));

  return Array.from({ length: count }, (): Drop => {
    const radius = randomBetween(7, 15);

    return {
      delay: randomBetween(40, 980),
      drift: randomBetween(-22, 22),
      duration: randomBetween(920, 1620),
      endY: height + randomBetween(height * 0.04, height * 0.16),
      highlight: randomBetween(0.22, 0.54),
      radius,
      splashWidth: randomBetween(radius * 2.4, radius * 4.8),
      trailLength: randomBetween(height * 0.16, height * 0.34),
      x: randomBetween(radius * 2, width - radius * 2),
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
      const trailTop = headY - drop.trailLength;

      context.strokeStyle = "rgba(0, 0, 0, 1)";
      context.fillStyle = "rgba(0, 0, 0, 1)";
      context.lineWidth = drop.radius * 1.45;
      context.beginPath();
      context.moveTo(x, trailTop);
      context.lineTo(x, headY);
      context.stroke();

      context.beginPath();
      context.arc(x, headY, drop.radius * 1.22, 0, Math.PI * 2);
      context.fill();

      if (progress > 0.78) {
        const splashProgress = (progress - 0.78) / 0.22;
        const splashY = Math.min(headY + drop.radius * 0.6, height - drop.radius);
        context.beginPath();
        context.ellipse(
          x,
          splashY,
          drop.splashWidth * splashProgress,
          drop.radius * 0.62 * (1 - splashProgress * 0.22),
          0,
          0,
          Math.PI * 2
        );
        context.fill();
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
      const trailTop = Math.max(headY - drop.trailLength * 0.58, -drop.radius * 2);
      const bodyAlpha = drop.highlight * (1 - progress * 0.18);

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
      context.fill();

      if (progress > 0.78) {
        const splashProgress = (progress - 0.78) / 0.22;
        const splashY = Math.min(headY + drop.radius * 0.6, height - drop.radius);
        context.strokeStyle = `rgba(240, 252, 255, ${0.16 * (1 - splashProgress)})`;
        context.lineWidth = Math.max(1, drop.radius * 0.18);
        context.beginPath();
        context.ellipse(
          x,
          splashY,
          drop.splashWidth * 0.42 * splashProgress,
          drop.radius * 0.18,
          0,
          0,
          Math.PI * 2
        );
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
