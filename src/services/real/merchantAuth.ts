import request from '../request';
import type { ApiResponse, Merchant, MerchantRegisterRequest } from '../../types';

// 商家登录
export const login = async (data: { phone: string; password: string }): Promise<ApiResponse<{ token: string; merchant: Merchant }>> => {
  return request.post('/api/merchant/auth/login', data);
};

// 商家注册
export const register = async (data: MerchantRegisterRequest): Promise<ApiResponse<Merchant>> => {
  return request.post('/api/merchant/auth/register', data);
};

// 获取商家信息
export const getMerchantInfo = async (): Promise<ApiResponse<Merchant>> => {
  return request.get('/api/merchant/info');
};

// 更新商家信息
export const updateMerchantInfo = async (data: Partial<Merchant>): Promise<ApiResponse<Merchant>> => {
  return request.put('/api/merchant/info', data);
};
