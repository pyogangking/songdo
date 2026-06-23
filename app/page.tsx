"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

// Fallback weather data (same as weather page mock)
const FALLBACK_WEATHER = {
  temp: 21,
  pm25: 12,
  humidity: 55,
  windSpeed: 2.5,
  sky: "맑음",
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

function computeRunningScore(temp: number, pm25: number, humidity: number, windSpeed: number, sky: string) {
  // 1. Temp score (Ideal: 14°C)
  const idealTemp = 14;
  const tempDiff = Math.abs(temp - idealTemp);
  const tempScore = Math.max(0, 100 - Math.pow(tempDiff, 1.4) * 2.2);

  // 2. Fine Dust PM2.5 score
  let dustScore = 100;
  if (pm25 <= 15) dustScore = 100;
  else if (pm25 <= 35) dustScore = 80;
  else if (pm25 <= 75) dustScore = 40;
  else dustScore = 10;

  // 3. Humidity score (Ideal: 50%)
  const humidityDiff = Math.abs(humidity - 50);
  const humidityScore = Math.max(0, 100 - humidityDiff * 1.0);

  // 4. Wind score (Ideal: <= 2.0 m/s)
  const windScore = Math.max(0, 100 - Math.max(0, windSpeed - 2) * 8.5);

  // 5. Sky condition multiplier
  let skyMultiplier = 1.0;
  if (sky === "구름많음") skyMultiplier = 0.95;
  else if (sky === "비") skyMultiplier = 0.45;
  else if (sky === "눈") skyMultiplier = 0.35;

  const weightedBase = tempScore * 0.35 + dustScore * 0.35 + humidityScore * 0.15 + windScore * 0.15;
  const finalScore = Math.round(weightedBase * skyMultiplier);
  return Math.max(0, Math.min(100, finalScore));
}

function getWeatherComment(score: number, temp: number, sky: string) {
  if (score >= 85) return `온화한 온도(${temp}°C)와 맑은 날씨! 오늘 저녁 해안가 러닝을 추천합니다.`;
  if (score >= 70) return `러닝하기 준수한 날씨입니다(${temp}°C). 가볍게 조깅을 시작해 보세요.`;
  if (score >= 50) return `${sky === "비" ? "비가 내리는" : "흐린"} 날씨(${temp}°C)입니다. 조심히 달리세요.`;
  return `오늘은 야외 러닝에 적합하지 않습니다(${temp}°C). 실내 운동을 고려해 보세요.`;
}

export default function Home() {
  const [weather, setWeather] = useState<null | {
    temp: number; pm25: number; humidity: number; windSpeed: number; sky: string;
  }>(null);
  const [runningScore, setRunningScore] = useState(94);
  const [activeRuners, setActiveRunners] = useState(1284);

  // Fetch live weather
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const resp = await fetch('/api/weather');
        if (!resp.ok) throw new Error('failed');
        const data = await resp.json();

        const temp = data.temperature?.degrees ?? FALLBACK_WEATHER.temp;
        const humidity = data.relativeHumidity ?? FALLBACK_WEATHER.humidity;
        const windKmph = data.wind?.speed?.kmph ?? 9.0;
        const windSpeed = parseFloat((windKmph / 3.6).toFixed(1));
        const condType = data.weatherCondition?.type ?? "CLEAR";

        let sky = "맑음";
        if (condType.includes("CLOUD") || condType.includes("OVERCAST")) sky = "구름많음";
        else if (condType.includes("RAIN") || condType.includes("DRIZZLE") || condType.includes("STORM")) sky = "비";
        else if (condType.includes("SNOW") || condType.includes("ICE")) sky = "눈";

        // 에어코리아 실시간 PM2.5
        const pm25 = data.airQuality?.pm25 ?? FALLBACK_WEATHER.pm25;

        const mapped = { temp, pm25, humidity, windSpeed, sky };
        setWeather(mapped);
        setRunningScore(computeRunningScore(temp, pm25, humidity, windSpeed, sky));
      } catch {
        const fb = FALLBACK_WEATHER;
        setWeather(fb);
        setRunningScore(computeRunningScore(fb.temp, fb.pm25, fb.humidity, fb.windSpeed, fb.sky));
      }
    };
    fetchWeather();
  }, []);

  // Simulate active runners count fluctuating
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveRunners((prev) => prev + (Math.random() > 0.5 ? 1 : -1));
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const w = weather ?? FALLBACK_WEATHER;
  const comment = getWeatherComment(runningScore, w.temp, w.sky);

  return (
    <div className="flex flex-col gap-16 px-4 py-8 md:px-8 mx-auto max-w-7xl w-full">

      {/* YouTube Shorts Embed & Weather Suitability Row */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: YouTube Shorts Promo Video Embed (5 columns) */}
        <div className="lg:col-span-5 flex flex-col gap-6 w-full animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight text-white">송도 러닝 동기부여 쇼츠</h2>
              <a
                href="https://www.youtube.com/results?search_query=%23%EC%86%A1%EB%8F%84%EB%9F%AC%EB%8B%9D"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                #송도러닝 더 보기 →
              </a>
            </div>
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

            {/* Smart phone screen contents (No iframe error) */}
            <div className="w-full h-full relative z-10 bg-zinc-950 flex flex-col justify-between pt-24 pb-8 px-4 overflow-hidden rounded-[2.7rem]">
              {/* Background image (Shorts intro) with overlay */}
              <div 
                className="absolute inset-0 z-0 bg-cover bg-center opacity-40"
                style={{ backgroundImage: `url('/songdo_shorts_intro.png')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />

              {/* Title inside phone */}
              <div className="relative z-20 flex flex-col items-center text-center mt-2">
                <span className="text-[9px] font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-red-650/40 border border-red-500/20 text-red-400 mb-1">
                  YOUTUBE SHORTS
                </span>
                <h4 className="text-xs font-black text-white drop-shadow-md">#송도러닝 추천코스</h4>
              </div>

              {/* Center Play Button */}
              <div className="relative z-20 flex flex-col items-center justify-center my-auto">
                <a
                  href="https://youtube.com/shorts/fnQMnkYdhG8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-red-600 hover:bg-red-500 text-white shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
                >
                  <span className="absolute inset-0 rounded-full bg-red-600/30 animate-ping group-hover:animate-none" />
                  <svg className="w-5 h-5 fill-current translate-x-0.5" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </a>
                <span className="text-[10px] text-zinc-350 font-medium mt-3 bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm relative z-20">
                  클릭 시 쇼츠로 이동
                </span>
              </div>

              {/* Red Link Button (inside phone screen) */}
              <div className="relative z-20 w-full px-1 mt-auto">
                <a
                  href="https://www.youtube.com/results?search_query=%23%EC%86%A1%EB%8F%84%EB%9F%AC%EB%8B%9D"
                  target="_blank"
                  rel="noopener noreferrer"
                  id="youtube-songdo-link-inner"
                  className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-[11px] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  YouTube에서 Shorts 보기
                </a>
              </div>
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
              
              {!weather && (
                <div className="flex items-center gap-2 text-zinc-500 text-sm mb-4">
                  <span className="animate-spin h-4 w-4 border-2 border-brand border-t-transparent rounded-full inline-block" />
                  날씨 데이터 로드 중...
                </div>
              )}

              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand/10 border border-brand/20 text-brand">Running Index</span>
                  <h3 className="text-2xl font-extrabold text-white mt-3">
                    오늘 러닝 적합도 <span className="text-brand text-glow">{runningScore}점</span>
                  </h3>
                </div>
                <span className="text-3xl">🏃‍♂️💨</span>
              </div>

              <p className="text-zinc-300 text-sm leading-relaxed my-5 font-medium">
                &quot;{comment}&quot;
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-zinc-900 pt-5 text-center">
                <div>
                  <div className="text-zinc-500 text-[10px]">기온</div>
                  <div className="text-base font-bold text-white mt-0.5">{w.temp}°C</div>
                </div>
                <div>
                  <div className="text-zinc-500 text-[10px]">미세먼지</div>
                  <div className="text-base font-bold text-brand mt-0.5">{w.pm25} ㎍/㎡ (좋음)</div>
                </div>
                <div>
                  <div className="text-zinc-500 text-[10px]">습도</div>
                  <div className="text-base font-bold text-white mt-0.5">{w.humidity}%</div>
                </div>
                <div>
                  <div className="text-zinc-500 text-[10px]">해안 풍속</div>
                  <div className="text-base font-bold text-white mt-0.5">{w.windSpeed} m/s</div>
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

      {/* Signature Courses Brief Section */}
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
                <span className="text-zinc-400 text-xs font-semibold">5.0km</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 leading-snug">센트럴파크 순환 코스</h3>
              <p className="text-zinc-500 text-xs line-clamp-2">송도의 랜드마크 센트럴파크 호수를 한 바퀴 도는 인기 코스. 트라이볼, NC큐브 등 주요 명소를 지나갑니다.</p>
            </div>
            <Link href="/courses?selected=2" className="text-xs text-brand mt-4 font-semibold hover:text-white">지도보기 &rarr;</Link>
          </div>

          <div className="glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col justify-between min-h-[160px]">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded border text-amber-400 bg-amber-500/10 border-amber-500/20">중급</span>
                <span className="text-zinc-400 text-xs font-semibold">8.5km</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 leading-snug">INU 인천대 캠퍼스 코스</h3>
              <p className="text-zinc-500 text-xs line-clamp-2">인천대 캠퍼스를 순회하며 송도 신도시까지 이어지는 훈련용 코스. 언덕 구간이 있어 체력 향상에 좋습니다.</p>
            </div>
            <Link href="/courses?selected=4" className="text-xs text-brand mt-4 font-semibold hover:text-white">지도보기 &rarr;</Link>
          </div>

          <div className="glass-panel glass-panel-hover rounded-2xl p-6 flex flex-col justify-between min-h-[160px]">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded border text-amber-400 bg-amber-500/10 border-amber-500/20">중급</span>
                <span className="text-zinc-400 text-xs font-semibold">10.2km</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 leading-snug">잭니클라우스 골프장 외곽 코스</h3>
              <p className="text-zinc-500 text-xs line-clamp-2">잭니클라우스 골프장 외곽을 따라 송도 전역을 순회하는 장거리 코스. 하프 마라톤 대비 훈련에 적합합니다.</p>
            </div>
            <Link href="/courses?selected=5" className="text-xs text-brand mt-4 font-semibold hover:text-white">지도보기 &rarr;</Link>
          </div>
        </div>
      </section>

    </div>
  );
}
