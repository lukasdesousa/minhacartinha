"use client";

import { useId, useState } from "react";
import type { QuizQuestion } from "@/lib/letters/quiz";

export function CoupleQuiz({ questions }: { questions: QuizQuestion[] }) {
  const titleId = useId();
  const [answers, setAnswers] = useState<number[]>([]);
  const [step, setStep] = useState(0);
  const current = questions[step];
  const answer = answers[step];
  const finished = step >= questions.length;
  const score = answers.reduce((total, value, index) => total + (value === questions[index]?.correctIndex ? 1 : 0), 0);
  if (!questions.length) return null;
  return (
    <section className="bg-[var(--letter-wash)] px-5 py-12 sm:py-20" aria-labelledby={titleId}>
      <div className="mx-auto max-w-xl">
        <p className="text-center text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--letter-muted)]">Uma brincadeira sobre nós</p>
        <h2 id={titleId} className="mt-2 text-center font-serif text-3xl font-semibold text-[var(--letter-dark)]">Quanto você lembra da gente? ❤️</h2>
        <div className="mt-7 rounded-3xl border border-white/70 bg-[var(--letter-paper)] p-5 shadow-[0_15px_40px_rgba(75,25,43,0.06)] sm:p-7">
          {finished ? <div className="text-center" role="status">
            <p className="font-serif text-5xl font-semibold text-[var(--letter-accent)]">{score}/{questions.length}</p>
            <h3 className="mt-4 font-serif text-2xl text-[var(--letter-dark)]">{score === questions.length ? "Você guarda cada pedacinho de nós!" : "Nossa história sempre tem mais para descobrir."}</h3>
            <p className="mt-3 text-sm leading-6 text-[#896775]">Cada lembrança é um carinho. E o melhor da nossa história ainda está por vir. ❤️</p>
            <button type="button" className="mt-6 min-h-11 rounded-full border border-[var(--letter-accent)] px-5 text-sm font-semibold text-[var(--letter-accent)]" onClick={() => { setAnswers([]); setStep(0); }}>Brincar de novo</button>
          </div> : <>
            <div className="mb-4 flex justify-between gap-3 text-[10px] font-bold text-[var(--letter-muted)]"><span>Pergunta {step + 1} de {questions.length}</span><span>{score} {score === 1 ? "acerto" : "acertos"}</span></div>
            <h3 className="font-serif text-2xl font-semibold leading-tight text-[var(--letter-dark)]">{current.question || "Sua pergunta aparece aqui"}</h3>
            <div className="mt-5 space-y-3">{current.options.map((option, index) => <button key={index} type="button" disabled={answer !== undefined} onClick={() => setAnswers((previous) => [...previous, index])} className={`flex min-h-12 w-full items-start gap-3 rounded-2xl border px-4 py-3 text-left text-sm transition-colors ${answer !== undefined && index === current.correctIndex ? "border-[#89ae80] bg-[#eef6e9] text-[#496843]" : answer === index ? "border-[#cb8f9c] bg-[#fae9ed] text-[#8d4054]" : "border-[#e3d2d9] text-[#6b4353] enabled:hover:bg-[var(--letter-wash)]"}`}><span className="font-semibold">{String.fromCharCode(65 + index)}.</span><span className="break-words">{option || `Alternativa ${String.fromCharCode(65 + index)}`}</span></button>)}</div>
            {answer !== undefined && <div className="mt-5" role="status">
              <p className="text-sm leading-6 text-[var(--letter-accent)]">{answer === current.correctIndex ? "Acertou! Essa lembrança também mora em você. ❤️" : `Quase! A resposta era ${String.fromCharCode(65 + current.correctIndex)}. Mais uma lembrança para guardar juntos. ❤️`}</p>
              <button type="button" onClick={() => setStep((value) => value + 1)} className="mt-4 min-h-12 w-full rounded-full bg-[var(--letter-accent)] px-4 text-sm font-bold text-white">{step === questions.length - 1 ? "Ver nosso resultado" : "Próxima lembrança"}</button>
            </div>}
          </>}
        </div>
      </div>
    </section>
  );
}
