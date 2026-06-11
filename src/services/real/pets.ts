import request from '../request';
import type { ApiResponse, Pet } from '../../types';

// 获取宠物列表
export const getPets = async (): Promise<ApiResponse<Pet[]>> => {
  return request.get('/api/pets');
};

// 获取宠物详情
export const getPetById = async (petId: string): Promise<ApiResponse<Pet>> => {
  return request.get(`/api/pets/${petId}`);
};

// 添加宠物
export const addPet = async (data: Partial<Pet>): Promise<ApiResponse<Pet>> => {
  return request.post('/api/pets', data);
};

// 更新宠物
export const updatePet = async (petId: string, data: Partial<Pet>): Promise<ApiResponse<Pet>> => {
  return request.put(`/api/pets/${petId}`, data);
};

// 删除宠物
export const deletePet = async (petId: string): Promise<ApiResponse<null>> => {
  return request.delete(`/api/pets/${petId}`);
};

// 设置默认宠物
export const setDefaultPet = async (petId: string): Promise<ApiResponse<null>> => {
  return request.put(`/api/pets/${petId}/default`);
};
