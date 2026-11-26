export const LANTERN_CONFIG = Object.freeze({
  height: 20,
  maxRadius: 9.6,
  yScale: 0.9,
  rows: 40,
  cols: 45,
  ratios: Object.freeze({ redBead: 0.55, goldCube: 0.20, miniLantern: 0.17, coin: 0.08 }),
});

export function createSeededRandom(seed = 1) {
  let a = seed >>> 0;
  return function random() {
    a |= 0;
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pickParticleKind(rng = Math.random) {
  const r = rng();
  if (r < 0.55) return 'redBead';
  if (r < 0.75) return 'goldCube';
  if (r < 0.92) return 'miniLantern';
  return 'coin';
}

export function lanternTarget(rng = Math.random, kind = 'redBead', index = 0) {
  const row = Math.floor(index / LANTERN_CONFIG.cols) % LANTERN_CONFIG.rows;
  const col = index % LANTERN_CONFIG.cols;
  const phi = 0.06 * Math.PI + ((row + 0.5) / LANTERN_CONFIG.rows) * 0.88 * Math.PI;
  const theta = (col / LANTERN_CONFIG.cols) * Math.PI * 2 + (rng() - 0.5) * 0.04;
  const radius = LANTERN_CONFIG.maxRadius * (0.975 + rng() * 0.025);
  return {
    x: Math.sin(phi) * Math.cos(theta) * radius,
    y: Math.cos(phi) * radius * LANTERN_CONFIG.yScale,
    z: Math.sin(phi) * Math.sin(theta) * radius,
    row,
    col,
  };
}
