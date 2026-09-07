const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');

require.extensions['.ts'] = (module, filename) => {
  const result = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
  });
  module._compile(result.outputText, filename);
};

const dimensions = Object.values(require('../app/library/dimensions.ts').default);
const { shelfOffsets, centralShelfOffsets, distanceAt, popOutProgress, visibleBookRange } = require('../app/library/prototype/geometry.ts');
const byWidth = [...dimensions].sort((a, b) => a.widthMm - b.widthMm);
const alternating = byWidth.flatMap((book, index) => index < Math.ceil(byWidth.length / 2)
  ? [book, byWidth[byWidth.length - 1 - index]] : []);

for (const books of [dimensions, [...dimensions].reverse(), alternating]) {
  const base = shelfOffsets(books.map(book => book.thicknessMm));
  const extents = books.map(book => book.widthMm / 2 + book.thicknessMm + book.heightMm * 0.06);
  const layout = position => {
    const slots = centralShelfOffsets(base, extents, position);
    const focus = distanceAt(position, base);
    return slots.map(slot => slot - focus);
  };
  for (let position = 0; position <= books.length - 1; position += 0.125) {
    const x = layout(position);
    for (let index = 1; index < books.length; index++) {
      assert.ok(x[index] > x[index - 1], 'Books must never exchange slots');
      if (popOutProgress(index, position) === 1 || popOutProgress(index - 1, position) === 1) {
        assert.ok(x[index] - x[index - 1] >= extents[index] + extents[index - 1] + 15.999,
          'The center cover must have its own full-width space');
      }
      if (Math.abs(index - position) >= 1 && Math.abs(index - 1 - position) >= 1) {
        assert.ok(Math.abs((x[index] - x[index - 1]) - (base[index] - base[index - 1])) < 1e-8,
          'Distant books retain their original physical slot spacing');
      }
    }
    if (position < books.length - 1) {
      const next = layout(position + 0.00001);
      assert.ok(x.every((value, index) => Math.abs(value - next[index]) < 0.1),
        'No position discontinuities at centers or between books');
      const railChange = distanceAt(position + 0.00001, base) - distanceAt(position, base);
      x.forEach((value, index) => {
        if (Math.abs(index - position) > 1.01) {
          assert.ok(Math.abs(next[index] - value + railChange) < 1e-8,
            'Outer groups move only with the rail, without breathing or recentering');
        }
      });
    }
    for (const [width, scale] of [[390, 0.75], [1200, 1], [2560, 1]]) {
      const range = visibleBookRange(base, position, width, scale, Math.max(...extents));
      x.forEach((value, index) => {
        if (Math.abs(value) <= width / (2 * scale) + extents[index]) {
          assert.ok(index >= range.start && index < range.end, 'Visible covers must remain mounted');
        }
      });
    }
  }
}

const source = fs.readFileSync('app/library/prototype/shelf.tsx', 'utf8');
assert.ok(source.includes('zIndex: books.length - index'), 'Layer order must stay stable');
console.log('PASS: slot order, moving-cover clearance, continuous return, physical spacing, and virtualization across three book orders and viewport sizes.');

const { advanceMotion } = require('../app/library/prototype/motion.ts');
for (const fps of [30, 60, 120]) {
  const state = { value: 0, target: 120, velocity: 0 };
  const dt = 1000 / fps;
  for (let frame = 0; frame < fps * 3; frame++) {
    if (frame === fps / 2) state.target = -80;
    if (frame === fps) state.target = 180;
    const previousVelocity = state.velocity;
    advanceMotion(state, dt);
    assert.ok(Number.isFinite(state.value));
    assert.ok(Math.abs(state.velocity) <= 600, 'Fast input must respect speed limit');
    assert.ok(Math.abs(state.velocity - previousVelocity) <= 3200 * dt / 1000 + 0.1,
      'Changing targets cannot jump velocity');
  }
  for (let frame = 0; frame < fps * 5; frame++) advanceMotion(state, dt);
  assert.equal(state.value, 180, 'Motion must settle exactly without endless drift');
  assert.equal(state.velocity, 0);
}
console.log('PASS: bounded acceleration, rapid reversal, speed limit, and settling at 30/60/120 fps.');
