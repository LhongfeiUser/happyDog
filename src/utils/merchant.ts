// src/utils/merchant.ts
import dayjs from 'dayjs';

// 生成商家ID
export const generateMerchantId = (): string => {
  return `merchant-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// 格式化金额（分转元）
export const formatPrice = (price: number): string => {
  return (price / 100).toFixed(2);
};

// 解析金额（元转分）
export const parsePrice = (price: string): number => {
  return Math.round(parseFloat(price) * 100);
};

// 格式化营业时间
export const formatBusinessHours = (hours: string): string => {
  return hours || '09:00-21:00';
};

// 获取商家状态文本
export const getMerchantStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    pending: '审核中',
    approved: '已认证',
    rejected: '已驳回',
  };
  return statusMap[status] || status;
};

// 获取商家状态颜色
export const getMerchantStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    pending: 'orange',
    approved: 'green',
    rejected: 'red',
  };
  return colorMap[status] || 'default';
};

// 检查商家是否已认证
export const isMerchantApproved = (merchant: any): boolean => {
  return merchant?.status === 'approved';
};