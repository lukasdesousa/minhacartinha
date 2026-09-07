import type { GalleryPhoto, LetterDraft } from "@/components/create/types";
import { FieldGroup, TextAreaField, TextField } from "@/components/create/form-controls";
import { GalleryManager } from "@/components/create/gallery-manager";
import { PhotoField } from "@/components/create/photo-field";
import { MapPinIcon } from "@/components/ui/icons";

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
        description="Escolha se esse cantinho especial deve fazer parte da cartinha."
      >
        <div className="space-y-5">
          <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-[#e3d7da] bg-[#fffdfc] p-3.5 transition-colors hover:border-[#c8b2b8]">
            <input
              type="checkbox"
              checked={draft.showFavoritePlace}
              onChange={(event) => onChange({ showFavoritePlace: event.target.checked })}
              className="peer sr-only"
            />
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#f4e8eb] text-[#91405a]">
              <MapPinIcon className="size-4" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-bold text-[#5d3341]">Incluir nosso lugar favorito</span>
              <span className="mt-0.5 block text-[10px] leading-4 text-[#998189]">Quando desativado, esta seção desaparece completamente da cartinha.</span>
            </span>
            <span className={`relative h-6 w-10 shrink-0 rounded-full transition-colors ${draft.showFavoritePlace ? "bg-[#8f3c56]" : "bg-[#d9cdd0]"}`} aria-hidden="true">
              <span className={`absolute top-1 size-4 rounded-full bg-white shadow-sm transition-transform ${draft.showFavoritePlace ? "translate-x-5" : "translate-x-1"}`} />
            </span>
          </label>

          {draft.showFavoritePlace ? (
            <div className="space-y-5 rounded-[1.75rem] border border-[#eadfe2] bg-[#fffafa] p-4 sm:p-5">
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
          ) : null}
        </div>
      </FieldGroup>
    </div>
  );
}
