import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/home/footer";
import { Brand } from "@/components/ui/brand";
import { ArrowIcon, HeartIcon } from "@/components/ui/icons";
import { createPageMetadata } from "@/lib/seo";
import { allocationBasisLabels, formatBRL } from "@/lib/transparency/accounting";
import { getTransparencyReport } from "@/lib/transparency/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createPageMetadata({
  title: "Transparência e causa animal",
  description: "Conheça o compromisso do Minha Cartinha com a causa animal: como calculamos os 15%, valores destinados, doações realizadas e comprovantes.",
  path: "/transparencia",
});

const formatDate = (date: Date) => new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeZone: "America/Fortaleza" }).format(date);

export default async function TransparencyPage() {
  const report = await getTransparencyReport();
  const institutions = report.available
    ? [...new Map(report.donations.map(({ institution }) => [institution.id, institution])).values()]
    : [];

  return (
    <div className="min-h-screen bg-[#fcfaf8] text-[#4f3942]">
      <header className="border-b border-[#e9e0de] bg-white/75">
        <a href="#conteudo" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:p-3">Pular para o conteúdo</a>
        <nav aria-label="Navegação principal" className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <Brand />
          <Link href="/" className="inline-flex min-h-11 items-center text-sm font-semibold text-[#855266] underline-offset-4 hover:underline">Voltar ao início</Link>
        </nav>
      </header>
      <main id="conteudo" className="mx-auto max-w-5xl px-5 pb-20 sm:px-8 sm:pb-28">
        <div className="mx-auto max-w-3xl py-16 text-center sm:py-20">
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#e9ede2] text-[#667352]" aria-hidden="true"><HeartIcon className="size-6" /></span>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-[#727b60]">Amor que vai além da cartinha</p>
          <h1 className="mt-4 font-serif text-5xl font-semibold leading-[1.03] tracking-[-0.04em] text-[#47523e] sm:text-6xl">Nosso carinho também tem um compromisso.</h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#6e7565]">15% dos ganhos do Minha Cartinha são destinados a apoiar instituições que cuidam e protegem animais de rua.</p>
        </div>

        <section aria-labelledby="compromisso-title" className="rounded-[2rem] border border-[#e1e4d8] bg-[#f0f2eb] p-6 sm:p-9">
          <h2 id="compromisso-title" className="font-serif text-3xl font-semibold tracking-tight text-[#4a5540]">Nosso compromisso</h2>
          <p className="mt-4 text-sm leading-7 text-[#656d5a]">Esta é uma iniciativa permanente do Minha Cartinha. Aqui você acompanha o valor calculado para a causa e, separadamente, os repasses que já foram realizados e possuem comprovantes publicados.</p>
          <p className="mt-3 text-sm leading-7 text-[#656d5a]">Um valor destinado é um compromisso de repasse. Ele só aparece como doado depois do registro de uma doação real, com o comprovante revisado.</p>
        </section>

        <section aria-labelledby="valores-title" className="mt-14 sm:mt-16">
          <h2 id="valores-title" className="font-serif text-3xl font-semibold tracking-tight text-[#512c3a]">Valores destinados</h2>
          <p className="mt-3 text-sm leading-7 text-[#7c6570]">Acumulado da iniciativa, conforme os pagamentos confirmados e comprovantes publicados.</p>
          {report.available ? (
            <>
              <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  ["Total considerado para a iniciativa", report.summary.consideredCents, "Base de cálculo após os ajustes aplicáveis."],
                  ["15% destinado", report.summary.allocatedCents, "Valor calculado para a causa animal."],
                  ["Total já doado", report.summary.donatedCents, "Repasses com comprovantes revisados e publicados."],
                  ["Saldo reservado", report.summary.reservedCents, "Valor destinado que ainda aguarda repasse."],
                ].map(([label, cents, explanation]) => (
                  <div key={String(label)} className="rounded-3xl border border-[#e7dbdf] bg-white p-6 sm:p-7">
                    <dt className="text-sm font-medium text-[#80626e]">{label}</dt>
                    <dd className="mt-3 font-serif text-4xl font-semibold tracking-tight text-[#512c3a]">{formatBRL(Number(cents))}</dd>
                    <dd className="mt-3 text-xs leading-6 text-[#89737d]">{explanation}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-5 text-xs leading-6 text-[#806d75]">Receita Premium aprovada, após reembolsos e estornos: {formatBRL(report.summary.premiumRevenueCents)}. Consulta em {formatDate(report.updatedAt)}. O saldo reservado representa o compromisso contábil pendente de repasse.</p>
              {report.summary.awaitingFeesCount > 0 && <p className="mt-3 rounded-2xl bg-[#f7efe0] px-4 py-3 text-sm leading-6 text-[#856643]">Há {report.summary.awaitingFeesCount} pagamento(s) aguardando conciliação das taxas. Sua destinação será contabilizada quando a base estiver confirmada.</p>}
              {report.summary.donatedAboveAllocationCents > 0 && <p className="mt-3 rounded-2xl bg-[#f0f2eb] px-4 py-3 text-sm leading-6 text-[#657052]">As doações comprovadas superam a destinação calculada atual em {formatBRL(report.summary.donatedAboveAllocationCents)}. Ajustes posteriores, como reembolsos, podem reduzir a base; os repasses já feitos continuam registrados.</p>}
            </>
          ) : (
            <p role="status" className="mt-6 rounded-3xl border border-[#e7dbdf] bg-white p-6 text-sm leading-7 text-[#7c6570]">Os números estão temporariamente indisponíveis. Volte em instantes para consultar os valores e comprovantes. Nosso compromisso e os critérios de cálculo estão descritos nesta página.</p>
          )}
        </section>

        <section aria-labelledby="calculo-title" className="mt-14 border-t border-[#e9dfe2] pt-10 sm:mt-16">
          <h2 id="calculo-title" className="font-serif text-3xl font-semibold tracking-tight text-[#512c3a]">Como calculamos</h2>
          <div className="mt-5 space-y-4 text-sm leading-7 text-[#79616b]">
            <p><strong className="font-semibold text-[#61424e]">Critério operacional atual: </strong>{report.currentBasis ? `${allocationBasisLabels[report.currentBasis]}.` : "A configuração do critério está temporariamente indisponível."} A definição contábil formal ainda será consolidada; este é o critério utilizado para acompanhar o compromisso da iniciativa.</p>
            <p>Consideramos apenas pagamentos reais aprovados. Pix pendentes, expirados, rejeitados ou cancelados e transações de teste não entram na conta. Reembolsos, inclusive parciais, e estornos reduzem a base. Contestações com estorno também deixam de compor a receita.</p>
            <p>Aplicamos 15% à base de cada pagamento, arredondando ao centavo mais próximo, e somamos os resultados. Valores destinados e doados são registrados separadamente. No critério que desconta taxas, aguardamos a informação real do provedor antes de calcular a destinação.</p>
            <p>O critério fica registrado em cada compra. Uma alteração futura vale para novas compras e será informada aqui, preservando o histórico das anteriores.</p>
          </div>
          {report.available && Object.values(report.summary.bases).some((amount) => amount > 0) && (
            <dl className="mt-5 rounded-2xl border border-[#e9dfe2] p-5 text-xs leading-6 text-[#806d75]">
              {Object.entries(report.summary.bases).filter(([, cents]) => cents > 0).map(([basis, cents]) => (
                <div key={basis} className="flex flex-col justify-between gap-1 py-1 sm:flex-row sm:gap-5">
                  <dt>{allocationBasisLabels[basis as keyof typeof allocationBasisLabels]}</dt>
                  <dd className="shrink-0 font-semibold">{formatBRL(cents)}</dd>
                </div>
              ))}
            </dl>
          )}
        </section>

        <section aria-labelledby="doacoes-title" className="mt-14 border-t border-[#e9dfe2] pt-10 sm:mt-16">
          <h2 id="doacoes-title" className="font-serif text-3xl font-semibold tracking-tight text-[#512c3a]">Doações realizadas</h2>
          {!report.available ? <p className="mt-4 text-sm leading-7 text-[#79616b]">Os registros estão temporariamente indisponíveis.</p> : report.donations.length === 0 ? (
            <p className="mt-5 rounded-3xl border border-dashed border-[#dacbd0] bg-white/50 p-6 text-sm leading-7 text-[#79616b]">Ainda não há doações registradas com comprovantes publicados. Os repasses serão apresentados aqui assim que forem realizados e documentados.</p>
          ) : (
            <div className="mt-6 space-y-4">
              {report.donations.map((donation) => (
                <article key={donation.id} className="rounded-3xl border border-[#e7dbdf] bg-white p-6 sm:p-7">
                  <div className="flex flex-col justify-between gap-3 sm:flex-row">
                    <div><h3 className="font-serif text-2xl font-semibold text-[#512c3a]">{donation.institution.name}</h3><time dateTime={donation.donatedAt.toISOString()} className="mt-2 block text-xs text-[#87727c]">{formatDate(donation.donatedAt)}</time></div>
                    <p className="font-serif text-3xl font-semibold text-[#5f7050]">{formatBRL(donation.amountCents)}</p>
                  </div>
                  <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[#79616b]">{donation.description}</p>
                  {donation.note && <p className="mt-3 whitespace-pre-line text-xs leading-6 text-[#8a747e]">{donation.note}</p>}
                  <a href={donation.receiptUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#835066] underline-offset-4 hover:underline">Ver comprovante <span className="sr-only">da doação para {donation.institution.name} (abre em nova aba)</span><ArrowIcon className="size-4" aria-hidden="true" /></a>
                </article>
              ))}
            </div>
          )}
        </section>

        <div className="mt-14 grid gap-9 border-t border-[#e9dfe2] pt-10 sm:mt-16 md:grid-cols-2 md:gap-12">
          <section aria-labelledby="instituicoes-title">
            <h2 id="instituicoes-title" className="font-serif text-2xl font-semibold text-[#512c3a]">Instituições apoiadas</h2>
            {institutions.length > 0 ? <ul className="mt-4 space-y-3 text-sm leading-7 text-[#79616b]">{institutions.map((institution) => <li key={institution.id}>{institution.websiteUrl ? <a href={institution.websiteUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">{institution.name}<span className="sr-only"> (abre em nova aba)</span></a> : institution.name}</li>)}</ul> : <p className="mt-4 text-sm leading-7 text-[#79616b]">{report.available ? "As instituições aparecerão nesta lista conforme receberem doações com comprovantes publicados." : "A lista será exibida quando os registros estiverem disponíveis."}</p>}
          </section>
          <section aria-labelledby="comprovantes-title">
            <h2 id="comprovantes-title" className="font-serif text-2xl font-semibold text-[#512c3a]">Comprovantes</h2>
            <p className="mt-4 text-sm leading-7 text-[#79616b]">Cada doação publicada tem um link para seu comprovante. Os documentos passam por revisão para ocultar CPF, endereços, dados bancários, chaves Pix pessoais e contatos privados antes da publicação.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
