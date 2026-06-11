import type { ApiResponse, StatisticsData } from '../../types';

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 获取数据统计
export const getStatistics = async (): Promise<ApiResponse<StatisticsData>> => {
  await delay(500);

  const data: StatisticsData = {
    totalUsers: 12580,
    totalOrders: 8965,
    totalRevenue: 1256789.50,
    averageRating: 4.8,
    serviceCategories: [
      {
        category: 'wash',
        name: '洗护',
        icon: '🛁',
        orderCount: 3520,
        percentage: 39,
      },
      {
        category: 'grooming',
        name: '美容',
        icon: '✂️',
        orderCount: 2180,
        percentage: 24,
      },
      {
        category: 'boarding',
        name: '寄养',
        icon: '🏠',
        orderCount: 1680,
        percentage: 19,
      },
      {
        category: 'feeding',
        name: '上门喂养',
        icon: '🍽️',
        orderCount: 1585,
        percentage: 18,
      },
    ],
    topServices: [
      {
        id: 'service-001',
        name: '基础洗护套餐',
        price: 9800,
        salesCount: 1256,
      },
      {
        id: 'service-008',
        name: '标准上门喂养',
        price: 8800,
        salesCount: 1120,
      },
      {
        id: 'service-004',
        name: '基础造型套餐',
        price: 19800,
        salesCount: 890,
      },
      {
        id: 'service-002',
        name: '精致洗护套餐',
        price: 16800,
        salesCount: 756,
      },
      {
        id: 'service-009',
        name: '精致上门喂养',
        price: 12800,
        salesCount: 623,
      },
      {
        id: 'service-006',
        name: '标准寄养',
        price: 12800,
        salesCount: 456,
      },
    ],
    monthlyTrend: [
      { month: '1月', orders: 680 },
      { month: '2月', orders: 720 },
      { month: '3月', orders: 850 },
      { month: '4月', orders: 920 },
      { month: '5月', orders: 1050 },
      { month: '6月', orders: 1180 },
      { month: '7月', orders: 1250 },
      { month: '8月', orders: 1320 },
    ],
    userAnalysis: {
      newUsers: 2560,
      activeUsers: 8920,
      repeatUsers: 5860,
    },
    ratingDistribution: [
      { rating: 5, count: 6520, percentage: 73 },
      { rating: 4, count: 1560, percentage: 17 },
      { rating: 3, count: 680, percentage: 8 },
      { rating: 2, count: 150, percentage: 1.5 },
      { rating: 1, count: 55, percentage: 0.5 },
    ],
    petTypes: [
      {
        type: 'dog',
        name: '狗狗',
        icon: '🐕',
        count: 6580,
        percentage: 58,
      },
      {
        type: 'cat',
        name: '猫咪',
        icon: '🐈',
        count: 4250,
        percentage: 37,
      },
      {
        type: 'other',
        name: '其他',
        icon: '🐰',
        count: 580,
        percentage: 5,
      },
    ],
    timeSlots: [
      { period: '上午', orders: 3250, percentage: 36 },
      { period: '下午', orders: 4120, percentage: 46 },
      { period: '晚上', orders: 1595, percentage: 18 },
    ],
  };

  return {
    code: 0,
    message: 'success',
    data,
    timestamp: Date.now(),
  };
};
