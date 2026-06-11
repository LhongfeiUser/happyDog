# 宠物服务平台设计规格说明

## 项目概述

**项目名称：** 宠物服务平台（Pet Service Platform）

**项目目标：** 构建一个面向宠物主人的PC端服务平台，提供宠物洗护、美容、寄养等服务的在线预约和管理功能。

**目标用户：** 宠物主人（C端用户）

**第一版范围：** PC端用户功能，不包含商家端

---

## 核心功能

### 1. 用户系统

**注册/登录方式：** 手机号 + 密码

**功能清单：**
- 手机号注册（设置密码）
- 手机号+密码登录
- 忘记密码（手机号验证重置）
- 个人信息管理
- 退出登录

### 2. 养宠档案

**信息分类：**

**基础信息：**
- 宠物名字
- 宠物品种
- 年龄
- 性别
- 体重
- 宠物照片

**健康信息：**
- 疫苗记录
- 绝育状态
- 病史
- 过敏信息

**管理功能：**
- 添加宠物
- 编辑宠物信息
- 删除宠物
- 设置默认宠物

### 3. 服务类型

**洗护服务：**
- 基础洗护（洗澡、吹干、基础护理）
- 精致洗护（深层清洁、毛发护理）
- SPA护理（药浴、按摩）

**美容服务：**
- 造型设计
- 毛发修剪
- 染色服务

**寄养服务：**
- 日托（白天寄养）
- 长期寄养（多天寄养）

### 4. 下单流程

**分步向导流程：**

**步骤1：选择服务**
- 浏览服务列表
- 选择具体服务项目
- 查看服务详情和价格

**步骤2：选择宠物**
- 显示用户已添加的宠物列表
- 选择需要服务的宠物
- 可添加新宠物

**步骤3：选择时间**
- 日历选择预约日期
- 时间段选择（上午/下午/具体时间）
- 显示可预约时段

**步骤4：填写信息**
- 服务备注（特殊要求、注意事项）
- 选择服务地址（门店地址）
- 使用优惠券（可选）

**步骤5：确认下单**
- 显示订单摘要
- 计算总价
- 确认支付

### 5. 支付系统

**支付方式：** 模拟支付（第一版）

**支付流程：**
- 显示支付页面
- 模拟支付成功/失败
- 支付状态更新

### 6. 订单管理

**订单状态流转：**
```
待支付 → 已支付 → 待接单 → 已接单 → 服务中 → 已完成 → 已评价
```

**订单功能：**
- 订单列表（标签页分类：全部/待支付/进行中/已完成）
- 订单详情查看
- 订单状态跟踪
- 取消订单（待支付状态）
- 删除订单（已完成状态）

### 7. 评价系统

**评价方式：**
- 星级评分（1-5星）
- 文字评价
- 图片上传（最多9张）

**评价功能：**
- 提交评价
- 查看我的评价
- 查看服务评价列表
- 评价瀑布流展示

### 8. 售后服务

**售后类型：**
- 申请退款
- 取消订单
- 投诉商家

**售后流程：**
1. 选择售后类型
2. 选择原因
3. 填写详细说明
4. 上传凭证图片
5. 提交申请
6. 查看售后进度

---

## 页面设计

### 1. 首页

**布局：** 现代布局（侧边导航 + 全屏轮播 + 瀑布流服务展示）

**页面元素：**
- 侧边导航栏（Logo、首页、服务、订单、我的、登录/注册）
- 全屏轮播图（平台活动、优惠信息）
- 服务分类图标（洗护、美容、寄养）
- 瀑布流服务推荐
- 热门服务展示
- 用户评价精选

### 2. 服务列表页

**布局：** 瀑布流布局

**页面元素：**
- 顶部筛选栏（分类、价格区间、排序方式）
- 搜索框
- 瀑布流服务卡片
- 服务卡片内容（图片、名称、价格、评分、销量）

### 3. 登录/注册页

**布局：** 分屏设计

**页面元素：**
- 左侧品牌展示区（Logo、平台介绍、服务图标）
- 右侧登录/注册表单
- 表单字段：手机号、密码、确认密码（注册）、记住我、忘记密码

### 4. 个人中心

**布局：** 卡片网格

**页面元素：**
- 顶部用户信息（头像、昵称、手机号）
- 功能卡片网格：
  - 我的宠物
  - 我的订单
  - 我的评价
  - 售后服务
  - 账号设置

### 5. 宠物档案页

**布局：** 卡片网格

**页面元素：**
- 宠物卡片列表（头像、名字、品种、年龄、健康标签）
- 添加宠物按钮
- 宠物详情编辑

### 6. 下单页面

**布局：** 分步向导

**页面元素：**
- 顶部步骤指示器（1.选择服务 → 2.选择宠物 → 3.选择时间 → 4.确认下单）
- 步骤内容区域
- 下一步/上一步按钮
- 订单摘要侧边栏

### 7. 订单列表页

**布局：** 标签页分类

**页面元素：**
- 顶部标签页（全部、待支付、进行中、已完成）
- 订单卡片列表
- 订单卡片内容（订单号、服务信息、宠物信息、金额、状态、操作按钮）

### 8. 订单详情页

**布局：** 详情展示

**页面元素：**
- 订单状态展示
- 服务信息
- 宠物信息
- 时间信息
- 金额明细
- 操作按钮（支付、取消、评价、申请售后）

### 9. 评价页面

**布局：** 瀑布流展示

**页面元素：**
- 评价统计（综合评分、评分分布）
- 瀑布流评价卡片
- 评价卡片内容（用户头像、昵称、评分、评价文字、图片）

### 10. 售后申请页

**布局：** 表单提交

**页面元素：**
- 订单信息展示
- 售后类型选择（退款、取消、投诉）
- 原因选择
- 详细说明输入
- 凭证图片上传
- 提交按钮

---

## UI设计规范

### 色彩方案

**主色调：** #FF6B35（暖橙色）
**辅助色：**
- 背景色：#FFF3E0（浅橙色）
- 成功色：#4CAF50（绿色）
- 警告色：#FFC107（黄色）
- 错误色：#F44336（红色）
- 文字色：#333333（深灰）
- 次要文字：#666666（中灰）

### 设计风格

**整体风格：** 活泼可爱

**设计元素：**
- 圆角设计（卡片圆角：16px，按钮圆角：24px）
- 卡通图标（宠物相关emoji）
- 暖色调渐变背景
- 柔和阴影效果
- 友好交互反馈

### 字体规范

**标题字体：** 18-24px，加粗
**正文字体：** 14-16px，常规
**辅助文字：** 12-14px，灰色

### 间距规范

**页面边距：** 24px
**卡片间距：** 16px
**元素间距：** 8-12px

---

## 技术架构

### 前端架构

**技术栈：**
- React 18
- TypeScript
- Ant Design 5
- Redux Toolkit
- React Router 6
- Axios

**目录结构：**
```
src/
├── components/          # 通用组件（可复用到小程序）
│   ├── common/         # 基础组件（Button, Card, Modal等）
│   ├── business/       # 业务组件（ServiceCard, OrderItem等）
│   └── layout/         # 布局组件（Header, Sidebar, Footer等）
├── pages/              # 页面组件（PC端特有）
│   ├── Home/           # 首页
│   ├── Auth/           # 登录注册
│   ├── Services/       # 服务列表
│   ├── Orders/         # 订单管理
│   ├── Profile/        # 个人中心
│   └── Pets/           # 宠物档案
├── store/              # Redux状态管理
│   ├── slices/         # Redux切片
│   └── index.ts        # Store配置
├── services/           # API服务层（抽象层）
│   ├── api/            # API接口定义
│   ├── mock/           # Mock数据实现（当前Demo版）
│   └── real/           # 真实API实现（后续Java后端）
├── hooks/              # 自定义Hook（可复用）
├── utils/              # 工具函数（可复用）
├── types/              # TypeScript类型定义（可复用）
├── styles/             # 样式文件
│   ├── theme.ts        # 主题配置
│   └── global.css      # 全局样式
├── App.tsx             # 根组件
└── main.tsx            # 入口文件
```

### 后台架构

**技术栈：**
- Node.js
- Express.js
- 内存数据库（模拟数据）

**API设计：**
- RESTful风格
- JSON数据格式
- JWT认证
- 统一响应格式

**统一响应格式：**
```typescript
// 成功响应
interface ApiResponse<T> {
  code: 0;              // 0表示成功
  message: 'success';
  data: T;
  timestamp: number;
}

// 错误响应
interface ApiError {
  code: number;         // 非0错误码
  message: string;      // 错误描述
  data: null;
  timestamp: number;
}

// 分页响应
interface PaginatedResponse<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}
```

**API端点：**
```
POST   /api/auth/register     # 用户注册
POST   /api/auth/login        # 用户登录
GET    /api/user/profile      # 获取用户信息
PUT    /api/user/profile      # 更新用户信息

GET    /api/pets              # 获取宠物列表
POST   /api/pets              # 添加宠物
PUT    /api/pets/:id          # 更新宠物
DELETE /api/pets/:id          # 删除宠物

GET    /api/services          # 获取服务列表
GET    /api/services/:id      # 获取服务详情

POST   /api/orders            # 创建订单
GET    /api/orders            # 获取订单列表
GET    /api/orders/:id        # 获取订单详情
PUT    /api/orders/:id/pay    # 支付订单
PUT    /api/orders/:id/cancel # 取消订单

POST   /api/orders/:id/review # 提交评价
GET    /api/reviews           # 获取评价列表

POST   /api/after-sales       # 提交售后申请
GET    /api/after-sales       # 获取售后列表
```

---

## 数据模型

> **设计原则：** 数据模型兼容关系型数据库，便于后续迁移到MySQL。使用UUID主键、ISO 8601时间格式、金额使用分（整数）存储。

### 用户模型 (User)
```typescript
interface User {
  id: string;           // 主键，UUID格式
  phone: string;        // 唯一索引
  password: string;     // 加密存储
  nickname: string;
  avatar: string;
  createTime: string;   // ISO 8601格式
  updateTime: string;   // ISO 8601格式
}
```

### 宠物模型 (Pet)
```typescript
interface Pet {
  id: string;           // 主键，UUID格式
  userId: string;       // 外键 -> User.id，索引
  name: string;
  species: 'dog' | 'cat' | 'other';
  breed: string;
  age: number;
  gender: 'male' | 'female';
  weight: number;       // 单位：千克
  avatar: string;
  isNeutered: boolean;
  vaccineRecords: string;  // JSON字符串（兼容MySQL JSON类型）
  medicalHistory: string;  // JSON字符串
  allergies: string;       // JSON字符串
  isDefault: boolean;      // 默认宠物标记
  createTime: string;      // ISO 8601格式
  updateTime: string;      // ISO 8601格式
}
```

### 服务模型 (Service)
```typescript
interface Service {
  id: string;           // 主键，UUID格式
  merchantId: string;   // 商家ID（预留B端扩展）
  name: string;
  category: 'wash' | 'grooming' | 'boarding';
  description: string;
  price: number;        // 单位：分（避免浮点精度问题）
  duration: number;     // 单位：分钟
  images: string;       // JSON数组字符串
  rating: number;       // 评分，1-5
  salesCount: number;   // 销量
  status: 'active' | 'inactive'; // 上架状态
  createTime: string;   // ISO 8601格式
  updateTime: string;   // ISO 8601格式
}
```

### 订单模型 (Order)
```typescript
interface Order {
  id: string;           // 主键，UUID格式
  orderNo: string;      // 业务编号，唯一索引
  userId: string;       // 外键 -> User.id，索引
  petId: string;        // 外键 -> Pet.id
  serviceId: string;    // 外键 -> Service.id
  serviceName: string;  // 冗余字段，避免JOIN
  serviceCategory: string; // 冗余字段
  serviceImage: string; // 冗余字段
  petName: string;      // 冗余字段
  status: 'pending_payment' | 'paid' | 'pending_accept' | 'accepted' | 'in_progress' | 'completed' | 'reviewed' | 'cancelled' | 'refunding';
  totalPrice: number;   // 单位：分
  appointmentDate: string; // ISO 8601日期格式
  appointmentTime: string; // 时间段，如 "09:00-10:00"
  address: string;
  contactPhone: string;
  remark: string;
  createTime: string;   // ISO 8601格式
  payTime: string | null;
  completeTime: string | null;
  cancelTime: string | null;
  updateTime: string;   // ISO 8601格式
}
```

### 评价模型 (Review)
```typescript
interface Review {
  id: string;           // 主键，UUID格式
  orderId: string;      // 外键 -> Order.id，唯一索引
  userId: string;       // 外键 -> User.id
  serviceId: string;    // 外键 -> Service.id，索引
  rating: number;       // 评分，1-5
  content: string;
  images: string;       // JSON数组字符串
  createTime: string;   // ISO 8601格式
  updateTime: string;   // ISO 8601格式
}
```

### 售后模型 (AfterSales)
```typescript
interface AfterSales {
  id: string;           // 主键，UUID格式
  orderId: string;      // 外键 -> Order.id，索引
  userId: string;       // 外键 -> User.id
  type: 'refund' | 'cancel' | 'complaint';
  reason: string;
  description: string;
  images: string;       // JSON数组字符串
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  adminReply: string;   // 管理员回复（预留）
  createTime: string;   // ISO 8601格式
  updateTime: string;   // ISO 8601格式
}
```

---

## 错误处理

### 前端错误处理
- 网络请求错误提示
- 表单验证错误提示
- 页面加载失败处理
- 404页面处理

### 后台错误处理
- 参数验证错误
- 业务逻辑错误
- 数据库操作错误
- 统一错误响应格式

---

## 测试策略

### 前端测试
- 组件单元测试
- 页面集成测试
- 用户交互测试

### 后台测试
- API接口测试
- 业务逻辑测试
- 数据验证测试

---

## 部署方案

### 开发环境
- 前端：Vite开发服务器
- 后台：Node.js本地运行

### 生产环境
- 前端：静态资源部署（Nginx）
- 后台：Node.js服务器部署

---

## 项目里程碑

### 第一阶段：基础框架搭建
- 项目初始化
- 技术栈配置
- 基础组件开发

### 第二阶段：核心功能开发
- 用户系统
- 宠物档案
- 服务展示

### 第三阶段：业务功能开发
- 下单流程
- 支付系统
- 订单管理

### 第四阶段：完善功能
- 评价系统
- 售后服务
- 优化体验

---

## 设计决策记录

### 1. 为什么选择React + Ant Design？
- React生态成熟，社区资源丰富
- Ant Design组件质量高，定制性强
- TypeScript提供更好的类型安全
- 适合大型项目扩展

### 2. 为什么使用模拟支付？
- 第一版无需对接真实支付系统
- 降低开发复杂度和成本
- 便于测试和演示
- 后续可轻松替换为真实支付

### 3. 为什么选择现代布局？
- 侧边导航节省空间
- 全屏轮播视觉冲击力强
- 瀑布流展示服务卡片效果好
- 符合现代网页设计趋势

### 4. 为什么选择分步向导下单？
- 引导用户完成复杂流程
- 减少用户认知负担
- 提高下单转化率
- 便于错误处理和验证

---

## 范围说明

### 第一版包含
- PC端用户功能
- 手机号+密码登录
- 养宠档案管理
- 洗护、美容、寄养服务
- 分步向导下单
- 模拟支付
- 订单管理
- 评价系统
- 售后服务

### 第一版不包含
- 商家端功能
- 真实支付对接
- 短信验证码登录
- 微信登录
- 上门喂养服务
- 优惠券系统
- 消息通知系统
- 数据统计分析

---

## 技术演进与可扩展性设计

### 当前版本（Demo版）定位

**目标：** 快速验证业务逻辑和用户体验

**技术栈：**
- 前端：React 18 + TypeScript + Ant Design 5
- 后端：Node.js + Express（内存数据库）
- 认证：JWT Token
- 数据：Mock数据，内存存储

### 后续演进路线

| 阶段 | 后端技术栈 | 数据库 | 前端 | 其他 |
|------|-----------|--------|------|------|
| **Demo版（当前）** | Node.js + Express | 内存 | React PC端 | - |
| **V1.0 正式版** | Java (Spring Boot) | MySQL | React PC端 | Redis缓存 |
| **V2.0 商家版** | Java | MySQL | React PC端 + 商家端 | 消息队列 |
| **V3.0 小程序版** | Java | MySQL | 微信小程序 | OSS存储 |
| **V4.0 管理后台** | Java | MySQL | React 管理端 | 权限系统 |

### API层标准化

**统一响应格式（前后端约定）：**
```typescript
interface ApiResponse<T> {
  code: number;      // 0=成功, 其他=错误码
  message: string;
  data: T;
  timestamp: number;
}

interface PaginatedResponse<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}
```

**要点：**
- 所有API遵循RESTful规范
- 响应格式统一，便于后续Java后端无缝替换
- 错误码体系完整，便于多端统一处理

### 前端模块化设计

```
src/
├── components/          # 通用组件（可复用到小程序）
│   ├── common/         # 基础组件
│   ├── business/       # 业务组件
│   └── layout/         # 布局组件
├── pages/              # 页面（PC端特有）
├── services/           # API服务层（抽象层）
│   ├── api/           # API定义
│   ├── mock/          # Mock数据（当前）
│   └── real/          # 真实API（后续）
├── store/              # 状态管理
├── hooks/              # 自定义Hook（可复用）
├── utils/              # 工具函数（可复用）
└── types/              # TypeScript类型定义（可复用）
```

**要点：**
- `services/` 层抽象API调用，后续切换后端只需修改实现，不改调用方
- `hooks/` 和 `utils/` 设计为平台无关，可直接复用到小程序
- `types/` 统一数据模型定义，确保前后端一致

### 数据模型兼容性设计

**设计原则：**
- 使用UUID作为主键，便于分布式部署
- 时间字段统一ISO 8601格式
- JSON字段设计兼容MySQL JSON类型
- 金额使用分（整数）存储，避免浮点精度问题
- 适当冗余字段，减少后续JOIN查询

**示例：**
```typescript
interface Order {
  id: string;           // 主键，UUID格式
  orderNo: string;      // 业务编号，唯一索引
  userId: string;       // 外键 -> User.id
  petId: string;        // 外键 -> Pet.id
  serviceId: string;    // 外键 -> Service.id
  serviceName: string;  // 冗余字段，避免JOIN
  totalPrice: number;   // 分为单位，避免浮点精度问题
  status: string;       // 枚举值
  createTime: string;   // ISO 8601格式
  updateTime: string;   // ISO 8601格式
}
```

### 多端扩展预留

#### 小程序复用策略
```
共享代码（直接复用）：
├── types/              # 数据类型定义
├── utils/              # 工具函数
├── hooks/              # 自定义Hook（部分）
└── services/api/       # API接口定义

小程序特有：
├── components/         # 微信组件
├── pages/              # 小程序页面
└── app.json            # 小程序配置
```

#### B端商家版预留
- 数据模型已包含商家相关字段（如`service.merchantId`）
- API设计支持商家维度查询
- 权限体系预留商家角色

#### 管理后台预留
- API设计支持管理端调用
- 数据模型包含审计字段（createTime, updateTime）
- 操作日志预留

### 当前Demo版实现要点

**必须做：**
- ✅ 遵循统一API响应格式
- ✅ 使用TypeScript严格类型定义
- ✅ 服务层抽象，不直接调用axios
- ✅ 数据模型兼容关系型数据库
- ✅ 金额使用分（整数）存储
- ✅ 使用UUID作为ID

**可以简化：**
- ⚠️ Mock数据，内存存储（不接数据库）
- ⚠️ 简化认证流程（不接入真实短信）
- ⚠️ 模拟支付（不接入真实支付）
- ⚠️ 文件上传本地存储（不接OSS）

**不要做：**
- ❌ 不实现真实支付
- ❌ 不实现短信验证码
- ❌ 不实现文件云存储
- ❌ 不实现商家端功能
