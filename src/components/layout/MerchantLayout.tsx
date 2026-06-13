import React, { useState, useEffect } from 'react';
import { Layout, theme } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import MerchantSider from './MerchantSider';
import MerchantHeader from './MerchantHeader';
import { useAppSelector } from '../../store/hooks';
import './MerchantLayout.css';

const { Content } = Layout;

const MerchantLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { token: merchantToken } = useAppSelector((state) => state.merchantAuth);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  // 检查商家登录状态
  useEffect(() => {
    if (!merchantToken) {
      navigate('/merchant/login');
    }
  }, [merchantToken, navigate]);

  // 如果未登录，不渲染布局
  if (!merchantToken) {
    return null;
  }

  const handleCollapse = (collapsed: boolean) => {
    setCollapsed(collapsed);
  };

  return (
    <Layout className="merchant-layout" style={{ minHeight: '100vh' }}>
      <MerchantSider collapsed={collapsed} />

      <Layout>
        <MerchantHeader collapsed={collapsed} onCollapse={handleCollapse} />

        <Content
          className="merchant-content"
          style={{
            margin: '24px',
            padding: '24px',
            background: colorBgContainer,
            borderRadius: '8px',
            minHeight: 'calc(100vh - 112px)',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MerchantLayout;
