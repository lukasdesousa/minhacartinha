"use client";

import { useConsent } from "@/components/privacy/consent-provider";

export function ManageCookiesButton({ className = "" }: { className?: string }) {
  const { openPreferences } = useConsent();
  return <button type="button" onClick={openPreferences} className={className}>Gerenciar cookies</button>;
}
