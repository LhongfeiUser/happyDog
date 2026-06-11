import request from '../request';
import type { ApiResponse, Order, CreateOrderRequest, PaginatedResponse } from '../../types';

// 创建订单
export const createOrder = async (data: CreateOrderRequest): Promise<ApiResponse<Order>> => {
  return request.post('/api/orders', data);
};

// 获取订单列表
export const getOrders = async (params?: {
  status?: string;
  page?: number;
  pageSize?: number;
}): Promise<ApiResponse<PaginatedResponse<Order>>> => {
  return request.get('/api/orders', { params });
};

// 获取订单详情
export const getOrderById = async (orderId: string): Promise<ApiResponse<Order>> => {
  return request.get(`/api/orders/${orderId}`);
};

// 支付订单
export const payOrder = async (orderId: string): Promise<ApiResponse<Order>> => {
  return request.put(`/api/orders/${orderId}/pay`);
};

// 取消订单
export const cancelOrder = async (orderId: string): Promise<ApiResponse<Order>> => {
  return request.put(`/api/orders/${orderId}/cancel`);
};

// 确认完成
export const completeOrder = async (orderId: string): Promise<ApiResponse<Order>> => {
  return request.put(`/api/orders/${orderId}/complete`);
};
