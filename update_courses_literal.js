const fs = require('fs');
const path = require('path');

const coursesFilePath = path.join(__dirname, 'app', 'courses', 'page.tsx');
const homeFilePath = path.join(__dirname, 'app', 'page.tsx');

// The new COURSES constant with literal fields and paths matching user JSON exactly
const newCoursesCode = `const COURSES = [
  {
    id: 1,
    name: "달빛축제공원 코스",
    distance: "3.2km",
    difficulty: "초급",
    color: "#4CAF50",
    estimatedTime: "20-25분",
    elevation: "+8m",
    description: "송도 달빛축제공원을 중심으로 한 평탄한 초보자용 코스. 넓은 잔디밭과 산책로가 잘 정비되어 있습니다.",
    parking: "달빛축제공원 주차장",
    restroom: [
      "공원 화장실",
      "인근 커뮤니티센터"
    ],
    highlights: [
      "달빛축제공원 잔디광장",
      "조각공원",
      "수변 산책로"
    ],
    path: [
      [37.3797, 126.6565],
      [37.3805, 126.6572],
      [37.3812, 126.6568],
      [37.382, 126.6575],
      [37.3825, 126.6582],
      [37.383, 126.659],
      [37.3828, 126.6598],
      [37.3822, 126.6605],
      [37.3815, 126.661],
      [37.3808, 126.6605],
      [37.3802, 126.6598],
      [37.3795, 126.659],
      [37.379, 126.6582],
      [37.3792, 126.6575],
      [37.3797, 126.6565]
    ],
    // UI assets
    idStr: "moonlight-park",
    nameEn: "Moonlight Festival Park Loop",
    badge: "야간",
    badgeColor: "#4CAF50",
    rating: 4.5,
    distanceVal: 3.2,
    surface: "포장도로",
    scenery: "공원/잔디광장",
    calories: "약 230kcal",
    tags: ["공원", "잔디광장", "초보자"],
    safetyTip: "수변 산책로 달리기 시 미끄러짐을 방지하기 위해 노면 상태를 확인하며 안전 페이스를 유지하세요.",
    photo: "/songdo_moonlight.png",
    startPoint: "달빛축제공원 주차장",
    routeDescription: "달빛축제공원 주차장 → 대광장 및 수변 산책로 → 복귀",
    amenities: [
      { name: "화장실", desc: "공원 화장실, 인근 커뮤니티센터" },
      { name: "주차장", desc: "달빛축제공원 주차장" }
    ]
  },
  {
    id: 2,
    name: "센트럴파크 순환 코스",
    distance: "5.0km",
    difficulty: "초급",
    color: "#2196F3",
    estimatedTime: "30-40분",
    elevation: "+12m",
    description: "송도의 랜드마크 센트럴파크 호수를 한 바퀴 도는 인기 코스. 트라이볼, NC큐브 등 주요 명소를 지나갑니다.",
    parking: "센트럴파크 지하주차장",
    restroom: [
      "스타벅스 센트럴파크점",
      "NC큐브 1층",
      "공원 화장실"
    ],
    highlights: [
      "센트럴파크 호수",
      "트라이볼",
      "더샵 벚꽃길",
      "수상택시 선착장"
    ],
    path: [
      [37.3894, 126.6436],
      [37.39, 126.6445],
      [37.3908, 126.6455],
      [37.3915, 126.6462],
      [37.392, 126.647],
      [37.3925, 126.6478],
      [37.3928, 126.6485],
      [37.3925, 126.6492],
      [37.3918, 126.6495],
      [37.391, 126.649],
      [37.3902, 126.6482],
      [37.3895, 126.6475],
      [37.3888, 126.6468],
      [37.3882, 126.646],
      [37.3878, 126.6452],
      [37.3876, 126.6445],
      [37.388, 126.6438],
      [37.3886, 126.6432],
      [37.3894, 126.6436]
    ],
    // UI assets
    idStr: "central-park",
    nameEn: "Central Park Loop",
    badge: "인기",
    badgeColor: "#2196F3",
    rating: 4.9,
    distanceVal: 5.0,
    surface: "포장도로",
    scenery: "호수공원",
    calories: "약 350kcal",
    tags: ["호수", "랜드마크", "평탄"],
    safetyTip: "공원 내 자전거 및 보행자에 유의하여 러닝 전용 트랙/우측 통행을 준수하세요.",
    photo: "/songdo_central_park.png",
    startPoint: "센트럴파크 지하주차장",
    routeDescription: "센트럴파크 호수 → 트라이볼 → 벚꽃길 → 수상택시 선착장 → 복귀",
    amenities: [
      { name: "화장실", desc: "스타벅스 센트럴파크점, NC큐브 1층, 공원 화장실" },
      { name: "주차장", desc: "센트럴파크 지하주차장" }
    ]
  },
  {
    id: 3,
    name: "해돋이·해누리공원 코스",
    distance: "4.5km",
    difficulty: "초급",
    color: "#FF9800",
    estimatedTime: "25-35분",
    elevation: "+15m",
    description: "송도 해안가를 따라 달리는 바다 전망 코스. 해돋이공원에서 해누리공원까지 왕복합니다.",
    parking: "송도 컨벤시아 주차장",
    restroom: [
      "컨벤시아 1층",
      "해돋이공원 화장실"
    ],
    highlights: [
      "서해 바다 전망",
      "해돋이공원 전망대",
      "해안 산책로",
      "일몰 명소"
    ],
    path: [
      [37.388, 126.655],
      [37.387, 126.656],
      [37.3855, 126.6575],
      [37.384, 126.6585],
      [37.3825, 126.6595],
      [37.381, 126.6605],
      [37.3795, 126.6615],
      [37.378, 126.6625],
      [37.3765, 126.6635],
      [37.375, 126.664],
      [37.3735, 126.6645],
      [37.375, 126.664],
      [37.3765, 126.663],
      [37.378, 126.662],
      [37.3795, 126.661],
      [37.381, 126.66],
      [37.3825, 126.659],
      [37.384, 126.658],
      [37.3855, 126.657],
      [37.387, 126.656],
      [37.388, 126.655]
    ],
    // UI assets
    idStr: "haedoji-loop",
    nameEn: "Haedoji & Haenuri Park",
    badge: "힐링",
    badgeColor: "#FF9800",
    rating: 4.6,
    distanceVal: 4.5,
    surface: "우레탄 트랙",
    scenery: "공원/전망",
    calories: "약 320kcal",
    tags: ["공원", "해안산책", "힐링"],
    safetyTip: "산책하는 시민들이 많으니 안전거리를 유지하고 추월 시 주의하세요.",
    photo: "/songdo_haedoji.png",
    startPoint: "송도 컨벤시아 주차장",
    routeDescription: "송도 컨벤시아 주차장 → 해돋이공원 전망대 → 해안 산책로 → 해누리공원 왕복",
    amenities: [
      { name: "화장실", desc: "컨벤시아 1층, 해돋이공원 화장실" },
      { name: "주차장", desc: "송도 컨벤시아 주차장" }
    ]
  },
  {
    id: 4,
    name: "INU 인천대 캠퍼스 코스",
    distance: "8.5km",
    difficulty: "중급",
    color: "#9C27B0",
    estimatedTime: "50-65분",
    elevation: "+45m",
    description: "인천대 캠퍼스를 순회하며 송도 신도시까지 이어지는 훈련용 코스. 언덕 구간이 있어 체력 향상에 좋습니다.",
    parking: "인천대 방문자 주차장",
    restroom: [
      "학생회관",
      "도서관",
      "체육관"
    ],
    highlights: [
      "인천대 정문",
      "캠퍼스 트랙",
      "언덕 훈련 구간",
      "송도 신도시 전망"
    ],
    path: [
      [37.375, 126.633],
      [37.3755, 126.634],
      [37.3762, 126.6348],
      [37.377, 126.6355],
      [37.3778, 126.6365],
      [37.3785, 126.6375],
      [37.3792, 126.6385],
      [37.38, 126.6395],
      [37.3808, 126.6405],
      [37.3815, 126.6415],
      [37.3822, 126.6425],
      [37.383, 126.6435],
      [37.3835, 126.6445],
      [37.383, 126.6455],
      [37.3822, 126.645],
      [37.3815, 126.644],
      [37.3808, 126.643],
      [37.38, 126.642],
      [37.3792, 126.641],
      [37.3785, 126.64],
      [37.3778, 126.639],
      [37.377, 126.638],
      [37.3762, 126.637],
      [37.3755, 126.636],
      [37.375, 126.635],
      [37.375, 126.633]
    ],
    // UI assets
    idStr: "inu-loop",
    nameEn: "INU Campus Loop",
    badge: "추천",
    badgeColor: "#9C27B0",
    rating: 4.7,
    distanceVal: 8.5,
    surface: "혼합 노면",
    scenery: "캠퍼스",
    calories: "약 580kcal",
    tags: ["캠퍼스", "언덕훈련", "대학가"],
    safetyTip: "캠퍼스 내 차량 서행 구간이 있으나 횡단보도나 진입로에서 주의하세요.",
    photo: "/songdo_coast.png",
    startPoint: "인천대 방문자 주차장",
    routeDescription: "인천대 방문자 주차장 → 인천대 정문 → 캠퍼스 내부 트랙 및 외곽 훈련 구간",
    amenities: [
      { name: "화장실", desc: "학생회관, 도서관, 체육관" },
      { name: "주차장", desc: "인천대 방문자 주차장" }
    ]
  },
  {
    id: 5,
    name: "잭니클라우스 골프장 외곽 코스",
    distance: "10.2km",
    difficulty: "중급",
    color: "#F44336",
    estimatedTime: "60-75분",
    elevation: "+35m",
    description: "잭니클라우스 골프장 외곽을 따라 송도 전역을 순회하는 장거리 코스. 하프 마라톤 대비 훈련에 적합합니다.",
    parking: "송도 국제업무단지 공영주차장",
    restroom: [
      "트리플스트리트",
      "센트럴파크",
      "컨벤시아"
    ],
    highlights: [
      "골프장 외곽 순환로",
      "송도 스카이라인",
      "국제업무단지",
      "송도 전체 조망"
    ],
    path: [
      [37.39, 126.65],
      [37.391, 126.651],
      [37.392, 126.652],
      [37.393, 126.6535],
      [37.394, 126.655],
      [37.3945, 126.6565],
      [37.394, 126.658],
      [37.393, 126.659],
      [37.392, 126.6595],
      [37.391, 126.6598],
      [37.39, 126.6595],
      [37.389, 126.659],
      [37.388, 126.658],
      [37.387, 126.657],
      [37.386, 126.656],
      [37.385, 126.655],
      [37.3845, 126.654],
      [37.385, 126.6525],
      [37.386, 126.651],
      [37.387, 126.65],
      [37.388, 126.6495],
      [37.389, 126.6492],
      [37.39, 126.65]
    ],
    // UI assets
    idStr: "jack-nicklaus",
    nameEn: "Jack Nicklaus Circuit",
    badge: "훈련",
    badgeColor: "#F44336",
    rating: 4.8,
    distanceVal: 10.2,
    surface: "포장도로",
    scenery: "골프장/오션뷰",
    calories: "약 700kcal",
    tags: ["골프장", "장거리", "외곽"],
    safetyTip: "장거리 코스이므로 페이스 조절 및 충분한 음수 공급이 필요합니다.",
    photo: "/songdo_golf.png",
    startPoint: "송도 국제업무단지 공영주차장",
    routeDescription: "송도 국제업무단지 공영주차장 → 잭니클라우스 골프장 외곽 순환로 → 복귀",
    amenities: [
      { name: "화장실", desc: "트리플스트리트, 센트럴파크, 컨벤시아" },
      { name: "주차장", desc: "송도 국제업무단지 공영주차장" }
    ]
  }
];`;

let coursesContent = fs.readFileSync(coursesFilePath, 'utf8');

// Replace COURSES array
const startTag = 'const COURSES = [';
const startIndex = coursesContent.indexOf(startTag);
if (startIndex !== -1) {
  let bracketCount = 0;
  let endIndex = -1;
  for (let i = startIndex + startTag.length - 1; i < coursesContent.length; i++) {
    if (coursesContent[i] === '[') bracketCount++;
    if (coursesContent[i] === ']') {
      bracketCount--;
      if (bracketCount === 0) {
        endIndex = i;
        break;
      }
    }
  }
  if (endIndex !== -1) {
    let endStrIndex = endIndex + 1;
    if (coursesContent[endStrIndex] === ';') {
      endStrIndex++;
    }
    coursesContent = coursesContent.substring(0, startIndex) + newCoursesCode + coursesContent.substring(endStrIndex);
    console.log('✅ Replaced COURSES constant');
  }
}

// Update Map component to use .path instead of .gpsPath
coursesContent = coursesContent.replace(
  /courses\.forEach\(\(course\)\s*=>\s*\{[\s\S]*?const\s+linePath\s*=\s*course\.gpsPath\.map\([\s\S]*?\}\);/g,
  `courses.forEach((course) => {
            const linePath = course.path.map(
              (pt) => new kakao.maps.LatLng(pt[0], pt[1])
            );
            new kakao.maps.Polyline({
              path: linePath,
              strokeWeight: 5,
              strokeColor: course.color,
              strokeOpacity: 0.9,
              strokeStyle: "solid",
              map,
            });
            const startPt = course.path[0];
            const marker = new kakao.maps.Marker({
              position: new kakao.maps.LatLng(startPt[0], startPt[1]),
              map,
            });
            const iw = new kakao.maps.InfoWindow({
              content: \`<div style="padding:6px 10px;font-family:sans-serif;font-size:11px;font-weight:bold;background:#0d1117;color:\${course.color};border:1px solid \${course.color}40;border-radius:6px;white-space:nowrap;">\${course.name}</div>\`,
            });
            kakao.maps.event.addListener(marker, "mouseover", () => iw.open(map, marker));
            kakao.maps.event.addListener(marker, "mouseout", () => iw.close());
            kakao.maps.event.addListener(marker, "click", () => onSelect(String(course.id)));
          });`
);

// Update panTo inside Map component
coursesContent = coursesContent.replace(
  /const\s+center\s*=\s*course\.gpsPath\[0\];\s*map\.panTo\(new\s*\(window\s*as\s*any\)\.kakao\.maps\.LatLng\(center\.lat,\s*center\.lng\)\);/g,
  `const center = course.path[0];
    map.panTo(new (window as any).kakao.maps.LatLng(center[0], center[1]));`
);

// Update course detail search logic to support both strings and numbers
coursesContent = coursesContent.replace(
  /const\s+selected\s*=\s*COURSES\.find\(\(c\)\s*=>\s*c\.id\s*===\s*selectedId\)\s*\|\|\s*COURSES\[0\];/g,
  `const selected = COURSES.find((c) => String(c.id) === String(selectedId)) || COURSES[0];`
);

coursesContent = coursesContent.replace(
  /courses\.find\(\(c\)\s*=>\s*c\.id\s*===\s*selectedId\)/g,
  `courses.find((c) => String(c.id) === String(selectedId))`
);

// Fix initial search param default
coursesContent = coursesContent.replace(
  /const\s+initial\s*=\s*searchParams\.get\("selected"\)\s*\|\|\s*"central-park";/g,
  `const initial = searchParams.get("selected") || "2";`
);

// Update buttons selection checks
coursesContent = coursesContent.replace(
  /selectedId\s*===\s*course\.id/g,
  `String(selectedId) === String(course.id)`
);

coursesContent = coursesContent.replace(
  /onSelect\(course\.id\)/g,
  `onSelect(String(course.id))`
);

coursesContent = coursesContent.replace(
  /selectedId\s*===\s*c\.id/g,
  `String(selectedId) === String(c.id)`
);

coursesContent = coursesContent.replace(
  /onSelect\(c\.id\)/g,
  `onSelect(String(c.id))`
);

coursesContent = coursesContent.replace(
  /onClick\(\(\)\s*=>\s*setSelectedId\(course\.id\)\)/g,
  `onClick(() => setSelectedId(String(course.id)))`
);

// Update details panel rendering keys
coursesContent = coursesContent.replace(
  /selected\.time/g,
  `selected.estimatedTime`
);

coursesContent = coursesContent.replace(
  /selected\.elevGain/g,
  `selected.elevation`
);

coursesContent = coursesContent.replace(
  /course\.time/g,
  `course.estimatedTime`
);

// Set overall center coordinate
coursesContent = coursesContent.replace(/center:\s*new\s*kakao\.maps\.LatLng\([\d\.]+,\s*[\d\.]+\)/g, 'center: new kakao.maps.LatLng(37.384, 126.648)');

fs.writeFileSync(coursesFilePath, coursesContent, 'utf8');
console.log('✅ Updated app/courses/page.tsx with literal user JSON data and paths');

// Read app/page.tsx and update links to courses with ID parameter
let homeContent = fs.readFileSync(homeFilePath, 'utf8');

// Replace text-emerald badge and 4.2km to 3.2km
homeContent = homeContent.replace(
  /href="\/courses\?selected=central-park"/g,
  `href="/courses?selected=2"`
);

homeContent = homeContent.replace(
  /href="\/courses\?selected=inu-loop"/g,
  `href="/courses?selected=4"`
);

homeContent = homeContent.replace(
  /href="\/courses\?selected=jack-nicklaus"/g,
  `href="/courses?selected=5"`
);

fs.writeFileSync(homeFilePath, homeContent, 'utf8');
console.log('✅ Updated app/page.tsx links to match numeric IDs');
