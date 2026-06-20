// 结构化地址信息
export interface AddressInfo {
  province: string;       // 省/直辖市，如 "北京市"
  city: string;           // 市，如 "北京市"（直辖市时与省相同）
  district: string;       // 区/县，如 "朝阳区"
  address: string;        // 详细地址，如 "宠物街88号A座301"
  lng: number;            // 经度
  lat: number;            // 纬度
  formatted: string;      // 完整格式化地址
}

// 地址选择结果
export type AddressSelectResult = AddressInfo;

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
  showIcon?: boolean;
  short?: boolean;
  className?: string;
}
