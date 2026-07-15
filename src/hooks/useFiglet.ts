"use client";

import { useEffect, useRef, useState } from "react";

type FigletResult = {
  art: string | null;
  loading: boolean;
};

/**
 * useFiglet — renders ASCII art via a Web Worker (off main thread).
 *
 * Returns the rendered art string and a loading flag.
 * A new Worker is spawned once per component mount and terminated on unmount.
 */
export function useFiglet(text: string, font: string): FigletResult {
  const [art, setArt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    // Spawn a new Worker
    const worker = new Worker(
      new URL("../workers/figlet.worker.ts", import.meta.url),
    );
    workerRef.current = worker;

    worker.addEventListener(
      "message",
      (event: MessageEvent<{ art?: string; error?: string }>) => {
        if (event.data.art !== undefined) {
          setArt(event.data.art);
        }
        setLoading(false);
      },
    );

    return () => {
      worker.terminate();
      workerRef.current = null;
    };
  }, []); // single worker per mount

  useEffect(() => {
    if (!workerRef.current || !text.trim()) {
      setArt(null);
      return;
    }
    setLoading(true);
    workerRef.current.postMessage({ text, font });
  }, [text, font]);

  return { art, loading };
}
