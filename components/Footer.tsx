import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-zinc-900 bg-black/40 backdrop-blur-md mt-auto">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          <Link
            id="footer-link-about"
            href="/about"
            className="text-zinc-500 hover:text-brand text-sm transition-colors"
          >
            소개
          </Link>
          <Link
            id="footer-link-terms"
            href="/terms"
            className="text-zinc-500 hover:text-brand text-sm transition-colors"
          >
            이용약관
          </Link>
          <Link
            id="footer-link-privacy"
            href="/privacy"
            className="text-zinc-500 hover:text-brand text-sm transition-colors"
          >
            개인정보처리방침
          </Link>
        </div>
        <div className="mt-8 md:order-1 md:mt-0 text-center md:text-left">
          <div className="flex justify-center md:justify-start items-center gap-2 mb-3">
            <span className="h-2 w-2 rounded-full bg-brand"></span>
            <span className="font-bold text-sm tracking-tight text-white">
              SONGDO<span className="text-brand">RUN</span>
            </span>
          </div>
          <p className="text-xs leading-5 text-zinc-600">
            &copy; {new Date().getFullYear()} 송도 러닝 포털 (SONGDO RUN). All rights reserved.
          </p>
          <p className="text-[10px] leading-5 text-zinc-700 mt-1">
            송도 러너들을 위한 5대 코스 맵핑, 실시간 날씨 분석, 마라톤 일정 정보 포털
          </p>
        </div>
      </div>
    </footer>
  );
}
