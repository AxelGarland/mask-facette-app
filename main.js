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
  tooMuch:         "#A633FF",
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
        // Normalize the key to match the mapping (remove spaces, hyphens, lowercase)
        const colorKey = paletteWord.replace(/[-_ ]/g, '').toLowerCase();
        const camelCaseKey = paletteWord.replace(/[-_ ]([a-z])/g, (match, letter) => letter.toUpperCase());
        let colA = WORD_COLOR_MAP[paletteWord] || WORD_COLOR_MAP[colorKey] || WORD_COLOR_MAP[camelCaseKey] || "#4AF2E5";
        let colB = colA; // No duotone, just use the same color
        
        // Debug logging for color mapping
        console.log(`Color mapping debug:`);
        console.log(`  Original word: "${paletteWord}"`);
        console.log(`  Normalized key: "${colorKey}"`);
        console.log(`  CamelCase key: "${camelCaseKey}"`);
        console.log(`  Found color: ${colA}`);
        console.log(`  Direct match: ${WORD_COLOR_MAP[paletteWord] ? 'YES' : 'NO'}`);
        console.log(`  Normalized match: ${WORD_COLOR_MAP[colorKey] ? 'YES' : 'NO'}`);
        console.log(`  CamelCase match: ${WORD_COLOR_MAP[camelCaseKey] ? 'YES' : 'NO'}`);

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

function articleFor(word) {
    return /^[aeiou]/i.test(word) ? 'an' : 'a';
}

function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

function pickOne(items) {
    return items[Math.floor(Math.random() * items.length)];
}

function dominantMood(words) {
    const counts = { pos: 0, neu: 0, neg: 0, cha: 0 };
    words.forEach((word) => {
        if (WORD_CATEGORIES['Positive/Expressive'].includes(word)) counts.pos += 1;
        else if (WORD_CATEGORIES['Neutral/Introspective'].includes(word)) counts.neu += 1;
        else if (WORD_CATEGORIES['Negative/Anxious'].includes(word)) counts.neg += 1;
        else counts.cha += 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}

function composePersonality(words) {
    const w = words.map(displayWord);
    const [a, b, c, d, e, f, g, h, i, j] = w;
    const mood = dominantMood(words);
    const openings = {
        pos: [
            'It comes forward first.',
            'This one is easy to meet and harder to pin down.',
        ],
        neu: [
            'It watches before it speaks.',
            'Quiet at first. Then the rest shows.',
        ],
        neg: [
            'It flinches, then looks back.',
            'This one is already mid-thought.',
        ],
        cha: [
            'It does not wait to be introduced.',
            'This one arrives sideways.',
        ],
    };

    const bodies = [
        `${capitalize(a)} in the eyes, ${b} in the mouth. ${capitalize(c)} at the edges, ${d} underneath. People might call it ${e}; it also answers to ${f} and ${g}.`,
        `A ${a}, ${b} face. ${capitalize(c)} on the surface, ${d} just behind it. The rest is ${e}, ${f}, and a stubborn ${g}.`,
        `${capitalize(a)} first, then ${b}, then ${c}. Under that: ${d}, ${e}, ${f}. The last thing it gives you is ${g}.`,
        `It wears ${articleFor(a)} ${a} look and ${articleFor(b)} ${b} one at the same time. Call it ${c} if you need a label. It also holds ${d}, ${e}, and ${f}.`,
        `${capitalize(a)} and ${b} share the same face. ${capitalize(c)} keeps leaking through. The quieter notes are ${d}, ${e}, and ${f}.`,
    ];

    const closings = [
        `It finishes ${h}, almost ${i}, never quite ${j}.`,
        `Somewhere in there: ${h}, ${i}, and ${j}.`,
        `What stays with you is the ${h}, then the ${i}, then the ${j}.`,
    ];

    return `${pickOne(openings[mood])} ${pickOne(bodies)} ${pickOne(closings)}`;
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
        const downloadButton = document.getElementById('downloadButton');
        if (downloadButton) downloadButton.disabled = false;
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

function downloadMask() {
    const name = getMaskName();
    p5Instance.saveCanvas(name, 'png');
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