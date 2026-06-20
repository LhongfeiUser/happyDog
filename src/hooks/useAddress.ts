import { useCallback } from 'react';
import type { AddressInfo } from '../components/common/AddressPicker/types';

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
