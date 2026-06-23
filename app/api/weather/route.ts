import { NextResponse } from 'next/server';

// ─── Weather condition mapping ─────────────────────────────────
function mapOpenMeteoCodeToType(code: number): string {
  if (code === 0) return "CLEAR";
  if ([1, 2, 3, 45, 48].includes(code)) return "CLOUDY";
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82, 95, 96, 99].includes(code)) return "RAIN";
  if ([71, 73, 75, 85, 86].includes(code)) return "SNOW";
  return "CLEAR";
}

function mapOpenMeteoCodeToDesc(code: number): string {
  if (code === 0) return "맑음";
  if ([1, 2, 3].includes(code)) return "구름많음";
  if ([45, 48].includes(code)) return "안개";
  if ([51, 53, 55].includes(code)) return "이슬비";
  if ([61, 63, 65].includes(code)) return "비";
  if ([71, 73, 75].includes(code)) return "눈";
  if ([80, 81, 82].includes(code)) return "소나기";
  if ([85, 86].includes(code)) return "소낙눈";
  if ([95, 96, 99].includes(code)) return "뇌우";
  return "맑음";
}

// ─── AirKorea PM2.5 fetch ──────────────────────────────────────
// 송도동이 속한 측정소: 연수구 (인천 연수구 관내 측정망)
// 에어코리아 측정소명: "인천연수" (stationName)
async function fetchAirKoreaPM25(): Promise<{ pm25: number; pm10: number; grade: string } | null> {
  const serviceKey = process.env.AIRKOREA_API_KEY;
  if (!serviceKey) return null;

  try {
    // getMsrstnAcctoRltmMesureDnsty: 측정소별 실시간 측정정보 조회
    const url = new URL('https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty');
    url.searchParams.set('serviceKey', serviceKey);
    url.searchParams.set('returnType', 'json');
    url.searchParams.set('numOfRows', '1');
    url.searchParams.set('pageNo', '1');
    url.searchParams.set('stationName', '인천연수');   // 송도동 인근 측정소
    url.searchParams.set('dataTerm', 'DAILY');
    url.searchParams.set('ver', '1.0');

    const resp = await fetch(url.toString(), { next: { revalidate: 300 } }); // 5분 캐시
    if (!resp.ok) {
      console.warn(`AirKorea API returned status ${resp.status}`);
      return null;
    }

    const data = await resp.json();
    const items = data?.response?.body?.items;
    if (!items || items.length === 0) return null;

    const latest = items[0];
    const pm25Raw = parseFloat(latest.pm25Value);
    const pm10Raw = parseFloat(latest.pm10Value);

    if (isNaN(pm25Raw)) return null;

    // PM2.5 등급 계산 (환경부 기준)
    let grade = '좋음';
    if (pm25Raw > 75) grade = '매우나쁨';
    else if (pm25Raw > 35) grade = '나쁨';
    else if (pm25Raw > 15) grade = '보통';

    return {
      pm25: pm25Raw,
      pm10: isNaN(pm10Raw) ? 0 : pm10Raw,
      grade,
    };
  } catch (e) {
    console.error('AirKorea fetch error:', e);
    return null;
  }
}

// ─── Main GET handler ──────────────────────────────────────────
export async function GET() {
  const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_WEATHER_API_KEY;
  const lat = 37.3916;
  const lng = 126.6358;

  // Run weather + AirKorea dust fetch in parallel
  const [airData] = await Promise.allSettled([fetchAirKoreaPM25()]);
  const air = airData.status === 'fulfilled' ? airData.value : null;

  // Default pm25 if AirKorea fails
  const pm25 = air?.pm25 ?? 12;
  const pm10 = air?.pm10 ?? 0;
  const dustGrade = air?.grade ?? '좋음';

  // ── Try Google Weather API first ──
  if (googleApiKey && googleApiKey !== 'YOUR_API_KEY') {
    try {
      const googleUrl = `https://weather.googleapis.com/v1/currentConditions:lookup?key=${googleApiKey}&location.latitude=${lat}&location.longitude=${lng}&unitsSystem=METRIC&languageCode=ko`;
      const resp = await fetch(googleUrl);
      if (resp.ok) {
        const data = await resp.json();
        return NextResponse.json({
          temperature: { degrees: data.temperature?.degrees ?? 21 },
          relativeHumidity: data.relativeHumidity ?? 55,
          wind: { speed: { kmph: data.wind?.speed?.kmph ?? 9.0 } },
          weatherCondition: {
            type: data.weatherCondition?.type ?? "CLEAR",
            description: { text: data.weatherCondition?.description?.text ?? "맑음" }
          },
          // ── 에어코리아 실시간 대기질 데이터 ──
          airQuality: {
            pm25,
            pm10,
            grade: dustGrade,
            source: air ? 'airkorea' : 'fallback',
          }
        });
      }
      console.warn(`Google Weather API failed (${resp.status}), falling back to Open-Meteo...`);
    } catch (e) {
      console.error('Google Weather fetch error, falling back to Open-Meteo...', e);
    }
  }

  // ── Fallback to Open-Meteo ──
  try {
    const openMeteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&wind_speed_unit=ms`;
    const resp = await fetch(openMeteoUrl);
    if (!resp.ok) throw new Error(`Open-Meteo request failed: ${resp.status}`);

    const data = await resp.json();
    const current = data.current;

    return NextResponse.json({
      temperature: { degrees: current.temperature_2m },
      relativeHumidity: current.relative_humidity_2m,
      wind: { speed: { kmph: current.wind_speed_10m * 3.6 } }, // m/s → kmph
      weatherCondition: {
        type: mapOpenMeteoCodeToType(current.weather_code),
        description: { text: mapOpenMeteoCodeToDesc(current.weather_code) }
      },
      // ── 에어코리아 실시간 대기질 데이터 ──
      airQuality: {
        pm25,
        pm10,
        grade: dustGrade,
        source: air ? 'airkorea' : 'fallback',
      }
    });
  } catch (e) {
    console.error('Open-Meteo fetch error:', e);
    return NextResponse.json({ error: 'Failed to fetch weather from all providers' }, { status: 500 });
  }
}
