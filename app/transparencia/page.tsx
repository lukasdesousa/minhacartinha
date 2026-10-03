import type { Metadata } from "next";
import Link from "next/link";
import { Brand } from "@/components/ui/brand";
import { HeartIcon } from "@/components/ui/icons";
import { TransferGallery } from "@/components/transparency/transfer-gallery";
import { formatBRL } from "@/lib/transparency/accounting";
import { documentedTransfers, periodKey, transferPeriodLabel, type DonationTransfer } from "@/lib/transparency/transfers";
import { getTransparencyReport } from "@/lib/transparency/queries";
import { createPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = createPageMetadata({
  title: "Transparência da causa animal",
  description: "Acompanhe os repasses do Minha Cartinha para a causa animal, com períodos, valores e comprovantes publicados.",
  path: "/transparencia",
});

const timeZone = "America/Fortaleza";
const monthFormatter = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric", timeZone });
const dateFormatter = new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeStyle: "short", timeZone });

function currentPeriod() {
  const parts = new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", timeZone }).formatToParts(new Date());
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? "";
  const monthNumber = Number(get("month"));
  const year = Number(get("year"));
  return { key: periodKey(monthNumber, year), year, label: monthFormatter.format(new Date(Date.UTC(year, monthNumber - 1, 1))) };
}

function latestTransfer(transfers: DonationTransfer[]) {
  return [...transfers].sort((a, b) => (b.transferredAt ?? "").localeCompare(a.transferredAt ?? ""))[0];
}

function StatusBadge({ status }: { status: DonationTransfer["status"] }) {
  const complete = status === "COMPLETED";
  return <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.12em] ${complete ? "bg-[#e6eee0] text-[#526443]" : "bg-[#fbecd8] text-[#926538]"}`}><span className={`size-1.5 rounded-full ${complete ? "bg-[#6e885a]" : "bg-[#cf9146]"}`} aria-hidden="true" />{complete ? "Repasse realizado" : "Em andamento"}</span>;
}

export default async function TransparencyPage() {
  const report = await getTransparencyReport();
  const completedTransfers = documentedTransfers.filter((transfer) => transfer.status === "COMPLETED");
  const totalDonatedCents = completedTransfers.reduce((total, transfer) => total + (transfer.amountCents ?? 0), 0);
  const latest = latestTransfer(completedTransfers);
  const current = currentPeriod();
  const currentMonthName = current.label.split(" de ")[0];
  const hasClosedCurrentPeriod = completedTransfers.some((transfer) => transfer.year === current.year && transfer.month.toLocaleLowerCase("pt-BR") === currentMonthName);
  const currentAllocatedCents = report.available ? report.monthlyAllocatedCents[current.key] ?? 0 : null;

  return (
    <div className="min-h-screen bg-[#fcfaf8] text-[#4f3942]">
      <header className="border-b border-[#e9e0de] bg-white/75">
        <a href="#conteudo" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:p-3">Pular para o conteúdo</a>
        <nav aria-label="Navegação principal" className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8"><Brand /><Link href="/" className="inline-flex min-h-11 items-center text-sm font-semibold text-[#855266] underline-offset-4 hover:underline">Voltar ao início</Link></nav>
      </header>

      <main id="conteudo" className="mx-auto max-w-6xl px-5 pb-20 sm:px-8 sm:pb-28">
        <section className="mx-auto max-w-3xl py-16 text-center sm:py-20">
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#e9ede2] text-[#667352]" aria-hidden="true"><HeartIcon className="size-6" /></span>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-[#727b60]">Prestação de contas</p>
          <h1 className="mt-4 font-serif text-5xl font-semibold leading-[1.03] tracking-[-0.04em] text-[#47523e] sm:text-6xl">Transparência que se pode acompanhar.</h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#6e7565]">Parte da receita do Minha Cartinha é destinada à causa animal. Aqui, cada repasse publicado tem período, valor e documentos para consulta.</p>
        </section>

        <section aria-label="Resumo dos repasses" className="grid gap-4 sm:grid-cols-3">
          <article className="rounded-3xl border border-[#e7dbdf] bg-white p-6 sm:p-7"><p className="text-sm font-medium text-[#80626e]">Total destinado à causa animal</p><p className="mt-3 font-serif text-4xl font-semibold tracking-tight text-[#512c3a]">{formatBRL(totalDonatedCents)}</p><p className="mt-3 text-xs leading-6 text-[#89737d]">Soma dos repasses realizados e documentados.</p></article>
          <article className="rounded-3xl border border-[#e1e4d8] bg-[#f0f2eb] p-6 sm:p-7"><p className="text-sm font-medium text-[#657052]">Último repasse</p><p className="mt-3 font-serif text-3xl font-semibold tracking-tight text-[#4a5540]">{latest ? formatBRL(latest.amountCents ?? 0) : "—"}</p><p className="mt-3 text-xs leading-6 text-[#69735d]">{latest ? transferPeriodLabel(latest) : "Nenhum repasse publicado ainda."}</p></article>
          <article className="rounded-3xl border border-[#e7dbdf] bg-white p-6 sm:p-7"><p className="text-sm font-medium text-[#80626e]">Repasses realizados</p><p className="mt-3 font-serif text-4xl font-semibold tracking-tight text-[#512c3a]">{completedTransfers.length}</p><p className="mt-3 text-xs leading-6 text-[#89737d]">Cada período é registrado separadamente.</p></article>
        </section>

        <section aria-labelledby="periodos-title" className="mt-14 sm:mt-16"><div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8a6573]">Por período</p><h2 id="periodos-title" className="mt-2 font-serif text-4xl font-semibold tracking-tight text-[#512c3a]">Repasses e acompanhamento mensal</h2><p className="mt-3 text-sm leading-7 text-[#79616b]">Os valores de meses fechados não se misturam ao acompanhamento do mês em andamento.</p></div>
          <div className="mt-7 space-y-6">
            {completedTransfers.map((transfer) => <article key={transfer.id} className="overflow-hidden rounded-[2rem] border border-[#e7dbdf] bg-white shadow-[0_16px_50px_-38px_rgba(80,42,55,0.42)]"><div className="border-b border-[#eee5e6] bg-[#fffafa] px-6 py-5 sm:flex sm:items-start sm:justify-between sm:px-8"><div><p className="text-xs font-bold uppercase tracking-[0.17em] text-[#8a6573]">{transferPeriodLabel(transfer)}</p><h3 className="mt-2 font-serif text-3xl font-semibold text-[#512c3a]">{formatBRL(transfer.amountCents ?? 0)}</h3></div><div className="mt-4 sm:mt-0"><StatusBadge status={transfer.status} /></div></div><div className="p-6 sm:p-8"><p className="text-sm leading-7 text-[#79616b]">{transfer.description}</p><dl className="mt-6 grid gap-5 border-y border-[#eee5e6] py-5 text-sm sm:grid-cols-2"><div><dt className="text-xs font-bold uppercase tracking-[0.12em] text-[#977b86]">Destinado a</dt><dd className="mt-2 font-semibold text-[#583b49]">{transfer.recipientUrl ? <a href={transfer.recipientUrl} target="_blank" rel="noopener noreferrer" className="underline decoration-[#c99aa9] underline-offset-4 hover:text-[#7f4b61]">{transfer.recipient}<span className="sr-only"> (Instagram, abre em nova aba)</span></a> : transfer.recipient ?? "Não informado"}</dd></div>{transfer.transferredAt && <div><dt className="text-xs font-bold uppercase tracking-[0.12em] text-[#977b86]">PIX realizado em</dt><dd className="mt-2 font-semibold text-[#583b49]"><time dateTime={transfer.transferredAt}>{dateFormatter.format(new Date(transfer.transferredAt))}</time></dd></div>}</dl><TransferGallery recipientImage={transfer.recipientImage} pixProof={transfer.pixProof} /></div></article>)}
            {!hasClosedCurrentPeriod && <article className="rounded-[2rem] border border-[#eadfcf] bg-[#fffaf2] p-6 sm:p-8"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><p className="text-xs font-bold uppercase tracking-[0.17em] text-[#9a7146]">{current.label}</p><h3 className="mt-2 font-serif text-3xl font-semibold text-[#6f4b31]">{currentAllocatedCents === null ? "Indisponível" : formatBRL(currentAllocatedCents)}</h3><p className="mt-2 text-sm leading-7 text-[#87684a]">Valor destinado até o momento neste período.</p></div><StatusBadge status="IN_PROGRESS" /></div><p className="mt-6 border-t border-[#eedfca] pt-5 text-sm leading-7 text-[#87684a]">O valor do mês é calculado apenas a partir dos pagamentos confirmados deste período. Quando o repasse for realizado, o comprovante será publicado aqui e o próximo mês começará sua própria contagem.</p></article>}
          </div>
        </section>

        <section aria-labelledby="historico-title" className="mt-14 border-t border-[#e9dfe2] pt-10 sm:mt-16"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8a6573]">Arquivo público</p><h2 id="historico-title" className="mt-2 font-serif text-3xl font-semibold tracking-tight text-[#512c3a]">Histórico de repasses</h2><div className="mt-6 overflow-hidden rounded-2xl border border-[#e7dbdf] bg-white"><div className="grid grid-cols-[1fr_auto] gap-4 border-b border-[#eee5e6] bg-[#fffafa] px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-[#8c707a] sm:grid-cols-[1fr_10rem_9rem]"><span>Período</span><span className="hidden sm:block">Valor</span><span>Status</span></div>{completedTransfers.map((transfer) => <div key={transfer.id} className="grid grid-cols-[1fr_auto] gap-4 px-5 py-4 text-sm sm:grid-cols-[1fr_10rem_9rem]"><span className="font-semibold text-[#583b49]">{transfer.month}/{transfer.year}</span><span className="hidden font-semibold text-[#583b49] sm:block">{formatBRL(transfer.amountCents ?? 0)}</span><span className="text-right text-xs font-bold text-[#587047] sm:text-left">Realizado <span className="sm:hidden">· {formatBRL(transfer.amountCents ?? 0)}</span></span></div>)}{!hasClosedCurrentPeriod && <div className="grid grid-cols-[1fr_auto] gap-4 border-t border-[#eee5e6] px-5 py-4 text-sm sm:grid-cols-[1fr_10rem_9rem]"><span className="font-semibold text-[#583b49]">{current.label}</span><span className="hidden font-semibold text-[#583b49] sm:block">{currentAllocatedCents === null ? "—" : formatBRL(currentAllocatedCents)}</span><span className="text-right text-xs font-bold text-[#9a7146] sm:text-left">Em andamento <span className="sm:hidden">· {currentAllocatedCents === null ? "—" : formatBRL(currentAllocatedCents)}</span></span></div>}</div></section>

        <section aria-labelledby="criterio-title" className="mt-14 rounded-[2rem] border border-[#e1e4d8] bg-[#f0f2eb] p-6 sm:mt-16 sm:p-9"><h2 id="criterio-title" className="font-serif text-3xl font-semibold tracking-tight text-[#4a5540]">Como o acompanhamento funciona</h2><div className="mt-4 max-w-3xl space-y-3 text-sm leading-7 text-[#656d5a]"><p>Consideramos pagamentos Premium reais aprovados, descontando reembolsos e estornos. Aplicamos 15% à base de cada pagamento e registramos valores em centavos.</p><p>Um valor destinado é um compromisso de repasse; ele só entra no total destinado após o repasse realizado e documentado. Os arquivos exibidos podem ser ampliados e baixados em seu formato original.</p>{!report.available && <p role="status" className="rounded-xl bg-white/70 px-4 py-3">O cálculo do período atual está temporariamente indisponível. Os comprovantes já publicados continuam acessíveis.</p>}</div></section>
      </main>
    </div>
  );
}
