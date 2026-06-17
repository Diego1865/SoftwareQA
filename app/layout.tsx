import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./styles/globals.css";
import { AppContextProvider } from "./context/AppContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Scholar Grid",
  description: "Plataforma colaborativa que centraliza, organiza y monetiza recursos educativos.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Scholar Grid",
  },
};

export const viewport: Viewport = {
  themeColor: "#101411",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased bg-dark-bg`}
    >
      <body className="min-h-full flex flex-col font-sans text-text-light antialiased select-none">
        <AppContextProvider>
          {children}
        </AppContextProvider>
      </body>
    </html>
  );
}
