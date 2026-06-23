"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// Static real-time weather details for Songdo
const MOCK_LIVE_WEATHER = {
  temp: 21,
  pm25: 12,
  humidity: 55,
  windSpeed: 2.5,
  sky: "맑음", // 맑음, 구름많음, 비, 눈
  updatedAt: "방금 전 업데이트",
};

export default function WeatherPage() {
  const [liveWeather, setLiveWeather] = useState<any>(null);
  const [score, setScore] = useState(95);
  const [tips, setTips] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusColor, setStatusColor] = useState("");

  // Slider States
  const [calcTemp, setCalcTemp] = useState(21);
  const [calcDust, setCalcDust] = useState(12);
  const [calcHumidity, setCalcHumidity] = useState(55);
  const [calcWind, setCalcWind] = useState(2.5);
  const [calcSky, setCalcSky] = useState("맑음");

  // Fetch real weather + AirKorea PM2.5
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const resp = await fetch('/api/weather');
        if (!resp.ok) throw new Error('Weather fetch failed');
        const data = await resp.json();

        // Weather mapping
        const temp = data.temperature?.degrees ?? 21;
        const humidity = data.relativeHumidity ?? 55;
        const windKmph = data.wind?.speed?.kmph ?? 9.0;
        const windSpeed = parseFloat((windKmph / 3.6).toFixed(1));
        const condType = data.weatherCondition?.type ?? "CLEAR";

        let sky = "맑음";
        if (condType.includes("CLOUD") || condType.includes("OVERCAST")) {
          sky = "구름많음";
        } else if (condType.includes("RAIN") || condType.includes("DRIZZLE") || condType.includes("STORM")) {
          sky = "비";
        } else if (condType.includes("SNOW") || condType.includes("ICE")) {
          sky = "눈";
        }

        // 에어코리아 실시간 PM2.5 (없으면 기본값)
        const pm25 = data.airQuality?.pm25 ?? MOCK_LIVE_WEATHER.pm25;
        const dustGrade = data.airQuality?.grade ?? '좋음';
        const dustSource = data.airQuality?.source ?? 'fallback';

        const mapped = {
          temp,
          pm25,
          dustGrade,
          dustSource,
          humidity,
          windSpeed,
          sky,
          updatedAt: new Date().toLocaleTimeString(),
        };

        setLiveWeather(mapped);
        setCalcTemp(mapped.temp);
        setCalcDust(mapped.pm25);
        setCalcHumidity(mapped.humidity);
        setCalcWind(mapped.windSpeed);
        setCalcSky(mapped.sky);
      } catch (e) {
        console.error(e);
        // Fallback to mock on error
        setLiveWeather({ ...MOCK_LIVE_WEATHER, dustGrade: '좋음', dustSource: 'fallback' });
        setCalcTemp(MOCK_LIVE_WEATHER.temp);
        setCalcDust(MOCK_LIVE_WEATHER.pm25);
        setCalcHumidity(MOCK_LIVE_WEATHER.humidity);
        setCalcWind(MOCK_LIVE_WEATHER.windSpeed);
        setCalcSky(MOCK_LIVE_WEATHER.sky);
      }
    };
    fetchWeather();
  }, []);

  // Sync calculator with live weather
  const syncWithLive = () => {
    if (liveWeather) {
      setCalcTemp(liveWeather.temp);
      setCalcDust(liveWeather.pm25);
      setCalcHumidity(liveWeather.humidity);
      setCalcWind(liveWeather.windSpeed);
      setCalcSky(liveWeather.sky);
    }
  };

  // Recalculate score whenever slider states change
  useEffect(() => {
    // 1. Temp score (Ideal: 14°C)
    const idealTemp = 14;
    const tempDiff = Math.abs(calcTemp - idealTemp);
    const tempScore = Math.max(0, 100 - Math.pow(tempDiff, 1.4) * 2.2);

    // 2. Fine Dust PM2.5 score
    let dustScore = 100;
    if (calcDust <= 15) dustScore = 100;
    else if (calcDust <= 35) dustScore = 80;
    else if (calcDust <= 75) dustScore = 40;
    else dustScore = 10;

    // 3. Humidity score (Ideal: 50%)
    const humidityDiff = Math.abs(calcHumidity - 50);
    const humidityScore = Math.max(0, 100 - humidityDiff * 1.0);

    // 4. Wind score (Ideal: <= 2.0 m/s)
    const windScore = Math.max(0, 100 - Math.max(0, calcWind - 2) * 8.5);

    // 5. Sky condition multiplier
    let skyMultiplier = 1.0;
    if (calcSky === "구름많음") skyMultiplier = 0.95;
    else if (calcSky === "비") skyMultiplier = 0.45;
    else if (calcSky === "눈") skyMultiplier = 0.35;

    // Weighted final calculation
    const weightedBase =
      tempScore * 0.35 +
      dustScore * 0.35 +
      humidityScore * 0.15 +
      windScore * 0.15;

    const finalScore = Math.round(weightedBase * skyMultiplier);
    const clampedScore = Math.max(0, Math.min(100, finalScore));
    setScore(clampedScore);

    // Generate dynamic tips & messages based on conditions
    const newTips: string[] = [];
    
    // Score categories
    if (clampedScore >= 85) {
      setStatusMessage("🏃‍♂️ 최상의 러닝 컨디션! 오늘 당장 나가서 뛰어보세요.");
      setStatusColor("text-brand bg-brand/10 border-brand/20");
    } else if (clampedScore >= 70) {
      setStatusMessage("👍 러닝하기 준수한 날씨입니다. 조깅을 시작해 보세요.");
      setStatusColor("text-emerald-400 bg-emerald-500/10 border-emerald-500/20");
    } else if (clampedScore >= 50) {
      setStatusMessage("⚠️ 러닝하기 조금 까다로운 기상 조건입니다. 주의가 필요합니다.");
      setStatusColor("text-amber-400 bg-amber-500/10 border-amber-500/20");
    } else {
      setStatusMessage("🛑 야외 러닝에 부적합합니다. 실내 운동을 고려해 보세요.");
      setStatusColor("text-rose-450 bg-rose-500/10 border-rose-500/20");
    }

    // Warnings based on absolute metrics
    if (calcTemp < 2) {
      newTips.push("❄️ 한파 경고: 모자, 넥워머, 장갑 등 방한 대책을 필수로 마련하세요.");
    } else if (calcTemp > 28) {
      newTips.push("🔥 폭염 주의: 땀 배출이 많으므로 5km당 200ml 이상의 이온음료/물 섭취가 권장됩니다.");
    }

    if (calcDust > 35) {
      newTips.push("😷 대기질 악화: 초미세먼지가 높은 수준입니다. 마스크를 쓰거나 야외 강도 높은 러닝을 피하세요.");
    }

    if (calcWind >= 6.0) {
      newTips.push("💨 강한 해안풍: 송도 바닷바람이 거셉니다. 맞바람 구간에서는 페이스 조절에 신경 써야 합니다.");
    }

    if (calcSky === "비") {
      newTips.push("🌧️ 노면 미끄러움: 비로 인해 대리석이나 아스팔트 바닥이 매우 미끄럽습니다. 접지력 좋은 런닝화를 추천합니다.");
    } else if (calcSky === "눈") {
      newTips.push("☃️ 도로 결빙: 바닥이 매우 미끄럽고 시야가 좁아집니다. 부상 위험이 높으니 야외 훈련을 다음으로 미루는 것을 제안합니다.");
    }

    if (calcHumidity >= 80) {
      newTips.push("💦 다습 주의: 체온 조절이 어렵고 불쾌지수가 높으므로 얇은 기능성 싱글렛 의상을 착용하세요.");
    }

    if (newTips.length === 0) {
      newTips.push("✨ 현재 기상 상태에 부합하는 특별한 위험 경보가 없습니다. 편안하게 호흡하며 즐거운 러닝 하세요!");
    }

    setTips(newTips);
  }, [calcTemp, calcDust, calcHumidity, calcWind, calcSky]);

  if (!liveWeather) return (
    <div className="flex flex-col items-center justify-center py-32 text-zinc-400">
      <span className="animate-spin h-8 w-8 border-4 border-brand border-t-transparent rounded-full mb-4" />
      날씨 데이터를 불러오는 중...
    </div>
  );

  return (
    <div className="flex flex-col gap-8 px-4 py-8 md:px-8 mx-auto max-w-7xl w-full">
      {/* Page Header */}
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">실시간 날씨 &amp; 러닝 적합도</h1>
        <p className="text-zinc-500 text-sm mt-2">
          인천 송도의 실시간 기상 상태를 기반으로 분석된 달리기 가이드입니다. 원하는 기상 상태를 가상으로 입력해 적합도를 시뮬레이션해 보세요.
        </p>
      </div>

      {/* Grid: Left Live Dashboard, Right Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Live Weather dashboard (5 columns) */}
        <div className="lg:col-span-5 flex flex-col gap-6 animate-fade-in-up" style={{ animationDelay: "50ms" }}>
          <div>
            <h2 className="text-lg font-bold text-white">송도동 실시간 날씨 현황</h2>
            <p className="text-zinc-500 text-xs mt-1">자동 동기화되는 실시간 연수구 기상 계측 정보</p>
          </div>

          <div className="glass-panel rounded-3xl p-6 border-zinc-900/60 relative overflow-hidden flex flex-col justify-between min-h-[360px]">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/5 blur-3xl rounded-full"></div>
            
            {/* Header info */}
            <div className="flex justify-between items-center w-full">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Songdo Local Weather</span>
              <span className="text-[9px] text-brand bg-brand/10 border border-brand/20 px-2 py-0.5 rounded">LIVE SYNCD</span>
            </div>

            {/* Main Weather stats display */}
            <div className="my-6">
              <div className="flex items-center gap-4">
                <span className="text-5xl">☀️</span>
                <div>
                  <div className="text-4xl font-black text-white">{liveWeather.temp}°C</div>
                  <div className="text-xs text-zinc-400 mt-1">상태: <strong>{liveWeather.sky} (쾌적)</strong></div>
                </div>
              </div>
            </div>

            {/* Grid statistics list */}
            <div className="grid grid-cols-2 gap-4 border-t border-zinc-900/60 pt-6">
              <div className="bg-black/20 border border-zinc-900/40 rounded-xl p-3">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-zinc-500">초미세먼지 PM2.5</span>
                  {liveWeather.dustSource === 'airkorea' && (
                    <span className="text-[8px] bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 px-1 rounded">에어코리아</span>
                  )}
                </div>
                <div className={`text-xs font-bold mt-1 ${
                  liveWeather.pm25 > 75 ? 'text-rose-400' :
                  liveWeather.pm25 > 35 ? 'text-amber-400' :
                  liveWeather.pm25 > 15 ? 'text-yellow-400' : 'text-brand'
                }`}>
                  {liveWeather.pm25} ㎍/㎡ ({liveWeather.dustGrade ?? '좋음'})
                </div>
              </div>
              <div className="bg-black/20 border border-zinc-900/40 rounded-xl p-3">
                <div className="text-[10px] text-zinc-500">습도</div>
                <div className="text-xs font-bold text-white mt-1">{liveWeather.humidity}%</div>
              </div>
              <div className="bg-black/20 border border-zinc-900/40 rounded-xl p-3">
                <div className="text-[10px] text-zinc-500">풍속 (해안가)</div>
                <div className="text-xs font-bold text-white mt-1">{liveWeather.windSpeed} m/s</div>
              </div>
              <div className="bg-black/20 border border-zinc-900/40 rounded-xl p-3">
                <div className="text-[10px] text-zinc-500">풍향</div>
                <div className="text-xs font-bold text-white mt-1">남서풍 (WSW)</div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-6 text-[10px] text-zinc-500 border-t border-zinc-950 pt-4">
              <span>업데이트: {liveWeather.updatedAt}</span>
              <button
                onClick={syncWithLive}
                className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                계산기에 실시간 날씨 대입
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Running Suitability Calculator (7 columns) */}
        <div className="lg:col-span-7 flex flex-col gap-6 animate-fade-in-up" style={{ animationDelay: "150ms" }}>
          <div>
            <h2 className="text-lg font-bold text-white">대화형 러닝 적합도 계산기</h2>
            <p className="text-zinc-500 text-xs mt-1">슬라이더를 조작해 기상 악화 시 달리기 점수와 위험 예방 가이드를 확인하세요.</p>
          </div>

          <div className="glass-panel rounded-3xl p-6 border-brand/10 flex flex-col gap-6">
            
            {/* Score Output Card */}
            <div className={`border rounded-2xl p-5 flex flex-col items-center text-center transition-all ${statusColor}`}>
              <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Simulated Suitability Score</div>
              <div className="text-5xl font-black mt-2 text-glow">{score}점</div>
              <p className="text-xs font-semibold mt-3 leading-relaxed">{statusMessage}</p>
            </div>

            {/* Slider Parameters */}
            <div className="flex flex-col gap-5 pt-4 border-t border-zinc-900">
              
              {/* 1. Temp Slider */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs font-bold text-zinc-300">
                  <span>🌡️ 기온</span>
                  <span className="text-brand">{calcTemp}°C</span>
                </div>
                <input
                  id="slider-temp"
                  type="range"
                  min="-15"
                  max="40"
                  value={calcTemp}
                  onChange={(e) => setCalcTemp(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-brand"
                />
                <div className="flex justify-between text-[9px] text-zinc-650">
                  <span>-15°C</span>
                  <span>14°C (최적)</span>
                  <span>40°C</span>
                </div>
              </div>

              {/* 2. Dust Slider */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs font-bold text-zinc-300">
                  <span>😷 미세먼지 (PM2.5)</span>
                  <span className={calcDust > 35 ? "text-rose-450" : "text-brand"}>{calcDust} ㎍/㎡</span>
                </div>
                <input
                  id="slider-dust"
                  type="range"
                  min="0"
                  max="150"
                  value={calcDust}
                  onChange={(e) => setCalcDust(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-brand"
                />
                <div className="flex justify-between text-[9px] text-zinc-650">
                  <span>0 (좋음)</span>
                  <span>35 (보통)</span>
                  <span>75 (나쁨)</span>
                  <span>150 (매우나쁨)</span>
                </div>
              </div>

              {/* 3. Humidity Slider */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs font-bold text-zinc-300">
                  <span>💦 습도</span>
                  <span className="text-brand">{calcHumidity}%</span>
                </div>
                <input
                  id="slider-humidity"
                  type="range"
                  min="0"
                  max="100"
                  value={calcHumidity}
                  onChange={(e) => setCalcHumidity(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-brand"
                />
                <div className="flex justify-between text-[9px] text-zinc-650">
                  <span>0% (건조)</span>
                  <span>50% (쾌적)</span>
                  <span>100% (다습)</span>
                </div>
              </div>

              {/* 4. Wind Speed Slider */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs font-bold text-zinc-300">
                  <span>💨 해안 풍속</span>
                  <span className={calcWind >= 6 ? "text-amber-400" : "text-brand"}>{calcWind.toFixed(1)} m/s</span>
                </div>
                <input
                  id="slider-wind"
                  type="range"
                  min="0"
                  max="15"
                  step="0.5"
                  value={calcWind}
                  onChange={(e) => setCalcWind(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-brand"
                />
                <div className="flex justify-between text-[9px] text-zinc-650">
                  <span>0 m/s (무풍)</span>
                  <span>2 m/s (산들바람)</span>
                  <span>7 m/s (강풍경계)</span>
                  <span>15 m/s (태풍급)</span>
                </div>
              </div>

              {/* 5. Sky Dropdown */}
              <div className="flex flex-col gap-2">
                <label htmlFor="sky-select" className="text-xs font-bold text-zinc-300">🌧️ 하늘 상태</label>
                <select
                  id="sky-select"
                  value={calcSky}
                  onChange={(e) => setCalcSky(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand transition-colors"
                >
                  <option value="맑음">맑음 (100% 능률)</option>
                  <option value="구름많음">구름많음 (95% 능률)</option>
                  <option value="비">비 (노면 젖음 - 주의)</option>
                  <option value="눈">눈 (결빙/시야 악화 - 경고)</option>
                </select>
              </div>

            </div>

            {/* Suitability Tips Details */}
            <div className="mt-4 border-t border-zinc-900 pt-6">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">조건 맞춤 가이드라인</h4>
              <ul className="flex flex-col gap-3">
                {tips.map((tip, idx) => (
                  <li key={idx} className="text-xs text-zinc-300 leading-relaxed flex items-start gap-2">
                    <span className="text-brand shrink-0">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Link back to courses */}
            <Link
              id="calc-course-btn"
              href="/courses"
              className="mt-4 w-full flex items-center justify-center py-3 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-white font-semibold text-xs rounded-xl transition-all"
            >
              기상 분석에 알맞은 코스 지도로 확인하기
            </Link>

          </div>
        </div>

      </div>
    </div>
  );
}
