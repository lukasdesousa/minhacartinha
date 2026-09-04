"use client";

import { useEffect } from "react";
import type { LetterDraft } from "@/components/create/types";
import { LiveLetterPreview } from "@/components/create/live-letter-preview";
import { XIcon } from "@/components/ui/icons";

type PreviewModalProps = {
  draft: LetterDraft;
  open: boolean;
  onClose: () => void;
};

export function PreviewModal({ draft, open, onClose }: PreviewModalProps) {
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto bg-[#271019]/90 px-3 py-5 backdrop-blur-md sm:px-6 sm:py-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-modal-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="mx-auto max-w-[500px]">
        <div className="mb-4 flex items-center justify-between px-1 text-white">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/50">Experiência completa</p>
            <h2 id="preview-modal-title" className="mt-1 font-serif text-2xl font-semibold">Prévia da sua cartinha</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            autoFocus
            className="grid size-11 place-items-center rounded-full border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            aria-label="Fechar prévia"
          >
            <XIcon className="size-5" aria-hidden="true" />
          </button>
        </div>
        <LiveLetterPreview draft={draft} mode="modal" />
      </div>
    </div>
  );
}
