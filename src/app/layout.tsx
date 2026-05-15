import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://lay-down.317713.xyz";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "幸福生活计算器 - 财务自由与退休规划工具",
    template: "%s | 幸福生活计算器",
  },
  description: "用幸福生活计算器估算存款、收入、支出和通胀下的躺平生活可持续时间。一款专为中国用户打造的财务自由、FIRE与退休规划工具。",
  keywords: [
    "躺平",
    "躺平计算器",
    "躺平生活",
    "躺平退休",
    "躺平方案",
    "Fire躺平",
    "躺平财务自由",
    "幸福生活计算器",
    "财务自由计算器",
    "FIRE计算器",
    "退休计算器",
    "存款计算器",
    "生活成本计算器",
    "中国退休计算",
    "被动收入计算器",
    "理财规划工具",
  ],
  applicationName: "幸福生活计算器",
  authors: [{ name: "幸福生活计算器" }],
  creator: "幸福生活计算器",
  publisher: "幸福生活计算器",
  alternates: {
    canonical: siteUrl,
    languages: {
      "zh-CN": siteUrl,
      "zh": siteUrl,
      "x-default": siteUrl,
    },
  },
  openGraph: {
    title: "幸福生活计算器 - FIRE财务自由与退休规划工具",
    description: "基于中国国情，围绕存款、收入、支出和通胀，估算你的躺平方案能维持多久。",
    url: siteUrl,
    siteName: "幸福生活计算器",
    locale: "zh_CN",
    countryName: "中国",
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
    card: "summary_large_image",
    title: "幸福生活计算器 - 财务自由规划",
    description: "估算你的存款能支撑多久的幸福生活。中国版FIRE计算器。",
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
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico",
    apple: "/icon.svg",
  },
  category: "finance",
  verification: {
    google: "google7cfc68ab913bcd14",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "幸福生活计算器",
  description: "估算存款、收入、支出和通胀下的躺平生活可持续时间的在线计算器。",
  url: siteUrl,
  applicationCategory: "FinanceApplication",
  operatingSystem: "All",
  offers: { "@type": "Offer", price: "0", priceCurrency: "CNY" },
  author: { "@type": "Organization", name: "幸福生活计算器" },
  inLanguage: "zh-CN",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <meta name="geo.region" content="CN" />
        <meta name="geo.placename" content="中国" />
      </head>
      <body className="font-inter">
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
