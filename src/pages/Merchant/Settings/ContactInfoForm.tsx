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
    if (merchant) {
      form.setFieldsValue({
        contactName: merchant.contactName,
        contactPhone: merchant.contactPhone,
        address: merchant.address,
      });
    }
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
