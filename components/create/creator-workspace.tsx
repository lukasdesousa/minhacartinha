"use client";

import { useCallback, useRef, useState } from "react";
import type { LetterDraft } from "@/components/create/types";
import { initialLetterDraft } from "@/components/create/types";
import type { ApiErrorResponse, CreateLetterResponse } from "@/lib/letters/contracts";
import { CreatorHeader } from "@/components/create/creator-header";
import { EditorPanel } from "@/components/create/editor-panel";
import { LiveLetterPreview } from "@/components/create/live-letter-preview";
import { PreviewModal } from "@/components/create/preview-modal";
import { StepNavigation } from "@/components/create/step-navigation";
import { EyeIcon, SparklesIcon } from "@/components/ui/icons";

export function CreatorWorkspace() {
  const [draft, setDraft] = useState<LetterDraft>(initialLetterDraft);
  const [currentStep, setCurrentStep] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState("");
  const [publishedLetter, setPublishedLetter] = useState<CreateLetterResponse | null>(null);
  const publishingRef = useRef(false);
  const requestKeyRef = useRef<string | null>(null);

  const updateDraft = useCallback((patch: Partial<LetterDraft>) => {
    setDraft((current) => ({ ...current, ...patch }));
    setPublishedLetter(null);
    setPublishError("");
    requestKeyRef.current = null;
  }, []);

  const openPreview = useCallback(() => setPreviewOpen(true), []);
  const closePreview = useCallback(() => setPreviewOpen(false), []);

  function changeStep(step: number) {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function publishLetter() {
    if (publishingRef.current) return;

    publishingRef.current = true;
    setIsPublishing(true);
    setPublishError("");

    try {
      const relationshipStart = draft.relationshipStartedAt
        ? new Date(draft.relationshipStartedAt)
        : null;
      const payload = {
        ...draft,
        relationshipStartedAt:
          relationshipStart && !Number.isNaN(relationshipStart.getTime())
            ? relationshipStart.toISOString()
            : "",
      };
      requestKeyRef.current ??= crypto.randomUUID();
      const response = await fetch("/api/letters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": requestKeyRef.current,
        },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as CreateLetterResponse | ApiErrorResponse;

      if (!response.ok || !("path" in result)) {
        throw new Error("error" in result ? result.error : "Não foi possível publicar a cartinha.");
      }

      setPublishedLetter(result);
    } catch (error) {
      setPublishError(
        error instanceof Error
          ? error.message
          : "Não foi possível publicar a cartinha. Tente novamente.",
      );
    } finally {
      publishingRef.current = false;
      setIsPublishing(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f2f0] text-[#321c23]">
      <CreatorHeader onPreview={openPreview} />

      <main className="relative isolate overflow-hidden pb-16 sm:pb-24">
        <div className="pointer-events-none absolute -left-48 top-20 -z-10 size-[420px] rounded-full bg-[#f0dfe4]/75 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-56 top-[28rem] -z-10 size-[460px] rounded-full bg-[#e7e0f0]/70 blur-3xl" aria-hidden="true" />

        <div className="mx-auto max-w-[1480px] px-4 sm:px-8 lg:px-10">
          <div className="pt-8 sm:pt-11">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#e3d2d7] bg-white/60 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-[#985168]">
                  <SparklesIcon className="size-3" aria-hidden="true" />
                  Ateliê da sua história
                </div>
                <h1 className="mt-4 font-serif text-[2.8rem] font-semibold leading-[0.95] tracking-[-0.045em] text-[#481d2b] sm:text-5xl">
                  Crie algo que só vocês poderiam sentir.
                </h1>
              </div>
              <p className="max-w-md text-sm leading-6 text-[#806871] md:text-right">
                Personalize com calma. Enquanto você edita, tudo fica neste dispositivo e só é enviado ao publicar.
              </p>
            </div>

            <StepNavigation currentStep={currentStep} onChange={changeStep} />
          </div>

          <div className="mt-7 grid items-start gap-7 xl:grid-cols-[minmax(0,1fr)_460px] xl:gap-10">
            <EditorPanel
              draft={draft}
              currentStep={currentStep}
              onDraftChange={updateDraft}
              onStepChange={changeStep}
              onPreview={openPreview}
              onPublish={publishLetter}
              isPublishing={isPublishing}
              publishError={publishError}
              publishedLetter={publishedLetter}
            />

            <aside className="sticky top-[96px] hidden xl:block" aria-label="Prévia em tempo real">
              <div className="mb-4 flex items-end justify-between px-1">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#a05469]">Prévia ao vivo</p>
                  <h2 className="mt-1 font-serif text-2xl font-semibold text-[#4d2230]">A cartinha de vocês</h2>
                </div>
                <button
                  type="button"
                  onClick={openPreview}
                  className="inline-flex items-center gap-1.5 rounded-full text-xs font-semibold text-[#82445a] transition-colors hover:text-[#63283a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#963b57]"
                >
                  <EyeIcon className="size-3.5" aria-hidden="true" />
                  Expandir
                </button>
              </div>
              <LiveLetterPreview draft={draft} />
              <p className="mt-4 text-center text-[10px] font-medium text-[#9a838a]">
                Role dentro da prévia para ver a experiência completa
              </p>
            </aside>
          </div>
        </div>
      </main>

      <PreviewModal draft={draft} open={previewOpen} onClose={closePreview} />
    </div>
  );
}
