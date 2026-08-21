import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "拾墨杂谈 - 以文字为舟，载思想而行",
    template: "%s | 拾墨杂谈",
  },
  description: "拾墨杂谈是一个文学内容平台，收录散文、随笔、小说、时评、诗歌等原创文字作品。以文字为舟，载思想而行。",
  keywords: ["拾墨杂谈", "文学", "散文", "随笔", "小说", "诗歌", "原创", "写作", "阅读"],
  authors: [{ name: "拾墨杂谈" }],
  metadataBase: new URL("https://www.shimozatan.com"),
  openGraph: {
    title: "拾墨杂谈",
    description: "以文字为舟，载思想而行。记录文字里的温度与思考。",
    type: "website",
    locale: "zh_CN",
    siteName: "拾墨杂谈",
  },
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%238b7355'/%3E%3Cpath d='M10 24c2-1 4-3 5-6 1-2 1-4 0-6-1-2-2-3-3-4-1 2-2 4-2 6 0 2 0 4 0 6z' fill='%23fefdfb' opacity='0.9'/%3E%3Cpath d='M18 8c-1 2-2 5-1 8 1 2 3 4 5 5' stroke='%23fefdfb' stroke-width='2' stroke-linecap='round' fill='none' opacity='0.85'/%3E%3C/svg%3E",
        type: "image/svg+xml",
      },
    ],
    shortcut: [
      {
        url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%238b7355'/%3E%3Cpath d='M10 24c2-1 4-3 5-6 1-2 1-4 0-6-1-2-2-3-3-4-1 2-2 4-2 6 0 2 0 4 0 6z' fill='%23fefdfb' opacity='0.9'/%3E%3Cpath d='M18 8c-1 2-2 5-1 8 1 2 3 4 5 5' stroke='%23fefdfb' stroke-width='2' stroke-linecap='round' fill='none' opacity='0.85'/%3E%3C/svg%3E",
        type: "image/svg+xml",
      },
    ],
    apple: [
      {
        url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 180 180'%3E%3Crect width='180' height='180' rx='36' fill='%238b7355'/%3E%3Cpath d='M60 130c10-5 20-15 25-30 5-10 5-20 0-30-5-10-10-15-15-20-5 10-10 20-10 30 0 10 0 20 0 50z' fill='%23fefdfb' opacity='0.9'/%3E%3Cpath d='M110 50c-5 15-10 35-5 50 5 15 15 25 25 30' stroke='%23fefdfb' stroke-width='12' stroke-linecap='round' fill='none' opacity='0.85'/%3E%3C/svg%3E",
        sizes: "180x180",
      },
    ],
  },

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}