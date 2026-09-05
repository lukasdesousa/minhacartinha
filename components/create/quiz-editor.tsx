"use client";

import type { LetterDraft } from "@/components/create/types";
import { TextField } from "@/components/create/form-controls";
import { PremiumBadge } from "@/components/create/premium-badge";
import { MAX_QUIZ_QUESTIONS, type QuizQuestion } from "@/lib/letters/quiz";
import { PREMIUM_PRICE_LABEL } from "@/lib/premium";

export function QuizEditor({ draft, onChange, isPremium, onUpgrade }: {
  draft: LetterDraft;
  onChange: (patch: Partial<LetterDraft>) => void;
  isPremium: boolean;
  onUpgrade: () => void;
}) {
  function update(id: string, patch: Partial<QuizQuestion>) {
    onChange({ quiz: draft.quiz.map((question) => question.id === id ? { ...question, ...patch } : question) });
  }
  function addQuestion() {
    onChange({ quiz: [...draft.quiz, { id: crypto.randomUUID(), question: "", options: ["", "", "", ""], correctIndex: 0 }] });
  }
  function moveQuestion(index: number, direction: number) {
    const quiz = [...draft.quiz];
    [quiz[index], quiz[index + direction]] = [quiz[index + direction], quiz[index]];
    onChange({ quiz });
  }
  const smallButton = "min-h-10 rounded-full border border-[#ddcbd1] px-3 text-xs font-semibold text-[#7d4255] hover:bg-[#f9ecef] disabled:opacity-35";
  return (
    <section className="mt-9 border-t border-[#eee5e7] pt-8" aria-labelledby="quiz-editor-title">
      <div className="flex flex-wrap items-center gap-3">
        <h3 id="quiz-editor-title" className="font-serif text-2xl font-semibold text-[#4e2230]">Quiz do casal</h3>
        <PremiumBadge unlocked={isPremium} />
      </div>
      <p className="mt-2 text-sm leading-6 text-[#897078]">Transforme suas lembranças em perguntas: quatro alternativas, uma resposta certa e mais um jeito de sorrir juntos.</p>
      {!isPremium && <p className="mt-3 text-xs leading-5 text-[#8c6774]">Prepare e experimente o Quiz à vontade. Para publicá-lo, desbloqueie todos os recursos Premium desta cartinha por {PREMIUM_PRICE_LABEL}. Compra única, sem assinatura.</p>}
      <label className="mt-5 flex min-h-12 cursor-pointer items-center gap-3 rounded-2xl border border-[#e4d3d9] bg-[#fff8fa] p-4 text-sm font-semibold text-[#633345]">
        <input type="checkbox" checked={draft.quizEnabled} onChange={(event) => {
          const enabled = event.target.checked;
          onChange({ quizEnabled: enabled, ...(enabled && !draft.quiz.length ? { quiz: [{ id: crypto.randomUUID(), question: "", options: ["", "", "", ""], correctIndex: 0 }] } : {}) });
        }} className="size-4 accent-[#8e2f4b]" />
        Incluir Quiz nesta cartinha
      </label>
      {draft.quizEnabled && <div className="mt-5 space-y-5">
        {draft.quiz.map((question, index) => <fieldset key={question.id} className="rounded-3xl border border-[#e5d6dc] bg-[#fffdfc] p-4 sm:p-5">
          <legend className="px-2 text-xs font-bold text-[#8a4860]">Pergunta {index + 1}</legend>
          <TextField label="Sua pergunta" placeholder="Onde foi nosso primeiro encontro?" maxLength={240} value={question.question} onChange={(event) => update(question.id, { question: event.target.value })} />
          <p className="mb-3 mt-4 text-xs text-[#92717e]">Marque o círculo da resposta correta.</p>
          <div className="space-y-3">{question.options.map((option, optionIndex) => <div className="flex items-center gap-3" key={optionIndex}>
            <input type="radio" name={`correct-${question.id}`} checked={question.correctIndex === optionIndex} onChange={() => update(question.id, { correctIndex: optionIndex })} aria-label={`Alternativa ${String.fromCharCode(65 + optionIndex)} é a correta da pergunta ${index + 1}`} className="size-5 shrink-0 accent-[#8e2f4b]" />
            <label className="flex flex-1 items-center gap-2 rounded-xl border border-[#e4d5db] bg-white px-3 py-3 text-xs text-[#9b7786]">
              {String.fromCharCode(65 + optionIndex)}
              <input aria-label={`Alternativa ${String.fromCharCode(65 + optionIndex)} da pergunta ${index + 1}`} value={option} maxLength={120} placeholder="Escreva uma alternativa" onChange={(event) => { const options = [...question.options] as QuizQuestion["options"]; options[optionIndex] = event.target.value; update(question.id, { options }); }} className="min-w-0 flex-1 bg-transparent text-sm text-[#583443] outline-none" />
            </label>
          </div>)}</div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button className={smallButton} type="button" disabled={index === 0} onClick={() => moveQuestion(index, -1)} aria-label={`Mover pergunta ${index + 1} para cima`}>↑ Subir</button>
            <button className={smallButton} type="button" disabled={index === draft.quiz.length - 1} onClick={() => moveQuestion(index, 1)} aria-label={`Mover pergunta ${index + 1} para baixo`}>↓ Descer</button>
            <button className={`${smallButton} ml-auto`} type="button" onClick={() => onChange({ quiz: draft.quiz.filter((item) => item.id !== question.id) })} aria-label={`Remover pergunta ${index + 1}`}>Remover</button>
          </div>
        </fieldset>)}
        <button type="button" className={smallButton} disabled={draft.quiz.length >= MAX_QUIZ_QUESTIONS} onClick={addQuestion}>+ Adicionar pergunta</button>
        {!isPremium && <button type="button" onClick={onUpgrade} className="block min-h-12 w-full rounded-full bg-[#8e2f4b] px-5 text-sm font-bold text-white hover:bg-[#76243d]">Desbloquear Premium — {PREMIUM_PRICE_LABEL}</button>}
      </div>}
    </section>
  );
}
