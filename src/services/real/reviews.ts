import request from '../request';
import type { ApiResponse, Review, CreateReviewRequest, PaginatedResponse } from '../../types';

// 提交评价
export const createReview = async (data: CreateReviewRequest): Promise<ApiResponse<Review>> => {
  return request.post('/api/reviews', data);
};

// 获取服务评价列表
export const getServiceReviews = async (params: {
  serviceId: string;
  page?: number;
  pageSize?: number;
}): Promise<ApiResponse<PaginatedResponse<Review>>> => {
  return request.get(`/api/reviews/service/${params.serviceId}`, {
    params: { page: params.page, pageSize: params.pageSize },
  });
};

// 获取用户评价列表
export const getUserReviews = async (params?: {
  page?: number;
  pageSize?: number;
}): Promise<ApiResponse<PaginatedResponse<Review>>> => {
  return request.get('/api/reviews/user', { params });
};

// 检查订单是否已评价
export const checkOrderReviewed = async (orderId: string): Promise<ApiResponse<{ reviewed: boolean }>> => {
  return request.get(`/api/reviews/check/${orderId}`);
};
