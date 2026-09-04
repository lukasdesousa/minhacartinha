"use client";

import { useEffect, useMemo, useState } from "react";

type RelationshipCounterProps = {
  startedAt: string;
  compact?: boolean;
};

type RelationshipDuration = {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
};

const minuteInMilliseconds = 60_000;
const hourInMilliseconds = 60 * minuteInMilliseconds;
const dayInMilliseconds = 24 * hourInMilliseconds;

function addMonths(date: Date, amount: number) {
  const result = new Date(date);
  const originalDay = result.getDate();
  result.setDate(1);
  result.setMonth(result.getMonth() + amount);
  const lastDayOfMonth = new Date(
    result.getFullYear(),
    result.getMonth() + 1,
    0,
  ).getDate();
  result.setDate(Math.min(originalDay, lastDayOfMonth));
  return result;
}

function relationshipDuration(start: Date, end: Date): RelationshipDuration | null {
  if (Number.isNaN(start.getTime()) || start > end) return null;

  let totalMonths =
    (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth();
  let cursor = addMonths(start, totalMonths);

  if (cursor > end) {
    totalMonths -= 1;
    cursor = addMonths(start, totalMonths);
  }

  let remaining = end.getTime() - cursor.getTime();
  const days = Math.floor(remaining / dayInMilliseconds);
  remaining -= days * dayInMilliseconds;
  const hours = Math.floor(remaining / hourInMilliseconds);
  remaining -= hours * hourInMilliseconds;

  return {
    years: Math.floor(totalMonths / 12),
    months: totalMonths % 12,
    days,
    hours,
    minutes: Math.floor(remaining / minuteInMilliseconds),
  };
}

function unitLabel(value: number, singular: string, plural: string) {
  return value === 1 ? singular : plural;
}

export function RelationshipCounter({ startedAt, compact = false }: RelationshipCounterProps) {
  const [now, setNow] = useState<Date | null>(null);
  const start = useMemo(() => new Date(startedAt), [startedAt]);
  const duration = now ? relationshipDuration(start, now) : null;

  useEffect(() => {
    const initialUpdate = window.setTimeout(() => setNow(new Date()), 0);
    const interval = window.setInterval(() => setNow(new Date()), 30_000);
    return () => {
      window.clearTimeout(initialUpdate);
      window.clearInterval(interval);
    };
  }, []);

  if (!startedAt || Number.isNaN(start.getTime())) return null;

  if (!now) {
    return (
      <div
        className={`grid ${compact ? "grid-cols-5 gap-1" : "grid-cols-2 gap-2 sm:grid-cols-5"}`}
        aria-hidden="true"
      >
        {Array.from({ length: 5 }, (_, index) => (
          <span
            key={index}
            className={`animate-pulse bg-white/45 ${
              compact
                ? "h-12 rounded-xl"
                : "h-[74px] rounded-2xl last:col-span-2 sm:last:col-span-1"
            }`}
          />
        ))}
      </div>
    );
  }

  if (!duration) {
    return (
      <p className="text-center text-xs font-medium text-[#957c84]">
        Escolha uma data no passado para ver o tempo de vocês.
      </p>
    );
  }

  const units = [
    { key: "years", value: duration.years, label: unitLabel(duration.years, "ano", "anos") },
    { key: "months", value: duration.months, label: unitLabel(duration.months, "mês", "meses") },
    { key: "days", value: duration.days, label: unitLabel(duration.days, "dia", "dias") },
    { key: "hours", value: duration.hours, label: unitLabel(duration.hours, "hora", "horas") },
    { key: "minutes", value: duration.minutes, label: unitLabel(duration.minutes, "minuto", "minutos") },
  ];
  const visibleUnits = units.filter((unit) => unit.value > 0 || unit.key === "minutes");
  const spokenDuration = new Intl.ListFormat("pt-BR", {
    style: "long",
    type: "conjunction",
  }).format(visibleUnits.map((unit) => `${unit.value} ${unit.label}`));

  return (
    <div aria-label={`Juntos há ${spokenDuration}`}>
      <div
        className={`mx-auto grid justify-center ${compact ? "gap-1" : "gap-2"}`}
        style={{
          gridTemplateColumns: `repeat(${visibleUnits.length}, minmax(0, 1fr))`,
          maxWidth: `${visibleUnits.length * (compact ? 68 : 112)}px`,
        }}
        aria-hidden="true"
      >
        {visibleUnits.map((unit) => (
          <div
            key={unit.key}
            className={`min-w-0 text-center ${
              compact
                ? "rounded-xl bg-white/60 px-1 py-2"
                : "rounded-2xl border border-white/65 bg-white/72 px-2 py-4 shadow-[0_12px_30px_rgba(66,24,38,0.06)] backdrop-blur sm:px-3"
            }`}
          >
            <strong
              className={`block font-serif font-semibold leading-none text-[var(--letter-dark,#4d2230)] ${
                compact ? "text-lg" : "text-3xl sm:text-4xl"
              }`}
            >
              {unit.value}
            </strong>
            <span
              className={`mt-1 block font-bold uppercase text-[var(--letter-muted,#9d6b7a)] ${
                compact ? "text-[6px] tracking-[0.06em]" : "text-[8px] tracking-[0.16em]"
              }`}
            >
              {unit.label}
            </span>
          </div>
        ))}
      </div>
      <time
        dateTime={start.toISOString()}
        className={`mt-4 block text-center font-serif italic text-[var(--letter-muted,#8f6572)] ${
          compact ? "text-[10px]" : "text-sm sm:text-base"
        }`}
      >
        Desde {new Intl.DateTimeFormat("pt-BR", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }).format(start)}
      </time>
    </div>
  );
}
