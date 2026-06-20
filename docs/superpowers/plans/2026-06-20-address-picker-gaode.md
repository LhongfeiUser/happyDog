# 高德地图地址选择集成计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 将现有纯文本地址输入替换为高德地图地址选择器，支持省市区级联选择+地图选点+详细地址输入，提升下单和商家入驻体验。

**架构：** 安装 `@amap/amap-jsapi-loader` 和 `react-amap`（或手动封装高德 JSAPI），创建可复用的 `AddressPicker` 组件。该组件包含：① 省市区三级级联选择（高德 DistrictSearch）；② 地图选点（鼠标/搜索标记）；③ 详细地址文本输入。后端 address 字段改为结构化存储（省市区+详细地址+经纬度），同时保持向后兼容旧的纯字符串格式。

**技术栈：** 高德地图 JSAPI 2.0、@amap/amap-jsapi-loader、React 19、Ant Design 6、TypeScript

---

## 文件结构

### 新建文件

| 文件路径 | 职责 |
|----------|------|
| `src/components/common/AddressPicker/index.tsx` | 地址选择器主组件（级联选择+地图+详细地址） |
| `src/components/common/AddressPicker/index.css` | 组件样式 |
| `src/components/common/AddressPicker/types.ts` | 地址选择器 TypeScript 类型定义 |
| `src/components/common/AddressPicker/useGaodeMap.ts` | 高德地图初始化、插件加载 Hook |
| `src/components/common/AddressPicker/AddressDisplay.tsx` | 地址展示组件（只读，带地图预览小图标） |
| `src/hooks/useAddress.ts` | 地址格式化、解析工具 Hook |

### 修改文件

| 文件路径 | 变更范围 | 变更内容 |
|----------|----------|----------|
| `src/types/index.ts` | `Order`、`CreateOrderRequest` | address 结构化为 `AddressInfo` |
| `src/types/merchant.ts` | `Merchant`、`MerchantRegisterRequest` | address 结构化为 `AddressInfo` |
| `src/pages/Services/Detail.tsx` | 下单表单区域 | 替换 Input 为 AddressPicker |
| `src/pages/Merchant/Auth/Register.tsx` | 店铺地址字段（Step 1） | 替换 Input 为 AddressPicker |
| `src/pages/Merchant/Settings/ContactInfoForm.tsx` | 店铺地址字段 | 替换 Input 为 AddressPicker |
| `src/pages/Orders/Detail.tsx` | 地址展示 | 使用 AddressDisplay 组件 |
| `src/components/business/OrderItem.tsx` | 地址展示 | 使用 AddressDisplay 组件 |
| `src/pages/Merchant/Orders/OrderDetail.tsx` | 地址展示 | 使用 AddressDisplay 组件 |
| `server/index.js` | 订单创建/更新、商家注册/更新 | 支持结构化 address 存储 + 向后兼容 |
| `.env` / `.env.development` | 根目录 | 添加高德 Key |

---

## 数据模型变更

### 新增 AddressInfo 类型

```typescript
// src/components/common/AddressPicker/types.ts

export interface AddressInfo {
  province: string;       // 省/直辖市，如 "北京市"
  city: string;           // 市，如 "北京市"（直辖市时与省相同）
  district: string;       // 区/县，如 "朝阳区"
  address: string;        // 详细地址，如 "宠物街88号A座301"
  lng: number;            // 经度
  lat: number;            // 纬度
  formatted: string;      // 完整格式化地址，如 "北京市朝阳区宠物街88号A座301"
}

// 向后兼容：旧数据可能是纯字符串，新数据是 AddressInfo
export type AddressInput = AddressInfo | string;
```

### 数据库存储变更（server/index.js）

订单和商家表中的 `address` 字段改为对象：

```js
// 旧: address: '北京市朝阳区宠物街88号'
// 新:
address: {
  province: '北京市',
  city: '北京市',
  district: '朝阳区',
  address: '宠物街88号A座301',
  lng: 116.48,
  lat: 39.99,
  formatted: '北京市朝阳区宠物街88号A座301'
}
```

向后兼容逻辑：读取时如果 address 是字符串，格式化为 AddressInfo；写入时同时保存 formatted 字符串到旧字段。

---

## 任务

### 任务 1：项目配置 — 安装高德地图依赖 + 环境变量

**文件：**
- 修改：`package.json`（新增依赖）
- 创建：`.env.development`
- 创建：`.env.example`
- 修改：`src/config/env.ts`（新建，环境变量统一管理）

- [ ] **步骤 1：安装高德地图 npm 依赖**

```bash
npm install @amap/amap-jsapi-loader --save
```

- [ ] **步骤 2：创建环境变量文件**

创建 `.env.development`：
```
VITE_AMAP_KEY=你的高德Web服务API Key
VITE_AMAP_SECURITY_KEY=你的安全密钥（可选，用于安全模式）
VITE_AMAP_JSAPI_LOADER_VERSION=2.0
```

创建 `.env.example`（模板，不含真实值）：
```
# 高德地图 API Key（Web服务API类型）
# 申请地址：https://console.amap.com/dev/key/app
VITE_AMAP_KEY=

# 安全密钥（可选，使用安全模式加载JSAPI时需要）
VITE_AMAP_SECURITY_KEY=
```

- [ ] **步骤 3：创建环境变量管理模块**

创建 `src/config/env.ts`：
```typescript
export const AMAP_KEY = import.meta.env.VITE_AMAP_KEY || '';
export const AMAP_SECURITY_KEY = import.meta.env.VITE_SECURITY_KEY || '';

export const isGaodeMapEnabled = (): boolean => {
  return !!AMAP_KEY;
};
```

- [ ] **步骤 4：验证安装**

```bash
npm list @amap/amap-jsapi-loader
```

预期：输出 `@amap/amap-jsapi-loader@x.x.x`

- [ ] **步骤 5：Commit**

```bash
git add package.json package-lock.json .env.example .env.development src/config/env.ts
git commit -m "feat: add amap dependency and environment config"
```

---

### 任务 2：类型定义 — AddressInfo 接口

**文件：**
- 创建：`src/components/common/AddressPicker/types.ts`
- 修改：`src/types/index.ts`（Order、CreateOrderRequest 的 address 字段）
- 修改：`src/types/merchant.ts`（Merchant、MerchantRegisterRequest 的 address 字段）

- [ ] **步骤 1：创建地址选择器类型定义**

创建 `src/components/common/AddressPicker/types.ts`：
```typescript
import type { AddressInfo as AddressInfoType } from './types';

// 结构化地址信息
export interface AddressInfo {
  province: string;
  city: string;
  district: string;
  address: string;
  lng: number;
  lat: number;
  formatted: string;
}

// 地址选择结果（用户选择后返回的数据）
export interface AddressSelectResult extends AddressInfo {}

// AddressPicker 组件 Props
export interface AddressPickerProps {
  value?: AddressInfo;
  onChange?: (value: AddressInfo) => void;
  placeholder?: string;
  disabled?: boolean;
  showMap?: boolean;       // 是否显示地图选点，默认 true
  mapHeight?: number;      // 地图高度，默认 250
  className?: string;
}

// 地址展示组件 Props
export interface AddressDisplayProps {
  value?: AddressInfo | string;
  showIcon?: boolean;      // 是否显示定位图标，默认 true
  short?: boolean;         // 是否只显示到区级，默认 false
  className?: string;
}
```

- [ ] **步骤 2：更新 Order 类型**

修改 `src/types/index.ts`，在文件顶部导入 AddressInfo，然后修改相关接口：

```typescript
import type { AddressInfo } from '@/components/common/AddressPicker/types';

// CreateOrderRequest 中的 address 改为 AddressInfo
export interface CreateOrderRequest {
  serviceId: string;
  petId: string;
  appointmentDate: string;
  appointmentTime: string;
  contactPhone: string;
  address: AddressInfo;        // 原来是 string
  remark?: string;
}

// Order 中的 address 改为 AddressInfo（向后兼容）
export interface Order {
  // ... 其他字段不变
  address: AddressInfo | string;  // 兼容新旧数据
  // ...
}
```

- [ ] **步骤 3：更新 Merchant 类型**

修改 `src/types/merchant.ts`：

```typescript
import type { AddressInfo } from '@/components/common/AddressPicker/types';

export interface Merchant {
  // ... 其他字段不变
  address: AddressInfo | string;  // 兼容新旧数据
  // ...
}

export interface MerchantRegisterRequest {
  // ... 其他字段不变
  address: AddressInfo;        // 原来是 string
  // ...
}
```

- [ ] **步骤 4：验证 TypeScript 编译**

```bash
npx tsc --noEmit
```

预期：无新增类型错误（预存错误忽略）

- [ ] **步骤 5：Commit**

```bash
git add src/components/common/AddressPicker/types.ts src/types/index.ts src/types/merchant.ts
git commit -m "feat: add AddressInfo type and update Order/Merchant interfaces"
```

---

### 任务 3：工具 Hook — 地址初始化和格式化工具

**文件：**
- 创建：`src/components/common/AddressPicker/useGaodeMap.ts`
- 创建：`src/hooks/useAddress.ts`

- [ ] **步骤 1：创建高德地图 Hook**

创建 `src/components/common/AddressPicker/useGaodeMap.ts`：

```typescript
import { useEffect, useState, useCallback } from 'react';
import AMapLoader from '@amap/amap-jsapi-loader';
import { AMAP_KEY, AMAP_SECURITY_KEY, isGaodeMapEnabled } from '@/config/env';

let AMapInstance: typeof AMap | null = null;

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
        'AMap.PlaceSearch',
        'AMap.AutoComplete',
        'AMap.MouseTool',
      ],
      Loca: {
        version: '2.0.0',
      },
    })
      .then((AMap) => {
        AMapInstance = AMap;
        // 安全模式
        if (AMAP_SECURITY_KEY) {
          window._AMapSecurityConfig = {
            securityJsCode: AMAP_SECURITY_KEY,
          };
        }
        setLoaded(true);
      })
      .catch((err) => {
        setError(err.message || '高德地图加载失败');
      });
  }, []);

  const getAMap = useCallback(() => AMapInstance, []);

  return { loaded, error, getAMap };
};
```

- [ ] **步骤 2：创建地址工具 Hook**

创建 `src/hooks/useAddress.ts`：

```typescript
import { useCallback } from 'react';
import type { AddressInfo } from '@/components/common/AddressPicker/types';

/**
 * 地址格式化工具
 * - 将 AddressInfo 格式化为展示字符串
 * - 将旧格式字符串解析为 AddressInfo
 */
export const useAddress = () => {
  /** 格式化地址为展示字符串 */
  const format = useCallback((address: AddressInfo | string | undefined | null): string => {
    if (!address) return '';
    if (typeof address === 'string') return address;
    return address.formatted || `${address.province}${address.city}${address.district}${address.address}`;
  }, []);

  /** 获取简短地址（到区级） */
  const formatShort = useCallback((address: AddressInfo | string | undefined | null): string => {
    if (!address) return '';
    if (typeof address === 'string') return address;
    return `${address.province}${address.city}${address.district}`;
  }, []);

  /** 将旧字符串地址解析为 AddressInfo（降级处理） */
  const parse = useCallback((address: string): AddressInfo => {
    return {
      province: '',
      city: '',
      district: '',
      address,
      lng: 0,
      lat: 0,
      formatted: address,
    };
  }, []);

  /** 确保地址是结构化格式 */
  const ensureAddressInfo = useCallback((address: AddressInfo | string | undefined | null): AddressInfo | undefined => {
    if (!address) return undefined;
    if (typeof address === 'object') return address;
    return parse(address);
  }, [parse]);

  return { format, formatShort, parse, ensureAddressInfo };
};
```

- [ ] **步骤 3：Commit**

```bash
git add src/components/common/AddressPicker/useGaodeMap.ts src/hooks/useAddress.ts
git commit -m "feat: add gaode map loader hook and address utils"
```

---

### 任务 4：核心组件 — AddressPicker 地址选择器

**文件：**
- 创建：`src/components/common/AddressPicker/index.tsx`
- 创建：`src/components/common/AddressPicker/index.css`

- [ ] **步骤 1：创建组件样式**

创建 `src/components/common/AddressPicker/index.css`：

```css
.address-picker-wrapper {
  width: 100%;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  overflow: hidden;
  transition: border-color 0.3s;
}

.address-picker-wrapper:hover {
  border-color: #FF6B35;
}

.address-picker-wrapper.address-picker-focused {
  border-color: #FF6B35;
  box-shadow: 0 0 0 2px rgba(255, 107, 53, 0.1);
}

.address-picker-row {
  display: flex;
  gap: 8px;
  padding: 8px;
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
}

.address-picker-detail {
  padding: 8px;
}

.address-picker-detail-input {
  border-radius: 6px !important;
}

.address-picker-map {
  width: 100%;
  border-top: 1px solid #f0f0f0;
}

.address-picker-search {
  padding: 8px;
  border-bottom: 1px solid #f0f0f0;
  background: #fff;
}

.address-picker-search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 0 0 8px 8px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1050;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.address-picker-search-item {
  padding: 8px 12px;
  cursor: pointer;
  transition: background 0.2s;
}

.address-picker-search-item:hover {
  background: #fff8f0;
}

.address-picker-tip {
  padding: 4px 8px;
  font-size: 12px;
  color: #8c8c8c;
}
```

- [ ] **步骤 2：创建 AddressPicker 主组件**

创建 `src/components/common/AddressPicker/index.tsx`：

```tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Select, Input, Spin, message, Tooltip } from 'antd';
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
  const autoCompleteRef = useRef<any>(null);

  // 省市区数据
  const [provinceOptions, setProvinceOptions] = useState<{ label: string; value: string }[]>([]);
  const [cityOptions, setCityOptions] = useState<{ label: string; value: string }[]>([]);
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

  // 省份变化 → 加载城市
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

  // 城市变化 → 加载区县
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

    // 地图定位到该区域
    if (mapInstance.current && getAMap()) {
      const AMap = getAMap()!;
      mapInstance.current.setCity(val);
    }
  };

  // 初始化地图
  useEffect(() => {
    if (!loaded || !mapRef.current || !getAMap() || mapInstance.current) return;

    const AMap = getAMap()!;
    const map = new AMap.Map(mapRef.current, {
      zoom: 15,
      center: lng && lat ? [lng, lat] : [116.397428, 39.90923], // 默认北京
      viewMode: '2D',
    });

    // 添加缩放控件
    map.addControl(new AMap.Scale());
    map.addControl(new AMap.ToolBar({ position: 'RT' }));

    // 点击地图选点
    map.on('click', (e: any) => {
      if (disabled) return;
      const clickedLng = e.lnglat.lng;
      const clickedLat = e.lnglat.lat;
      setLng(clickedLng);
      setLat(clickedLat);

      // 更新标记
      if (markerInstance.current) {
        markerInstance.current.setPosition([clickedLng, clickedLat]);
      } else {
        markerInstance.current = new AMap.Marker({
          position: [clickedLng, clickedLat],
          draggable: true,
          cursor: 'move',
        });
        markerInstance.current.setMap(map);

        // 拖拽结束
        markerInstance.current.on('dragend', (dragEvent: any) => {
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
  }, [loaded, getAMap, disabled]);

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

    // 定位到搜索结果
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
      province: poi.poi.district?.split('省')[0] + '省' || province,
      city: poi.cityname || city,
      district: poi.adname || district,
      address: poi.address || detailAddress,
      lng: poiLng,
      lat: poiLat,
    });
  };

  // 错误状态
  if (error) {
    return (
      <div className={`address-picker-wrapper ${className || ''}`} style={{ padding: 12 }}>
        <Input
          prefix={<EnvironmentOutlined />}
          value={value?.address || ''}
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
      <div className="address-picker-search" style={{ position: 'relative' }}>
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
          className="address-picker-detail-input"
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
```

- [ ] **步骤 3：验证组件渲染**

启动开发服务器：
```bash
npm run dev
```

手动访问包含地址输入的页面，确认组件正常渲染（不报错即可，地图因缺少 Key 可能显示降级状态）。

- [ ] **步骤 4：Commit**

```bash
git add src/components/common/AddressPicker/
git commit -m "feat: add AddressPicker component with gaode map integration"
```

---

### 任务 5：地址展示组件 — AddressDisplay

**文件：**
- 创建：`src/components/common/AddressPicker/AddressDisplay.tsx`

- [ ] **步骤 1：创建 AddressDisplay 组件**

创建 `src/components/common/AddressPicker/AddressDisplay.tsx`：

```tsx
import React from 'react';
import { Tooltip } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
import type { AddressDisplayProps } from './types';
import { useAddress } from '@/hooks/useAddress';

const AddressDisplay: React.FC<AddressDisplayProps> = ({
  value,
  showIcon = true,
  short = false,
  className,
}) => {
  const { format, formatShort, ensureAddressInfo } = useAddress();

  if (!value) return <span className={className}>—</span>;

  const addrInfo = ensureAddressInfo(value);
  const displayText = short ? formatShort(value) : format(value);

  // 有坐标时显示经纬度 tooltip
  if (addrInfo?.lng && addrInfo?.lat) {
    return (
      <span className={className}>
        {showIcon && <EnvironmentOutlined style={{ marginRight: 4, color: '#FF6B35' }} />}
        <Tooltip title={`坐标: ${addrInfo.lng.toFixed(6)}, ${addrInfo.lat.toFixed(6)}`}>
          {displayText}
        </Tooltip>
      </span>
    );
  }

  return (
    <span className={className}>
      {showIcon && <EnvironmentOutlined style={{ marginRight: 4, color: '#FF6B35' }} />}
      {displayText}
    </span>
  );
};

export default AddressDisplay;
```

- [ ] **步骤 2：Commit**

```bash
git add src/components/common/AddressPicker/AddressDisplay.tsx
git commit -m "feat: add AddressDisplay component for read-only address display"
```

---

### 任务 6：后端改造 — 支持结构化地址存储

**文件：**
- 修改：`server/index.js`

- [ ] **步骤 1：添加地址格式化辅助函数**

在 `server/index.js` 顶部（现有 helper 附近）添加：

```js
// 地址格式化：确保 address 始终是结构化对象
function normalizeAddress(addr) {
  if (!addr) return null;
  if (typeof addr === 'string') {
    return {
      province: '',
      city: '',
      district: '',
      address: addr,
      lng: 0,
      lat: 0,
      formatted: addr,
    };
  }
  return {
    province: addr.province || '',
    city: addr.city || '',
    district: addr.district || '',
    address: addr.address || '',
    lng: addr.lng || 0,
    lat: addr.lat || 0,
    formatted: addr.formatted || `${addr.province || ''}${addr.city || ''}${addr.district || ''}${addr.address || ''}`,
  };
}
```

- [ ] **步骤 2：修改订单创建接口**

在 `POST /api/orders` 路由中（约第 680 行），找到：
```js
address: req.body.address || '',
```
替换为：
```js
address: normalizeAddress(req.body.address),
```

- [ ] **步骤 3：修改订单详情返回**

在订单返回前，确保 `normalizeAddress` 被应用到所有返回订单的查询中。找到所有 `order.address` 返回位置，确保返回的是完整对象（含 formatted 字段供前端直接展示）。

在 `GET /api/orders/:id` 返回前添加：
```js
order.address = normalizeAddress(order.address);
```

对订单列表 `GET /api/orders` 同样处理：
```js
orders = orders.map(o => ({ ...o, address: normalizeAddress(o.address) }));
```

- [ ] **步骤 4：修改商家注册接口**

在 `POST /api/merchant/auth/register` 中，找到 address 字段处理：
```js
address: normalizeAddress(req.body.address || req.body.address || ''),
```

- [ ] **步骤 5：修改商家信息更新接口**

在 `PUT /api/merchant/info` 中，找到 address 更新逻辑：
```js
if (req.body.address) {
  merchant.address = normalizeAddress(req.body.address);
}
```

- [ ] **步骤 6：验证后端接口**

```bash
cd server && npm start
# 测试创建订单
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"serviceId":"1","petId":"1","appointmentDate":"2026-06-21","appointmentTime":"10:00","contactPhone":"13800138000","address":{"province":"北京市","city":"北京市","district":"朝阳区","address":"宠物街88号","lng":116.48,"lat":39.99}}'
```

预期：返回的 order.address 是完整结构化的对象。

- [ ] **步骤 7：Commit**

```bash
git add server/index.js
git commit -m "refactor: backend supports structured address storage with backward compatibility"
```

---

### 任务 7：前端集成 — Services/Detail 下单页

**文件：**
- 修改：`src/pages/Services/Detail.tsx`

- [ ] **步骤 1：导入 AddressPicker**

在文件顶部添加：
```typescript
import AddressPicker from '@/components/common/AddressPicker';
import type { AddressInfo } from '@/components/common/AddressPicker/types';
```

- [ ] **步骤 2：替换地址输入框**

在下单 Modal 的 Form 中，找到：
```tsx
<Form.Item
  name="address"
  label="服务地址"
  rules={[{ required: true, message: '请输入服务地址' }]}
>
  <Input prefix={<EnvironmentOutlined />} placeholder="请输入服务地址" />
</Form.Item>
```

替换为：
```tsx
<Form.Item
  name="address"
  label="服务地址"
  rules={[
    { required: true, message: '请选择地址' },
    {
      validator: (_, value) => {
        if (value && typeof value === 'object' && !value.address) {
          return Promise.reject('请输入详细地址');
        }
        return Promise.resolve();
      },
    },
  ]}
>
  <AddressPicker placeholder="请选择服务地址" />
</Form.Item>
```

- [ ] **步骤 3：更新提交逻辑**

在 `handleOk` 函数中，确认 `values.address` 已经是 `AddressInfo` 对象。如果 AddressPicker 的值正确传递，无需额外修改。验证 `createOrderAsync` 能正确发送结构化数据。

- [ ] **步骤 4：Commit**

```bash
git add src/pages/Services/Detail.tsx
git commit -m "feat: integrate AddressPicker into order creation form"
```

---

### 任务 8：前端集成 — 商家注册页

**文件：**
- 修改：`src/pages/Merchant/Auth/Register.tsx`

- [ ] **步骤 1：导入 AddressPicker**

```typescript
import AddressPicker from '@/components/common/AddressPicker';
```

- [ ] **步骤 2：替换地址输入框**

在 Step 1 的表单中，找到店铺地址的 `Form.Item`：
```tsx
<Form.Item name="address" label="店铺地址" rules={requiredValidationRules}>
  <Input prefix={<EnvironmentOutlined style={{ color: '#FFB74D' }} />} placeholder="请输入详细地址" style={{ borderRadius: 12 }} />
</Form.Item>
```

替换为：
```tsx
<Form.Item
  name="address"
  label="店铺地址"
  rules={[
    { required: true, message: '请选择店铺地址' },
    {
      validator: (_, value) => {
        if (value && typeof value === 'object' && (!value.address || !value.province)) {
          return Promise.reject('请选择省市区并输入详细地址');
        }
        return Promise.resolve();
      },
    },
  ]}
>
  <AddressPicker placeholder="请选择店铺地址" />
</Form.Item>
```

- [ ] **步骤 3：更新预览 Step 3**

在预览区域，将 address 显示改为：
```tsx
{ label: '店铺地址', value: formData.address?.formatted || formData.address, icon: <EnvironmentOutlined /> }
```

- [ ] **步骤 4：Commit**

```bash
git add src/pages/Merchant/Auth/Register.tsx
git commit -m "feat: integrate AddressPicker into merchant registration form"
```

---

### 任务 9：前端集成 — 商家设置页

**文件：**
- 修改：`src/pages/Merchant/Settings/ContactInfoForm.tsx`

- [ ] **步骤 1：导入 AddressPicker**

```typescript
import AddressPicker from '@/components/common/AddressPicker';
```

- [ ] **步骤 2：替换地址输入框**

找到：
```tsx
<Form.Item
  name="address"
  label="店铺地址"
  rules={[
    { required: true, message: '请输入店铺地址' },
    { min: 5, max: 100, message: '店铺地址长度为5-100字符' },
  ]}
>
  <Input prefix={<EnvironmentOutlined />} placeholder="请输入店铺地址" size="large" style={{ borderRadius: 8 }} />
</Form.Item>
```

替换为：
```tsx
<Form.Item
  name="address"
  label="店铺地址"
  rules={[
    { required: true, message: '请选择店铺地址' },
    {
      validator: (_, value) => {
        if (value && typeof value === 'object' && (!value.address || !value.province)) {
          return Promise.reject('请选择省市区并输入详细地址');
        }
        return Promise.resolve();
      },
    },
  ]}
>
  <AddressPicker placeholder="请选择店铺地址" />
</Form.Item>
```

- [ ] **步骤 3：Commit**

```bash
git add src/pages/Merchant/Settings/ContactInfoForm.tsx
git commit -m "feat: integrate AddressPicker into merchant settings contact form"
```

---

### 任务 10：地址展示 — 订单详情/列表页面

**文件：**
- 修改：`src/pages/Orders/Detail.tsx`
- 修改：`src/components/business/OrderItem.tsx`
- 修改：`src/pages/Merchant/Orders/OrderDetail.tsx`

- [ ] **步骤 1：修改订单详情页（C端）**

修改 `src/pages/Orders/Detail.tsx`：

```typescript
import AddressDisplay from '@/components/common/AddressPicker/AddressDisplay';
```

找到地址展示位置：
```tsx
<Descriptions.Item label="服务地址" span={2}>{currentOrder.address}</Descriptions.Item>
```

替换为：
```tsx
<Descriptions.Item label="服务地址" span={2}>
  <AddressDisplay value={currentOrder.address} />
</Descriptions.Item>
```

- [ ] **步骤 2：修改订单列表项组件**

修改 `src/components/business/OrderItem.tsx`：

```typescript
import AddressDisplay from '@/components/common/AddressPicker/AddressDisplay';
```

找到：
```tsx
<Text type="secondary">地址：{order.address}</Text>
```

替换为：
```tsx
<Text type="secondary">地址：<AddressDisplay value={order.address} short /></Text>
```

- [ ] **步骤 3：修改订单详情页（商家端）**

修改 `src/pages/Merchant/Orders/OrderDetail.tsx`：

```typescript
import AddressDisplay from '@/components/common/AddressPicker/AddressDisplay';
```

找到：
```tsx
<HomeOutlined /> 服务地址：{order.address}
```

替换为：
```tsx
<HomeOutlined /> 服务地址：<AddressDisplay value={order.address} showIcon={false} />
```

- [ ] **步骤 4：Commit**

```bash
git add src/pages/Orders/Detail.tsx src/components/business/OrderItem.tsx src/pages/Merchant/Orders/OrderDetail.tsx
git commit -m "feat: use AddressDisplay in order detail and list pages"
```

---

### 任务 11：清理旧代码 + 验证全流程

**文件：**
- 检查：所有地址输入处已替换为 AddressPicker

- [ ] **步骤 1：全局搜索剩余的纯文本地址 Input**

```bash
# 搜索 Services/Detail、Register、ContactInfoForm 中是否还有原始 Input + EnvironmentOutlined 的地址输入
grep -n "EnvironmentOutlined" src/pages/Services/Detail.tsx src/pages/Merchant/Auth/Register.tsx src/pages/Merchant/Settings/ContactInfoForm.tsx
```

预期：所有地址相关的 EnvironmentOutlined 都已被 AddressPicker 替代。

- [ ] **步骤 2：启动完整项目验证**

```bash
# 终端1：启动后端
cd server && npm start

# 终端2：前端
npm run dev
```

验证清单：
- [ ] 首页 → 服务详情 → 点击预约 → 地址选择器正常显示（省市区级联 + 地图）
- [ ] 地图点击选点 → 坐标自动填充
- [ ] 搜索地点 → 选择搜索结果 → 地图定位
- [ ] 提交订单 → 订单详情页地址正确展示
- [ ] 商家注册 → 地址选择器正常
- [ ] 商家设置页 → 地址编辑正常

- [ ] **步骤 3：最终 Commit**

```bash
git add -A
git commit -m "chore: verify full address picker integration across all pages"
```

---

## 执行顺序建议

```
任务 1（依赖安装）
  ↓
任务 2（类型定义）
  ↓
任务 3（工具 Hook）
  ↓
任务 4（AddressPicker 组件）← 核心
  ↓
任务 5（AddressDisplay 组件）
  ↓
任务 6（后端改造）
  ↓
任务 7 + 8 + 9（前端集成，可并行）
  ↓
任务 10（地址展示集成）
  ↓
任务 11（验证清理）
```

---

## 注意事项

1. **高德 Key 申请**：需要在 [高德开放平台](https://console.amap.com/dev/key/app) 注册并创建 Web 服务 API Key
2. **安全密钥**：如果网站域名限制了 Referer，可以不配置安全模式
3. **降级处理**：高德地图加载失败时，组件自动降级为纯文本 Input
4. **向后兼容**：旧数据中的地址字符串在展示时自动包装为 AddressInfo
5. **TypeScript 版本**：项目使用 TS 6，确保类型导入使用 `import type` 语法