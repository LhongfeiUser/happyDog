import axios from 'axios';
import type { StatisticsData } from '../../types';

// 创建axios实例
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 统一处理错误
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || '请求失败';
    return Promise.reject(new Error(message));
  }
);

/**
 * 获取统计数据
 */
export const getStatistics = async (): Promise<StatisticsData> => {
  const response = await api.get<{ code: number; data: StatisticsData; message: string }>('/statistics');

  if (response.code === 0 || response.code === 200) {
    return response.data;
  }

  throw new Error(response.message || '获取统计数据失败');
};

/**
 * 获取月度订单趋势
 */
export const getMonthlyTrend = async (): Promise<StatisticsData['monthlyTrend']> => {
  const response = await api.get<{ code: number; data: StatisticsData['monthlyTrend']; message: string }>('/statistics/monthly-trend');

  if (response.code === 0 || response.code === 200) {
    return response.data;
  }

  throw new Error(response.message || '获取月度趋势失败');
};

/**
 * 获取服务分类统计
 */
export const getServiceCategories = async (): Promise<StatisticsData['serviceCategories']> => {
  const response = await api.get<{ code: number; data: StatisticsData['serviceCategories']; message: string }>('/statistics/service-categories');

  if (response.code === 0 || response.code === 200) {
    return response.data;
  }

  throw new Error(response.message || '获取服务分类统计失败');
};

/**
 * 获取热门服务排行
 */
export const getTopServices = async (limit: number = 6): Promise<StatisticsData['topServices']> => {
  const response = await api.get<{ code: number; data: StatisticsData['topServices']; message: string }>('/statistics/top-services', {
    params: { limit },
  });

  if (response.code === 0 || response.code === 200) {
    return response.data;
  }

  throw new Error(response.message || '获取热门服务排行失败');
};

/**
 * 获取用户分析数据
 */
export const getUserAnalysis = async (): Promise<StatisticsData['userAnalysis']> => {
  const response = await api.get<{ code: number; data: StatisticsData['userAnalysis']; message: string }>('/statistics/user-analysis');

  if (response.code === 0 || response.code === 200) {
    return response.data;
  }

  throw new Error(response.message || '获取用户分析失败');
};

/**
 * 获取评分分布
 */
export const getRatingDistribution = async (): Promise<StatisticsData['ratingDistribution']> => {
  const response = await api.get<{ code: number; data: StatisticsData['ratingDistribution']; message: string }>('/statistics/rating-distribution');

  if (response.code === 0 || response.code === 200) {
    return response.data;
  }

  throw new Error(response.message || '获取评分分布失败');
};

/**
 * 获取宠物类型分布
 */
export const getPetTypes = async (): Promise<StatisticsData['petTypes']> => {
  const response = await api.get<{ code: number; data: StatisticsData['petTypes']; message: string }>('/statistics/pet-types');

  if (response.code === 0 || response.code === 200) {
    return response.data;
  }

  throw new Error(response.message || '获取宠物类型分布失败');
};

/**
 * 获取服务时段分析
 */
export const getTimeSlots = async (): Promise<StatisticsData['timeSlots']> => {
  const response = await api.get<{ code: number; data: StatisticsData['timeSlots']; message: string }>('/statistics/time-slots');

  if (response.code === 0 || response.code === 200) {
    return response.data;
  }

  throw new Error(response.message || '获取服务时段分析失败');
};

export default api;
