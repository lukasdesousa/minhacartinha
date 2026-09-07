"use client";

import { useRef, useState } from "react";
import type { LetterDraft } from "@/components/create/types";
import { PremiumBadge } from "@/components/create/premium-badge";
import { TextAreaField, TextField } from "@/components/create/form-controls";
import {
  MAX_LOVE_VOUCHERS,
  MAX_LOVE_WHEEL_OPTIONS,
  secureRandomIndex,
  type LoveVoucherInput,
  type LoveWheelOptionInput,
} from "@/lib/letters/romantic-features";
import { PREMIUM_PRICE_LABEL } from "@/lib/premium";

const smallButton = "min-h-10 rounded-full border border-[#ddcbd1] px-3 text-xs font-semibold text-[#7d4255] hover:bg-[#f9ecef] disabled:opacity-35";

function WheelEditorPreview({ title, options, background }: { title: string; options: LoveWheelOptionInput[]; background: string }) {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState("");
  const spinningRef = useRef(false);

  function spinPreview() {
    if (spinningRef.current || options.length < 2 || options.some((option) => !option.title.trim())) return;
    spinningRef.current = true;
    setSpinning(true);
    setResult("");
    const index = secureRandomIndex(options.length);
    const center = (index + 0.5) * 360 / options.length;
    setRotation(Math.ceil(rotation / 360) * 360 + 4 * 360 - center);
    window.setTimeout(() => {
      setResult(options[index].title);
      setSpinning(false);
      spinningRef.current = false;
    }, 2_700);
  }

  return <div className="rounded-3xl border border-[#eadde1] bg-[#fff8fa] p-5 text-center">
    <p className="font-serif text-xl font-semibold text-[#572536]">{title || "Título da sua roleta"}</p>
    <div className="relative mx-auto mt-5 w-fit"><span className="absolute left-1/2 top-[-10px] z-10 -translate-x-1/2 text-2xl text-[#572536]" aria-hidden="true">▼</span><div className="grid size-48 place-items-center rounded-full border-[10px] border-white shadow-[0_12px_30px_rgba(74,29,44,.16)]" style={{ background, transform: `rotate(${rotation}deg)`, transition: "transform 2.6s cubic-bezier(.12,.72,.12,1)" }}><span className="grid size-16 place-items-center rounded-full bg-white font-serif text-sm font-bold text-[#6f2b42]">Amor</span></div></div>
    <button type="button" disabled={spinning || options.length < 2 || options.some((option) => !option.title.trim())} onClick={spinPreview} className="mt-5 min-h-10 rounded-full bg-[#8e2f4b] px-5 text-xs font-bold text-white disabled:opacity-45">{spinning ? "Girando..." : "Testar roleta"}</button>
    <p className="mt-3 min-h-5 text-xs font-semibold text-[#7d4255]" role="status">{result ? `A prévia escolheu: ${result}` : options.some((option) => !option.title.trim()) ? "Preencha as opções para testar." : "Resultado apenas para prévia."}</p>
  </div>;
}

function LockedFeature({ kind, onUpgrade }: { kind: "vouchers" | "wheel"; onUpgrade: () => void }) {
  const vouchers = kind === "vouchers";
  return <div className="mt-5 rounded-3xl border border-[#e4d3d9] bg-[#fff8fa] p-5">
    {vouchers ? <div className="mx-auto max-w-sm rounded-2xl border-2 border-dashed border-[#c9879a] bg-white p-4 text-center shadow-sm">
      <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#a1576d]">Vale do Amor</p>
      <p className="mt-2 font-serif text-xl font-semibold text-[#572536]">Vale um jantar escolhido por você</p>
      <p className="mt-2 text-xs text-[#8d6c78]">1 uso · exemplo</p>
    </div> : <div className="mx-auto grid size-44 place-items-center rounded-full border-[10px] border-[#fff8fa] bg-[conic-gradient(#8e2f4b_0_25%,#d78da1_0_50%,#6d557b_0_75%,#e3b17e_0)] shadow-[0_12px_30px_rgba(74,29,44,.16)]">
      <span className="grid size-16 place-items-center rounded-full bg-white font-serif text-sm font-bold text-[#6f2b42]">Roleta</span>
    </div>}
    <p className="mt-4 text-sm leading-6 text-[#754f5e]">{vouchers ? "Crie vales personalizados para resgatar momentos a dois." : "Deixe a sorte escolher a próxima surpresa romântica."} Este recurso faz parte do Premium.</p>
    <button type="button" onClick={onUpgrade} className="mt-4 min-h-11 rounded-full bg-[#8e2f4b] px-5 text-xs font-bold text-white hover:bg-[#76243d]">Escolher Premium — {PREMIUM_PRICE_LABEL}</button>
  </div>;
}

function VoucherEditor({ draft, onChange }: { draft: LetterDraft; onChange: (patch: Partial<LetterDraft>) => void }) {
  function update(id: string, patch: Partial<LoveVoucherInput>) {
    onChange({ vouchers: draft.vouchers.map((item) => item.id === id ? { ...item, ...patch } : item) });
  }
  function move(index: number, direction: number) {
    const vouchers = [...draft.vouchers];
    [vouchers[index], vouchers[index + direction]] = [vouchers[index + direction], vouchers[index]];
    onChange({ vouchers });
  }
  return <>
    <label className="mt-5 flex min-h-12 cursor-pointer items-center gap-3 rounded-2xl border border-[#e4d3d9] bg-[#fff8fa] p-4 text-sm font-semibold text-[#633345]">
      <input type="checkbox" checked={draft.vouchersEnabled} onChange={(event) => onChange({ vouchersEnabled: event.target.checked, ...(event.target.checked && !draft.vouchers.length ? { vouchers: [{ id: crypto.randomUUID(), title: "", description: "", totalUses: 1 }] } : {}) })} className="size-4 accent-[#8e2f4b]" />
      Incluir Vales do Amor nesta cartinha
    </label>
    {draft.vouchersEnabled ? <div className="mt-5 space-y-5">
      {draft.vouchers.map((voucher, index) => <fieldset key={voucher.id} className="rounded-3xl border border-[#e5d6dc] bg-[#fffdfc] p-4 sm:p-5">
        <legend className="px-2 text-xs font-bold text-[#8a4860]">Vale {index + 1}</legend>
        <div className="grid gap-4">
          <TextField label="Título" maxLength={80} placeholder="Vale um café na cama" value={voucher.title} onChange={(event) => update(voucher.id, { title: event.target.value })} />
          <TextAreaField label="Descrição (opcional)" maxLength={180} rows={2} placeholder="Use quando quiser começar o dia com carinho." value={voucher.description} onChange={(event) => update(voucher.id, { description: event.target.value })} />
          <label className="text-sm font-semibold text-[#59303d]">Quantidade de usos
            <select value={voucher.totalUses ?? "unlimited"} onChange={(event) => update(voucher.id, { totalUses: event.target.value === "unlimited" ? null : Number(event.target.value) as 1 | 2 | 3 })} className="mt-2 w-full rounded-2xl border border-[#ded1d4] bg-[#fffdfc] px-4 py-3.5 text-sm text-[#4f2835] outline-none focus:border-[#9b4961]">
              <option value="1">1 uso</option><option value="2">2 usos</option><option value="3">3 usos</option><option value="unlimited">Ilimitado</option>
            </select>
          </label>
          <div className="rounded-2xl border-2 border-dashed border-[#d39aaa] bg-[#fff8fa] p-4 text-center"><p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#a1576d]">Vale do Amor</p><p className="mt-2 font-serif text-xl text-[#572536]">{voucher.title || "Seu vale aparece aqui"}</p><p className="mt-1 text-xs text-[#8d6c78]">{voucher.totalUses === null ? "Uso ilimitado" : `${voucher.totalUses} ${voucher.totalUses === 1 ? "uso" : "usos"}`}</p></div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2"><button type="button" className={smallButton} disabled={index === 0} onClick={() => move(index, -1)}>↑ Subir</button><button type="button" className={smallButton} disabled={index === draft.vouchers.length - 1} onClick={() => move(index, 1)}>↓ Descer</button><button type="button" className={`${smallButton} ml-auto`} onClick={() => onChange({ vouchers: draft.vouchers.filter((item) => item.id !== voucher.id) })}>Remover</button></div>
      </fieldset>)}
      <button type="button" className={smallButton} disabled={draft.vouchers.length >= MAX_LOVE_VOUCHERS} onClick={() => onChange({ vouchers: [...draft.vouchers, { id: crypto.randomUUID(), title: "", description: "", totalUses: 1 }] })}>+ Adicionar vale</button>
    </div> : null}
  </>;
}

function WheelEditor({ draft, onChange }: { draft: LetterDraft; onChange: (patch: Partial<LetterDraft>) => void }) {
  function update(id: string, patch: Partial<LoveWheelOptionInput>) { onChange({ loveWheelOptions: draft.loveWheelOptions.map((item) => item.id === id ? { ...item, ...patch } : item) }); }
  function move(index: number, direction: number) { const options = [...draft.loveWheelOptions]; [options[index], options[index + direction]] = [options[index + direction], options[index]]; onChange({ loveWheelOptions: options }); }
  const optionCount = Math.max(1, draft.loveWheelOptions.length);
  const colors = ["#8e2f4b", "#d78da1", "#6d557b", "#e3b17e", "#a96075", "#887099"];
  const wheelBackground = `conic-gradient(${Array.from({ length: optionCount }, (_, index) => `${colors[index % colors.length]} ${index * 100 / optionCount}% ${(index + 1) * 100 / optionCount}%`).join(",")})`;
  return <>
    <label className="mt-5 flex min-h-12 cursor-pointer items-center gap-3 rounded-2xl border border-[#e4d3d9] bg-[#fff8fa] p-4 text-sm font-semibold text-[#633345]">
      <input type="checkbox" checked={draft.loveWheelEnabled} onChange={(event) => onChange({ loveWheelEnabled: event.target.checked, ...(event.target.checked && draft.loveWheelOptions.length < 2 ? { loveWheelOptions: [{ id: crypto.randomUUID(), title: "", description: "" }, { id: crypto.randomUUID(), title: "", description: "" }] } : {}) })} className="size-4 accent-[#8e2f4b]" />
      Incluir Roleta do Amor nesta cartinha
    </label>
    {draft.loveWheelEnabled ? <div className="mt-5 space-y-4">
      <TextField label="Título da roleta" maxLength={80} placeholder="Roleta do nosso amor" value={draft.loveWheelTitle} onChange={(event) => onChange({ loveWheelTitle: event.target.value })} />
      <WheelEditorPreview title={draft.loveWheelTitle} options={draft.loveWheelOptions} background={wheelBackground} />
      {draft.loveWheelOptions.map((option, index) => <fieldset key={option.id} className="rounded-3xl border border-[#e5d6dc] bg-[#fffdfc] p-4 sm:p-5"><legend className="px-2 text-xs font-bold text-[#8a4860]">Opção {index + 1}</legend><div className="grid gap-4"><TextField label="Título" maxLength={80} placeholder="Noite de filmes" value={option.title} onChange={(event) => update(option.id, { title: event.target.value })} /><TextAreaField label="Descrição (opcional)" maxLength={180} rows={2} placeholder="Com pipoca e o filme escolhido por nós." value={option.description} onChange={(event) => update(option.id, { description: event.target.value })} /></div><div className="mt-4 flex flex-wrap gap-2"><button type="button" className={smallButton} disabled={index === 0} onClick={() => move(index, -1)}>↑ Subir</button><button type="button" className={smallButton} disabled={index === draft.loveWheelOptions.length - 1} onClick={() => move(index, 1)}>↓ Descer</button><button type="button" className={`${smallButton} ml-auto`} disabled={draft.loveWheelOptions.length <= 2} onClick={() => onChange({ loveWheelOptions: draft.loveWheelOptions.filter((item) => item.id !== option.id) })}>Remover</button></div></fieldset>)}
      <button type="button" className={smallButton} disabled={draft.loveWheelOptions.length >= MAX_LOVE_WHEEL_OPTIONS} onClick={() => onChange({ loveWheelOptions: [...draft.loveWheelOptions, { id: crypto.randomUUID(), title: "", description: "" }] })}>+ Adicionar opção</button>
    </div> : null}
  </>;
}

export function RomanticExtrasEditor({ draft, onChange, isPremium, premiumPaid, onUpgrade }: { draft: LetterDraft; onChange: (patch: Partial<LetterDraft>) => void; isPremium: boolean; premiumPaid: boolean; onUpgrade: (reason: "vouchers" | "wheel") => void }) {
  return <>
    <section className="mt-9 border-t border-[#eee5e7] pt-8" aria-labelledby="vouchers-title"><div className="flex flex-wrap items-center gap-3"><h3 id="vouchers-title" className="font-serif text-2xl font-semibold text-[#4e2230]">Vales do Amor</h3><PremiumBadge unlocked={premiumPaid} selected={isPremium && !premiumPaid} /></div><p className="mt-2 text-sm leading-6 text-[#897078]">Até 10 presentes em forma de momentos, com quantidade de resgates controlada.</p>{isPremium ? <VoucherEditor draft={draft} onChange={onChange} /> : <LockedFeature kind="vouchers" onUpgrade={() => onUpgrade("vouchers")} />}</section>
    <section className="mt-9 border-t border-[#eee5e7] pt-8" aria-labelledby="wheel-title"><div className="flex flex-wrap items-center gap-3"><h3 id="wheel-title" className="font-serif text-2xl font-semibold text-[#4e2230]">Roleta do Amor</h3><PremiumBadge unlocked={premiumPaid} selected={isPremium && !premiumPaid} /></div><p className="mt-2 text-sm leading-6 text-[#897078]">Crie de 2 a 12 opções e deixe o servidor escolher cada resultado com chances iguais.</p>{isPremium ? <WheelEditor draft={draft} onChange={onChange} /> : <LockedFeature kind="wheel" onUpgrade={() => onUpgrade("wheel")} />}</section>
  </>;
}
