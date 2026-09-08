"use client";

import { useState } from "react";
import { CONTENT_REPORT_REASONS, type ContentReportReasonValue } from "@/lib/legal/content-report";

type FormStatus = { kind: "idle" | "sending" | "success" | "error"; message: string };

export function ContentReportForm() {
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [status, setStatus] = useState<FormStatus>({ kind: "idle", message: "" });

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status.kind === "sending") return;
    setStatus({ kind: "sending", message: "" });
    const form = event.currentTarget;
    const data = new FormData(form);
    try {
      const response = await fetch("/api/content-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          letterReference: data.get("letterReference"),
          reason: data.get("reason"),
          description: data.get("description"),
          contactEmail: data.get("contactEmail"),
          website: data.get("website"),
          startedAt,
        }),
      });
      const result = await response.json() as { received?: boolean; error?: string };
      if (!response.ok || !result.received) throw new Error(result.error || "Não foi possível enviar.");
      form.reset();
      setStartedAt(Date.now());
      setStatus({ kind: "success", message: "Recebemos sua solicitação para análise. Poderemos responder pelo e-mail informado se precisarmos de mais dados." });
    } catch (error) {
      setStatus({ kind: "error", message: error instanceof Error ? error.message : "Não foi possível enviar sua solicitação agora." });
    }
  }

  const fieldClass = "mt-2 min-h-12 w-full rounded-xl border border-[#dbcbd0] bg-white px-4 text-sm text-[#50343f] outline-none transition focus:border-[#9d4962] focus:ring-2 focus:ring-[#eed8df]";

  return (
    <form onSubmit={submit} className="rounded-[2rem] border border-[#e5d8dc] bg-[#fffdfc] p-5 shadow-[0_18px_55px_rgba(67,28,40,0.07)] sm:p-8">
      <div className="hidden" aria-hidden="true">
        <label>Não preencha este campo<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <div>
        <label htmlFor="letterReference" className="text-sm font-bold text-[#5a3946]">URL ou identificação da cartinha</label>
        <input id="letterReference" name="letterReference" required minLength={6} maxLength={500} className={fieldClass} placeholder="https://minhacartinha.com.br/c/..." />
      </div>
      <div className="mt-5">
        <label htmlFor="reason" className="text-sm font-bold text-[#5a3946]">Motivo</label>
        <select id="reason" name="reason" required defaultValue="" className={fieldClass}>
          <option value="" disabled>Selecione um motivo</option>
          {Object.entries(CONTENT_REPORT_REASONS).map(([value, label]) => <option key={value} value={value as ContentReportReasonValue}>{label}</option>)}
        </select>
      </div>
      <div className="mt-5">
        <label htmlFor="description" className="text-sm font-bold text-[#5a3946]">Descrição</label>
        <textarea id="description" name="description" required minLength={20} maxLength={2000} rows={6} className={`${fieldClass} py-3`} placeholder="Explique objetivamente o conteúdo e como ele viola seus direitos." />
        <p className="mt-2 text-xs leading-5 text-[#88727a]">Não envie senhas, documentos completos ou dados bancários.</p>
      </div>
      <div className="mt-5">
        <label htmlFor="contactEmail" className="text-sm font-bold text-[#5a3946]">E-mail para contato</label>
        <input id="contactEmail" name="contactEmail" type="email" required maxLength={254} autoComplete="email" className={fieldClass} />
      </div>
      <button type="submit" disabled={status.kind === "sending"} className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#8e2f4b] px-6 text-sm font-bold text-white hover:bg-[#76243d] disabled:cursor-wait disabled:opacity-60 sm:w-auto">
        {status.kind === "sending" ? "Enviando..." : "Enviar solicitação"}
      </button>
      {status.message ? <p role={status.kind === "error" ? "alert" : "status"} className={`mt-5 rounded-xl px-4 py-3 text-sm leading-6 ${status.kind === "success" ? "bg-[#edf2e9] text-[#536348]" : "bg-[#fff0f3] text-[#943c55]"}`}>{status.message}</p> : null}
    </form>
  );
}
