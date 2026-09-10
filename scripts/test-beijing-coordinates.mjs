import assert from "node:assert/strict";
import { test } from "node:test";
import { toMapCoordinates } from "../app/thoughts/beijing/coordinates.ts";

test("OSM coordinates are not shifted or mutated", () => {
  const osm = [116.3668247, 39.9791686];
  assert.deepEqual(toMapCoordinates(osm, "wgs84"), osm);
  assert.deepEqual(osm, [116.3668247, 39.9791686]);
});

test("Catail's independently published Gaode and Baidu pairs agree after conversion", () => {
  const gcj = toMapCoordinates([116.335018, 39.9892165], "gcj02");
  const bd = toMapCoordinates([116.341653, 39.9948852], "bd09");
  for (let i = 0; i < 2; i++) assert.ok(Math.abs(gcj[i] - bd[i]) < 0.00002);
  // Conversion moves this Beijing point west/south by the expected hundreds of metres.
  assert.ok(gcj[0] > 116.3287 && gcj[0] < 116.3290);
  assert.ok(gcj[1] > 39.9877 && gcj[1] < 39.9881);
  assert.deepEqual(toMapCoordinates(gcj, "wgs84"), gcj);
});

test("unlabelled systems and invalid coordinates fail instead of silently shifting pins", () => {
  assert.throws(() => toMapCoordinates([116, 40], "unknown"));
  assert.throws(() => toMapCoordinates([NaN, 40], "gcj02"));
  assert.throws(() => toMapCoordinates([40, 116], "wgs84"));
});
