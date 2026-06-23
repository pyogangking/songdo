"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

// Mock weather data state for home preview
const TODAY_WEATHER = {
  temp: 22,
  pm25: 14,
  humidity: 58,
  windSpeed: 2.8,
  status: "쾌적",
  runningScore: 94,
  comment: "온화한 온도와 깨끗한 미세먼지! 오늘 저녁 해안가 러닝을 추천합니다.",
};

// 2026 Marathon list summary
const UPCOMING_MARATHONS = [
  {
    name: "2026 송도 이봉주 마라톤",
    date: "2026-06-28",
    location: "인천대학교 송도캠퍼스",
    distances: ["10km", "5km"],
    status: "접수 마감",
    statusColor: "bg-red-500/10 text-red-400 border-red-500/20",
    dday: "D-5",
  },
  {
    name: "2026 인천마라톤",
    date: "2026-11-22",
    location: "인천문학경기장 & 연수구",
    distances: ["Full", "Half", "10km", "5km"],
    status: "접수 중",
    statusColor: "bg-brand/10 text-brand border-brand/20",
    dday: "D-152",
  },
];

export default function Home() {
  const [weather, setWeather] = useState(TODAY_WEATHER);
  const [activeRuners, setActiveRunners] = useState(1284);

  // Simulate active runners count fluctuating
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveRunners((prev) => prev + (Math.random() > 0.5 ? 1 : -1));
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-16 px-4 py-8 md:px-8 mx-auto max-w-7xl w-full">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden rounded-3xl glass-panel py-16 px-8 md:px-16 md:py-24 text-center md:text-left flex flex-col lg:flex-row items-center justify-between gap-12 box-glow">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand/5 blur-3xl rounded-full"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-500/5 blur-3xl rounded-full"></div>
        
        <div className="flex flex-col gap-6 max-w-2xl z-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-semibold w-fit mx-auto md:mx-0">
            <span className="flex h-2 w-2 rounded-full bg-brand animate-pulse"></span>
            실시간 송도 러닝 동호인 {activeRuners}명 활동 중
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            송도의 바람을 가르다,<br />
            <span className="text-brand text-glow">SONGDO RUN</span> 포털
          </h1>
          
          <p className="text-zinc-400 text-lg md:text-xl font-normal leading-relaxed">
            인천 송도국제도시 러너들을 위한 종합 정보 포털입니다. 엄선된 5개 시그니처 러닝 코스 지도 시각화, 실시간 기상 적합도 계산기, 2026 마라톤 대회 일정까지 스마트하게 탐색하세요.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-4 justify-center md:justify-start">
            <Link
              id="hero-courses-btn"
              href="/courses"
              className="px-8 py-4 rounded-2xl bg-brand text-black font-bold text-base hover:bg-white transition-all hover:scale-[1.02] active:scale-[0.98] box-glow text-center cursor-pointer"
            >
              5대 러닝 코스 지도
            </Link>
            <Link
              id="hero-weather-btn"
              href="/weather"
              className="px-8 py-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-white font-semibold text-base hover:bg-zinc-800 transition-all hover:scale-[1.02] active:scale-[0.98] text-center cursor-pointer"
            >
              날씨 적합도 분석
            </Link>
          </div>
        </div>

        {/* Hero Decorative Info Card */}
        <div className="relative w-full max-w-[340px] aspect-square flex items-center justify-center animate-fade-in-up z-10" style={{ animationDelay: "150ms" }}>
          <div className="absolute inset-0 rounded-full border border-zinc-850 animate-pulse-ring"></div>
          <div className="absolute inset-8 rounded-full border border-brand/10"></div>
          <div className="glass-panel w-60 h-60 rounded-full flex flex-col items-center justify-center border-brand/35 relative z-10 shadow-2xl">
            <svg className="w-16 h-16 text-brand mb-2 animate-bounce" style={{ animationDuration: '3s' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m-3-10.5v12.75M9 3h6m-6 18h6" />
            </svg>
            <div className="text-zinc-500 text-[10px] uppercase tracking-wider font-bold">Today's Runner Index</div>
            <div className="text-3xl font-black text-white mt-1 text-glow">94 / 100점</div>
            <span className="text-brand text-xs font-semibold mt-1">달리기 최상 기온</span>
          </div>
        </div>
      </section>

      {/* 2. YouTube Shorts Embed & Weather Suitability Row */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: YouTube Shorts Promo Video Embed (5 columns) */}
        <div className="lg:col-span-5 flex flex-col gap-6 w-full animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">송도 러닝 동기부여 쇼츠</h2>
            <p className="text-zinc-500 text-sm mt-1">송도의 아름다운 전경과 러닝 욕구를 자극하는 홍보 숏폼 영상</p>
          </div>

          {/* Smartphone Mockup Frame */}
          <div className="relative w-[280px] h-[500px] md:w-[300px] md:h-[530px] mx-auto rounded-[3rem] border-[6px] border-zinc-850 bg-black shadow-2xl overflow-hidden box-glow">
            {/* Top Speaker/Camera Notch */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-20 h-4 bg-zinc-900 rounded-full z-30 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-800"></div>
              <div className="w-8 h-1 rounded-full bg-zinc-800 ml-2"></div>
            </div>

            {/* Status Bar simulation */}
            <div className="absolute top-8 left-0 right-0 px-6 flex justify-between items-center text-[10px] text-zinc-400 font-medium z-20 select-none">
              <span>16:39</span>
              <div className="flex items-center gap-1.5">
                <span>5G</span>
                <span className="text-emerald-500">⚡ 88%</span>
              </div>
            </div>

            {/* YouTube Shorts Embed Iframe */}
            <div className="w-full h-full pt-12 pb-6 px-1 relative z-10 bg-zinc-950">
              <iframe
                id="youtube-shorts-iframe"
                src="https://www.youtube.com/embed/5a4G7m1l5mI?autoplay=0&loop=1&playlist=5a4G7m1l5mI&controls=1&mute=1"
                title="Songdo Running Motivation Shorts"
                className="w-full h-full border-0 rounded-2xl shadow-inner"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            {/* Bottom Home Indicator Bar */}
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-24 h-1 bg-zinc-700 rounded-full z-20"></div>
          </div>
        </div>

        {/* Right Side: Weather Score & Marathons (7 columns) */}
        <div className="lg:col-span-7 flex flex-col gap-8 w-full animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          
          {/* Weather Widget */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white">오늘의 날씨 리포트</h2>
                <p className="text-zinc-500 text-sm mt-1">연수구 송도동 실시간 기상 상태 및 달리기 지수</p>
              </div>
              <Link href="/weather" className="text-brand hover:text-white text-xs font-bold transition-colors">
                적합도 계산기 가기 &rarr;
              </Link>
            </div>

            <div className="glass-panel rounded-3xl p-6 border-brand/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 blur-3xl rounded-full"></div>
              
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand/10 border border-brand/20 text-brand">Running Index</span>
                  <h3 className="text-2xl font-extrabold text-white mt-3">
                    오늘 러닝 적합도 <span className="text-brand text-glow">{weather.runningScore}점</span>
                  </h3>
                </div>
                <span className="text-3xl">🏃‍♂️💨</span>
              </div>

              <p className="text-zinc-300 text-sm leading-relaxed my-5 font-medium">
                &quot;{weather.comment}&quot;
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-zinc-900 pt-5 text-center">
                <div>
                  <div className="text-zinc-500 text-[10px]">기온</div>
                  <div className="text-base font-bold text-white mt-0.5">{weather.temp}°C</div>
                </div>
                <div>
                  <div className="text-zinc-500 text-[10px]">미세먼지</div>
                  <div className="text-base font-bold text-brand mt-0.5">{weather.pm25} ㎍/㎡ (좋음)</div>
                </div>
                <div>
                  <div className="text-zinc-500 text-[10px]">습도</div>
                  <div className="text-base font-bold text-white mt-0.5">{weather.humidity}%</div>
                </div>
                <div>
                  <div className="text-zinc-500 text-[10px]">해안 풍속</div>
                  <div className="text-base font-bold text-white mt-0.5">{weather.windSpeed} m/s</div>
                </div>
              </div>
            </div>
          </div>

          {/* Marathon Widget */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white">2026 송도/인천 마라톤 일정</h2>
                <p className="text-zinc-500 text-sm mt-1">지역에서 다가오는 주요 대회 소식 및 참가 접수 정보</p>
              </div>
              <Link href="/marathons" className="text-brand hover:text-white text-xs font-bold transition-colors">
                전체 대회 일정 &rarr;
              </Link>
            </div>

            <div className="flex flex-col gap-4">
              {UPCOMING_MARATHONS.map((marathon, idx) => (
                <div 
                  key={idx} 
                  className="glass-panel glass-panel-hover rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${marathon.statusColor}`}>
                        {marathon.status}
                      </span>
                      <span className="text-[10px] font-semibold text-zinc-500">{marathon.date}</span>
                    </div>
                    <h3 className="text-base font-bold text-white">{marathon.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <span>장소: <strong>{marathon.location}</strong></span>
                      <span className="text-zinc-700">|</span>
                      <span>코스: <strong>{marathon.distances.join(", ")}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-zinc-900 pt-3 sm:pt-0">
                    <span className="text-brand font-black text-xl text-glow tracking-wider w-16 text-center">
                      {marathon.dday}
                    </span>
                    <Link
                      id={`home-marathon-link-${idx}`}
                      href="/marathons"
                      className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors whitespace-nowrap"
                    >
                      상세 보기
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 3. Signature Courses Brief Section */}
      <section className="flex flex-col gap-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">송도 5대 러닝 코스 둘러보기</h2>
            <p className="text-zinc-500 text-sm mt-1">송도의 자연환경과 도심 인프라를 달리는 전용 루트 가이드</p>
          </div>
          <Link href="/courses" className="text-brand hover:text-white text-sm font-semibold transition-colors flex items-center gap-1 group">
            코스 지도로 탐색
            <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col justify-between min-h-[160px]">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded border text-emerald-400 bg-emerald-500/10 border-emerald-500/20">초급</span>
                <span className="text-zinc-400 text-xs font-semibold">4.2km</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 leading-snug">송도 센트럴파크 해수로 코스</h3>
              <p className="text-zinc-500 text-xs line-clamp-2">한옥마을 조명과 해수로 보트를 따라 달리는 초급자용 야경 명소 코스</p>
            </div>
            <Link href="/courses?selected=central-park" className="text-xs text-brand mt-4 font-semibold hover:text-white">지도보기 &rarr;</Link>
          </div>

          <div className="glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col justify-between min-h-[160px]">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded border text-amber-400 bg-amber-500/10 border-amber-500/20">중급</span>
                <span className="text-zinc-400 text-xs font-semibold">6.8km</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 leading-snug">인천대 외곽 해안선 코스</h3>
              <p className="text-zinc-500 text-xs line-clamp-2">서해 낙조와 솔찬공원의 시원한 바닷길 정취를 느낄 수 있는 중급 코스</p>
            </div>
            <Link href="/courses?selected=inu-loop" className="text-xs text-brand mt-4 font-semibold hover:text-white">지도보기 &rarr;</Link>
          </div>

          <div className="glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col justify-between min-h-[160px]">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded border text-rose-400 bg-rose-500/10 border-rose-500/20">상급</span>
                <span className="text-zinc-400 text-xs font-semibold">10.5km</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 leading-snug">잭니클라우스 CC 외곽 순환</h3>
              <p className="text-zinc-500 text-xs line-clamp-2">신호 대기 없이 바다 바람을 맞으며 훈련할 수 있는 논스톱 장거리 코스</p>
            </div>
            <Link href="/courses?selected=jack-nicklaus" className="text-xs text-brand mt-4 font-semibold hover:text-white">지도보기 &rarr;</Link>
          </div>
        </div>
      </section>

    </div>
  );
}
