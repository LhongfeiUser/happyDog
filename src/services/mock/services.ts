import type { ApiResponse, Service, PaginatedResponse } from '../../types';
import { mockServices } from './data';

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 获取服务列表
export const getServices = async (params?: {
  category?: string;
  page?: number;
  pageSize?: number;
}): Promise<ApiResponse<PaginatedResponse<Service>>> => {
  await delay(500);

  let filteredServices = mockServices.filter(s => s.status === 'active');

  // 按分类筛选
  if (params?.category) {
    filteredServices = filteredServices.filter(s => s.category === params.category);
  }

  // 分页
  const page = params?.page || 1;
  const pageSize = params?.pageSize || 10;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const list = filteredServices.slice(start, end);

  return {
    code: 0,
    message: 'success',
    data: {
      list,
      total: filteredServices.length,
      page,
      pageSize,
    },
    timestamp: Date.now(),
  };
};

// 获取服务详情
export const getServiceById = async (serviceId: string): Promise<ApiResponse<Service>> => {
  await delay(300);

  const service = mockServices.find(s => s.id === serviceId);

  if (!service) {
    return {
      code: 3001,
      message: '服务不存在',
      data: null as any,
      timestamp: Date.now(),
    };
  }

  return {
    code: 0,
    message: 'success',
    data: service,
    timestamp: Date.now(),
  };
};

// 获取推荐服务（按销量排序）
export const getRecommendServices = async (limit?: number): Promise<ApiResponse<Service[]>> => {
  await delay(400);

  const sortedServices = [...mockServices]
    .filter(s => s.status === 'active')
    .sort((a, b) => b.salesCount - a.salesCount)
    .slice(0, limit || 4);

  return {
    code: 0,
    message: 'success',
    data: sortedServices,
    timestamp: Date.now(),
  };
};

// 获取服务分类统计
export const getServiceCategories = async (): Promise<ApiResponse<{ category: string; count: number; label: string }[]>> => {
  await delay(200);

  const categories = [
    { category: 'wash', count: 0, label: '洗护' },
    { category: 'grooming', count: 0, label: '美容' },
    { category: 'boarding', count: 0, label: '寄养' },
    { category: 'feeding', count: 0, label: '上门喂养' },
  ];

  mockServices.forEach(s => {
    if (s.status === 'active') {
      const cat = categories.find(c => c.category === s.category);
      if (cat) {
        cat.count++;
      }
    }
  });

  return {
    code: 0,
    message: 'success',
    data: categories,
    timestamp: Date.now(),
  };
};
