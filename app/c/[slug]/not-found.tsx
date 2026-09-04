import Link from "next/link";

export default function PublicLetterNotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f7f2f0] px-6 text-center text-[#4d202e]">
      <div className="max-w-lg">
        <span className="mx-auto grid size-16 place-items-center rounded-3xl bg-[#f2e1e5] text-3xl" aria-hidden="true">💌</span>
        <p className="mt-7 text-xs font-bold uppercase tracking-[0.2em] text-[#9b4961]">Cartinha não encontrada</p>
        <h1 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">Este carinho não mora mais neste endereço.</h1>
        <p className="mt-4 text-sm leading-6 text-[#806871]">Confira se o link foi copiado por inteiro ou peça um novo acesso para quem criou a cartinha.</p>
        <Link href="/" className="mt-7 inline-flex min-h-12 items-center justify-center rounded-full bg-[#8e2f4b] px-6 text-sm font-bold text-white transition-colors hover:bg-[#76243d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#963b57]">Conhecer o Minha Cartinha</Link>
      </div>
    </main>
  );
}
