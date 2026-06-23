"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "홈", path: "/" },
    { name: "러닝 코스", path: "/courses" },
    { name: "실시간 날씨", path: "/weather" },
    { name: "마라톤 대회", path: "/marathons" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full px-4 py-4 md:px-8">
      <nav 
        id="main-navigation"
        className="mx-auto max-w-7xl glass-panel rounded-2xl px-6 py-4 flex items-center justify-between transition-all duration-300"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-brand"></span>
          </span>
          <span className="font-bold text-xl tracking-tight text-white group-hover:text-brand transition-colors">
            SONGDO<span className="text-brand">RUN</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                id={`nav-link-${item.path === "/" ? "home" : item.path.substring(1)}`}
                href={item.path}
                className={`relative text-sm font-medium transition-colors duration-250 py-1 ${
                  isActive ? "text-brand" : "text-zinc-400 hover:text-white"
                }`}
              >
                {item.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-brand rounded-full box-glow"></span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="hidden md:flex items-center">
          <Link
            id="nav-quick-start-btn"
            href="/courses"
            className="px-5 py-2 rounded-xl bg-brand text-black font-semibold text-sm hover:bg-white transition-all duration-300 transform hover:scale-[1.03] box-glow active:scale-[0.98]"
          >
            코스 보러가기
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          id="mobile-menu-toggle"
          onClick={() => setIsOpen(!isOpen)}
          className="flex md:hidden p-2 text-zinc-400 hover:text-white focus:outline-none"
          aria-label="Toggle Menu"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Drawer */}
      {isOpen && (
        <div 
          id="mobile-drawer"
          className="md:hidden mt-2 glass-panel rounded-2xl p-4 flex flex-col gap-3 animate-fade-in-up"
        >
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                id={`mobile-nav-link-${item.path === "/" ? "home" : item.path.substring(1)}`}
                href={item.path}
                onClick={() => setIsOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-brand/10 text-brand border border-brand/20"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
          <Link
            id="mobile-nav-quick-start-btn"
            href="/courses"
            onClick={() => setIsOpen(false)}
            className="mt-2 w-full text-center py-3 rounded-xl bg-brand text-black font-bold hover:bg-white transition-colors"
          >
            러닝 코스 보러가기
          </Link>
        </div>
      )}
    </header>
  );
}
