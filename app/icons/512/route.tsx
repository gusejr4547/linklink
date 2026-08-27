import { ImageResponse } from "next/og";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1B1F1C",
          color: "#35C9A8",
          fontSize: 313,
          fontWeight: 700,
        }}
      >
        L
      </div>
    ),
    { width: 512, height: 512 }
  );
}
