import React from 'react';
import { Layout, Menu, Avatar, Dropdown, Space, Typography } from 'antd';
import {
  DashboardOutlined,
  ShoppingOutlined,
  UnorderedListOutlined,
  BarChartOutlined,
  SettingOutlined,
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { merchantLogoutAsync } from '../../store/slices/merchantAuthSlice';

const { Sider } = Layout;
const { Text } = Typography;

interface MerchantSiderProps {
  collapsed: boolean;
}

const MerchantSider: React.FC<MerchantSiderProps> = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { merchant } = useAppSelector((state) => state.merchantAuth);

  const menuItems = [
    {
      key: '/merchant/dashboard',
      icon: <DashboardOutlined />,
      label: '仪表盘',
    },
    {
      key: '/merchant/services',
      icon: <ShoppingOutlined />,
      label: '服务管理',
    },
    {
      key: '/merchant/orders',
      icon: <UnorderedListOutlined />,
      label: '订单管理',
    },
    {
      key: '/merchant/statistics',
      icon: <BarChartOutlined />,
      label: '数据统计',
    },
    {
      key: '/merchant/settings',
      icon: <SettingOutlined />,
      label: '店铺设置',
    },
  ];

  const handleMenuClick = (key: string) => {
    navigate(key);
  };

  const handleLogout = () => {
    dispatch(merchantLogoutAsync());
    navigate('/merchant/login');
  };

  const dropdownItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '商家信息',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={240}
      className="merchant-sider"
      style={{
        backgroundColor: '#fff',
        boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* 商家信息 */}
      <div className="merchant-info">
        <Dropdown menu={{ items: dropdownItems }} placement="bottomLeft">
          <Space className="merchant-info-trigger">
            <Avatar
              size={collapsed ? 32 : 48}
              icon={<UserOutlined />}
              src={merchant?.logo}
              style={{ backgroundColor: '#fa8c16' }}
            />
            {!collapsed && (
              <div className="merchant-details">
                <Text strong className="merchant-name">
                  {merchant?.name || '商家'}
                </Text>
                <Text type="secondary" className="merchant-role">
                  商家管理员
                </Text>
              </div>
            )}
          </Space>
        </Dropdown>
      </div>

      {/* 导航菜单 */}
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key }) => handleMenuClick(key)}
        style={{
          borderRight: 0,
          marginTop: '8px',
        }}
        className="merchant-menu"
      />

      {/* 退出登录按钮 */}
      <div className="logout-button">
        <Menu
          mode="inline"
          items={[
            {
              key: 'logout',
              icon: <LogoutOutlined />,
              label: '退出登录',
              onClick: handleLogout,
            },
          ]}
          style={{ borderRight: 0 }}
        />
      </div>
    </Sider>
  );
};

export default MerchantSider;
