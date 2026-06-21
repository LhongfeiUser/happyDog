import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Select, Input } from 'antd';
import { EnvironmentOutlined, AimOutlined, LoadingOutlined } from '@ant-design/icons';
import { useGaodeMap } from './useGaodeMap';
import './index.css';
import type { AddressInfo, AddressPickerProps } from './types';

const AddressPicker: React.FC<AddressPickerProps> = ({
  value,
  onChange,
  placeholder = '请选择省市区，或在地图上选点',
  disabled = false,
  showMap = true,
  mapHeight = 250,
  className,
}) => {
  const { loaded, error, getAMap } = useGaodeMap();
  const [province, setProvince] = useState(value?.province || '');
  const [city, setCity] = useState(value?.city || '');
  const [district, setDistrict] = useState(value?.district || '');
  const [detailAddress, setDetailAddress] = useState(value?.address || '');
  const [lng, setLng] = useState(value?.lng || 0);
  const [lat, setLat] = useState(value?.lat || 0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<AMap.Poi[]>([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<AMap.Map | null>(null);
  const markerInstance = useRef<AMap.Marker | null>(null);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 用 ref 跟踪最新状态，避免闭包问题
  const stateRef = useRef({ province, city, district, detailAddress });
  useEffect(() => {
    stateRef.current = { province, city, district, detailAddress };
  });

  // 省市区数据
  const [provinceOptions, setProvinceOptions] = useState<{ label: string; value: string; cityList?: any[] }[]>([]);
  const [cityOptions, setCityOptions] = useState<{ label: string; value: string; districtList?: any[] }[]>([]);
  const [districtOptions, setDistrictOptions] = useState<{ label: string; value: string }[]>([]);

  // 触发 onChange
  const triggerChange = useCallback(
    (addr: Partial<AddressInfo>) => {
      const current = stateRef.current;
      const newValue: AddressInfo = {
        province: addr.province ?? current.province,
        city: addr.city ?? current.city,
        district: addr.district ?? current.district,
        address: addr.address ?? current.detailAddress,
        lng: addr.lng ?? lng,
        lat: addr.lat ?? lat,
        formatted: `${addr.province ?? current.province}${addr.city ?? current.city}${addr.district ?? current.district}${addr.address ?? current.detailAddress}`,
      };
      onChange?.(newValue);
    },
    [lng, lat, onChange],
  );

  // 加载行政区划
  useEffect(() => {
    if (!loaded || !getAMap()) return;

    const AMap = getAMap();
    const districtSearch = new AMap.DistrictSearch({
      level: 'country',
      subdistrict: 3,
      extensions: 'base',
    });

    districtSearch.search('中国', (status: string, result: any) => {
      if (status === 'complete' && result.districtList?.[0]) {
        const provinces = result.districtList[0].districtList.map((d: any) => ({
          label: d.name,
          value: d.name,
          cityList: d.districtList || [],
        }));
        setProvinceOptions(provinces);
      }
    });
  }, [loaded, getAMap]);

  // 省份变化
  const handleProvinceChange = (val: string) => {
    setProvince(val);
    setCity('');
    setDistrict('');
    setCityOptions([]);
    setDistrictOptions([]);

    const provinceData = provinceOptions.find((p) => p.value === val);
    if (provinceData?.cityList) {
      setCityOptions(
        provinceData.cityList.map((c: any) => ({
          label: c.name,
          value: c.name,
          districtList: c.districtList || [],
        })),
      );
    }
    triggerChange({ province: val, city: '', district: '' });
  };

  // 城市变化
  const handleCityChange = (val: string) => {
    setCity(val);
    setDistrict('');
    setDistrictOptions([]);

    const cityData = cityOptions.find((c) => c.value === val);
    if (cityData?.districtList) {
      setDistrictOptions(
        cityData.districtList.map((d: any) => ({
          label: d.name,
          value: d.name,
        })),
      );
    }
    triggerChange({ city: val, district: '' });
  };

  // 区县变化
  const handleDistrictChange = (val: string) => {
    setDistrict(val);
    triggerChange({ district: val });

    if (mapInstance.current && getAMap()) {
      mapInstance.current.setCity(val);
    }
  };

  // 逆地理编码（使用 ref 避免闭包问题）
  const reverseGeocode = useCallback(
    (longitude: number, latitude: number) => {
      if (!getAMap()) return;
      const AMap = getAMap()!;
      const geocoder = new AMap.Geocoder();

      geocoder.getAddress([longitude, latitude], (status: string, result: any) => {
        if (status === 'complete' && result.regeocode) {
          const comp = result.regeocode.addressComponent;
          if (comp.province && !stateRef.current.province) setProvince(comp.province);
          if (comp.city && !stateRef.current.city) {
            setCity(comp.city.length > 0 ? comp.city : comp.province);
          }
          if (comp.district && !stateRef.current.district) setDistrict(comp.district);
          const streetAddr = (comp.township || '') + (comp.street || '') + (comp.streetNumber || '');
          if (streetAddr && !stateRef.current.detailAddress) setDetailAddress(streetAddr);
        }
      });
    },
    [getAMap],
  );

  // 在地图上放置标记
  const placeMarker = useCallback(
    (map: AMap.Map, mapLng: number, mapLat: number) => {
      if (markerInstance.current) {
        markerInstance.current.setPosition([mapLng, mapLat]);
      } else {
        const AMap = getAMap()!;
        const marker = new AMap.Marker({
          position: [mapLng, mapLat],
          draggable: true,
          cursor: 'move',
        });
        marker.setMap(map);

        marker.on('dragend', () => {
          const pos = marker.getPosition();
          setLng(pos.lng);
          setLat(pos.lat);
          reverseGeocode(pos.lng, pos.lat);
        });

        markerInstance.current = marker;
      }
    },
    [getAMap, reverseGeocode],
  );

  // 初始化地图
  useEffect(() => {
    if (!loaded || !mapRef.current || !getAMap() || mapInstance.current) return;

    const AMap = getAMap()!;
    const initialLng = lng && lat ? lng : 116.397428;
    const initialLat = lng && lat ? lat : 39.90923;

    const map = new AMap.Map(mapRef.current, {
      zoom: 15,
      center: [initialLng, initialLat],
      viewMode: '2D',
    });

    // 添加控件
    map.plugin(['AMap.Scale', 'AMap.ToolBar'], () => {
      try {
        map.addControl(new AMap.Scale());
        map.addControl(new AMap.ToolBar({ position: 'RT' }));
      } catch {
        // 控件加载失败不影响功能
      }
    });

    // 点击地图选点
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    map.on('click', (e: any) => {
      if (disabled) return;
      // JSAPI 2.0 兼容：从事件中提取经纬度
      const lnglat = e.lnglat;
      if (!lnglat) return;

      const clickedLng = lnglat.lng ?? lnglat.getLng?.();
      const clickedLat = lnglat.lat ?? lnglat.getLat?.();
      if (clickedLng == null || clickedLat == null) return;

      setLng(clickedLng);
      setLat(clickedLat);
      placeMarker(map, clickedLng, clickedLat);
      reverseGeocode(clickedLng, clickedLat);
    });

    mapInstance.current = map;

    return () => {
      map.destroy();
      mapInstance.current = null;
      markerInstance.current = null;
    };
  }, [loaded, getAMap, disabled, lng, lat, placeMarker, reverseGeocode]);

  // 搜索地址（使用高德 REST API）
  const handleSearch = useCallback(
    (keyword: string) => {
      if (!keyword.trim()) return;

      // 清除之前的定时器
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }

      setSearching(true);
      searchTimerRef.current = setTimeout(async () => {
        try {
          // 使用高德 REST Web Service API 搜索
          const amapKey = import.meta.env.VITE_AMAP_KEY;
          const resp = await fetch(
            `https://restapi.amap.com/v3/place/text?key=${amapKey}&keywords=${encodeURIComponent(keyword)}&city=&citylimit=false&offset=0&page=1&extensions=base`
          );
          const data = await resp.json();

          if (data.status === '1' && data.pois && data.pois.length > 0) {
            // 将 REST API 返回格式转换为 POI 对象
            const pois = data.pois.map((p: any) => ({
              id: p.id,
              name: p.name,
              address: p.address || '',
              location: (() => {
                const loc = p.location || '';
                const [lng, lat] = loc.split(',').map(Number);
                return { lng: lng || 0, lat: lat || 0, getLng: () => lng || 0, getLat: () => lat || 0 };
              })(),
              pname: p.pname || '',
              cityname: p.cityname || '',
              adname: p.adname || '',
              p: p.pname || '',
              c: p.cityname || '',
              province: p.pname || '',
              city: p.cityname || '',
              district: p.adname || '',
            }));
            setSearchResults(pois);
            setShowResults(true);
          } else {
            setSearchResults([]);
            setShowResults(false);
          }
        } catch {
          setSearchResults([]);
          setShowResults(false);
        } finally {
          setSearching(false);
        }
      }, 400);
    },
    [],
  );

  // 选择搜索结果
  const handleSelectSearchResult = (poi: any) => {
    const location = poi.location || {};
    const poiLng = location.lng || 0;
    const poiLat = location.lat || 0;

    setSearchKeyword(poi.name);
    setShowResults(false);

    // 更新地图位置
    if (mapInstance.current && poiLng && poiLat) {
      mapInstance.current.setZoomAndCenter(17, [poiLng, poiLat]);
      placeMarker(mapInstance.current, poiLng, poiLat);
      setLng(poiLng);
      setLat(poiLat);
    }

    // 解析地址组件（兼容 REST API 和 JSAPI 两种格式）
    const poiProvince = poi.pname || poi.p || poi.province || '';
    const poiCity = poi.cityname || poi.c || poi.city || poiProvince;
    const poiDistrict = poi.adname || poi.district || '';
    const poiAddress = poi.address || '';

    // 设置省市区值，并加载对应的级联选项
    setProvince(poiProvince);
    setCity(poiCity);
    setDistrict(poiDistrict);

    // 从已加载的 provinceOptions 中查找对应的城市和区县选项
    const provData = provinceOptions.find(p => p.value === poiProvince);
    if (provData?.cityList) {
      const cityOpts = provData.cityList.map((c: { name: string; districtList?: { name: string }[] }) => ({
        label: c.name,
        value: c.name,
        districtList: c.districtList || [],
      }));
      setCityOptions(cityOpts);

      const cityData = cityOpts.find((c: { value: string }) => c.value === poiCity);
      if (cityData?.districtList) {
        setDistrictOptions(
          cityData.districtList.map((d: { name: string }) => ({
            label: d.name,
            value: d.name,
          }))
        );
      }
    }

    triggerChange({
      province: poiProvince,
      city: poiCity,
      district: poiDistrict,
      address: poiAddress,
      lng: poiLng,
      lat: poiLat,
    });
  };

  // 错误降级
  if (error) {
    return (
      <div className={`address-picker-wrapper ${className || ''}`} style={{ padding: 12 }}>
        <Input
          prefix={<EnvironmentOutlined />}
          value={typeof value === 'string' ? value : value?.address || ''}
          onChange={(e) =>
            triggerChange({ address: e.target.value, formatted: e.target.value })
          }
          placeholder={placeholder}
          disabled={disabled}
        />
        <div className="address-picker-tip" style={{ color: '#ff4d4f' }}>
          ⚠️ {error}，请手动输入地址
        </div>
      </div>
    );
  }

  return (
    <div className={`address-picker-wrapper ${className || ''}`}>
      {/* 搜索栏 */}
      <div className="address-picker-search">
        <Input
          prefix={<EnvironmentOutlined style={{ color: '#FF6B35' }} />}
          value={searchKeyword}
          onChange={(e) => {
            setSearchKeyword(e.target.value);
            handleSearch(e.target.value);
          }}
          onFocus={() => searchResults.length > 0 && setShowResults(true)}
          placeholder="搜索地点..."
          disabled={disabled}
          allowClear
          suffix={searching ? <LoadingOutlined /> : null}
        />
        {showResults && searchResults.length > 0 && (
          <div className="address-picker-search-results">
            {searchResults.map((poi, idx) => (
              <div
                key={poi.id || idx}
                className="address-picker-search-item"
                onClick={() => handleSelectSearchResult(poi)}
              >
                <div style={{ fontWeight: 500, color: '#333' }}>{poi.name}</div>
                <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>
                  {poi.address || poi.name}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 省市区级联 */}
      <div className="address-picker-row">
        <Select
          value={province}
          onChange={handleProvinceChange}
          options={provinceOptions}
          placeholder="省/直辖市"
          disabled={disabled}
          style={{ flex: 1 }}
          showSearch
          optionFilterProp="label"
          suffixIcon={!loaded ? <LoadingOutlined /> : undefined}
        />
        <Select
          value={city}
          onChange={handleCityChange}
          options={cityOptions}
          placeholder="市"
          disabled={disabled || !province}
          style={{ flex: 1 }}
          showSearch
          optionFilterProp="label"
        />
        <Select
          value={district}
          onChange={handleDistrictChange}
          options={districtOptions}
          placeholder="区/县"
          disabled={disabled || !city}
          style={{ flex: 1 }}
          showSearch
          optionFilterProp="label"
        />
      </div>

      {/* 地图 */}
      {showMap && (
        <div className="address-picker-map">
          <div style={{ padding: '4px 8px', background: '#fff8f0', fontSize: 12, color: '#d46b08' }}>
            <AimOutlined style={{ marginRight: 4 }} /> 点击地图选择位置
          </div>
          <div ref={mapRef} style={{ height: mapHeight }} />
        </div>
      )}

      {/* 详细地址 */}
      <div className="address-picker-detail">
        <Input
          prefix={<EnvironmentOutlined style={{ color: '#FF6B35' }} />}
          value={detailAddress}
          onChange={(e) => {
            setDetailAddress(e.target.value);
            triggerChange({ address: e.target.value });
          }}
          placeholder="详细地址（街道、门牌号等）"
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default AddressPicker;
