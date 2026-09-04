import type { FormEvent } from "react";
import type { LetterDraft } from "@/components/create/types";
import type { CreateLetterResponse } from "@/lib/letters/contracts";
import { DetailsStep } from "@/components/create/steps/details-step";
import { PhotosStep } from "@/components/create/steps/photos-step";
import { ReviewStep } from "@/components/create/steps/review-step";
import { StoryStep } from "@/components/create/steps/story-step";
import { creatorSteps } from "@/components/create/step-navigation";
import { ArrowIcon, ChevronLeftIcon, EyeIcon } from "@/components/ui/icons";

const stepDetails = [
  {
    eyebrow: "Etapa 1",
    title: "Conte a história de vocês",
    description: "Comece com as palavras que você gostaria que essa pessoa guardasse para sempre.",
  },
  {
    eyebrow: "Etapa 2",
    title: "Dê rosto às memórias",
    description: "Escolha as imagens que transformam lembranças em pequenos lugares para voltar.",
  },
  {
    eyebrow: "Etapa 3",
    title: "Cuide dos últimos detalhes",
    description: "Defina a atmosfera, as frases e os elementos que deixam tudo com a cara de vocês.",
  },
  {
    eyebrow: "Etapa 4",
    title: "Revise com carinho",
    description: "Confira a experiência por inteiro e publique quando tudo estiver do jeitinho de vocês.",
  },
];

type EditorPanelProps = {
  draft: LetterDraft;
  currentStep: number;
  onDraftChange: (patch: Partial<LetterDraft>) => void;
  onStepChange: (step: number) => void;
  onPreview: () => void;
  onPublish: () => Promise<void>;
  isPublishing: boolean;
  publishError: string;
  publishedLetter: CreateLetterResponse | null;
};

export function EditorPanel({
  draft,
  currentStep,
  onDraftChange,
  onStepChange,
  onPreview,
  onPublish,
  isPublishing,
  publishError,
  publishedLetter,
}: EditorPanelProps) {
  const details = stepDetails[currentStep];

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (currentStep < creatorSteps.length - 1) {
      onStepChange(currentStep + 1);
    } else {
      onPreview();
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="overflow-hidden rounded-[1.75rem] border border-[#e7dcde] bg-white shadow-[0_18px_55px_rgba(67,28,40,0.07)] sm:rounded-[2rem]"
    >
      <header className="border-b border-[#eee5e7] px-5 py-6 sm:px-8 sm:py-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a04d65]">{details.eyebrow}</p>
        <h2 className="mt-2 font-serif text-[2.15rem] font-semibold leading-none tracking-[-0.035em] text-[#4d202e] sm:text-[2.65rem]">
          {details.title}
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-[#887078]">{details.description}</p>
      </header>

      <div key={currentStep} className="reveal px-5 py-7 sm:px-8 sm:py-9">
        {currentStep === 0 ? <StoryStep draft={draft} onChange={onDraftChange} /> : null}
        {currentStep === 1 ? <PhotosStep draft={draft} onChange={onDraftChange} /> : null}
        {currentStep === 2 ? <DetailsStep draft={draft} onChange={onDraftChange} /> : null}
        {currentStep === 3 ? (
          <ReviewStep
            draft={draft}
            onPreview={onPreview}
            onPublish={onPublish}
            isPublishing={isPublishing}
            publishError={publishError}
            publishedLetter={publishedLetter}
          />
        ) : null}
      </div>

      <footer className="flex items-center justify-between gap-3 border-t border-[#eee5e7] bg-[#fdfafa] px-5 py-4 sm:px-8 sm:py-5">
        {currentStep > 0 ? (
          <button
            type="button"
            onClick={() => onStepChange(currentStep - 1)}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-[#805d68] transition-colors hover:text-[#63283a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#963b57] sm:px-4"
          >
            <ChevronLeftIcon className="size-4" aria-hidden="true" />
            Voltar
          </button>
        ) : (
          <span />
        )}

        <button
          type="submit"
          className="group inline-flex min-h-12 items-center gap-2 rounded-full bg-[#8e2f4b] px-5 text-sm font-bold text-white shadow-[0_10px_25px_rgba(105,31,52,0.2)] transition-all hover:-translate-y-0.5 hover:bg-[#76243d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#963b57] sm:px-6"
        >
          {currentStep === creatorSteps.length - 1 ? (
            <>
              <EyeIcon className="size-4" aria-hidden="true" />
              Ver cartinha pronta
            </>
          ) : (
            <>
              Continuar
              <ArrowIcon className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </>
          )}
        </button>
      </footer>
    </form>
  );
}
