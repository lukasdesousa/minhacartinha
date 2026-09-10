"use client";

import { useEffect, useRef, useState } from "react";
import type { PublicLoveWheelOption } from "@/lib/letters/contracts";
import { WheelVisual, wheelColor } from "@/components/letter/wheel-visual";

export function LoveWheel({ slug, title, options, demo = false }: { slug: string; title: string; options: PublicLoveWheelOption[]; demo?: boolean }) {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<PublicLoveWheelOption | null>(null);
  const [error, setError] = useState("");
  const [reducedMotion, setReducedMotion] = useState(false);
  const spinningRef = useRef(false);

  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setReducedMotion(media.matches);
    change();
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);

  async function spin() {
    if (spinningRef.current) return;
    spinningRef.current = true;
    setSpinning(true);
    setResult(null);
    setError("");
    try {
      if (demo) {
        const randomValue = crypto.getRandomValues(new Uint32Array(1))[0];
        const index = randomValue % options.length;
        const option = options[index];
        const center = (index + 0.5) * 360 / options.length;
        const base = Math.ceil(rotation / 360) * 360;
        setRotation(reducedMotion ? base - center : base + 5 * 360 - center);
        window.setTimeout(() => {
          setResult(option);
          setSpinning(false);
          spinningRef.current = false;
        }, reducedMotion ? 100 : 4_600);
        return;
      }
      const response = await fetch(`/api/letters/${encodeURIComponent(slug)}/wheel/spin`, { method: "POST", cache: "no-store" });
      const data = await response.json() as { option?: PublicLoveWheelOption; index?: number; error?: string };
      if (!response.ok || !data.option || typeof data.index !== "number") throw new Error(data.error || "Não foi possível girar a roleta.");
      const center = (data.index + 0.5) * 360 / options.length;
      const base = Math.ceil(rotation / 360) * 360;
      setRotation(reducedMotion ? base - center : base + 5 * 360 - center);
      window.setTimeout(() => {
        setResult(data.option!);
        setSpinning(false);
        spinningRef.current = false;
      }, reducedMotion ? 100 : 4_600);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Não foi possível girar a roleta.");
      setSpinning(false);
      spinningRef.current = false;
    }
  }

  return (
    <section className="overflow-hidden bg-[linear-gradient(180deg,var(--letter-paper),color-mix(in_srgb,var(--letter-wash)_55%,white))] px-5 py-20 sm:px-8 sm:py-24" aria-labelledby="love-wheel-title">
      <div className="mx-auto max-w-5xl text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--letter-muted)]">Uma surpresa do acaso</p>
        <h2 id="love-wheel-title" className="mt-3 font-serif text-4xl font-semibold text-[var(--letter-dark)] sm:text-5xl">{title}</h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#7d5c67]">Cada opção tem a mesma chance. Toque para descobrir o próximo momento de vocês.</p>
      </div>
      <div className="mx-auto mt-12 grid max-w-5xl items-center gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(320px,1.05fr)] lg:gap-14">
        <div className="rounded-[2.5rem] border border-white/75 bg-white/45 px-4 py-10 shadow-[0_22px_60px_rgba(68,27,42,.08)] sm:px-8">
          <WheelVisual options={options} rotation={rotation} spinning={spinning} reducedMotion={reducedMotion} />
          <button type="button" disabled={spinning} onClick={() => void spin()} className="mx-auto mt-9 flex min-h-12 items-center justify-center rounded-full bg-[var(--letter-accent)] px-9 text-sm font-bold text-white shadow-[0_12px_28px_rgba(86,32,50,.22)] transition hover:-translate-y-0.5 hover:brightness-90 disabled:cursor-wait disabled:opacity-60">{spinning ? "Girando..." : "Girar a roleta"}</button>
        </div>

        <div className="rounded-[2rem] border border-[#e8dce0] bg-white/75 p-6 shadow-[0_18px_50px_rgba(68,27,42,.07)] sm:p-8">
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--letter-muted)]">Possibilidades</p>
          <ol className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {options.map((option, index) => (
              <li key={option.id} className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition ${result?.id === option.id ? "border-[var(--letter-accent)] bg-[var(--letter-wash)] shadow-sm" : "border-[#eee4e7] bg-white/70"}`}>
                <span className="grid size-8 shrink-0 place-items-center rounded-full text-[10px] font-bold text-white shadow-sm" style={{ backgroundColor: wheelColor(index) }}>{index + 1}</span>
                <span className="min-w-0 font-serif text-lg font-semibold leading-tight text-[var(--letter-dark)]">{option.title}</span>
              </li>
            ))}
          </ol>
          <div className="mt-6 min-h-28" role="status" aria-live="polite">
            {result ? <div className="reveal rounded-3xl bg-[var(--letter-wash)] px-6 py-5 text-center"><p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--letter-muted)]">A roleta escolheu</p><p className="mt-2 font-serif text-3xl font-semibold text-[var(--letter-dark)]">{result.title}</p>{result.description ? <p className="mt-2 text-sm leading-6 text-[#7d5c67]">{result.description}</p> : null}</div> : <p className="rounded-2xl border border-dashed border-[#ddcbd1] px-4 py-5 text-center text-xs leading-5 text-[#806873]">Gire a roleta e deixe o acaso escolher um momento para vocês.</p>}
            {error ? <p className="mt-3 text-center text-sm font-semibold text-[#a23f58]">{error}</p> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
