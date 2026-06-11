import React from 'react';
import { Card, Form, Input, Button, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, MobileOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { registerAsync } from '../../store/slices/authSlice';
import { isValidPhone, isValidPassword, isValidNickname } from '../../utils';

const { Title, Text } = Typography;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector(state => state.auth);
  const [form] = Form.useForm();

  const handleSubmit = async (values: { phone: string; password: string; nickname: string }) => {
    try {
      await dispatch(registerAsync(values)).unwrap();
      message.success('注册成功！');
      navigate('/');
    } catch (error) {
      message.error('注册失败：' + error);
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
          <div style={{ fontSize: 64, marginBottom: 16 }}>🐾</div>
          <Title level={2} style={{ margin: 0, color: '#FF6B35' }}>
            注册新账号
          </Title>
          <Text type="secondary">加入宠物服务平台，享受专业服务</Text>
        </div>

        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="nickname"
            rules={[
              { required: true, message: '请输入昵称' },
              { validator: (_, value) => isValidNickname(value) ? Promise.resolve() : Promise.reject('昵称长度为2-20位') },
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#FFB74D' }} />}
              placeholder="请输入昵称"
              style={{ borderRadius: 12, height: 48 }}
            />
          </Form.Item>

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
              placeholder="请输入密码（6-20位）"
              style={{ borderRadius: 12, height: 48 }}
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: '请确认密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject('两次输入的密码不一致');
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#FFB74D' }} />}
              placeholder="请确认密码"
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
              注册
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center' }}>
          <Text type="secondary">
            已有账号？{' '}
            <Link to="/login" style={{ color: '#FF6B35', fontWeight: 'bold' }}>
              立即登录
            </Link>
          </Text>
        </div>

        <div style={{ textAlign: 'center', marginTop: 16, padding: 12, background: '#FFF3E0', borderRadius: 12 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            注册即表示同意{' '}
            <a href="#" style={{ color: '#FF6B35' }}>用户协议</a>
            {' '}和{' '}
            <a href="#" style={{ color: '#FF6B35' }}>隐私政策</a>
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default Register;
