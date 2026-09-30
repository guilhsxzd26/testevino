import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const serif = Cormorant_Garamond({ subsets: ["latin"], variable: "--font-serif", weight: ["500","600","700"] });
const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Videira — Curadoria de Vinhos",
  description: "Catálogo premium de vinhos selecionados."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${serif.variable} ${sans.variable}`}>{children}</body>
    </html>
  );
}