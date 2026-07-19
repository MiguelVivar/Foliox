const DENSITY_RAMP =
  "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\"^`'. ";

const BAYER_MATRIX = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

function ditherOrderedBayer(luminance: number, x: number, y: number): number {
  const threshold = ((BAYER_MATRIX[y % 4][x % 4] + 1) / 17) * 255;
  return luminance > threshold ? luminance + 20 : luminance - 20;
}

export function luminanceToAscii(
  luminances: number[],
  width: number,
  invert: boolean,
  enableDithering = false,
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
    const x = i % width;
    const y = Math.floor(i / width);

    let l = range > 0 ? ((luminances[i] - min) / range) * 255 : luminances[i];

    if (enableDithering) {
      l = ditherOrderedBayer(l, x, y);
    }

    l = Math.max(0, Math.min(255, l));
    if (invert) l = 255 - l;

    const charIndex = Math.round((l / 255) * rampLastIndex);
    out += DENSITY_RAMP[charIndex];

    if ((i + 1) % width === 0 && i !== luminances.length - 1) {
      out += "\n";
    }
  }
  return out;
}
