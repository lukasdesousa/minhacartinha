"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import type { PublicLoveVoucher } from "@/lib/letters/contracts";

export function ScratchReveal({ voucher, onReveal }: { voucher: PublicLoveVoucher; onReveal: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scratchingRef = useRef(false);
  const checksRef = useRef(0);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#b9aeb2");
    gradient.addColorStop(0.5, "#eee7e9");
    gradient.addColorStop(1, "#a99ca1");
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "rgba(255,255,255,.32)";
    for (let x = -canvas.height; x < canvas.width; x += 34) context.fillRect(x, 0, 12, canvas.height);
    context.fillStyle = "#694956";
    context.textAlign = "center";
    context.font = "700 25px sans-serif";
    context.fillText("RASPE AQUI", canvas.width / 2, canvas.height / 2 - 5);
    context.font = "500 16px sans-serif";
    context.fillText("para revelar a surpresa", canvas.width / 2, canvas.height / 2 + 27);
  }, []);

  function finishReveal() {
    if (revealed) return;
    setRevealed(true);
    onReveal();
  }

  function checkProgress() {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
    let cleared = 0;
    let sampled = 0;
    for (let index = 3; index < pixels.length; index += 64) {
      sampled += 1;
      if (pixels[index] < 32) cleared += 1;
    }
    if (cleared / sampled > 0.3) finishReveal();
  }

  function scratch(event: ReactPointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context || (!scratchingRef.current && event.type === "pointermove")) return;
    const bounds = canvas.getBoundingClientRect();
    const x = (event.clientX - bounds.left) * canvas.width / bounds.width;
    const y = (event.clientY - bounds.top) * canvas.height / bounds.height;
    context.globalCompositeOperation = "destination-out";
    context.beginPath();
    context.arc(x, y, 34 * canvas.width / bounds.width, 0, Math.PI * 2);
    context.fill();
    checksRef.current += 1;
    if (checksRef.current % 7 === 0) checkProgress();
  }

  function start(event: ReactPointerEvent<HTMLCanvasElement>) {
    scratchingRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    scratch(event);
  }

  function stop(event: ReactPointerEvent<HTMLCanvasElement>) {
    scratchingRef.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    checkProgress();
  }

  return <div>
    <div className="relative mx-auto aspect-[16/9] w-full max-w-md overflow-hidden rounded-3xl border border-[#e4cbd2] bg-[linear-gradient(145deg,#fff5f7,#f2dce3)] shadow-inner">
      <div className="absolute inset-0 grid place-items-center p-6 text-center" aria-hidden={!revealed}>
        <div className={revealed ? "reveal" : "opacity-0"}>
          <div className="mb-2 flex justify-center gap-4 text-xl text-[#bd607b]" aria-hidden="true"><span className="animate-bounce">♥</span><span className="animate-pulse">✦</span><span className="animate-bounce">♥</span></div>
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#a1576d]">Sua surpresa é</p>
          <h3 className="mt-2 font-serif text-3xl font-semibold leading-tight text-[#572536] sm:text-4xl">{voucher.title}</h3>
          {voucher.description ? <p className="mt-3 text-xs leading-5 text-[#7d5c67] sm:text-sm">{voucher.description}</p> : null}
        </div>
      </div>
      <canvas
        ref={canvasRef}
        width={640}
        height={360}
        className={`absolute inset-0 size-full touch-none cursor-grab transition-all duration-700 active:cursor-grabbing ${revealed ? "pointer-events-none scale-110 opacity-0" : "opacity-100"}`}
        onPointerDown={start}
        onPointerMove={scratch}
        onPointerUp={stop}
        onPointerCancel={stop}
        role="img"
        aria-label="Área de raspadinha. Arraste o dedo ou o mouse para revelar a surpresa."
      />
    </div>
    {!revealed ? <button type="button" onClick={finishReveal} className="mt-4 min-h-10 rounded-full border border-[#d5bec6] px-5 text-xs font-semibold text-[#714052]">Revelar surpresa sem raspar</button> : null}
  </div>;
}

export function LoveVouchers({ slug, vouchers }: { slug: string; vouchers: PublicLoveVoucher[] }) {
  const [items, setItems] = useState(vouchers);
  const [selected, setSelected] = useState<PublicLoveVoucher | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [message, setMessage] = useState("");
  const redeemingRef = useRef(false);

  function close() {
    if (redeemingRef.current) return;
    setSelected(null);
    setRevealed(false);
    setConfirming(false);
    setMessage("");
  }

  async function redeem() {
    if (!selected || redeemingRef.current) return;
    redeemingRef.current = true;
    setMessage("Resgatando seu vale...");
    try {
      const response = await fetch(`/api/letters/${encodeURIComponent(slug)}/vouchers/${encodeURIComponent(selected.id)}/redeem`, { method: "POST", cache: "no-store" });
      const result = await response.json() as { voucher?: PublicLoveVoucher; error?: string };
      if (!response.ok || !result.voucher) throw new Error(result.error || "Não foi possível resgatar o vale.");
      setItems((current) => current.map((item) => item.id === result.voucher!.id ? result.voucher! : item));
      setSelected(result.voucher);
      setConfirming(false);
      setMessage("Vale resgatado com amor! ❤️");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não foi possível resgatar o vale.");
    } finally {
      redeemingRef.current = false;
    }
  }

  return <section className="bg-[var(--letter-wash)] px-5 py-20 sm:px-8 sm:py-24" aria-labelledby="love-vouchers-title">
    <div className="mx-auto max-w-5xl text-center"><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--letter-muted)]">Presentes para viver</p><h2 id="love-vouchers-title" className="mt-3 font-serif text-4xl font-semibold text-[var(--letter-dark)] sm:text-5xl">Vales do Amor</h2><p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#7d5c67]">Cada vale guarda uma surpresa. Escolha um e raspe para descobrir.</p></div>
    <div className="mx-auto mt-10 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">{items.map((voucher, index) => {
      const exhausted = voucher.totalUses !== null && voucher.usedCount >= voucher.totalUses;
      const remaining = voucher.totalUses === null ? null : voucher.totalUses - voucher.usedCount;
      return <button key={voucher.id} type="button" disabled={exhausted} onClick={() => { setSelected(voucher); setRevealed(false); setMessage(""); }} className="relative min-h-48 overflow-hidden rounded-[1.6rem] border-2 border-dashed border-[#c8899c] bg-white p-6 text-center shadow-[0_14px_30px_rgba(71,27,42,.09)] transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0"><span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#a1576d]">Vale surpresa {index + 1}</span><span className="mt-6 block text-4xl text-[#b85d78]" aria-hidden="true">♥</span><span className="mt-4 block font-serif text-xl font-semibold leading-tight text-[#572536]">{exhausted ? "Surpresa resgatada" : "Toque para descobrir"}</span><span className="mt-4 block text-[10px] font-bold uppercase tracking-wider text-[#9b697a]">{exhausted ? "Sem usos restantes" : remaining === null ? "Uso ilimitado" : `${remaining} ${remaining === 1 ? "uso restante" : "usos restantes"}`}</span></button>;
    })}</div>
    {selected ? <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-[#32131fdf] p-4" role="dialog" aria-modal="true" aria-labelledby="voucher-dialog-title" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}><div className="my-auto w-full max-w-lg rounded-[2rem] bg-[#fffaf8] p-6 text-center shadow-2xl sm:p-9"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a1576d]">Vale surpresa</p><h3 id="voucher-dialog-title" className="mt-3 font-serif text-3xl font-semibold text-[#572536]">Raspe para descobrir</h3><p className="mb-6 mt-2 text-xs leading-5 text-[#876975]">Passe o dedo ou o mouse sobre a área prateada.</p><ScratchReveal key={selected.id} voucher={selected} onReveal={() => setRevealed(true)} />{revealed && !message ? <button type="button" onClick={() => setConfirming(true)} className="mt-6 min-h-12 rounded-full bg-[#8e2f4b] px-6 text-sm font-bold text-white">Quero resgatar este vale</button> : null}{confirming ? <div className="reveal mt-5 rounded-2xl bg-[#f5e6ea] p-4"><p className="text-sm font-semibold text-[#6f3247]">Tem certeza? Um uso será marcado agora.</p><button type="button" onClick={() => void redeem()} className="mt-4 min-h-11 rounded-full bg-[#8e2f4b] px-6 text-sm font-bold text-white">Sim, resgatar</button></div> : null}<p className="mt-5 min-h-6 text-sm font-semibold text-[#8e2f4b]" role="status">{message}</p><button type="button" onClick={close} className="mt-3 min-h-11 rounded-full border border-[#d5bec6] px-6 text-sm font-semibold text-[#714052]">Fechar</button></div></div> : null}
  </section>;
}
