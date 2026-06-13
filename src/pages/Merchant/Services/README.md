# 商家服务管理模块

## 功能概述
商家服务管理模块提供了完整的宠物服务项目CRUD功能，支持服务的增删改查和上下架管理。

## 文件结构
```
src/pages/Merchant/Services/
├── index.tsx           # 主页面组件
├── ServiceList.tsx     # 服务列表组件
├── ServiceModal.tsx    # 服务表单模态框（新增/编辑/查看）
├── ServiceForm.tsx     # 服务表单组件
└── index.ts            # 导出文件
```

## 核心功能

### 1. 服务列表展示
- 表格形式展示所有服务
- 支持分页
- 显示服务名称、分类、价格、时长、销量、评分、状态等
- 支持快速上下架切换

### 2. 新增服务
- 弹窗表单
- 字段验证
- 图片上传（最多5张）
- 服务分类选择

### 3. 编辑服务
- 弹窗表单，自动填充现有数据
- 支持修改所有字段
- 数据验证

### 4. 删除服务
- 确认弹窗
- 防止误删

### 5. 服务详情查看
- 只读模式展示完整服务信息
- 图片预览

### 6. 搜索和筛选
- 按服务名称搜索
- 按分类筛选
- 按状态筛选
- 一键重置

## 表单字段
- 服务名称：2-50个字符
- 服务分类：洗护/美容/寄养/喂养
- 服务价格：0.01-99999元
- 服务时长：1-1440分钟
- 服务描述：10-500个字符
- 服务图片：最多5张，每张不超过2MB

## API接口
- `getServicesListAsync`: 获取服务列表
- `createServiceAsync`: 创建服务
- `updateServiceAsync`: 更新服务
- `deleteServiceAsync`: 删除服务
- `updateServiceStatusAsync`: 更新服务状态

## 路由
- `/merchant/services` - 商家服务管理页面

## 主题
- 橙色主题 (#FF6B35)
- 渐变背景
- 圆角设计
- 响应式布局

## 技术栈
- React 18
- TypeScript
- Ant Design 6.4.3
- Redux Toolkit
- React Router DOM v7
