import React from 'react';
import { Card, Form, Input, Button, Typography, message, Space } from 'antd';
import { LockOutlined, MobileOutlined, ShopOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { merchantLoginAsync } from '../../../store/slices/merchantAuthSlice';
import { isValidPhone, isValidPassword } from '../../../utils';

const { Title, Text } = Typography;

const MerchantLogin: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector(state => state.merchantAuth);
  const [form] = Form.useForm();

  const handleSubmit = async (values: { phone: string; password: string }) => {
    try {
      await dispatch(merchantLoginAsync(values)).unwrap();
      message.success('登录成功！');
      navigate('/merchant/dashboard');
    } catch (error) {
      message.error('登录失败：' + error);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0CC 100%)',
        padding: '40px 20px',
      }}
    >
      <Card
        style={{
          width: 450,
          borderRadius: 20,
          boxShadow: '0 8px 32px rgba(255, 107, 53, 0.2)',
          overflow: 'hidden',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🏪</div>
          <Title level={2} style={{ margin: 0, color: '#FF6B35' }}>
            商家登录
          </Title>
          <Text type="secondary">登录您的商家管理后台</Text>
        </div>

        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="phone"
            rules={[
              { required: true, message: '请输入手机号' },
              { validator: (_, value) => isValidPhone(value) ? Promise.resolve() : Promise.reject('请输入有效的手机号') },
            ]}
          >
            <Input
              prefix={<MobileOutlined style={{ color: '#FFB74D' }} />}
              placeholder="请输入手机号"
              style={{ borderRadius: 12, height: 48 }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { validator: (_, value) => isValidPassword(value) ? Promise.resolve() : Promise.reject('密码长度为6-20位') },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#FFB74D' }} />}
              placeholder="请输入密码"
              style={{ borderRadius: 12, height: 48 }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{
                height: 48,
                borderRadius: 24,
                fontSize: 16,
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #FF6B35 0%, #FF8555 100%)',
                border: 'none',
              }}
            >
              登录
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <Space size="large" direction="vertical">
            <div>
              <Text type="secondary">
                还没有商家账号？{' '}
                <Link to="/merchant/register" style={{ color: '#FF6B35', fontWeight: 'bold' }}>
                  立即入驻
                </Link>
              </Text>
            </div>
            <div>
              <Link to="/login" style={{ color: '#FF6B35' }}>
                <ShopOutlined /> 返回用户端登录
              </Link>
            </div>
          </Space>
        </div>

        <div style={{ textAlign: 'center', marginTop: 16, padding: 12, background: '#FFF3E0', borderRadius: 12 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            商家入驻请联系客服或拨打：400-888-8888
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default MerchantLogin;
