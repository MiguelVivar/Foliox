/// <reference lib="webworker" />

/**
 * figlet.worker.ts — runs figlet off the main thread.
 *
 * Message IN:  { text: string; font: string }
 * Message OUT: { art: string } | { error: string }
 */

import figlet from "figlet";

// figlet's ambient types declare `Fonts` on a UMD namespace, but the
// published package only ships a default ESM export — a bare namespace or
// named type import of "figlet" doesn't resolve under Turbopack. Extracting
// the type from a real member's signature works with either module system.
type FigletFonts = Parameters<typeof figlet.loadFontSync>[0];

// Pre-load the fonts we expose in AsciiBannerForm so they're ready
// synchronously when a message arrives.
const FONTS: FigletFonts[] = ["Banner", "Block", "Doom", "Slant", "Big"];

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
      font: (font.charAt(0).toUpperCase() + font.slice(1)) as FigletFonts,
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
