"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { PREMIUM_PRICE_LABEL, type PremiumStatus } from "@/lib/premium";
import { XIcon } from "@/components/ui/icons";
import { TextField } from "@/components/create/form-controls";

type PaymentStatus = "CREATING" | "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED" | "EXPIRED" | "REFUNDED" | "CHARGED_BACK";
type PixResponse = {
  premiumStatus: PremiumStatus;
  payment: null | { id: string; status: PaymentStatus; amountCents: number; qrCode: string | null; qrCodeBase64: string | null; expiresAt: string | null };
  pollAfterMs: number;
};
const paymentLabels: Record<PaymentStatus, string> = {
  CREATING: "Preparando seu Pix...",
  PENDING: "Aguardando pagamento...",
  APPROVED: "Pagamento confirmado ❤️",
  REJECTED: "O pagamento não foi aprovado. Você pode tentar novamente.",
  CANCELLED: "Este Pix foi cancelado. Você pode gerar outro.",
  EXPIRED: "Este Pix expirou. Gere um novo quando quiser.",
  REFUNDED: "O pagamento foi reembolsado.",
  CHARGED_BACK: "O pagamento foi estornado.",
};

export function PremiumCheckout({ open, reason, letterId, ownerToken, isPremium, ensureDraft, onClose, onStatus }: {
  open: boolean;
  reason: "quiz" | "photos" | "all";
  letterId: string | null;
  ownerToken: string;
  isPremium: boolean;
  ensureDraft: () => Promise<string>;
  onClose: () => void;
  onStatus: (status: PremiumStatus) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const startingRef = useRef(false);
  const [payerEmail, setPayerEmail] = useState("");
  const [result, setResult] = useState<PixResponse | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [copyMessage, setCopyMessage] = useState("");
  const codeRef = useRef<HTMLTextAreaElement>(null);
  const buttonClass = "inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#8e2f4b] px-5 text-sm font-bold text-white transition hover:bg-[#76243d] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#963b57] disabled:cursor-wait disabled:opacity-60";

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    return () => { dialog.close(); document.body.style.overflow = previousOverflow; };
  }, [open]);

  useEffect(() => {
    if (open && result?.payment?.id) dialogRef.current?.scrollTo({ top: 0 });
  }, [open, result?.payment?.id]);

  const checkPayment = useCallback(async (id: string, signal?: AbortSignal) => {
    const response = await fetch(`/api/payments/pix?letterId=${encodeURIComponent(id)}`, {
      headers: { Authorization: `Bearer ${ownerToken}` }, cache: "no-store", signal,
    });
    const data = await response.json() as PixResponse & { error?: string };
    if (!response.ok) throw new Error(data.error || "Não foi possível consultar seu Pix agora.");
    setResult(data as PixResponse);
    onStatus(data.premiumStatus);
    setError("");
    return data as PixResponse;
  }, [ownerToken, onStatus]);

  useEffect(() => {
    if (!open || !letterId || isPremium || creating) return;
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout>;
    let stopped = false;
    async function poll() {
      if (stopped) return;
      let delay = 15000;
      if (!document.hidden) {
        try {
          const next = await checkPayment(letterId!, controller.signal);
          if (next.premiumStatus === "PREMIUM") return;
          delay = Math.max(15000, next.pollAfterMs || 15000);
        } catch {
          if (controller.signal.aborted) return;
          setError("Não conseguimos atualizar o status agora. Seu Pix continua vinculado à cartinha; tentaremos novamente.");
          delay = 30000;
        }
      }
      if (!stopped) timer = setTimeout(poll, delay);
    }
    void poll();
    return () => { stopped = true; clearTimeout(timer); controller.abort(); };
  }, [open, letterId, checkPayment, isPremium, creating]);

  async function createPix() {
    if (startingRef.current) return;
    startingRef.current = true;
    setCreating(true);
    setError("");
    setCopyMessage("");
    try {
      const id = await ensureDraft();
      const response = await fetch("/api/payments/pix", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${ownerToken}` },
        body: JSON.stringify({ letterId: id, payerEmail: payerEmail.trim() }),
      });
      const data = await response.json() as PixResponse & { error?: string };
      if (!response.ok) throw new Error(data.error || "Não foi possível criar seu Pix. Tente novamente.");
      setResult(data as PixResponse);
      onStatus(data.premiumStatus);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Não foi possível preparar seu Pix.");
    } finally {
      startingRef.current = false;
      setCreating(false);
    }
  }

  async function copyPix() {
    if (!result?.payment?.qrCode) return;
    try { await navigator.clipboard.writeText(result.payment.qrCode); setCopyMessage("Pix copiado! Cole no aplicativo do seu banco."); }
    catch { codeRef.current?.focus(); codeRef.current?.select(); setCopyMessage("Selecione e copie o código abaixo para usar no seu banco."); }
  }

  const payment = result?.payment;
  const pending = payment?.status === "PENDING" || payment?.status === "CREATING";
  const qrBase64 = payment?.qrCodeBase64?.replace(/^data:image\/png;base64,/, "");

  return <dialog ref={dialogRef} onCancel={(event) => { event.preventDefault(); onClose(); }} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }} className="fixed inset-0 m-auto max-h-[92svh] w-[calc(100%-1.5rem)] max-w-lg overflow-y-auto rounded-[2rem] border border-[#e6d2da] bg-[#fffaf8] p-0 text-[#502936] shadow-[0_30px_100px_rgba(48,12,28,0.3)] backdrop:bg-[#271019]/70 backdrop:backdrop-blur-sm" aria-labelledby="premium-checkout-title">
    <div className="p-6 sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <span className="rounded-full border border-[#e1c9cd] bg-[#f9ecec] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-[#92536a]">Uma compra, sua cartinha completa</span>
        <button type="button" onClick={onClose} aria-label="Fechar checkout e continuar editando" className="grid size-10 shrink-0 place-items-center rounded-full border border-[#e4d4da] text-[#855366] hover:bg-[#f6e8ed]"><XIcon className="size-4" /></button>
      </div>
      <h2 id="premium-checkout-title" className="mt-5 font-serif text-3xl font-semibold leading-tight tracking-[-0.03em]">{isPremium ? "Premium desbloqueado!" : pending ? "Seu pagamento Pix" : reason === "photos" ? "Quer adicionar mais momentos? ❤️" : "Todos os detalhes do seu amor."}</h2>
      {isPremium ? <div className="mt-6 rounded-3xl border border-[#cedec7] bg-[#f0f6ed] p-6 text-center" role="status">
        <p className="text-3xl" aria-hidden="true">❤️</p><p className="mt-3 font-semibold text-[#4b6c42]">Pagamento confirmado ❤️</p><p className="mt-2 text-sm leading-6 text-[#657d5e]">Quiz do casal e até 6 fotos liberados. Sua edição está salva e pronta para continuar.</p>
        <button type="button" onClick={onClose} className={`${buttonClass} mt-5`}>Continuar minha cartinha</button>
      </div> : <>
        {!pending && <><p className="mt-3 text-sm leading-6 text-[#8c6774]">Desbloqueie todos os recursos Premium desta cartinha por apenas {PREMIUM_PRICE_LABEL}.</p>
        <ul className="mt-4 space-y-2 text-sm text-[#704657]"><li>♡ Quiz do casal</li><li>♡ Mais de 2 fotos — até 6 no carrossel</li><li>♡ Experiência completa</li></ul></>}
        <div className={`${pending ? "my-4" : "my-6"} rounded-2xl border border-[#e5d3db] bg-white p-4 text-center`}><p className="font-serif text-4xl font-semibold">{PREMIUM_PRICE_LABEL}</p><p className="mt-1 text-xs text-[#967481]">Compra única para esta cartinha. Sem assinatura.</p></div>
        {payment && <p role="status" className={`mb-4 rounded-xl px-4 py-3 text-center text-sm font-semibold ${pending ? "bg-[#f7eee1] text-[#92724a]" : "bg-[#f8e9ee] text-[#99566d]"}`}>{paymentLabels[payment.status]}</p>}
        {pending && payment?.qrCode ? <div className="text-center">
          <p className="text-sm leading-6 text-[#8c6774]">Escaneie o QR Code ou copie o código Pix abaixo.</p>
          {qrBase64 && /^[A-Za-z0-9+/=\s]+$/.test(qrBase64) ? <div className="mx-auto my-5 w-fit rounded-2xl border border-[#eadfe2] bg-white p-4">
            {/* Mercado Pago supplies the exact QR image for this transaction. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`data:image/png;base64,${qrBase64}`} width={224} height={224} alt="QR Code Pix da compra Premium de R$ 7,90" className="aspect-square w-56 max-w-full" />
          </div> : <p className="my-4 text-xs text-[#8c6774]">Use o código copia e cola abaixo para pagar.</p>}
          <label htmlFor="pix-copy-code" className="mb-2 block text-left text-xs font-semibold text-[#744558]">Pix copia e cola</label>
          <textarea id="pix-copy-code" ref={codeRef} readOnly value={payment.qrCode} rows={3} className="w-full resize-none break-all rounded-xl border border-[#e0cdd6] bg-white p-3 font-mono text-[10px] text-[#785464]" />
          <button type="button" onClick={() => void copyPix()} className={`${buttonClass} mt-3`}>Copiar Pix</button>
          {copyMessage && <p role="status" className="mt-3 text-xs text-[#7d5364]">{copyMessage}</p>}
          {payment.expiresAt && <p className="mt-3 text-[11px] text-[#9c7f8b]">Válido até {new Date(payment.expiresAt).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}.</p>}
          <p className="mt-3 text-xs leading-5 text-[#987985]">Confirmamos o pagamento automaticamente. Pode levar alguns instantes após pagar.</p>
        </div> : !pending ? <form onSubmit={(event) => { event.preventDefault(); void createPix(); }} className="space-y-4">
          <TextField label="Seu e-mail para o pagamento" type="email" value={payerEmail} onChange={(event) => setPayerEmail(event.target.value)} required maxLength={254} autoComplete="email" placeholder="voce@exemplo.com" />
          <p className="text-[11px] leading-5 text-[#9c7f8b]">Informe o e-mail de quem paga. Ele será usado para processar a compra.</p>
          <button type="submit" disabled={creating} className={buttonClass}>{creating ? "Preparando Pix..." : payment ? `Gerar novo Pix — ${PREMIUM_PRICE_LABEL}` : `Desbloquear Premium — ${PREMIUM_PRICE_LABEL}`}</button>
        </form> : <p className="text-center text-xs leading-6 text-[#8c6774]">Estamos preparando os dados do pagamento. Aguarde um instante.</p>}
      </>}
      {error && <p className="mt-4 rounded-xl bg-[#fbecef] p-3 text-xs leading-5 text-[#9b435d]" role="alert">{error}</p>}
      <p className="mt-6 border-t border-[#eadce1] pt-5 text-center text-[11px] leading-5 text-[#967682]">15% dos ganhos do Minha Cartinha são destinados a instituições que ajudam animais de rua. ❤️🐾 <Link href="/transparencia" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">Entenda o compromisso</Link>.</p>
      {!isPremium && <button type="button" onClick={onClose} className="mt-4 min-h-10 w-full text-center text-xs font-semibold text-[#997887]">Continuar editando</button>}
    </div>
  </dialog>;
}
