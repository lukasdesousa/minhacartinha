import { ImageResponse } from "next/og";

export const alt = "Minha Cartinha — crie uma cartinha de amor online grátis";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "linear-gradient(135deg, #fffaf8 0%, #f5e6e9 58%, #ebe5f3 100%)",
        color: "#4d202e",
        display: "flex",
        fontFamily: "Georgia, serif",
        height: "100%",
        justifyContent: "space-between",
        overflow: "hidden",
        padding: "68px 76px",
        position: "relative",
        width: "100%",
      }}
    >
      <div
        style={{
          background: "rgba(142, 47, 75, 0.12)",
          borderRadius: 999,
          display: "flex",
          height: 430,
          left: -190,
          position: "absolute",
          top: -210,
          width: 430,
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", maxWidth: 670 }}>
        <div style={{ alignItems: "center", display: "flex", fontSize: 30, fontWeight: 700 }}>
          <div
            style={{
              alignItems: "center",
              background: "#f1dce2",
              borderRadius: 18,
              color: "#8e2f4b",
              display: "flex",
              fontFamily: "Arial, sans-serif",
              height: 58,
              justifyContent: "center",
              marginRight: 18,
              width: 58,
            }}
          >
            ♥
          </div>
          Minha Cartinha
        </div>
        <div style={{ fontSize: 72, fontWeight: 600, letterSpacing: -3, lineHeight: 1.02, marginTop: 58 }}>
          Seu amor merece virar uma lembrança.
        </div>
        <div style={{ color: "#795d66", display: "flex", fontFamily: "Arial, sans-serif", fontSize: 25, lineHeight: 1.45, marginTop: 28 }}>
          Crie uma cartinha de amor online, personalize e compartilhe gratuitamente.
        </div>
        <div
          style={{
            alignItems: "center",
            alignSelf: "flex-start",
            background: "#8e2f4b",
            borderRadius: 999,
            color: "white",
            display: "flex",
            fontFamily: "Arial, sans-serif",
            fontSize: 20,
            fontWeight: 700,
            marginTop: 36,
            padding: "15px 25px",
          }}
        >
          Crie grátis em poucos minutos
        </div>
      </div>
      <div
        style={{
          background: "#fffdfc",
          border: "2px solid rgba(142, 47, 75, 0.14)",
          borderRadius: 34,
          boxShadow: "0 24px 70px rgba(77, 32, 46, 0.16)",
          display: "flex",
          flexDirection: "column",
          height: 430,
          padding: "38px 34px",
          transform: "rotate(3deg)",
          width: 310,
        }}
      >
        <div style={{ color: "#a15c70", display: "flex", fontFamily: "Arial, sans-serif", fontSize: 14, letterSpacing: 3 }}>
          PARA QUEM EU AMO
        </div>
        <div style={{ color: "#5a2737", display: "flex", fontSize: 43, fontStyle: "italic", marginTop: 48 }}>
          “Eu escolheria você em todas as vidas.”
        </div>
        <div style={{ background: "#ead2d9", display: "flex", height: 2, marginTop: 38, width: 58 }} />
        <div style={{ color: "#8e6070", display: "flex", fontFamily: "Arial, sans-serif", fontSize: 16, marginTop: 24 }}>
          Com amor, sempre.
        </div>
      </div>
    </div>,
    size,
  );
}
