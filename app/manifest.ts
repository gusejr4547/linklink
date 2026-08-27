import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LinkLink",
    short_name: "LinkLink",
    description: "여기저기 저장해둔 링크를 태그와 메모로 정리하고 다시 쉽게 찾아보세요.",
    start_url: "/",
    display: "standalone",
    background_color: "#1B1F1C",
    theme_color: "#1B1F1C",
    icons: [
      { src: "/icons/192", sizes: "192x192", type: "image/png" },
      { src: "/icons/512", sizes: "512x512", type: "image/png" },
    ],
  };
}
