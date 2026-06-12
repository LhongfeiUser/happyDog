import request from '../request';
import type { ApiResponse, StatisticsData } from '../../types';

/**
 * 获取统计数据
 */
export const getStatistics = async (): Promise<ApiResponse<StatisticsData>> => {
  return request.get('/api/statistics');
};
