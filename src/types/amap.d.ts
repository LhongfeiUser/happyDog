// 高德地图 JSAPI 类型声明
declare namespace AMap {
  interface LngLat {
    lng: number;
    lat: number;
    getLng(): number;
    getLat(): number;
  }

  interface AddressComponent {
    province: string;
    city: string;
    district: string;
    street: string;
    streetNumber: string;
    township: string;
  }

  interface Regeocode {
    addressComponent: AddressComponent;
  }

  interface Poi {
    id: string;
    name: string;
    address: string;
    location: LngLat;
    p?: string;
    c?: string;
    adname?: string;
    cityname?: string;
    province?: string;
    city?: string;
    district?: string;
  }

  interface PoiList {
    pois: Poi[];
  }

  interface SearchResult {
    info: string;
    poiList: PoiList;
  }

  class DistrictSearch {
    constructor(opts: { level: string; subdistrict: number; extensions: string });
    search(keyword: string, callback: (status: string, result: any) => void): void;
  }

  class Geocoder {
    constructor();
    getAddress(lnglat: number[], callback: (status: string, result: { regeocode: Regeocode }) => void): void;
  }

  class PlaceSearch {
    constructor(opts: { pageSize: number; pageIndex: number; city: string });
    search(keyword: string, callback: (status: string, result: SearchResult) => void): void;
  }

  class Marker {
    constructor(opts: { position: number[]; draggable: boolean; cursor: string });
    setMap(map: any): void;
    setPosition(pos: number[]): void;
    on(event: string, handler: () => void): void;
    getPosition(): LngLat;
  }

  class Scale {
    constructor();
  }

  class ToolBar {
    constructor(opts: { position: string });
  }

  class Map {
    constructor(container: string | HTMLElement, opts: { zoom: number; center: number[]; viewMode: string });
    addControl(control: Scale | ToolBar): void;
    on(event: string, handler: (e: any) => void): void;
    plugin(plugins: string[], callback: () => void): void;
    setCity(city: string): void;
    setZoomAndCenter(zoom: number, center: number[]): void;
    destroy(): void;
  }
}
