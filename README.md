# 🐾 宠物服务平台

一个面向宠物主人的服务预约平台，提供洗护、美容、寄养等服务。

## 技术栈

### 前端
- **React 18** - 用户界面框架
- **TypeScript** - 类型安全
- **Ant Design 5** - UI组件库
- **Redux Toolkit** - 状态管理
- **React Router 6** - 路由管理
- **Axios** - HTTP请求（已封装拦截器）

### 后端
- **Node.js + Express** - 服务器框架
- **内存数据库** - 模拟数据存储（可扩展为MySQL）
- **JWT** - 身份认证
- **CORS** - 跨域支持

## 功能特性

### 用户系统
- ✅ 手机号 + 密码登录/注册
- ✅ 个人中心
- ✅ 退出登录

### 宠物档案
- ✅ 添加/编辑/删除宠物
- ✅ 设置默认宠物
- ✅ 宠物信息管理（种类、品种、年龄、体重等）

### 服务预约
- ✅ 服务列表（洗护、美容、寄养）
- ✅ 服务分类筛选
- ✅ 服务详情查看
- ✅ 分步向导下单

### 订单管理
- ✅ 创建订单
- ✅ 订单列表（按状态筛选）
- ✅ 订单详情
- ✅ 模拟支付
- ✅ 取消订单
- ✅ 确认完成

### 评价系统
- ✅ 提交评价（评分 + 文字）
- ✅ 查看服务评价
- ✅ 查看我的评价

### 售后服务
- ✅ 申请售后（退款、取消、投诉）
- ✅ 售后列表
- ✅ 取消售后申请

## 快速开始

### 环境要求
- Node.js >= 16
- npm >= 8

### 安装依赖
```bash
# 安装前端依赖
cd pet-service-platform
npm install

# 安装后端依赖
cd server
npm install
cd ..
```

### 启动服务

#### Windows
```bash
# 双击运行 start.bat
start.bat
```

#### Linux/Mac
```bash
# 添加执行权限
chmod +x start.sh

# 运行启动脚本
./start.sh
```

#### 手动启动
```bash
# 终端1：启动后端服务
cd server
npm start

# 终端2：启动前端服务
npm run dev
```

### 访问地址
- 前端：http://localhost:5173
- 后端：http://localhost:3000

### 构建生产版本
```bash
npm run build
```

### 代码检查
```bash
npm run lint
```

## 项目结构

```
src/
├── components/          # 通用组件
│   ├── common/         # 基础组件
│   ├── business/       # 业务组件
│   │   ├── ServiceCard.tsx
│   │   └── OrderItem.tsx
│   └── layout/         # 布局组件
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── MainLayout.tsx
├── pages/              # 页面组件
│   ├── Home/           # 首页
│   ├── Auth/           # 登录注册
│   ├── Services/       # 服务列表/详情
│   ├── Orders/         # 订单列表/详情/评价
│   ├── Pets/           # 宠物档案
│   ├── Profile/        # 个人中心
│   └── AfterSales/     # 售后服务
├── store/              # Redux状态管理
│   └── slices/         # Redux切片
├── services/           # API服务层
│   ├── api/            # API接口定义
│   └── mock/           # Mock数据实现
├── hooks/              # 自定义Hook
├── utils/              # 工具函数
├── types/              # TypeScript类型定义
└── styles/             # 样式文件
```

## 测试账号

- **手机号：** 13800138000
- **密码：** 123456

## 设计风格

- **主题色：** 温暖橙色 (#FF6B35)
- **风格：** 可爱活泼，圆角设计
- **交互：** 流畅的动画效果

## API接口

所有API遵循统一的响应格式：

```typescript
interface ApiResponse<T> {
  code: number;      // 0=成功, 其他=错误码
  message: string;
  data: T;
  timestamp: number;
}
```

### 主要接口
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/register` - 用户注册
- `GET /api/pets` - 获取宠物列表
- `GET /api/services` - 获取服务列表
- `POST /api/orders` - 创建订单
- `GET /api/orders` - 获取订单列表
- `POST /api/orders/:id/pay` - 支付订单
- `POST /api/reviews` - 提交评价
- `POST /api/after-sales` - 提交售后申请

## 后续规划

### V1.0 正式版
- Java (Spring Boot) 后端
- MySQL 数据库
- Redis 缓存

### V2.0 商家版
- 商家端功能
- 消息队列

### V3.0 小程序版
- 微信小程序
- OSS 文件存储

### V4.0 管理后台
- 管理员端
- 权限系统

## 许可证

MIT License
