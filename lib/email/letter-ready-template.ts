type LetterEmailTheme = "vinho" | "lavanda" | "entardecer";

export type LetterReadyEmailInput = {
  recipientName: string;
  senderName: string;
  publicUrl: string;
  themeId: LetterEmailTheme;
  qrCodeContentId?: string;
};

const themeColors: Record<LetterEmailTheme, { accent: string; dark: string; soft: string }> = {
  vinho: { accent: "#8E2F4B", dark: "#4D202E", soft: "#F8EDEF" },
  lavanda: { accent: "#76628F", dark: "#382E49", soft: "#F0ECF5" },
  entardecer: { accent: "#A65A48", dark: "#522D2B", soft: "#F7ECE5" },
};

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

export function renderLetterReadyEmail(input: LetterReadyEmailInput) {
  const colors = themeColors[input.themeId];
  const recipientName = escapeHtml(input.recipientName);
  const senderName = escapeHtml(input.senderName);
  const publicUrl = escapeHtml(input.publicUrl);
  const qrCodeContentId = escapeHtml(input.qrCodeContentId ?? "minha-cartinha-qrcode");

  const html = `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="x-apple-disable-message-reformatting">
    <title>Uma cartinha especial foi criada</title>
    <style>
      body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
      table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
      table { border-collapse: collapse !important; }
      img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
      @media only screen and (max-width: 620px) {
        .email-shell { width: 100% !important; }
        .email-card { border-radius: 24px !important; }
        .email-pad { padding-left: 24px !important; padding-right: 24px !important; }
        .email-title { font-size: 34px !important; line-height: 38px !important; }
        .name-cell { display: block !important; width: 100% !important; }
        .name-cell + .name-cell { padding-top: 10px !important; }
        .cta-link { display: block !important; }
      }
    </style>
  </head>
  <body style="margin:0; padding:0; width:100%; background-color:#F7F2F0; color:${colors.dark};">
    <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent;">Uma surpresa feita com carinho está esperando para ser aberta.</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%; background-color:#F7F2F0;">
      <tr>
        <td align="center" style="padding:36px 14px;">
          <table role="presentation" class="email-shell" width="600" cellspacing="0" cellpadding="0" border="0" style="width:600px; max-width:600px;">
            <tr>
              <td align="center" style="padding:0 12px 22px;">
                <span style="font-family:Georgia, 'Times New Roman', serif; font-size:22px; font-weight:bold; color:${colors.dark};">Minha Cartinha</span>
              </td>
            </tr>
            <tr>
              <td class="email-card" style="overflow:hidden; border:1px solid #E8DCDF; border-radius:32px; background-color:#FFFDFC; box-shadow:0 14px 36px rgba(77,32,46,0.08);">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr><td height="8" style="height:8px; background-color:${colors.accent}; font-size:0; line-height:0;">&nbsp;</td></tr>
                  <tr>
                    <td class="email-pad" align="center" style="padding:48px 54px 26px;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                        <tr><td align="center" width="58" height="58" style="width:58px; height:58px; border-radius:18px; background-color:${colors.soft}; font-family:Arial,sans-serif; font-size:27px; line-height:58px; color:${colors.accent};">&#128140;</td></tr>
                      </table>
                      <p style="margin:24px 0 8px; font-family:Arial,Helvetica,sans-serif; font-size:11px; font-weight:bold; line-height:16px; letter-spacing:2px; text-transform:uppercase; color:${colors.accent};">Uma surpresa para guardar</p>
                      <h1 class="email-title" style="margin:0; font-family:Georgia, 'Times New Roman', serif; font-size:42px; font-weight:normal; line-height:47px; letter-spacing:-1px; color:${colors.dark};">Uma cartinha especial<br>foi criada &#128140;</h1>
                      <p style="margin:20px auto 0; max-width:430px; font-family:Arial,Helvetica,sans-serif; font-size:16px; line-height:26px; color:#725A62;">Alguém transformou sentimentos em palavras e preparou um cantinho só de vocês. Abra quando puder viver esse momento com calma.</p>
                    </td>
                  </tr>
                  <tr>
                    <td class="email-pad" style="padding:10px 54px 28px;">
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                        <tr>
                          <td class="name-cell" width="50%" style="width:50%; padding-right:5px;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr><td style="padding:15px 17px; border-radius:16px; background-color:${colors.soft};"><p style="margin:0 0 4px; font-family:Arial,Helvetica,sans-serif; font-size:10px; font-weight:bold; line-height:14px; letter-spacing:1.4px; text-transform:uppercase; color:${colors.accent};">Para</p><p style="margin:0; font-family:Georgia, 'Times New Roman', serif; font-size:20px; line-height:26px; color:${colors.dark};">${recipientName}</p></td></tr></table>
                          </td>
                          <td class="name-cell" width="50%" style="width:50%; padding-left:5px;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr><td style="padding:15px 17px; border-radius:16px; background-color:${colors.soft};"><p style="margin:0 0 4px; font-family:Arial,Helvetica,sans-serif; font-size:10px; font-weight:bold; line-height:14px; letter-spacing:1.4px; text-transform:uppercase; color:${colors.accent};">De</p><p style="margin:0; font-family:Georgia, 'Times New Roman', serif; font-size:20px; line-height:26px; color:${colors.dark};">${senderName}</p></td></tr></table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td class="email-pad" align="center" style="padding:0 54px 36px;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center"><tr><td align="center" bgcolor="${colors.accent}" style="border-radius:999px; background-color:${colors.accent};"><a class="cta-link" href="${publicUrl}" target="_blank" style="display:inline-block; padding:16px 30px; border:1px solid ${colors.accent}; border-radius:999px; font-family:Arial,Helvetica,sans-serif; font-size:15px; font-weight:bold; line-height:18px; text-decoration:none; color:#FFFFFF;">Abrir minha cartinha&nbsp;&nbsp;&#8594;</a></td></tr></table>
                    </td>
                  </tr>
                  <tr>
                    <td class="email-pad" align="center" style="padding:34px 54px; border-top:1px solid #EEE4E6; background-color:#FCF8F7;">
                      <p style="margin:0 0 18px; font-family:Georgia, 'Times New Roman', serif; font-size:24px; line-height:30px; color:${colors.dark};">Leve esse carinho com você</p>
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0"><tr><td style="padding:10px; border:1px solid #E5D7DA; border-radius:22px; background-color:#FFFFFF;"><img src="cid:${qrCodeContentId}" width="190" height="190" alt="QR Code para abrir a cartinha" style="display:block; width:190px; max-width:100%; height:auto; border-radius:12px;"></td></tr></table>
                      <p style="margin:18px 0 0; font-family:Arial,Helvetica,sans-serif; font-size:14px; line-height:22px; color:#725A62;">Ou escaneie o QR Code para abrir no celular.</p>
                    </td>
                  </tr>
                  <tr>
                    <td class="email-pad" style="padding:28px 54px 40px;">
                      <p style="margin:0 0 9px; font-family:Arial,Helvetica,sans-serif; font-size:11px; font-weight:bold; line-height:16px; letter-spacing:1.2px; text-transform:uppercase; color:#9A7D86;">Se o botão não abrir, use este link</p>
                      <a href="${publicUrl}" target="_blank" style="font-family:Arial,Helvetica,sans-serif; font-size:13px; line-height:20px; text-decoration:underline; word-break:break-all; color:${colors.accent};">${publicUrl}</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:24px 18px 8px;">
                <p style="margin:0; font-family:Arial,Helvetica,sans-serif; font-size:12px; line-height:19px; color:#957E85;">Feito com carinho no <strong style="color:${colors.dark};">Minha Cartinha</strong></p>
                <p style="margin:7px 0 0; font-family:Arial,Helvetica,sans-serif; font-size:11px; line-height:17px; color:#B09DA3;">Este é um e-mail transacional enviado porque uma cartinha foi criada para este endereço.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = [
    "Uma cartinha especial foi criada 💌",
    "",
    "Alguém transformou sentimentos em palavras e preparou um cantinho só de vocês.",
    `Para: ${input.recipientName}`,
    `De: ${input.senderName}`,
    "",
    `Abra sua cartinha: ${input.publicUrl}`,
    "",
    "Feito com carinho no Minha Cartinha",
  ].join("\n");

  return { html, text };
}
