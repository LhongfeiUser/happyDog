import React, { useEffect } from 'react';
import { Form, Input, Button, message, Card } from 'antd';
import { UserOutlined, PhoneOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { updateMerchantInfoAsync } from '../../../store/slices/merchantAuthSlice';
import AddressPicker from '@/components/common/AddressPicker';

const ContactInfoForm: React.FC = () => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { merchant, loading } = useAppSelector((state) => state.merchantAuth);

  useEffect(() => {
    if (merchant) {
      // 兼容旧格式地址：字符串转结构化对象
      let addrValue = merchant.address;
      if (typeof addrValue === 'string') {
        addrValue = {
          province: '',
          city: '',
          district: '',
          address: addrValue,
          lng: 0,
          lat: 0,
          formatted: addrValue,
        };
      }
      form.setFieldsValue({
        contactName: merchant.contactName,
        contactPhone: merchant.contactPhone,
        address: addrValue,
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
            { required: true, message: '请选择店铺地址' },
            {
              validator: (_, value) => {
                if (value && typeof value === 'object' && (!value.address || !value.province)) {
                  return Promise.reject('请选择省市区并输入详细地址');
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <AddressPicker placeholder="请选择店铺地址" />
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
