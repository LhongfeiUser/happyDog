import request from '../request';
import type { ApiResponse, Service, PaginatedResponse } from '../../types';

// 获取服务列表
export const getServices = async (params?: {
  category?: string;
  page?: number;
  pageSize?: number;
}): Promise<ApiResponse<PaginatedResponse<Service>>> => {
  return request.get('/api/services', { params });
};

// 获取服务详情
export const getServiceById = async (serviceId: string): Promise<ApiResponse<Service>> => {
  return request.get(`/api/services/${serviceId}`);
};

// 获取推荐服务
export const getRecommendServices = async (limit?: number): Promise<ApiResponse<Service[]>> => {
  return request.get('/api/services/recommend/list', { params: { limit } });
};

// 获取服务分类
export const getServiceCategories = async (): Promise<ApiResponse<{ category: string; count: number; label: string }[]>> => {
  return request.get('/api/services/categories/list');
};
