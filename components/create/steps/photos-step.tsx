import type { GalleryPhoto, LetterDraft } from "@/components/create/types";
import { FieldGroup, TextAreaField, TextField } from "@/components/create/form-controls";
import { GalleryManager } from "@/components/create/gallery-manager";
import { PhotoField } from "@/components/create/photo-field";

type PhotosStepProps = {
  draft: LetterDraft;
  onChange: (patch: Partial<LetterDraft>) => void;
  isPremium: boolean;
  onUpgrade: (pendingPhotos?: GalleryPhoto[]) => void;
};

export function PhotosStep({ draft, onChange, isPremium, onUpgrade }: PhotosStepProps) {
  return (
    <div className="space-y-9">
      <FieldGroup
        title="A foto que abre a história"
        description="Escolha uma imagem marcante para ser o destaque principal da cartinha."
      >
        <PhotoField
          label="Foto principal"
          description="Fotos verticais ou com espaço ao redor do casal funcionam especialmente bem."
          value={draft.heroImage}
          onChange={(heroImage) => onChange({ heroImage })}
          aspect="portrait"
        />
      </FieldGroup>

      <div className="h-px bg-[#eee5e7]" />

      <FieldGroup
        title="Pequenos capítulos"
        description="Monte um carrossel com os momentos que fazem vocês sorrirem só de lembrar."
      >
        <GalleryManager photos={draft.gallery} onChange={(gallery) => onChange({ gallery })} isPremium={isPremium} onUpgrade={onUpgrade} />
      </FieldGroup>

      <div className="h-px bg-[#eee5e7]" />

      <FieldGroup
        title="O lugar de vocês"
        description="Aquele canto do mundo que ficou especial porque vocês estiveram juntos."
      >
        <div className="space-y-5">
          <PhotoField
            label="Imagem do lugar favorito"
            description="Pode ser uma viagem, um café, uma praia ou até o sofá de casa."
            value={draft.favoritePlace.image}
            onChange={(image) =>
              onChange({ favoritePlace: { ...draft.favoritePlace, image } })
            }
          />
          <TextField
            label="Nome desse lugar"
            value={draft.favoritePlace.name}
            maxLength={60}
            placeholder="Nosso lugar favorito"
            onChange={(event) =>
              onChange({
                favoritePlace: { ...draft.favoritePlace, name: event.target.value },
              })
            }
          />
          <TextAreaField
            label="Por que ele é especial?"
            value={draft.favoritePlace.caption}
            maxLength={180}
            rows={3}
            placeholder="Conte a lembrança que mora aqui..."
            onChange={(event) =>
              onChange({
                favoritePlace: { ...draft.favoritePlace, caption: event.target.value },
              })
            }
          />
        </div>
      </FieldGroup>
    </div>
  );
}
