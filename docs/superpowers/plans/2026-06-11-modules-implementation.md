# 宠物服务平台 - 新增模块实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为宠物服务平台添加上门喂养服务模块和数据统计分析模块，包含完整的UI展示和数据可视化功能。

**Architecture:** 遵循现有项目架构，使用React函数组件+Hooks模式，ECharts实现图表可视化，Redux Toolkit管理状态。新增组件保持高内聚低耦合，便于维护和扩展。

**Tech Stack:** React 18, TypeScript 5, Ant Design 5, Redux Toolkit 2, ECharts 5, echarts-for-react 3, React Router 6

---

## 文件结构

### 新增文件
```
src/
├── components/
│   ├── business/
│   │   ├── StatCard.tsx          # 统计卡片组件（显示指标数值和趋势）
│   │   └── RankList.tsx          # 排行榜列表组件（热门服务排行）
│   └── common/
│       └── SimpleChart.tsx       # 通用图表组件（ECharts封装）
├── pages/
│   ├── Feeding/
│   │   ├── components/
│   │   │   ├── ServiceCarousel.tsx   # 服务轮播横幅组件
│   │   │   ├── ServiceProcess.tsx    # 服务流程组件
│   │   │   └── FAQSection.tsx        # 常见问题组件
│   │   └── index.tsx                 # 主页面（更新）
│   └── Statistics/
│       └── index.tsx                 # 统计页面（更新）
├── store/
│   └── slices/
│       └── statisticsSlice.ts        # 统计数据状态管理
└── services/
    └── mock/
        └── statistics.ts             # 统计数据API（已存在）
```

### 修改文件
```
src/
├── store/index.ts                    # 添加statistics reducer
├── pages/Feeding/index.tsx           # 重构为综合展示页面
├── pages/Statistics/index.tsx        # 集成ECharts图表
└── types/index.ts                    # 添加新类型（已完成）
```

---

## Task 1: 安装依赖

**Files:**
- Modify: `package.json`

- [ ] **Step 1: 安装ECharts依赖**

```bash
npm install echarts echarts-for-react
```

- [ ] **Step 2: 验证安装**

```bash
npm list echarts echarts-for-react
```

Expected: 显示安装版本号

- [ ] **Step 3: 提交**

```bash
git add package.json package-lock.json
git commit -m "deps: add echarts and echarts-for-react for data visualization"
```

---

## Task 2: 创建通用统计卡片组件

**Files:**
- Create: `src/components/business/StatCard.tsx`

- [ ] **Step 1: 创建组件文件**

```typescript
import React from 'react';
import { Card, Statistic, Tag } from 'antd';
import { RiseOutlined, FallOutlined } from '@ant-design/icons';

interface StatCardProps {
  title: string;
  value: number | string;
  prefix?: React.ReactNode;
  suffix?: string;
  trend?: 'up' | 'down';
  trendValue?: string;
  loading?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  prefix,
  suffix,
  trend,
  trendValue,
  loading = false,
}) => {
  return (
    <Card style={{ borderRadius: 16, textAlign: 'center' }} loading={loading}>
      <Statistic
        title={title}
        value={value}
        prefix={prefix}
        suffix={suffix}
      />
      {trend && trendValue && (
        <div style={{ marginTop: 16 }}>
          <Tag color={trend === 'up' ? 'green' : 'red'}>
            {trend === 'up' ? <RiseOutlined /> : <FallOutlined />} {trendValue}
          </Tag>
        </div>
      )}
    </Card>
  );
};

export default StatCard;
```

- [ ] **Step 2: 提交**

```bash
git add src/components/business/StatCard.tsx
git commit -m "feat: add StatCard component for statistics display"
```

---

## Task 3: 创建通用图表组件

**Files:**
- Create: `src/components/common/SimpleChart.tsx`

- [ ] **Step 1: 创建组件文件**

```typescript
import React from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { Spin } from 'antd';

interface SimpleChartProps {
  option: EChartsOption;
  height?: number;
  loading?: boolean;
  style?: React.CSSProperties;
}

export const SimpleChart: React.FC<SimpleChartProps> = ({
  option,
  height = 400,
  loading = false,
  style,
}) => {
  return (
    <Spin spinning={loading}>
      <div style={{ minHeight: height, ...style }}>
        <ReactECharts
          option={option}
          style={{ height: `${height}px`, width: '100%' }}
          opts={{ renderer: 'canvas' }}
          notMerge={true}
          lazyUpdate={true}
        />
      </div>
    </Spin>
  );
};

export default SimpleChart;
```

- [ ] **Step 2: 提交**

```bash
git add src/components/common/SimpleChart.tsx
git commit -m "feat: add SimpleChart component for ECharts wrapper"
```

---

## Task 4: 创建排行榜列表组件

**Files:**
- Create: `src/components/business/RankList.tsx`

- [ ] **Step 1: 创建组件文件**

```typescript
import React from 'react';
import { Card, Tag } from 'antd';

interface RankItem {
  id: string;
  name: string;
  price: number;
  salesCount: number;
}

interface RankListProps {
  data: RankItem[];
  maxItems?: number;
}

export const RankList: React.FC<RankListProps> = ({
  data,
  maxItems = 6,
}) => {
  const displayData = data.slice(0, maxItems);

  return (
    <div className="flex-col gap-4">
      {displayData.map((item, index) => (
        <Card
          key={item.id}
          style={{
            borderRadius: 12,
            border: index < 3 ? '2px solid #FF6B35' : undefined,
          }}
          hoverable
        >
          <div className="flex items-center gap-4">
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: index < 3 ? '#FF6B35' : '#d9d9d9',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                fontWeight: 'bold',
              }}
            >
              {index + 1}
            </div>
            <div style={{ flex: 1 }}>
              <div className="flex items-center justify-between">
                <span style={{ fontWeight: 500 }}>{item.name}</span>
                <Tag color="blue">{item.salesCount} 单</Tag>
              </div>
              <div style={{ marginTop: 8 }}>
                <span type="secondary">¥{(item.price / 100).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default RankList;
```

- [ ] **Step 2: 提交**

```bash
git add src/components/business/RankList.tsx
git commit -m "feat: add RankList component for top services ranking"
```

---

## Task 5: 创建Feeding页面子组件 - ServiceCarousel

**Files:**
- Create: `src/pages/Feeding/components/ServiceCarousel.tsx`

- [ ] **Step 1: 创建组件文件**

```typescript
import React, { useState, useEffect } from 'react';
import { Carousel } from 'antd';

interface ServiceCarouselProps {
  images: string[];
  title: string;
  subtitle: string;
}

export const ServiceCarousel: React.FC<ServiceCarouselProps> = ({
  images,
  title,
  subtitle,
}) => {
  return (
    <Carousel autoplay autoplaySpeed={5000} style={{ borderRadius: 16, overflow: 'hidden' }}>
      {images.map((image, index) => (
        <div key={index}>
          <div
            style={{
              height: 300,
              backgroundImage: `url(${image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              <h2 style={{ fontSize: 36, marginBottom: 16, color: 'white' }}>{title}</h2>
              <p style={{ fontSize: 18, color: 'rgba(255, 255, 255, 0.9)' }}>{subtitle}</p>
            </div>
          </div>
        </div>
      ))}
    </Carousel>
  );
};

export default ServiceCarousel;
```

- [ ] **Step 2: 提交**

```bash
git add src/pages/Feeding/components/ServiceCarousel.tsx
git commit -m "feat: add ServiceCarousel component for feeding page banner"
```

---

## Task 6: 创建Feeding页面子组件 - ServiceProcess

**Files:**
- Create: `src/pages/Feeding/components/ServiceProcess.tsx`

- [ ] **Step 1: 创建组件文件**

```typescript
import React from 'react';
import { Card } from 'antd';

interface ProcessStep {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface ServiceProcessProps {
  steps: ProcessStep[];
  currentStep?: number;
}

export const ServiceProcess: React.FC<ServiceProcessProps> = ({
  steps,
  currentStep = -1,
}) => {
  return (
    <div className="grid grid-cols-5 gap-4">
      {steps.map((step, index) => (
        <div key={index} style={{ textAlign: 'center' }}>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              backgroundColor: index <= currentStep ? '#FF6B35' : '#f0f0f0',
              color: index <= currentStep ? 'white' : '#999',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              fontWeight: 'bold',
              margin: '0 auto 16px',
            }}
          >
            {step.icon || index + 1}
          </div>
          <h4 style={{ marginBottom: 8, fontSize: 16 }}>{step.title}</h4>
          <p type="secondary" style={{ fontSize: 12 }}>{step.description}</p>
          {index < steps.length - 1 && (
            <div
              style={{
                position: 'absolute',
                top: 30,
                left: '50%',
                width: '100%',
                height: 2,
                backgroundColor: '#f0f0f0',
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default ServiceProcess;
```

- [ ] **Step 2: 提交**

```bash
git add src/pages/Feeding/components/ServiceProcess.tsx
git commit -m "feat: add ServiceProcess component for feeding service flow"
```

---

## Task 7: 创建Feeding页面子组件 - FAQSection

**Files:**
- Create: `src/pages/Feeding/components/FAQSection.tsx`

- [ ] **Step 1: 创建组件文件**

```typescript
import React from 'react';
import { Collapse } from 'antd';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQ[];
}

export const FAQSection: React.FC<FAQSectionProps> = ({ faqs }) => {
  const items = faqs.map((faq, index) => ({
    key: String(index),
    label: <span style={{ fontWeight: 500 }}>{faq.question}</span>,
    children: <p style={{ margin: 0 }}>{faq.answer}</p>,
  }));

  return (
    <Collapse
      items={items}
      defaultActiveKey={['0']}
      style={{ borderRadius: 16, overflow: 'hidden' }}
    />
  );
};

export default FAQSection;
```

- [ ] **Step 2: 提交**

```bash
git add src/pages/Feeding/components/FAQSection.tsx
git commit -m "feat: add FAQSection component for feeding page FAQ"
```

---

## Task 8: 更新Feeding页面 - 实现综合展示UI

**Files:**
- Modify: `src/pages/Feeding/index.tsx`

- [ ] **Step 1: 备份现有文件**

```bash
cp src/pages/Feeding/index.tsx src/pages/Feeding/index.tsx.bak
```

- [ ] **Step 2: 重写Feeding页面**

```typescript
import React, { useEffect, useState } from 'react';
import { Typography, Card, Button, Space, Tag } from 'antd';
import {
  CheckCircleOutlined,
  PhoneOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  HomeOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { useAppSelector } from '../../hooks';
import ServiceCarousel from './components/ServiceCarousel';
import ServiceProcess from './components/ServiceProcess';
import FAQSection from './components/FAQSection';
import type { Service } from '../../types';

const { Title, Text, Paragraph } = Typography;

const Feeding: React.FC = () => {
  const services = useAppSelector(
    state => state.services.list.filter(s => s.category === 'feeding')
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟加载延迟
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // 轮播图数据
  const carouselImages = [
    'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=1200',
    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1200',
    'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1200',
  ];

  // 服务流程数据
  const processSteps = [
    { title: '选择服务', description: '选择适合的服务类型', icon: <HomeOutlined /> },
    { title: '预约时间', description: '选择上门服务时间', icon: <CalendarOutlined /> },
    { title: '确认地址', description: '填写详细地址信息', icon: <CheckCircleOutlined /> },
    { title: '宠物师上门', description: '专业宠物师按时到达', icon: <SafetyCertificateOutlined /> },
    { title: '服务完成', description: '拍照反馈，服务完成', icon: <CheckCircleOutlined /> },
  ];

  // FAQ数据
  const faqs = [
    {
      question: '宠物师资质如何？',
      answer: '所有宠物师均经过专业培训，持有相关资格证书，至少有2年以上宠物护理经验。我们还会定期进行技能考核和培训。',
    },
    {
      question: '服务过程中宠物生病怎么办？',
      answer: '我们提供全程保险保障，如服务过程中宠物出现健康问题，我们会立即联系合作兽医进行处理，费用由平台承担。',
    },
    {
      question: '如何确保服务安全？',
      answer: '所有宠物师都经过严格的背景调查，服务过程中会佩戴专业设备，全程录像监控，确保服务安全可靠。',
    },
    {
      question: '可以取消预约吗？',
      answer: '可以，请提前24小时取消预约，全额退款。24小时内取消将收取30%的手续费。',
    },
    {
      question: '服务时间是什么时候？',
      answer: '我们的服务时间是每天08:00-20:00，您可以根据自己的需求预约合适的时间段。',
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center" style={{ padding: 100 }}>
        <div className="flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
          <Text type="secondary" style={{ marginTop: 16 }}>加载中...</Text>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-col gap-8">
      {/* 服务轮播横幅 */}
      <ServiceCarousel
        images={carouselImages}
        title="上门喂养服务"
        subtitle="专业宠物师贴心上门，让您的宠物在您不在时也能得到最好的照顾"
      />

      {/* 服务卡片网格 */}
      <div>
        <Title level={3} style={{ marginBottom: 24 }}>
          🎯 选择服务
        </Title>
        <div className="grid grid-cols-3 gap-6">
          {services.map((service) => (
            <Card
              key={service.id}
              hoverable
              style={{ borderRadius: 16 }}
              cover={
                <img
                  src={JSON.parse(service.images)[0]}
                  alt={service.name}
                  style={{ height: 200, objectFit: 'cover' }}
                />
              }
            >
              <Card.Meta
                title={service.name}
                description={
                  <div className="flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <Text strong style={{ color: '#FF6B35', fontSize: 20 }}>
                        ¥{(service.price / 100).toFixed(2)}
                      </Text>
                      <Text type="secondary">{service.duration}分钟</Text>
                    </div>
                    <Paragraph ellipsis={{ tooltip: service.description }}>
                      {service.description}
                    </Paragraph>
                    <div className="flex items-center gap-4">
                      <Text type="secondary">评分：{service.rating}</Text>
                      <Text type="secondary">销量：{service.salesCount}</Text>
                    </div>
                    <Button
                      type="primary"
                      block
                      style={{
                        borderRadius: 20,
                        backgroundColor: '#FF6B35',
                        borderColor: '#FF6B35',
                      }}
                    >
                      立即预约
                    </Button>
                  </div>
                }
              />
            </Card>
          ))}
        </div>
      </div>

      {/* 服务流程 */}
      <Card style={{ borderRadius: 16 }}>
        <Title level={3} style={{ marginBottom: 24, textAlign: 'center' }}>
          📋 服务流程
        </Title>
        <ServiceProcess steps={processSteps} />
      </Card>

      {/* 常见问题 */}
      <Card style={{ borderRadius: 16 }}>
        <Title level={3} style={{ marginBottom: 24 }}>
          ❓ 常见问题
        </Title>
        <FAQSection faqs={faqs} />
      </Card>

      {/* 联系方式 */}
      <Card style={{ borderRadius: 16, backgroundColor: '#FFF8F0' }}>
        <Title level={3} style={{ marginBottom: 24, textAlign: 'center' }}>
          📞 联系我们
        </Title>
        <div className="grid grid-cols-2 gap-8">
          <div className="flex items-center gap-4">
            <PhoneOutlined style={{ fontSize: 32, color: '#FF6B35' }} />
            <div>
              <Text type="secondary">客服热线</Text>
              <div>
                <Text strong style={{ fontSize: 24 }}>400-888-8888</Text>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ClockCircleOutlined style={{ fontSize: 32, color: '#FF6B35' }} />
            <div>
              <Text type="secondary">服务时间</Text>
              <div>
                <Text strong style={{ fontSize: 24 }}>08:00 - 20:00</Text>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Feeding;
```

- [ ] **Step 3: 提交**

```bash
git add src/pages/Feeding/index.tsx
git commit -m "feat: redesign Feeding page with comprehensive service display"
```

---

## Task 9: 创建Redux statisticsSlice

**Files:**
- Create: `src/store/slices/statisticsSlice.ts`

- [ ] **Step 1: 创建文件**

```typescript
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

- [ ] **Step 2: 提交**

```bash
git add src/store/slices/statisticsSlice.ts
git commit -m "feat: add statisticsSlice for statistics state management"
```

---

## Task 10: 更新store配置

**Files:**
- Modify: `src/store/index.ts`

- [ ] **Step 1: 更新文件**

```typescript
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import petsReducer from './slices/petsSlice';
import servicesReducer from './slices/servicesSlice';
import ordersReducer from './slices/ordersSlice';
import reviewsReducer from './slices/reviewsSlice';
import afterSalesReducer from './slices/afterSalesSlice';
import statisticsReducer from './slices/statisticsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    pets: petsReducer,
    services: servicesReducer,
    orders: ordersReducer,
    reviews: reviewsReducer,
    afterSales: afterSalesReducer,
    statistics: statisticsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

- [ ] **Step 2: 提交**

```bash
git add src/store/index.ts
git commit -m "feat: add statistics reducer to store configuration"
```

---

## Task 11: 更新Statistics页面 - 集成ECharts图表

**Files:**
- Modify: `src/pages/Statistics/index.tsx`

- [ ] **Step 1: 备份现有文件**

```bash
cp src/pages/Statistics/index.tsx src/pages/Statistics/index.tsx.bak
```

- [ ] **Step 2: 重写Statistics页面**

```typescript
import React, { useEffect } from 'react';
import { Typography, Card, Row, Col, Tag, Progress, Empty, Result, Button } from 'antd';
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  StarOutlined,
  RiseOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { getStatisticsAsync } from '../../store/slices/statisticsSlice';
import StatCard from '../../components/business/StatCard';
import SimpleChart from '../../components/common/SimpleChart';
import RankList from '../../components/business/RankList';
import type { EChartsOption } from 'echarts';

const { Title, Text } = Typography;

const Statistics: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector(state => state.statistics);

  useEffect(() => {
    dispatch(getStatisticsAsync());
  }, [dispatch]);

  // 折线图配置
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
      data: data?.monthlyTrend.map(m => m.month) || [],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '订单数',
        type: 'line',
        smooth: true,
        data: data?.monthlyTrend.map(m => m.orders) || [],
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

  // 饼图配置 - 服务分类
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
        data: data?.serviceCategories.map(c => ({
          value: c.orderCount,
          name: c.name,
        })) || [],
      },
    ],
  };

  // 柱状图配置 - 评分分布
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
        data: data?.ratingDistribution.map(r => r.count) || [],
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

  // 错误处理
  if (error) {
    return (
      <Result
        status="error"
        title="加载失败"
        subTitle={error}
        extra={
          <Button type="primary" onClick={() => dispatch(getStatisticsAsync())}>
            重试
          </Button>
        }
      />
    );
  }

  return (
    <div className="flex-col gap-8">
      {/* 页面标题 */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <Title level={2}>📊 数据统计分析</Title>
        <Text type="secondary">平台运营数据总览</Text>
      </div>

      {/* 核心指标 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="总用户数"
            value={data?.totalUsers || 0}
            prefix={<UserOutlined style={{ color: '#1890ff' }} />}
            suffix="人"
            trend="up"
            trendValue="+12.5%"
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="总订单数"
            value={data?.totalOrders || 0}
            prefix={<ShoppingCartOutlined style={{ color: '#52c41a' }} />}
            suffix="单"
            trend="up"
            trendValue="+8.3%"
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="总收入"
            value={data?.totalRevenue || 0}
            prefix={<DollarOutlined style={{ color: '#faad14' }} />}
            suffix="元"
            precision={2}
            trend="up"
            trendValue="+15.2%"
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="平均评分"
            value={data?.averageRating || 0}
            prefix={<StarOutlined style={{ color: '#f5222d' }} />}
            precision={1}
            loading={loading}
          />
        </Col>
      </Row>

      {/* 月度订单趋势 */}
      <Card style={{ borderRadius: 16 }}>
        <SimpleChart
          option={lineChartOption}
          height={400}
          loading={loading}
          data-testid="line-chart"
        />
      </Card>

      {/* 服务分类统计 & 热门服务排行 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card style={{ borderRadius: 16, height: '100%' }}>
            <SimpleChart
              option={pieChartOption}
              height={400}
              loading={loading}
              data-testid="pie-chart"
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card style={{ borderRadius: 16, height: '100%' }}>
            <Title level={3} style={{ marginBottom: 24 }}>
              🔥 热门服务排行
            </Title>
            {data ? (
              <RankList data={data.topServices} maxItems={6} />
            ) : (
              <Empty description="暂无数据" />
            )}
          </Card>
        </Col>
      </Row>

      {/* 用户分析 & 评分分布 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card style={{ borderRadius: 16 }}>
            <Title level={3} style={{ marginBottom: 24 }}>
              👥 用户分析
            </Title>
            <div className="flex-col gap-4">
              <div className="flex items-center justify-between">
                <Text>新用户</Text>
                <div className="flex items-center gap-2">
                  <Text strong>{data?.userAnalysis.newUsers || 0}</Text>
                  <Tag color="green">
                    <RiseOutlined /> +18%
                  </Tag>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Text>活跃用户</Text>
                <div className="flex items-center gap-2">
                  <Text strong>{data?.userAnalysis.activeUsers || 0}</Text>
                  <Tag color="green">
                    <RiseOutlined /> +12%
                  </Tag>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Text>复购用户</Text>
                <div className="flex items-center gap-2">
                  <Text strong>{data?.userAnalysis.repeatUsers || 0}</Text>
                  <Tag color="blue">复购率 68%</Tag>
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card style={{ borderRadius: 16 }}>
            <Title level={3} style={{ marginBottom: 24 }}>
              ⭐ 评分分布
            </Title>
            <SimpleChart
              option={barChartOption}
              height={300}
              loading={loading}
              data-testid="bar-chart"
            />
          </Card>
        </Col>
      </Row>

      {/* 宠物类型分布 & 服务时段分析 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card style={{ borderRadius: 16 }}>
            <Title level={3} style={{ marginBottom: 24 }}>
              🐾 宠物类型分布
            </Title>
            <Row gutter={[16, 16]}>
              {data?.petTypes.map((pet) => (
                <Col xs={8} key={pet.type}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 48, marginBottom: 8 }}>{pet.icon}</div>
                    <Title level={4}>{pet.name}</Title>
                    <Text type="secondary">{pet.count} 只</Text>
                    <Progress
                      percent={pet.percentage}
                      strokeColor="#FF6B35"
                      style={{ marginTop: 8 }}
                    />
                  </div>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card style={{ borderRadius: 16 }}>
            <Title level={3} style={{ marginBottom: 24 }}>
              ⏰ 服务时段分析
            </Title>
            <Row gutter={[16, 16]}>
              {data?.timeSlots.map((slot) => (
                <Col xs={8} key={slot.period}>
                  <div style={{ textAlign: 'center' }}>
                    <Title level={4}>{slot.period}</Title>
                    <Text type="secondary">{slot.orders} 单</Text>
                    <Progress
                      percent={slot.percentage}
                      strokeColor="#FF6B35"
                      style={{ marginTop: 8 }}
                    />
                  </div>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Statistics;
```

- [ ] **Step 3: 提交**

```bash
git add src/pages/Statistics/index.tsx
git commit -m "feat: integrate ECharts charts to Statistics page"
```

---

## Task 12: 测试两个页面功能

- [ ] **Step 1: 启动开发服务器**

```bash
npm run dev
```

- [ ] **Step 2: 测试Feeding页面**

访问: `http://localhost:5173/feeding`

验证点：
- ✅ 轮播图正常显示和自动切换
- ✅ 服务卡片网格正确展示3个服务
- ✅ 服务流程步骤指示器显示正确
- ✅ FAQ折叠面板可以展开/收起
- ✅ 联系方式显示正确
- ✅ 橙色主题风格一致

- [ ] **Step 3: 测试Statistics页面**

访问: `http://localhost:5173/statistics`

验证点：
- ✅ 核心指标卡片显示正确
- ✅ 折线图正常渲染
- ✅ 饼图正常渲染
- ✅ 柱状图正常渲染
- ✅ 排行榜列表显示正确
- ✅ 用户分析数据正确
- ✅ 宠物类型分布显示正确
- ✅ 服务时段分析显示正确
- ✅ 加载状态正常显示
- ✅ 错误处理正常工作

- [ ] **Step 4: 测试路由和权限**

验证点：
- ✅ 未登录访问 `/statistics` 跳转到登录页
- ✅ 登录后访问 `/statistics` 正常显示
- ✅ `/feeding/:id` 路由正常

- [ ] **Step 5: 提交测试结果**

```bash
git add .
git commit -m "test: verify Feeding and Statistics pages functionality"
```

---

## 完成检查清单

实施完成后，请确认以下所有项：

- ✅ ECharts依赖已安装
- ✅ StatCard组件创建完成
- ✅ SimpleChart组件创建完成
- ✅ RankList组件创建完成
- ✅ Feeding页面子组件创建完成
- ✅ Feeding页面UI更新完成
- ✅ Redux statisticsSlice创建完成
- ✅ Store配置更新完成
- ✅ Statistics页面集成ECharts完成
- ✅ 两个页面功能测试通过
- ✅ 路由和权限测试通过
- ✅ 代码提交完成

---

## 后续优化建议

1. **性能优化**
   - 实现图表懒加载
   - 添加数据缓存机制
   - 优化组件渲染性能

2. **功能增强**
   - 添加数据导出功能
   - 添加日期范围筛选
   - 添加图表交互功能

3. **用户体验**
   - 添加更多加载动画
   - 优化移动端适配
   - 添加数据刷新按钮

---

**计划完成时间：** 2026-06-11
**预计实施时长：** 2-3小时