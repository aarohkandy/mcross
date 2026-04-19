"use client";

import { useEffect, useRef } from "react";

const GRID_WIDTH = 84;
const GRID_HEIGHT = 48;
const TICK_MS = 180;
const PATCH_SIZE = 10;
const PATCH_RATE = 0.16;
const STALE_LIMIT = 26;
const COLOR_R = 150;
const COLOR_G = 183;
const COLOR_B = 112;

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

    const element = canvas;
    const ctx = context;
    const imageData = ctx.createImageData(GRID_WIDTH, GRID_HEIGHT);
    const pixels = imageData.data;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const shouldPauseWhenHidden = !navigator.webdriver;

    element.width = GRID_WIDTH;
    element.height = GRID_HEIGHT;
    ctx.imageSmoothingEnabled = true;

    let current: Uint8Array = createSeed();
    let next: Uint8Array = new Uint8Array(current.length);
    const display = new Float32Array(current.length);
    let staleTicks = 0;
    let intervalId: number | null = null;

    function draw() {
      pixels.fill(0);

      for (let row = 0; row < GRID_HEIGHT; row += 1) {
        const north = row === 0 ? GRID_HEIGHT - 1 : row - 1;
        const south = row === GRID_HEIGHT - 1 ? 0 : row + 1;

        for (let col = 0; col < GRID_WIDTH; col += 1) {
          const west = col === 0 ? GRID_WIDTH - 1 : col - 1;
          const east = col === GRID_WIDTH - 1 ? 0 : col + 1;
          const index = row * GRID_WIDTH + col;

          display[index] += (current[index] - display[index]) * 0.38;

          const field =
            display[index] * 0.42 +
            (display[north * GRID_WIDTH + col] +
              display[south * GRID_WIDTH + col] +
              display[row * GRID_WIDTH + west] +
              display[row * GRID_WIDTH + east]) *
              0.1 +
            (display[north * GRID_WIDTH + west] +
              display[north * GRID_WIDTH + east] +
              display[south * GRID_WIDTH + west] +
              display[south * GRID_WIDTH + east]) *
              0.045;

          if (field < 0.04) {
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
      element.dataset.liveCells = String(liveCells);
      draw();
    }

    function start() {
      if (intervalId !== null || reducedMotion.matches) {
        return;
      }

      intervalId = window.setInterval(step, TICK_MS);
    }

    function stop() {
      if (intervalId === null) {
        return;
      }

      window.clearInterval(intervalId);
      intervalId = null;
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

    element.dataset.liveCells = String(countLiveCells(current));
    draw();
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
      data-live-cells="0"
    />
  );
}
