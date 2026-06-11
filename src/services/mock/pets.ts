import { v4 as uuidv4 } from 'uuid';
import type { ApiResponse, Pet } from '../../types';
import { mockPets, currentUser } from './data';

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 获取当前用户的宠物列表
export const getPets = async (): Promise<ApiResponse<Pet[]>> => {
  await delay(400);

  if (!currentUser) {
    return {
      code: 1003,
      message: '未登录',
      data: [],
      timestamp: Date.now(),
    };
  }

  const userPets = mockPets.filter(p => p.userId === currentUser!.id);

  return {
    code: 0,
    message: 'success',
    data: userPets,
    timestamp: Date.now(),
  };
};

// 获取宠物详情
export const getPetById = async (petId: string): Promise<ApiResponse<Pet>> => {
  await delay(300);

  const pet = mockPets.find(p => p.id === petId);

  if (!pet) {
    return {
      code: 2001,
      message: '宠物不存在',
      data: null as any,
      timestamp: Date.now(),
    };
  }

  return {
    code: 0,
    message: 'success',
    data: pet,
    timestamp: Date.now(),
  };
};

// 添加宠物
export const addPet = async (data: Partial<Pet>): Promise<ApiResponse<Pet>> => {
  await delay(500);

  if (!currentUser) {
    return {
      code: 1003,
      message: '未登录',
      data: null as any,
      timestamp: Date.now(),
    };
  }

  const now = new Date().toISOString();
  const newPet: Pet = {
    id: `pet_${uuidv4()}`,
    userId: currentUser!.id,
    name: data.name || '',
    species: data.species || 'dog',
    breed: data.breed || '',
    age: data.age || 0,
    gender: data.gender || 'male',
    weight: data.weight || 0,
    avatar: data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`,
    isNeutered: data.isNeutered || false,
    vaccineRecords: data.vaccineRecords || '[]',
    medicalHistory: data.medicalHistory || '',
    allergies: data.allergies || '',
    isDefault: mockPets.filter(p => p.userId === currentUser!.id).length === 0,
    createTime: now,
    updateTime: now,
  };

  mockPets.push(newPet);

  return {
    code: 0,
    message: 'success',
    data: newPet,
    timestamp: Date.now(),
  };
};

// 更新宠物
export const updatePet = async (petId: string, data: Partial<Pet>): Promise<ApiResponse<Pet>> => {
  await delay(500);

  const petIndex = mockPets.findIndex(p => p.id === petId);

  if (petIndex === -1) {
    return {
      code: 2001,
      message: '宠物不存在',
      data: null as any,
      timestamp: Date.now(),
    };
  }

  const updatedPet = {
    ...mockPets[petIndex],
    ...data,
    updateTime: new Date().toISOString(),
  };

  mockPets[petIndex] = updatedPet;

  return {
    code: 0,
    message: 'success',
    data: updatedPet,
    timestamp: Date.now(),
  };
};

// 删除宠物
export const deletePet = async (petId: string): Promise<ApiResponse<null>> => {
  await delay(400);

  const petIndex = mockPets.findIndex(p => p.id === petId);

  if (petIndex === -1) {
    return {
      code: 2001,
      message: '宠物不存在',
      data: null,
      timestamp: Date.now(),
    };
  }

  mockPets.splice(petIndex, 1);

  return {
    code: 0,
    message: 'success',
    data: null,
    timestamp: Date.now(),
  };
};

// 设置默认宠物
export const setDefaultPet = async (petId: string): Promise<ApiResponse<null>> => {
  await delay(300);

  if (!currentUser) {
    return {
      code: 1003,
      message: '未登录',
      data: null,
      timestamp: Date.now(),
    };
  }

  // 取消当前默认宠物
  mockPets.forEach(p => {
    if (p.userId === currentUser!.id) {
      p.isDefault = false;
    }
  });

  // 设置新的默认宠物
  const pet = mockPets.find(p => p.id === petId && p.userId === currentUser!.id);
  if (pet) {
    pet.isDefault = true;
  }

  return {
    code: 0,
    message: 'success',
    data: null,
    timestamp: Date.now(),
  };
};
