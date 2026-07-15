/// <reference lib="webworker" />

/**
 * figlet.worker.ts — runs figlet off the main thread.
 *
 * Message IN:  { text: string; font: string }
 * Message OUT: { art: string } | { error: string }
 */

import figlet from "figlet";

// Pre-load the fonts we expose in AsciiBannerForm so they're ready
// synchronously when a message arrives.
const FONTS: figlet.Fonts[] = ["Banner", "Block", "Doom", "Slant", "Big"];

// figlet ships font files as separate requires; in a Worker context we call
// loadFontSync which reads the bundled font data that Webpack/Turbopack
// inlines at build time via the require() calls below.
FONTS.forEach((font) => {
  try {
    figlet.parseFont(font, require(`figlet/importable-fonts/${font}.js`));
  } catch {
    // Font not found — will fall back to default in the handler
  }
});

self.addEventListener("message", (event: MessageEvent<{ text: string; font: string }>) => {
  const { text, font } = event.data;

  try {
    const art = figlet.textSync(text, {
      font: (font.charAt(0).toUpperCase() + font.slice(1)) as figlet.Fonts,
      horizontalLayout: "default",
    });
    self.postMessage({ art });
  } catch {
    // Fallback: simple box frame
    const border = `+${"─".repeat(text.length + 4)}+`;
    const middle = `|  ${text}  |`;
    self.postMessage({ art: `${border}\n${middle}\n${border}` });
  }
});
