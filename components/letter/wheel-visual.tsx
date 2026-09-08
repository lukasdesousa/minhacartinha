const wheelColors = ["#8f3654", "#c97791", "#665778", "#d59a70", "#a85370", "#7b6b8e"];

export type WheelVisualOption = { id: string; title: string };

export function wheelBackground(optionCount: number) {
  const count = Math.max(1, optionCount);
  const stops = Array.from({ length: count }, (_, index) => {
    const start = index * 100 / count;
    const end = (index + 1) * 100 / count;
    const separatorStart = Math.max(start, end - 0.45);
    return `${wheelColors[index % wheelColors.length]} ${start}% ${separatorStart}%, rgba(255,255,255,.92) ${separatorStart}% ${end}%`;
  });
  return `conic-gradient(from -90deg, ${stops.join(",")})`;
}

export function wheelColor(index: number) {
  return wheelColors[index % wheelColors.length];
}

export function WheelVisual({ options, rotation, spinning = false, reducedMotion = false, compact = false }: {
  options: WheelVisualOption[];
  rotation: number;
  spinning?: boolean;
  reducedMotion?: boolean;
  compact?: boolean;
}) {
  const radius = compact ? 34 : 37;
  return (
    <div className="relative mx-auto w-fit" aria-hidden="true">
      <span
        className={`absolute left-1/2 z-30 -translate-x-1/2 bg-[#4f2031] drop-shadow-md ${compact ? "top-[-5px] h-7 w-7" : "top-[-9px] h-10 w-10"} ${spinning && !reducedMotion ? "animate-bounce" : ""}`}
        style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
      />
      <div className={`rounded-full border border-white/80 bg-white/80 shadow-[0_24px_65px_rgba(64,24,39,.2)] ${compact ? "p-2" : "p-3"}`}>
        <div
          className={`relative rounded-full ring-1 ring-[#542334]/10 ${compact ? "size-44" : "size-[min(78vw,390px)]"}`}
          style={{
            background: wheelBackground(options.length),
            transform: `rotate(${rotation}deg)`,
            transition: reducedMotion ? "transform 100ms linear" : compact ? "transform 2.6s cubic-bezier(.12,.72,.12,1)" : "transform 4.5s cubic-bezier(.12,.72,.12,1)",
          }}
        >
          <span className="absolute inset-[17%] rounded-full border border-white/25" />
          {options.map((option, index) => {
            const angle = (index + 0.5) * Math.PI * 2 / options.length - Math.PI / 2;
            return (
              <span
                key={option.id}
                className={`absolute grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/65 bg-white/90 font-bold tabular-nums text-[#5d2940] shadow-sm ${compact ? "size-6 text-[9px]" : "size-9 text-xs"}`}
                style={{ left: `${50 + Math.cos(angle) * radius}%`, top: `${50 + Math.sin(angle) * radius}%` }}
              >
                {index + 1}
              </span>
            );
          })}
        </div>
      </div>
      <span className={`absolute left-1/2 top-1/2 z-20 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-[#ead4da] bg-[#fffdfc] text-[#7d3049] shadow-[0_8px_22px_rgba(65,24,38,.18)] ${compact ? "size-16" : "size-24"}`}>
        <span className={`${compact ? "text-xl" : "text-3xl"}`}>♥</span>
      </span>
    </div>
  );
}
