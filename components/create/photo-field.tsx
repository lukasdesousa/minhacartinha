"use client";

import { useId, useState } from "react";
import type { ChangeEvent, DragEvent } from "react";
import { PhotoIcon, TrashIcon, UploadIcon } from "@/components/ui/icons";

const MAX_FILE_SIZE = 8 * 1024 * 1024;
const MAX_OPTIMIZED_SIZE = 350_000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const compressionPasses = [
  { dimension: 1600, quality: 0.82 },
  { dimension: 1400, quality: 0.78 },
  { dimension: 1200, quality: 0.72 },
  { dimension: 1000, quality: 0.68 },
  { dimension: 900, quality: 0.62 },
];

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Não foi possível abrir esta imagem."));
    };
    image.src = objectUrl;
  });
}

function canvasBlob(canvas: HTMLCanvasElement, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Não foi possível otimizar esta imagem."))),
      "image/webp",
      quality,
    );
  });
}

function blobDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Não foi possível preparar esta imagem."));
    reader.readAsDataURL(blob);
  });
}

export async function readImageFile(file: File) {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("Use uma imagem JPG, PNG ou WebP.");
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("A imagem deve ter no máximo 8 MB.");
  }

  const image = await loadImage(file);
  let lastBlob: Blob | null = null;

  for (const pass of compressionPasses) {
    const scale = Math.min(1, pass.dimension / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Seu navegador não conseguiu preparar esta imagem.");
    }

    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    lastBlob = await canvasBlob(canvas, pass.quality);

    if (lastBlob.size <= MAX_OPTIMIZED_SIZE) {
      return blobDataUrl(lastBlob);
    }
  }

  if (lastBlob && lastBlob.size <= MAX_OPTIMIZED_SIZE) {
    return blobDataUrl(lastBlob);
  }
  throw new Error("Esta imagem tem detalhes demais. Escolha uma versão um pouco menor.");
}

type PhotoFieldProps = {
  label: string;
  description: string;
  value: string;
  onChange: (value: string) => void;
  aspect?: "landscape" | "portrait";
};

export function PhotoField({
  label,
  description,
  value,
  onChange,
  aspect = "landscape",
}: PhotoFieldProps) {
  const inputId = useId();
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  async function selectFile(file?: File) {
    if (!file) return;

    try {
      setError("");
      onChange(await readImageFile(file));
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Imagem inválida.");
    }
  }

  function handleInput(event: ChangeEvent<HTMLInputElement>) {
    void selectFile(event.target.files?.[0]);
    event.target.value = "";
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(false);
    void selectFile(event.dataTransfer.files?.[0]);
  }

  return (
    <div>
      <div className="mb-3">
        <p className="text-sm font-semibold text-[#59303d]">{label}</p>
        <p className="mt-1 text-xs leading-5 text-[#937b83]">{description}</p>
      </div>

      <label
        htmlFor={inputId}
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
        className={`group relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed text-center outline-none transition-all focus-within:ring-4 focus-within:ring-[#ead9de]/70 ${
          aspect === "portrait" ? "min-h-72" : "min-h-52"
        } ${
          isDragging
            ? "border-[#963b57] bg-[#f9eaee]"
            : value
              ? "border-[#d6c4c9] bg-[#5a2636]"
              : "border-[#ccb8be] bg-[#fbf7f6] hover:border-[#a7697b] hover:bg-[#faf1f3]"
        }`}
      >
        <input
          id={inputId}
          type="file"
          accept={ACCEPTED_IMAGE_TYPES.join(",")}
          onChange={handleInput}
          className="sr-only"
        />
        {value ? (
          <>
            <span
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-[1.03]"
              style={{ backgroundImage: `linear-gradient(rgba(49, 16, 28, 0.08), rgba(49, 16, 28, 0.35)), url(${JSON.stringify(value)})` }}
              role="img"
              aria-label={`Prévia de ${label.toLowerCase()}`}
            />
            <span className="relative inline-flex items-center gap-2 rounded-full bg-white/92 px-4 py-2 text-xs font-semibold text-[#653345] shadow-lg backdrop-blur">
              <UploadIcon className="size-4" aria-hidden="true" />
              Trocar imagem
            </span>
          </>
        ) : (
          <>
            <span className="grid size-12 place-items-center rounded-full bg-white text-[#95415b] shadow-[0_8px_24px_rgba(76,31,44,0.08)] transition-transform group-hover:-translate-y-1">
              <PhotoIcon className="size-5" aria-hidden="true" />
            </span>
            <span className="mt-4 text-sm font-semibold text-[#633747]">Clique ou arraste uma imagem</span>
            <span className="mt-1 text-[11px] text-[#9e878e]">JPG, PNG ou WebP · até 8 MB · otimização automática</span>
          </>
        )}
      </label>

      <div className="mt-2 flex min-h-5 items-start justify-between gap-3">
        {error ? <p className="text-xs font-medium text-[#a6374d]">{error}</p> : <span />}
        {value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            className="inline-flex items-center gap-1.5 rounded-lg text-xs font-semibold text-[#966b78] transition-colors hover:text-[#8e2f4b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#963b57]"
          >
            <TrashIcon className="size-3.5" aria-hidden="true" />
            Remover
          </button>
        ) : null}
      </div>
    </div>
  );
}
