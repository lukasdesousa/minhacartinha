import "server-only";

import { EmailDeliveryStatus } from "@/generated/prisma/client";
import type { CreateLetterResponse } from "@/lib/letters/contracts";
import { sendLetterReadyEmail } from "@/lib/email/send-letter-ready-email";
import { generateLetterQrCode } from "@/lib/letters/qr-code";
import { getPublicLetterPath, getPublicLetterUrl } from "@/lib/letters/public-url";
import { withPrisma } from "@/lib/prisma";

type DeliveryLetter = {
  id: string;
  slug: string;
  recipientEmail: string;
  recipientName: string;
  senderName: string;
  themeId: "vinho" | "lavanda" | "entardecer";
};

function storedErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : "Falha desconhecida no envio.";
  return message.replace(/[\r\n]+/g, " ").slice(0, 500);
}

async function updateDeliveryStatus(
  letterId: string,
  data: {
    emailStatus: EmailDeliveryStatus;
    emailMessageId?: string;
    emailSentAt?: Date;
    emailLastError?: string | null;
  },
) {
  try {
    await withPrisma((prisma) =>
      prisma.letter.update({
        where: { id: letterId },
        data: {
          ...data,
          emailAttempts: { increment: 1 },
        },
      }),
    );
  } catch (error) {
    console.error(
      `Não foi possível atualizar o status do e-mail da cartinha ${letterId}: ${storedErrorMessage(error)}`,
    );
  }
}

export async function deliverCreatedLetter(
  letter: DeliveryLetter,
  requestUrl: string,
): Promise<CreateLetterResponse> {
  const path = getPublicLetterPath(letter.slug);
  const publicUrl = getPublicLetterUrl(letter.slug, requestUrl);
  let qrCode;

  try {
    qrCode = await generateLetterQrCode(publicUrl);
  } catch (error) {
    const emailLastError = storedErrorMessage(error);
    await updateDeliveryStatus(letter.id, {
      emailStatus: EmailDeliveryStatus.FAILED,
      emailLastError,
    });
    console.error(
      `Não foi possível gerar o QR Code da cartinha ${letter.id}: ${emailLastError}`,
    );
    return {
      id: letter.id,
      slug: letter.slug,
      path,
      publicUrl,
      qrCodeDataUrl: "",
      emailStatus: "failed",
      emailMessage: "A cartinha foi criada, mas a entrega por e-mail precisa ser reenviada.",
    };
  }

  try {
    const { messageId } = await sendLetterReadyEmail({
      letterId: letter.id,
      recipientEmail: letter.recipientEmail,
      recipientName: letter.recipientName,
      senderName: letter.senderName,
      publicUrl,
      themeId: letter.themeId,
      qrCodePng: qrCode.png,
    });
    await updateDeliveryStatus(letter.id, {
      emailStatus: EmailDeliveryStatus.SENT,
      emailMessageId: messageId,
      emailSentAt: new Date(),
      emailLastError: null,
    });
    return {
      id: letter.id,
      slug: letter.slug,
      path,
      publicUrl,
      qrCodeDataUrl: qrCode.dataUrl,
      emailStatus: "sent",
      emailMessage: "A cartinha e o QR Code também foram enviados por e-mail.",
    };
  } catch (error) {
    const emailLastError = storedErrorMessage(error);
    await updateDeliveryStatus(letter.id, {
      emailStatus: EmailDeliveryStatus.FAILED,
      emailLastError,
    });
    console.warn(
      `A cartinha ${letter.id} foi criada, mas o envio do e-mail falhou: ${emailLastError}`,
    );
    return {
      id: letter.id,
      slug: letter.slug,
      path,
      publicUrl,
      qrCodeDataUrl: qrCode.dataUrl,
      emailStatus: "failed",
      emailMessage: "A cartinha está pronta, mas não conseguimos enviar o e-mail agora.",
    };
  }
}

export async function getExistingLetterResponse(
  requestKey: string,
  requestUrl: string,
): Promise<CreateLetterResponse | null> {
  const letter = await withPrisma((prisma) =>
    prisma.letter.findUnique({
      where: { requestKey },
      select: {
        id: true,
        slug: true,
        emailStatus: true,
      },
    }),
  );
  if (!letter) return null;

  const path = getPublicLetterPath(letter.slug);
  const publicUrl = getPublicLetterUrl(letter.slug, requestUrl);
  const qrCode = await generateLetterQrCode(publicUrl);
  const emailStatus =
    letter.emailStatus === EmailDeliveryStatus.SENT
      ? "sent"
      : letter.emailStatus === EmailDeliveryStatus.FAILED
        ? "failed"
        : "pending";

  return {
    id: letter.id,
    slug: letter.slug,
    path,
    publicUrl,
    qrCodeDataUrl: qrCode.dataUrl,
    emailStatus,
    emailMessage:
      emailStatus === "sent"
        ? "A cartinha e o QR Code também foram enviados por e-mail."
        : emailStatus === "failed"
          ? "A cartinha está pronta, mas o envio do e-mail precisa ser reenviado."
          : "A cartinha está pronta e a entrega do e-mail está sendo processada.",
  };
}
