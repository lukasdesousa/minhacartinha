import Link from "next/link";
import { HeartIcon } from "@/components/ui/icons";

type BrandProps = {
  inverted?: boolean;
  href?: string;
};

export function Brand({ inverted = false, href = "#inicio" }: BrandProps) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2.5 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9d415b]"
      aria-label="Minha Cartinha — voltar ao início"
    >
      <span
        className={`grid size-9 place-items-center rounded-full transition-transform duration-300 group-hover:-rotate-6 ${
          inverted ? "bg-white/12 text-[#f8dce3]" : "bg-[#f3e2e6] text-[#8d304b]"
        }`}
      >
        <HeartIcon className="size-4.5" aria-hidden="true" />
      </span>
      <span
        className={`font-serif text-[1.55rem] font-semibold leading-none tracking-[-0.035em] ${
          inverted ? "text-white" : "text-[#471d29]"
        }`}
      >
        Minha Cartinha
      </span>
    </Link>
  );
}
