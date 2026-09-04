"use client";

import { useId, useState } from "react";
import type { ChangeEvent } from "react";
import type { GalleryPhoto } from "@/components/create/types";
import { readImageFile } from "@/components/create/photo-field";
import { PhotoIcon, TrashIcon } from "@/components/ui/icons";

const MAX_PHOTOS = 6;

type GalleryManagerProps = {
  photos: GalleryPhoto[];
  onChange: (photos: GalleryPhoto[]) => void;
};

export function GalleryManager({ photos, onChange }: GalleryManagerProps) {
  const inputId = useId();
  const [error, setError] = useState("");

  async function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";

    if (!files.length) return;
    if (photos.length + files.length > MAX_PHOTOS) {
      setError(`Escolha no máximo ${MAX_PHOTOS} fotos para o carrossel.`);
      return;
    }

    try {
      setError("");
      const newPhotos = await Promise.all(
        files.map(async (file, index) => ({
          id: globalThis.crypto.randomUUID(),
          src: await readImageFile(file),
          caption: `Momento ${photos.length + index + 1}`,
        })),
      );
      onChange([...photos, ...newPhotos]);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Uma das imagens é inválida.");
    }
  }

  function updateCaption(id: string, caption: string) {
    onChange(photos.map((photo) => (photo.id === id ? { ...photo, caption } : photo)));
  }

  function removePhoto(id: string) {
    onChange(photos.filter((photo) => photo.id !== id));
  }

  return (
    <div>
      <div className="mb-3 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#59303d]">Carrossel de momentos</p>
          <p className="mt-1 text-xs leading-5 text-[#937b83]">Adicione até 6 fotos e uma legenda para cada memória.</p>
        </div>
        <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-[#a58d94]">
          {photos.length}/{MAX_PHOTOS}
        </span>
      </div>

      {photos.length ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {photos.map((photo, index) => (
            <div key={photo.id} className="overflow-hidden rounded-2xl border border-[#e3d7da] bg-[#fffdfc]">
              <div
                className="relative aspect-[4/3] bg-cover bg-center"
                style={{ backgroundImage: `linear-gradient(to top, rgba(47, 16, 27, 0.42), transparent 55%), url(${JSON.stringify(photo.src)})` }}
                role="img"
                aria-label={`Foto ${index + 1} do carrossel`}
              >
                <span className="absolute left-3 top-3 grid size-7 place-items-center rounded-full bg-white/90 text-[10px] font-bold text-[#633747] shadow-sm">
                  {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removePhoto(photo.id)}
                  className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-[#4b1928]/75 text-white backdrop-blur transition-colors hover:bg-[#4b1928] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  aria-label={`Remover foto ${index + 1}`}
                >
                  <TrashIcon className="size-3.5" aria-hidden="true" />
                </button>
              </div>
              <div className="p-3">
                <label htmlFor={`${inputId}-${index}`} className="sr-only">
                  Legenda da foto {index + 1}
                </label>
                <input
                  id={`${inputId}-${index}`}
                  value={photo.caption}
                  maxLength={60}
                  onChange={(event) => updateCaption(photo.id, event.target.value)}
                  className="w-full border-0 bg-transparent text-xs font-medium text-[#603746] outline-none placeholder:text-[#af9aa0]"
                  placeholder="Escreva uma legenda..."
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[#d5c4c9] bg-[#fbf7f6] px-5 py-8 text-center">
          <PhotoIcon className="mx-auto size-6 text-[#a15a70]" aria-hidden="true" />
          <p className="mt-3 text-sm font-semibold text-[#633747]">Suas memórias aparecerão aqui</p>
          <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-[#9a8289]">Escolha fotos que contem pequenos capítulos da história de vocês.</p>
        </div>
      )}

      {photos.length < MAX_PHOTOS ? (
        <label
          htmlFor={inputId}
          className="mt-3 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-[#d7c5ca] bg-white px-4 text-xs font-semibold text-[#713b4d] transition-all hover:-translate-y-0.5 hover:border-[#b47b8c] focus-within:ring-4 focus-within:ring-[#ead9de]/70"
        >
          <input
            id={inputId}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleFiles}
            className="sr-only"
          />
          <span className="text-base leading-none" aria-hidden="true">+</span>
          Adicionar {photos.length ? "mais fotos" : "fotos"}
        </label>
      ) : null}
      {error ? <p className="mt-2 text-xs font-medium text-[#a6374d]">{error}</p> : null}
    </div>
  );
}
