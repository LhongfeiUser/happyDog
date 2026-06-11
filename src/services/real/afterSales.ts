import request from '../request';
import type { ApiResponse, AfterSales, CreateAfterSalesRequest, PaginatedResponse } from '../../types';

// 提交售后申请
export const createAfterSales = async (data: CreateAfterSalesRequest): Promise<ApiResponse<AfterSales>> => {
  return request.post('/api/after-sales', data);
};

// 获取用户售后列表
export const getUserAfterSales = async (params?: {
  page?: number;
  pageSize?: number;
}): Promise<ApiResponse<PaginatedResponse<AfterSales>>> => {
  return request.get('/api/after-sales/user', { params });
};

// 获取售后详情
export const getAfterSalesById = async (afterSalesId: string): Promise<ApiResponse<AfterSales>> => {
  return request.get(`/api/after-sales/${afterSalesId}`);
};

// 取消售后申请
export const cancelAfterSales = async (afterSalesId: string): Promise<ApiResponse<AfterSales>> => {
  return request.put(`/api/after-sales/${afterSalesId}/cancel`);
};
