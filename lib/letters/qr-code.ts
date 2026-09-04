import "server-only";

import QRCode from "qrcode";

export type LetterQrCode = {
  png: Buffer;
  dataUrl: string;
};

export async function generateLetterQrCode(publicUrl: string): Promise<LetterQrCode> {
  const parsedUrl = new URL(publicUrl);
  if (parsedUrl.protocol !== "https:" && parsedUrl.protocol !== "http:") {
    throw new Error("Não foi possível gerar o QR Code para uma URL inválida.");
  }

  const png = await QRCode.toBuffer(parsedUrl.toString(), {
    type: "png",
    width: 320,
    margin: 3,
    errorCorrectionLevel: "M",
    color: {
      dark: "#4D202EFF",
      light: "#FFFFFFFF",
    },
  });

  return {
    png,
    dataUrl: `data:image/png;base64,${png.toString("base64")}`,
  };
}
