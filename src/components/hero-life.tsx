"use client";

import { useEffect, useRef } from "react";

const CELL_SCALE = 30;
const STEP_MS = 320;
const MIN_COLS = 52;
const MIN_ROWS = 28;
const SEED_DENSITY = 0.18;

function randomGrid(size: number, density: number) {
  const grid = new Uint8Array(size);

  for (let index = 0; index < size; index += 1) {
    grid[index] = Math.random() < density ? 1 : 0;
  }

  return grid;
}

function nextGeneration(grid: Uint8Array, cols: number, rows: number) {
  const next = new Uint8Array(grid.length);
  let liveCount = 0;

  for (let row = 0; row < rows; row += 1) {
    const north = row === 0 ? rows - 1 : row - 1;
    const south = row === rows - 1 ? 0 : row + 1;

    for (let col = 0; col < cols; col += 1) {
      const west = col === 0 ? cols - 1 : col - 1;
      const east = col === cols - 1 ? 0 : col + 1;
      const index = row * cols + col;

      const neighbors =
        grid[north * cols + west] +
        grid[north * cols + col] +
        grid[north * cols + east] +
        grid[row * cols + west] +
        grid[row * cols + east] +
        grid[south * cols + west] +
        grid[south * cols + col] +
        grid[south * cols + east];

      const survives =
        neighbors === 3 || (grid[index] === 1 && neighbors === 2) ? 1 : 0;

      next[index] = survives;
      liveCount += survives;
    }
  }

  return { grid: next, liveCount };
}

export function HeroLife() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d", { alpha: true });

    if (!context) {
      return;
    }

    const element = canvas;
    const ctx = context;

    let cols = 0;
    let rows = 0;
    let grid = new Uint8Array(0);
    let intervalId = 0;
    let observer: ResizeObserver | null = null;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    function draw() {
      ctx.clearRect(0, 0, cols, rows);
      ctx.fillStyle = "rgba(150, 180, 120, 0.96)";

      for (let index = 0; index < grid.length; index += 1) {
        if (grid[index] === 0) {
          continue;
        }

        const x = index % cols;
        const y = Math.floor(index / cols);
        ctx.fillRect(x, y, 1, 1);
      }
    }

    function reseed(blend = false) {
      const fresh = randomGrid(cols * rows, SEED_DENSITY);

      if (!blend || grid.length !== fresh.length) {
        grid = fresh;
        return;
      }

      for (let index = 0; index < grid.length; index += 1) {
        grid[index] = grid[index] === 1 || fresh[index] === 1 ? 1 : 0;
      }
    }

    function resize() {
      const bounds = element.getBoundingClientRect();
      const nextCols = Math.max(MIN_COLS, Math.round(bounds.width / CELL_SCALE));
      const nextRows = Math.max(MIN_ROWS, Math.round(bounds.height / CELL_SCALE));

      if (nextCols === cols && nextRows === rows) {
        return;
      }

      cols = nextCols;
      rows = nextRows;
      element.width = cols;
      element.height = rows;
      reseed();
      draw();
    }

    function tick() {
      const result = nextGeneration(grid, cols, rows);
      grid = result.grid;

      const density = result.liveCount / Math.max(1, cols * rows);

      if (density < 0.06 || density > 0.38) {
        reseed(true);
      }

      draw();
    }

    resize();

    if (!reducedMotion.matches) {
      intervalId = window.setInterval(tick, STEP_MS);
    }

    observer = new ResizeObserver(() => {
      resize();
    });
    observer.observe(element);

    return () => {
      if (intervalId) {
        window.clearInterval(intervalId);
      }

      observer?.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="hero-life-canvas" />;
}
