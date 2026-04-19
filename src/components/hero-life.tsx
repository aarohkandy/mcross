"use client";

import { useEffect, useRef } from "react";

const GRID_WIDTH = 160;
const GRID_HEIGHT = 90;
const STEP_MS = 760;
const SEED_RATE = 0.23;

function seedGrid() {
  const grid = new Uint8Array(GRID_WIDTH * GRID_HEIGHT);

  for (let index = 0; index < grid.length; index += 1) {
    grid[index] = Math.random() < SEED_RATE ? 1 : 0;
  }

  return grid;
}

function evolve(grid: Uint8Array) {
  const next = new Uint8Array(grid.length);
  let liveCells = 0;

  for (let row = 0; row < GRID_HEIGHT; row += 1) {
    const north = row === 0 ? GRID_HEIGHT - 1 : row - 1;
    const south = row === GRID_HEIGHT - 1 ? 0 : row + 1;

    for (let col = 0; col < GRID_WIDTH; col += 1) {
      const west = col === 0 ? GRID_WIDTH - 1 : col - 1;
      const east = col === GRID_WIDTH - 1 ? 0 : col + 1;
      const index = row * GRID_WIDTH + col;

      const neighbors =
        grid[north * GRID_WIDTH + west] +
        grid[north * GRID_WIDTH + col] +
        grid[north * GRID_WIDTH + east] +
        grid[row * GRID_WIDTH + west] +
        grid[row * GRID_WIDTH + east] +
        grid[south * GRID_WIDTH + west] +
        grid[south * GRID_WIDTH + col] +
        grid[south * GRID_WIDTH + east];

      const alive =
        neighbors === 3 || (grid[index] === 1 && neighbors === 2) ? 1 : 0;

      next[index] = alive;
      liveCells += alive;
    }
  }

  return { next, liveCells };
}

function countLiveCells(grid: Uint8Array) {
  let liveCells = 0;

  for (let index = 0; index < grid.length; index += 1) {
    liveCells += grid[index];
  }

  return liveCells;
}

export function HeroLife() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d", { alpha: true, desynchronized: true });

    if (!context) {
      return;
    }

    const element = canvas;
    const ctx = context;

    element.width = GRID_WIDTH;
    element.height = GRID_HEIGHT;

    const state = {
      intervalId: null as number | null,
      grid: seedGrid(),
      ticks: 0,
    };

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const shouldPauseWhenHidden = !navigator.webdriver;

    function draw(liveCells: number) {
      ctx.clearRect(0, 0, element.width, element.height);
      ctx.fillStyle = "rgba(162, 195, 122, 0.95)";

      for (let index = 0; index < state.grid.length; index += 1) {
        if (state.grid[index] === 0) {
          continue;
        }

        const x = index % GRID_WIDTH;
        const y = Math.floor(index / GRID_WIDTH);
        ctx.fillRect(x, y, 1, 1);
      }

      element.dataset.liveCells = String(liveCells);
    }

    function maybeReseed(liveCells: number) {
      const density = liveCells / state.grid.length;
      const stale = state.ticks % 30 === 0;

      if (density < 0.07 || density > 0.38 || stale) {
        state.grid = seedGrid();
        return countLiveCells(state.grid);
      }

      return null;
    }

    function tick() {
      const result = evolve(state.grid);
      state.grid = result.next;
      state.ticks += 1;

      const reseededLiveCells = maybeReseed(result.liveCells);

      if (reseededLiveCells !== null) {
        draw(reseededLiveCells);
        return;
      }

      draw(result.liveCells);
    }

    function start() {
      if (state.intervalId !== null || reducedMotion.matches) {
        return;
      }

      state.intervalId = window.setInterval(tick, STEP_MS);
    }

    function stop() {
      if (state.intervalId === null) {
        return;
      }

      window.clearInterval(state.intervalId);
      state.intervalId = null;
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

    draw(countLiveCells(state.grid));
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
