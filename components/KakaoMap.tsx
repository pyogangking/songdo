'use client';

import { useEffect, useRef } from 'react';

const KakaoMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.kakao.maps.load(() => {
      if (!mapRef.current) return;

      const options = {
        center: new window.kakao.maps.LatLng(37.3894, 126.6436),
        level: 5,
      };

      new window.kakao.maps.Map(mapRef.current, options);
    });
  }, []);

  return <div ref={mapRef} style={{ width: '100%', height: '600px' }} />;
};

export default KakaoMap;
