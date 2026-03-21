import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppLayout from "@/components/layout/AppLayout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Strait | TUFS Student Platform",
  description: "東京外国語大学の学生向け情報プラットフォーム。学期予定、施設情報、サークル情報を一元化。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-surface text-on-surface animate-fade-in">
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
