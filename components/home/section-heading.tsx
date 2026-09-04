type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  inverted?: boolean;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  inverted = false,
}: SectionHeadingProps) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-xl"}>
      <p
        className={`text-xs font-bold uppercase tracking-[0.22em] ${
          inverted ? "text-[#e9bdc9]" : "text-[#9b4a61]"
        }`}
      >
        {eyebrow}
      </p>
      <h2
        className={`mt-4 font-serif text-[2.7rem] font-semibold leading-[1.02] tracking-[-0.045em] sm:text-5xl ${
          inverted ? "text-white" : "text-[#481e2a]"
        }`}
      >
        {title}
      </h2>
      {description ? (
        <p className={`mt-5 text-base leading-7 ${inverted ? "text-white/68" : "text-[#79616a]"}`}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
