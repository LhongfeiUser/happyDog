// src/types/merchant.ts
import type { AddressInfo } from '../components/common/AddressPicker/types';

/**
 * 商家信息
 */
export interface Merchant {
  /** 商家ID */
  id: string;
  /** 关联用户ID */
  userId: string;
  /** 店铺名称 */
  name: string;
  /** 店铺Logo */
  logo: string;
  /** 联系人 */
  contactName: string;
  /** 联系电话 */
  contactPhone: string;
  /** 营业执照号 */
  businessLicense: string;
  /** 营业执照图片 */
  businessLicenseImage: string;
  /** 店铺地址 */
  address: AddressInfo | string;
  /** 营业时间 */
  businessHours: string;
  /** 店铺描述 */
  description: string;
  /** 审核状态 */
  status: 'pending' | 'approved' | 'rejected';
  /** 驳回原因 */
  rejectReason: string;
  /** 店铺评分 */
  rating: number;
  /** 总销量 */
  totalSales: number;
  /** 总收入 */
  totalRevenue: number;
  /** 创建时间 */
  createTime: string;
  /** 更新时间 */
  updateTime: string;
}

/**
 * 商家认证请求
 */
export interface MerchantRegisterRequest {
  name: string;
  contactName: string;
  contactPhone: string;
  businessLicense: string;
  businessLicenseImage: string;
  address: AddressInfo;
  businessHours: string;
  description: string;
}

/**
 * 商家统计数据
 */
export interface MerchantStatistics {
  todayOrders: number;
  todayRevenue: number;
  pendingOrders: number;
  totalServices: number;
  averageRating: number;
  monthlyRevenue: {
    month: string;
    revenue: number;
  }[];
  orderStatusDistribution: {
    status: string;
    name: string;
    count: number;
    percentage: number;
  }[];
  topServices: {
    id: string;
    name: string;
    salesCount: number;
    revenue: number;
  }[];
  customerAnalysis: {
    newCustomers: number;
    repeatCustomers: number;
    totalCustomers: number;
  };
}

/**
 * 商家服务状态类型
 */
export type MerchantServiceStatus = 'active' | 'inactive' | 'pending_review';

/**
 * 商家服务模型（扩展基础服务类型）
 */
export interface MerchantService {
  /** 服务ID */
  id: string;
  /** 商家ID */
  merchantId: string;
  /** 服务名称 */
  name: string;
  /** 服务分类 */
  category: 'wash' | 'grooming' | 'boarding' | 'feeding';
  /** 服务描述 */
  description: string;
  /** 服务价格（分） */
  price: number;
  /** 服务时长（分钟） */
  duration: number;
  /** 服务图片列表 */
  images: string[];
  /** 评分 */
  rating: number;
  /** 销量 */
  salesCount: number;
  /** 服务状态 */
  status: MerchantServiceStatus;
  /** 审核状态 */
  auditStatus: 'pending' | 'approved' | 'rejected';
  /** 审核原因 */
  auditReason: string;
  /** 创建时间 */
  createTime: string;
  /** 更新时间 */
  updateTime: string;
}