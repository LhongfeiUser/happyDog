import type { ThemeConfig } from 'antd';

// 可爱活泼的主题配置
export const theme: ThemeConfig = {
  token: {
    // 主色调 - 温暖的橙色
    colorPrimary: '#FF6B35',
    // 成功色
    colorSuccess: '#4CAF50',
    // 警告色
    colorWarning: '#FFC107',
    // 错误色
    colorError: '#F44336',
    // 背景色 - 温暖的米色
    colorBgBase: '#FFF8F0',
    // 文字颜色
    colorText: '#333333',
    // 边框圆角 - 更圆润
    borderRadius: 12,
    // 字体
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    // 链接颜色
    colorLink: '#FF6B35',
    // 悬停颜色
    colorPrimaryHover: '#FF8555',
    // 点击颜色
    colorPrimaryActive: '#E55A25',
  },
  components: {
    Button: {
      borderRadius: 20,
      controlHeight: 40,
    },
    Card: {
      borderRadiusLG: 16,
    },
    Input: {
      borderRadius: 10,
      controlHeight: 40,
    },
    Select: {
      borderRadius: 10,
      controlHeight: 40,
    },
    Modal: {
      borderRadiusLG: 20,
    },
    Rate: {
      starColor: '#FFD700',
    },
  },
};

// 渐变色
export const gradients = {
  primary: 'linear-gradient(135deg, #FF6B35 0%, #FF8555 100%)',
  warm: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0CC 100%)',
  cute: 'linear-gradient(135deg, #FFE0B2 0%, #FFCCBC 100%)',
  success: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
};

// 阴影
export const shadows = {
  card: '0 4px 12px rgba(255, 107, 53, 0.15)',
  hover: '0 8px 24px rgba(255, 107, 53, 0.25)',
  button: '0 4px 12px rgba(255, 107, 53, 0.3)',
};
