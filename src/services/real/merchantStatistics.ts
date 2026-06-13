import request from '../request';
import type { ApiResponse, MerchantStatistics } from '../../types';

// 获取商家统计数据
export const getData = async (params?: {
  startDate?: string;
  endDate?: string;
}): Promise<ApiResponse<MerchantStatistics>> => {
  return request.get('/api/merchant/statistics', { params });
};
