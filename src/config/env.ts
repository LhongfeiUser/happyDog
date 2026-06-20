export const AMAP_KEY = import.meta.env.VITE_AMAP_KEY || '';
export const AMAP_SECURITY_KEY = import.meta.env.VITE_AMAP_SECURITY_KEY || '';

export const isGaodeMapEnabled = (): boolean => {
  return !!AMAP_KEY;
};
