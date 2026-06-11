import { v4 as uuidv4 } from 'uuid';
import type { ApiResponse, User, LoginRequest, RegisterRequest } from '../../types';
import { mockUsers, currentUser, setCurrentUser } from './data';

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 登录
export const login = async (data: LoginRequest): Promise<ApiResponse<{ token: string; user: User }>> => {
  await delay(500);

  const user = mockUsers.find(u => u.phone === data.phone && u.password === data.password);

  if (!user) {
    return {
      code: 1001,
      message: '手机号或密码错误',
      data: null as any,
      timestamp: Date.now(),
    };
  }

  const token = `token_${uuidv4()}`;
  const { password, ...userWithoutPassword } = user;
  setCurrentUser(user);

  return {
    code: 0,
    message: 'success',
    data: { token, user: userWithoutPassword as User },
    timestamp: Date.now(),
  };
};

// 注册
export const register = async (data: RegisterRequest): Promise<ApiResponse<{ token: string; user: User }>> => {
  await delay(500);

  const existingUser = mockUsers.find(u => u.phone === data.phone);
  if (existingUser) {
    return {
      code: 1002,
      message: '该手机号已注册',
      data: null as any,
      timestamp: Date.now(),
    };
  }

  const now = new Date().toISOString();
  const newUser: User = {
    id: `user_${uuidv4()}`,
    phone: data.phone,
    password: data.password,
    nickname: data.nickname,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.nickname}`,
    createTime: now,
    updateTime: now,
  };

  mockUsers.push(newUser);
  const token = `token_${uuidv4()}`;
  const { password, ...userWithoutPassword } = newUser;
  setCurrentUser(newUser);

  return {
    code: 0,
    message: 'success',
    data: { token, user: userWithoutPassword as User },
    timestamp: Date.now(),
  };
};

// 获取当前用户信息
export const getCurrentUser = async (): Promise<ApiResponse<User>> => {
  await delay(300);

  if (!currentUser) {
    return {
      code: 1003,
      message: '未登录',
      data: null as any,
      timestamp: Date.now(),
    };
  }

  const { password, ...userWithoutPassword } = currentUser;

  return {
    code: 0,
    message: 'success',
    data: userWithoutPassword as User,
    timestamp: Date.now(),
  };
};

// 退出登录
export const logout = async (): Promise<ApiResponse<null>> => {
  await delay(200);
  setCurrentUser(null);

  return {
    code: 0,
    message: 'success',
    data: null,
    timestamp: Date.now(),
  };
};
