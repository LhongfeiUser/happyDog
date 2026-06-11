import { v4 as uuidv4 } from 'uuid';
import type { ApiResponse, Review, CreateReviewRequest, PaginatedResponse } from '../../types';
import { mockReviews, mockOrders, currentUser } from './data';

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 提交评价
export const createReview = async (data: CreateReviewRequest): Promise<ApiResponse<Review>> => {
  await delay(600);

  if (!currentUser) {
    return {
      code: 1003,
      message: '未登录',
      data: null as any,
      timestamp: Date.now(),
    };
  }

  const order = mockOrders.find(o => o.id === data.orderId);
  if (!order) {
    return {
      code: 4001,
      message: '订单不存在',
      data: null as any,
      timestamp: Date.now(),
    };
  }

  // 检查是否已评价
  const existingReview = mockReviews.find(r => r.orderId === data.orderId);
  if (existingReview) {
    return {
      code: 5001,
      message: '该订单已评价',
      data: null as any,
      timestamp: Date.now(),
    };
  }

  const now = new Date().toISOString();
  const newReview: Review = {
    id: `review_${uuidv4()}`,
    orderId: data.orderId,
    userId: currentUser.id,
    serviceId: order.serviceId,
    rating: data.rating,
    content: data.content,
    images: JSON.stringify(data.images || []),
    createTime: now,
    updateTime: now,
  };

  mockReviews.push(newReview);

  // 更新订单状态为已评价
  order.status = 'reviewed';
  order.updateTime = now;

  return {
    code: 0,
    message: 'success',
    data: newReview,
    timestamp: Date.now(),
  };
};

// 获取服务的评价列表
export const getServiceReviews = async (params: {
  serviceId: string;
  page?: number;
  pageSize?: number;
}): Promise<ApiResponse<PaginatedResponse<Review>>> => {
  await delay(400);

  let filteredReviews = mockReviews.filter(r => r.serviceId === params.serviceId);

  // 按创建时间倒序
  filteredReviews.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime());

  // 分页
  const page = params.page || 1;
  const pageSize = params.pageSize || 10;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const list = filteredReviews.slice(start, end);

  return {
    code: 0,
    message: 'success',
    data: {
      list,
      total: filteredReviews.length,
      page,
      pageSize,
    },
    timestamp: Date.now(),
  };
};

// 获取用户的评价列表
export const getUserReviews = async (params?: {
  page?: number;
  pageSize?: number;
}): Promise<ApiResponse<PaginatedResponse<Review>>> => {
  await delay(400);

  if (!currentUser) {
    return {
      code: 1003,
      message: '未登录',
      data: { list: [], total: 0, page: 1, pageSize: 10 },
      timestamp: Date.now(),
    };
  }

  let filteredReviews = mockReviews.filter(r => r.userId === currentUser!.id);

  // 按创建时间倒序
  filteredReviews.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime());

  // 分页
  const page = params?.page || 1;
  const pageSize = params?.pageSize || 10;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const list = filteredReviews.slice(start, end);

  return {
    code: 0,
    message: 'success',
    data: {
      list,
      total: filteredReviews.length,
      page,
      pageSize,
    },
    timestamp: Date.now(),
  };
};

// 获取评价详情
export const getReviewById = async (reviewId: string): Promise<ApiResponse<Review>> => {
  await delay(300);

  const review = mockReviews.find(r => r.id === reviewId);

  if (!review) {
    return {
      code: 5002,
      message: '评价不存在',
      data: null as any,
      timestamp: Date.now(),
    };
  }

  return {
    code: 0,
    message: 'success',
    data: review,
    timestamp: Date.now(),
  };
};

// 检查订单是否已评价
export const checkOrderReviewed = async (orderId: string): Promise<ApiResponse<{ reviewed: boolean }>> => {
  await delay(200);

  const review = mockReviews.find(r => r.orderId === orderId);

  return {
    code: 0,
    message: 'success',
    data: { reviewed: !!review },
    timestamp: Date.now(),
  };
};
