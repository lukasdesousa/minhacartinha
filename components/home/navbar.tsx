import { Brand } from "@/components/ui/brand";
import { ButtonLink } from "@/components/ui/button-link";

export function Navbar() {
  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <a
        href="#conteudo"
        className="sr-only left-5 top-4 z-[60] rounded-full bg-white px-4 py-2 text-sm font-bold text-[#6e2b40] shadow-lg focus:not-sr-only focus:absolute"
      >
        Pular para o conteúdo
      </a>
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10"
        aria-label="Navegação principal"
      >
        <Brand />
        <div className="hidden items-center gap-8 md:flex">
          <a
            className="text-sm font-medium text-[#745761] transition-colors hover:text-[#8e2f4b] focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9d415b]"
            href="#como-funciona"
          >
            Como funciona
          </a>
          <a
            className="text-sm font-medium text-[#745761] transition-colors hover:text-[#8e2f4b] focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9d415b]"
            href="#beneficios"
          >
            Por que criar
          </a>
        </div>
        <div className="hidden sm:block">
          <ButtonLink href="/criar">Criar cartinha grátis</ButtonLink>
        </div>
        <a
          href="/criar"
          className="grid size-11 place-items-center rounded-full bg-[#8e2f4b] text-white shadow-[0_8px_22px_rgba(102,29,51,0.2)] transition-colors hover:bg-[#76243d] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9d415b] sm:hidden"
          aria-label="Criar minha cartinha grátis"
        >
          <span className="text-xl leading-none" aria-hidden="true">
            +
          </span>
        </a>
      </nav>
    </header>
  );
}
