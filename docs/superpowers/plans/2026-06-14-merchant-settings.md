# 商家店铺设置功能实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为商家后台添加店铺设置功能，支持商家查看和编辑店铺信息、商家信息

**Architecture:** 使用标签页形式组织商家信息，分为基本信息、联系信息、营业资质、店铺展示四个模块。每个模块独立编辑和保存，使用 Ant Design 组件构建 UI，通过 Redux 管理状态，调用后端 API 保存数据。

**Tech Stack:** React 19, TypeScript 5, Ant Design 6, Redux Toolkit, React Router 7

---

## 文件结构

### 需要创建的文件
- `src/pages/Merchant/Settings/index.tsx` - 店铺设置主页面
- `src/pages/Merchant/Settings/BasicInfoForm.tsx` - 基本信息表单
- `src/pages/Merchant/Settings/ContactInfoForm.tsx` - 联系信息表单
- `src/pages/Merchant/Settings/QualificationForm.tsx` - 营业资质表单
- `src/pages/Merchant/Settings/ShopDisplayForm.tsx` - 店铺展示表单

### 需要修改的文件
- `src/App.tsx` (第54-65行) - 添加 settings 路由
- `src/store/slices/merchantAuthSlice.ts` (第56-65行后) - 添加 updateMerchantInfoAsync
- `server/index.js` (第1380行后) - 添加更新商家信息的 API

---

### Task 1: 添加后端 API - 更新商家信息

**Files:**
- Modify: `server/index.js:1380-1420`

- [ ] **Step 1: 在 server/index.js 中添加更新商家信息的 API**

在获取商家信息的 API（第1380行）之后，添加以下代码：

```javascript
// 更新商家信息
app.put('/api/merchant/info', merchantAuth, (req, res) => {
  const merchantIndex = data.merchants.findIndex((m) => m.id === req.merchant.merchantId);

  if (merchantIndex === -1) {
    return res.json({
      code: 1003,
      message: '商家不存在',
      data: null,
      timestamp: Date.now(),
    });
  }

  // 允许更新的字段
  const allowedFields = [
    'name', 'logo', 'contactName', 'contactPhone',
    'businessLicense', 'businessLicenseImage', 'address',
    'businessHours', 'description'
  ];

  const updates = {};
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  data.merchants[merchantIndex] = {
    ...data.merchants[merchantIndex],
    ...updates,
    updateTime: new Date().toISOString(),
  };

  const { password: _, ...merchantWithoutPassword } = data.merchants[merchantIndex];

  res.json({
    code: 0,
    message: 'success',
    data: merchantWithoutPassword,
    timestamp: Date.now(),
  });
});
```

- [ ] **Step 2: 重启后端服务验证**

```bash
cd server && npm start
```

- [ ] **Step 3: 提交代码**

```bash
git add server/index.js
git commit -m "feat: 添加更新商家信息的 API"
```

---

### Task 2: 添加 Redux Action - 更新商家信息

**Files:**
- Modify: `src/store/slices/merchantAuthSlice.ts:56-75`

- [ ] **Step 1: 在 merchantAuthSlice.ts 中添加 updateMerchantInfoAsync**

在 `getMerchantInfoAsync` 之后（第56行后），添加以下代码：

```typescript
// 更新商家信息
export const updateMerchantInfoAsync = createAsyncThunk(
  'merchantAuth/updateMerchantInfo',
  async (data: Partial<Merchant>, { rejectWithValue }) => {
    const response = await merchantAuth.updateMerchantInfo(data);
    if (response.code !== 0) {
      return rejectWithValue(response.message);
    }
    return response.data;
  }
);
```

- [ ] **Step 2: 在 extraReducers 中添加 updateMerchantInfoAsync 的处理**

在 `merchantLogoutAsync` 之前（第115行前），添加：

```typescript
// 更新商家信息
.addCase(updateMerchantInfoAsync.pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase(updateMerchantInfoAsync.fulfilled, (state, action) => {
  state.loading = false;
  state.merchant = action.payload;
})
.addCase(updateMerchantInfoAsync.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload as string;
})
```

- [ ] **Step 3: 提交代码**

```bash
git add src/store/slices/merchantAuthSlice.ts
git commit -m "feat: 添加更新商家信息的 Redux Action"
```

---

### Task 3: 创建基本信息表单组件

**Files:**
- Create: `src/pages/Merchant/Settings/BasicInfoForm.tsx`

- [ ] **Step 1: 创建 BasicInfoForm.tsx 文件**

```tsx
import React, { useEffect } from 'react';
import { Form, Input, Upload, Button, message, Card } from 'antd';
import { UploadOutlined, ShopOutlined } from '@ant-design/icons';
import type { Merchant } from '../../../types';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { updateMerchantInfoAsync } from '../../../store/slices/merchantAuthSlice';

const BasicInfoForm: React.FC = () => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { merchant, loading } = useAppSelector((state) => state.merchantAuth);

  useEffect(() => {
    if (merchant) {
      form.setFieldsValue({
        name: merchant.name,
        logo: merchant.logo,
        description: merchant.description,
      });
    }
  }, [merchant, form]);

  const handleSubmit = async (values: any) => {
    try {
      await dispatch(updateMerchantInfoAsync({
        name: values.name,
        logo: values.logo,
        description: values.description,
      })).unwrap();
      message.success('基本信息保存成功！');
    } catch (error: any) {
      message.error(error || '保存失败，请重试');
    }
  };

  const handleReset = () => {
    form.resetFields();
  };

  const uploadProps = {
    name: 'file',
    action: '/api/upload',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info: any) {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 上传成功`);
        form.setFieldsValue({ logo: info.file.response?.url || '' });
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败`);
      }
    },
  };

  return (
    <Card title="基本信息" bordered={false}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          name: merchant?.name,
          description: merchant?.description,
        }}
      >
        <Form.Item
          name="name"
          label="店铺名称"
          rules={[
            { required: true, message: '请输入店铺名称' },
            { min: 1, max: 50, message: '店铺名称长度为1-50字符' },
          ]}
        >
          <Input
            prefix={<ShopOutlined />}
            placeholder="请输入店铺名称"
            size="large"
            style={{ borderRadius: 8 }}
          />
        </Form.Item>

        <Form.Item
          name="logo"
          label="店铺Logo"
          extra="建议尺寸：200x200px，支持 JPG、PNG 格式"
        >
          <Upload {...uploadProps} maxCount={1} listType="picture-card">
            <div style={{ textAlign: 'center' }}>
              <UploadOutlined />
              <div style={{ marginTop: 8 }}>上传Logo</div>
            </div>
          </Upload>
        </Form.Item>

        <Form.Item
          name="description"
          label="店铺描述"
          rules={[
            { required: true, message: '请输入店铺描述' },
            { min: 1, max: 500, message: '店铺描述长度为1-500字符' },
          ]}
        >
          <Input.TextArea
            placeholder="请输入店铺描述，让顾客更好地了解您的店铺"
            rows={4}
            maxLength={500}
            showCount
            style={{ borderRadius: 8 }}
          />
        </Form.Item>

        <Form.Item style={{ marginTop: 32 }}>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <Button
              onClick={handleReset}
              size="large"
              style={{ borderRadius: 8, minWidth: 100 }}
            >
              取消
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              style={{
                borderRadius: 8,
                minWidth: 120,
                backgroundColor: '#FF6B35',
                borderColor: '#FF6B35',
              }}
            >
              保存
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default BasicInfoForm;
```

- [ ] **Step 2: 提交代码**

```bash
git add src/pages/Merchant/Settings/BasicInfoForm.tsx
git commit -m "feat: 创建基本信息表单组件"
```

---

### Task 4: 创建联系信息表单组件

**Files:**
- Create: `src/pages/Merchant/Settings/ContactInfoForm.tsx`

- [ ] **Step 1: 创建 ContactInfoForm.tsx 文件**

```tsx
import React, { useEffect } from 'react';
import { Form, Input, Button, message, Card } from 'antd';
import { UserOutlined, PhoneOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { updateMerchantInfoAsync } from '../../../store/slices/merchantAuthSlice';

const ContactInfoForm: React.FC = () => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { merchant, loading } = useAppSelector((state) => state.merchantAuth);

  useEffect(() => {
    if (merchant) {
      form.setFieldsValue({
        contactName: merchant.contactName,
        contactPhone: merchant.contactPhone,
        address: merchant.address,
      });
    }
  }, [merchant, form]);

  const handleSubmit = async (values: any) => {
    try {
      await dispatch(updateMerchantInfoAsync({
        contactName: values.contactName,
        contactPhone: values.contactPhone,
        address: values.address,
      })).unwrap();
      message.success('联系信息保存成功！');
    } catch (error: any) {
      message.error(error || '保存失败，请重试');
    }
  };

  const handleReset = () => {
    form.resetFields();
  };

  return (
    <Card title="联系信息" bordered={false}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="contactName"
          label="联系人姓名"
          rules={[
            { required: true, message: '请输入联系人姓名' },
            { min: 2, max: 20, message: '联系人姓名长度为2-20字符' },
          ]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="请输入联系人姓名"
            size="large"
            style={{ borderRadius: 8 }}
          />
        </Form.Item>

        <Form.Item
          name="contactPhone"
          label="联系电话"
          rules={[
            { required: true, message: '请输入联系电话' },
            { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' },
          ]}
        >
          <Input
            prefix={<PhoneOutlined />}
            placeholder="请输入联系电话"
            size="large"
            style={{ borderRadius: 8 }}
          />
        </Form.Item>

        <Form.Item
          name="address"
          label="店铺地址"
          rules={[
            { required: true, message: '请输入店铺地址' },
            { min: 5, max: 100, message: '店铺地址长度为5-100字符' },
          ]}
        >
          <Input
            prefix={<EnvironmentOutlined />}
            placeholder="请输入店铺地址"
            size="large"
            style={{ borderRadius: 8 }}
          />
        </Form.Item>

        <Form.Item style={{ marginTop: 32 }}>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <Button
              onClick={handleReset}
              size="large"
              style={{ borderRadius: 8, minWidth: 100 }}
            >
              取消
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              style={{
                borderRadius: 8,
                minWidth: 120,
                backgroundColor: '#FF6B35',
                borderColor: '#FF6B35',
              }}
            >
              保存
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ContactInfoForm;
```

- [ ] **Step 2: 提交代码**

```bash
git add src/pages/Merchant/Settings/ContactInfoForm.tsx
git commit -m "feat: 创建联系信息表单组件"
```

---

### Task 5: 创建营业资质表单组件

**Files:**
- Create: `src/pages/Merchant/Settings/QualificationForm.tsx`

- [ ] **Step 1: 创建 QualificationForm.tsx 文件**

```tsx
import React, { useEffect } from 'react';
import { Form, Input, Upload, Button, message, Card } from 'antd';
import { UploadOutlined, FileProtectOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { updateMerchantInfoAsync } from '../../../store/slices/merchantAuthSlice';

const QualificationForm: React.FC = () => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { merchant, loading } = useAppSelector((state) => state.merchantAuth);

  useEffect(() => {
    if (merchant) {
      form.setFieldsValue({
        businessLicense: merchant.businessLicense,
        businessLicenseImage: merchant.businessLicenseImage,
      });
    }
  }, [merchant, form]);

  const handleSubmit = async (values: any) => {
    try {
      await dispatch(updateMerchantInfoAsync({
        businessLicense: values.businessLicense,
        businessLicenseImage: values.businessLicenseImage,
      })).unwrap();
      message.success('营业资质保存成功！');
    } catch (error: any) {
      message.error(error || '保存失败，请重试');
    }
  };

  const handleReset = () => {
    form.resetFields();
  };

  const uploadProps = {
    name: 'file',
    action: '/api/upload',
    headers: {
      authorization: 'authorization-text',
    },
    maxCount: 1,
    onChange(info: any) {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 上传成功`);
        form.setFieldsValue({ businessLicenseImage: info.file.response?.url || '' });
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败`);
      }
    },
  };

  return (
    <Card title="营业资质" bordered={false}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="businessLicense"
          label="营业执照号"
          rules={[
            { required: true, message: '请输入营业执照号' },
            { min: 15, max: 20, message: '营业执照号长度为15-20位' },
            { pattern: /^[0-9A-Z]{15,20}$/, message: '营业执照号只能包含数字和大写字母' },
          ]}
        >
          <Input
            prefix={<FileProtectOutlined />}
            placeholder="请输入营业执照号"
            size="large"
            style={{ borderRadius: 8 }}
          />
        </Form.Item>

        <Form.Item
          name="businessLicenseImage"
          label="营业执照图片"
          extra="支持 JPG、PNG 格式，文件大小不超过 5MB"
        >
          <Upload {...uploadProps} listType="picture-card">
            <div style={{ textAlign: 'center' }}>
              <UploadOutlined />
              <div style={{ marginTop: 8 }}>上传营业执照</div>
            </div>
          </Upload>
        </Form.Item>

        <Form.Item style={{ marginTop: 32 }}>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <Button
              onClick={handleReset}
              size="large"
              style={{ borderRadius: 8, minWidth: 100 }}
            >
              取消
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              style={{
                borderRadius: 8,
                minWidth: 120,
                backgroundColor: '#FF6B35',
                borderColor: '#FF6B35',
              }}
            >
              保存
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default QualificationForm;
```

- [ ] **Step 2: 提交代码**

```bash
git add src/pages/Merchant/Settings/QualificationForm.tsx
git commit -m "feat: 创建营业资质表单组件"
```

---

### Task 6: 创建店铺展示表单组件

**Files:**
- Create: `src/pages/Merchant/Settings/ShopDisplayForm.tsx`

- [ ] **Step 1: 创建 ShopDisplayForm.tsx 文件**

```tsx
import React, { useEffect } from 'react';
import { Form, Input, Button, message, Card } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { updateMerchantInfoAsync } from '../../../store/slices/merchantAuthSlice';

const ShopDisplayForm: React.FC = () => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { merchant, loading } = useAppSelector((state) => state.merchantAuth);

  useEffect(() => {
    if (merchant) {
      form.setFieldsValue({
        businessHours: merchant.businessHours,
      });
    }
  }, [merchant, form]);

  const handleSubmit = async (values: any) => {
    try {
      await dispatch(updateMerchantInfoAsync({
        businessHours: values.businessHours,
      })).unwrap();
      message.success('店铺展示信息保存成功！');
    } catch (error: any) {
      message.error(error || '保存失败，请重试');
    }
  };

  const handleReset = () => {
    form.resetFields();
  };

  return (
    <Card title="店铺展示" bordered={false}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="businessHours"
          label="营业时间"
          rules={[
            { required: true, message: '请输入营业时间' },
          ]}
          extra="例如：09:00-21:00 或 周一至周日 09:00-21:00"
        >
          <Input
            prefix={<ClockCircleOutlined />}
            placeholder="请输入营业时间"
            size="large"
            style={{ borderRadius: 8 }}
          />
        </Form.Item>

        <Form.Item style={{ marginTop: 32 }}>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <Button
              onClick={handleReset}
              size="large"
              style={{ borderRadius: 8, minWidth: 100 }}
            >
              取消
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              style={{
                borderRadius: 8,
                minWidth: 120,
                backgroundColor: '#FF6B35',
                borderColor: '#FF6B35',
              }}
            >
              保存
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ShopDisplayForm;
```

- [ ] **Step 2: 提交代码**

```bash
git add src/pages/Merchant/Settings/ShopDisplayForm.tsx
git commit -m "feat: 创建店铺展示表单组件"
```

---

### Task 7: 创建店铺设置主页面

**Files:**
- Create: `src/pages/Merchant/Settings/index.tsx`

- [ ] **Step 1: 创建 Settings/index.tsx 文件**

```tsx
import React from 'react';
import { Typography, Tabs } from 'antd';
import { ShopOutlined, UserOutlined, FileProtectOutlined, ClockCircleOutlined } from '@ant-design/icons';
import BasicInfoForm from './BasicInfoForm';
import ContactInfoForm from './ContactInfoForm';
import QualificationForm from './QualificationForm';
import ShopDisplayForm from './ShopDisplayForm';

const { Title, Text } = Typography;

const MerchantSettings: React.FC = () => {
  const tabItems = [
    {
      key: 'basic',
      label: (
        <span>
          <ShopOutlined />
          基本信息
        </span>
      ),
      children: <BasicInfoForm />,
    },
    {
      key: 'contact',
      label: (
        <span>
          <UserOutlined />
          联系信息
        </span>
      ),
      children: <ContactInfoForm />,
    },
    {
      key: 'qualification',
      label: (
        <span>
          <FileProtectOutlined />
          营业资质
        </span>
      ),
      children: <QualificationForm />,
    },
    {
      key: 'display',
      label: (
        <span>
          <ClockCircleOutlined />
          店铺展示
        </span>
      ),
      children: <ShopDisplayForm />,
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, color: '#333' }}>
          <ShopOutlined style={{ marginRight: 12 }} />
          店铺设置
        </Title>
        <Text type="secondary">管理您的商家信息和店铺信息</Text>
      </div>

      {/* 标签页 */}
      <Tabs
        defaultActiveKey="basic"
        items={tabItems}
        size="large"
        style={{
          backgroundColor: '#fff',
          padding: '24px',
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        }}
      />
    </div>
  );
};

export default MerchantSettings;
```

- [ ] **Step 2: 提交代码**

```bash
git add src/pages/Merchant/Settings/index.tsx
git commit -m "feat: 创建店铺设置主页面"
```

---

### Task 8: 添加路由配置

**Files:**
- Modify: `src/App.tsx:54-65`

- [ ] **Step 1: 在 App.tsx 中导入 MerchantSettings 组件**

在文件顶部添加导入：

```tsx
import MerchantSettings from './pages/Merchant/Settings';
```

- [ ] **Step 2: 在 /merchant 路由下添加 settings 路由**

```tsx
<Route path="/merchant" element={<MerchantLayout />}>
  <Route index element={<Navigate to="/merchant/dashboard" replace />} />
  <Route path="dashboard" element={<MerchantDashboard />} />
  <Route path="services" element={<MerchantServices />} />
  <Route path="orders" element={<MerchantOrders />} />
  <Route path="statistics" element={<MerchantStatistics />} />
  <Route path="settings" element={<MerchantSettings />} />
</Route>
```

- [ ] **Step 3: 提交代码**

```bash
git add src/App.tsx
git commit -m "feat: 添加店铺设置路由"
```

---

### Task 9: 验证功能

- [ ] **Step 1: 重启前端服务**

```bash
npm run dev
```

- [ ] **Step 2: 测试功能**

1. 登录商家后台
2. 点击左侧菜单的"店铺设置"
3. 验证页面是否正常显示，包含4个标签页
4. 切换到"基本信息"标签，修改店铺名称，点击保存
5. 切换到"联系信息"标签，修改联系人信息，点击保存
6. 切换到"营业资质"标签，输入营业执照号，点击保存
7. 切换到"店铺展示"标签，修改营业时间，点击保存
8. 刷新页面，验证数据是否正确保留
9. 点击"取消"按钮，验证是否恢复原始数据

- [ ] **Step 3: 提交最终代码（如果有修复）**

```bash
git add .
git commit -m "fix: 修复验证过程中发现的问题"
```

---

## 依赖关系

```
Task 1 (后端 API)
    ↓
Task 2 (Redux Action)
    ↓
Task 3, 4, 5, 6 (表单组件) - 可并行
    ↓
Task 7 (主页面)
    ↓
Task 8 (路由)
    ↓
Task 9 (验证)
```

---

## 注意事项

1. **文件上传功能**：示例中的文件上传使用了占位符 API (`/api/upload`)，实际项目中需要配置真实的上传接口
2. **样式一致性**：所有表单组件遵循统一的设计风格，使用 Ant Design 组件
3. **错误处理**：所有保存操作都有错误处理和用户提示
4. **数据刷新**：保存成功后，Redux 状态会自动更新，页面数据随之刷新

## 测试清单

- [ ] 点击左侧菜单"店铺设置"能正确跳转到设置页面
- [ ] 点击顶部下拉菜单"店铺设置"能正确跳转到设置页面
- [ ] 4个标签页都能正常切换
- [ ] 基本信息表单能正确显示和保存
- [ ] 联系信息表单能正确显示和保存
- [ ] 营业资质表单能正确显示和保存
- [ ] 店铺展示表单能正确显示和保存
- [ ] 表单验证能正确触发（空值、长度限制、手机号格式等）
- [ ] 取消按钮能正确恢复原始数据
- [ ] 保存成功后显示成功提示
- [ ] 保存失败后显示错误提示
- [ ] 刷新页面后数据正确保留

## 后续优化

- [ ] 集成真实的文件上传服务
- [ ] 添加图片裁剪功能
- [ ] 支持更多类型的资质图片
- [ ] 添加操作日志功能
- [ ] 添加草稿/暂存功能