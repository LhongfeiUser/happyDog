# 宠物服务平台 - 新增模块设计文档

**文档版本：** v1.0
**创建日期：** 2026-06-11
**最后更新：** 2026-06-11
**作者：** Claude Code + Superpowers

---

## 1. 概述

### 1.1 目标

为宠物服务平台添加两个新模块：
1. **上门喂养服务模块** - 提供上门喂养服务的综合展示页面
2. **数据统计分析模块** - 提供平台运营数据的可视化展示

### 1.2 设计原则

- **一致性：** 遵循现有项目的设计风格和技术架构
- **可扩展性：** 为后续功能扩展预留接口
- **用户体验：** 简洁直观，易于使用
- **性能：** 高效加载，响应迅速

### 1.3 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 18.x | UI 框架 |
| TypeScript | 5.x | 类型安全 |
| Ant Design | 5.x | UI 组件库 |
| Redux Toolkit | 2.x | 状态管理 |
| React Router | 6.x | 路由管理 |
| ECharts | 5.x | 图表可视化 |
| echarts-for-react | 3.x | React ECharts 封装 |

---

## 2. 上门喂养服务模块

### 2.1 需求分析

**业务需求：**
- 提供上门喂养服务的综合展示
- 支持多种服务类型（标准、精致、套餐）
- 清晰展示服务流程和价格
- 提供预约入口

**用户需求：**
- 快速了解服务内容
- 方便比较不同服务
- 清晰的服务流程说明
- 便捷的预约方式

### 2.2 页面设计

#### 2.2.1 页面结构

```
┌─────────────────────────────────────────────┐
│  🎠 服务轮播横幅                             │
│  - 展示上门喂养场景图片                      │
│  - 平台优势和服务保障                        │
├─────────────────────────────────────────────┤
│  📋 服务卡片网格（3列布局）                  │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ │
│  │ 标准上门   │ │ 精致上门   │ │ 长期套餐   │ │
│  │ 喂养      │ │ 喂养      │ │ (7天)     │ │
│  │           │ │           │ │           │ │
│  │ ¥88/次    │ │ ¥128/次   │ │ ¥568/7天  │ │
│  │ 60分钟    │ │ 90分钟    │ │ 每天1次   │ │
│  │           │ │           │ │           │ │
│  │ [立即预约] │ │ [立即预约] │ │ [立即预约] │ │
│  └───────────┘ └───────────┘ └───────────┘ │
├─────────────────────────────────────────────┤
│  📝 服务流程（步骤指示器）                   │
│  ① 选择服务 → ② 预约时间 → ③ 确认地址     │
│  → ④ 宠物师上门 → ⑤ 服务完成               │
├─────────────────────────────────────────────┤
│  ❓ 常见问题                                │
│  Q: 宠物师资质如何？                        │
│  A: 所有宠物师均经过专业培训...             │
│  Q: 服务过程中宠物生病怎么办？              │
│  A: 我们提供全程保险保障...                 │
├─────────────────────────────────────────────┤
│  📞 联系方式                                │
│  客服热线：400-888-8888                     │
│  服务时间：08:00 - 20:00                    │
└─────────────────────────────────────────────┘
```

#### 2.2.2 页面元素

**1. 服务轮播横幅**
- 尺寸：1200px × 300px
- 内容：上门喂养场景图片 + 平台优势文字
- 自动轮播：5秒切换

**2. 服务卡片网格**
- 布局：3列响应式网格
- 卡片内容：
  - 服务名称
  - 服务价格
  - 服务时长
  - 服务描述
  - 预约按钮
- 交互：点击卡片展开详情

**3. 服务流程**
- 布局：水平步骤指示器
- 步骤：5个步骤
- 样式：橙色主题，完成步骤高亮

**4. 常见问题**
- 布局：折叠面板
- 问题数量：5-8个
- 交互：点击展开/收起

**5. 联系方式**
- 布局：卡片式
- 内容：客服热线、服务时间
- 样式：居中显示

### 2.3 数据模型

#### 2.3.1 服务类型扩展

```typescript
// 现有类型
interface Service {
  id: string;
  merchantId: string;
  name: string;
  category: 'wash' | 'grooming' | 'boarding' | 'feeding';  // 新增 feeding
  description: string;
  price: number;        // 单位：分
  duration: number;     // 单位：分钟
  images: string;       // JSON数组字符串
  rating: number;       // 评分 1-5
  salesCount: number;   // 销量
  status: 'active' | 'inactive';
  createTime: string;
  updateTime: string;
}
```

#### 2.3.2 Mock 数据

```typescript
// 上门喂养服务数据
const feedingServices: Service[] = [
  {
    id: 'service-008',
    merchantId: 'merchant-001',
    name: '标准上门喂养',
    category: 'feeding',
    description: '专业宠物师上门喂养，包含喂食、换水、清理猫砂/遛弯、陪伴玩耍30分钟',
    price: 8800,  // ¥88
    duration: 60,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400',
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400',
    ]),
    rating: 4.8,
    salesCount: 678,
    status: 'active',
    createTime: '2026-01-01T00:00:00.000Z',
    updateTime: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'service-009',
    merchantId: 'merchant-001',
    name: '精致上门喂养',
    category: 'feeding',
    description: '专业宠物师上门喂养，包含喂食、换水、清理、遛弯、陪伴玩耍60分钟，拍照反馈',
    price: 12800,  // ¥128
    duration: 90,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400',
    ]),
    rating: 4.9,
    salesCount: 423,
    status: 'active',
    createTime: '2026-01-01T00:00:00.000Z',
    updateTime: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'service-010',
    merchantId: 'merchant-001',
    name: '长期上门喂养套餐（7天）',
    category: 'feeding',
    description: '连续7天上门喂养服务，每天1次，包含全面护理和每日照片视频反馈',
    price: 56800,  // ¥568
    duration: 60,
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=400',
    ]),
    rating: 5.0,
    salesCount: 156,
    status: 'active',
    createTime: '2026-01-01T00:00:00.000Z',
    updateTime: '2026-01-01T00:00:00.000Z',
  },
];
```

### 2.4 组件设计

#### 2.4.1 新增组件

**1. ServiceCarousel（服务轮播）**
```typescript
interface ServiceCarouselProps {
  images: string[];
  title: string;
  subtitle: string;
}

// 功能：
// - 自动轮播（5秒）
// - 手动切换
// - 指示器导航
```

**2. ServiceProcess（服务流程）**
```typescript
interface ServiceProcessProps {
  steps: {
    title: string;
    description: string;
    icon: React.ReactNode;
  }[];
  currentStep?: number;
}

// 功能：
// - 水平步骤指示器
// - 步骤状态显示
// - 响应式布局
```

**3. FAQSection（常见问题）**
```typescript
interface FAQSectionProps {
  faqs: {
    question: string;
    answer: string;
  }[];
}

// 功能：
// - 折叠面板
// - 展开/收起动画
// - 搜索过滤（可选）
```

#### 2.4.2 复用组件

- `ServiceCard` - 现有的服务卡片组件
- `MainLayout` - 现有的布局组件
- `Button`, `Card`, `Tag` - Ant Design 组件

### 2.5 路由配置

```typescript
// App.tsx
<Route path="/feeding" element={<Feeding />} />
```

### 2.6 状态管理

**无需新增 Redux Slice**，使用现有的 `servicesSlice`。

```typescript
// 在 Feeding 页面中过滤数据
const feedingServices = useAppSelector(
  state => state.services.list.filter(s => s.category === 'feeding')
);
```

---

## 3. 数据统计分析模块

### 3.1 需求分析

**业务需求：**
- 展示平台核心运营指标
- 提供多维度数据分析
- 支持数据驱动的决策

**用户需求：**
- 清晰的数据展示
- 直观的图表可视化
- 便捷的数据筛选

### 3.2 页面设计

#### 3.2.1 页面结构

```
┌─────────────────────────────────────────────┐
│  📊 数据统计分析                            │
│  数据更新时间：2026-06-11 12:00:00          │
├─────────────────────────────────────────────┤
│  🎯 核心指标（4个数字卡片）                 │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐│
│  │ 总用户  │ │ 总订单  │ │ 总收入  │ │ 平均   ││
│  │ 12,580  │ │ 8,965   │ │ ¥125万  │ │ 4.8分  ││
│  │ ↑12.5%  │ │ ↑8.3%   │ │ ↑15.2%  │ │ 优秀   ││
│  └────────┘ └────────┘ └────────┘ └────────┘│
├─────────────────────────────────────────────┤
│  📈 月度订单趋势（折线图）                  │
│  ┌─────────────────────────────────────────┐│
│  │     ╱╲    ╱╲                            ││
│  │    ╱  ╲  ╱  ╲   ╱╲                     ││
│  │   ╱    ╲╱    ╲ ╱  ╲                    ││
│  │  ╱              ╲╱    ╲                 ││
│  │ 1月 2月 3月 4月 5月 6月 7月 8月         ││
│  └─────────────────────────────────────────┘│
├────────────────────┬────────────────────────┤
│  🥧 服务分类统计    │  🏆 热门服务排行        │
│  ┌──────────────┐  │  ┌──────────────────┐  │
│  │    ╭───╮     │  │  │ 1. 基础洗护套餐  │  │
│  │   │   │     │  │  │    ¥98  1256单   │  │
│  │    ╰───╯     │  │  │ 2. 标准上门喂养  │  │
│  │  洗护 39%    │  │  │    ¥88  1120单   │  │
│  │  美容 24%    │  │  │ 3. 基础造型套餐  │  │
│  │  寄养 19%    │  │  │    ¥198  890单   │  │
│  │  喂养 18%    │  │  └──────────────────┘  │
│  └──────────────┘  │                        │
├────────────────────┼────────────────────────┤
│  👥 用户分析        │  ⭐ 评分分布            │
│  ┌──────────────┐  │  ┌──────────────────┐  │
│  │ 新用户  2,560 │  │  │ 5星 ████████ 73% │  │
│  │ 活跃用户 8,920│  │  │ 4星 ███     17%  │  │
│  │ 复购用户 5,860│  │  │ 3星 █        8%  │  │
│  │ 复购率  68%  │  │  │ 2星 ▏      1.5% │  │
│  └──────────────┘  │  │ 1星 ▏      0.5% │  │
│                    │  └──────────────────┘  │
├────────────────────┼────────────────────────┤
│  🐾 宠物类型分布    │  ⏰ 服务时段分析        │
│  ┌──────────────┐  │  ┌──────────────────┐  │
│  │  🐕          │  │  │ 上午  ████  36%   │  │
│  │  狗狗  58%   │  │  │ 下午  █████ 46%   │  │
│  │  🐈          │  │  │ 晚上  ███  18%    │  │
│  │  猫咪  37%   │  │  └──────────────────┘  │
│  │  🐰          │  │                        │
│  │  其他   5%   │  │                        │
│  └──────────────┘  │                        │
└────────────────────┴────────────────────────┘
```

#### 3.2.2 页面元素

**1. 核心指标卡片**
- 数量：4个
- 内容：指标名称、数值、环比变化
- 样式：数字卡片，带图标和趋势标签

**2. 月度订单趋势（折线图）**
- 图表类型：ECharts 折线图
- 数据：近8个月订单量
- 交互：悬停显示详情

**3. 服务分类统计（饼图）**
- 图表类型：ECharts 饼图
- 数据：4个服务分类占比
- 交互：点击显示详情

**4. 热门服务排行**
- 数量：Top 6
- 内容：排名、服务名称、价格、销量
- 样式：排行榜列表

**5. 用户分析**
- 内容：新用户、活跃用户、复购用户
- 样式：数字卡片

**6. 评分分布（柱状图）**
- 图表类型：ECharts 柱状图
- 数据：1-5星评分分布
- 交互：悬停显示详情

**7. 宠物类型分布（饼图）**
- 图表类型：ECharts 饼图
- 数据：狗狗、猫咪、其他
- 交互：点击显示详情

**8. 服务时段分析**
- 内容：上午、下午、晚上
- 样式：进度条

### 3.3 数据模型

#### 3.3.1 统计数据类型

```typescript
// 统计数据接口
export interface StatisticsData {
  // 核心指标
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  averageRating: number;

  // 服务分类统计
  serviceCategories: {
    category: string;
    name: string;
    icon: string;
    orderCount: number;
    percentage: number;
  }[];

  // 热门服务排行
  topServices: {
    id: string;
    name: string;
    price: number;
    salesCount: number;
  }[];

  // 月度订单趋势
  monthlyTrend: {
    month: string;
    orders: number;
  }[];

  // 用户分析
  userAnalysis: {
    newUsers: number;
    activeUsers: number;
    repeatUsers: number;
  };

  // 评分分布
  ratingDistribution: {
    rating: number;
    count: number;
    percentage: number;
  }[];

  // 宠物类型分布
  petTypes: {
    type: string;
    name: string;
    icon: string;
    count: number;
    percentage: number;
  }[];

  // 服务时段分析
  timeSlots: {
    period: string;
    orders: number;
    percentage: number;
  }[];
}
```

#### 3.3.2 Mock 数据

```typescript
export const mockStatistics: StatisticsData = {
  totalUsers: 12580,
  totalOrders: 8965,
  totalRevenue: 1256789.50,
  averageRating: 4.8,

  serviceCategories: [
    { category: 'wash', name: '洗护', icon: '🛁', orderCount: 3520, percentage: 39 },
    { category: 'grooming', name: '美容', icon: '✂️', orderCount: 2180, percentage: 24 },
    { category: 'boarding', name: '寄养', icon: '🏠', orderCount: 1680, percentage: 19 },
    { category: 'feeding', name: '上门喂养', icon: '🍽️', orderCount: 1585, percentage: 18 },
  ],

  topServices: [
    { id: 'service-001', name: '基础洗护套餐', price: 9800, salesCount: 1256 },
    { id: 'service-008', name: '标准上门喂养', price: 8800, salesCount: 1120 },
    { id: 'service-004', name: '基础造型套餐', price: 19800, salesCount: 890 },
    { id: 'service-002', name: '精致洗护套餐', price: 16800, salesCount: 756 },
    { id: 'service-009', name: '精致上门喂养', price: 12800, salesCount: 623 },
    { id: 'service-006', name: '标准寄养', price: 12800, salesCount: 456 },
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
    { type: 'dog', name: '狗狗', icon: '🐕', count: 6580, percentage: 58 },
    { type: 'cat', name: '猫咪', icon: '🐈', count: 4250, percentage: 37 },
    { type: 'other', name: '其他', icon: '🐰', count: 580, percentage: 5 },
  ],

  timeSlots: [
    { period: '上午', orders: 3250, percentage: 36 },
    { period: '下午', orders: 4120, percentage: 46 },
    { period: '晚上', orders: 1595, percentage: 18 },
  ],
};
```

### 3.4 ECharts 图表配置

#### 3.4.1 折线图配置

```typescript
const lineChartOption: EChartsOption = {
  title: {
    text: '月度订单趋势',
    left: 'center',
  },
  tooltip: {
    trigger: 'axis',
    formatter: '{b}<br/>订单数: {c}',
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月'],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      name: '订单数',
      type: 'line',
      smooth: true,
      data: [680, 720, 850, 920, 1050, 1180, 1250, 1320],
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(255, 107, 53, 0.3)' },
            { offset: 1, color: 'rgba(255, 107, 53, 0.05)' },
          ],
        },
      },
      lineStyle: { color: '#FF6B35', width: 3 },
      itemStyle: { color: '#FF6B35' },
    },
  ],
};
```

#### 3.4.2 饼图配置

```typescript
const pieChartOption: EChartsOption = {
  title: {
    text: '服务分类统计',
    left: 'center',
  },
  tooltip: {
    trigger: 'item',
    formatter: '{b}: {c} ({d}%)',
  },
  legend: {
    orient: 'vertical',
    left: 'left',
  },
  series: [
    {
      name: '服务分类',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2,
      },
      label: {
        show: false,
        position: 'center',
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 20,
          fontWeight: 'bold',
        },
      },
      labelLine: { show: false },
      data: [
        { value: 3520, name: '洗护' },
        { value: 2180, name: '美容' },
        { value: 1680, name: '寄养' },
        { value: 1585, name: '上门喂养' },
      ],
    },
  ],
};
```

#### 3.4.3 柱状图配置

```typescript
const barChartOption: EChartsOption = {
  title: {
    text: '评分分布',
    left: 'center',
  },
  tooltip: {
    trigger: 'axis',
    formatter: '{b}<br/>评价数: {c}',
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    data: ['5星', '4星', '3星', '2星', '1星'],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      name: '评价数',
      type: 'bar',
      data: [6520, 1560, 680, 150, 55],
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: '#FF6B35' },
            { offset: 1, color: '#FF8555' },
          ],
        },
        borderRadius: [8, 8, 0, 0],
      },
    },
  ],
};
```

### 3.5 组件设计

#### 3.5.1 新增组件

**1. StatCard（统计卡片）**
```typescript
interface StatCardProps {
  title: string;
  value: number | string;
  prefix?: React.ReactNode;
  suffix?: string;
  trend?: 'up' | 'down';
  trendValue?: string;
  loading?: boolean;
}

// 功能：
// - 显示指标数值
// - 显示趋势变化
// - 加载状态
```

**2. SimpleChart（图表组件）**
```typescript
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';

interface SimpleChartProps {
  option: EChartsOption;
  height?: number;
  loading?: boolean;
}

// 功能：
// - 封装 ECharts
// - 响应式容器
// - 加载状态
// - 错误处理
```

**3. RankList（排行榜列表）**
```typescript
interface RankListProps {
  data: {
    id: string;
    name: string;
    price: number;
    salesCount: number;
  }[];
  maxItems?: number;
}

// 功能：
// - 显示排名列表
// - 前3名高亮显示
// - 点击查看详情
```

#### 3.5.2 复用组件

- `Card`, `Row`, `Col`, `Statistic` - Ant Design 组件
- `MainLayout` - 现有的布局组件

### 3.6 路由配置

```typescript
// App.tsx
<Route
  path="statistics"
  element={
    <ProtectedRoute>
      <Statistics />
    </ProtectedRoute>
  }
/>
```

### 3.7 状态管理

#### 3.7.1 新增 Redux Slice

```typescript
// store/slices/statisticsSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getStatistics } from '../../services/mock/statistics';
import type { StatisticsData } from '../../types';

interface StatisticsState {
  data: StatisticsData | null;
  loading: boolean;
  error: string | null;
}

const initialState: StatisticsState = {
  data: null,
  loading: false,
  error: null,
};

export const getStatisticsAsync = createAsyncThunk(
  'statistics/getStatistics',
  async () => {
    const response = await getStatistics();
    if (response.code === 0) {
      return response.data;
    }
    throw new Error(response.message);
  }
);

const statisticsSlice = createSlice({
  name: 'statistics',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getStatisticsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStatisticsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getStatisticsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '加载失败';
      });
  },
});

export default statisticsSlice.reducer;
```

#### 3.7.2 Store 配置

```typescript
// store/index.ts
import statisticsReducer from './slices/statisticsSlice';

export const store = configureStore({
  reducer: {
    // ... 其他 reducers
    statistics: statisticsReducer,
  },
});
```

### 3.8 API 服务

```typescript
// services/mock/statistics.ts
import type { ApiResponse, StatisticsData } from '../../types';
import { mockStatistics } from './data';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getStatistics = async (): Promise<ApiResponse<StatisticsData>> => {
  await delay(500);

  return {
    code: 0,
    message: 'success',
    data: mockStatistics,
    timestamp: Date.now(),
  };
};
```

---

## 4. 错误处理

### 4.1 页面级错误处理

```typescript
// 1. 加载状态
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

// 2. 错误边界
try {
  const response = await getStatistics();
  if (response.code === 0) {
    setData(response.data);
  } else {
    setError(response.message);
  }
} catch (err) {
  setError('网络请求失败，请稍后重试');
} finally {
  setLoading(false);
}

// 3. 用户友好的错误提示
if (error) {
  return (
    <Result
      status="error"
      title="加载失败"
      subTitle={error}
      extra={<Button onClick={retry}>重试</Button>}
    />
  );
}
```

### 4.2 组件级错误处理

```typescript
// 1. 图片加载失败
<img
  src={service.image}
  onError={(e) => {
    e.target.src = 'https://via.placeholder.com/400x300?text=宠物服务';
  }}
/>

// 2. 数据为空
{services.length === 0 ? (
  <Empty description="暂无上门喂养服务" />
) : (
  <ServiceCardList services={services} />
)}

// 3. 图表加载失败
<SimpleChart
  option={option}
  loading={loading}
  fallback={<div>图表加载失败</div>}
/>
```

### 4.3 网络错误处理

```typescript
// 请求超时
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 10000);

try {
  const response = await fetch(url, {
    signal: controller.signal,
  });
  clearTimeout(timeoutId);
  // 处理响应
} catch (error) {
  if (error.name === 'AbortError') {
    setError('请求超时，请检查网络连接');
  } else {
    setError('网络请求失败，请稍后重试');
  }
}
```

---

## 5. 测试策略

### 5.1 单元测试

#### 5.1.1 工具函数测试

```typescript
describe('formatPrice', () => {
  it('should format cents to yuan', () => {
    expect(formatPrice(8800)).toBe('88.00');
  });

  it('should handle zero', () => {
    expect(formatPrice(0)).toBe('0.00');
  });
});
```

#### 5.1.2 组件测试

```typescript
describe('StatCard', () => {
  it('should display correct value', () => {
    render(<StatCard title="用户数" value={12580} />);
    expect(screen.getByText('12,580')).toBeInTheDocument();
  });

  it('should display trend up', () => {
    render(<StatCard title="用户数" value={12580} trend="up" trendValue="12.5%" />);
    expect(screen.getByText('↑ 12.5%')).toBeInTheDocument();
  });
});
```

#### 5.1.3 Redux Slice 测试

```typescript
describe('statisticsSlice', () => {
  it('should handle getStatisticsAsync.pending', () => {
    const initialState = { data: null, loading: false, error: null };
    const state = statisticsSlice.reducer(initialState, getStatisticsAsync.pending());
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle getStatisticsAsync.fulfilled', () => {
    const initialState = { data: null, loading: true, error: null };
    const mockData = { totalUsers: 100, totalOrders: 50 };
    const state = statisticsSlice.reducer(
      initialState,
      getStatisticsAsync.fulfilled(mockData)
    );
    expect(state.loading).toBe(false);
    expect(state.data).toEqual(mockData);
  });
});
```

### 5.2 集成测试

#### 5.2.1 页面加载测试

```typescript
describe('Feeding Page', () => {
  it('should display all feeding services', async () => {
    render(<Feeding />);
    await waitForElementToBeRemoved(() => screen.getByRole('progressbar'));

    expect(screen.getByText('标准上门喂养')).toBeInTheDocument();
    expect(screen.getByText('精致上门喂养')).toBeInTheDocument();
    expect(screen.getByText('长期上门喂养套餐')).toBeInTheDocument();
  });

  it('should navigate to order page on button click', async () => {
    render(<Feeding />);
    const button = screen.getByText('立即预约');
    fireEvent.click(button);
    expect(window.location.pathname).toBe('/orders');
  });
});

describe('Statistics Page', () => {
  it('should fetch and display statistics', async () => {
    render(<Statistics />);

    await waitFor(() => {
      expect(screen.getByText('12,580')).toBeInTheDocument(); // 用户数
      expect(screen.getByText('8,965')).toBeInTheDocument();  // 订单数
    });
  });

  it('should display charts', async () => {
    render(<Statistics />);
    await waitForElementToBeRemoved(() => screen.getByRole('progressbar'));

    // 检查图表容器是否存在
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
  });
});
```

### 5.3 E2E 测试

```typescript
describe('Statistics Page E2E', () => {
  it('should load statistics page', () => {
    cy.visit('/statistics');
    cy.contains('数据统计分析');
    cy.contains('总用户数');
    cy.contains('总订单数');
  });

  it('should display charts', () => {
    cy.visit('/statistics');
    cy.get('[data-testid="line-chart"]').should('be.visible');
    cy.get('[data-testid="pie-chart"]').should('be.visible');
  });
});
```

---

## 6. 性能优化

### 6.1 代码分割

```typescript
// 懒加载页面组件
const Feeding = lazy(() => import('./pages/Feeding'));
const Statistics = lazy(() => import('./pages/Statistics'));

// 路由配置
<Route
  path="feeding"
  element={
    <Suspense fallback={<Spin />}>
      <Feeding />
    </Suspense>
  }
/>
```

### 6.2 图表优化

```typescript
// 按需引入 ECharts
import * as echarts from 'echarts/core';
import { LineChart, PieChart, BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([LineChart, PieChart, BarChart, CanvasRenderer]);
```

### 6.3 数据缓存

```typescript
// 统计数据缓存5分钟
const CACHE_DURATION = 5 * 60 * 1000;

export const getStatistics = async () => {
  const cached = localStorage.getItem('statistics');
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_DURATION) {
      return data;
    }
  }

  const response = await fetchStatistics();
  localStorage.setItem('statistics', JSON.stringify({
    data: response,
    timestamp: Date.now(),
  }));

  return response;
};
```

---

## 7. 部署考虑

### 7.1 构建配置

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          echarts: ['echarts'],
          antd: ['antd'],
        },
      },
    },
  },
});
```

### 7.2 环境变量

```typescript
// .env.production
VITE_API_BASE_URL=https://api.example.com
VITE_ENABLE_CACHE=true
VITE_CACHE_DURATION=300000
```

---

## 8. 后续扩展

### 8.1 上门喂养服务模块

- [ ] 添加地图定位功能，显示宠物师位置
- [ ] 添加实时聊天功能
- [ ] 添加宠物师评价系统
- [ ] 添加紧急联系功能
- [ ] 添加服务预约日历

### 8.2 数据统计分析模块

- [ ] 添加数据导出功能（Excel/PDF）
- [ ] 添加日期范围筛选
- [ ] 添加数据对比功能（同比/环比）
- [ ] 添加图表交互功能（点击查看详情）
- [ ] 添加实时数据更新
- [ ] 添加权限控制（管理员可见）

---

## 9. 附录

### 9.1 文件清单

**新增文件：**
```
src/
├── pages/
│   ├── Feeding/
│   │   ├── index.tsx         # 上门喂养服务页面
│   │   └── index.ts          # 导出文件
│   └── Statistics/
│       ├── index.tsx         # 数据统计分析页面
│       └── index.ts          # 导出文件
├── components/
│   ├── business/
│   │   └── StatCard.tsx      # 统计卡片组件
│   └── common/
│       └── SimpleChart.tsx   # 图表组件
├── services/
│   └── mock/
│       ├── statistics.ts     # 统计数据API
│       └── data.ts           # 统计数据Mock数据
├── store/
│   └── slices/
│       └── statisticsSlice.ts # 统计状态管理
└── types/
    └── index.ts              # 类型定义扩展
```

**修改文件：**
```
src/
├── App.tsx                   # 添加路由配置
├── pages/
│   └── Home/
│       └── index.tsx         # 更新首页分类
├── services/
│   └── mock/
│       ├── data.ts           # 添加上门喂养服务数据
│       └── services.ts       # 更新服务分类统计
└── types/
    └── index.ts              # 添加新类型定义
```

### 9.2 依赖清单

```json
{
  "dependencies": {
    "echarts": "^5.5.0",
    "echarts-for-react": "^3.0.2"
  }
}
```

### 9.3 参考文档

- [ECharts 官方文档](https://echarts.apache.org/zh/index.html)
- [echarts-for-react GitHub](https://github.com/hustcc/echarts-for-react)
- [Ant Design 官方文档](https://ant.design/)
- [Redux Toolkit 官方文档](https://redux-toolkit.js.org/)

---

**文档结束**

**下一步行动：**
1. ✅ 用户审查设计文档
2. 📝 创建实施计划
3. 🚀 开始编码实现