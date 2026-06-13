import request from '../request';
import type { ApiResponse, Order, PaginatedResponse, OrderStatus } from '../../types';

// 获取商家订单列表
export const getList = async (params: {
  page?: number;
  pageSize?: number;
  status?: OrderStatus;
  startDate?: string;
  endDate?: string;
}): Promise<ApiResponse<PaginatedResponse<Order>>> => {
  return request.get('/api/merchant/orders', { params });
};

// 接受订单
export const accept = async (id: string): Promise<ApiResponse<Order>> => {
  return request.post(`/api/merchant/orders/${id}/accept`);
};

// 拒绝订单
export const reject = async (id: string, reason: string): Promise<ApiResponse<Order>> => {
  return request.post(`/api/merchant/orders/${id}/reject`, { reason });
};

// 开始服务
export const startService = async (id: string): Promise<ApiResponse<Order>> => {
  return request.post(`/api/merchant/orders/${id}/start`);
};

// 完成服务
export const completeService = async (id: string): Promise<ApiResponse<Order>> => {
  return request.post(`/api/merchant/orders/${id}/complete`);
};

// 取消订单
export const cancel = async (id: string, reason: string): Promise<ApiResponse<Order>> => {
  return request.post(`/api/merchant/orders/${id}/cancel`, { reason });
};
