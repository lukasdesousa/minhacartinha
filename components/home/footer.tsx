import Link from "next/link";
import { ManageCookiesButton } from "@/components/privacy/manage-cookies-button";
import { Brand } from "@/components/ui/brand";
import { HeartIcon } from "@/components/ui/icons";

const linkClass = "underline-offset-4 hover:text-[#873d54] hover:underline focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9d415b]";

export function Footer() {
  return (
    <footer className="border-t border-[#eadfe1] bg-white py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-5 text-center sm:px-8 lg:flex-row lg:px-10 lg:text-left">
        <div className="flex flex-col items-center gap-3 lg:items-start">
          <Brand href="/" />
          <p className="flex flex-wrap items-center justify-center gap-1.5 text-xs text-[#8b727a]">
            © {new Date().getFullYear()} Minha Cartinha. Feito com
            <HeartIcon className="size-3.5 fill-[#e5b2bf] text-[#a84d66]" aria-label="amor" />
            para histórias reais.
          </p>
        </div>
        <nav aria-label="Informações institucionais" className="flex max-w-2xl flex-wrap items-center justify-center gap-x-5 gap-y-3 text-xs font-semibold text-[#785c66] lg:justify-end">
          <Link href="/termos" className={linkClass}>Termos de Uso</Link>
          <Link href="/privacidade" className={linkClass}>Privacidade</Link>
          <Link href="/cookies" className={linkClass}>Cookies</Link>
          <Link href="/transparencia" className={linkClass}>Transparência</Link>
          <Link href="/denunciar" className={linkClass}>Denunciar conteúdo</Link>
          <ManageCookiesButton className={linkClass} />
          <Link href="/criar" className={`${linkClass} w-full font-bold text-[#873d54] sm:w-auto`}>Criar uma cartinha grátis</Link>
        </nav>
      </div>
    </footer>
  );
}
