// src/utils/merchant.ts
import type { Merchant } from '../types/merchant';

/** 默认营业时间 */
const DEFAULT_BUSINESS_HOURS = '09:00-21:00';

/**
 * 生成商家ID
 * @returns 唯一商家ID
 */
export const generateMerchantId = (): string => {
  return `merchant-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * 格式化金额（分转元）
 * @param price - 价格（分）
 * @returns 格式化后的价格字符串（元）
 * @throws 如果价格为负数
 */
export const formatPrice = (price: number): string => {
  if (price < 0) {
    throw new Error('价格不能为负数');
  }
  return (price / 100).toFixed(2);
};

/**
 * 解析金额（元转分）
 * @param price - 价格字符串（元）
 * @returns 价格（分）
 */
export const parsePrice = (price: string): number => {
  const parsed = parseFloat(price);
  if (isNaN(parsed) || parsed < 0) {
    throw new Error('无效的价格格式');
  }
  return Math.round(parsed * 100);
};

/**
 * 格式化营业时间
 * @param hours - 营业时间字符串
 * @returns 格式化后的营业时间
 */
export const formatBusinessHours = (hours: string): string => {
  return hours || DEFAULT_BUSINESS_HOURS;
};

/**
 * 商家状态信息
 */
interface MerchantStatusInfo {
  text: string;
  color: string;
}

/**
 * 获取商家状态信息（文本和颜色）
 * @param status - 商家状态
 * @returns 包含文本和颜色的状态信息
 */
export const getMerchantStatusInfo = (status: string): MerchantStatusInfo => {
  const statusMap: Record<string, MerchantStatusInfo> = {
    pending: { text: '审核中', color: 'orange' },
    approved: { text: '已认证', color: 'green' },
    rejected: { text: '已驳回', color: 'red' },
  };
  return statusMap[status] || { text: status, color: 'default' };
};

/**
 * 获取商家状态文本
 * @param status - 商家状态
 * @returns 状态文本
 */
export const getMerchantStatusText = (status: string): string => {
  return getMerchantStatusInfo(status).text;
};

/**
 * 获取商家状态颜色
 * @param status - 商家状态
 * @returns 状态颜色
 */
export const getMerchantStatusColor = (status: string): string => {
  return getMerchantStatusInfo(status).color;
};

/**
 * 检查商家是否已认证
 * @param merchant - 商家信息对象
 * @returns 是否已通过认证
 */
export const isMerchantApproved = (merchant: Merchant | null | undefined): boolean => {
  return merchant?.status === 'approved';
};