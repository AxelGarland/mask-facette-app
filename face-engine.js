// The face rules, without any drawing code.
//
// This is a 1:1 port of the placement logic in main.js (the p5 `sketch.draw`),
// with one change: rotations come from a seeded generator instead of
// Math.random(), so the same words and seed always give the same face. The
// landing page needs that to show "change one word, only a few tiles move".
//
// The data tables (WORD_TILE_MAP, WORD_COLOR_MAP, WORD_CATEGORIES) are the real
// ones, imported from main.js.

import {
  WORD_TILE_MAP,
  WORD_CATEGORIES,
  colorForWord,
  normalizeWordKey,
} from './main.js';

export const WORD_POOL = Object.values(WORD_CATEGORIES).flat();

export const ROWS = ['A', 'B', 'C', 'D', 'E'];
export const COLS = [1, 2, 3, 4, 5];
export const CELL_KEYS = ROWS.flatMap((r) => COLS.map((c) => `${r}${c}`));

// One entry per word. `cells` lists every cell the word decides.
export const STEPS = [
  {
    order: 1, id: 'frame', label: 'Frame', cells: ['A1', 'A5'],
    rule: 'The corners set the outline. Draw the top left, flip it for the top right.',
    moves: ['mirrored', 'turned at random'],
  },
  {
    order: 2, id: 'brow', label: 'Brow', cells: ['A2', 'A3', 'A4'],
    rule: 'One brow is drawn and mirrored. The middle tile turns a quarter either way.',
    moves: ['mirrored', 'turned at random'],
  },
  {
    order: 3, id: 'eyes', label: 'Eyes', cells: ['B2', 'B4'],
    rule: 'One eye is drawn once. The other is a straight copy, so the pair always matches.',
    moves: ['copied'],
  },
  {
    order: 4, id: 'nose', label: 'Nose', cells: ['B3', 'C2', 'C3', 'C4'],
    rule: 'Bridge, tip and nostrils. The two nostrils mirror each other.',
    moves: ['mirrored'],
  },
  {
    order: 5, id: 'cheeks', label: 'Cheeks', cells: ['B1', 'B5', 'C1', 'C5'],
    rule: 'One tile fills all four cheek cells. Two are mirrors of the other two.',
    moves: ['copied', 'mirrored', 'turned at random'],
  },
  {
    order: 6, id: 'jaw', label: 'Jaw', cells: ['D1', 'D5'],
    rule: 'The jaw corners come as a mirrored pair, turned at random.',
    moves: ['mirrored', 'turned at random'],
  },
  {
    order: 7, id: 'chin-corners', label: 'Chin corners', cells: ['E1', 'E5'],
    rule: 'The bottom corners close the shape. Another mirrored pair.',
    moves: ['mirrored', 'turned at random'],
  },
  {
    order: 8, id: 'mouth', label: 'Mouth', cells: ['D2', 'D3', 'D4'],
    rule: 'Three tiles make the mouth. Most stay plain and one is allowed to stand out.',
    moves: ['one tile stands out'],
  },
  {
    order: 9, id: 'chin', label: 'Chin', cells: ['E2', 'E3', 'E4'],
    rule: 'The chin sides mirror each other. The middle tile turns on its own.',
    moves: ['mirrored', 'turned at random'],
  },
  {
    order: 10, id: 'colour', label: 'Colour', cells: [],
    rule: 'The last word picks one colour for the whole face.',
    moves: ['tints every tile'],
  },
];

export const CELL_STEP = {};
STEPS.forEach((s) => s.cells.forEach((c) => { CELL_STEP[c] = s; }));

// Seeded randomness (mulberry32) so a face is reproducible.
function hash(...nums) {
  let h = 2166136261;
  for (const n of nums) {
    h ^= n | 0;
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(a) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function makeRng(seed = 1) {
  return mulberry32(hash(seed, 7919));
}

export function pickWords(rng = Math.random, n = 10, exclude = []) {
  const pool = WORD_POOL.filter((w) => !exclude.includes(w));
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, n);
}

export function wordColor(word) {
  return colorForWord(normalizeWordKey(word));
}

export function displayWord(word) {
  return String(word).replace(/_/g, ' ');
}

/**
 * words: ten trait words. Words 1 to 9 choose tiles, word 10 chooses the colour.
 * Returns { cells, color }. Each cell: { cell, tile, rot, flip, order, note }.
 */
export function buildFace(words, seed = 1) {
  const w = words.map(normalizeWordKey);
  // Each order gets its own generator, so changing word N never disturbs the
  // rotations chosen for any other order.
  const rand = (order, salt = 0) => mulberry32(hash(seed, order, salt))();
  const quarter = (order, salt) => 90 * Math.floor(rand(order, salt) * 4);
  const map = (i) => WORD_TILE_MAP[w[i]]?.[i + 1] || {};
  const cells = [];
  const put = (order, cell, tile, rot = 0, flip = false, note = 'drawn') =>
    cells.push({ cell, tile: tile || 1, rot, flip, order, note });

  { // 1 Frame
    const m = map(0); const r = quarter(1);
    put(1, 'A1', m.A1, r);
    put(1, 'A5', m.A1, r, true, 'mirror of A1');
  }
  { // 2 Brow
    const m = map(1);
    put(2, 'A2', m.A2);
    put(2, 'A3', m.A3, rand(2) < 0.5 ? 90 : -90, false, 'turned');
    put(2, 'A4', m.A2, 0, true, 'mirror of A2');
  }
  { // 3 Eyes
    const m = map(2);
    put(3, 'B2', m.B2);
    put(3, 'B4', m.B2, 0, false, 'copy of B2');
  }
  { // 4 Nose
    const m = map(3);
    put(4, 'B3', m.B3);
    put(4, 'C3', m.C3);
    put(4, 'C2', m.C2);
    put(4, 'C4', m.C2, 0, true, 'mirror of C2');
  }
  { // 5 Cheeks
    const m = map(4); const r = quarter(5);
    put(5, 'C1', m.C1, r);
    put(5, 'C5', m.C1, r, true, 'mirror of C1');
    put(5, 'B1', m.C1, r, false, 'copy of C1');
    put(5, 'B5', m.C1, r, true, 'mirror of C1');
  }
  { // 6 Jaw
    const m = map(5); const r = quarter(6);
    put(6, 'D1', m.D1, r);
    put(6, 'D5', m.D1, r, true, 'mirror of D1');
  }
  { // 7 Chin corners
    const m = map(6); const r = quarter(7);
    put(7, 'E1', m.E1, r);
    put(7, 'E5', m.E1, r, true, 'mirror of E1');
  }
  { // 8 Mouth: plain tile 2 everywhere except (at most) one tile that stands out
    const m = map(7);
    const panels = ['D2', 'D3', 'D4'];
    const tiles = panels.map((c) => m[c]);
    const non2 = tiles.map((t, i) => (t !== 2 ? i : -1)).filter((i) => i !== -1);
    if (non2.length === 0) {
      panels.forEach((c) => put(8, c, 2, 0, false, 'plain'));
    } else if (tiles.includes(2)) {
      const chosen = non2[Math.floor(rand(8) * non2.length)];
      panels.forEach((c, i) => (i === chosen
        ? put(8, c, tiles[i], 0, false, 'stands out')
        : put(8, c, 2, 0, false, 'plain')));
    } else {
      panels.forEach((c, i) => put(8, c, tiles[i]));
    }
  }
  { // 9 Chin
    const m = map(8); const r2 = quarter(9, 1); const r3 = quarter(9, 2);
    put(9, 'E2', m.E2, r2);
    put(9, 'E4', m.E2, r2, true, 'mirror of E2');
    put(9, 'E3', m.E3, r3, false, 'turned');
  }

  cells.sort((a, b) => CELL_KEYS.indexOf(a.cell) - CELL_KEYS.indexOf(b.cell));
  return { cells, color: wordColor(words[9]) };
}

export function cellSignature(c) {
  return `${c.tile}|${c.rot}|${c.flip ? 1 : 0}`;
}

/** Cells whose tile, rotation or mirroring differ between two faces. */
export function diffCells(a, b) {
  const bm = new Map(b.cells.map((c) => [c.cell, c]));
  return a.cells
    .filter((c) => cellSignature(c) !== cellSignature(bm.get(c.cell)))
    .map((c) => c.cell);
}

/** Number of ordered ways to choose ten different words from the pool. */
export function wordSequenceCount(n = WORD_POOL.length, k = 10) {
  let total = 1n;
  for (let i = 0; i < k; i++) total *= BigInt(n - i);
  return total;
}

// Colour families, so one crowd shares a palette the way each poster does.
function hue(hex) {
  const v = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(v.slice(i, i + 2), 16) / 255);
  const max = Math.max(r, g, b); const min = Math.min(r, g, b);
  const d = max - min;
  if (d === 0) return 0;
  let h;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return (h * 60 + 360) % 360;
}

export const PALETTES = (() => {
  const families = {
    warm: (h) => h < 50 || h >= 335,
    green: (h) => h >= 50 && h < 165,
    cool: (h) => h >= 165 && h < 250,
    violet: (h) => h >= 250 && h < 335,
  };
  const out = {};
  for (const [name, test] of Object.entries(families)) {
    out[name] = WORD_POOL.filter((w) => test(hue(wordColor(w))));
  }
  return out;
})();
