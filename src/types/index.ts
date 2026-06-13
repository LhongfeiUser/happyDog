// 统一API响应格式
export interface ApiResponse<T> {
  code: 0 | number;
  message: string;
  data: T;
  timestamp: number;
}

// 分页响应格式
export interface PaginatedResponse<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

// 用户模型
export interface User {
  id: string;
  phone: string;
  password?: string;
  nickname: string;
  avatar: string;
  createTime: string;
  updateTime: string;
}

// 宠物模型
export interface Pet {
  id: string;
  userId: string;
  name: string;
  species: 'dog' | 'cat' | 'other';
  breed: string;
  age: number;
  gender: 'male' | 'female';
  weight: number;
  avatar: string;
  isNeutered: boolean;
  vaccineRecords: string;
  medicalHistory: string;
  allergies: string;
  isDefault: boolean;
  createTime: string;
  updateTime: string;
}

// 服务模型
export interface Service {
  id: string;
  merchantId: string;
  name: string;
  category: 'wash' | 'grooming' | 'boarding' | 'feeding';
  description: string;
  price: number;
  duration: number;
  images: string;
  rating: number;
  salesCount: number;
  status: 'active' | 'inactive';
  createTime: string;
  updateTime: string;
}

// 订单状态枚举
export type OrderStatus =
  | 'pending_payment'
  | 'paid'
  | 'pending_accept'
  | 'accepted'
  | 'in_progress'
  | 'completed'
  | 'reviewed'
  | 'cancelled'
  | 'refunding';

// 订单模型
export interface Order {
  id: string;
  orderNo: string;
  userId: string;
  petId: string;
  serviceId: string;
  serviceName: string;
  serviceCategory: string;
  serviceImage: string;
  petName: string;
  status: OrderStatus;
  totalPrice: number;
  appointmentDate: string;
  appointmentTime: string;
  address: string;
  contactPhone: string;
  remark: string;
  createTime: string;
  payTime: string | null;
  completeTime: string | null;
  cancelTime: string | null;
  updateTime: string;
}

// 评价模型
export interface Review {
  id: string;
  orderId: string;
  userId: string;
  serviceId: string;
  rating: number;
  content: string;
  images: string;
  createTime: string;
  updateTime: string;
}

// 售后类型枚举
export type AfterSalesType = 'refund' | 'cancel' | 'complaint';
export type AfterSalesStatus = 'pending' | 'processing' | 'completed' | 'rejected';

// 售后模型
export interface AfterSales {
  id: string;
  orderId: string;
  userId: string;
  type: AfterSalesType;
  reason: string;
  description: string;
  images: string;
  status: AfterSalesStatus;
  adminReply: string;
  createTime: string;
  updateTime: string;
}

// 登录请求
export interface LoginRequest {
  phone: string;
  password: string;
}

// 注册请求
export interface RegisterRequest {
  phone: string;
  password: string;
  nickname: string;
}

// 创建订单请求
export interface CreateOrderRequest {
  serviceId: string;
  petId: string;
  appointmentDate: string;
  appointmentTime: string;
  address: string;
  contactPhone: string;
  remark?: string;
}

// 创建评价请求
export interface CreateReviewRequest {
  orderId: string;
  rating: number;
  content: string;
  images?: string[];
}

// 创建售后请求
export interface CreateAfterSalesRequest {
  orderId: string;
  type: AfterSalesType;
  reason: string;
  description: string;
  images?: string[];
}

// 数据统计类型
export interface StatisticsData {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  averageRating: number;
  serviceCategories: {
    category: string;
    name: string;
    icon: string;
    orderCount: number;
    percentage: number;
  }[];
  topServices: {
    id: string;
    name: string;
    price: number;
    salesCount: number;
  }[];
  monthlyTrend: {
    month: string;
    orders: number;
  }[];
  userAnalysis: {
    newUsers: number;
    activeUsers: number;
    repeatUsers: number;
  };
  ratingDistribution: {
    rating: number;
    count: number;
    percentage: number;
  }[];
  petTypes: {
    type: string;
    name: string;
    icon: string;
    count: number;
    percentage: number;
  }[];
  timeSlots: {
    period: string;
    orders: number;
    percentage: number;
  }[];
}

export * from './merchant';
