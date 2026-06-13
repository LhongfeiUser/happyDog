import request from '../request';
import type { ApiResponse, MerchantService, PaginatedResponse } from '../../types';

// 获取商家服务列表
export const getList = async (params: {
  page?: number;
  pageSize?: number;
  category?: string;
  status?: string;
}): Promise<ApiResponse<PaginatedResponse<MerchantService>>> => {
  return request.get('/api/merchant/services', { params });
};

// 创建服务
export const create = async (data: Omit<MerchantService, 'id' | 'merchantId' | 'rating' | 'salesCount' | 'auditStatus' | 'auditReason' | 'createTime' | 'updateTime'>): Promise<ApiResponse<MerchantService>> => {
  return request.post('/api/merchant/services', data);
};

// 更新服务
export const update = async (id: string, data: Partial<MerchantService>): Promise<ApiResponse<MerchantService>> => {
  return request.put(`/api/merchant/services/${id}`, data);
};

// 删除服务
export const deleteService = async (id: string): Promise<ApiResponse<null>> => {
  return request.delete(`/api/merchant/services/${id}`);
};

// 更新服务状态
export const updateStatus = async (id: string, status: 'active' | 'inactive'): Promise<ApiResponse<MerchantService>> => {
  return request.patch(`/api/merchant/services/${id}/status`, { status });
};
