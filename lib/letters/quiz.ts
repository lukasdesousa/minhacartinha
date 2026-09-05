export type QuizQuestion = {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
};

export const MAX_QUIZ_QUESTIONS = 20;

/** Shared validation; drafts may contain unfinished questions, publication may not. */
export function parseQuiz(value: unknown, requireComplete = true): QuizQuestion[] {
  if (!Array.isArray(value) || value.length > MAX_QUIZ_QUESTIONS) {
    throw new Error(`O Quiz deve ter no máximo ${MAX_QUIZ_QUESTIONS} perguntas.`);
  }
  const ids = new Set<string>();
  const questions = value.map((entry: unknown) => {
    if (!entry || typeof entry !== "object") throw new Error("Pergunta do Quiz inválida.");
    const item = entry as Record<string, unknown>;
    if (typeof item.id !== "string" || !/^[a-zA-Z0-9_-]{1,64}$/.test(item.id) || ids.has(item.id)) {
      throw new Error("Identificador de pergunta inválido.");
    }
    ids.add(item.id);
    if (typeof item.question !== "string" || item.question.length > 240 ||
        !Array.isArray(item.options) || item.options.length !== 4 ||
        item.options.some((option: unknown) => typeof option !== "string" || option.length > 120) ||
        !Number.isInteger(item.correctIndex) || Number(item.correctIndex) < 0 || Number(item.correctIndex) > 3) {
      throw new Error("Cada pergunta deve ter quatro alternativas e uma resposta correta.");
    }
    return {
      id: item.id,
      question: item.question.trim(),
      options: item.options.map((option: string) => option.trim()) as QuizQuestion["options"],
      correctIndex: Number(item.correctIndex),
    };
  });
  if (requireComplete && (!questions.length || questions.some((item) => !item.question || item.options.some((option) => !option)))) {
    throw new Error("Complete a pergunta e as quatro alternativas de cada item do Quiz.");
  }
  return questions;
}

export function getQuizError(questions: QuizQuestion[]) {
  try { parseQuiz(questions); return ""; }
  catch (error) { return error instanceof Error ? error.message : "Confira seu Quiz."; }
}
