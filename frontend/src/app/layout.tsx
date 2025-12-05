import type { Metadata } from "next";
import { Space_Grotesk, Anton } from "next/font/google";
import "./globals.css";
import '@rainbow-me/rainbowkit/styles.css';
import { Providers } from "./providers";
import { Toaster } from "sonner";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const anton = Anton({
  weight: "400",
  variable: "--font-anton",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "No-Loss Football Betting Protocol",
  description: "Prediksi. Menang. Tanpa Rugi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${anton.variable} antialiased bg-midnight text-cool-white`}
      >
        <Providers>
            {children}
            <Toaster position="bottom-right" richColors theme="dark" />
        </Providers>
      </body>
    </html>
  );
}
