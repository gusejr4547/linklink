import { Gowun_Batang, Gothic_A1, IBM_Plex_Mono } from "next/font/google";

export const gowunBatang = Gowun_Batang({
  weight: "700",
  subsets: ["latin"],
  variable: "--font-display",
});

export const gothicA1 = Gothic_A1({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-body",
});

export const plexMono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-mono",
});
