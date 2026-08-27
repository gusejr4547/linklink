import { ImageResponse } from "next/og";

export const alt = "LinkLink";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
          background: "#1B1F1C",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 100,
            fontWeight: 700,
            color: "#EAE2D0",
            letterSpacing: -2,
          }}
        >
          LinkLink
        </div>
        <div
          style={{
            display: "flex",
            width: 160,
            height: 6,
            background: "#35C9A8",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
