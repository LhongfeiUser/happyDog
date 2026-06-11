import { v4 as uuidv4 } from 'uuid';
import type { ApiResponse, AfterSales, CreateAfterSalesRequest, PaginatedResponse } from '../../types';
import { mockAfterSales, mockOrders, currentUser } from './data';

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 提交售后申请
export const createAfterSales = async (data: CreateAfterSalesRequest): Promise<ApiResponse<AfterSales>> => {
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

  // 检查是否已有售后申请
  const existingAfterSales = mockAfterSales.find(
    a => a.orderId === data.orderId && a.status !== 'rejected'
  );
  if (existingAfterSales) {
    return {
      code: 6001,
      message: '该订单已有售后申请',
      data: null as any,
      timestamp: Date.now(),
    };
  }

  const now = new Date().toISOString();
  const newAfterSales: AfterSales = {
    id: `aftersales_${uuidv4()}`,
    orderId: data.orderId,
    userId: currentUser.id,
    type: data.type,
    reason: data.reason,
    description: data.description,
    images: JSON.stringify(data.images || []),
    status: 'pending',
    adminReply: '',
    createTime: now,
    updateTime: now,
  };

  mockAfterSales.push(newAfterSales);

  // 更新订单状态
  if (data.type === 'refund') {
    order.status = 'refunding';
    order.updateTime = now;
  }

  return {
    code: 0,
    message: 'success',
    data: newAfterSales,
    timestamp: Date.now(),
  };
};

// 获取用户的售后列表
export const getUserAfterSales = async (params?: {
  page?: number;
  pageSize?: number;
}): Promise<ApiResponse<PaginatedResponse<AfterSales>>> => {
  await delay(400);

  if (!currentUser) {
    return {
      code: 1003,
      message: '未登录',
      data: { list: [], total: 0, page: 1, pageSize: 10 },
      timestamp: Date.now(),
    };
  }

  let filteredAfterSales = mockAfterSales.filter(a => a.userId === currentUser!.id);

  // 按创建时间倒序
  filteredAfterSales.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime());

  // 分页
  const page = params?.page || 1;
  const pageSize = params?.pageSize || 10;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const list = filteredAfterSales.slice(start, end);

  return {
    code: 0,
    message: 'success',
    data: {
      list,
      total: filteredAfterSales.length,
      page,
      pageSize,
    },
    timestamp: Date.now(),
  };
};

// 获取售后详情
export const getAfterSalesById = async (afterSalesId: string): Promise<ApiResponse<AfterSales>> => {
  await delay(300);

  const afterSales = mockAfterSales.find(a => a.id === afterSalesId);

  if (!afterSales) {
    return {
      code: 6002,
      message: '售后申请不存在',
      data: null as any,
      timestamp: Date.now(),
    };
  }

  return {
    code: 0,
    message: 'success',
    data: afterSales,
    timestamp: Date.now(),
  };
};

// 获取订单的售后申请
export const getAfterSalesByOrderId = async (orderId: string): Promise<ApiResponse<AfterSales | null>> => {
  await delay(300);

  const afterSales = mockAfterSales.find(a => a.orderId === orderId);

  return {
    code: 0,
    message: 'success',
    data: afterSales || null,
    timestamp: Date.now(),
  };
};

// 取消售后申请
export const cancelAfterSales = async (afterSalesId: string): Promise<ApiResponse<AfterSales>> => {
  await delay(500);

  const afterSalesIndex = mockAfterSales.findIndex(a => a.id === afterSalesId);

  if (afterSalesIndex === -1) {
    return {
      code: 6002,
      message: '售后申请不存在',
      data: null as any,
      timestamp: Date.now(),
    };
  }

  const afterSales = mockAfterSales[afterSalesIndex];

  if (afterSales.status !== 'pending') {
    return {
      code: 6003,
      message: '只能取消待处理的售后申请',
      data: null as any,
      timestamp: Date.now(),
    };
  }

  afterSales.status = 'rejected';
  afterSales.adminReply = '用户主动取消';
  afterSales.updateTime = new Date().toISOString();

  // 恢复订单状态
  const order = mockOrders.find(o => o.id === afterSales.orderId);
  if (order && order.status === 'refunding') {
    order.status = 'completed';
    order.updateTime = new Date().toISOString();
  }

  return {
    code: 0,
    message: 'success',
    data: afterSales,
    timestamp: Date.now(),
  };
};
