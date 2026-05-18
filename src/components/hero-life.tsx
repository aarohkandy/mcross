"use client";

import { useEffect, useRef } from "react";
import { shouldMinimizeEffects } from "@/lib/should-minimize-effects";

const GRID_WIDTH = 96;
const GRID_HEIGHT = 54;
const CELL_COUNT = GRID_WIDTH * GRID_HEIGHT;
const PATCH_SIZE = 10;
const PATCH_RATE = 0.16;
const STALE_LIMIT = 26;
const COLOR_R = 150;
const COLOR_G = 183;
const COLOR_B = 112;

const timing = {
  steadyTickMs: 200,
  startupTickMs: 92,
  startupTicks: 8,
  startupWarmupSteps: 2,
} as const;

const neighborIndexMap = (() => {
  const north = new Uint16Array(CELL_COUNT);
  const south = new Uint16Array(CELL_COUNT);
  const west = new Uint16Array(CELL_COUNT);
  const east = new Uint16Array(CELL_COUNT);
  const northWest = new Uint16Array(CELL_COUNT);
  const northEast = new Uint16Array(CELL_COUNT);
  const southWest = new Uint16Array(CELL_COUNT);
  const southEast = new Uint16Array(CELL_COUNT);

  for (let row = 0; row < GRID_HEIGHT; row += 1) {
    const northRow = row === 0 ? GRID_HEIGHT - 1 : row - 1;
    const southRow = row === GRID_HEIGHT - 1 ? 0 : row + 1;

    for (let col = 0; col < GRID_WIDTH; col += 1) {
      const westCol = col === 0 ? GRID_WIDTH - 1 : col - 1;
      const eastCol = col === GRID_WIDTH - 1 ? 0 : col + 1;
      const index = row * GRID_WIDTH + col;

      north[index] = northRow * GRID_WIDTH + col;
      south[index] = southRow * GRID_WIDTH + col;
      west[index] = row * GRID_WIDTH + westCol;
      east[index] = row * GRID_WIDTH + eastCol;
      northWest[index] = northRow * GRID_WIDTH + westCol;
      northEast[index] = northRow * GRID_WIDTH + eastCol;
      southWest[index] = southRow * GRID_WIDTH + westCol;
      southEast[index] = southRow * GRID_WIDTH + eastCol;
    }
  }

  return {
    east,
    north,
    northEast,
    northWest,
    south,
    southEast,
    southWest,
    west,
  };
})();

const {
  east: neighborEast,
  north: neighborNorth,
  northEast: neighborNorthEast,
  northWest: neighborNorthWest,
  south: neighborSouth,
  southEast: neighborSouthEast,
  southWest: neighborSouthWest,
  west: neighborWest,
} = neighborIndexMap;

function countNeighbors(grid: Uint8Array, index: number) {
  return (
    grid[neighborNorthWest[index]] +
    grid[neighborNorth[index]] +
    grid[neighborNorthEast[index]] +
    grid[neighborWest[index]] +
    grid[neighborEast[index]] +
    grid[neighborSouthWest[index]] +
    grid[neighborSouth[index]] +
    grid[neighborSouthEast[index]]
  );
}

function smoothSeed(grid: Uint8Array) {
  let current = grid;

  for (let pass = 0; pass < 2; pass += 1) {
    const next = new Uint8Array(current.length);

    for (let index = 0; index < current.length; index += 1) {
      const neighbors = countNeighbors(current, index);

      if (neighbors >= 5) {
        next[index] = 1;
      } else if (neighbors <= 2) {
        next[index] = 0;
      } else {
        next[index] = current[index];
      }
    }

    current = next;
  }

  return current;
}

function createSeed(rate = 0.22) {
  const grid = new Uint8Array(CELL_COUNT);

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
  let addedCells = 0;

  for (let rowOffset = 0; rowOffset < PATCH_SIZE; rowOffset += 1) {
    for (let colOffset = 0; colOffset < PATCH_SIZE; colOffset += 1) {
      const row = (startRow + rowOffset) % GRID_HEIGHT;
      const col = (startCol + colOffset) % GRID_WIDTH;
      const index = row * GRID_WIDTH + col;

      if (Math.random() < PATCH_RATE && grid[index] === 0) {
        grid[index] = 1;
        addedCells += 1;
      }
    }
  }

  return addedCells;
}

export function HeroLife() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (shouldMinimizeEffects(reducedMotion)) {
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
    const lifeField = canvas.parentElement;
    const imageData = ctx.createImageData(GRID_WIDTH, GRID_HEIGHT);
    const pixels = imageData.data;
    const shouldPauseWhenHidden = !navigator.webdriver;

    canvas.width = GRID_WIDTH;
    canvas.height = GRID_HEIGHT;
    ctx.imageSmoothingEnabled = true;

    let current: Uint8Array = createSeed();
    let next: Uint8Array = new Uint8Array(current.length);
    const display = new Float32Array(current.length);
    let currentLiveCells = countLiveCells(current);
    let staleTicks = 0;
    let tickCount = 0;
    let timeoutId: number | null = null;

    function markReady() {
      lifeField?.setAttribute("data-ready", "true");
    }

    function draw() {
      pixels.fill(0);

      for (let index = 0; index < CELL_COUNT; index += 1) {
        display[index] += (current[index] - display[index]) * 0.42;

        const field =
          display[index] * 0.52 +
          (display[neighborNorth[index]] +
            display[neighborSouth[index]] +
            display[neighborWest[index]] +
            display[neighborEast[index]]) *
            0.075 +
          (display[neighborNorthWest[index]] +
            display[neighborNorthEast[index]] +
            display[neighborSouthWest[index]] +
            display[neighborSouthEast[index]]) *
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

      ctx.putImageData(imageData, 0, 0);
    }

    function step(shouldDraw = true) {
      let nextLiveCells = 0;

      for (let index = 0; index < CELL_COUNT; index += 1) {
        const neighbors = countNeighbors(current, index);
        const alive =
          neighbors === 3 || (current[index] === 1 && neighbors === 2) ? 1 : 0;

        next[index] = alive;
        nextLiveCells += alive;
      }

      const density = nextLiveCells / next.length;
      const almostStill = Math.abs(nextLiveCells - currentLiveCells) < 10;

      if (almostStill) {
        staleTicks += 1;
      } else {
        staleTicks = 0;
      }

      if (density < 0.08 || density > 0.35 || staleTicks >= STALE_LIMIT) {
        nextLiveCells += injectPatch(next);
        staleTicks = 0;
      }

      const swap: Uint8Array = current;
      current = next;
      next = swap;
      currentLiveCells = nextLiveCells;

      if (shouldDraw) {
        draw();
        markReady();
      }
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

    for (
      let warmupStep = 0;
      warmupStep < timing.startupWarmupSteps;
      warmupStep += 1
    ) {
      step(false);
      tickCount += 1;
    }

    display.set(current);
    draw();
    markReady();
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
