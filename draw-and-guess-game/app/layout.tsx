import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "你画我猜 - AI 猜图游戏",
  description: "一个基于 AI 的你画我猜在线游戏",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
        {children}
      </body>
    </html>
  );
}
