import React from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Space } from 'antd';
import { UserOutlined, LogoutOutlined, HomeOutlined, ShoppingOutlined, HeartOutlined, StarOutlined, CustomerServiceOutlined, BarChartOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth, useAppDispatch } from '../../hooks';
import { logoutAsync } from '../../store/slices/authSlice';

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAuth();

  const handleLogout = async () => {
    await dispatch(logoutAsync());
    navigate('/login');
  };

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: '首页',
    },
    {
      key: '/services',
      icon: <ShoppingOutlined />,
      label: '服务',
    },
    {
      key: '/orders',
      icon: <HeartOutlined />,
      label: '订单',
    },
    {
      key: '/reviews',
      icon: <StarOutlined />,
      label: '评价',
    },
    {
      key: '/after-sales',
      icon: <CustomerServiceOutlined />,
      label: '售后',
    },
    {
      key: '/statistics',
      icon: <BarChartOutlined />,
      label: '数据统计',
    },
  ];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'pets',
      icon: <HeartOutlined />,
      label: '我的宠物',
      onClick: () => navigate('/pets'),
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  return (
    <AntHeader
      className="flex items-center justify-between"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: 'linear-gradient(135deg, #FF6B35 0%, #FF8555 100%)',
        padding: '0 50px',
        boxShadow: '0 2px 8px rgba(255, 107, 53, 0.3)',
      }}
    >
      <div className="flex items-center">
        <div
          className="flex items-center gap-4"
          style={{
            color: 'white',
            fontSize: '24px',
            fontWeight: 'bold',
            marginRight: '50px',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/')}
        >
          <span style={{ fontSize: '28px' }}>🐾</span>
          宠物服务平台
        </div>
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{
            background: 'transparent',
            borderBottom: 'none',
            color: 'white',
          }}
          theme="dark"
        />
      </div>
      <div>
        {isAuthenticated ? (
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Space style={{ cursor: 'pointer', color: 'white' }}>
              <Avatar
                src={user?.avatar}
                icon={<UserOutlined />}
                style={{ backgroundColor: '#FFB74D' }}
              />
              <span style={{ color: 'white' }}>{user?.nickname}</span>
            </Space>
          </Dropdown>
        ) : (
          <Space>
            <Button
              type="text"
              style={{ color: 'white' }}
              onClick={() => navigate('/login')}
            >
              登录
            </Button>
            <Button
              style={{
                backgroundColor: 'white',
                borderColor: 'white',
                color: '#FF6B35',
                borderRadius: '20px',
              }}
              onClick={() => navigate('/register')}
            >
              注册
            </Button>
          </Space>
        )}
      </div>
    </AntHeader>
  );
};

export default Header;
