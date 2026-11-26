import test from 'node:test';
import assert from 'node:assert/strict';
import { LANTERN_CONFIG, createSeededRandom, pickParticleKind, lanternTarget } from '../js/lantern.js';

test('particle kinds follow the 55/20/17/8 distribution', () => {
  const rng = createSeededRandom(42);
  const counts = { redBead: 0, goldCube: 0, miniLantern: 0, coin: 0 };
  for (let i = 0; i < 20000; i++) counts[pickParticleKind(rng)]++;
  const n = 20000;
  assert.ok(Math.abs(counts.redBead / n - 0.55) < 0.02);
  assert.ok(Math.abs(counts.goldCube / n - 0.20) < 0.02);
  assert.ok(Math.abs(counts.miniLantern / n - 0.17) < 0.02);
  assert.ok(Math.abs(counts.coin / n - 0.08) < 0.02);
});

test('all body targets sit on the oblate shell', () => {
  const rng = createSeededRandom(7);
  for (let i = 0; i < 1800; i++) {
    const p = lanternTarget(rng, 'redBead', i);
    const r = Math.hypot(Math.hypot(p.x, p.z), p.y / LANTERN_CONFIG.yScale);
    assert.ok(r <= LANTERN_CONFIG.maxRadius + 1e-9);
    assert.ok(r >= LANTERN_CONFIG.maxRadius * 0.94);
    assert.ok(Math.abs(p.y) <= LANTERN_CONFIG.maxRadius * LANTERN_CONFIG.yScale);
  }
});

test('targets fill a unique 40x45 grid', () => {
  const cells = new Set();
  let maxRow = -1;
  let maxCol = -1;
  let minY = Infinity;
  let maxY = -Infinity;
  for (let i = 0; i < LANTERN_CONFIG.rows * LANTERN_CONFIG.cols; i++) {
    const p = lanternTarget(createSeededRandom(i + 1), 'redBead', i);
    cells.add(`${p.row}-${p.col}`);
    maxRow = Math.max(maxRow, p.row);
    maxCol = Math.max(maxCol, p.col);
    minY = Math.min(minY, p.y);
    maxY = Math.max(maxY, p.y);
  }
  assert.equal(cells.size, LANTERN_CONFIG.rows * LANTERN_CONFIG.cols);
  assert.equal(maxRow, LANTERN_CONFIG.rows - 1);
  assert.equal(maxCol, LANTERN_CONFIG.cols - 1);
  assert.ok(minY < -7 && maxY > 7);
});

test('the bead rows span the visible body height', () => {
  let minY = Infinity;
  let maxY = -Infinity;
  for (let i = 0; i < 1800; i++) {
    const p = lanternTarget(createSeededRandom(i + 1), 'redBead', i);
    minY = Math.min(minY, p.y);
    maxY = Math.max(maxY, p.y);
  }
  assert.ok(maxY > 8 && maxY < 8.6);
  assert.ok(minY < -8 && minY > -8.6);
});

test('particle kind does not change the grid position', () => {
  const a = lanternTarget(createSeededRandom(9), 'redBead', 123);
  const b = lanternTarget(createSeededRandom(9), 'goldCube', 123);
  assert.equal(a.x, b.x);
  assert.equal(a.y, b.y);
  assert.equal(a.z, b.z);
  assert.equal(a.row, b.row);
  assert.equal(a.col, b.col);
});

test('seeded random is deterministic', () => {
  const a = createSeededRandom(123);
  const b = createSeededRandom(123);
  for (let i = 0; i < 10; i++) assert.equal(a(), b());
});
