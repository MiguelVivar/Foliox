import Image from "next/image";
import Link from "next/link";
import { DotGrid } from "@/components/atoms/DotGrid";
import { ThemeToggle } from "@/components/molecules/ThemeToggle";
import logo from "../../public/logo_foliox.png";

const pillars = [
  {
    title: "Zero Gradients",
    body: "Flat Swiss design. No gradients, no blurred shadows, no neon glow — hierarchy comes from contrast and solid 1px borders.",
  },
  {
    title: "Modular Geometry",
    body: "Every element is a rectangular block with strict proportions, reflecting the drag & drop nature of the product.",
  },
  {
    title: "Functional Contrast",
    body: "Native OKLCH color space in Tailwind CSS, tuned for WCAG AAA contrast in light and dark.",
  },
];

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center gap-16 px-6 py-24">
      <DotGrid />
      <ThemeToggle className="absolute top-6 right-6" />
      <div className="flex flex-col items-center gap-6 text-center">
        <Image
          src={logo}
          alt="Foliox"
          width={72}
          height={72}
          priority
          className="rounded-md"
        />
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-semibold text-[var(--text-primary)]">
            Foliox
          </h1>
          <p className="max-w-md font-mono text-sm text-[var(--text-muted)]">
            Notion meets Canva for Developers.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/editor"
            className="rounded-md bg-[var(--bg-brand-cta)] px-4 py-2 text-sm font-medium text-[var(--text-brand-cta)]"
          >
            Open Editor →
          </Link>
          <a
            href="https://github.com"
            className="rounded-md border border-[var(--border-subtle)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]"
          >
            Deploy to GitHub
          </a>
        </div>
      </div>

      <div className="grid w-full max-w-4xl gap-4 sm:grid-cols-3">
        {pillars.map((pillar) => (
          <div
            key={pillar.title}
            className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4"
          >
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">
              {pillar.title}
            </h2>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              {pillar.body}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
