import type { LetterDraft } from "@/components/create/types";
import { FieldGroup, TextAreaField, TextField } from "@/components/create/form-controls";
import { HeartIcon } from "@/components/ui/icons";

type StoryStepProps = {
  draft: LetterDraft;
  onChange: (patch: Partial<LetterDraft>) => void;
};

export function StoryStep({ draft, onChange }: StoryStepProps) {
  return (
    <div className="space-y-9">
      <FieldGroup
        title="Comece por vocês"
        description="Esses nomes serão o primeiro detalhe visto por quem receber a cartinha."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            label="Para quem é a cartinha?"
            placeholder="Nome da pessoa"
            value={draft.recipientName}
            maxLength={40}
            onChange={(event) => onChange({ recipientName: event.target.value })}
          />
          <TextField
            label="Seu nome"
            placeholder="Como você quer assinar"
            value={draft.senderName}
            maxLength={40}
            onChange={(event) => onChange({ senderName: event.target.value })}
          />
        </div>
      </FieldGroup>

      <div className="h-px bg-[#eee5e7]" />

      <FieldGroup
        title="O coração da cartinha"
        description="Escreva como você fala. As palavras mais simples costumam ser as mais bonitas."
      >
        <div className="space-y-5">
          <TextField
            label="Título da declaração"
            hint={`${draft.title.length}/70`}
            placeholder="Para o amor da minha vida"
            value={draft.title}
            maxLength={70}
            onChange={(event) => onChange({ title: event.target.value })}
          />
          <TextAreaField
            label="Sua mensagem"
            hint={`${draft.message.length}/900`}
            placeholder="Conte o que essa pessoa significa para você..."
            value={draft.message}
            maxLength={900}
            rows={9}
            onChange={(event) => onChange({ message: event.target.value })}
          />
          <TextField
            label="Assinatura"
            placeholder="Com amor, sempre"
            value={draft.signature}
            maxLength={60}
            onChange={(event) => onChange({ signature: event.target.value })}
          />
        </div>
      </FieldGroup>

      <div className="flex gap-3 rounded-2xl bg-[#faf1f3] p-4 text-sm leading-6 text-[#754b58]">
        <HeartIcon className="mt-0.5 size-4.5 shrink-0 fill-[#edcdd5] text-[#a54f68]" aria-hidden="true" />
        <p>A prévia ao lado acompanha cada palavra em tempo real. Você pode voltar e ajustar tudo quando quiser.</p>
      </div>
    </div>
  );
}
