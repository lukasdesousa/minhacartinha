"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { PublicLoveWheelOption } from "@/lib/letters/contracts";

const colors = ["#8e2f4b", "#d78da1", "#6d557b", "#e3b17e", "#a96075", "#887099"];

export function LoveWheel({ slug, title, options }: { slug: string; title: string; options: PublicLoveWheelOption[] }) {
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

  const background = useMemo(
    () => `conic-gradient(from -90deg, ${options.map((_, index) => `${colors[index % colors.length]} ${index * 100 / options.length}% ${(index + 1) * 100 / options.length}%`).join(",")})`,
    [options],
  );

  async function spin() {
    if (spinningRef.current) return;
    spinningRef.current = true;
    setSpinning(true);
    setResult(null);
    setError("");
    try {
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
    <section className="overflow-hidden px-5 py-20 sm:px-8 sm:py-24" aria-labelledby="love-wheel-title">
      <div className="mx-auto max-w-5xl text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--letter-muted)]">Uma surpresa do acaso</p>
        <h2 id="love-wheel-title" className="mt-3 font-serif text-4xl font-semibold text-[var(--letter-dark)] sm:text-5xl">{title}</h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#7d5c67]">Cada opção tem a mesma chance. Toque para descobrir o próximo momento de vocês.</p>
      </div>
      <div className="mx-auto mt-10 flex max-w-xl flex-col items-center">
        <div className="relative">
          <span className={`absolute left-1/2 top-[-15px] z-20 -translate-x-1/2 text-4xl text-[#542334] ${spinning && !reducedMotion ? "animate-bounce" : ""}`} aria-hidden="true">▼</span>
          <div
            className="relative size-[min(82vw,360px)] rounded-full border-[12px] border-[#fff8fa] shadow-[0_20px_55px_rgba(67,28,40,.2)]"
            style={{ background, transform: `rotate(${rotation}deg)`, transition: reducedMotion ? "transform 100ms linear" : "transform 4.5s cubic-bezier(.12,.72,.12,1)" }}
          >
            {options.map((option, index) => {
              const angle = (index + 0.5) * 360 / options.length;
              return <span key={option.id} className="absolute left-1/2 top-1/2 w-[42%] origin-left text-left text-[10px] font-bold text-white drop-shadow sm:text-xs" style={{ transform: `rotate(${angle - 90}deg) translateX(18%)` }}><span className="block max-w-[105px] truncate">{option.title}</span></span>;
            })}
            <span className="absolute left-1/2 top-1/2 grid size-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-4 border-[#f5e5e9] bg-white font-serif font-bold text-[#6f2b42] shadow-md">Amor</span>
          </div>
        </div>
        <button type="button" disabled={spinning} onClick={() => void spin()} className="mt-8 min-h-12 rounded-full bg-[#8e2f4b] px-8 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#76243d] disabled:cursor-wait disabled:opacity-60">{spinning ? "Girando..." : "Girar a roleta"}</button>
        <div className="mt-6 min-h-24 text-center" role="status" aria-live="polite">
          {result ? <div className="reveal rounded-3xl bg-[var(--letter-wash)] px-8 py-5"><p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--letter-muted)]">A roleta escolheu</p><p className="mt-2 font-serif text-3xl font-semibold text-[#572536]">{result.title}</p>{result.description ? <p className="mt-2 text-sm leading-6 text-[#7d5c67]">{result.description}</p> : null}</div> : null}
          {error ? <p className="text-sm font-semibold text-[#a23f58]">{error}</p> : null}
        </div>
      </div>
    </section>
  );
}
