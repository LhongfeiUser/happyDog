import React from 'react';
import { Typography, Card, Row, Col, Avatar, Button, Descriptions, message, Spin } from 'antd';
import { UserOutlined, EditOutlined, LogoutOutlined, ShoppingOutlined, HeartOutlined, StarOutlined, CustomerServiceOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth, useAppDispatch } from '../../hooks';
import { logoutAsync } from '../../store/slices/authSlice';
import { formatDate } from '../../utils';

const { Title, Text } = Typography;

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, loading } = useAuth();

  const handleLogout = async () => {
    await dispatch(logoutAsync());
    message.success('已退出登录');
    navigate('/login');
  };

  if (loading || !user) {
    return (
      <div style={{ textAlign: 'center', padding: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  const menuItems = [
    {
      icon: <ShoppingOutlined style={{ fontSize: 24, color: '#2196F3' }} />,
      title: '我的订单',
      description: '查看所有订单',
      path: '/orders',
    },
    {
      icon: <HeartOutlined style={{ fontSize: 24, color: '#E91E63' }} />,
      title: '我的宠物',
      description: '管理宠物档案',
      path: '/pets',
    },
    {
      icon: <StarOutlined style={{ fontSize: 24, color: '#FF9800' }} />,
      title: '我的评价',
      description: '查看评价记录',
      path: '/reviews',
    },
    {
      icon: <CustomerServiceOutlined style={{ fontSize: 24, color: '#4CAF50' }} />,
      title: '售后服务',
      description: '申请售后',
      path: '/after-sales',
    },
  ];

  return (
    <div>
      <Row gutter={24}>
        <Col span={8}>
          <Card style={{ borderRadius: 16, textAlign: 'center', padding: '32px 24px' }}>
            <Avatar
              size={100}
              src={user.avatar}
              icon={<UserOutlined />}
              style={{ backgroundColor: '#FFB74D', marginBottom: 16 }}
            />
            <Title level={3} style={{ marginBottom: 8 }}>
              {user.nickname}
            </Title>
            <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
              📱 {user.phone}
            </Text>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
              <Button
                icon={<EditOutlined />}
                onClick={() => message.info('编辑功能开发中')}
                style={{ borderRadius: 20 }}
              >
                编辑资料
              </Button>
              <Button
                danger
                icon={<LogoutOutlined />}
                onClick={handleLogout}
                style={{ borderRadius: 20 }}
              >
                退出登录
              </Button>
            </div>
          </Card>

          <Card style={{ borderRadius: 16, marginTop: 24 }}>
            <Descriptions column={1}>
              <Descriptions.Item label="注册时间">
                {formatDate(user.createTime, 'YYYY-MM-DD')}
              </Descriptions.Item>
              <Descriptions.Item label="最后更新">
                {formatDate(user.updateTime, 'YYYY-MM-DD')}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col span={16}>
          <Card style={{ borderRadius: 16, marginBottom: 24 }}>
            <Title level={4} style={{ marginBottom: 24 }}>
              快捷操作
            </Title>
            <Row gutter={16}>
              {menuItems.map((item, index) => (
                <Col span={6} key={index}>
                  <Card
                    hoverable
                    style={{
                      borderRadius: 12,
                      textAlign: 'center',
                      cursor: 'pointer',
                    }}
                    onClick={() => navigate(item.path)}
                  >
                    <div style={{ marginBottom: 12 }}>{item.icon}</div>
                    <Text strong>{item.title}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {item.description}
                    </Text>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>

          <Card style={{ borderRadius: 16 }}>
            <Title level={4} style={{ marginBottom: 24 }}>
              账户信息
            </Title>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="用户ID">{user.id}</Descriptions.Item>
              <Descriptions.Item label="手机号">{user.phone}</Descriptions.Item>
              <Descriptions.Item label="昵称">{user.nickname}</Descriptions.Item>
              <Descriptions.Item label="账号状态">
                <Text style={{ color: '#4CAF50' }}>正常</Text>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Profile;
