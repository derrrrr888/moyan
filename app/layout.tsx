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
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🖋️</text></svg>",
    shortcut: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🖋️</text></svg>",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}