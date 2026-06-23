"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// 2026 Marathons Database
const MARATHONS_DATABASE = [
  {
    id: "incheon-half-2026",
    name: "제26회 인천국제하프마라톤대회",
    date: "2026-03-22",
    dayOfWeek: "일요일",
    time: "09:00 출발",
    location: "인천문학경기장 주경기장",
    distances: ["하프 (Half)", "10km", "5km"],
    status: "일정 종료",
    statusColor: "text-zinc-500 bg-zinc-950 border-zinc-900 opacity-60",
    fee: "하프 50,000원 | 10km 45,000원 | 5km 30,000원",
    host: "인천일보, 아시아육상연맹",
    details: "인천문학경기장에서 출발하여 송도국제도시 진입 교량을 거쳐 돌아오는 전통 있는 국제 공인 코스입니다. 시원한 직선 교량 코스가 특징입니다.",
    officialUrl: "http://incheonmarathon.co.kr",
  },
  {
    id: "songdo-walk-run-2026",
    name: "2026 송도 WALK & RUN (송도 글로벌 헬스 페스타)",
    date: "2026-04-18",
    dayOfWeek: "토요일 ~ 일요일 (양일간)",
    time: "10:00 순차 출발",
    location: "송도 달빛축제공원 대운동장",
    distances: ["20km", "10km", "5km", "걷기 코스", "나이트 워크"],
    status: "일정 종료",
    statusColor: "text-zinc-500 bg-zinc-950 border-zinc-900 opacity-60",
    fee: "통합 참가비 35,000원 (종목별 상이)",
    host: "연수구청, 송도 글로벌 페스타 조직위원회",
    details: "달빛축제공원의 넓은 광장에서 진행되는 축제형 러닝 대회입니다. 걷기 대회부터 20km 장거리 트레일 코스, 밤길을 달리는 나이트 워크 등이 다채롭게 구성되었습니다.",
    officialUrl: "#",
  },
  {
    id: "songdo-leebongju-2026",
    name: "2026 송도 이봉주 마라톤",
    date: "2026-06-28",
    dayOfWeek: "일요일",
    time: "08:00 출발 (07:00 집결)",
    location: "인천대학교 송도캠퍼스",
    distances: ["10km", "5km"],
    status: "접수 마감",
    statusColor: "text-rose-450 bg-rose-500/10 border-rose-500/20",
    fee: "10km 40,000원 | 5km 35,000원",
    host: "인천광역시, 송도이봉주마라톤 조직위, 기호일보",
    details: "국민 마라토너 이봉주 선수의 건강 회복을 기원하고, 송도 바닷바람을 맞으며 달리는 인기 레이스입니다. 인천대 캠퍼스 정문에서 출발하여 아암대로 해안 우회 도로를 왕복 순환합니다.",
    officialUrl: "http://runsongdo.co.kr",
  },
  {
    id: "incheon-marathon-2026",
    name: "2026 인천마라톤",
    date: "2026-11-22",
    dayOfWeek: "일요일",
    time: "09:00 출발",
    location: "인천문학경기장 및 연수구 일원",
    distances: ["풀코스 (Full)", "하프 (Half)", "10km", "5km"],
    status: "접수 중",
    statusColor: "text-brand bg-brand/10 border-brand/20",
    fee: "풀코스 60,000원 | 하프 50,000원 | 10km 45,000원 | 5km 35,000원",
    host: "인천광역시, 기호일보",
    details: "2026년 하반기를 화려하게 마무리할 인천 최대 규모의 풀코스 메이저 대회입니다. 문학경기장에서 연수구 원도심을 지나 송도 센트럴파크 해수로 깊숙이 관통하여 달리는 도심 결합 풀코스 레이스입니다.",
    officialUrl: "http://incheonmarathon.co.kr",
  },
];

export default function MarathonsPage() {
  const [filter, setFilter] = useState("all"); // all, 접수 중, 접수 마감, 일정 종료
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Dynamic D-Day calculation relative to June 23, 2026
  const calculateDDay = (targetDateStr: string) => {
    const today = new Date("2026-06-23T00:00:00");
    const target = new Date(targetDateStr + "T00:00:00");
    
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "D-Day";
    if (diffDays > 0) return `D-${diffDays}`;
    return `종료 (D+${Math.abs(diffDays)})`;
  };

  const filteredMarathons = MARATHONS_DATABASE.filter((marathon) => {
    // Filter by registration status
    if (filter !== "all" && marathon.status !== filter) return false;
    
    // Filter by search text
    if (
      search &&
      !marathon.name.toLowerCase().includes(search.toLowerCase()) &&
      !marathon.location.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    
    return true;
  });

  const toggleExpand = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
  };

  return (
    <div className="flex flex-col gap-8 px-4 py-8 md:px-8 mx-auto max-w-7xl w-full">
      
      {/* Page Header */}
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">2026 송도/인천 마라톤 일정</h1>
        <p className="text-zinc-500 text-sm mt-2">
          2026년 인천 및 송도국제도시 일대에서 펼쳐지는 공식 마라톤 대회 가이드입니다. (D-Day는 현재 시점 **2026년 6월 23일** 기준 자동 계산됩니다)
        </p>
      </div>

      {/* D-Day Timeline Progress bar */}
      <div className="glass-panel rounded-3xl p-6 border-zinc-900/60 animate-fade-in-up" style={{ animationDelay: "50ms" }}>
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">2026 연간 대회 타임라인 (기준일: 2026.06.23)</h3>
        
        <div className="relative pt-6 pb-2">
          {/* Track Bar */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-zinc-900 rounded-full -translate-y-1/2 z-0"></div>
          {/* Active progress (up to June) */}
          <div className="absolute top-1/2 left-0 w-2/3 h-1 bg-brand rounded-full -translate-y-1/2 z-0"></div>

          {/* Timeline Nodes */}
          <div className="relative flex justify-between items-center z-10">
            
            {/* March Node */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-brand border-4 border-zinc-950 shadow-lg"></div>
              <span className="text-[10px] font-bold text-zinc-300">인천국제하프</span>
              <span className="text-[9px] text-zinc-550">3월 22일 (종료)</span>
            </div>

            {/* April Node */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-brand border-4 border-zinc-950 shadow-lg"></div>
              <span className="text-[10px] font-bold text-zinc-300">송도 WALK & RUN</span>
              <span className="text-[9px] text-zinc-550">4월 18일 (종료)</span>
            </div>

            {/* Today marker indicator */}
            <div className="flex flex-col items-center gap-2 relative -top-3">
              <div className="px-2 py-0.5 rounded bg-brand text-black text-[8px] font-black tracking-tighter uppercase box-glow animate-pulse">
                Today
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-brand animate-ping absolute top-5"></div>
              <div className="w-3 h-3 rounded-full bg-brand border border-zinc-950 z-20"></div>
              <span className="text-[9px] font-bold text-brand mt-1">06.23</span>
            </div>

            {/* June Node */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-zinc-800 border-4 border-zinc-950 shadow-lg animate-pulse" style={{ animationDuration: "1.5s" }}></div>
              <span className="text-[10px] font-bold text-zinc-300">송도 이봉주</span>
              <span className="text-[9px] text-rose-400">6월 28일 (D-5)</span>
            </div>

            {/* November Node */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-zinc-900 border-4 border-zinc-950 shadow-lg"></div>
              <span className="text-[10px] font-bold text-zinc-300">인천마라톤</span>
              <span className="text-[9px] text-brand">11월 22일 (D-152)</span>
            </div>

          </div>
        </div>
      </div>

      {/* Filter and Search Panel */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between animate-fade-in-up" style={{ animationDelay: "100ms" }}>
        
        {/* Registration status filter buttons */}
        <div className="flex gap-2 p-1.5 bg-zinc-950 border border-zinc-900 rounded-2xl w-full sm:w-auto overflow-x-auto">
          {["all", "접수 중", "접수 마감", "일정 종료"].map((statusType) => (
            <button
              key={statusType}
              onClick={() => setFilter(statusType)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                filter === statusType
                  ? "bg-zinc-900 border border-zinc-800 text-white"
                  : "text-zinc-550 hover:text-zinc-350"
              }`}
            >
              {statusType === "all" ? "전체 대회" : statusType}
            </button>
          ))}
        </div>

        {/* Search input field */}
        <div className="relative w-full sm:w-80">
          <input
            id="marathon-search-input"
            type="text"
            placeholder="대회명 또는 장소 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-900 focus:border-brand rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-350 text-xs font-bold"
            >
              Clear
            </button>
          )}
        </div>

      </div>

      {/* Marathons Grid List */}
      <div className="grid grid-cols-1 gap-6 animate-fade-in-up" style={{ animationDelay: "150ms" }}>
        {filteredMarathons.length === 0 ? (
          <div className="glass-panel rounded-3xl p-12 text-center text-zinc-550 text-sm">
            해당하는 마라톤 대회가 존재하지 않습니다.<br />필터를 바꾸거나 검색어를 재입력해 보세요.
          </div>
        ) : (
          filteredMarathons.map((marathon) => {
            const isExpanded = expandedId === marathon.id;
            const ddayText = calculateDDay(marathon.date);
            const isFinished = ddayText.includes("종료");
            const isClosed = marathon.status === "접수 마감";
            const isOpened = marathon.status === "접수 중";

            return (
              <div
                key={marathon.id}
                className={`glass-panel rounded-3xl border transition-all duration-300 ${
                  isExpanded ? "border-brand bg-brand/[0.02]" : "border-zinc-900 hover:border-zinc-800"
                }`}
              >
                {/* Main Visible Card Header */}
                <div
                  onClick={() => toggleExpand(marathon.id)}
                  className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 cursor-pointer"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${marathon.statusColor}`}>
                        {marathon.status}
                      </span>
                      <span className="text-[11px] font-bold text-zinc-450">{marathon.date} ({marathon.dayOfWeek})</span>
                    </div>

                    <h3 className={`text-lg font-black transition-colors ${isExpanded ? "text-brand" : "text-white"}`}>
                      {marathon.name}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 mt-1">
                      <span className="flex items-center gap-1">📍 {marathon.location}</span>
                      <span className="text-zinc-700">|</span>
                      <span className="flex items-center gap-1">🏆 {marathon.distances.join(", ")}</span>
                    </div>
                  </div>

                  {/* D-Day badge and Expand control */}
                  <div className="flex items-center gap-5 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-zinc-950 pt-4 md:pt-0">
                    <div className="flex flex-col text-right">
                      <span className={`text-2xl font-black tracking-wider text-glow ${
                        isFinished ? "text-zinc-550 text-shadow-none" : isClosed ? "text-rose-400" : "text-brand"
                      }`}>
                        {ddayText}
                      </span>
                    </div>
                    
                    <button
                      id={`marathon-expand-btn-${marathon.id}`}
                      className={`p-2.5 rounded-xl bg-zinc-900 border border-zinc-850 hover:bg-zinc-800 text-white transition-transform ${
                        isExpanded ? "rotate-180 border-brand/30 text-brand" : ""
                      }`}
                      aria-label="Toggle details"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Expanded Details Drawer */}
                {isExpanded && (
                  <div className="px-6 pb-6 pt-2 border-t border-zinc-950 animate-fade-in-up" style={{ animationDuration: "0.3s" }}>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
                      
                      {/* Left: General detailed info */}
                      <div className="flex flex-col gap-4">
                        <div>
                          <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5">대회 설명</h4>
                          <p className="text-xs text-zinc-300 leading-relaxed font-medium">{marathon.details}</p>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                          <div className="bg-black/30 border border-zinc-900/50 rounded-xl p-3">
                            <span className="text-[9px] text-zinc-500 font-bold block">주최 및 주관</span>
                            <span className="text-xs font-semibold text-white mt-1 block">{marathon.host}</span>
                          </div>
                          <div className="bg-black/30 border border-zinc-900/50 rounded-xl p-3">
                            <span className="text-[9px] text-zinc-500 font-bold block">출발 시간</span>
                            <span className="text-xs font-semibold text-brand mt-1 block">{marathon.time}</span>
                          </div>
                        </div>

                        <div className="bg-zinc-950/40 border border-zinc-900/60 rounded-xl p-3.5">
                          <span className="text-[9px] text-zinc-550 font-bold block mb-1">종목별 참가 비용</span>
                          <span className="text-xs text-zinc-400 font-medium leading-relaxed">{marathon.fee}</span>
                        </div>
                      </div>

                      {/* Right: Action and layout illustration */}
                      <div className="flex flex-col justify-between gap-4">
                        <div className="bg-black/40 border border-zinc-900/60 rounded-2xl p-5 flex flex-col gap-3">
                          <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">코스 핵심 포인트</h4>
                          
                          <div className="flex flex-col gap-2 text-xs text-zinc-350">
                            <div className="flex items-center gap-2">
                              <span className="text-brand">✔</span>
                              <span>송도 특유의 바람 저항 고려 필요 (교량 진입 시 강풍 주의)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-brand">✔</span>
                              <span>완만한 경사의 교량 교차구간 제외, 85% 이상 완전 평지</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-brand">✔</span>
                              <span>센트럴파크 해수로와 잭니 CC 오션뷰를 포함한 훌륭한 조망</span>
                            </div>
                          </div>
                        </div>

                        {/* Interactive Official Website link button */}
                        <div className="flex flex-col sm:flex-row gap-3">
                          {isOpened ? (
                            <a
                              href={marathon.officialUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 py-3 bg-brand hover:bg-white text-black font-bold text-xs rounded-xl transition-all text-center box-glow active:scale-[0.98]"
                            >
                              대회 공식 홈페이지 접수하기
                            </a>
                          ) : (
                            <button
                              disabled
                              className="flex-1 py-3 bg-zinc-900 border border-zinc-800 text-zinc-550 font-bold text-xs rounded-xl cursor-not-allowed text-center"
                            >
                              {isFinished ? "종료된 대회입니다" : "참가 신청이 마감되었습니다"}
                            </button>
                          )}
                          <Link
                            href="/courses"
                            className="flex-1 py-3 bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 text-zinc-300 font-semibold text-xs rounded-xl transition-all text-center"
                          >
                            코스 맵에서 달리기 코스 연습하기
                          </Link>
                        </div>
                      </div>

                    </div>

                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
