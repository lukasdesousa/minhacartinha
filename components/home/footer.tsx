import { Brand } from "@/components/ui/brand";
import { HeartIcon } from "@/components/ui/icons";

export function Footer() {
  return (
    <footer className="border-t border-[#eadfe1] bg-white py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-5 text-center sm:flex-row sm:px-8 sm:text-left lg:px-10">
        <Brand />
        <p className="flex flex-wrap items-center justify-center gap-1.5 text-xs text-[#8b727a]">
          © {new Date().getFullYear()} Minha Cartinha. Feito com
          <HeartIcon className="size-3.5 fill-[#e5b2bf] text-[#a84d66]" aria-label="amor" />
          para histórias reais.
        </p>
      </div>
    </footer>
  );
}
