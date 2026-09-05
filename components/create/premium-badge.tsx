export function PremiumBadge({ unlocked = false, selected = false }: { unlocked?: boolean; selected?: boolean }) {
  return <span className={`inline-flex shrink-0 rounded-full border px-2 py-1 text-[8px] font-bold uppercase tracking-[0.13em] ${unlocked ? "border-[#c7dbc5] bg-[#eff6ed] text-[#527249]" : "border-[#e1c9cd] bg-[#f9ecec] text-[#92536a]"}`}>{unlocked ? "Premium ativo" : selected ? "Premium escolhido" : "Premium"}</span>;
}
