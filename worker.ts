import app from "vinext/server/fetch-handler";
import { cleanupExpiredLetters } from "@/lib/letters/expiration-cleanup";

export default {
  fetch(request, env, context) {
    return app.fetch(request, env, context);
  },
  scheduled(_controller, _env, context) {
    context.waitUntil(
      cleanupExpiredLetters()
        .then((result) => {
          console.log(
            `[letter.expiration] ${result.lettersDeleted} cartinha(s) e ${result.imagesDeleted} imagem(ns) removidas; ${result.imagesPending} imagem(ns) pendentes.`,
          );
        })
        .catch(() => {
          console.error("[letter.expiration] A rotina agendada falhou e será tentada novamente.");
        }),
    );
  },
} satisfies ExportedHandler<Env>;
