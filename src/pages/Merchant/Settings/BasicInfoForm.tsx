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
    if (merchant) {
      form.setFieldsValue({
        name: merchant.name,
        logo: merchant.logo,
        description: merchant.description,
      });
    }
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
