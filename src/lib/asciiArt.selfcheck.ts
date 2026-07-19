import assert from "node:assert/strict";
import { luminanceToAscii } from "./asciiArt.ts";

// A 2x1 image: pure black then pure white should map to the darkest and
// lightest characters of the ramp respectively.
const result = luminanceToAscii([0, 255], 2, false);
assert.equal(result.length, 2, "output should have one character per pixel (single row, no newline)");
assert.equal(result[0], "$", "darkest pixel should map to the densest ramp character");
assert.equal(result[1], " ", "lightest pixel should map to the lightest (space) ramp character");

// Low-contrast input (all values clustered near mid-gray) should still span
// multiple ramp characters after contrast stretching, not collapse to one
// or two repeated characters.
const lowContrast = [120, 121, 122, 123, 124, 125, 126, 127, 128, 129];
const stretched = luminanceToAscii(lowContrast, lowContrast.length, false);
const uniqueChars = new Set(stretched);
assert.ok(
  uniqueChars.size > 2,
  `contrast stretch should spread a narrow luminance range across multiple characters, got ${uniqueChars.size} unique char(s)`,
);

// A flat (zero-range) image must not throw or divide by zero.
const flat = luminanceToAscii([100, 100, 100, 100], 4, false);
assert.equal(flat.length, 4, "a flat-luminance image should still produce one character per pixel");

// invert=true should flip which end of the ramp dark/light pixels map to.
const invertedResult = luminanceToAscii([0, 255], 2, true);
assert.equal(invertedResult[0], " ", "with invert, the darkest pixel should map to the lightest ramp character");
assert.equal(invertedResult[1], "$", "with invert, the lightest pixel should map to the densest ramp character");

// Multi-row input should insert a newline at each row boundary, not after
// the very last pixel.
const twoRows = luminanceToAscii([0, 0, 255, 255], 2, false);
assert.equal(twoRows, "$$\n  ", "should join rows with newline and omit a trailing newline");

console.log("asciiArt selfcheck: all assertions passed");
