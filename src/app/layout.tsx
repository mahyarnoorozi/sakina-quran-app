import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "سَکینه | قرآن و آرامش",
  description: "تلاوت قرآن کریم با میکسر صداهای آرامش‌بخش طبیعت — تجربه‌ای لوکس و معنوی",
  keywords: ["قرآن", "سکینه", "تلاوت", "آرامش", "صدای باران", "قاری", "خواب"],
  authors: [{ name: "سَکینه" }],
  manifest: "/manifest.json",
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "سَکینه",
  },
  openGraph: {
    title: "سَکینه | قرآن و آرامش",
    description: "تلاوت قرآن کریم با میکسر صداهای آرامش‌بخش طبیعت",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0B100E" },
    { media: "(prefers-color-scheme: light)", color: "#FAF9F6" },
  ],
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
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground min-h-screen">
        {children}
        <Toaster />
        <Sonner position="top-center" dir="rtl" />
      </body>
    </html>
  );
}
