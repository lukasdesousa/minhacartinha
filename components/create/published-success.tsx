"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useState } from "react";
import type { CreateLetterResponse } from "@/lib/letters/contracts";
import { ArrowIcon, CheckIcon, LinkIcon, SparklesIcon } from "@/components/ui/icons";

type PublishedSuccessProps = {
  letter: CreateLetterResponse;
};

export function PublishedSuccess({ letter }: PublishedSuccessProps) {
  const [copied, setCopied] = useState(false);
  const [shareMessage, setShareMessage] = useState("");
  const emailWasSent = letter.emailStatus === "sent";
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
    `Preparei uma cartinha especial para você 💌 ${letter.publicUrl}`,
  )}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(letter.publicUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setShareMessage("Não foi possível copiar automaticamente. Selecione o link abaixo.");
    }
  }

  async function shareLetter() {
    if (!navigator.share) {
      await copyLink();
      return;
    }

    try {
      await navigator.share({
        title: "Uma cartinha especial para você",
        text: "Preparei uma cartinha especial para você 💌",
        url: letter.publicUrl,
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setShareMessage("O compartilhamento não abriu. Você ainda pode copiar o link.");
    }
  }

  return (
    <section
      className="overflow-hidden rounded-[1.75rem] border border-[#dac8cd] bg-[#fffdfc] shadow-[0_22px_60px_rgba(77,32,46,0.1)]"
      aria-labelledby="published-title"
      aria-live="polite"
    >
      <div className="bg-[linear-gradient(145deg,#552032,#842f4b)] px-5 py-8 text-center text-white sm:px-8 sm:py-10">
        <span className="mx-auto grid size-14 place-items-center rounded-[1.25rem] bg-white/12 text-[#f4ced8]">
          <SparklesIcon className="size-6" aria-hidden="true" />
        </span>
        <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">Pronta para emocionar</p>
        <h3 id="published-title" className="mt-2 font-serif text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
          Sua cartinha está pronta
        </h3>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-white/72">
          O endereço é exclusivo. Abra, copie ou escaneie — este momento já pode ser compartilhado.
        </p>
      </div>

      <div className="grid gap-7 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-center lg:p-8">
        <div>
          <div
            className={`flex gap-3 rounded-2xl p-4 ${
              emailWasSent ? "bg-[#f0f6ee] text-[#4b6b47]" : "bg-[#fff5e6] text-[#825b2b]"
            }`}
          >
            <span className={`mt-0.5 grid size-7 shrink-0 place-items-center rounded-full ${emailWasSent ? "bg-[#dcebd7]" : "bg-[#f5dfb9]"}`}>
              <CheckIcon className="size-3.5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-bold">{emailWasSent ? "E-mail enviado com carinho" : "A cartinha foi salva"}</p>
              <p className="mt-1 text-xs leading-5 opacity-80">{letter.emailMessage}</p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-[#e7dcde] bg-[#faf6f5] p-3">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#9a7180]">Link exclusivo</p>
            <p className="break-all text-xs font-semibold leading-5 text-[#643345]">{letter.publicUrl}</p>
          </div>

          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            <Link
              href={letter.path}
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#8e2f4b] px-5 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[#76243d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#963b57]"
            >
              Abrir cartinha
              <ArrowIcon className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
            <button
              type="button"
              onClick={() => void copyLink()}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#d9c8cd] bg-white px-5 text-sm font-bold text-[#713b4d] transition-colors hover:bg-[#faf4f5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#963b57]"
            >
              <LinkIcon className="size-4" aria-hidden="true" />
              {copied ? "Link copiado" : "Copiar link"}
            </button>
            <button
              type="button"
              onClick={() => void shareLetter()}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#d9c8cd] bg-white px-5 text-sm font-bold text-[#713b4d] transition-colors hover:bg-[#faf4f5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#963b57]"
            >
              Compartilhar
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#eaf5e9] px-5 text-sm font-bold text-[#3f6b40] transition-colors hover:bg-[#deeedc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4f744a]"
            >
              Enviar no WhatsApp
            </a>
          </div>
          {shareMessage ? <p className="mt-3 text-xs font-semibold text-[#9b4961]" role="status">{shareMessage}</p> : null}
        </div>

        <div className="mx-auto w-full max-w-[220px] rounded-3xl border border-[#e3d5d9] bg-white p-4 text-center shadow-[0_12px_30px_rgba(77,32,46,0.07)]">
          {letter.qrCodeDataUrl ? (
            <img src={letter.qrCodeDataUrl} width="188" height="188" alt="QR Code para abrir a cartinha" className="mx-auto size-auto w-full rounded-xl" />
          ) : (
            <div className="grid aspect-square place-items-center rounded-xl bg-[#f6eff1] px-4 text-xs leading-5 text-[#8d6d77]">QR Code temporariamente indisponível</div>
          )}
          <p className="mt-3 text-[11px] font-semibold leading-4 text-[#7c5b66]">Escaneie para abrir no celular</p>
        </div>
      </div>
    </section>
  );
}
