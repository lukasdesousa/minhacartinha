"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import type { TransferAsset } from "@/lib/transparency/transfers";

type GalleryItem = TransferAsset & { label: string };

function DownloadIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className="size-4"><path d="M12 3v11m0 0 4-4m-4 4-4-4M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function ExpandIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" className="size-4"><path d="M8 3H3v5m13-5h5v5M8 21H3v-5m18 0v5h-5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export function TransferGallery({ recipientImage, pixProof }: { recipientImage?: TransferAsset; pixProof?: TransferAsset }) {
  const items: GalleryItem[] = [
    recipientImage && { ...recipientImage, label: "Imagem do beneficiário" },
    pixProof && { ...pixProof, label: "Comprovante do PIX" },
  ].filter((item): item is GalleryItem => Boolean(item));
  const [active, setActive] = useState<GalleryItem | null>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!active) return;
    closeButton.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(null);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [active]);

  function open(event: MouseEvent<HTMLButtonElement>, item: GalleryItem) {
    trigger.current = event.currentTarget;
    setActive(item);
  }

  function close() {
    setActive(null);
    requestAnimationFrame(() => trigger.current?.focus());
  }

  if (items.length === 0) return null;

  return <>
    <div className="mt-7 grid gap-5 lg:grid-cols-2">
      {items.map((item) => (
        <section key={item.src} className="overflow-hidden rounded-2xl border border-[#eadfe1] bg-[#fffdfc]">
          <div className="flex items-center justify-between gap-3 px-5 pb-3 pt-5">
            <h4 className="text-sm font-bold text-[#5e4050]">{item.label}</h4>
            <span className="text-xs text-[#927780]">Arquivo original</span>
          </div>
          <button type="button" onClick={(event) => open(event, item)} className="group relative block w-full overflow-hidden bg-[#f7f2f0] text-left focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#87536a]" aria-label={`Ampliar ${item.label.toLowerCase()}`}>
            <img src={item.src} alt={item.alt} className="h-72 w-full object-contain transition duration-300 group-hover:scale-[1.02] sm:h-80" loading="lazy" />
            <span className="absolute bottom-3 right-3 inline-flex min-h-10 items-center gap-2 rounded-full bg-[#512c3a]/90 px-4 text-xs font-bold text-white"><ExpandIcon /> Ampliar</span>
          </button>
          <div className="p-4">
            <a href={item.src} download={item.downloadName} className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-bold text-[#7f4b61] hover:bg-[#f8eef1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#87536a]"><DownloadIcon /> Baixar {item.label === "Comprovante do PIX" ? "comprovante" : "imagem"}</a>
          </div>
        </section>
      ))}
    </div>

    {active && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#281b20]/85 p-4 sm:p-8" role="dialog" aria-modal="true" aria-label={`Visualização: ${active.label}`} onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
      <div className="relative flex max-h-full w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-[#fffdfc] shadow-2xl">
        <div className="flex items-center justify-between gap-4 border-b border-[#eadfe1] px-4 py-3 sm:px-6"><p className="text-sm font-bold text-[#512c3a]">{active.label}</p><button ref={closeButton} type="button" onClick={close} className="inline-flex min-h-11 items-center rounded-xl px-3 text-sm font-bold text-[#714456] hover:bg-[#f8eef1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#87536a]">Fechar <span className="ml-1" aria-hidden="true">×</span></button></div>
        <div className="min-h-0 overflow-auto bg-[#f7f2f0] p-3 sm:p-6"><img src={active.src} alt={active.alt} className="mx-auto h-auto max-h-[68vh] w-auto max-w-full object-contain" /></div>
        <div className="border-t border-[#eadfe1] px-4 py-3 sm:px-6"><a href={active.src} download={active.downloadName} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#6a4050] px-4 text-sm font-bold text-white hover:bg-[#512c3a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#87536a]"><DownloadIcon /> Baixar arquivo original</a></div>
      </div>
    </div>}
  </>;
}
