import React, { useEffect, useState } from 'react';
import { Typography, Tabs, Spin, Empty, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { getOrdersAsync } from '../../store/slices/ordersSlice';
import { OrderItem } from '../../components/business';

const { Title, Text } = Typography;

const Orders: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { list, loading } = useAppSelector(state => state.orders);
  const [activeTab, setActiveTab] = useState<string>('all');

  useEffect(() => {
    const status = activeTab === 'all' ? undefined : activeTab;
    dispatch(getOrdersAsync({ status }));
  }, [dispatch, activeTab]);

  const tabItems = [
    { key: 'all', label: '全部订单' },
    { key: 'pending_payment', label: '待支付' },
    { key: 'paid', label: '已支付' },
    { key: 'in_progress', label: '服务中' },
    { key: 'completed', label: '已完成' },
    { key: 'cancelled', label: '已取消' },
  ];

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <Title level={2} style={{ marginBottom: 8 }}>
          📋 我的订单
        </Title>
        <Text type="secondary">查看和管理您的所有订单</Text>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        style={{ marginBottom: 24 }}
      />

      {loading ? (
        <div style={{ textAlign: 'center', padding: 100 }}>
          <Spin size="large" />
        </div>
      ) : list.length === 0 ? (
        <Empty
          description="暂无订单"
          style={{ padding: 100 }}
        >
          <Button type="primary" onClick={() => navigate('/services')} style={{ borderRadius: 20 }}>
            去预约服务
          </Button>
        </Empty>
      ) : (
        <div>
          {list.map(order => (
            <OrderItem key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
