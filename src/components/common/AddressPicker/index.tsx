import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Select, Input, Tooltip } from 'antd';
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
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerInstance = useRef<any>(null);
  const placeSearchRef = useRef<any>(null);

  // 省市区数据
  const [provinceOptions, setProvinceOptions] = useState<{ label: string; value: string; cityList?: any[] }[]>([]);
  const [cityOptions, setCityOptions] = useState<{ label: string; value: string; districtList?: any[] }[]>([]);
  const [districtOptions, setDistrictOptions] = useState<{ label: string; value: string }[]>([]);

  // 触发 onChange
  const triggerChange = useCallback(
    (addr: Partial<AddressInfo>) => {
      const newValue: AddressInfo = {
        province: addr.province ?? province,
        city: addr.city ?? city,
        district: addr.district ?? district,
        address: addr.address ?? detailAddress,
        lng: addr.lng ?? lng,
        lat: addr.lat ?? lat,
        formatted: `${addr.province ?? province}${addr.city ?? city}${addr.district ?? district}${addr.address ?? detailAddress}`,
      };
      onChange?.(newValue);
    },
    [province, city, district, detailAddress, lng, lat, onChange],
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
      if (status === 'complete' && result.districtList) {
        const provinces = result.districtList[0].districtList.map((d: any) => ({
          label: d.name,
          value: d.name,
          cityList: d.districtList,
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
          districtList: c.districtList,
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

  // 逆地理编码
  const reverseGeocode = useCallback(
    (longitude: number, latitude: number) => {
      if (!getAMap()) return;
      const AMap = getAMap()!;
      const geocoder = new AMap.Geocoder();

      geocoder.getAddress([longitude, latitude], (status: string, result: any) => {
        if (status === 'complete' && result.regeocode) {
          const addr = result.regeocode.addressComponent;
          if (addr.province && !province) setProvince(addr.province);
          if (addr.city && !city) setCity(addr.city.length > 0 ? addr.city : addr.province);
          if (addr.district && !district) setDistrict(addr.district);
          if (addr.street || addr.township) {
            const streetAddr = addr.township + (addr.street || '') + (addr.streetNumber || '');
            if (!detailAddress) setDetailAddress(streetAddr);
          }
        }
      });
    },
    [getAMap, province, city, district, detailAddress],
  );

  // 初始化地图
  useEffect(() => {
    if (!loaded || !mapRef.current || !getAMap() || mapInstance.current) return;

    const AMap = getAMap()!;
    const map = new AMap.Map(mapRef.current, {
      zoom: 15,
      center: lng && lat ? [lng, lat] : [116.397428, 39.90923],
      viewMode: '2D',
    });

    map.addControl(new AMap.Scale());
    map.addControl(new AMap.ToolBar({ position: 'RT' }));

    map.on('click', (e: any) => {
      if (disabled) return;
      const clickedLng = e.lnglat.lng;
      const clickedLat = e.lnglat.lat;
      setLng(clickedLng);
      setLat(clickedLat);

      if (markerInstance.current) {
        markerInstance.current.setPosition([clickedLng, clickedLat]);
      } else {
        markerInstance.current = new AMap.Marker({
          position: [clickedLng, clickedLat],
          draggable: true,
          cursor: 'move',
        });
        markerInstance.current.setMap(map);

        markerInstance.current.on('dragend', () => {
          const pos = markerInstance.current.getPosition();
          setLng(pos.lng);
          setLat(pos.lat);
          reverseGeocode(pos.lng, pos.lat);
        });
      }

      reverseGeocode(clickedLng, clickedLat);
    });

    mapInstance.current = map;

    return () => {
      map.destroy();
      mapInstance.current = null;
    };
  }, [loaded, getAMap, disabled, lng, lat, reverseGeocode]);

  // 搜索地址
  const handleSearch = useCallback(
    (keyword: string) => {
      if (!keyword.trim() || !getAMap()) return;
      setSearching(true);

      const AMap = getAMap()!;
      if (!placeSearchRef.current) {
        placeSearchRef.current = new AMap.PlaceSearch({
          pageSize: 10,
          pageIndex: 1,
        });
      }

      placeSearchRef.current.search(keyword, (status: string, result: any) => {
        setSearching(false);
        if (status === 'complete' && result.info === 'OK') {
          setSearchResults(result.poiList.pois || []);
          setShowResults(true);
        } else {
          setSearchResults([]);
          setShowResults(false);
        }
      });
    },
    [getAMap],
  );

  // 选择搜索结果
  const handleSelectSearchResult = (poi: any) => {
    const poiLng = poi.location?.lng || 0;
    const poiLat = poi.location?.lat || 0;

    setSearchKeyword(poi.name);
    setShowResults(false);

    if (mapInstance.current && poiLng && poiLat) {
      mapInstance.current.setZoomAndCenter(17, [poiLng, poiLat]);

      if (markerInstance.current) {
        markerInstance.current.setPosition([poiLng, poiLat]);
      } else {
        const AMap = getAMap()!;
        markerInstance.current = new AMap.Marker({
          position: [poiLng, poiLat],
          draggable: true,
        });
        markerInstance.current.setMap(mapInstance.current);
      }

      setLng(poiLng);
      setLat(poiLat);
    }

    triggerChange({
      province: poi.poi?.district?.split('省')[0] + '省' || province,
      city: poi.cityname || city,
      district: poi.adname || district,
      address: poi.address || detailAddress,
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
