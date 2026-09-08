"use client";

import Link from "next/link";
import { createContext, useContext, useMemo, useState, useSyncExternalStore } from "react";

const STORAGE_KEY = "minhacartinha:consent:v1";

type ConsentPreferences = {
  version: 1;
  externalMedia: boolean;
  decidedAt: string;
};

type ConsentContextValue = {
  externalMedia: boolean;
  decided: boolean;
  openPreferences: () => void;
  allowExternalMedia: () => void;
};

const ConsentContext = createContext<ConsentContextValue | null>(null);

function parseStoredConsent(raw: string | null): ConsentPreferences | null {
  try {
    const parsed = JSON.parse(raw ?? "null") as Partial<ConsentPreferences> | null;
    if (parsed?.version === 1 && typeof parsed.externalMedia === "boolean" && typeof parsed.decidedAt === "string") {
      return parsed as ConsentPreferences;
    }
  } catch {
    // An invalid browser value is treated as no decision.
  }
  return null;
}

function subscribeToConsent(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("minhacartinha:consent", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("minhacartinha:consent", callback);
  };
}

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const storedConsent = useSyncExternalStore(
    subscribeToConsent,
    () => localStorage.getItem(STORAGE_KEY),
    () => null,
  );
  const [sessionConsent, setSessionConsent] = useState<ConsentPreferences | null>(null);
  const preferences = useMemo(() => parseStoredConsent(storedConsent) ?? sessionConsent, [storedConsent, sessionConsent]);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [draftExternalMedia, setDraftExternalMedia] = useState(false);

  function save(externalMedia: boolean) {
    const next: ConsentPreferences = {
      version: 1,
      externalMedia,
      decidedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Consent still applies during this page view when storage is unavailable.
    }
    setSessionConsent(next);
    window.dispatchEvent(new Event("minhacartinha:consent"));
    setDraftExternalMedia(externalMedia);
    setPreferencesOpen(false);
  }

  const value = useMemo<ConsentContextValue>(() => ({
    externalMedia: preferences?.externalMedia ?? false,
    decided: preferences !== null,
    openPreferences: () => {
      setDraftExternalMedia(preferences?.externalMedia ?? false);
      setPreferencesOpen(true);
    },
    allowExternalMedia: () => save(true),
  }), [preferences]);

  return (
    <ConsentContext.Provider value={value}>
      {children}

      {!preferences ? (
        <aside className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-3xl rounded-2xl border border-[#dfccd2] bg-white/97 p-4 shadow-[0_18px_55px_rgba(63,24,38,0.2)] backdrop-blur sm:bottom-5 sm:flex sm:items-center sm:gap-5 sm:p-5" aria-label="Consentimento de cookies" role="region" aria-live="polite">
          <div className="min-w-0 flex-1">
            <p className="font-serif text-xl font-semibold text-[#4d2030]">Sua escolha de privacidade</p>
            <p className="mt-1 text-xs leading-5 text-[#775e67]">Usamos armazenamento necessário para lembrar sua escolha e preservar o rascunho. O player do Spotify só é carregado com sua permissão. <Link href="/cookies" className="font-semibold text-[#7d3049] underline underline-offset-2">Saiba mais</Link>.</p>
          </div>
          <div className="mt-4 grid gap-2 sm:mt-0 sm:min-w-52 sm:grid-cols-2">
            <button type="button" onClick={() => save(true)} className="min-h-10 rounded-full bg-[#8e2f4b] px-4 text-xs font-bold text-white hover:bg-[#76243d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#963b57]">Aceitar</button>
            <button type="button" onClick={() => save(false)} className="min-h-10 rounded-full border border-[#cfaeba] bg-white px-4 text-xs font-bold text-[#79364c] hover:bg-[#fbf4f6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#963b57]">Recusar não essenciais</button>
            <button type="button" onClick={() => setPreferencesOpen(true)} className="min-h-10 text-xs font-semibold text-[#755963] underline underline-offset-4 sm:col-span-2">Preferências</button>
          </div>
        </aside>
      ) : null}

      {preferencesOpen ? (
        <div className="fixed inset-0 z-[110] grid place-items-center bg-[#321c23]/35 p-4" role="presentation" onMouseDown={(event) => { if (event.currentTarget === event.target) setPreferencesOpen(false); }}>
          <section role="dialog" aria-modal="true" aria-labelledby="cookie-preferences-title" className="w-full max-w-lg rounded-3xl border border-[#e2d2d7] bg-[#fffdfc] p-6 shadow-2xl sm:p-7">
            <h2 id="cookie-preferences-title" className="font-serif text-3xl font-semibold text-[#4d2030]">Preferências de cookies</h2>
            <p className="mt-2 text-sm leading-6 text-[#775e67]">O projeto não usa Analytics nem publicidade. Há apenas armazenamento necessário e o conteúdo externo opcional abaixo.</p>
            <div className="mt-6 rounded-2xl border border-[#eadfe2] bg-white p-4">
              <div className="flex items-start justify-between gap-4">
                <div><p className="text-sm font-bold text-[#54323e]">Estritamente necessários</p><p className="mt-1 text-xs leading-5 text-[#806a72]">Preferência de consentimento e rascunho local. Sempre ativos.</p></div>
                <span className="rounded-full bg-[#edf1e9] px-2.5 py-1 text-[10px] font-bold uppercase text-[#607050]">Ativo</span>
              </div>
            </div>
            <label className="mt-3 flex cursor-pointer items-start justify-between gap-4 rounded-2xl border border-[#eadfe2] bg-white p-4">
              <span><span className="block text-sm font-bold text-[#54323e]">Conteúdo externo do Spotify</span><span className="mt-1 block text-xs leading-5 text-[#806a72]">Permite carregar o player incorporado, que se conecta ao Spotify.</span></span>
              <input type="checkbox" checked={draftExternalMedia} onChange={(event) => setDraftExternalMedia(event.target.checked)} className="mt-1 size-5 shrink-0 accent-[#8e2f4b]" />
            </label>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setPreferencesOpen(false)} className="min-h-11 rounded-full px-5 text-sm font-semibold text-[#725762]">Cancelar</button>
              <button type="button" onClick={() => save(draftExternalMedia)} className="min-h-11 rounded-full bg-[#8e2f4b] px-5 text-sm font-bold text-white hover:bg-[#76243d]">Salvar preferências</button>
            </div>
          </section>
        </div>
      ) : null}
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  const context = useContext(ConsentContext);
  if (!context) throw new Error("useConsent precisa estar dentro de ConsentProvider.");
  return context;
}
