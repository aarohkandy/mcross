"use client";

import { useEffect, useRef } from "react";

const GRID_WIDTH = 96;
const GRID_HEIGHT = 54;
const PATCH_SIZE = 10;
const PATCH_RATE = 0.16;
const STALE_LIMIT = 26;
const COLOR_R = 150;
const COLOR_G = 183;
const COLOR_B = 112;

const timing = {
  steadyTickMs: 180,
  startupTickMs: 82,
  startupTicks: 12,
  startupWarmupSteps: 4,
} as const;

function countNeighbors(grid: Uint8Array, row: number, col: number) {
  const north = row === 0 ? GRID_HEIGHT - 1 : row - 1;
  const south = row === GRID_HEIGHT - 1 ? 0 : row + 1;
  const west = col === 0 ? GRID_WIDTH - 1 : col - 1;
  const east = col === GRID_WIDTH - 1 ? 0 : col + 1;

  return (
    grid[north * GRID_WIDTH + west] +
    grid[north * GRID_WIDTH + col] +
    grid[north * GRID_WIDTH + east] +
    grid[row * GRID_WIDTH + west] +
    grid[row * GRID_WIDTH + east] +
    grid[south * GRID_WIDTH + west] +
    grid[south * GRID_WIDTH + col] +
    grid[south * GRID_WIDTH + east]
  );
}

function smoothSeed(grid: Uint8Array) {
  let current = grid;

  for (let pass = 0; pass < 2; pass += 1) {
    const next = new Uint8Array(current.length);

    for (let row = 0; row < GRID_HEIGHT; row += 1) {
      for (let col = 0; col < GRID_WIDTH; col += 1) {
        const index = row * GRID_WIDTH + col;
        const neighbors = countNeighbors(current, row, col);

        if (neighbors >= 5) {
          next[index] = 1;
        } else if (neighbors <= 2) {
          next[index] = 0;
        } else {
          next[index] = current[index];
        }
      }
    }

    current = next;
  }

  return current;
}

function createSeed(rate = 0.22) {
  const grid = new Uint8Array(GRID_WIDTH * GRID_HEIGHT);

  for (let index = 0; index < grid.length; index += 1) {
    grid[index] = Math.random() < rate ? 1 : 0;
  }

  return smoothSeed(grid);
}

function countLiveCells(grid: Uint8Array) {
  let liveCells = 0;

  for (let index = 0; index < grid.length; index += 1) {
    liveCells += grid[index];
  }

  return liveCells;
}

function injectPatch(grid: Uint8Array) {
  const startRow = Math.floor(Math.random() * GRID_HEIGHT);
  const startCol = Math.floor(Math.random() * GRID_WIDTH);

  for (let rowOffset = 0; rowOffset < PATCH_SIZE; rowOffset += 1) {
    for (let colOffset = 0; colOffset < PATCH_SIZE; colOffset += 1) {
      const row = (startRow + rowOffset) % GRID_HEIGHT;
      const col = (startCol + colOffset) % GRID_WIDTH;
      const index = row * GRID_WIDTH + col;

      if (Math.random() < PATCH_RATE) {
        grid[index] = 1;
      }
    }
  }
}

export function HeroLife() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d", {
      alpha: true,
      desynchronized: true,
    });

    if (!context) {
      return;
    }

    const ctx = context;
    const imageData = ctx.createImageData(GRID_WIDTH, GRID_HEIGHT);
    const pixels = imageData.data;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const shouldPauseWhenHidden = !navigator.webdriver;

    canvas.width = GRID_WIDTH;
    canvas.height = GRID_HEIGHT;
    ctx.imageSmoothingEnabled = true;

    let current: Uint8Array = createSeed();
    let next: Uint8Array = new Uint8Array(current.length);
    const display = new Float32Array(current.length);
    let staleTicks = 0;
    let tickCount = 0;
    let timeoutId: number | null = null;

    function draw() {
      pixels.fill(0);

      for (let row = 0; row < GRID_HEIGHT; row += 1) {
        const north = row === 0 ? GRID_HEIGHT - 1 : row - 1;
        const south = row === GRID_HEIGHT - 1 ? 0 : row + 1;

        for (let col = 0; col < GRID_WIDTH; col += 1) {
          const west = col === 0 ? GRID_WIDTH - 1 : col - 1;
          const east = col === GRID_WIDTH - 1 ? 0 : col + 1;
          const index = row * GRID_WIDTH + col;

          display[index] += (current[index] - display[index]) * 0.42;

          const field =
            display[index] * 0.52 +
            (display[north * GRID_WIDTH + col] +
              display[south * GRID_WIDTH + col] +
              display[row * GRID_WIDTH + west] +
              display[row * GRID_WIDTH + east]) *
              0.075 +
            (display[north * GRID_WIDTH + west] +
              display[north * GRID_WIDTH + east] +
              display[south * GRID_WIDTH + west] +
              display[south * GRID_WIDTH + east]) *
              0.025;

          if (field < 0.042) {
            continue;
          }

          const alpha = Math.round(Math.min(1, field * 1.18) * 190);
          const offset = index * 4;

          pixels[offset] = COLOR_R;
          pixels[offset + 1] = COLOR_G;
          pixels[offset + 2] = COLOR_B;
          pixels[offset + 3] = alpha;
        }
      }

      ctx.putImageData(imageData, 0, 0);
    }

    function step() {
      let liveCells = 0;

      for (let row = 0; row < GRID_HEIGHT; row += 1) {
        for (let col = 0; col < GRID_WIDTH; col += 1) {
          const index = row * GRID_WIDTH + col;
          const neighbors = countNeighbors(current, row, col);
          const alive =
            neighbors === 3 || (current[index] === 1 && neighbors === 2) ? 1 : 0;

          next[index] = alive;
          liveCells += alive;
        }
      }

      const density = liveCells / next.length;
      const previousLiveCells = countLiveCells(current);
      const almostStill = Math.abs(liveCells - previousLiveCells) < 10;

      if (almostStill) {
        staleTicks += 1;
      } else {
        staleTicks = 0;
      }

      if (density < 0.08 || density > 0.35 || staleTicks >= STALE_LIMIT) {
        injectPatch(next);
        staleTicks = 0;
      }

      const swap: Uint8Array = current;
      current = next;
      next = swap;
      draw();
    }

    function getTickDelay() {
      return tickCount < timing.startupTicks
        ? timing.startupTickMs
        : timing.steadyTickMs;
    }

    function runStep() {
      step();
      tickCount += 1;
    }

    function scheduleNextTick() {
      if (reducedMotion.matches) {
        return;
      }

      timeoutId = window.setTimeout(() => {
        timeoutId = null;
        runStep();
        scheduleNextTick();
      }, getTickDelay());
    }

    function start() {
      if (timeoutId !== null || reducedMotion.matches) {
        return;
      }

      scheduleNextTick();
    }

    function stop() {
      if (timeoutId === null) {
        return;
      }

      window.clearTimeout(timeoutId);
      timeoutId = null;
    }

    function handleVisibilityChange() {
      if (!shouldPauseWhenHidden) {
        return;
      }

      if (document.hidden) {
        stop();
      } else {
        start();
      }
    }

    draw();

    for (
      let warmupStep = 0;
      warmupStep < timing.startupWarmupSteps;
      warmupStep += 1
    ) {
      runStep();
    }

    start();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="hero-life-canvas"
    />
  );
}
