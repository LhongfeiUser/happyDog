import { v4 as uuidv4 } from 'uuid';
import type { ApiResponse, Order, CreateOrderRequest, PaginatedResponse } from '../../types';
import { mockOrders, mockServices, mockPets, currentUser } from './data';

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 生成订单号
const generateOrderNo = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `PS${year}${month}${day}${random}`;
};

// 创建订单
export const createOrder = async (data: CreateOrderRequest): Promise<ApiResponse<Order>> => {
  await delay(600);

  if (!currentUser) {
    return {
      code: 1003,
      message: '未登录',
      data: null as any,
      timestamp: Date.now(),
    };
  }

  const service = mockServices.find(s => s.id === data.serviceId);
  if (!service) {
    return {
      code: 3001,
      message: '服务不存在',
      data: null as any,
      timestamp: Date.now(),
    };
  }

  const pet = mockPets.find(p => p.id === data.petId);
  if (!pet) {
    return {
      code: 2001,
      message: '宠物不存在',
      data: null as any,
      timestamp: Date.now(),
    };
  }

  const now = new Date().toISOString();
  const newOrder: Order = {
    id: `order_${uuidv4()}`,
    orderNo: generateOrderNo(),
    userId: currentUser.id,
    petId: data.petId,
    serviceId: data.serviceId,
    serviceName: service.name,
    serviceCategory: service.category,
    serviceImage: JSON.parse(service.images)[0] || '',
    petName: pet.name,
    status: 'pending_payment',
    totalPrice: service.price,
    appointmentDate: data.appointmentDate,
    appointmentTime: data.appointmentTime,
    address: data.address,
    contactPhone: data.contactPhone,
    remark: data.remark || '',
    createTime: now,
    payTime: null,
    completeTime: null,
    cancelTime: null,
    updateTime: now,
  };

  mockOrders.push(newOrder);

  return {
    code: 0,
    message: 'success',
    data: newOrder,
    timestamp: Date.now(),
  };
};

// 获取订单列表
export const getOrders = async (params?: {
  status?: string;
  page?: number;
  pageSize?: number;
}): Promise<ApiResponse<PaginatedResponse<Order>>> => {
  await delay(500);

  if (!currentUser) {
    return {
      code: 1003,
      message: '未登录',
      data: { list: [], total: 0, page: 1, pageSize: 10 },
      timestamp: Date.now(),
    };
  }

  let filteredOrders = mockOrders.filter(o => o.userId === currentUser!.id);

  // 按状态筛选
  if (params?.status) {
    filteredOrders = filteredOrders.filter(o => o.status === params.status);
  }

  // 按创建时间倒序
  filteredOrders.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime());

  // 分页
  const page = params?.page || 1;
  const pageSize = params?.pageSize || 10;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const list = filteredOrders.slice(start, end);

  return {
    code: 0,
    message: 'success',
    data: {
      list,
      total: filteredOrders.length,
      page,
      pageSize,
    },
    timestamp: Date.now(),
  };
};

// 获取订单详情
export const getOrderById = async (orderId: string): Promise<ApiResponse<Order>> => {
  await delay(400);

  const order = mockOrders.find(o => o.id === orderId);

  if (!order) {
    return {
      code: 4001,
      message: '订单不存在',
      data: null as any,
      timestamp: Date.now(),
    };
  }

  return {
    code: 0,
    message: 'success',
    data: order,
    timestamp: Date.now(),
  };
};

// 支付订单（模拟支付）
export const payOrder = async (orderId: string): Promise<ApiResponse<Order>> => {
  await delay(800);

  const orderIndex = mockOrders.findIndex(o => o.id === orderId);

  if (orderIndex === -1) {
    return {
      code: 4001,
      message: '订单不存在',
      data: null as any,
      timestamp: Date.now(),
    };
  }

  const order = mockOrders[orderIndex];

  if (order.status !== 'pending_payment') {
    return {
      code: 4002,
      message: '订单状态不允许支付',
      data: null as any,
      timestamp: Date.now(),
    };
  }

  // 模拟支付成功
  order.status = 'paid';
  order.payTime = new Date().toISOString();
  order.updateTime = new Date().toISOString();

  return {
    code: 0,
    message: 'success',
    data: order,
    timestamp: Date.now(),
  };
};

// 取消订单
export const cancelOrder = async (orderId: string): Promise<ApiResponse<Order>> => {
  await delay(500);

  const orderIndex = mockOrders.findIndex(o => o.id === orderId);

  if (orderIndex === -1) {
    return {
      code: 4001,
      message: '订单不存在',
      data: null as any,
      timestamp: Date.now(),
    };
  }

  const order = mockOrders[orderIndex];

  // 只有待支付和已支付的订单可以取消
  if (!['pending_payment', 'paid'].includes(order.status)) {
    return {
      code: 4003,
      message: '订单状态不允许取消',
      data: null as any,
      timestamp: Date.now(),
    };
  }

  order.status = 'cancelled';
  order.cancelTime = new Date().toISOString();
  order.updateTime = new Date().toISOString();

  return {
    code: 0,
    message: 'success',
    data: order,
    timestamp: Date.now(),
  };
};

// 确认完成
export const completeOrder = async (orderId: string): Promise<ApiResponse<Order>> => {
  await delay(400);

  const orderIndex = mockOrders.findIndex(o => o.id === orderId);

  if (orderIndex === -1) {
    return {
      code: 4001,
      message: '订单不存在',
      data: null as any,
      timestamp: Date.now(),
    };
  }

  const order = mockOrders[orderIndex];

  if (order.status !== 'in_progress') {
    return {
      code: 4004,
      message: '订单状态不允许确认完成',
      data: null as any,
      timestamp: Date.now(),
    };
  }

  order.status = 'completed';
  order.completeTime = new Date().toISOString();
  order.updateTime = new Date().toISOString();

  return {
    code: 0,
    message: 'success',
    data: order,
    timestamp: Date.now(),
  };
};
