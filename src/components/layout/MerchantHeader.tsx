import React from 'react';
import { Layout, Button, Dropdown, Space, Typography, Badge, Avatar } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { merchantLogoutAsync } from '../../store/slices/merchantAuthSlice';
import Breadcrumb from 'antd/es/breadcrumb';

const { Header } = Layout;
const { Text } = Typography;

interface MerchantHeaderProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

const MerchantHeader: React.FC<MerchantHeaderProps> = ({ collapsed, onCollapse }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { merchant } = useAppSelector((state) => state.merchantAuth);

  const handleLogout = () => {
    dispatch(merchantLogoutAsync());
    navigate('/merchant/login');
  };

  const dropdownItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '商家信息',
      onClick: () => navigate('/merchant/settings'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '店铺设置',
      onClick: () => navigate('/merchant/settings'),
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
    <Header
      className="merchant-header"
      style={{
        padding: '0 24px',
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        zIndex: 10,
      }}
    >
      <div className="header-left">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => onCollapse(!collapsed)}
          style={{
            fontSize: '16px',
            width: 48,
            height: 48,
          }}
          className="collapse-button"
        />

        {/* 面包屑导航 */}
        <Breadcrumb style={{ marginLeft: '16px' }}>
          <Breadcrumb.Item>商家后台</Breadcrumb.Item>
          <Breadcrumb.Item>首页</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className="header-right">
        <Space size="large">
          {/* 通知图标 */}
          <Badge count={5} size="small">
            <Button
              type="text"
              icon={<BellOutlined />}
              style={{ fontSize: '16px' }}
              className="notification-button"
            />
          </Badge>

          {/* 商家头像下拉菜单 */}
          <Dropdown menu={{ items: dropdownItems }} placement="bottomRight">
            <Space className="merchant-dropdown-trigger" style={{ cursor: 'pointer' }}>
              <Avatar
                size={36}
                icon={<UserOutlined />}
                src={merchant?.logo}
                style={{ backgroundColor: '#fa8c16' }}
              />
              <Text className="merchant-name">
                {merchant?.name || '商家'}
              </Text>
              <DownOutlined style={{ fontSize: '12px' }} />
            </Space>
          </Dropdown>
        </Space>
      </div>
    </Header>
  );
};

export default MerchantHeader;
