"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { GalleryPhoto, LetterDraft } from "@/components/create/types";
import { initialLetterDraft } from "@/components/create/types";
import type { ApiErrorResponse, CreateLetterResponse } from "@/lib/letters/contracts";
import { CreatorHeader } from "@/components/create/creator-header";
import { EditorPanel } from "@/components/create/editor-panel";
import { LiveLetterPreview } from "@/components/create/live-letter-preview";
import { PreviewModal } from "@/components/create/preview-modal";
import { StepNavigation } from "@/components/create/step-navigation";
import { EyeIcon, SparklesIcon } from "@/components/ui/icons";
import { PremiumCheckout } from "@/components/create/premium-checkout";
import { PremiumBadge } from "@/components/create/premium-badge";
import { PublishedSuccess } from "@/components/create/published-success";
import { PlanChoice } from "@/components/create/plan-choice";
import { readSavedDraft, saveDraft, type SavedDraft } from "@/components/create/draft-storage";
import { FREE_GALLERY_LIMIT, MAX_GALLERY_PHOTOS, PREMIUM_PRICE_LABEL, type CreationPlan, type PremiumStatus } from "@/lib/premium";
import { getQuizError } from "@/lib/letters/quiz";

function newIdentity() {
  return {
    requestKey: crypto.randomUUID(),
    ownerToken: Array.from(crypto.getRandomValues(new Uint8Array(32)), (byte) => byte.toString(16).padStart(2, "0")).join(""),
  };
}

function publicationPayload(draft: LetterDraft) {
  const relationshipStart = draft.relationshipStartedAt ? new Date(draft.relationshipStartedAt) : null;
  return { ...draft, relationshipStartedAt: relationshipStart && !Number.isNaN(relationshipStart.getTime()) ? relationshipStart.toISOString() : "" };
}

type DraftResponse = { id: string; premiumStatus: PremiumStatus; status: "DRAFT" | "PUBLISHED"; error?: string };

export function CreatorWorkspace() {
  const [draft, setDraft] = useState<LetterDraft>(initialLetterDraft);
  const [currentStep, setCurrentStep] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState("");
  const [publishedLetter, setPublishedLetter] = useState<CreateLetterResponse | null>(null);
  const publishingRef = useRef(false);
  const [identity, setIdentity] = useState<{ requestKey: string; ownerToken: string } | null>(null);
  const [letterId, setLetterId] = useState<string | null>(null);
  const [premiumStatus, setPremiumStatus] = useState<PremiumStatus>("FREE");
  const [selectedPlan, setSelectedPlan] = useState<CreationPlan | null>(null);
  const [isRestoring, setIsRestoring] = useState(true);
  const [planNotice, setPlanNotice] = useState("");
  const [upgradeReason, setUpgradeReason] = useState<"quiz" | "photos" | "all">("all");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [storageError, setStorageError] = useState("");
  const [pendingGallery, setPendingGallery] = useState<GalleryPhoto[]>([]);
  const pendingGalleryRef = useRef<GalleryPhoto[]>([]);
  const saveQueueRef = useRef<Promise<void>>(Promise.resolve());
  const isPremium = premiumStatus === "PREMIUM";
  const premiumFeaturesEnabled = selectedPlan === "PREMIUM" || isPremium;

  const onPremiumStatus = useCallback((status: PremiumStatus) => {
    setPremiumStatus(status);
    if (status === "PREMIUM" || status === "PAYMENT_PENDING") setSelectedPlan("PREMIUM");
    if (status === "PREMIUM" && pendingGalleryRef.current.length) {
      const photos = pendingGalleryRef.current;
      pendingGalleryRef.current = [];
      setPendingGallery([]);
      setDraft((current) => ({ ...current, gallery: [...current.gallery, ...photos].slice(0, MAX_GALLERY_PHOTOS) }));
    }
  }, []);

  useEffect(() => {
    let active = true;
    async function restore() {
      try {
        const saved = await readSavedDraft();
        if (!active) return;
        if (saved && /^[a-f0-9]{64}$/.test(saved.ownerToken) && saved.requestKey && saved.draft) {
          // Drafts saved before plan selection was introduced ask once on their
          // next visit, while preserving every field already filled in.
          const restoredPlan = saved.selectedPlan ?? null;
          setSelectedPlan(restoredPlan);
          setIdentity({ requestKey: saved.requestKey, ownerToken: saved.ownerToken });
          setDraft({ ...initialLetterDraft, ...saved.draft });
          setLetterId(saved.letterId);
          setPublishedLetter(saved.publishedLetter);
          pendingGalleryRef.current = saved.pendingGallery ?? [];
          setPendingGallery(saved.pendingGallery ?? []);
          // IndexedDB preserves editing only; the server is the authority for Premium.
          const response = await fetch(`/api/letters/draft?requestKey=${encodeURIComponent(saved.requestKey)}`, { headers: { Authorization: `Bearer ${saved.ownerToken}` }, cache: "no-store" });
          if (response.ok && active) {
            const result = await response.json() as DraftResponse;
            if (!active) return;
            setLetterId(result.id);
            onPremiumStatus(result.premiumStatus);
            if (result.status === "PUBLISHED" && !saved.publishedLetter) {
              const recovered = await fetch("/api/letters", { method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": saved.requestKey, Authorization: `Bearer ${saved.ownerToken}` }, body: JSON.stringify(publicationPayload(saved.draft)) });
              if (recovered.ok && active) setPublishedLetter(await recovered.json() as CreateLetterResponse);
            }
          }
        } else setIdentity(newIdentity());
      } catch {
        if (active) {
          setIdentity((current) => current ?? newIdentity());
          setStorageError("Não conseguimos recuperar ou verificar seu rascunho agora. Mantenha esta aba aberta enquanto edita.");
        }
      } finally {
        if (active) setIsRestoring(false);
      }
    }
    void restore();
    return () => { active = false; };
  }, [onPremiumStatus]);

  const persist = useCallback((value: SavedDraft) => {
    const next = saveQueueRef.current.catch(() => {}).then(() => saveDraft(value));
    saveQueueRef.current = next;
    return next;
  }, []);

  useEffect(() => {
    if (!identity || !selectedPlan) return;
    const timer = setTimeout(() => {
      void persist({ draft, ...identity, letterId, publishedLetter, pendingGallery, selectedPlan })
        .then(() => setStorageError(""))
        .catch(() => setStorageError("Não conseguimos salvar neste dispositivo. Libere espaço no navegador para preservar sua edição antes de pagar."));
    }, 250);
    return () => clearTimeout(timer);
  }, [draft, identity, letterId, pendingGallery, publishedLetter, selectedPlan, persist]);

  const updateDraft = useCallback((patch: Partial<LetterDraft>) => {
    setDraft((current) => ({ ...current, ...patch }));
    setPublishError("");
  }, []);

  const choosePlan = useCallback((plan: CreationPlan, photos?: GalleryPhoto[]) => {
    setSelectedPlan(plan);
    setPlanNotice(plan === "PREMIUM"
      ? `Premium escolhido. O Pix de ${PREMIUM_PRICE_LABEL} será gerado somente na revisão final.`
      : "Plano Grátis escolhido. Você pode publicar com até 2 fotos no carrossel.");
    if (plan === "PREMIUM") {
      const restored = photos?.length ? photos : pendingGalleryRef.current;
      if (restored.length) {
        pendingGalleryRef.current = [];
        setPendingGallery([]);
        setDraft((current) => ({ ...current, gallery: [...current.gallery, ...restored].slice(0, MAX_GALLERY_PHOTOS) }));
      }
      return;
    }
    setDraft((current) => {
      const excess = current.gallery.slice(FREE_GALLERY_LIMIT);
      if (excess.length) {
        pendingGalleryRef.current = excess;
        setPendingGallery(excess);
      }
      return { ...current, gallery: current.gallery.slice(0, FREE_GALLERY_LIMIT), quizEnabled: false };
    });
  }, []);

  const choosePremiumFromFeature = useCallback((reason: "quiz" | "photos" | "all" = "all", photos?: GalleryPhoto[]) => {
    if (photos?.length) {
      pendingGalleryRef.current = photos;
      setPendingGallery(photos);
    }
    setUpgradeReason(reason);
    choosePlan("PREMIUM", photos);
  }, [choosePlan]);

  const openFinalCheckout = useCallback(() => {
    setUpgradeReason("all");
    setCheckoutOpen(true);
  }, []);
  const closeCheckout = useCallback(() => setCheckoutOpen(false), []);

  async function ensureDraft() {
    if (!identity) throw new Error("Seu rascunho está sendo preparado. Aguarde um instante.");
    // Persist the capability before any payment can be created; reload must recover the same purchase.
    await persist({ draft, ...identity, letterId, publishedLetter, pendingGallery, selectedPlan: selectedPlan ?? "FREE" });
    const response = await fetch("/api/letters/draft", {
      method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${identity.ownerToken}` },
      body: JSON.stringify({ requestKey: identity.requestKey, draft: publicationPayload(draft) }),
    });
    const result = await response.json() as DraftResponse;
    if (!response.ok) throw new Error(result.error || "Não foi possível salvar sua cartinha. Tente novamente.");
    setLetterId(result.id);
    onPremiumStatus(result.premiumStatus);
    await persist({ draft, ...identity, letterId: result.id, publishedLetter, pendingGallery, selectedPlan: selectedPlan ?? "FREE" });
    return result.id as string;
  }

  function startAnotherLetter() {
    setIdentity(newIdentity());
    setDraft(initialLetterDraft);
    setLetterId(null);
    setPremiumStatus("FREE");
    setSelectedPlan(null);
    setPlanNotice("");
    setPublishedLetter(null);
    setPublishError("");
    pendingGalleryRef.current = [];
    setPendingGallery([]);
    setCurrentStep(0);
    setCheckoutOpen(false);
  }

  const openPreview = useCallback(() => setPreviewOpen(true), []);
  const closePreview = useCallback(() => setPreviewOpen(false), []);

  function changeStep(step: number) {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function publishLetter() {
    if (publishingRef.current || !identity) return;
    if (draft.quizEnabled && getQuizError(draft.quiz)) { setPublishError(getQuizError(draft.quiz)); return; }
    if (selectedPlan === "PREMIUM" && !isPremium) { openFinalCheckout(); return; }
    if (!isPremium && (draft.quizEnabled || draft.gallery.length > FREE_GALLERY_LIMIT)) {
      setPublishError("Esta cartinha usa recursos Premium. Escolha o Premium para continuar.");
      return;
    }

    publishingRef.current = true;
    setIsPublishing(true);
    setPublishError("");

    try {
      const savedId = await ensureDraft();
      const payload = publicationPayload(draft);
      const response = await fetch("/api/letters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": identity.requestKey,
          Authorization: `Bearer ${identity.ownerToken}`,
        },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as CreateLetterResponse | ApiErrorResponse;

      if (!response.ok || !("path" in result)) {
        throw new Error("error" in result ? result.error : "Não foi possível publicar a cartinha.");
      }

      setPublishedLetter(result);
      await persist({ draft, ...identity, letterId: savedId, publishedLetter: result, pendingGallery, selectedPlan: selectedPlan ?? "FREE" });
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

  if (isRestoring || !identity) {
    return <div className="grid min-h-screen place-items-center bg-[#f7f2f0] text-sm text-[#806871]" role="status">Preparando seu ateliê...</div>;
  }

  if (!selectedPlan) {
    return <PlanChoice onChoose={(plan) => choosePlan(plan)} hasDraft={draft !== initialLetterDraft && Boolean(draft.message.trim())} />;
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
                  Seu ateliê de histórias
                </div>
                <h1 className="mt-4 font-serif text-[2.8rem] font-semibold leading-[0.95] tracking-[-0.045em] text-[#481d2b] sm:text-5xl">
                  Crie grátis algo que só vocês poderiam sentir.
                </h1>
              </div>
              <p className="max-w-md text-sm leading-6 text-[#806871] md:text-right">
                Você escolheu {selectedPlan === "PREMIUM" ? `Premium por ${PREMIUM_PRICE_LABEL}` : "o plano Grátis"}. Sua edição fica salva neste dispositivo.
              </p>
            </div>

            <StepNavigation currentStep={currentStep} onChange={changeStep} />
            <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-[#906b7c]">
              {isPremium ? <PremiumBadge unlocked /> : selectedPlan === "PREMIUM" ? <><PremiumBadge selected /><span>Pagamento somente na revisão final</span></> : <span>Grátis · até 2 fotos, link e QR Code</span>}
              {!publishedLetter && premiumStatus === "FREE" ? <button type="button" onClick={() => setSelectedPlan(null)} className="min-h-10 rounded-full border border-[#d9bfc9] bg-white/70 px-4 font-semibold text-[#84465d]">Trocar plano</button> : null}
            </div>
            {planNotice ? <p className="mt-3 text-xs leading-5 text-[#806270]" role="status">{planNotice}</p> : null}
            {storageError && <p className="mt-3 text-xs leading-5 text-[#a04e65]" role="status">{storageError}</p>}
            {!identity && <p className="mt-3 text-sm text-[#8a6978]" role="status">Preparando seu rascunho...</p>}
          </div>

          <div className="mt-7 grid items-start gap-7 xl:grid-cols-[minmax(0,1fr)_460px] xl:gap-10">
            {publishedLetter ? <div className="space-y-5"><PublishedSuccess letter={publishedLetter} /><p className="text-center text-xs leading-5 text-[#906b7c]">Sua cartinha foi publicada. Esta compra Premium, quando realizada, vale apenas para esta cartinha.</p><button type="button" onClick={startAnotherLetter} className="min-h-12 w-full rounded-full border border-[#d9bfc9] bg-white px-5 text-sm font-semibold text-[#84465d]">Criar outra cartinha</button></div> : <fieldset disabled={!identity || isPublishing} className="min-w-0 border-0 p-0"><EditorPanel
              draft={draft}
              currentStep={currentStep}
              onDraftChange={updateDraft}
              onStepChange={changeStep}
              onPreview={openPreview}
              onPublish={publishLetter}
              isPublishing={isPublishing}
              publishError={publishError}
              publishedLetter={publishedLetter}
              isPremium={premiumFeaturesEnabled}
              premiumPaid={isPremium}
              premiumSelected={selectedPlan === "PREMIUM"}
              onUpgrade={choosePremiumFromFeature}
              onCheckout={openFinalCheckout}
            /></fieldset>}

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
      {identity && <PremiumCheckout key={identity.requestKey} open={checkoutOpen} reason={upgradeReason} letterId={letterId} ownerToken={identity.ownerToken} isPremium={isPremium} ensureDraft={ensureDraft} onClose={closeCheckout} onStatus={onPremiumStatus} />}
    </div>
  );
}
