"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

// Full data for 5 signature courses in Songdo
const COURSES_DATABASE = [
  {
    id: "central-park",
    name: "송도 센트럴파크 해수로 코스",
    distance: "4.2km",
    distanceVal: 4.2,
    difficulty: "초급",
    diffColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    time: "25분",
    scenery: "야경",
    startPoint: "센트럴파크역 4번 출구",
    routeDescription: "센트럴파크역 -> 트라이보울 -> 경원재 한옥마을 -> G타워 앞 해수로 -> 센트럴파크역 순환",
    calories: "약 280 kcal",
    elevGain: "5m (완전 평지)",
    safetyTip: "저녁 시간에는 유동 인구가 많으므로 해수로 안쪽 보행자/러너 전용 차선을 준수해 주세요.",
    highlights: ["한옥마을 조명", "트라이보울 야경", "해수로 보트 및 야경 전망"],
    amenities: [
      { name: "화장실", desc: "센트럴파크역 내, 한옥마을 뒤편, G타워 1층" },
      { name: "편의점", desc: "센트럴파크 편의점 2곳 (해수로 라인)" },
      { name: "주차장", desc: "센트럴파크 공영주차장 (유료)" },
    ],
    // SVG path coordinate for drawing
    svgPath: "M 40,80 C 120,60 220,60 300,80 C 320,110 320,190 300,220 C 220,240 120,240 40,220 C 20,190 20,110 40,80 Z",
    pois: [
      { name: "출발지: 센트럴파크역", lat: 37.3951, lng: 126.6384, x: 40, y: 80 },
      { name: "트라이보울", lat: 37.3934, lng: 126.6416, x: 180, y: 70 },
      { name: "한옥마을", lat: 37.3905, lng: 126.6433, x: 300, y: 150 },
      { name: "G타워 포토존", lat: 37.3909, lng: 126.6354, x: 100, y: 230 },
    ],
    gpsPath: [
      { lat: 37.3951, lng: 126.6384 },
      { lat: 37.3934, lng: 126.6416 },
      { lat: 37.3905, lng: 126.6433 },
      { lat: 37.3888, lng: 126.6401 },
      { lat: 37.3909, lng: 126.6354 },
      { lat: 37.3951, lng: 126.6384 },
    ],
  },
  {
    id: "inu-loop",
    name: "인천대 외곽 해안선 코스",
    distance: "6.8km",
    distanceVal: 6.8,
    difficulty: "중급",
    diffColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    time: "40분",
    scenery: "일몰",
    startPoint: "인천대입구역 2번 출구",
    routeDescription: "인천대입구역 -> 인천대학교 정문 -> 해안가 솔찬공원 케이슨24 -> 인천대 캠퍼스 외곽 순환 -> 복귀",
    calories: "약 460 kcal",
    elevGain: "18m (약간의 경사 존재)",
    safetyTip: "해안가 도로 구간은 바닷바람이 강할 수 있어, 일교차가 큰 계절에는 윈드브레이커를 지참하세요.",
    highlights: ["서해낙조와 인천대교 뷰", "솔찬공원 바닷길 정취", "인천대 송도캠프 청춘 에너지"],
    amenities: [
      { name: "화장실", desc: "솔찬공원 케이슨24 화장실, 인천대학교 본관 1층" },
      { name: "편의점", desc: "이마트24 솔찬공원점, 인천대 복지관 내 이마트24" },
      { name: "주차장", desc: "솔찬공원 무료 공영주차장" },
    ],
    svgPath: "M 50,50 L 250,50 C 270,100 290,180 270,220 L 200,220 C 180,240 100,250 70,210 L 50,150 Z",
    pois: [
      { name: "인천대입구역", lat: 37.3798, lng: 126.6346, x: 50, y: 50 },
      { name: "인천대 정문", lat: 37.3738, lng: 126.6320, x: 250, y: 50 },
      { name: "솔찬공원 케이슨24", lat: 37.3712, lng: 126.6212, x: 270, y: 220 },
      { name: "해안로 언덕", lat: 37.3688, lng: 126.6241, x: 70, y: 210 },
    ],
    gpsPath: [
      { lat: 37.3798, lng: 126.6346 },
      { lat: 37.3738, lng: 126.6320 },
      { lat: 37.3701, lng: 126.6293 },
      { lat: 37.3688, lng: 126.6241 },
      { lat: 37.3712, lng: 126.6212 },
      { lat: 37.3768, lng: 126.6272 },
      { lat: 37.3798, lng: 126.6346 },
    ],
  },
  {
    id: "jack-nicklaus",
    name: "잭니클라우스 CC 외곽 순환",
    distance: "10.5km",
    distanceVal: 10.5,
    difficulty: "상급",
    diffColor: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    time: "60분",
    scenery: "오션뷰",
    startPoint: "송도랜드마크시티 수변공원",
    routeDescription: "수변공원 주차장 -> 잭니클라우스 CC 외곽 담장길 -> 랜드마크시티 1호 수변공원 순환 복귀",
    calories: "약 720 kcal",
    elevGain: "8m (대부분 평탄한 평지)",
    safetyTip: "중간에 매점이나 화장실이 전혀 없는 10km 논스톱 코스이므로 수분 공급용 물병 지참이 필수입니다.",
    highlights: ["신호대기 없는 직선 코스", "잭니클라우스 잔디 경관", "인천대교와 서해 바다 절경"],
    amenities: [
      { name: "화장실", desc: "랜드마크시티 수변공원 공영화장실" },
      { name: "편의점", desc: "코스 중 없음 (수변공원 근처 편의점 이용)" },
      { name: "주차장", desc: "송도랜드마크시티 수변공원 주차장 (무료)" },
    ],
    svgPath: "M 60,60 L 280,60 L 310,180 L 270,250 L 90,250 L 50,180 Z",
    pois: [
      { name: "수변공원 주차장", lat: 37.3888, lng: 126.6186, x: 60, y: 60 },
      { name: "인천대교 전망대", lat: 37.3879, lng: 126.6094, x: 280, y: 60 },
      { name: "해안가 펜스도로", lat: 37.3831, lng: 126.6012, x: 310, y: 180 },
      { name: "남단 회차지점", lat: 37.3725, lng: 126.6115, x: 90, y: 250 },
    ],
    gpsPath: [
      { lat: 37.3888, lng: 126.6186 },
      { lat: 37.3879, lng: 126.6094 },
      { lat: 37.3831, lng: 126.6012 },
      { lat: 37.3739, lng: 126.6033 },
      { lat: 37.3725, lng: 126.6115 },
      { lat: 37.3775, lng: 126.6190 },
      { lat: 37.3888, lng: 126.6186 },
    ],
  },
  {
    id: "haedoji-loop",
    name: "해돋이 & 해누리공원 힐링 코스",
    distance: "3.5km",
    distanceVal: 3.5,
    difficulty: "초급",
    diffColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    time: "20분",
    scenery: "공원",
    startPoint: "캠퍼스타운역 3번 출구",
    routeDescription: "캠퍼스타운역 -> 해돋이공원 산책로 순환 -> 육교 통과 -> 해누리공원 외곽 트랙 -> 캠퍼스타운역 복귀",
    calories: "약 240 kcal",
    elevGain: "12m (약간의 완만한 육교 경사)",
    safetyTip: "낮 시간에는 유모차 및 가족 단위 보행자가 많으므로, 이른 아침이나 늦은 저녁 러닝을 추천합니다.",
    highlights: ["계절별 장미 정원 풍경", "나무 그늘이 가득한 숲길 느낌", "완만하게 다듬어진 우레탄 바닥"],
    amenities: [
      { name: "화장실", desc: "해돋이공원 공영화장실 (2곳)" },
      { name: "편의점", desc: "캠퍼스타운역 상가 내 다수 편의점" },
      { name: "음수대", desc: "해돋이공원 분수광장 옆 음수대" },
    ],
    svgPath: "M 80,60 C 150,40 220,70 250,100 C 270,140 240,190 200,220 C 130,230 90,200 70,160 C 50,120 60,80 80,60 Z",
    pois: [
      { name: "캠퍼스타운역", lat: 37.3892, lng: 126.6625, x: 80, y: 60 },
      { name: "해돋이 장미원", lat: 37.3934, lng: 126.6568, x: 250, y: 100 },
      { name: "해누리 연결 다리", lat: 37.3920, lng: 126.6508, x: 200, y: 220 },
      { name: "음수대쉼터", lat: 37.3885, lng: 126.6524, x: 70, y: 160 },
    ],
    gpsPath: [
      { lat: 37.3892, lng: 126.6625 },
      { lat: 37.3908, lng: 126.6582 },
      { lat: 37.3934, lng: 126.6568 },
      { lat: 37.3951, lng: 126.6521 },
      { lat: 37.3920, lng: 126.6508 },
      { lat: 37.3885, lng: 126.6524 },
      { lat: 37.3892, lng: 126.6625 },
    ],
  },
  {
    id: "moonlight-park",
    name: "송도 달빛축제공원 코스",
    distance: "4.8km",
    distanceVal: 4.8,
    difficulty: "중급",
    diffColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    time: "30분",
    scenery: "공원",
    startPoint: "송도달빛축제공원역 4번 출구",
    routeDescription: "송도달빛축제공원역 -> 달빛축제공원 대운동장 순환 -> 아암도 수변공원 도로 -> 공원 정문 복귀",
    calories: "약 330 kcal",
    elevGain: "7m (대부분 평지)",
    safetyTip: "대형 축제 기간이나 주말에는 행사 부스 설치로 러닝 구간에 펜스가 쳐질 수 있으니 사전 일정을 확인하세요.",
    highlights: ["드넓은 잔디 마당 풍경", "달빛축제 야외 무대 전경", "아암도 바다 산책길 뷰"],
    amenities: [
      { name: "화장실", desc: "달빛축제공원 중앙 대형 화장실, 관리사무소 건물" },
      { name: "편의점", desc: "달빛축제공원역 앞 편의점 이용" },
      { name: "주차장", desc: "공원 전용 주차장 (무료)" },
    ],
    svgPath: "M 80,70 L 220,90 C 250,130 280,180 220,200 L 120,230 C 90,210 70,140 80,70 Z",
    pois: [
      { name: "달빛축제공원역", lat: 37.4055, lng: 126.6366, x: 80, y: 70 },
      { name: "축제 대공연장", lat: 37.4082, lng: 126.6372, x: 220, y: 90 },
      { name: "반려견 놀이터", lat: 37.4111, lng: 126.6318, x: 280, y: 180 },
      { name: "아암도 수변로", lat: 37.4045, lng: 126.6279, x: 120, y: 230 },
    ],
    gpsPath: [
      { lat: 37.4055, lng: 126.6366 },
      { lat: 37.4082, lng: 126.6372 },
      { lat: 37.4111, lng: 126.6318 },
      { lat: 37.4088, lng: 126.6268 },
      { lat: 37.4045, lng: 126.6279 },
      { lat: 37.4038, lng: 126.6338 },
      { lat: 37.4055, lng: 126.6366 },
    ],
  },
];

function CoursesContent() {
  const searchParams = useSearchParams();
  const initialSelected = searchParams.get("selected") || "central-park";

  // Filter States
  const [distanceFilter, setDistanceFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [sceneryFilter, setSceneryFilter] = useState("all");

  // Selected Course State
  const [selectedCourseId, setSelectedCourseId] = useState(initialSelected);

  // Map state
  const [kakaoApiKey, setKakaoApiKey] = useState("");
  const [inputKey, setInputKey] = useState("");
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  // Load Kakao API key from localStorage if exists
  useEffect(() => {
    const savedKey = localStorage.getItem("songdo_run_kakao_key");
    const envKey = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY || "";
    
    if (savedKey) {
      setKakaoApiKey(savedKey);
      setInputKey(savedKey);
    } else if (envKey) {
      setKakaoApiKey(envKey);
      setInputKey(envKey);
    }
  }, []);

  // Filter logic
  const filteredCourses = COURSES_DATABASE.filter((course) => {
    if (distanceFilter === "short" && course.distanceVal >= 5) return false;
    if (distanceFilter === "medium" && (course.distanceVal < 5 || course.distanceVal >= 10)) return false;
    if (distanceFilter === "long" && course.distanceVal < 10) return false;

    if (difficultyFilter !== "all" && course.difficulty !== difficultyFilter) return false;

    if (sceneryFilter !== "all" && course.scenery !== sceneryFilter) {
      if (sceneryFilter === "공원" && course.scenery === "공원") {
        // Keep park
      } else {
        return false;
      }
    }

    return true;
  });

  const selectedCourse = COURSES_DATABASE.find((c) => c.id === selectedCourseId) || filteredCourses[0] || COURSES_DATABASE[0];

  useEffect(() => {
    if (filteredCourses.length > 0 && !filteredCourses.some((c) => c.id === selectedCourseId)) {
      setSelectedCourseId(filteredCourses[0].id);
    }
  }, [distanceFilter, difficultyFilter, sceneryFilter, filteredCourses, selectedCourseId]);

  // Load and Render Kakao Map
  useEffect(() => {
    if (!kakaoApiKey) {
      setMapLoaded(false);
      return;
    }

    // Remove any previous script before loading a new one
    const existingScript = document.getElementById("kakao-map-script");
    if (existingScript) {
      existingScript.remove();
    }

    // Reset Map Div Content
    const mapContainer = document.getElementById("kakao-map-container");
    if (mapContainer) {
      mapContainer.innerHTML = "";
    }

    const script = document.createElement("script");
    script.id = "kakao-map-script";
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoApiKey}&autoload=false`;
    script.async = true;

    script.onload = () => {
      const kakao = (window as any).kakao;
      if (!kakao || !kakao.maps) {
        setMapError(true);
        return;
      }

      kakao.maps.load(() => {
        const container = document.getElementById("kakao-map-container");
        if (!container) return;

        const pathPoints = selectedCourse.gpsPath;
        const centerPoint = pathPoints[0] || { lat: 37.3916, lng: 126.6358 };
        
        const options = {
          center: new kakao.maps.LatLng(centerPoint.lat, centerPoint.lng),
          level: 5,
        };

        const map = new kakao.maps.Map(container, options);

        // Path Polylines
        const linePath = pathPoints.map(
          (pt) => new kakao.maps.LatLng(pt.lat, pt.lng)
        );

        const polyline = new kakao.maps.Polyline({
          path: linePath,
          strokeWeight: 6,
          strokeColor: "#c5ff3b", // Brand color
          strokeOpacity: 0.95,
          strokeStyle: "solid",
        });
        polyline.setMap(map);

        // Add POIs
        selectedCourse.pois.forEach((poi) => {
          const markerPosition = new kakao.maps.LatLng(poi.lat, poi.lng);
          const marker = new kakao.maps.Marker({
            position: markerPosition,
            map: map,
          });

          // Infowindow
          const infowindow = new kakao.maps.InfoWindow({
            content: `
              <div style="padding:6px; min-width:120px; text-align:center; font-family:sans-serif; background:#0d1117; color:#fff; border:1px solid rgba(255,255,255,0.1); border-radius:6px; font-size:11px; font-weight:bold;">
                ${poi.name}
              </div>
            `,
          });

          kakao.maps.event.addListener(marker, "mouseover", () => {
            infowindow.open(map, marker);
          });

          kakao.maps.event.addListener(marker, "mouseout", () => {
            infowindow.close();
          });
        });

        // Set Bounds
        const bounds = new kakao.maps.LatLngBounds();
        linePath.forEach((pt) => bounds.extend(pt));
        map.setBounds(bounds);

        setMapLoaded(true);
        setMapError(false);
      });
    };

    script.onerror = () => {
      setMapError(true);
      setMapLoaded(false);
    };

    document.head.appendChild(script);
  }, [kakaoApiKey, selectedCourseId]);

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("songdo_run_kakao_key", inputKey);
    setKakaoApiKey(inputKey);
    alert("카카오 지도 API 키가 저장되었습니다. 지도를 로드합니다.");
  };

  const handleRemoveKey = () => {
    localStorage.removeItem("songdo_run_kakao_key");
    setKakaoApiKey("");
    setInputKey("");
    setMapLoaded(false);
    alert("저장된 API 키가 삭제되었습니다. 시뮬레이션 지도로 전환합니다.");
  };

  return (
    <div className="flex flex-col gap-8 px-4 py-8 md:px-8 mx-auto max-w-7xl w-full">
      {/* Page Header */}
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">송도 러닝 코스 지도 가이드</h1>
        <p className="text-zinc-500 text-sm mt-2">
          송도국제도시의 지리적 강점을 극대화한 5대 시그니처 코스입니다. 실시간 카카오 지도 또는 고해상도 코스 시뮬레이터로 탐색해보세요.
        </p>
      </div>

      {/* Filter Section */}
      <div className="glass-panel rounded-2xl p-6 flex flex-col gap-6 animate-fade-in-up" style={{ animationDelay: "50ms" }}>
        <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">상세 코스 필터</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Distance Filter */}
          <div className="flex flex-col gap-2">
            <label htmlFor="distance-select" className="text-xs font-semibold text-zinc-400">목표 거리</label>
            <select
              id="distance-select"
              value={distanceFilter}
              onChange={(e) => setDistanceFilter(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand transition-colors"
            >
              <option value="all">모든 거리</option>
              <option value="short">초단거리 (~ 5km 미만)</option>
              <option value="medium">중거리 (5km ~ 10km 미만)</option>
              <option value="long">장거리 (10km 이상)</option>
            </select>
          </div>

          {/* Difficulty Filter */}
          <div className="flex flex-col gap-2">
            <label htmlFor="difficulty-select" className="text-xs font-semibold text-zinc-400">난이도</label>
            <select
              id="difficulty-select"
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand transition-colors"
            >
              <option value="all">모든 난이도</option>
              <option value="초급">초급 (편안한 조깅)</option>
              <option value="중급">중급 (템포 러닝)</option>
              <option value="상급">상급 (체력 단련)</option>
            </select>
          </div>

          {/* Scenery/Theme Filter */}
          <div className="flex flex-col gap-2">
            <label htmlFor="scenery-select" className="text-xs font-semibold text-zinc-400">테마 및 풍경</label>
            <select
              id="scenery-select"
              value={sceneryFilter}
              onChange={(e) => setSceneryFilter(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand transition-colors"
            >
              <option value="all">모든 테마</option>
              <option value="야경">야경 맛집</option>
              <option value="일몰">서해 일몰 오션뷰</option>
              <option value="오션뷰">드넓은 바닷바람</option>
              <option value="공원">도심 속 공원 피톤치드</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Course Cards List (5 columns) */}
        <div className="lg:col-span-5 flex flex-col gap-4 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            검색 결과 <span className="text-brand text-glow text-sm font-semibold">{filteredCourses.length}개 발견</span>
          </h2>

          {filteredCourses.length === 0 ? (
            <div className="glass-panel rounded-2xl p-8 text-center text-zinc-500 text-sm">
              선택한 조건에 맞는 러닝 코스가 없습니다.<br />필터를 변경해 보세요.
            </div>
          ) : (
            filteredCourses.map((course) => {
              const isSelected = selectedCourse.id === course.id;
              return (
                <button
                  key={course.id}
                  id={`course-select-card-${course.id}`}
                  onClick={() => setSelectedCourseId(course.id)}
                  className={`w-full text-left glass-panel rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 ${
                    isSelected
                      ? "border-brand bg-brand/5 scale-[1.01] shadow-lg shadow-brand/5"
                      : "border-zinc-900 hover:border-zinc-800 cursor-pointer"
                  }`}
                >
                  <div className="flex justify-between items-center w-full mb-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${course.diffColor}`}>
                      {course.difficulty}
                    </span>
                    <span className="text-xs text-zinc-400 font-semibold">{course.distance}</span>
                  </div>

                  <h3 className={`text-base font-bold transition-colors ${isSelected ? "text-brand" : "text-white"}`}>
                    {course.name}
                  </h3>

                  <p className="text-xs text-zinc-500 mt-2 line-clamp-2">
                    {course.routeDescription}
                  </p>

                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-zinc-900/60 text-[11px] text-zinc-400 w-full">
                    <span>예상 소요: <strong className="text-white">{course.time}</strong></span>
                    <span>테마: <strong className="text-brand">{course.scenery}</strong></span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Right Side: Map & Insights panel (7 columns) */}
        {selectedCourse && (
          <div className="lg:col-span-7 flex flex-col gap-6 animate-fade-in-up" style={{ animationDelay: "150ms" }}>
            {/* Map Area */}
            <div className="glass-panel rounded-3xl p-6 border-brand/10">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                  {mapLoaded ? "Kakao Real Map (실시간 연동)" : "Simulated Map (대화형 시뮬레이션)"}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-brand font-semibold">
                  <span className="w-2 h-2 rounded-full bg-brand animate-ping"></span>
                  코스 시각화 가이드
                </span>
              </div>

              {/* Map Container */}
              <div className="relative w-full aspect-[4/3] bg-zinc-950/80 rounded-2xl border border-zinc-900 overflow-hidden">
                {/* Kakao Map Div */}
                <div
                  id="kakao-map-container"
                  className={`w-full h-full transition-opacity duration-500 ${mapLoaded ? "opacity-100" : "opacity-0 absolute pointer-events-none"}`}
                ></div>

                {/* Fallback/Simulated SVG Map (visible when Kakao Map is not loaded) */}
                {!mapLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    <svg className="w-full h-full max-w-[450px]" viewBox="0 0 350 300">
                      {/* Grid backdrop */}
                      <defs>
                        <pattern id="grid-map" width="20" height="20" patternUnits="userSpaceOnUse">
                          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid-map)" />

                      {/* Sea styling if coastal */}
                      {(selectedCourse.scenery === "오션뷰" || selectedCourse.scenery === "일몰") && (
                        <path d="M 0,220 C 100,200 200,260 350,220 L 350,300 L 0,300 Z" fill="rgba(197, 255, 59, 0.02)" stroke="rgba(197, 255, 59, 0.05)" strokeWidth="2" />
                      )}

                      {/* Course Polyline glow */}
                      <path
                        d={selectedCourse.svgPath}
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.1)"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d={selectedCourse.svgPath}
                        fill="none"
                        stroke="var(--brand)"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="animate-dash text-glow"
                      />

                      {/* POI Markers */}
                      {selectedCourse.pois.map((poi, idx) => (
                        <g key={idx} className="cursor-help group/poi">
                          <circle
                            cx={poi.x}
                            cy={poi.y}
                            r="6"
                            fill="#06080c"
                            stroke="var(--brand)"
                            strokeWidth="2.5"
                          />
                          <circle
                            cx={poi.x}
                            cy={poi.y}
                            r="12"
                            fill="rgba(197, 255, 59, 0.25)"
                            className="animate-ping"
                            style={{ animationDuration: `${2.5 + idx}s` }}
                          />
                          <g className="opacity-0 group-hover/poi:opacity-100 transition-opacity duration-200">
                            <rect
                              x={poi.x - 60}
                              y={poi.y - 32}
                              width="120"
                              height="22"
                              rx="4"
                              fill="rgba(13, 17, 23, 0.95)"
                              stroke="rgba(255, 255, 255, 0.15)"
                              strokeWidth="1"
                            />
                            <text
                              x={poi.x}
                              y={poi.y - 17}
                              fill="white"
                              fontSize="9"
                              textAnchor="middle"
                              fontWeight="bold"
                            >
                              {poi.name}
                            </text>
                          </g>
                        </g>
                      ))}
                    </svg>

                    {/* SVG Legend */}
                    <div className="absolute bottom-4 left-4 bg-zinc-900/90 border border-zinc-800 rounded-lg p-2.5 flex flex-col gap-1 text-[9px] text-zinc-500 select-none">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-0.5 bg-brand inline-block"></span>
                        <span>방향 안내 루트</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full border border-brand bg-[#06080c] inline-block"></span>
                        <span>주요 포인트 (마커 마우스 오버 가능)</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Map API Key Settings widget */}
              <div className="mt-4 border-t border-zinc-900 pt-4">
                {kakaoApiKey ? (
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-brand/5 border border-brand/10 rounded-xl p-3.5">
                    <div className="text-xs text-zinc-300 leading-snug">
                      ✅ **실시간 카카오 지도 연동 활성화 완료** <span className="text-[10px] text-zinc-500">(Key: {kakaoApiKey.substring(0, 8)}...)</span>
                    </div>
                    <button
                      onClick={handleRemoveKey}
                      className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/20 text-red-400 text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      연동 해제
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSaveKey} className="flex flex-col sm:flex-row items-center gap-3 bg-zinc-900/40 border border-zinc-850 rounded-xl p-3.5">
                    <div className="flex-1 flex flex-col gap-1 w-full">
                      <label htmlFor="kakao-key-input" className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Kakao Maps Javascript SDK 연동</label>
                      <input
                        id="kakao-key-input"
                        type="text"
                        placeholder="Kakao Map API JavaScript Key 입력..."
                        value={inputKey}
                        onChange={(e) => setInputKey(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-brand"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-4 py-2 bg-zinc-900 border border-zinc-800 hover:bg-brand hover:text-black rounded-lg text-xs font-bold text-zinc-300 transition-all cursor-pointer whitespace-nowrap self-end"
                    >
                      지도 연동하기
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Course detailed statistics */}
            <div className="glass-panel rounded-3xl p-6 flex flex-col gap-6">
              <div>
                <h2 className="text-xl font-bold text-white">{selectedCourse.name}</h2>
                <p className="text-xs text-zinc-400 mt-1.5">{selectedCourse.routeDescription}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-black/30 border border-zinc-900/50 rounded-xl p-3">
                  <div className="text-[10px] text-zinc-500">출발 포인트</div>
                  <div className="text-xs font-bold text-white mt-1 line-clamp-1">{selectedCourse.startPoint}</div>
                </div>
                <div className="bg-black/30 border border-zinc-900/50 rounded-xl p-3">
                  <div className="text-[10px] text-zinc-500">소모 칼로리</div>
                  <div className="text-xs font-bold text-brand mt-1">{selectedCourse.calories}</div>
                </div>
                <div className="bg-black/30 border border-zinc-900/50 rounded-xl p-3">
                  <div className="text-[10px] text-zinc-500">경사도 획득</div>
                  <div className="text-xs font-bold text-white mt-1">{selectedCourse.elevGain}</div>
                </div>
                <div className="bg-black/30 border border-zinc-900/50 rounded-xl p-3">
                  <div className="text-[10px] text-zinc-500">코스 테마</div>
                  <div className="text-xs font-bold text-white mt-1">{selectedCourse.scenery} 뷰</div>
                </div>
              </div>

              {/* Safety Tips */}
              <div className="bg-brand-muted/10 border border-brand/10 rounded-2xl p-4 flex gap-3">
                <span className="text-xl">💡</span>
                <div>
                  <h4 className="text-xs font-bold text-brand uppercase tracking-wider">현지 러너 안전 가이드</h4>
                  <p className="text-xs text-zinc-300 mt-1 leading-relaxed">{selectedCourse.safetyTip}</p>
                </div>
              </div>

              {/* Key Attractions */}
              <div className="flex flex-col gap-3">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">주요 코스 경유 포인트</h4>
                <ul className="flex flex-col gap-2">
                  {selectedCourse.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-center gap-2 text-xs text-zinc-300">
                      <span className="text-brand">✔</span>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Amenities Grid */}
              <div className="border-t border-zinc-900/80 pt-6">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">코스 편의시설 정보</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {selectedCourse.amenities.map((amenity, index) => (
                    <div key={index} className="flex flex-col gap-1">
                      <span className="text-[11px] text-brand font-semibold">{amenity.name}</span>
                      <span className="text-[10px] text-zinc-400 leading-snug">{amenity.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Redirection Button */}
              <Link
                id="course-weather-redirect-btn"
                href="/weather"
                className="w-full flex items-center justify-center py-3.5 rounded-2xl bg-brand text-black font-bold text-sm hover:bg-white transition-all hover:scale-[1.01] active:scale-[0.99] box-glow text-center cursor-pointer"
              >
                오늘의 날씨로 이 코스 달리기 적합도 확인하기
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CoursesPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center py-32 px-16 text-zinc-400">
        <span className="animate-spin h-8 w-8 border-4 border-brand border-t-transparent rounded-full mb-4"></span>
        코스 가이드를 준비하는 중입니다...
      </div>
    }>
      <CoursesContent />
    </Suspense>
  );
}
