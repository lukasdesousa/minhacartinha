import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowIcon } from "@/components/ui/icons";

type ButtonLinkProps = {
  children: ReactNode;
  href: string;
  variant?: "primary" | "secondary" | "light";
  className?: string;
};

const variants = {
  primary:
    "bg-[#8e2f4b] text-white shadow-[0_12px_30px_rgba(102,29,51,0.2)] hover:-translate-y-0.5 hover:bg-[#76243d] hover:shadow-[0_16px_36px_rgba(102,29,51,0.26)]",
  secondary:
    "border border-[#d9c9cd] bg-white/70 text-[#5e3641] hover:-translate-y-0.5 hover:border-[#b98b98] hover:bg-white",
  light:
    "bg-[#fffaf8] text-[#72243d] shadow-[0_14px_40px_rgba(48,9,22,0.25)] hover:-translate-y-0.5 hover:bg-white",
};

export function ButtonLink({
  children,
  href,
  variant = "primary",
  className = "",
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={`group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9d415b] ${variants[variant]} ${className}`}
    >
      {children}
      <ArrowIcon
        className="size-4 transition-transform duration-300 group-hover:translate-x-1"
        aria-hidden="true"
      />
    </Link>
  );
}
