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
