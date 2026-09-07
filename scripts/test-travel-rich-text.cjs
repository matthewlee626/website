const assert = require('node:assert/strict');
const { test } = require('node:test');
const { readFileSync } = require('node:fs');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
// Compile the leaf renderer in memory; CSS class names don't affect semantics.
const compiled = ts.transpileModule(readFileSync('components/travel/rich-text.tsx', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
}).outputText;
const renderer = { exports: {} };
new Function('require', 'module', 'exports', compiled)(name => name.endsWith('.css') ? {} : require(name), renderer, renderer.exports);
const render = props => renderToStaticMarkup(React.createElement(renderer.exports.RichText, props));

test('Notion link labels retain bold formatting and bare domains become HTTPS', () => {
  const html = render({ text: '[**Glitch Coffee**](glitchcoffee.com): a flight.' });
  assert.equal(html, '<a href="https://glitchcoffee.com"><strong>Glitch Coffee</strong></a>: a flight.');
});
test('priority underlines and overlapping place names keep the full label', () => {
  const html = render({ text: '<span underline="true">**Tokyo Tower**</span>: Tokyo.', aliases: [{ alias: 'Tokyo', id: '1' }, { alias: 'Tokyo Tower', id: '2' }], select() {}, activeId: '2' });
  assert.match(html, /^<u><strong><button[^>]*data-inline-location="2"[^>]*aria-pressed="true"[^>]*>Tokyo Tower<\/button><\/strong><\/u>:/);
  assert.equal((html.match(/<button/g) || []).length, 2);
});
test('place aliases do not turn substrings or external link labels into nested controls', () => {
  const html = render({ text: 'Tokyobike [**Tokyo**](https://example.com)', aliases: [{ alias: 'Tokyo', id: '1' }], select() {} });
  assert.ok(!html.match(/<a[^>]*>(?:(?!<\/a>).)*<button/));
  assert.equal((html.match(/<button/g) || []).length, 1);
  assert.ok(html.includes('Show Tokyo on map'));
  assert.ok(html.includes('Tokyobike'));
});
test('Beijing keeps translated selectable headings and their separating whitespace', () => {
  const html = render({ text: '**Temple: **Description', onSelect() {}, active: true, transform: text => text.replace('Temple', 'Temple (庙)') });
  assert.match(html, /aria-pressed="true"[^>]*>Temple \(庙\):<\/button> Description$/);
});
test('untrusted markup is escaped and executable link schemes are not rendered', () => {
  const html = render({ text: '<script>alert(1)</script> [bad](javascript:alert)' });
  assert.ok(html.includes('&lt;script&gt;'));
  assert.ok(!html.includes('href='));
});
