import dayjs from 'dayjs';

// 格式化价格（分转元）
export const formatPrice = (price: number): string => {
  return (price / 100).toFixed(2);
};

// 格式化日期
export const formatDate = (date: string | Date, format: string = 'YYYY-MM-DD HH:mm:ss'): string => {
  return dayjs(date).format(format);
};

// 格式化相对时间
export const formatRelativeTime = (date: string | Date): string => {
  const now = dayjs();
  const target = dayjs(date);
  const diffMinutes = now.diff(target, 'minute');
  const diffHours = now.diff(target, 'hour');
  const diffDays = now.diff(target, 'day');

  if (diffMinutes < 1) {
    return '刚刚';
  } else if (diffMinutes < 60) {
    return `${diffMinutes}分钟前`;
  } else if (diffHours < 24) {
    return `${diffHours}小时前`;
  } else if (diffDays < 7) {
    return `${diffDays}天前`;
  } else {
    return formatDate(date, 'YYYY-MM-DD');
  }
};

// 格式化订单状态
export const formatOrderStatus = (status: string): { text: string; color: string } => {
  const statusMap: Record<string, { text: string; color: string }> = {
    pending_payment: { text: '待支付', color: 'orange' },
    paid: { text: '已支付', color: 'blue' },
    pending_accept: { text: '待接单', color: 'cyan' },
    accepted: { text: '已接单', color: 'geekblue' },
    in_progress: { text: '服务中', color: 'purple' },
    completed: { text: '已完成', color: 'green' },
    reviewed: { text: '已评价', color: 'lime' },
    cancelled: { text: '已取消', color: 'default' },
    refunding: { text: '退款中', color: 'gold' },
  };

  return statusMap[status] || { text: status, color: 'default' };
};

// 格式化售后状态
export const formatAfterSalesStatus = (status: string): { text: string; color: string } => {
  const statusMap: Record<string, { text: string; color: string }> = {
    pending: { text: '待处理', color: 'orange' },
    processing: { text: '处理中', color: 'blue' },
    completed: { text: '已完成', color: 'green' },
    rejected: { text: '已拒绝', color: 'red' },
  };

  return statusMap[status] || { text: status, color: 'default' };
};

// 格式化售后类型
export const formatAfterSalesType = (type: string): string => {
  const typeMap: Record<string, string> = {
    refund: '退款',
    cancel: '取消订单',
    complaint: '投诉',
  };

  return typeMap[type] || type;
};

// 格式化服务分类
export const formatServiceCategory = (category: string): string => {
  const categoryMap: Record<string, string> = {
    wash: '洗护',
    grooming: '美容',
    boarding: '寄养',
  };

  return categoryMap[category] || category;
};

// 格式化宠物种类
export const formatPetSpecies = (species: string): string => {
  const speciesMap: Record<string, string> = {
    dog: '狗狗',
    cat: '猫咪',
    other: '其他',
  };

  return speciesMap[species] || species;
};

// 格式化宠物性别
export const formatPetGender = (gender: string): string => {
  const genderMap: Record<string, string> = {
    male: '公',
    female: '母',
  };

  return genderMap[gender] || gender;
};

// 生成随机ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// 防抖函数
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// 节流函数
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// 验证手机号
export const isValidPhone = (phone: string): boolean => {
  return /^1[3-9]\d{9}$/.test(phone);
};

// 验证密码
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6 && password.length <= 20;
};

// 验证昵称
export const isValidNickname = (nickname: string): boolean => {
  return nickname.length >= 2 && nickname.length <= 20;
};

// 截断字符串
export const truncateString = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
};

// 解析JSON字符串（安全）
export const safeJsonParse = <T>(jsonStr: string, defaultValue: T): T => {
  try {
    return JSON.parse(jsonStr);
  } catch {
    return defaultValue;
  }
};

// 格式化文件大小
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 获取图片URL（处理JSON字符串）
export const getImageUrl = (images: string | string[], index: number = 0): string => {
  if (Array.isArray(images)) {
    return images[index] || '';
  }
  try {
    const parsed = JSON.parse(images);
    return parsed[index] || '';
  } catch {
    return '';
  }
};

// 获取所有图片URL
export const getImageUrls = (images: string | string[]): string[] => {
  if (Array.isArray(images)) {
    return images;
  }
  try {
    return JSON.parse(images);
  } catch {
    return [];
  }
};
