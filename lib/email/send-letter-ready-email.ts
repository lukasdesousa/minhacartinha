import "server-only";

import { Resend } from "resend";
import { renderLetterReadyEmail } from "@/lib/email/letter-ready-template";

const QR_CODE_CONTENT_ID = "minha-cartinha-qrcode";

export type SendLetterReadyEmailInput = {
  letterId: string;
  recipientEmail: string;
  recipientName: string;
  senderName: string;
  publicUrl: string;
  themeId: "vinho" | "lavanda" | "entardecer";
  qrCodePng: Buffer;
};

export class EmailDeliveryError extends Error {}

function resendSender() {
  const configuredFrom = process.env.RESEND_FROM_EMAIL?.trim();
  if (configuredFrom) return configuredFrom;

  const domain = process.env.RESEND_DOMAIN?.trim().toLowerCase();
  if (!domain || !/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/u.test(domain)) {
    return "";
  }
  return `Minha Cartinha <cartinhas@${domain}>`;
}

export async function sendLetterReadyEmail(input: SendLetterReadyEmailInput) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = resendSender();
  const replyTo = process.env.RESEND_REPLY_TO_EMAIL?.trim();

  if (!apiKey || !from) {
    throw new EmailDeliveryError(
      "O envio de e-mail ainda não está configurado com uma chave e um domínio válidos.",
    );
  }

  const { html, text } = renderLetterReadyEmail({
    recipientName: input.recipientName,
    senderName: input.senderName,
    publicUrl: input.publicUrl,
    themeId: input.themeId,
    qrCodeContentId: QR_CODE_CONTENT_ID,
  });
  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send(
    {
      from,
      to: [input.recipientEmail],
      subject: "Uma cartinha especial foi criada 💌",
      html,
      text,
      replyTo: replyTo || undefined,
      attachments: [
        {
          filename: "minha-cartinha-qr-code.png",
          content: input.qrCodePng.toString("base64"),
          contentId: QR_CODE_CONTENT_ID,
        },
      ],
    },
    { idempotencyKey: `letter-created/${input.letterId}` },
  );

  if (error || !data?.id) {
    throw new EmailDeliveryError(error?.message || "O Resend não confirmou o envio do e-mail.");
  }

  return { messageId: data.id };
}
