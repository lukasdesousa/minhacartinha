import { Brand } from "@/components/ui/brand";
import { EyeIcon } from "@/components/ui/icons";

type CreatorHeaderProps = {
  onPreview: () => void;
};

export function CreatorHeader({ onPreview }: CreatorHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#e9dde0] bg-[#fcfaf8]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-[1480px] items-center justify-between px-4 sm:px-8 lg:px-10">
        <Brand href="/" />
        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-2 text-xs font-medium text-[#8a7079] md:flex">
            <span className="size-2 rounded-full bg-[#6f9b69]" aria-hidden="true" />
            Alterações nesta sessão
          </span>
          <button
            type="button"
            onClick={onPreview}
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#d9c9cd] bg-white px-4 text-xs font-semibold text-[#663646] shadow-[0_5px_18px_rgba(70,28,40,0.06)] transition-all hover:-translate-y-0.5 hover:border-[#b98b98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#963b57] max-[359px]:size-10 max-[359px]:justify-center max-[359px]:px-0 sm:text-sm"
          >
            <EyeIcon className="size-4" aria-hidden="true" />
            <span className="max-[359px]:sr-only">Ver prévia</span>
          </button>
        </div>
      </div>
    </header>
  );
}
