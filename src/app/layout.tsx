import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "RorroBox",
    template: "%s | RorroBox",
  },
  description: "Gestión de Rendimiento y Programación de CrossFit - Box Curicó",
  manifest: "/manifest.json",
  themeColor: "#020617",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "RorroBox",
  },
  icons: {
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "RorroBox Training",
    description: "Eleva tu rendimiento con la programación técnica de RorroBox.",
    url: "https://rorrobox.vercel.app",
    siteName: "RorroBox",
    images: [
      {
        url: "/icon-512x512.png",
        width: 512,
        height: 512,
        alt: "RorroBox Digital",
      },
    ],
    locale: "es_CL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RorroBox",
    description: "Plataforma de Alto Rendimiento para Atletas.",
    images: ["/icon-512x512.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
