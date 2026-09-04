import { CheckIcon } from "@/components/ui/icons";

export const creatorSteps = [
  { label: "Sua história", shortLabel: "História" },
  { label: "Fotos e memórias", shortLabel: "Fotos" },
  { label: "Estilo e detalhes", shortLabel: "Estilo" },
  { label: "Revisar", shortLabel: "Revisar" },
];

type StepNavigationProps = {
  currentStep: number;
  onChange: (step: number) => void;
};

export function StepNavigation({ currentStep, onChange }: StepNavigationProps) {
  const progress = ((currentStep + 1) / creatorSteps.length) * 100;

  return (
    <nav aria-label="Etapas de criação" className="mt-7 sm:mt-9">
      <ol className="grid grid-cols-4 gap-2 sm:gap-4">
        {creatorSteps.map((step, index) => {
          const isCurrent = index === currentStep;
          const isComplete = index < currentStep;

          return (
            <li key={step.label}>
              <button
                type="button"
                onClick={() => onChange(index)}
                aria-current={isCurrent ? "step" : undefined}
                className={`group flex w-full flex-col items-center gap-2 rounded-xl px-1 py-1.5 text-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#963b57] sm:flex-row sm:justify-center sm:gap-2.5 sm:px-3 ${
                  isCurrent ? "text-[#6a263b]" : "text-[#9a838a] hover:text-[#6a263b]"
                }`}
              >
                <span
                  className={`grid size-7 shrink-0 place-items-center rounded-full text-[10px] font-bold transition-colors ${
                    isCurrent
                      ? "bg-[#8f304c] text-white shadow-[0_5px_14px_rgba(111,35,57,0.2)]"
                      : isComplete
                        ? "bg-[#eedde2] text-[#812b45]"
                        : "border border-[#deced2] bg-white text-[#967a83]"
                  }`}
                >
                  {isComplete ? <CheckIcon className="size-3.5" aria-hidden="true" /> : index + 1}
                </span>
                <span className="text-[10px] font-semibold sm:hidden">{step.shortLabel}</span>
                <span className="hidden text-xs font-semibold sm:inline lg:text-sm">{step.label}</span>
              </button>
            </li>
          );
        })}
      </ol>
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-[#eadfe1]">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,#a94c67,#733047)] transition-[width] duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </nav>
  );
}
