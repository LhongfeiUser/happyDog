// src/types/merchant.ts

// 商家信息
export interface Merchant {
  id: string;
  userId: string;
  name: string;                    // 店铺名称
  logo: string;                    // 店铺Logo
  contactName: string;             // 联系人
  contactPhone: string;            // 联系电话
  businessLicense: string;         // 营业执照号
  businessLicenseImage: string;    // 营业执照图片
  address: string;                 // 店铺地址
  businessHours: string;           // 营业时间
  description: string;             // 店铺描述
  status: 'pending' | 'approved' | 'rejected'; // 审核状态
  rejectReason: string;            // 驳回原因
  rating: number;                  // 店铺评分
  totalSales: number;              // 总销量
  totalRevenue: number;            // 总收入
  createTime: string;
  updateTime: string;
}

// 商家认证请求
export interface MerchantRegisterRequest {
  name: string;
  contactName: string;
  contactPhone: string;
  businessLicense: string;
  businessLicenseImage: string;
  address: string;
  businessHours: string;
  description: string;
}

// 商家统计数据
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

// 商家服务状态类型
export type MerchantServiceStatus = 'active' | 'inactive' | 'pending_review';

// 商家服务模型（扩展基础服务类型）
export interface MerchantService {
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
  status: MerchantServiceStatus;
  auditStatus: 'pending' | 'approved' | 'rejected';
  auditReason: string;
  createTime: string;
  updateTime: string;
}