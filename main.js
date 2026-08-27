// Remove the ES6 import since p5.js is loaded globally from CDN
// import p5 from 'p5';

// --- ALL SKETCH LOGIC IS NOW IN MAIN.JS ---

// --- DATA STRUCTURES BASED ON YOUR SPEC ---

// 1. Grid Panel Assignments (Word Order -> Panels)
const WORD_PANEL_MAP = {
  1: ["A1", "A5"],
  2: ["A2", "A3", "A4"],
  3: ["B2", "B4"],
  4: ["B3", "C2", "C3", "C4"],
  5: ["C1", "C5"],
  6: ["D1", "D5"],
  7: ["E1", "E5"],
  8: ["D2", "D3", "D4"],
  9: ["E2", "E3", "E4"]
};

// 2. Per-panel, per-word, per-order tile mapping
// Example for a few words; you should generate the full mapping from your spreadsheet
const WORD_TILE_MAP = {
  confident: {
    1: { A1: 3, A5: 3 },
    2: { A2: 2, A3: 11, A4: 2 },
    3: { B2: 23, B4: 23 },
    4: { B3: 1, C2: 5, C3: 2, C4: 5 },
    5: { C1: 4, C5: 4 },
    6: { D1: 4, D5: 4 },
    7: { E1: 5, E5: 5 },
    8: { D2: 11, D3: 11, D4: 11 },
    9: { E2: 5, E3: 5, E4: 5 }
  },
  kind: {
    1: { A1: 4, A5: 4 },
    2: { A2: 3, A3: 2, A4: 3 },
    3: { B2: 22, B4: 22 },
    4: { B3: 2, C2: 1, C3: 4, C4: 1 },
    5: { C1: 2, C5: 2 },
    6: { D1: 6, D5: 6 },
    7: { E1: 4, E5: 4 },
    8: { D2: 27, D3: 2, D4: 2 },
    9: { E2: 3, E3: 3, E4: 3 }
  },
  funny: {
    1: { A1: 1, A5: 1 },
    2: { A2: 5, A3: 1, A4: 5 },
    3: { B2: 21, B4: 21 },
    4: { B3: 4, C2: 2, C3: 1, C4: 2 },
    5: { C1: 1, C5: 1 },
    6: { D1: 2, D5: 2 },
    7: { E1: 3, E5: 3 },
    8: { D2: 2, D3: 15, D4: 2 },
    9: { E2: 11, E3: 11, E4: 11 }
  },
  creative: {
    1: { A1: 5, A5: 5 },
    2: { A2: 1, A3: 11, A4: 1 },
    3: { B2: 20, B4: 20 },
    4: { B3: 11, C2: 4, C3: 11, C4: 4 },
    5: { C1: 5, C5: 5 },
    6: { D1: 1, D5: 1 },
    7: { E1: 1, E5: 1 },
    8: { D2: 21, D3: 2, D4: 10 },
    9: { E2: 1, E3: 1, E4: 1 }
  },
  generous: {
    1: { A1: 3, A5: 3 },
    2: { A2: 2, A3: 2, A4: 2 },
    3: { B2: 24, B4: 24 },
    4: { B3: 1, C2: 3, C3: 2, C4: 3 },
    5: { C1: 3, C5: 3 },
    6: { D1: 4, D5: 4 },
    7: { E1: 5, E5: 5 },
    8: { D2: 11, D3: 11, D4: 11 },
    9: { E2: 2, E3: 2, E4: 2 }
  },
  expressive: {
    1: { A1: 4, A5: 4 },
    2: { A2: 3, A3: 1, A4: 3 },
    3: { B2: 25, B4: 25 },
    4: { B3: 2, C2: 10, C3: 4, C4: 10 },
    5: { C1: 4, C5: 4 },
    6: { D1: 6, D5: 6 },
    7: { E1: 4, E5: 4 },
    8: { D2: 11, D3: 11, D4: 11 },
    9: { E2: 5, E3: 5, E4: 5 }
  },
  joyful: {
    1: { A1: 1, A5: 1 },
    2: { A2: 5, A3: 11, A4: 5 },
    3: { B2: 26, B4: 26 },
    4: { B3: 4, C2: 6, C3: 1, C4: 6 },
    5: { C1: 2, C5: 2 },
    6: { D1: 2, D5: 2 },
    7: { E1: 3, E5: 3 },
    8: { D2: 27, D3: 2, D4: 2 },
    9: { E2: 3, E3: 3, E4: 3 }
  },
  warm: {
    1: { A1: 5, A5: 5 },
    2: { A2: 1, A3: 2, A4: 1 },
    3: { B2: 27, B4: 27 },
    4: { B3: 11, C2: 5, C3: 11, C4: 5 },
    5: { C1: 1, C5: 1 },
    6: { D1: 1, D5: 1 },
    7: { E1: 1, E5: 1 },
    8: { D2: 2, D3: 2, D4: 15 },
    9: { E2: 11, E3: 11, E4: 11 }
  },
  caring: {
    1: { A1: 3, A5: 3 },
    2: { A2: 2, A3: 1, A4: 2 },
    3: { B2: 19, B4: 19 },
    4: { B3: 1, C2: 1, C3: 2, C4: 1 },
    5: { C1: 5, C5: 5 },
    6: { D1: 4, D5: 4 },
    7: { E1: 5, E5: 5 },
    8: { D2: 10, D3: 10, D4: 10 },
    9: { E2: 1, E3: 1, E4: 1 }
  },
  charismatic: {
    1: { A1: 4, A5: 4 },
    2: { A2: 3, A3: 11, A4: 3 },
    3: { B2: 18, B4: 18 },
    4: { B3: 2, C2: 2, C3: 4, C4: 2 },
    5: { C1: 3, C5: 3 },
    6: { D1: 6, D5: 6 },
    7: { E1: 4, E5: 4 },
    8: { D2: 11, D3: 11, D4: 11 },
    9: { E2: 2, E3: 2, E4: 2 }
  },
  calm: {
    1: { A1: 1, A5: 1 },
    2: { A2: 5, A3: 2, A4: 5 },
    3: { B2: 17, B4: 17 },
    4: { B3: 4, C2: 4, C3: 1, C4: 4 },
    5: { C1: 4, C5: 4 },
    6: { D1: 2, D5: 2 },
    7: { E1: 3, E5: 3 },
    8: { D2: 11, D3: 11, D4: 11 },
    9: { E2: 5, E3: 5, E4: 5 }
  },
  curious: {
    1: { A1: 5, A5: 5 },
    2: { A2: 1, A4: 1, A3: 1 },
    3: { B2: 16, B4: 16 },
    4: { B3: 11, C2: 3, C3: 11, C4: 3 },
    5: { C1: 2, C5: 2 },
    6: { D1: 1, D5: 1 },
    7: { E1: 1, E5: 1 },
    8: { D2: 27, D3: 2, D4: 2 },
    9: { E2: 3, E3: 3, E4: 3 }
  },
  sensitive: {
    1: { A1: 3, A5: 3 },
    2: { A2: 2, A4: 2, A3: 11 },
    3: { B2: 10, B4: 10 },
    4: { B3: 1, C2: 10, C3: 2, C4: 10 },
    5: { C1: 1, C5: 1 },
    6: { D1: 4, D5: 4 },
    7: { E1: 5, E5: 5 },
    8: { D2: 2, D3: 2, D4: 15 },
    9: { E2: 11, E3: 11, E4: 11 }
  },
  serious: {
    1: { A1: 4, A5: 4 },
    2: { A2: 3, A4: 3, A3: 2 },
    3: { B2: 9, B4: 9 },
    4: { B3: 2, C2: 6, C3: 4, C4: 6 },
    5: { C1: 5, C5: 5 },
    6: { D1: 6, D5: 6 },
    7: { E1: 4, E5: 4 },
    8: { D2: 2, D3: 10, D4: 2 },
    9: { E2: 1, E3: 1, E4: 1 }
  },
  private: {
    1: { A1: 1, A5: 1 },
    2: { A2: 5, A4: 5, A3: 1 },
    3: { B2: 8, B4: 8 },
    4: { B3: 4, C2: 5, C3: 1, C4: 5 },
    5: { C1: 3, C5: 3 },
    6: { D1: 2, D5: 2 },
    7: { E1: 3, E5: 3 },
    8: { D2: 11, D3: 11, D4: 11 },
    9: { E2: 2, E3: 2, E4: 2 }
  },
  intense: {
    1: { A1: 5, A5: 5 },
    2: { A2: 1, A4: 1, A3: 11 },
    3: { B2: 7, B4: 7 },
    4: { B3: 11, C2: 1, C3: 11, C4: 1 },
    5: { C1: 4, C5: 4 },
    6: { D1: 1, D5: 1 },
    7: { E1: 1, E5: 1 },
    8: { D2: 11, D3: 11, D4: 11 },
    9: { E2: 5, E3: 5, E4: 5 }
  },
  thoughtful: {
    1: { A1: 3, A5: 3 },
    2: { A2: 2, A4: 2, A3: 2 },
    3: { B2: 15, B4: 15 },
    4: { B3: 1, C2: 2, C3: 2, C4: 2 },
    5: { C1: 2, C5: 2 },
    6: { D1: 4, D5: 4 },
    7: { E1: 5, E5: 5 },
    8: { D2: 2, D3: 2, D4: 27 },
    9: { E2: 3, E3: 3, E4: 3 }
  },
  structured: {
    1: { A1: 4, A5: 4 },
    2: { A2: 2, A4: 2, A3: 1 },
    3: { B2: 14, B4: 14 },
    4: { B3: 2, C2: 4, C3: 4, C4: 4 },
    5: { C1: 1, C5: 1 },
    6: { D1: 6, D5: 6 },
    7: { E1: 4, E5: 4 },
    8: { D2: 2, D3: 15, D4: 2 },
    9: { E2: 11, E3: 11, E4: 11 }
  },
  reserved: {
    1: { A1: 1, A5: 1 },
    2: { A2: 3, A4: 3, A3: 11 },
    3: { B2: 13, B4: 13 },
    4: { B3: 4, C2: 3, C3: 1, C4: 3 },
    5: { C1: 5, C5: 5 },
    6: { D1: 2, D5: 2 },
    7: { E1: 3, E5: 3 },
    8: { D2: 2, D3: 10, D4: 2 },
    9: { E2: 1, E3: 1, E4: 1 }
  },
  observant: {
    1: { A1: 3, A5: 3 },
    2: { A2: 5, A4: 5, A3: 2 },
    3: { B2: 12, B4: 12 },
    4: { B3: 11, C2: 10, C3: 11, C4: 10 },
    5: { C1: 3, C5: 3 },
    6: { D1: 1, D5: 1 },
    7: { E1: 1, E5: 1 },
    8: { D2: 11, D3: 11, D4: 11 },
    9: { E2: 2, E3: 2, E4: 2 }
  },
  anxious: {
    1: { A1: 4, A5: 4 },
    2: { A2: 1, A4: 1, A3: 1 },
    3: { B2: 23, B4: 23 },
    4: { B3: 1, C2: 6, C3: 2, C4: 6 },
    5: { C1: 4, C5: 4 },
    6: { D1: 4, D5: 4 },
    7: { E1: 5, E5: 5 },
    8: { D2: 11, D3: 11, D4: 11 },
    9: { E2: 5, E3: 5, E4: 5 }
  },
  awkward: {
    1: { A1: 1, A5: 1 },
    2: { A2: 2, A4: 2, A3: 11 },
    3: { B2: 22, B4: 22 },
    4: { B3: 2, C2: 5, C3: 4, C4: 5 },
    5: { C1: 2, C5: 2 },
    6: { D1: 6, D5: 6 },
    7: { E1: 4, E5: 4 },
    8: { D2: 2, D3: 2, D4: 27 },
    9: { E2: 3, E3: 3, E4: 3 }
  },
  insecure: {
    1: { A1: 5, A5: 5 },
    2: { A2: 3, A4: 3, A3: 2 },
    3: { B2: 21, B4: 21 },
    4: { B3: 4, C2: 1, C3: 1, C4: 1 },
    5: { C1: 1, C5: 1 },
    6: { D1: 2, D5: 2 },
    7: { E1: 3, E5: 3 },
    8: { D2: 2, D3: 15, D4: 2 },
    9: { E2: 11, E3: 11, E4: 11 }
  },
  too_much: {
    1: { A1: 3, A5: 3 },
    2: { A2: 5, A4: 5, A3: 1 },
    3: { B2: 20, B4: 20 },
    4: { B3: 11, C2: 2, C3: 11, C4: 2 },
    5: { C1: 5, C5: 5 },
    6: { D1: 1, D5: 1 },
    7: { E1: 1, E5: 1 },
    8: { D2: 2, D3: 10, D4: 2 },
    9: { E2: 1, E3: 1, E4: 1 }
  },
  dramatic: {
    1: { A1: 4, A5: 4 },
    2: { A2: 1, A4: 1, A3: 11 },
    3: { B2: 24, B4: 24 },
    4: { B3: 1, C2: 4, C3: 2, C4: 4 },
    5: { C1: 3, C5: 3 },
    6: { D1: 4, D5: 4 },
    7: { E1: 5, E5: 5 },
    8: { D2: 11, D3: 11, D4: 11 },
    9: { E2: 2, E3: 2, E4: 2 }
  },
  needy: {
    1: { A1: 3, A5: 3 },
    2: { A2: 2, A4: 2, A3: 2 },
    3: { B2: 25, B4: 25 },
    4: { B3: 2, C2: 3, C3: 4, C4: 3 },
    5: { C1: 4, C5: 4 },
    6: { D1: 6, D5: 6 },
    7: { E1: 4, E5: 4 },
    8: { D2: 11, D3: 11, D4: 11 },
    9: { E2: 5, E3: 5, E4: 5 }
  },
  fake: {
    1: { A1: 4, A5: 4 },
    2: { A2: 3, A4: 3, A3: 1 },
    3: { B2: 26, B4: 26 },
    4: { B3: 4, C2: 10, C3: 1, C4: 10 },
    5: { C1: 2, C5: 2 },
    6: { D1: 2, D5: 2 },
    7: { E1: 3, E5: 3 },
    8: { D2: 2, D3: 2, D4: 27 },
    9: { E2: 3, E3: 3, E4: 3 }
  },
  intimidating: {
    1: { A1: 1, A5: 1 },
    2: { A2: 2, A4: 2, A3: 11 },
    3: { B2: 27, B4: 27 },
    4: { B3: 11, C2: 6, C3: 11, C4: 6 },
    5: { C1: 1, C5: 1 },
    6: { D1: 1, D5: 1 },
    7: { E1: 1, E5: 1 },
    8: { D2: 2, D3: 15, D4: 2 },
    9: { E2: 11, E3: 11, E4: 11 }
  },
  cold: {
    1: { A1: 5, A5: 5 },
    2: { A2: 3, A4: 3, A3: 2 },
    3: { B2: 19, B4: 19 },
    4: { B3: 1, C2: 5, C3: 2, C4: 5 },
    5: { C1: 4, C5: 4 },
    6: { D1: 4, D5: 4 },
    7: { E1: 5, E5: 5 },
    8: { D2: 2, D3: 10, D4: 2 },
    9: { E2: 1, E3: 1, E4: 1 }
  },
  passive: {
    1: { A1: 3, A5: 3 },
    2: { A2: 5, A4: 5, A3: 1 },
    3: { B2: 18, B4: 18 },
    4: { B3: 2, C2: 1, C3: 4, C4: 1 },
    5: { C1: 2, C5: 2 },
    6: { D1: 6, D5: 6 },
    7: { E1: 4, E5: 4 },
    8: { D2: 11, D3: 11, D4: 11 },
    9: { E2: 2, E3: 2, E4: 2 }
  },
  mysterious: {
    1: { A1: 4, A5: 4 },
    2: { A2: 1, A3: 11, A4: 1 },
    3: { B2: 17, B4: 17 },
    4: { B3: 4, C2: 2, C3: 1, C4: 2 },
    5: { C1: 1, C5: 1 },
    6: { D1: 2, D5: 2 },
    7: { E1: 3, E5: 3 },
    8: { D2: 11, D3: 11, D4: 11 },
    9: { E2: 5, E3: 5, E4: 5 }
  },
  chaotic: {
    1: { A1: 1, A5: 1 },
    2: { A2: 2, A3: 2, A4: 2 },
    3: { B2: 16, B4: 16 },
    4: { B3: 11, C2: 4, C3: 11, C4: 4 },
    5: { C1: 5, C5: 5 },
    6: { D1: 1, D5: 1 },
    7: { E1: 1, E5: 1 },
    8: { D2: 2, D3: 2, D4: 27 },
    9: { E2: 3, E3: 3, E4: 3 }
  },
  self_conscious: {
    1: { A1: 5, A5: 5 },
    2: { A2: 3, A3: 1, A4: 3 },
    3: { B2: 10, B4: 10 },
    4: { B3: 1, C2: 3, C3: 2, C4: 3 },
    5: { C1: 3, C5: 3 },
    6: { D1: 4, D5: 4 },
    7: { E1: 5, E5: 5 },
    8: { D2: 15, D3: 2, D4: 2 },
    9: { E2: 11, E3: 11, E4: 11 }
  },
  loud: {
    1: { A1: 3, A5: 3 },
    2: { A2: 5, A3: 9, A4: 5 },
    3: { B2: 9, B4: 9 },
    4: { B3: 2, C2: 10, C3: 4, C4: 10 },
    5: { C1: 4, C5: 4 },
    6: { D1: 6, D5: 6 },
    7: { E1: 4, E5: 4 },
    8: { D2: 10, D3: 2, D4: 2 },
    9: { E2: 1, E3: 1, E4: 1 }
  },
  judgmental: {
    1: { A1: 4, A5: 4 },
    2: { A2: 1, A3: 1, A4: 1 },
    3: { B2: 8, B4: 8 },
    4: { B3: 4, C2: 6, C3: 1, C4: 6 },
    5: { C1: 2, C5: 2 },
    6: { D1: 2, D5: 2 },
    7: { E1: 3, E5: 3 },
    8: { D2: 11, D3: 11, D4: 11 },
    9: { E2: 2, E3: 2, E4: 2 }
  },
  defensive: {
    1: { A1: 1, A5: 1 },
    2: { A2: 2, A3: 11, A4: 2 },
    3: { B2: 7, B4: 7 },
    4: { B3: 11, C2: 5, C3: 11, C4: 5 },
    5: { C1: 1, C5: 1 },
    6: { D1: 1, D5: 1 },
    7: { E1: 1, E5: 1 },
    8: { D2: 11, D3: 11, D4: 11 },
    9: { E2: 5, E3: 5, E4: 5 }
  },
  detached: {
    1: { A1: 3, A5: 3 },
    2: { A2: 3, A3: 2, A4: 3 },
    3: { B2: 15, B4: 15 },
    4: { B3: 1, C2: 1, C3: 2, C4: 1 },
    5: { C1: 5, C5: 5 },
    6: { D1: 4, D5: 4 },
    7: { E1: 5, E5: 5 },
    8: { D2: 27, D3: 2, D4: 2 },
    9: { E2: 3, E3: 3, E4: 3 }
  },
  controlling: {
    1: { A1: 4, A5: 4 },
    2: { A2: 5, A3: 1, A4: 5 },
    3: { B2: 14, B4: 14 },
    4: { B3: 2, C2: 2, C3: 4, C4: 2 },
    5: { C1: 3, C5: 3 },
    6: { D1: 6, D5: 6 },
    7: { E1: 4, E5: 4 },
    8: { D2: 15, D3: 2, D4: 2 },
    9: { E2: 11, E3: 11, E4: 11 }
  },
  overbearing: {
    1: { A1: 2, A5: 2 },
    2: { A2: 1, A3: 11, A4: 1 },
    3: { B2: 13, B4: 13 },
    4: { B3: 4, C2: 4, C3: 1, C4: 4 },
    5: { C1: 4, C5: 4 },
    6: { D1: 2, D5: 2 },
    7: { E1: 3, E5: 3 },
    8: { D2: 10, D3: 2, D4: 2 },
    9: { E2: 1, E3: 1, E4: 1 }
  },
  forgettable: {
    1: { A1: 5, A5: 5 },
    2: { A2: 2, A3: 2, A4: 2 },
    3: { B2: 12, B4: 12 },
    4: { B3: 11, C2: 3, C3: 11, C4: 3 },
    5: { C1: 2, C5: 2 },
    6: { D1: 1, D5: 1 },
    7: { E1: 1, E5: 1 },
    8: { D2: 11, D3: 11, D4: 11 },
    9: { E2: 2, E3: 2, E4: 2 }
  }
};

// PATCH: Ensure every word has a valid C1 for order 5
Object.keys(WORD_TILE_MAP).forEach(word => {
  if (!WORD_TILE_MAP[word][5] || typeof WORD_TILE_MAP[word][5].C1 === 'undefined') {
    if (!WORD_TILE_MAP[word][5]) WORD_TILE_MAP[word][5] = {};
    WORD_TILE_MAP[word][5].C1 = 1; // Default to tile 1 if missing
  }
});

// Replace PALETTES with a word-to-color mapping for the 10th word
const WORD_COLOR_MAP = {
  joyful:          "#FF476F",
  expressive:      "#FF5A3A",
  warm:            "#FF8A1F",
  kind:            "#FFBE0B",
  caring:          "#FFD54D",
  calm:            "#F4D35E",
  gentle:          "#C4E500",
  curious:         "#8CD626",
  creative:        "#06D6A0",
  sensitive:       "#17C3B2",
  thoughtful:      "#06B6D4",
  observant:       "#00A8E8",
  reserved:        "#118AB2",
  private:         "#0072CE",
  mysterious:      "#3A0CA3",
  intense:         "#8338EC",
  dramatic:        "#B5179E",
  passionate:      "#F72585",
  charismatic:     "#FF006E",
  energetic:       "#FF4500",
  expressiveAlt:   "#FF6B6B",
  generous:        "#FF9A6B",
  structured:      "#F6D365",
  balanced:        "#D4E157",
  steady:          "#9CCC65",
  confident:       "#2ECC71",
  grounded:        "#17B978",
  observantAlt:    "#00BFFF",
  serious:         "#008ECC",
  focused:         "#0053A0",
  thoughtfulAlt:   "#4E5AE8",
  introspective:   "#7851FF",
  too_much:        "#A633FF",
  tooMuch:         "#A633FF",
  self_conscious:  "#DA2787",
  selfConscious:   "#DA2787",
  loud:            "#F02E65",
  fake:            "#FF5F45",
  passive:         "#FF9B45",
  forgettable:     "#FFC857",
  awkward:         "#C8DB2D",
  anxious:         "#8FD14F",
  funny:           "#FF6B35",
  insecure:        "#FF8E53",
  needy:           "#FFB347",
  intimidating:    "#FFD700",
  cold:            "#87CEEB",
  chaotic:         "#FF69B4",
  judgmental:      "#9370DB",
  defensive:       "#20B2AA",
  detached:        "#B0C4DE",
  controlling:     "#CD853F",
  overbearing:     "#DC143C"
};

function colorForWord(word) {
    const raw = String(word || '');
    const underscored = raw.replace(/[- ]/g, '_').toLowerCase();
    const squeezed = raw.replace(/[-_ ]/g, '').toLowerCase();
    const camel = raw.replace(/[-_ ]+([a-zA-Z])/g, (_, letter) => letter.toUpperCase());
    return WORD_COLOR_MAP[raw]
        || WORD_COLOR_MAP[underscored]
        || WORD_COLOR_MAP[squeezed]
        || WORD_COLOR_MAP[camel]
        || '#4AF2E5';
}

function inkForHex(hex) {
    const value = String(hex).replace('#', '');
    if (value.length !== 6) return '#111';
    const r = parseInt(value.slice(0, 2), 16);
    const g = parseInt(value.slice(2, 4), 16);
    const b = parseInt(value.slice(4, 6), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 160 ? '#111' : '#fff';
}

function styleDownloadButton(hex) {
    const downloadButton = document.getElementById('downloadButton');
    if (!downloadButton) return;
    downloadButton.style.setProperty('--facette-color', hex);
    downloadButton.style.setProperty('--facette-ink', inkForHex(hex));
}

// --- Main App Logic ---
const WORD_CATEGORIES = {
    "Positive/Expressive": ["confident", "kind", "funny", "creative", "generous", "expressive", "joyful", "warm", "caring", "charismatic"],
    "Neutral/Introspective": ["calm", "curious", "sensitive", "serious", "private", "intense", "thoughtful", "structured", "reserved", "observant"],
    "Negative/Anxious": ["anxious", "awkward", "insecure", "too_much", "dramatic", "needy", "fake", "intimidating", "cold", "passive"],
    "Chaotic/Confrontational": ["mysterious", "chaotic", "self_conscious", "loud", "judgmental", "defensive", "detached", "controlling", "overbearing", "forgettable"]
};

let selectedWords = [];
let p5Instance;
let svgTiles = [];
let cellSize;

// Ensure p5Instance is created and attached to #maskCanvas when facette UI is shown
function ensureP5Instance() {
    if (!p5Instance) {
        p5Instance = new p5(sketch, 'maskCanvas');
    }
}

function cellToXY(p, cellKey) {
  const row = cellKey.charCodeAt(0) - "A".charCodeAt(0);
  const col = parseInt(cellKey.substring(1), 10) - 1;
  return { x: col * cellSize, y: row * cellSize };
}

// Draw a tile at a given cell with rotation, flip, and duotone tint
function drawTile(cellKey, tileNum, rotate, flip, colA, colB, debugInfo = {}) {
  console.log(`Drawing ${cellKey} with tile ${tileNum}` +
    (debugInfo.word ? ` | word: ${debugInfo.word}` : '') +
    (debugInfo.order ? ` | order: ${debugInfo.order}` : '') +
    (debugInfo.panel ? ` | panel: ${debugInfo.panel}` : '') +
    (typeof debugInfo.mirror !== 'undefined' ? ` | mirror: ${debugInfo.mirror}` : '') +
    (typeof debugInfo.flip !== 'undefined' ? ` | flip: ${debugInfo.flip}` : '') +
    (typeof debugInfo.rotate !== 'undefined' ? ` | rotate: ${debugInfo.rotate}` : '') +
    (debugInfo.reason ? ` | reason: ${debugInfo.reason}` : ''));
  // Use the global p5Instance and svgTiles
  const p = p5Instance || window._p5Instance || window.p5Instance;
  if (!p) {
    console.error('p5Instance not available in drawTile');
    return;
  }
  if (!svgTiles[tileNum]) {
    console.error(`svgTiles[${tileNum}] not available`);
    return;
  }
  const { x, y } = cellToXY(p, cellKey);
  console.log(`Drawing tile at position x: ${x}, y: ${y}`);
  p.push();
  p.translate(x + cellSize / 2, y + cellSize / 2);
  if (flip) p.scale(-1, 1);
  if (rotate) p.rotate((rotate * Math.PI) / 180);
  // Duotone: apply tint (p5.js only supports one tint at a time, so use colA)
  p.tint(colA);
  p.image(svgTiles[tileNum], -cellSize / 2, -cellSize / 2, cellSize, cellSize);
  p.pop();
}

const sketch = (p) => {
    let wordsToDraw = [];

    p.preload = () => {
        console.log('p5 preload started');
        for(let i=1; i<=27; i++){
            svgTiles[i] = p.loadImage(`/tiles/${i}.svg`);
        }
        console.log('p5 preload completed, svgTiles loaded:', svgTiles.length);
    };

    p.setup = () => {
        console.log('p5 setup started');
        const canvas = p.createCanvas(600, 600);
        canvas.parent("maskCanvas");
        p.colorMode(p.RGB, 255, 255, 255, 255);
        cellSize = p.width / 5;
        p.noLoop();
        console.log('p5 setup completed, canvas created:', canvas);
        console.log('cellSize:', cellSize);
    };

    p.updateWithWords = (words) => {
        console.log('updateWithWords called with:', words);
        wordsToDraw = words;
        p.redraw();
    };

    p.draw = () => {
        console.log('p5 draw started, wordsToDraw length:', wordsToDraw.length);
        p.clear();
        if (wordsToDraw.length < 10) {
            console.log('Not enough words, returning');
            return;
        }
        console.log('Starting to draw mask with words:', wordsToDraw);

        // Use the 10th word to determine the color
        const paletteWord = wordsToDraw[9];
        let colA = colorForWord(paletteWord);
        let colB = colA;

        // --- Draw all mask panels per mapping ---
        // Word 1: Frame (A1, A5)
        {
          const word = wordsToDraw[0];
          const panelMap = WORD_TILE_MAP[word]?.[1] || {};
          let rotA1 = 90 * Math.floor(Math.random() * 4);
          drawTile('A1', panelMap['A1'], rotA1, false, colA, colB, {word, order: 1, panel: 'A1', rotate: rotA1});
          drawTile('A5', panelMap['A1'], rotA1, true, colA, colB, {word, order: 1, panel: 'A5', rotate: rotA1, mirror: true, reason: 'mirror of A1'});
        }
        // Word 2: Brow line (A2, A3, A4)
        {
          const word = wordsToDraw[1];
          const panelMap = WORD_TILE_MAP[word]?.[2] || {};
          drawTile('A2', panelMap['A2'], 0, false, colA, colB, {word, order: 2, panel: 'A2'});
          let rotA3 = Math.random() < 0.5 ? 90 : -90;
          drawTile('A3', panelMap['A3'], rotA3, false, colA, colB, {word, order: 2, panel: 'A3', rotate: rotA3});
          drawTile('A4', panelMap['A2'], 0, true, colA, colB, {word, order: 2, panel: 'A4', mirror: true, reason: 'mirror of A2'});
        }
        // Word 3: Eyes (B2, B4)
        {
          const word = wordsToDraw[2];
          const panelMap = WORD_TILE_MAP[word]?.[3] || {};
          drawTile('B2', panelMap['B2'], 0, false, colA, colB, {word, order: 3, panel: 'B2'});
          drawTile('B4', panelMap['B2'], 0, false, colA, colB, {word, order: 3, panel: 'B4', reason: 'copy of B2'});
        }
        // Word 4: Nose bridge + tip (B3, C2, C3, C4)
        {
          const word = wordsToDraw[3];
          const panelMap = WORD_TILE_MAP[word]?.[4] || {};
          drawTile('B3', panelMap['B3'], 0, false, colA, colB, {word, order: 4, panel: 'B3'});
          drawTile('C3', panelMap['C3'], 0, false, colA, colB, {word, order: 4, panel: 'C3'});
          drawTile('C2', panelMap['C2'], 0, false, colA, colB, {word, order: 4, panel: 'C2'});
          drawTile('C4', panelMap['C2'], 0, true, colA, colB, {word, order: 4, panel: 'C4', mirror: true, reason: 'mirror of C2'});
        }
        // Word 5: Upper cheeks (C1, C5, B1, B5)
        {
          const word = wordsToDraw[4];
          const panelMap = WORD_TILE_MAP[word]?.[5] || {};
          let rotC1 = 90 * Math.floor(Math.random() * 4);
          drawTile('C1', panelMap['C1'], rotC1, false, colA, colB, {word, order: 5, panel: 'C1', rotate: rotC1});
          drawTile('C5', panelMap['C1'], rotC1, true, colA, colB, {word, order: 5, panel: 'C5', rotate: rotC1, mirror: true, reason: 'mirror of C1'});
          drawTile('B1', panelMap['C1'], rotC1, false, colA, colB, {word, order: 5, panel: 'B1', rotate: rotC1, reason: 'copy of C1'});
          drawTile('B5', panelMap['C1'], rotC1, true, colA, colB, {word, order: 5, panel: 'B5', rotate: rotC1, mirror: true, reason: 'mirror of C1'});
        }
        // Word 6: Jaw sides (D1, D5)
        {
          const word = wordsToDraw[5];
          const panelMap = WORD_TILE_MAP[word]?.[6] || {};
          let rotD1 = 90 * Math.floor(Math.random() * 4);
          drawTile('D1', panelMap['D1'], rotD1, false, colA, colB, {word, order: 6, panel: 'D1', rotate: rotD1});
          drawTile('D5', panelMap['D1'], rotD1, true, colA, colB, {word, order: 6, panel: 'D5', rotate: rotD1, mirror: true, reason: 'mirror of D1'});
        }
        // Word 7: Chin corners (E1, E5)
        {
          const word = wordsToDraw[6];
          const panelMap = WORD_TILE_MAP[word]?.[7] || {};
          let rotE1 = 90 * Math.floor(Math.random() * 4);
          drawTile('E1', panelMap['E1'], rotE1, false, colA, colB, {word, order: 7, panel: 'E1', rotate: rotE1});
          drawTile('E5', panelMap['E1'], rotE1, true, colA, colB, {word, order: 7, panel: 'E5', rotate: rotE1, mirror: true, reason: 'mirror of E1'});
        }
        // Word 8: Mouth line (D2, D3, D4)
        {
          const word = wordsToDraw[7];
          let panelMap = {};
          if (!WORD_TILE_MAP[word]) {
            console.warn(`WORD_TILE_MAP missing entry for word: '${word}'`);
          } else if (!WORD_TILE_MAP[word][8]) {
            console.warn(`WORD_TILE_MAP['${word}'] missing order 8 mapping`);
          } else {
            panelMap = WORD_TILE_MAP[word][8];
            ['D2', 'D3', 'D4'].forEach(cell => {
              if (typeof panelMap[cell] === 'undefined') {
                console.warn(`WORD_TILE_MAP['${word}'][8] missing '${cell}'`);
              }
            });
          }
          const panels = ['D2', 'D3', 'D4'];
          const tiles = panels.map(cell => panelMap[cell]);
          const non2Indices = tiles.map((tile, i) => tile !== 2 ? i : -1).filter(i => i !== -1);
          if (non2Indices.length === 0) {
            // All are 2
            panels.forEach((cell, i) => {
              drawTile(cell, 2, 0, false, colA, colB, {word, order: 8, panel: cell, reason: 'all panels are 2'});
            });
          } else if (tiles.includes(2)) {
            // Some are 2, some are not
            const chosenIdx = non2Indices[Math.floor(Math.random() * non2Indices.length)];
            panels.forEach((cell, i) => {
              if (i === chosenIdx) {
                drawTile(cell, tiles[i], 0, false, colA, colB, {word, order: 8, panel: cell, reason: 'randomly chosen non-2'});
          } else {
                drawTile(cell, 2, 0, false, colA, colB, {word, order: 8, panel: cell, reason: 'fallback to 2'});
              }
            });
          } else {
            // None are 2, use mapped tiles
            panels.forEach((cell, i) => {
              drawTile(cell, tiles[i], 0, false, colA, colB, {word, order: 8, panel: cell, reason: 'all panels non-2, use mapped'});
            });
          }
        }
        // Word 9: Chin ridge (E2, E3, E4)
        {
          const word = wordsToDraw[8];
          const panelMap = WORD_TILE_MAP[word]?.[9] || {};
          let rotE2 = 90 * Math.floor(Math.random() * 4);
          drawTile('E2', panelMap['E2'], rotE2, false, colA, colB, {word, order: 9, panel: 'E2', rotate: rotE2});
          drawTile('E4', panelMap['E2'], rotE2, true, colA, colB, {word, order: 9, panel: 'E4', rotate: rotE2, mirror: true, reason: 'mirror of E2'});
          let rotE3 = 90 * Math.floor(Math.random() * 4);
          drawTile('E3', panelMap['E3'], rotE3, false, colA, colB, {word, order: 9, panel: 'E3', rotate: rotE3});
        }
    };
};

function displayWord(word) {
    return String(word).replace(/_/g, ' ');
}

function allAdjectives() {
    return Object.values(WORD_CATEGORIES).flat();
}

function pickRandomWords(n = 10) {
    const pool = allAdjectives().slice();
    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, n);
}

function pickOne(items) {
    return items[Math.floor(Math.random() * items.length)];
}

const WORD_PHRASES = {
    confident: [
        'Walked in like it paid for the building. It did not.',
        'Has a plan. The plan is that it is already winning.',
    ],
    kind: [
        'Would give you the last fry. Would remember you did not say thank you.',
        'So nice it feels like a trap. It might be a trap. Still take the fry.',
    ],
    funny: [
        'Would tell a joke at a funeral and then wait, politely, for the laugh.',
        'Has a bit ready. Unfortunately the bit is you.',
    ],
    creative: [
        'Has a project. The project is avoiding the other project.',
        'Would rebrand a crisis and call it a chapter. Has a font picked out.',
    ],
    generous: [
        'Would pay for dinner and then narrate the sacrifice.',
        'Overshares money, time, and opinions. In that order, until it isn\'t.',
    ],
    expressive: [
        'Has a face that cannot keep a secret. The secret is usually a feeling.',
        'Would cry at an ad and then explain why the ad was actually about it.',
    ],
    joyful: [
        'Too happy too early in the evening. Someone will pay for this later.',
        'Brought the energy. Did not bring a ride home for the energy.',
    ],
    warm: [
        'Makes soup. Makes you talk. Makes leaving feel rude.',
        'Hugs like it means it. Stays like it might mean it.',
    ],
    caring: [
        'Will check if you got home. Will also check if you ate. Will not check if you asked.',
        'Loves you in a way that includes a lecture.',
    ],
    charismatic: [
        'Could sell you a chair you already own. Would make you thank it.',
        'The room leans in. The room should lean back.',
    ],
    calm: [
        'Unbothered. Suspiciously unbothered. Something is being stored for later.',
        'Speaking softly so the explosion has better acoustics.',
    ],
    curious: [
        'Asks one more question after you were done talking. Then one more.',
        'Doesn\'t gossip. Collects. This is worse.',
    ],
    sensitive: [
        'Felt the vibe change from two rooms away. The vibe was about it.',
        'Takes things personally. Some of those things were, to be fair, personal.',
    ],
    serious: [
        'Did not get the bit. Will now explain the bit. The bit is dead.',
        'Brought a thesis to a hangout. The hangout did not ask for a thesis.',
    ],
    private: [
        'Has a whole life it will not be discussing. It will be discussing yours though.',
        'Shares nothing and then is shocked you don\'t know it.',
    ],
    intense: [
        'Eye contact like a job interview. You did not apply.',
        'Does not do small talk. Does large talk, immediately, about fate.',
    ],
    thoughtful: [
        'Wrote you a paragraph when a like would have done. The paragraph has structure.',
        'Remembered your throwaway comment from March. Please be afraid.',
    ],
    structured: [
        'Made a spreadsheet for a feeling. The feeling has columns now.',
        'Color-coded its own breakdown. Very organized. Still a breakdown.',
    ],
    reserved: [
        'Quiet until it isn\'t. When it isn\'t, write it down.',
        'Saving it for later. Later is going to be a lot.',
    ],
    observant: [
        'Saw what you did. Saw what you almost did. Has not blinked.',
        'Notices the thing you hoped was invisible. Smiles. Does not mention it. Yet.',
    ],
    anxious: [
        'Rehearsed this conversation in the shower, in the elevator, and once more just now.',
        'Sent "on my way" from the bathroom and then had a thought. Several thoughts.',
    ],
    awkward: [
        'Waved at someone who was waving at the person behind it. Kept waving. Committed.',
        'The silence was normal until it apologized to the silence.',
    ],
    insecure: [
        'Reread the text 11 times. The text was "ok".',
        'Needs a little reassurance. Then a little more. Then a documentary about it.',
    ],
    too_much: [
        'Arrived at 6 for an 8. Brought a cake, a speech, and a backup speech.',
        'Nobody asked it to go that hard. It went that hard. It will go harder.',
    ],
    dramatic: [
        'This is not a conversation. This is an episode. There will be a recap.',
        'Has never had a small feeling. Has had lighting for the big ones.',
    ],
    needy: [
        'Just checking in. And again. And again but in a cute way.',
        'Wants to be close. Closer. Inside your phone. Living there. Paying no rent.',
    ],
    fake: [
        'The laugh is real until you hear the second one.',
        'So supportive. So shiny. So please don\'t look behind the poster.',
    ],
    intimidating: [
        'Didn\'t do anything. The air just got worse.',
        'Smiled. Everyone sat up straighter. Nobody knows why.',
    ],
    cold: [
        'Would leave you on read in person.',
        'Warmth is available. Warmth is not on the menu tonight.',
    ],
    passive: [
        'Said "no worries" in a way that was, in fact, many worries.',
        'Will not start it. Will also not end it. You live here now.',
    ],
    mysterious: [
        'Has lore. Will not share the lore. Wants you to ask about the lore.',
        'Showed up with a past and no footnotes.',
    ],
    chaotic: [
        'Said "one drink." That was a lie with legs.',
        'Has a system. The system is vibes and sudden decisions.',
    ],
    self_conscious: [
        'Heard its own name from across the room and took it personally.',
        'Checking its teeth in the back of a spoon. The spoon is judging back.',
    ],
    loud: [
        'Does not have an inside voice. Has an amphitheater.',
        'Entered the chat. The chat did not survive.',
    ],
    judgmental: [
        'Already rated your apartment from the doorway.',
        'Has notes. You did not ask for notes. The notes have a title.',
    ],
    defensive: [
        'You didn\'t even say anything. It already wrote a rebuttal.',
        'Calm down? It is calm. This is its calm. Please read the attached PDF.',
    ],
    detached: [
        'Here in body. Out for lunch in spirit. Will not be taking questions.',
        'Nodding. Not listening. Very at peace about that.',
    ],
    controlling: [
        'Let me just fix that. And that. And the way you live.',
        'Has a preferred seating chart for a picnic.',
    ],
    overbearing: [
        'Helping. Helping so much. You cannot see the exit because of the help.',
        'Love, but make it a group project it is directing.',
    ],
    forgettable: [
        'Was just here. Give it a second. No, still gone.',
        'The face you remember until you try to remember it.',
    ],
};

function composePersonality(words) {
    const withPhrases = words.filter((word) => WORD_PHRASES[word]?.length);
    const word = pickOne(withPhrases.length ? withPhrases : words);
    const phrases = WORD_PHRASES[word];
    if (!phrases?.length) return 'This one showed up and refused to explain itself.';
    return pickOne(phrases);
}

function waitForP5Ready() {
    return new Promise((resolve, reject) => {
        const started = Date.now();
        const tick = () => {
            const canvasReady = Boolean(document.querySelector('#maskCanvas canvas'));
            if (p5Instance && typeof p5Instance.updateWithWords === 'function' && canvasReady) {
                resolve();
                return;
            }
            if (Date.now() - started > 12000) {
                reject(new Error('p5 timeout'));
                return;
            }
            requestAnimationFrame(tick);
        };
        tick();
    });
}

function startRandomFacette() {
    const landing = document.querySelector('.landing-container');
    const maskApp = document.getElementById('maskApp');
    const nameInput = document.getElementById('maskNameInput');
    const blurb = document.getElementById('personalityBlurb');
    const downloadButton = document.getElementById('downloadButton');
    const galleryOverlay = document.getElementById('galleryOverlay');

    if (landing) landing.classList.add('hidden');
    if (maskApp) maskApp.classList.remove('hidden');
    if (galleryOverlay) galleryOverlay.style.display = 'none';
    if (nameInput) nameInput.value = '';
    if (downloadButton) downloadButton.disabled = true;
    const shareButton = document.getElementById('shareButton');
    if (shareButton) shareButton.disabled = true;

    selectedWords = pickRandomWords(10);
    if (blurb) blurb.textContent = composePersonality(selectedWords);

    ensureP5Instance();
    waitForP5Ready()
        .then(() => generateMask())
        .catch((err) => console.error('Could not draw facette', err));
}

function normalizeWordKey(word) {
  return word.replace(/[- ]/g, '_').toLowerCase();
}

function generateMask() {
    if (selectedWords.length !== 10) return;
    const normalizedWords = selectedWords.map(normalizeWordKey);
    if (p5Instance && typeof p5Instance.updateWithWords === 'function') {
        p5Instance.updateWithWords(normalizedWords);
        const facetteColor = colorForWord(normalizedWords[9]);
        const downloadButton = document.getElementById('downloadButton');
        if (downloadButton) {
            downloadButton.disabled = false;
            styleDownloadButton(facetteColor);
        }
        const shareButton = document.getElementById('shareButton');
        if (shareButton) shareButton.disabled = false;
    } else {
        console.error('p5Instance not available or updateWithWords not a function');
    }
}

// Ensure mask name input is always uppercase
const maskNameInput = document.getElementById('maskNameInput');
const saveMaskBtn = document.getElementById('saveMaskBtn');
if (maskNameInput) {
    maskNameInput.addEventListener('input', function() {
        this.value = this.value.toUpperCase();
    });
}
if (saveMaskBtn) {
    saveMaskBtn.addEventListener('click', function() {
        const name = maskNameInput.value.trim();
        const canvas = document.querySelector('#maskCanvas canvas');
        console.log('Save button clicked!');
        console.log('Name:', name);
        console.log('Canvas found:', canvas);
        console.log('selectedWords:', selectedWords);
        console.log('saveMaskToGallery function exists:', typeof saveMaskToGallery === 'function');
        
        if (name && canvas && typeof saveMaskToGallery === 'function') {
            console.log('Attempting to save mask...');
            saveMaskToGallery(canvas, name, selectedWords)
                .then(() => {
                    console.log('Mask saved successfully!');
                    alert('Mask saved to gallery!');
                    // Clear the name input
                    maskNameInput.value = '';
                    // Refresh the gallery
                    renderGalleryGrid();
                })
                .catch(error => {
                    console.error('Failed to save mask:', error);
                    alert('Failed to save mask. Please try again.');
                });
        } else {
            console.log('Cannot save: missing name, canvas, or function');
            if (!name) console.log('Missing name');
            if (!canvas) console.log('Missing canvas');
            if (typeof saveMaskToGallery !== 'function') console.log('Missing saveMaskToGallery function');
        }
    });
}

function getMaskName() {
  const input = document.getElementById('maskNameInput');
  if (input && input.value.trim()) {
    return input.value.trim();
  }
  return 'MASK';
}

function givenFacetteName() {
  const input = document.getElementById('maskNameInput');
  return input ? input.value.trim() : '';
}

function isAppleTouch() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

function wrapCanvasLines(ctx, text, maxWidth) {
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let current = '';
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function dataURLToFile(dataUrl, filename) {
  const [header, base64] = dataUrl.split(',');
  const mime = (header.match(/:(.*?);/) || [])[1] || 'image/png';
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new File([bytes], filename, { type: mime });
}

function triggerDataUrlDownload(dataUrl, filename) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  link.rel = 'noopener';
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function showSaveOverlay(dataUrl) {
  const overlay = document.getElementById('saveImageOverlay');
  const img = document.getElementById('saveOverlayImage');
  if (!overlay || !img) return;
  img.src = dataUrl;
  overlay.classList.remove('hidden');
}

function hideSaveOverlay() {
  const overlay = document.getElementById('saveImageOverlay');
  const img = document.getElementById('saveOverlayImage');
  if (overlay) overlay.classList.add('hidden');
  if (img) img.removeAttribute('src');
}

function exportCanvasDataUrl(canvas) {
  try {
    return canvas.toDataURL('image/png');
  } catch (err) {
    console.error('Could not export image', err);
    return '';
  }
}

function saveImageOnDevice(dataUrl, filename, shareText) {
  if (!dataUrl) return;
  const file = dataURLToFile(dataUrl, filename);
  const canShareFile = typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] });

  if (canShareFile) {
    navigator.share({ files: [file], title: filename, text: shareText || '' }).catch((err) => {
      if (err && err.name === 'AbortError') return;
      if (isAppleTouch()) showSaveOverlay(dataUrl);
      else triggerDataUrlDownload(dataUrl, filename);
    });
    return;
  }

  if (isAppleTouch()) {
    showSaveOverlay(dataUrl);
    return;
  }

  triggerDataUrlDownload(dataUrl, filename);
}

function composeShareCard() {
  const source = document.querySelector('#maskCanvas canvas');
  if (!source) throw new Error('No facette to share');

  const color = colorForWord(selectedWords[9] || '');
  const name = givenFacetteName();
  const blurb = document.getElementById('personalityBlurb')?.textContent?.trim() || '';

  const width = 1080;
  const height = 1920;
  const card = document.createElement('canvas');
  card.width = width;
  card.height = height;
  const ctx = card.getContext('2d');

  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#fff';
  ctx.font = '700 42px "Space Grotesk", sans-serif';
  ctx.letterSpacing = '0.18em';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('FACETTES', width / 2, 120);
  ctx.letterSpacing = '0';

  const portrait = 800;
  const px = (width - portrait) / 2;
  const py = 250;
  ctx.save();
  ctx.shadowColor = color;
  ctx.shadowBlur = 90;
  ctx.drawImage(source, px, py, portrait, portrait);
  ctx.restore();

  let textY = py + portrait + 80;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  if (name) {
    ctx.fillStyle = color;
    ctx.font = '700 64px "Space Grotesk", sans-serif';
    ctx.fillText(name, width / 2, textY);
    textY += 96;
  }

  if (blurb) {
    ctx.fillStyle = '#fff';
    ctx.font = '500 36px "Space Grotesk", sans-serif';
    const lines = wrapCanvasLines(ctx, blurb, 820);
    lines.slice(0, 6).forEach((line, index) => {
      ctx.fillText(line, width / 2, textY + index * 48);
    });
  }

  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.font = '500 24px "Space Grotesk", sans-serif';
  ctx.textBaseline = 'bottom';
  ctx.fillText('By Axel Garland', width / 2, height - 100);

  return card;
}

function shareCaption() {
  const name = givenFacetteName();
  const blurb = document.getElementById('personalityBlurb')?.textContent?.trim() || '';
  return [name, blurb, 'FACETTES by Axel Garland'].filter(Boolean).join('\n');
}

function shareFacette() {
  const name = givenFacetteName() || 'FACETTE';
  const filename = `${name}.png`;
  const card = composeShareCard();
  const dataUrl = exportCanvasDataUrl(card);
  saveImageOnDevice(dataUrl, filename, shareCaption());
}

function downloadMask() {
  const canvas = document.querySelector('#maskCanvas canvas');
  if (!canvas) return;
  const dataUrl = exportCanvasDataUrl(canvas);
  saveImageOnDevice(dataUrl, `${getMaskName()}.png`);
}

// --- GALLERY LOGIC (DYNAMIC, PNG ONLY) ---

let currentGalleryList = [];

async function fetchGalleryList() {
  try {
    console.log('Loading gallery from localStorage...');
    const savedGallery = localStorage.getItem('maskGallery');
    console.log('Saved gallery data:', savedGallery);
    
    if (savedGallery) {
      const galleryData = JSON.parse(savedGallery);
      console.log('Parsed gallery data:', galleryData);
      return galleryData;
    } else {
      console.log('No saved gallery found');
      return [];
    }
  } catch (error) {
    console.error('Failed to load gallery:', error);
    return [];
  }
}

function renderGalleryGrid() {
  const grid = document.getElementById('galleryGrid');
  
  if (!grid) {
    console.error('Gallery grid element not found');
    return;
  }
  
  // Clear the grid and set basic styles
  grid.innerHTML = '';
  grid.style.display = 'grid';
  grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(120px, 1fr))';
  grid.style.gap = '16px';
  grid.style.padding = '20px';
  grid.style.width = '100%';
  grid.style.maxWidth = '1200px';
  grid.style.margin = '0 auto';
  
  fetchGalleryList().then(masks => {
    currentGalleryList = masks;
    if (!masks.length) {
      const msg = document.createElement('div');
      msg.className = 'no-masks-message';
      msg.textContent = 'No masks in the gallery yet.';
      msg.style.color = 'white';
      msg.style.textAlign = 'center';
      msg.style.fontSize = '18px';
      msg.style.padding = '40px';
      grid.appendChild(msg);
      return;
    }
    masks.forEach((maskObj, idx) => {
      // Create container for image and delete button
      const container = document.createElement('div');
      container.style.position = 'relative';
      container.style.display = 'inline-block';
      container.style.cursor = 'pointer';
      container.style.marginLeft = '40px'; // Add space between left arrow and image
      
      const img = document.createElement('img');
      img.src = maskObj.imageUrl; // Use the data URL from localStorage
      img.alt = maskObj.name || `Mask ${idx + 1}`;
      img.className = 'gallery-item-image';
      img.style.cursor = 'pointer';
      img.addEventListener('click', () => openGalleryModal(idx));
      img.addEventListener('error', (e) => {
        console.error('Failed to load image:', maskObj.name, e);
      });
      img.addEventListener('load', () => {
        // Image loaded successfully
      });
      
      // Create delete button overlay
      const deleteOverlay = document.createElement('button');
      deleteOverlay.innerHTML = '×';
      deleteOverlay.title = 'Delete Mask';
      deleteOverlay.style.position = 'absolute';
      deleteOverlay.style.top = '5px';
      deleteOverlay.style.right = '5px';
      deleteOverlay.style.width = '24px';
      deleteOverlay.style.height = '24px';
      deleteOverlay.style.background = 'rgba(220, 53, 69, 0.9)';
      deleteOverlay.style.color = 'white';
      deleteOverlay.style.border = 'none';
      deleteOverlay.style.borderRadius = '50%';
      deleteOverlay.style.cursor = 'pointer';
      deleteOverlay.style.fontSize = '16px';
      deleteOverlay.style.fontWeight = 'bold';
      deleteOverlay.style.display = 'none';
      deleteOverlay.style.zIndex = '10';
      
      // Show delete button on hover
      container.addEventListener('mouseenter', () => {
        deleteOverlay.style.display = 'block';
      });
      container.addEventListener('mouseleave', () => {
        deleteOverlay.style.display = 'none';
      });
      
      // Delete functionality
      deleteOverlay.addEventListener('click', async (e) => {
        e.stopPropagation(); // Prevent opening modal
        
        if (!confirm(`Are you sure you want to delete "${maskObj.name}"? This action cannot be undone.`)) {
          return;
        }
        
        try {
          // Remove from localStorage
          const savedGallery = localStorage.getItem('maskGallery');
          const gallery = savedGallery ? JSON.parse(savedGallery) : [];
          const updatedGallery = gallery.filter(mask => mask.id !== maskObj.id);
          localStorage.setItem('maskGallery', JSON.stringify(updatedGallery));
          
          console.log('Mask deleted successfully:', maskObj.name);
          
          // Remove from current list
          currentGalleryList.splice(idx, 1);
          
          // Refresh the gallery grid
          renderGalleryGrid();
          
          // Show success message
          alert('Mask deleted successfully!');
        } catch (error) {
          console.error('Error deleting mask:', error);
          alert('Failed to delete mask. Please try again.');
        }
      });
      
      container.appendChild(img);
      container.appendChild(deleteOverlay);
      grid.appendChild(container);
    });
  }).catch(error => {
    console.error('Error rendering gallery grid:', error);
    const msg = document.createElement('div');
    msg.className = 'no-masks-message';
    msg.textContent = 'Error loading gallery. Please try again.';
    msg.style.color = 'white';
    msg.style.textAlign = 'center';
    msg.style.fontSize = '18px';
    msg.style.padding = '40px';
    grid.appendChild(msg);
  });
}

function openGalleryModal(idx) {
  if (!currentGalleryList.length) return;
  let currentIdx = idx;
  const modal = document.createElement('div');
  modal.className = 'gallery-modal-overlay';
  modal.style.position = 'fixed';
  modal.style.top = 0;
  modal.style.left = 0;
  modal.style.width = '100vw';
  modal.style.height = '100vh';
  modal.style.background = 'rgba(0,0,0,0.85)';
  modal.style.display = 'flex';
  modal.style.alignItems = 'center';
  modal.style.justifyContent = 'center';
  modal.style.zIndex = 2000;

  const content = document.createElement('div');
  content.style.background = '#fff';
  content.style.padding = '2rem';
  content.style.borderRadius = '16px';
  content.style.maxWidth = '90vw';
  content.style.maxHeight = '90vh';
  content.style.textAlign = 'center';
  content.style.position = 'relative';

  const closeBtn = document.createElement('span');
  closeBtn.textContent = '×';
  closeBtn.style.position = 'absolute';
  closeBtn.style.top = '1rem';
  closeBtn.style.right = '1rem';
  closeBtn.style.fontSize = '2rem';
  closeBtn.style.cursor = 'pointer';
  closeBtn.addEventListener('click', () => document.body.removeChild(modal));

  // Arrow buttons (now part of the flex row, not absolutely positioned)
  const leftArrow = document.createElement('span');
  leftArrow.textContent = '←';
  leftArrow.style.fontSize = '2.5rem';
  leftArrow.style.cursor = 'pointer';
  leftArrow.style.userSelect = 'none';
  leftArrow.style.marginRight = '1rem';
  leftArrow.style.alignSelf = 'center';
  leftArrow.addEventListener('click', showPrev);

  const rightArrow = document.createElement('span');
  rightArrow.textContent = '→';
  rightArrow.style.fontSize = '2.5rem';
  rightArrow.style.cursor = 'pointer';
  rightArrow.style.userSelect = 'none';
  rightArrow.style.marginLeft = '1rem';
  rightArrow.style.alignSelf = 'center';
  rightArrow.addEventListener('click', showNext);

  const img = document.createElement('img');
  img.style.maxWidth = '600px';
  img.style.width = '100%';
  img.style.borderRadius = '12px';

  // Download button (moved to the right side of the image)
  const downloadBtn = document.createElement('a');
  downloadBtn.innerHTML = 'Download';
  downloadBtn.style.display = 'inline-block';
  downloadBtn.style.padding = '0.8em 1.5em';
  downloadBtn.style.fontSize = '1.1em';
  downloadBtn.style.background = '#1a1a1a';
  downloadBtn.style.color = '#fff';
  downloadBtn.style.border = 'none';
  downloadBtn.style.borderRadius = '0.5em';
  downloadBtn.style.cursor = 'pointer';
  downloadBtn.style.textDecoration = 'none';
  downloadBtn.style.marginLeft = '1rem';
  downloadBtn.style.alignSelf = 'center';

  // Container for image and download button (row layout)
  const imgCol = document.createElement('div');
  imgCol.style.display = 'flex';
  imgCol.style.flexDirection = 'row';
  imgCol.style.alignItems = 'center';
  imgCol.style.justifyContent = 'center';
  imgCol.style.width = 'fit-content';
  imgCol.style.margin = '0 auto';
  imgCol.appendChild(img);
  // Remove downloadBtn from imgCol if present
  if (downloadBtn.parentNode === imgCol) imgCol.removeChild(downloadBtn);

  // Delete button
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete Mask';
  deleteBtn.style.marginTop = '0.5rem';
  deleteBtn.style.marginLeft = '1rem';
  deleteBtn.style.display = 'inline-block';
  deleteBtn.style.padding = '0.5em 1.2em';
  deleteBtn.style.fontSize = '1.1em';
  deleteBtn.style.background = '#dc3545';
  deleteBtn.style.color = '#fff';
  deleteBtn.style.border = 'none';
  deleteBtn.style.borderRadius = '0.5em';
  deleteBtn.style.cursor = 'pointer';
  deleteBtn.style.fontFamily = 'inherit';
  
  // Add hover effect
  deleteBtn.addEventListener('mouseenter', () => {
    deleteBtn.style.background = '#c82333';
  });
  deleteBtn.addEventListener('mouseleave', () => {
    deleteBtn.style.background = '#dc3545';
  });

  // Metadata display (name and adjectives)
  const metaCol = document.createElement('div');
  metaCol.style.display = 'flex';
  metaCol.style.flexDirection = 'column';
  metaCol.style.justifyContent = 'center'; // vertically center with image
  metaCol.style.alignItems = 'flex-start';
  metaCol.style.marginLeft = '2.5rem';
  metaCol.style.minWidth = '220px';
  metaCol.style.maxWidth = '300px';
  metaCol.style.wordBreak = 'break-word';

  // Name heading
  const nameHeading = document.createElement('div');
  nameHeading.style.fontFamily = 'Space Grotesk, sans-serif';
  nameHeading.style.fontWeight = '700';
  nameHeading.style.fontSize = '1.5rem';
  nameHeading.style.margin = '0 0 1.2rem 0';
  nameHeading.style.letterSpacing = '0.08em';
  nameHeading.style.textTransform = 'uppercase';
  metaCol.appendChild(nameHeading);

  // Words label
  const wordsLabel = document.createElement('div');
  wordsLabel.textContent = 'sometimes can be';
  wordsLabel.style.fontWeight = 'bold';
  wordsLabel.style.fontSize = '1.1rem';
  wordsLabel.style.marginBottom = '0.2rem';
  metaCol.appendChild(wordsLabel);

  // Adjectives list
  const adjectivesDiv = document.createElement('div');
  adjectivesDiv.style.fontFamily = 'Inter, sans-serif';
  adjectivesDiv.style.fontSize = '1.1rem';
  adjectivesDiv.style.color = '#444';
  adjectivesDiv.style.marginBottom = '1.2rem';
  adjectivesDiv.style.textAlign = 'left';
  metaCol.appendChild(adjectivesDiv);

  // Row for arrows, image, and metadata
  const imgMetaRow = document.createElement('div');
  imgMetaRow.style.display = 'flex';
  imgMetaRow.style.flexDirection = 'row';
  imgMetaRow.style.alignItems = 'center'; // vertically center
  imgMetaRow.style.justifyContent = 'center';
  imgMetaRow.appendChild(leftArrow);
  imgMetaRow.appendChild(imgCol);
  imgMetaRow.appendChild(metaCol);
  imgMetaRow.appendChild(rightArrow);

  function updateModal() {
    const maskObj = currentGalleryList[currentIdx];
    console.log('Modal maskObj:', maskObj);
    console.log('Modal maskObj.name:', maskObj.name);
    console.log('Modal maskObj.words:', maskObj.words);
    
    // Use the data URL from localStorage
    img.src = maskObj.imageUrl;
    img.alt = maskObj.name || `Mask ${currentIdx + 1}`;
    
    // Set up download button
    downloadBtn.download = maskObj.filename || 'mask.png';
    downloadBtn.href = maskObj.imageUrl;
    
    // Show name and adjectives
    nameHeading.textContent = maskObj.name || 'MASK';
    adjectivesDiv.textContent = (maskObj.words && maskObj.words.length)
      ? maskObj.words.join(', ')
      : '';
  }

  // Delete functionality
  deleteBtn.addEventListener('click', async () => {
    const maskObj = currentGalleryList[currentIdx];
    if (!maskObj) return;
    
    if (!confirm(`Are you sure you want to delete "${maskObj.name}"? This action cannot be undone.`)) {
      return;
    }
    
    try {
      // Remove from localStorage
      const savedGallery = localStorage.getItem('maskGallery');
      const gallery = savedGallery ? JSON.parse(savedGallery) : [];
      const updatedGallery = gallery.filter(mask => mask.id !== maskObj.id);
      localStorage.setItem('maskGallery', JSON.stringify(updatedGallery));
      
      console.log('Mask deleted successfully:', maskObj.name);
      
      // Remove from current list
      currentGalleryList.splice(currentIdx, 1);
      
      // Close modal and refresh gallery
      document.body.removeChild(modal);
      window.removeEventListener('keydown', handleKey);
      
      // Refresh the gallery grid
      renderGalleryGrid();
      
      // Show success message
      alert('Mask deleted successfully!');
    } catch (error) {
      console.error('Error deleting mask:', error);
      alert('Failed to delete mask. Please try again.');
    }
  });

  function showPrev() {
    currentIdx = (currentIdx - 1 + currentGalleryList.length) % currentGalleryList.length;
    updateModal();
  }
  function showNext() {
    currentIdx = (currentIdx + 1) % currentGalleryList.length;
    updateModal();
  }

  // Keyboard navigation
  function handleKey(e) {
    if (e.key === 'ArrowLeft') {
      showPrev();
    } else if (e.key === 'ArrowRight') {
      showNext();
    } else if (e.key === 'Escape') {
      document.body.removeChild(modal);
      window.removeEventListener('keydown', handleKey);
    }
  }
  window.addEventListener('keydown', handleKey);

  content.appendChild(closeBtn);
  content.appendChild(imgMetaRow); // use the row with arrows, image, and metadata
  // Do NOT create or append buttonRow, downloadBtn, or deleteBtn to metaCol or content
  modal.appendChild(content);

  // Close on click outside content
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
      window.removeEventListener('keydown', handleKey);
    }
  });

  document.body.appendChild(modal);
  updateModal();
}

// --- SAVE TO GALLERY LOGIC ---
async function saveMaskToGallery(canvas, name, adjectives) {
  return new Promise((resolve, reject) => {
    try {
      console.log('Saving mask to localStorage:', name);
      
      canvas.toBlob(blob => {
        try {
          // Convert blob to data URL for storage
          const reader = new FileReader();
          
          reader.onerror = (error) => {
            console.error('FileReader error:', error);
            reject(new Error('Error converting image'));
          };
          
          reader.onload = () => {
            try {
              const imageDataUrl = reader.result;
              console.log('Image converted to data URL, length:', imageDataUrl.length);
              
              // Create mask object
              const maskObj = {
                id: Date.now().toString(),
                name: name || getMaskName(),
                words: adjectives || [],
                filename: getMaskName() + '.png',
                imageUrl: imageDataUrl
              };
              
              console.log('New mask object created:', maskObj);
              
              // Get existing gallery
              const savedGallery = localStorage.getItem('maskGallery');
              const gallery = savedGallery ? JSON.parse(savedGallery) : [];
              
              // Add new mask to gallery
              gallery.unshift(maskObj);
              
              // Save back to localStorage
              localStorage.setItem('maskGallery', JSON.stringify(gallery));
              console.log('Saved to localStorage, gallery count:', gallery.length);
              
              resolve();
            } catch (innerError) {
              console.error('Error in onload handler:', innerError);
              reject(new Error('Error processing image'));
            }
          };
          
          reader.readAsDataURL(blob);
        } catch (error) {
          console.error('Error in blob processing:', error);
          reject(error);
        }
      }, 'image/png');
    } catch (error) {
      console.error('Error in saveMaskToGallery:', error);
      reject(error);
    }
  });
}

// --- LANDING PAGE MODAL/NAV LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    // ... existing code ...
    // Modal logic
    const aboutBtn = document.getElementById('aboutBtn');
    const aboutModal = document.getElementById('aboutModal');
    const closeAbout = document.getElementById('closeAbout');
    const galleryBtn = document.getElementById('galleryBtn');
    const galleryModal = document.getElementById('galleryModal');
    const closeGallery = document.getElementById('closeGallery');
    const newFacetteBtn = document.getElementById('newFacetteBtn');
    const maskApp = document.getElementById('maskApp');
    const landing = document.querySelector('.landing-container');
    let maskAppInitialized = false;
    const galleryOverlay = document.getElementById('galleryOverlay');
    const backToLandingBtn = document.getElementById('backToLandingBtn');

    if (aboutBtn && aboutModal && closeAbout) {
        const aboutStartBtn = document.getElementById('aboutStartBtn');
        const aboutGalleryBtn = document.getElementById('aboutGalleryBtn');

        const openAbout = () => {
            aboutModal.classList.remove('hidden');
            document.body.classList.add('about-open');
            aboutBtn.setAttribute('aria-expanded', 'true');
            closeAbout.focus();
        };

        const closeAboutOverlay = () => {
            aboutModal.classList.add('hidden');
            document.body.classList.remove('about-open');
            aboutBtn.setAttribute('aria-expanded', 'false');
        };

        aboutBtn.setAttribute('aria-expanded', 'false');
        aboutBtn.setAttribute('aria-controls', 'aboutModal');
        aboutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openAbout();
        });
        closeAbout.addEventListener('click', closeAboutOverlay);
        aboutModal.addEventListener('click', (e) => {
            if (e.target === aboutModal) closeAboutOverlay();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !aboutModal.classList.contains('hidden')) {
                closeAboutOverlay();
            }
        });
        if (aboutStartBtn) {
            aboutStartBtn.addEventListener('click', () => {
                closeAboutOverlay();
                newFacetteBtn?.click();
            });
        }
        if (aboutGalleryBtn && galleryBtn) {
            aboutGalleryBtn.addEventListener('click', () => {
                closeAboutOverlay();
                galleryBtn.click();
            });
        }
    }
    if (galleryBtn && galleryOverlay) {
        galleryBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Show gallery overlay
            galleryOverlay.style.display = 'flex';
            
            // Ensure the gallery header and section are visible
            const galleryHeader = document.getElementById('galleryHeader');
            const gallerySection = document.querySelector('.gallery-section');
            if (galleryHeader) galleryHeader.style.display = 'flex';
            if (gallerySection) gallerySection.style.display = 'block';
            
            // Ensure the gallery grid is visible
            const galleryGrid = document.getElementById('galleryGrid');
            if (galleryGrid) {
                galleryGrid.style.display = 'grid';
                galleryGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(120px, 1fr))';
                galleryGrid.style.gap = '16px';
                galleryGrid.style.padding = '20px';
                galleryGrid.style.width = '100%';
                galleryGrid.style.maxWidth = '1200px';
                galleryGrid.style.margin = '0 auto';
            }
            
            // Call render function
            renderGalleryGrid();
            
            // Disable gallery button
            galleryBtn.classList.add('disabled');
        });
    }
    if (newFacetteBtn && maskApp && landing) {
        newFacetteBtn.addEventListener('click', (e) => {
            e.preventDefault();
            startRandomFacette();
        });
    }
    const drawAnotherBtn = document.getElementById('drawAnotherBtn');
    if (drawAnotherBtn) {
        drawAnotherBtn.addEventListener('click', (e) => {
            e.preventDefault();
            startRandomFacette();
        });
    }
    // Back to landing arrow logic
    if (backToLandingBtn && galleryOverlay) {
        backToLandingBtn.addEventListener('click', () => {
            galleryOverlay.style.display = 'none';
            if (galleryBtn) galleryBtn.classList.remove('disabled');
            
            // Clean up any test elements that might have been added
            const testElements = galleryOverlay.querySelectorAll('div[style*="GALLERY OVERLAY IS WORKING"]');
            testElements.forEach(el => el.remove());
            
            // Show facette creation UI if it was visible before
            if (maskApp && !landing.classList.contains('hidden')) maskApp.classList.add('hidden');
        });
    }

    // --- Animated Tile Background ---
    const primaryTileIds = [1, 2, 3, 4, 5, 6, 11]; // More frequent tiles
    const secondaryTileIds = [7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27]; // Less frequent tiles
    const numCols = 5;
    const header = document.querySelector('.landing-header');
    const tileBg = document.getElementById('tileBackground');
    let tileSize = 0;
    let numRows = 0;
    let grid = [];
    let tileSVGs = {}; // Store SVG text

    // Fetch SVGs as text and store
    function preloadTiles(callback) {
        let loaded = 0;
        const allTileIds = [...primaryTileIds, ...secondaryTileIds];
        allTileIds.forEach(id => {
            fetch(`tiles/${id}.svg`)
                .then(res => res.text())
                .then(svgText => {
                    tileSVGs[id] = svgText;
                    loaded++;
                    if (loaded === allTileIds.length) callback();
                });
        });
    }

    // Weighted tile selection function
    function selectRandomTile() {
        // 80% chance for primary tiles, 20% chance for secondary tiles
        if (Math.random() < 0.8) {
            return primaryTileIds[Math.floor(Math.random() * primaryTileIds.length)];
        } else {
            return secondaryTileIds[Math.floor(Math.random() * secondaryTileIds.length)];
        }
    }

    function setupGrid() {
        // Calculate available height below header
        const headerHeight = header ? header.offsetHeight : 0;
        // Set CSS variable for tile background positioning
        document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
        // Use exactly 8 columns for a bolder look
        const numCols = 8;
        tileSize = Math.ceil(window.innerWidth / numCols);
        // Cover the viewport with tiles
        const gridHeight = window.innerHeight;
        numRows = Math.ceil(gridHeight / tileSize);
        grid = [];
        for (let r = 0; r < numRows; r++) {
            for (let c = 0; c < numCols; c++) {
                grid.push({ row: r, col: c });
            }
        }
        // Set grid CSS
        tileBg.style.display = 'grid';
        tileBg.style.gridTemplateColumns = `repeat(${numCols}, ${tileSize}px)`;
        tileBg.style.gridTemplateRows = `repeat(${numRows}, ${tileSize}px)`;
        tileBg.style.gap = '0';
        tileBg.style.margin = '0';
        tileBg.style.padding = '0';
        // Set the height to accommodate all rows
        tileBg.style.height = `${numRows * tileSize}px`;
    }

    function renderGridSingle(color) {
        // Set the background to black for dramatic contrast
        tileBg.style.background = '#000000';
        tileBg.innerHTML = '';
        grid.forEach((cell, i) => {
            const tileId = selectRandomTile();
            let svgText = tileSVGs[tileId];
            // Replace .st0 fill with the current color
            svgText = svgText.replace(/fill:#FFFFFF;/g, `fill:${color};`);
            const div = document.createElement('div');
            div.style.width = `${tileSize}px`;
            div.style.height = `${tileSize}px`;
            div.style.overflow = 'hidden';
            div.style.display = 'flex';
            div.style.alignItems = 'center';
            div.style.justifyContent = 'center';
            // Add random 90-degree rotation and horizontal mirroring
            const rotation = 90 * Math.floor(Math.random() * 4); // 0, 90, 180, or 270 degrees
            const mirror = Math.random() < 0.5 ? 1 : -1; // 50% chance of horizontal flip
            div.style.transform = `rotate(${rotation}deg) scaleX(${mirror})`;
            div.innerHTML = svgText;
            tileBg.appendChild(div);
        });
        console.log(`Rendered ${grid.length} tiles (${numRows} rows x 8 cols) with color: ${color}`);
    }

    const tileColorPalette = Object.values(WORD_COLOR_MAP);
    let animationCycle = 0;
    let currentTileColor = tileColorPalette[Math.floor(Math.random() * tileColorPalette.length)];

    function animateTilesBatch() {
        animationCycle++;
        // Only pick a new color every 3rd cycle (on cycles 3, 6, 9, ...)
        if (animationCycle % 3 === 0) {
            let newColor;
            do {
                newColor = tileColorPalette[Math.floor(Math.random() * tileColorPalette.length)];
            } while (newColor === currentTileColor && tileColorPalette.length > 1);
            currentTileColor = newColor;
        }
        
        // Staggered tile animation
        const totalTiles = grid.length;
        const tilesToAnimate = Math.floor(totalTiles * 0.6); // Animate 60% of tiles
        const indices = [];
        
        // Pick random tiles to animate
        while (indices.length < tilesToAnimate) {
            const idx = Math.floor(Math.random() * totalTiles);
            if (!indices.includes(idx)) indices.push(idx);
        }
        
        // Animate tiles with staggered timing
        indices.forEach((idx, batchIdx) => {
            setTimeout(() => {
                const div = tileBg.children[idx];
                if (!div) return;
                
                // Fade out current tile
                div.classList.add('tile-fade-out');
                
                setTimeout(() => {
                    // Replace with new tile
                    const tileId = selectRandomTile();
                    let svgText = tileSVGs[tileId];
                    svgText = svgText.replace(/fill:#FFFFFF;/g, `fill:${currentTileColor};`);
                    div.innerHTML = svgText;
                    // Add random 90-degree rotation and horizontal mirroring
                    const rotation = 90 * Math.floor(Math.random() * 4); // 0, 90, 180, or 270 degrees
                    const mirror = Math.random() < 0.5 ? 1 : -1; // 50% chance of horizontal flip
                    div.style.transform = `rotate(${rotation}deg) scaleX(${mirror})`;
                    
                    // Fade in new tile
                    div.classList.remove('tile-fade-out');
                    div.classList.add('tile-fade-in');
                    
                    setTimeout(() => {
                        div.classList.remove('tile-fade-in');
                    }, 400);
                }, 400);
            }, batchIdx * 50); // 50ms stagger between tiles
        });
    }

    function startTileAnimation() {
        setupGrid();
        renderGridSingle(currentTileColor);
        setInterval(animateTilesBatch, 6000); // 6s
    }

    if (tileBg) {
        preloadTiles(() => {
            startTileAnimation();
        });
        window.addEventListener('resize', () => {
            setupGrid();
            renderGridSingle(currentTileColor);
        });
    }

    // Add scroll event listener for floating button
    const floatingBtn = document.getElementById('floatingNewFacetteBtn');
    
    function handleScroll() {
        if (!floatingBtn) return;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const headerHeight = header ? header.offsetHeight : 0;
        
        if (scrollTop > headerHeight) {
            // Header is not visible, show floating button
            floatingBtn.classList.remove('hidden');
            setTimeout(() => {
                floatingBtn.classList.add('visible');
            }, 10);
        } else {
            // Header is visible, hide floating button
            floatingBtn.classList.remove('visible');
            setTimeout(() => {
                floatingBtn.classList.add('hidden');
            }, 300);
        }
    }
    
    // Add event listeners
    window.addEventListener('scroll', handleScroll);
    
    // Add click handler for floating button
    if (floatingBtn) {
        floatingBtn.addEventListener('click', (e) => {
            e.preventDefault();
            startRandomFacette();
        });
    }

    // Update the downloadButton event
    const downloadButton = document.getElementById('downloadButton');
    if (downloadButton) {
        downloadButton.addEventListener('click', () => {
            downloadMask();
        });
    }
    const shareButton = document.getElementById('shareButton');
    if (shareButton) {
        shareButton.addEventListener('click', () => {
            try {
                shareFacette();
            } catch (err) {
                console.error('Share failed', err);
            }
        });
    }
    const closeSaveOverlay = document.getElementById('closeSaveOverlay');
    const saveOverlay = document.getElementById('saveImageOverlay');
    if (closeSaveOverlay) closeSaveOverlay.addEventListener('click', hideSaveOverlay);
    if (saveOverlay) {
        saveOverlay.addEventListener('click', (event) => {
            if (event.target === saveOverlay) hideSaveOverlay();
        });
    }

    // Always render the gallery grid strip at the bottom of the facette creation UI
    // (Assume there is a <div id="galleryGridStrip"></div> in the HTML, or add it if missing)
    // Render gallery grid strip at the bottom of facette creation UI
    const galleryGridStrip = document.getElementById('galleryGridStrip');
    if (galleryGridStrip) {
        renderGalleryGrid();
    }

    const backToHomeBtn = document.getElementById('backToHomeBtn');
    if (backToHomeBtn && maskApp && landing) {
        backToHomeBtn.addEventListener('click', () => {
            maskApp.classList.add('hidden');
            landing.classList.remove('hidden');
            
            // Reset gallery overlay state
            if (galleryOverlay) {
                galleryOverlay.style.display = 'none';
                // Clean up any test elements
                const testElements = galleryOverlay.querySelectorAll('div[style*="GALLERY OVERLAY IS WORKING"]');
                testElements.forEach(el => el.remove());
            }
            
            // Re-enable gallery button
            if (galleryBtn) {
                galleryBtn.classList.remove('disabled');
            }
        });
    }
}); 