import type { Metadata } from "next";
import { Outfit, Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "송도 러닝 포털 | SONGDO RUN",
  description: "송도국제도시 러너들을 위한 종합 정보 포털. 5대 러닝 코스 지도 시각화, 실시간 날씨 및 러닝 적합도 분석, 2026년 마라톤 일정까지 제공합니다.",
  keywords: ["송도 러닝", "송도 마라톤", "송도 달리기", "인천 마라톤", "센트럴파크 러닝", "송도 날씨", "달리기 적합도", "러닝 코스 지도"],
  openGraph: {
    title: "송도 러닝 포털 | SONGDO RUN",
    description: "송도국제도시 러너들을 위한 종합 정보 포털. 5대 러닝 코스 지도, 실시간 날씨 적합도, 2026년 마라톤 일정.",
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${outfit.variable} ${notoSansKr.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#06080c] text-zinc-100 font-sans selection:bg-brand selection:text-black">
        <Navbar />
        <main className="flex-1 flex flex-col w-full">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
