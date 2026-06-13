import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import type { ApiResponse } from '../types';

// 创建 axios 实例
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 添加 token 到请求头
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 添加商家 token 到请求头
    const merchantToken = localStorage.getItem('merchantToken');
    if (merchantToken) {
      config.headers['Merchant-Authorization'] = `Bearer ${merchantToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<any>>) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      // 清除 token 并跳转到登录页
      localStorage.removeItem('token');
      localStorage.removeItem('merchantToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 用户认证 API
export const authApi = {
  login: (data: { phone: string; password: string }) =>
    api.post('/auth/login', data),
  register: (data: { phone: string; password: string; nickname: string }) =>
    api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  getUserInfo: () => api.get('/auth/user'),
};

// 商家认证 API
export const merchantAuthApi = {
  login: (data: { phone: string; password: string }) =>
    api.post('/merchant/auth/login', data),
  register: (data: any) =>
    api.post('/merchant/auth/register', data),
  logout: () => api.post('/merchant/auth/logout'),
  getMerchantInfo: () => api.get('/merchant/auth/info'),
};

// 宠物 API
export const petsApi = {
  getPets: (userId: string) => api.get(`/pets/user/${userId}`),
  getPet: (id: string) => api.get(`/pets/${id}`),
  createPet: (data: any) => api.post('/pets', data),
  updatePet: (id: string, data: any) => api.put(`/pets/${id}`, data),
  deletePet: (id: string) => api.delete(`/pets/${id}`),
};

// 服务 API
export const servicesApi = {
  getServices: (params?: any) => api.get('/services', { params }),
  getService: (id: string) => api.get(`/services/${id}`),
  createService: (data: any) => api.post('/services', data),
  updateService: (id: string, data: any) => api.put(`/services/${id}`, data),
  deleteService: (id: string) => api.delete(`/services/${id}`),
};

// 订单 API
export const ordersApi = {
  getOrders: (params?: any) => api.get('/orders', { params }),
  getOrder: (id: string) => api.get(`/orders/${id}`),
  createOrder: (data: any) => api.post('/orders', data),
  updateOrder: (id: string, data: any) => api.put(`/orders/${id}`, data),
  deleteOrder: (id: string) => api.delete(`/orders/${id}`),
  cancelOrder: (id: string) => api.post(`/orders/${id}/cancel`),
};

// 评价 API
export const reviewsApi = {
  getReviews: (serviceId: string) => api.get(`/reviews/service/${serviceId}`),
  createReview: (data: any) => api.post('/reviews', data),
  updateReview: (id: string, data: any) => api.put(`/reviews/${id}`, data),
  deleteReview: (id: string) => api.delete(`/reviews/${id}`),
};

// 售后 API
export const afterSalesApi = {
  getAfterSales: (orderId: string) => api.get(`/after-sales/order/${orderId}`),
  createAfterSales: (data: any) => api.post('/after-sales', data),
  updateAfterSales: (id: string, data: any) => api.put(`/after-sales/${id}`, data),
};

// 数据统计 API
export const statisticsApi = {
  getStatistics: () => api.get('/statistics'),
  getMerchantStatistics: () => api.get('/merchant/statistics'),
};

// 商家服务 API
export const merchantServicesApi = {
  getServices: (params?: any) => api.get('/merchant/services', { params }),
  getService: (id: string) => api.get(`/merchant/services/${id}`),
  createService: (data: any) => api.post('/merchant/services', data),
  updateService: (id: string, data: any) => api.put(`/merchant/services/${id}`, data),
  deleteService: (id: string) => api.delete(`/merchant/services/${id}`),
  updateServiceStatus: (id: string, status: string) =>
    api.patch(`/merchant/services/${id}/status`, { status }),
};

// 商家订单 API
export const merchantOrdersApi = {
  getList: (params?: any) => api.get('/merchant/orders', { params }),
  getOrder: (id: string) => api.get(`/merchant/orders/${id}`),
  accept: (id: string) => api.post(`/merchant/orders/${id}/accept`),
  reject: (id: string, reason: string) =>
    api.post(`/merchant/orders/${id}/reject`, { reason }),
  completeService: (id: string) => api.post(`/merchant/orders/${id}/complete`),
  startService: (id: string) => api.post(`/merchant/orders/${id}/start`),
};

export default api;
