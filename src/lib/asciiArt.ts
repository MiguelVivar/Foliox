// Perceptually-ordered density ramp (darkest to lightest) — the classic
// 70-character ramp popularized by Paul Bourke, giving far more brightness
// granularity than a short hand-picked charset.
const DENSITY_RAMP =
  "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\"^`'. ";

/**
 * Converts a flat array of per-pixel luminance values (0-255, row-major,
 * `width` columns per row) into an ASCII-art string. Applies a contrast
 * stretch (normalizing the sampled luminance range to span the full 0-255
 * range) so low-contrast source images don't collapse onto a handful of
 * repeated characters.
 */
export function luminanceToAscii(
  luminances: number[],
  width: number,
  invert: boolean,
): string {
  if (luminances.length === 0 || width <= 0) return "";

  let min = Infinity;
  let max = -Infinity;
  for (const l of luminances) {
    if (l < min) min = l;
    if (l > max) max = l;
  }
  const range = max - min;
  const rampLastIndex = DENSITY_RAMP.length - 1;

  let out = "";
  for (let i = 0; i < luminances.length; i++) {
    // Falls back to the raw value when the image is a flat single color
    // (range === 0), since stretching would divide by zero.
    let l = range > 0 ? ((luminances[i] - min) / range) * 255 : luminances[i];
    if (invert) l = 255 - l;

    const charIndex = Math.round((l / 255) * rampLastIndex);
    out += DENSITY_RAMP[charIndex];

    if ((i + 1) % width === 0 && i !== luminances.length - 1) {
      out += "\n";
    }
  }
  return out;
}
