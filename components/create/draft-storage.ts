import type { GalleryPhoto, LetterDraft } from "@/components/create/types";
import type { CreateLetterResponse } from "@/lib/letters/contracts";
import type { CreationPlan } from "@/lib/premium";

export type SavedDraft = {
  draft: LetterDraft;
  requestKey: string;
  ownerToken: string;
  letterId: string | null;
  publishedLetter: CreateLetterResponse | null;
  pendingGallery: GalleryPhoto[];
  selectedPlan?: CreationPlan;
};

function openDraftDatabase() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open("minhacartinha-editor", 1);
    request.onupgradeneeded = () => request.result.createObjectStore("drafts");
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new Error("Não foi possível salvar o rascunho neste dispositivo."));
  });
}

export async function readSavedDraft(): Promise<SavedDraft | null> {
  const database = await openDraftDatabase();
  try {
    return await new Promise((resolve, reject) => {
      const request = database.transaction("drafts").objectStore("drafts").get("current");
      request.onsuccess = () => resolve((request.result as SavedDraft | undefined) ?? null);
      request.onerror = () => reject(request.error);
    });
  } finally { database.close(); }
}

export async function saveDraft(value: SavedDraft) {
  const database = await openDraftDatabase();
  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction("drafts", "readwrite");
      transaction.objectStore("drafts").put(value, "current");
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
  } finally { database.close(); }
}
