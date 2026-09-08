import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal/legal-page";
import { ManageCookiesButton } from "@/components/privacy/manage-cookies-button";
import { LEGAL_EFFECTIVE_DATE_LABEL, LEGAL_VERSIONS } from "@/lib/legal/config";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Política de Cookies",
  description: "Tecnologias locais e conteúdo externo usados pelo Minha Cartinha.",
  path: "/cookies",
});

export default function CookiesPage() {
  return (
    <LegalPage eyebrow="Controle de tecnologias locais" title="Política de Cookies" intro="O Minha Cartinha não instala cookies próprios de análise ou publicidade. Esta página descreve somente o armazenamento local encontrado no projeto e o player externo opcional do Spotify." version={`${LEGAL_VERSIONS.cookies} — vigente desde ${LEGAL_EFFECTIVE_DATE_LABEL}`}>
      <LegalSection title="1. O que foi encontrado">
        <p>Não foi identificado código que crie cookies próprios. Foram encontradas duas formas de armazenamento no navegador e um conteúdo externo opcional:</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-separate border-spacing-0 overflow-hidden rounded-2xl border border-[#e6d9dd] text-left text-xs">
            <thead className="bg-[#f7edef] text-[#5d3d49]"><tr><th className="p-3">Tecnologia</th><th className="p-3">Categoria</th><th className="p-3">Finalidade</th><th className="p-3">Duração</th></tr></thead>
            <tbody className="bg-white text-[#715b64]">
              <tr><td className="border-t border-[#eee4e7] p-3"><code>minhacartinha-editor</code> (IndexedDB)</td><td className="border-t border-[#eee4e7] p-3">Estritamente necessária</td><td className="border-t border-[#eee4e7] p-3">Preservar o rascunho, a credencial de edição e o estado da criação neste dispositivo.</td><td className="border-t border-[#eee4e7] p-3">Até substituição, limpeza pelo usuário/navegador ou indisponibilidade do armazenamento.</td></tr>
              <tr><td className="border-t border-[#eee4e7] p-3"><code>minhacartinha:consent:v1</code> (localStorage)</td><td className="border-t border-[#eee4e7] p-3">Estritamente necessária</td><td className="border-t border-[#eee4e7] p-3">Lembrar a escolha sobre conteúdo externo.</td><td className="border-t border-[#eee4e7] p-3">Até a escolha ser alterada ou os dados do navegador serem limpos.</td></tr>
              <tr><td className="border-t border-[#eee4e7] p-3">Player incorporado do Spotify</td><td className="border-t border-[#eee4e7] p-3">Conteúdo externo opcional</td><td className="border-t border-[#eee4e7] p-3">Reproduzir a faixa escolhida para a cartinha. Conecta o navegador ao Spotify, que pode usar suas próprias tecnologias.</td><td className="border-t border-[#eee4e7] p-3">O player só é carregado após permissão; cookies e durações do Spotify seguem a configuração e política desse serviço.</td></tr>
            </tbody>
          </table>
        </div>
      </LegalSection>

      <LegalSection title="2. Categorias que não são usadas atualmente">
        <p>Não foram identificados cookies ou scripts de Analytics, medição de audiência, publicidade comportamental, Google Ads, AdSense ou pixels de redes sociais. Por isso, o painel não apresenta controles fictícios para essas categorias.</p>
      </LegalSection>

      <LegalSection title="3. Como funciona sua escolha">
        <p>“Aceitar” permite o conteúdo externo do Spotify. “Recusar não essenciais” mantém o player bloqueado. “Preferências” oferece o mesmo controle sem marcar a opção antecipadamente. A recusa não impede criar, pagar, publicar ou ler uma cartinha; apenas substitui o player por um aviso.</p>
        <p>Scripts e iframes opcionais não são carregados antes da permissão. Se futuramente o projeto incorporar Analytics ou publicidade, essas categorias deverão ser adicionadas ao painel e permanecer bloqueadas até uma escolha válida, quando exigido.</p>
      </LegalSection>

      <LegalSection title="4. Altere sua decisão">
        <p>Use o botão abaixo ou “Gerenciar cookies” no rodapé. Limpar os dados do navegador também apaga a preferência e o rascunho local.</p>
        <ManageCookiesButton className="inline-flex min-h-11 items-center rounded-full bg-[#8e2f4b] px-5 text-sm font-bold text-white no-underline hover:bg-[#76243d]" />
      </LegalSection>
    </LegalPage>
  );
}
