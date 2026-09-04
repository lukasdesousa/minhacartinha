import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { getPublicLetterPath } from "@/lib/letters/public-url";

export const metadata: Metadata = {
  title: "Uma cartinha especial",
  robots: { index: false, follow: false, noarchive: true, nosnippet: true },
};

export default async function LegacyPublicLetterPage({ params }: PageProps<"/para/[slug]">) {
  const { slug } = await params;
  permanentRedirect(getPublicLetterPath(slug));
}
