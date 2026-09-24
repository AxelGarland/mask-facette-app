// Kindred landing page. Everything here is presentation; the face rules live in
// face-engine.js and the data tables in main.js.

import { TILE_SPRITE, TILE_COUNT } from './tile-sprite.js';
import { startRandomFace } from './main.js';
import {
  CELL_KEYS, CELL_STEP, STEPS, PALETTES, WORD_POOL,
  buildFace, cellSignature, diffCells, displayWord, makeRng, pickWords,
  wordColor, wordSequenceCount,
} from './face-engine.js';
import {
  CONTACT_EMAIL, MOCKUPS, POSTERS, POSTER_FACTS,
} from './posters.js';

document.documentElement.classList.add('js');

const $ = (sel, root = document) => root.querySelector(sel);
const pick = (list) => list[Math.floor(Math.random() * list.length)];
const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const NEUTRAL = '#eceeeb';

const SVGNS = 'http://www.w3.org/2000/svg';
function svgEl(name, attrs = {}) {
  const node = document.createElementNS(SVGNS, name);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  return node;
}

document.body.insertAdjacentHTML('afterbegin', TILE_SPRITE);

/* ------------------------------------------------------------------ */
/* Face rendering                                                      */
/* ------------------------------------------------------------------ */

function cellCenter(key) {
  const row = key.charCodeAt(0) - 65;
  const col = Number(key.slice(1)) - 1;
  return { x: col * 90, y: row * 90, cx: col * 90 + 45, cy: row * 90 + 45 };
}

// Same order of operations as drawTile in main.js: mirror, then turn.
// Tiles are drawn 1.5% oversize so neighbours overlap and no hairline seams
// show between them at fractional pixel sizes.
const BLEED = 1.015;
function tileTransform(c) {
  const { cx, cy } = cellCenter(c.cell);
  return `translate(${cx} ${cy}) scale(${(c.flip ? -1 : 1) * BLEED} ${BLEED}) rotate(${c.rot}) translate(-45 -45)`;
}

function paintCell(g, c) {
  const use = g.firstElementChild;
  use.setAttribute('href', `#t${c.tile}`);
  use.setAttribute('transform', tileTransform(c));
  g.dataset.sig = cellSignature(c);
}

function createFace(face, { slots = false } = {}) {
  const svg = svgEl('svg', {
    viewBox: '0 0 450 450', class: 'face', 'aria-hidden': 'true', focusable: 'false',
  });
  svg.style.color = face.color;
  if (slots) {
    const g = svgEl('g', { class: 'slots' });
    CELL_KEYS.forEach((key) => {
      const { x, y } = cellCenter(key);
      g.append(svgEl('rect', { class: 'slot', x: x + 1, y: y + 1, width: 88, height: 88 }));
    });
    svg.append(g);
  }
  const cells = svgEl('g', { class: 'cells' });
  face.cells.forEach((c) => {
    const g = svgEl('g', {
      class: 'cell', 'data-cell': c.cell, 'data-step': CELL_STEP[c.cell].id, 'data-order': c.order,
    });
    g.append(svgEl('use', { width: 90, height: 90 }));
    paintCell(g, c);
    cells.append(g);
  });
  svg.append(cells);
  const rings = svgEl('g', { class: 'rings' });
  CELL_KEYS.forEach((key) => {
    const { x, y } = cellCenter(key);
    rings.append(svgEl('rect', {
      class: 'ring', 'data-cell': key, x: x + 4, y: y + 4, width: 82, height: 82,
    }));
  });
  svg.append(rings);
  return svg;
}

// Fade each changed cell out, swap its tile, fade it back in.
function updateFace(svg, face, { animate = true, stagger = 45 } = {}) {
  const byCell = new Map(face.cells.map((c) => [c.cell, c]));
  const quick = !animate || reduceMotion();
  svg.querySelectorAll('.cell').forEach((g) => {
    const c = byCell.get(g.dataset.cell);
    if (cellSignature(c) === g.dataset.sig) return;
    if (quick) { paintCell(g, c); return; }
    const out = g.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: 160, delay: (c.order - 1) * stagger, fill: 'forwards',
    });
    out.onfinish = () => {
      paintCell(g, c);
      g.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 260, easing: 'ease-out' });
      out.cancel();
    };
  });
  svg.style.color = face.color;
}

function setRings(svg, keys, dashKeys = []) {
  svg.querySelectorAll('.ring').forEach((r) => {
    const on = keys.includes(r.dataset.cell);
    r.classList.toggle('on', on);
    r.classList.toggle('dash', on && dashKeys.includes(r.dataset.cell));
  });
}

function randomFace(colorWords) {
  const words = pickWords(Math.random, 9);
  const colourWord = colorWords ? pick(colorWords.filter((w) => !words.includes(w))) : pickWords(Math.random, 1, words)[0];
  const all = [...words, colourWord];
  return { words: all, face: buildFace(all, Math.floor(Math.random() * 1e9)) };
}

// Runs a callback while an element is on screen. Timers should not burn
// battery for sections nobody is looking at.
function whileVisible(el, start, stop, threshold = 0.2) {
  let running = false;
  const io = new IntersectionObserver(([entry]) => {
    const on = entry.isIntersecting && !document.hidden;
    if (on && !running) { running = true; start(); }
    if (!on && running) { running = false; stop(); }
  }, { threshold });
  io.observe(el);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && running) { running = false; stop(); }
    else if (!document.hidden) io.takeRecords();
  });
}

/* ------------------------------------------------------------------ */
/* Hero: a crowd that rebuilds itself one face at a time              */
/* ------------------------------------------------------------------ */

function initHero() {
  const host = $('#heroCrowd');
  const family = pick(Object.keys(PALETTES));
  const colorWords = PALETTES[family];
  const crowd = Array.from({ length: 12 }, () => {
    const made = randomFace(colorWords);
    const svg = createFace(made.face);
    host.append(svg);
    return svg;
  });

  let timer = null;
  let last = -1;
  const step = () => {
    let i;
    do { i = Math.floor(Math.random() * crowd.length); } while (i === last);
    last = i;
    updateFace(crowd[i], randomFace(colorWords).face, { stagger: 70 });
  };
  if (reduceMotion()) return;
  whileVisible(host, () => { timer = setInterval(step, 2400); }, () => clearInterval(timer), 0.1);
}

/* ------------------------------------------------------------------ */
/* The grid                                                            */
/* ------------------------------------------------------------------ */

function initRules() {
  const host = $('#specimen');
  const words = ['creative', 'funny', 'kind', 'generous', 'joyful', 'expressive', 'caring', 'confident', 'calm', 'warm'];
  const face = buildFace(words, 11);
  const svg = createFace(face);

  const board = document.createElement('div');
  board.className = 'specimen-board';
  const cols = document.createElement('div');
  cols.className = 'specimen-cols';
  cols.innerHTML = [1, 2, 3, 4, 5].map((n) => `<span>${n}</span>`).join('');
  const rows = document.createElement('div');
  rows.className = 'specimen-rows';
  rows.innerHTML = ['A', 'B', 'C', 'D', 'E'].map((n) => `<span>${n}</span>`).join('');
  const lines = document.createElement('div');
  lines.className = 'specimen-lines';
  const hit = document.createElement('div');
  hit.className = 'specimen-hit';
  CELL_KEYS.forEach((key) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.dataset.cell = key;
    b.textContent = key;
    b.setAttribute('aria-label', `Cell ${key}, ${CELL_STEP[key].label}`);
    hit.append(b);
  });
  board.append(cols, rows, svg, lines, hit);
  host.append(board);
  host.classList.add('is-grid');

  const chipsHost = $('#roleChips');
  const readout = $('#roleReadout');
  const idle = 'Pick a part, or hover a cell.';
  let selected = null;

  const describe = (step) => `${step.label}: ${step.cells.join(', ')}. ${step.rule}`;
  const paint = (stepId) => {
    svg.classList.toggle('is-dimmed', Boolean(stepId));
    svg.querySelectorAll('.cell').forEach((g) => g.classList.toggle('lit', g.dataset.step === stepId));
  };
  const show = (stepId) => {
    paint(stepId);
    const step = STEPS.find((s) => s.id === stepId);
    readout.textContent = step ? describe(step) : idle;
  };

  STEPS.slice(0, 9).forEach((step) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'chip';
    chip.textContent = step.label;
    chip.dataset.step = step.id;
    chip.setAttribute('aria-pressed', 'false');
    chip.addEventListener('click', () => {
      selected = selected === step.id ? null : step.id;
      chipsHost.querySelectorAll('.chip').forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.step === selected)));
      show(selected);
    });
    chip.addEventListener('mouseenter', () => show(step.id));
    chip.addEventListener('mouseleave', () => show(selected));
    chipsHost.append(chip);
  });

  hit.addEventListener('mouseover', (e) => {
    const b = e.target.closest('button');
    if (b) show(CELL_STEP[b.dataset.cell].id);
  });
  hit.addEventListener('mouseleave', () => show(selected));
  hit.addEventListener('focusin', (e) => {
    const b = e.target.closest('button');
    if (b) show(CELL_STEP[b.dataset.cell].id);
  });
  hit.addEventListener('focusout', () => show(selected));
  hit.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    const id = CELL_STEP[b.dataset.cell].id;
    chipsHost.querySelector(`[data-step="${id}"]`).click();
  });

  $('#gridToggle').addEventListener('change', (e) => host.classList.toggle('is-grid', e.target.checked));
}

/* ------------------------------------------------------------------ */
/* Tile library                                                        */
/* ------------------------------------------------------------------ */

const TINTS = ['#ff5b2e', '#ffd700', '#8fd14f', '#17b978', '#00bfff', '#0053a0', '#7851ff', '#da2787', '#f02e65', '#ff9b45', '#20b2aa', '#eceeeb'];

function initTiles() {
  const sheet = $('#tileSheet');
  const tintRow = $('#tintRow');
  const turns = new Array(TILE_COUNT + 1).fill(0);

  for (let n = 1; n <= TILE_COUNT; n++) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'tile-btn';
    b.setAttribute('aria-label', `Tile ${n}. Press to turn it.`);
    b.innerHTML = `<svg viewBox="0 0 90 90" aria-hidden="true"><use href="#t${n}" width="90" height="90"></use></svg><span class="num">${n}</span>`;
    const svg = b.firstElementChild;
    b.addEventListener('click', () => {
      turns[n] += 1;
      const flip = Math.floor(turns[n] / 4) % 2 ? -1 : 1;
      svg.style.transform = `scaleX(${flip}) rotate(${turns[n] * 90}deg)`;
    });
    sheet.append(b);
  }

  const setTint = (hex) => {
    sheet.style.setProperty('--sheet-color', hex);
    tintRow.querySelectorAll('.swatch').forEach((s) => s.setAttribute('aria-pressed', String(s.dataset.hex === hex)));
  };
  TINTS.forEach((hex) => {
    const s = document.createElement('button');
    s.type = 'button';
    s.className = 'swatch';
    s.style.setProperty('--sw', hex);
    s.dataset.hex = hex;
    s.setAttribute('aria-label', `Tint ${hex}`);
    s.setAttribute('aria-pressed', 'false');
    s.addEventListener('click', () => setTint(hex));
    tintRow.append(s);
  });
  setTint(TINTS[0]);
}

/* ------------------------------------------------------------------ */
/* Symmetry, step by step                                              */
/* ------------------------------------------------------------------ */

function initSymmetry() {
  const words = ['confident', 'kind', 'funny', 'creative', 'generous', 'expressive', 'joyful', 'caring', 'curious', 'charismatic'];
  const face = buildFace(words, 5);
  const stage = $('#symStage');
  const svg = createFace(face, { slots: true });
  const axis = svgEl('line', { class: 'axis', x1: 225, y1: 0, x2: 225, y2: 450 });
  svg.append(axis);
  stage.append(svg);

  const card = $('#stepCard');
  const rail = $('#stepRail');
  const playBtn = $('#stepPlay');
  let step = 0;
  let timer = null;

  STEPS.forEach((s, i) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'chip';
    chip.textContent = s.label;
    chip.addEventListener('click', () => { stop(); go(i); });
    rail.append(chip);
  });

  function go(next) {
    step = Math.max(0, Math.min(STEPS.length - 1, next));
    render();
  }

  function render() {
    const s = STEPS[step];
    const placedOrder = step + 1;
    svg.querySelectorAll('.cell').forEach((g) => {
      const order = Number(g.dataset.order);
      const wasHidden = g.classList.contains('pending');
      const hidden = order > placedOrder;
      g.classList.toggle('pending', hidden);
      g.style.opacity = hidden ? 0 : 1;
      if (!hidden && wasHidden && !reduceMotion()) {
        g.animate([{ opacity: 0, transform: 'scale(0.6)' }, { opacity: 1, transform: 'scale(1)' }], {
          duration: 380, easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        });
      }
    });
    svg.style.color = step === STEPS.length - 1 ? face.color : NEUTRAL;
    const active = s.cells;
    const dashed = face.cells.filter((c) => /^(mirror|copy)/.test(c.note)).map((c) => c.cell);
    setRings(svg, active, dashed);

    const word = displayWord(words[step]);
    const verb = s.order === 10 ? 'chooses the colour' : 'chooses the tiles here';
    card.innerHTML = `<h3>${s.label}</h3>
      <p class="word">Word ${s.order}: <b>${word}</b> ${verb}.</p>
      <p class="rule">${s.rule}</p>
      <ul class="moves">${s.moves.map((m) => `<li>${m}</li>`).join('')}</ul>`;

    rail.querySelectorAll('.chip').forEach((chip, i) => {
      if (i === step) chip.setAttribute('aria-current', 'step'); else chip.removeAttribute('aria-current');
      chip.classList.toggle('done', i < step);
    });
    $('#stepBack').disabled = step === 0;
    $('#stepNext').disabled = step === STEPS.length - 1;
    if (!timer) playBtn.textContent = step === STEPS.length - 1 ? 'Replay' : 'Play';
  }

  function stop() {
    if (timer) { clearInterval(timer); timer = null; }
    playBtn.textContent = step === STEPS.length - 1 ? 'Replay' : 'Play';
  }

  function play() {
    if (step === STEPS.length - 1) go(0);
    playBtn.textContent = 'Pause';
    timer = setInterval(() => {
      if (step >= STEPS.length - 1) { stop(); return; }
      go(step + 1);
    }, 2200);
  }

  $('#stepBack').addEventListener('click', () => { stop(); go(step - 1); });
  $('#stepNext').addEventListener('click', () => { stop(); go(step + 1); });
  playBtn.addEventListener('click', () => (timer ? stop() : play()));

  render();

  // Play through once the first time the stage is on screen.
  if (!reduceMotion()) {
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      if (step === 0 && !timer) setTimeout(() => { if (step === 0 && !timer) play(); }, 600);
    }, { threshold: 0.6 });
    io.observe(stage);
  }
}

/* ------------------------------------------------------------------ */
/* One word apart                                                      */
/* ------------------------------------------------------------------ */

function initDna() {
  const parentHost = $('#dnaParent');
  const childHost = $('#dnaChild');
  const wordsHost = $('#dnaWords');
  const readout = $('#dnaReadout');
  let seed;
  let parentWords;
  let parentFace;
  let parentSvg;
  let childSvg;

  function newParent() {
    seed = Math.floor(Math.random() * 1e9);
    parentWords = pickWords(Math.random, 10);
    parentFace = buildFace(parentWords, seed);
    if (!parentSvg) {
      parentSvg = createFace(parentFace);
      parentHost.append(parentSvg);
      childSvg = createFace(parentFace);
      childHost.append(childSvg);
    } else {
      updateFace(parentSvg, parentFace);
      updateFace(childSvg, parentFace);
    }
    renderChips();
    swap(pick([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]));
  }

  function renderChips() {
    wordsHost.innerHTML = '';
    parentWords.forEach((w, i) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'chip';
      chip.dataset.index = i;
      chip.textContent = displayWord(w);
      chip.setAttribute('aria-label', `Swap word ${i + 1}, ${displayWord(w)}`);
      chip.addEventListener('click', () => swap(i));
      wordsHost.append(chip);
    });
  }

  function swap(index) {
    let child;
    let moved = [];
    let replacement;
    for (let tries = 0; tries < 30; tries++) {
      replacement = pick(WORD_POOL.filter((w) => !parentWords.includes(w)));
      const words = parentWords.slice();
      words[index] = replacement;
      child = buildFace(words, seed);
      moved = diffCells(parentFace, child);
      if (index === 9 || moved.length > 0) break;
    }
    wordsHost.querySelectorAll('.chip').forEach((c) => {
      const swapped = Number(c.dataset.index) === index;
      c.classList.toggle('swapped', swapped);
      c.textContent = swapped ? displayWord(replacement) : displayWord(parentWords[c.dataset.index]);
    });
    updateFace(childSvg, child);
    setRings(parentSvg, moved);
    setRings(childSvg, moved);
    const part = STEPS[index].label.toLowerCase();
    const was = displayWord(parentWords[index]);
    readout.textContent = index === 9
      ? `Word 10 changed from ${was} to ${displayWord(replacement)}. Same tiles, new colour.`
      : `Word ${index + 1} (${part}) changed from ${was} to ${displayWord(replacement)}. ${moved.length} of 25 tiles moved.`;
  }

  $('#dnaShuffle').addEventListener('click', newParent);
  newParent();
}

/* ------------------------------------------------------------------ */
/* The roll                                                            */
/* ------------------------------------------------------------------ */

function initRoll() {
  const faceHost = $('#rollFace');
  const wordsHost = $('#rollWords');
  const line = $('#rollLine');
  const btn = $('#rollBtn');
  const countEl = $('#rollCount');
  let svg = null;
  let rolling = false;
  let rolled = 0;
  let timers = [];

  const total = wordSequenceCount().toLocaleString('en-US');
  const setCount = () => {
    countEl.textContent = `Faces rolled here: ${rolled}. ${WORD_POOL.length} words, ten in a row, make ${total} possible word sequences before a single tile is turned.`;
  };

  function roll({ silent = false } = {}) {
    if (rolling) return;
    rolling = true;
    btn.disabled = true;

    if (svg && !silent) {
      const copy = svg.cloneNode(true);
      copy.classList.add('enter');
      copy.querySelectorAll('.cell').forEach((g) => { g.classList.remove('pending'); g.style.opacity = ''; });
      line.prepend(copy);
      while (line.children.length > 24) line.lastElementChild.remove();
    }

    const words = pickWords(Math.random, 10);
    const face = buildFace(words, Math.floor(Math.random() * 1e9));
    if (!svg) {
      svg = createFace(face);
      faceHost.append(svg);
    } else {
      updateFace(svg, face, { animate: false });
    }
    wordsHost.innerHTML = words.map((w, i) => `<li class="${i === 9 ? 'colour' : ''}">${displayWord(w)}</li>`).join('');
    wordsHost.style.setProperty('--face-color', face.color);
    const chips = [...wordsHost.children];
    const cells = [...svg.querySelectorAll('.cell')];

    const finish = () => {
      svg.style.color = face.color;
      chips.forEach((c) => c.classList.add('in'));
      cells.forEach((g) => { g.classList.remove('pending'); g.style.opacity = ''; });
      rolling = false;
      btn.disabled = false;
      if (!silent) { rolled += 1; }
      setCount();
    };

    timers.forEach(clearTimeout);
    timers = [];
    if (silent || reduceMotion()) { finish(); return; }

    svg.style.color = NEUTRAL;
    cells.forEach((g) => { g.classList.add('pending'); g.style.opacity = 0; });
    for (let order = 1; order <= 9; order++) {
      timers.push(setTimeout(() => {
        cells.filter((g) => Number(g.dataset.order) === order).forEach((g) => {
          g.classList.remove('pending');
          g.style.opacity = 1;
        });
        chips[order - 1].classList.add('in');
      }, order * 150));
    }
    timers.push(setTimeout(() => chips[9].classList.add('in'), 10 * 150));
    timers.push(setTimeout(finish, 10 * 150 + 350));
  }

  btn.addEventListener('click', () => roll());
  roll({ silent: true });
  // Start with a few relatives already in line so the strip never looks empty.
  const seedColors = PALETTES[pick(Object.keys(PALETTES))];
  for (let i = 0; i < 6; i++) line.append(createFace(randomFace(seedColors).face));
}

/* ------------------------------------------------------------------ */
/* Posters                                                             */
/* ------------------------------------------------------------------ */

function initPosters() {
  const tabsHost = $('#viewTabs');
  const stage = $('#viewStage');
  const shelf = $('#shelf');
  const nameEl = $('#posterName');
  const specs = $('#posterSpecs');
  const select = $('#fPoster');

  const views = [
    { id: 'wall', label: 'Wall' },
    ...MOCKUPS.map((m) => ({ id: m.id, label: m.label, mockup: m })),
  ];
  let poster = 0;
  let view = 'wall';

  specs.innerHTML = POSTER_FACTS.map((f) => {
    const ph = f.value.startsWith('[');
    return `<div><dt>${f.label}</dt><dd class="${ph ? 'ph' : ''}">${f.value}</dd></div>`;
  }).join('');

  POSTERS.forEach((p, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', p.name);
    b.setAttribute('aria-pressed', 'false');
    b.innerHTML = `<img src="${p.src}" width="${p.width}" height="${p.height}" alt="" loading="lazy" decoding="async">`;
    b.addEventListener('click', () => choose(i));
    shelf.append(b);
    select.add(new Option(p.name, p.id));
  });
  select.add(new Option('Not sure yet', ''));

  tabsHost.hidden = views.length < 2;
  views.forEach((v) => {
    const t = document.createElement('button');
    t.type = 'button';
    t.setAttribute('role', 'tab');
    t.dataset.view = v.id;
    t.textContent = v.label;
    t.addEventListener('click', () => { view = v.id; render(); });
    tabsHost.append(t);
  });

  const preview = $('#inquirePreview');
  function syncPreview() {
    const p = POSTERS[poster];
    preview.querySelector('img').src = p.src;
    preview.querySelector('img').alt = `${p.name}, the poster you are asking about`;
    preview.querySelector('figcaption').textContent = p.name;
  }

  function choose(i) {
    poster = i;
    select.value = POSTERS[i].id;
    render();
  }

  function render() {
    const p = POSTERS[poster];
    syncPreview();
    nameEl.textContent = p.name;
    shelf.querySelectorAll('button').forEach((b, i) => b.setAttribute('aria-pressed', String(i === poster)));
    tabsHost.querySelectorAll('button').forEach((t) => t.setAttribute('aria-selected', String(t.dataset.view === view)));
    stage.innerHTML = '';

    if (view === 'wall') {
      stage.innerHTML = `<div class="wall"><div class="frame"><img src="${p.src}" width="${p.width}" height="${p.height}" alt="${p.name}, framed on a wall"></div></div>`;
    } else {
      const m = MOCKUPS.find((x) => x.id === view);
      const s = m.slot;
      stage.innerHTML = `<div class="mock"><img class="scene" src="${m.src}" width="${m.width}" height="${m.height}" alt="${m.label} mockup">
        <img class="poster" src="${p.src}" alt="${p.name}" style="left:${s.left}%;top:${s.top}%;width:${s.width}%;transform:rotate(${s.rotate || 0}deg);${m.blend ? 'mix-blend-mode:multiply;' : ''}"></div>`;
    }
  }

  select.addEventListener('change', () => {
    const i = POSTERS.findIndex((p) => p.id === select.value);
    if (i >= 0) { poster = i; render(); }
    preview.hidden = i < 0;
  });
  $('#posterInquire').addEventListener('click', () => { select.value = POSTERS[poster].id; });

  choose(0);
}

/* ------------------------------------------------------------------ */
/* Inquiry                                                             */
/* ------------------------------------------------------------------ */

function initInquiry() {
  const form = $('#inquiryForm');
  const sent = $('#inquirySent');
  const nameIn = $('#fName');
  const emailIn = $('#fEmail');
  let message = '';

  const flag = (input, errEl, bad) => {
    errEl.hidden = !bad;
    input.setAttribute('aria-invalid', String(bad));
    if (bad) input.setAttribute('aria-describedby', errEl.id); else input.removeAttribute('aria-describedby');
    return bad;
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const badName = flag(nameIn, $('#fNameErr'), !nameIn.value.trim());
    const badEmail = flag(emailIn, $('#fEmailErr'), !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailIn.value.trim()));
    if (badName || badEmail) { (badName ? nameIn : emailIn).focus(); return; }

    const posterLabel = $('#fPoster').selectedOptions[0].textContent;
    const note = $('#fNote').value.trim();
    const subject = `Poster inquiry: ${posterLabel}`;
    const body = [
      'Hello,',
      '',
      posterLabel === 'Not sure yet'
        ? 'I would like to ask about your posters.'
        : `I would like to ask about ${posterLabel}.`,
      note ? `\n${note}` : '',
      '',
      `${nameIn.value.trim()}`,
      emailIn.value.trim(),
    ].filter((l, i, a) => !(l === '' && a[i - 1] === '')).join('\n');

    message = `Subject: ${subject}\n\n${body}`;
    $('#sentAddress').textContent = CONTACT_EMAIL;
    $('#sentBody').textContent = message;
    sent.hidden = false;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });

  $('#copyInquiry').addEventListener('click', async (e) => {
    const b = e.currentTarget;
    try {
      await navigator.clipboard.writeText(message);
      b.textContent = 'Copied';
    } catch {
      const range = document.createRange();
      range.selectNodeContents($('#sentBody'));
      const sel = getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      b.textContent = 'Press copy on your keyboard';
    }
    setTimeout(() => { b.textContent = 'Copy message'; }, 2200);
  });
}

/* ------------------------------------------------------------------ */
/* Footer, reveal, wiring                                              */
/* ------------------------------------------------------------------ */

function initFooter() {
  const host = $('#footFaces');
  const colorWords = PALETTES[pick(Object.keys(PALETTES))];
  for (let i = 0; i < 8; i++) host.append(createFace(randomFace(colorWords).face));
}

function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || reduceMotion()) {
    items.forEach((el) => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  items.forEach((el) => io.observe(el));
}

function initWiring() {
  document.querySelectorAll('[data-make]').forEach((b) => b.addEventListener('click', startRandomFace));

  // The Create flow hides the landing page. Come back to the same spot. The
  // position is read on click, before the page collapses and scrollY resets.
  const site = $('#kindred');
  let saved = 0;
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-make], #tryItBtn')) saved = window.scrollY;
  }, true);
  let wasHidden = false;
  new MutationObserver(() => {
    const hidden = site.classList.contains('hidden');
    if (!hidden && wasHidden) requestAnimationFrame(() => window.scrollTo(0, saved));
    wasHidden = hidden;
  }).observe(site, { attributes: true, attributeFilter: ['class'] });
}

initHero();
initRules();
initTiles();
initSymmetry();
initDna();
initRoll();
initPosters();
initInquiry();
initFooter();
initReveal();
initWiring();
