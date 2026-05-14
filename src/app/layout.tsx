import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lay-down.pages.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "幸福生活计算器",
    template: "%s | 幸福生活计算器",
  },
  description: "用幸福生活计算器估算存款、收入、支出和通胀下的生活可持续时间。",
  keywords: [
    "躺平",
    "躺平计算器",
    "幸福生活计算器",
    "财务自由计算器",
    "退休计算器",
    "存款计算器",
    "生活成本计算器",
  ],
  applicationName: "幸福生活计算器",
  authors: [{ name: "幸福生活计算器" }],
  creator: "幸福生活计算器",
  publisher: "幸福生活计算器",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "幸福生活计算器",
    description: "围绕幸福生活、存款、收入、支出和通胀，估算当前生活方案能维持多久。",
    url: "/",
    siteName: "幸福生活计算器",
    locale: "zh_CN",
    type: "website",
    images: [
      {
        url: "/icon.svg",
        width: 512,
        height: 512,
        alt: "幸福生活计算器图标",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "幸福生活计算器",
    description: "幸福生活关键词下的生活可持续时间测算工具。",
    images: ["/icon.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml", sizes: "512x512" },
    ],
    shortcut: "/favicon.svg",
    apple: "/icon.svg",
  },
  category: "finance",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
