import request from '../request';
import type { ApiResponse, User, LoginRequest, RegisterRequest } from '../../types';

// 登录
export const login = async (data: LoginRequest): Promise<ApiResponse<{ token: string; user: User }>> => {
  return request.post('/api/auth/login', data);
};

// 注册
export const register = async (data: RegisterRequest): Promise<ApiResponse<{ token: string; user: User }>> => {
  return request.post('/api/auth/register', data);
};

// 获取当前用户信息
export const getCurrentUser = async (): Promise<ApiResponse<User>> => {
  return request.get('/api/user/profile');
};

// 退出登录
export const logout = async (): Promise<ApiResponse<null>> => {
  // 前端清除token即可
  return Promise.resolve({
    code: 0,
    message: 'success',
    data: null,
    timestamp: Date.now(),
  });
};
