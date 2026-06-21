import { useEffect, useState, useCallback } from 'react';
import AMapLoader from '@amap/amap-jsapi-loader';
import { AMAP_KEY, isGaodeMapEnabled } from '../../../config/env';

let AMapInstance: any = null;

export const useGaodeMap = () => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isGaodeMapEnabled()) {
      setError('高德地图 Key 未配置');
      return;
    }

    if (AMapInstance) {
      setLoaded(true);
      return;
    }

    AMapLoader.load({
      key: AMAP_KEY,
      version: '2.0',
      plugins: [
        'AMap.DistrictSearch',
        'AMap.Geocoder',
        'AMap.Scale',
        'AMap.ToolBar',
      ],
    })
      .then((AMap: any) => {
        AMapInstance = AMap;
        setLoaded(true);
      })
      .catch((err: any) => {
        setError(err.message || '高德地图加载失败');
      });
  }, []);

  const getAMap = useCallback(() => AMapInstance, []);

  return { loaded, error, getAMap };
};
