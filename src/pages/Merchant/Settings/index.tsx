import React from 'react';
import { Typography, Tabs } from 'antd';
import { ShopOutlined, UserOutlined, FileProtectOutlined, ClockCircleOutlined } from '@ant-design/icons';
import BasicInfoForm from './BasicInfoForm';
import ContactInfoForm from './ContactInfoForm';
import QualificationForm from './QualificationForm';
import ShopDisplayForm from './ShopDisplayForm';

const { Title, Text } = Typography;

const MerchantSettings: React.FC = () => {
  const tabItems = [
    {
      key: 'basic',
      label: (
        <span>
          <ShopOutlined />
          基本信息
        </span>
      ),
      children: <BasicInfoForm />,
    },
    {
      key: 'contact',
      label: (
        <span>
          <UserOutlined />
          联系信息
        </span>
      ),
      children: <ContactInfoForm />,
    },
    {
      key: 'qualification',
      label: (
        <span>
          <FileProtectOutlined />
          营业资质
        </span>
      ),
      children: <QualificationForm />,
    },
    {
      key: 'display',
      label: (
        <span>
          <ClockCircleOutlined />
          店铺展示
        </span>
      ),
      children: <ShopDisplayForm />,
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, color: '#333' }}>
          <ShopOutlined style={{ marginRight: 12 }} />
          店铺设置
        </Title>
        <Text type="secondary">管理您的商家信息和店铺信息</Text>
      </div>

      {/* 标签页 */}
      <Tabs
        defaultActiveKey="basic"
        items={tabItems}
        size="large"
        style={{
          backgroundColor: '#fff',
          padding: '24px',
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        }}
      />
    </div>
  );
};

export default MerchantSettings;
