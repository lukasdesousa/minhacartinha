import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Minha Cartinha — uma cartinha de amor online com foto, música e QR Code";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const coverData = await readFile(
  join(process.cwd(), "public", "demo", "clara-e-gabriel", "capa-og.jpg"),
  "base64",
);
const coverSrc = `data:image/jpeg;base64,${coverData}`;

function Heart({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21.2 3.15 12.4A5.55 5.55 0 0 1 11 4.55L12 5.6l1.05-1.05a5.55 5.55 0 1 1 7.85 7.85L12 21.2Z" />
    </svg>
  );
}

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "linear-gradient(128deg, #fffaf7 0%, #f8eaed 57%, #eee9f6 100%)",
        color: "#4b1e2c",
        display: "flex",
        fontFamily: "Arial, sans-serif",
        height: "100%",
        overflow: "hidden",
        padding: "48px 58px",
        position: "relative",
        width: "100%",
      }}
    >
      <div
        style={{
          background: "rgba(195, 112, 135, 0.16)",
          borderRadius: 999,
          display: "flex",
          height: 420,
          left: -225,
          position: "absolute",
          top: -245,
          width: 420,
        }}
      />
      <div
        style={{
          background: "rgba(139, 119, 181, 0.12)",
          borderRadius: 999,
          bottom: -240,
          display: "flex",
          height: 500,
          position: "absolute",
          right: -180,
          width: 500,
        }}
      />
      <div
        style={{
          border: "1px solid rgba(129, 65, 84, 0.08)",
          borderRadius: 44,
          bottom: 32,
          display: "flex",
          left: 32,
          position: "absolute",
          right: 32,
          top: 32,
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
          padding: "6px 0 4px 10px",
          width: 655,
          zIndex: 2,
        }}
      >
        <div style={{ alignItems: "center", display: "flex" }}>
          <div
            style={{
              alignItems: "center",
              background: "#8e2f4b",
              borderRadius: 999,
              color: "#fff7f9",
              display: "flex",
              height: 56,
              justifyContent: "center",
              marginRight: 16,
              width: 56,
            }}
          >
            <Heart size={25} />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 32, fontWeight: 700, letterSpacing: -1.2 }}>
              Minha Cartinha
            </div>
            <div style={{ color: "#9a6877", fontSize: 13, fontWeight: 700, letterSpacing: 2.3, marginTop: 3 }}>
              UMA SURPRESA SÓ DE VOCÊS
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", marginTop: 22 }}>
          <div
            style={{
              color: "#4c1f2d",
              display: "flex",
              flexDirection: "column",
              fontFamily: "Georgia, serif",
              fontSize: 65,
              fontWeight: 700,
              letterSpacing: -3.2,
              lineHeight: 0.98,
            }}
          >
            <span>Seu amor merece</span>
            <span style={{ color: "#9b405b", fontStyle: "italic", fontWeight: 400 }}>virar uma lembrança.</span>
          </div>
          <div
            style={{
              color: "#745661",
              display: "flex",
              fontSize: 23,
              lineHeight: 1.42,
              marginTop: 24,
              maxWidth: 570,
            }}
          >
            Crie uma cartinha de amor com suas palavras, fotos e a música de vocês.
          </div>
        </div>

        <div style={{ alignItems: "center", display: "flex" }}>
          {["Fotos", "Música", "Link + QR Code"].map((feature, index) => (
            <div
              key={feature}
              style={{
                alignItems: "center",
                background: index === 2 ? "#8e2f4b" : "rgba(255,255,255,0.78)",
                border: index === 2 ? "1px solid #8e2f4b" : "1px solid #e3cdd3",
                borderRadius: 999,
                color: index === 2 ? "white" : "#704253",
                display: "flex",
                fontSize: 15,
                fontWeight: 700,
                marginRight: 10,
                padding: "11px 17px",
              }}
            >
              {index < 2 ? (
                <span style={{ color: "#a55069", display: "flex", marginRight: 8 }}>●</span>
              ) : null}
              {feature}
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          background: "#fffdfb",
          border: "7px solid rgba(255,255,255,0.9)",
          borderRadius: 34,
          boxShadow: "0 28px 70px rgba(74, 29, 44, 0.22)",
          display: "flex",
          flexDirection: "column",
          height: 520,
          marginLeft: 28,
          overflow: "hidden",
          position: "relative",
          transform: "rotate(2.2deg)",
          width: 400,
          zIndex: 2,
        }}
      >
        <div style={{ display: "flex", height: 274, overflow: "hidden", position: "relative", width: "100%" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverSrc}
            alt=""
            style={{ height: "100%", objectFit: "cover", objectPosition: "center", width: "100%" }}
          />
          <div
            style={{
              background: "linear-gradient(to top, rgba(48, 17, 28, 0.78), rgba(48, 17, 28, 0.04) 68%)",
              bottom: 0,
              display: "flex",
              left: 0,
              position: "absolute",
              right: 0,
              top: 0,
            }}
          />
          <div
            style={{
              bottom: 20,
              color: "white",
              display: "flex",
              flexDirection: "column",
              left: 0,
              position: "absolute",
              right: 0,
              textAlign: "center",
            }}
          >
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5 }}>NOSSA HISTÓRIA</span>
            <span style={{ fontFamily: "Georgia, serif", fontSize: 38, fontWeight: 700, letterSpacing: -1, marginTop: 7 }}>
              Clara &amp; Gabriel
            </span>
          </div>
        </div>
        <div
          style={{
            alignItems: "center",
            background: "linear-gradient(160deg, #fffdfb, #f9eef0)",
            display: "flex",
            flex: 1,
            flexDirection: "column",
            padding: "27px 34px",
            textAlign: "center",
          }}
        >
          <div style={{ color: "#a14c65", display: "flex" }}><Heart size={20} /></div>
          <div
            style={{
              color: "#603344",
              display: "flex",
              fontFamily: "Georgia, serif",
              fontSize: 24,
              fontStyle: "italic",
              lineHeight: 1.28,
              marginTop: 13,
            }}
          >
            “Com você, até os dias comuns viraram memória boa.”
          </div>
          <div style={{ alignItems: "center", color: "#9c7180", display: "flex", fontSize: 12, fontWeight: 700, marginTop: 17 }}>
            <span style={{ background: "#b75c75", borderRadius: 999, display: "flex", height: 7, marginRight: 7, width: 7 }} />
            Nossa música&nbsp;&nbsp;·&nbsp;&nbsp;12 de junho
          </div>
        </div>
      </div>

      <div
        style={{
          alignItems: "center",
          background: "#fff",
          border: "1px solid #ead7dc",
          borderRadius: 999,
          boxShadow: "0 12px 28px rgba(74,29,44,0.13)",
          color: "#704253",
          display: "flex",
          fontSize: 14,
          fontWeight: 700,
          padding: "11px 17px",
          position: "absolute",
          right: 27,
          top: 73,
          transform: "rotate(5deg)",
          zIndex: 3,
        }}
      >
        <span style={{ color: "#ad526c", display: "flex", marginRight: 8 }}><Heart size={15} /></span>
        Feita por você
      </div>
    </div>,
    size,
  );
}
