import React, { useEffect } from 'react';
import { Row, Col, Spin, Result, Button } from 'antd';
import {
  ShoppingCartOutlined,
  WalletOutlined,
  ClockCircleOutlined,
  StarOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { getStatisticsDataAsync } from '../../../store/slices/merchantStatisticsSlice';
import { getOrdersListAsync } from '../../../store/slices/merchantOrdersSlice';
import StatCard from './StatCard';
import RecentOrders from './RecentOrders';
import RevenueChart from './RevenueChart';
import { formatPrice } from '../../../utils';
import type { Order } from '../../../types';

const MerchantDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data: statistics, loading: statsLoading, error: statsError } = useAppSelector(
    state => state.merchantStatistics
  );
  const { list: orders, loading: ordersLoading, error: ordersError } = useAppSelector(
    state => state.merchantOrders
  );

  useEffect(() => {
    // Fetch statistics for the last week
    dispatch(getStatisticsDataAsync({}))
      .unwrap()
      .catch(error => {
        console.error('Failed to fetch statistics:', error);
      });

    // Fetch recent orders (latest 5)
    dispatch(getOrdersListAsync({ pageSize: 5, page: 1 }))
      .unwrap()
      .catch(error => {
        console.error('Failed to fetch orders:', error);
      });
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(getStatisticsDataAsync({}));
    dispatch(getOrdersListAsync({ pageSize: 5, page: 1 }));
  };

  const handleViewOrderDetail = (order: Order) => {
    // Navigate to order detail page or open modal
    console.log('View order detail:', order);
  };

  // Show error state if both requests fail
  if (statsError && ordersError) {
    return (
      <div style={{ padding: 24 }}>
        <Result
          status="error"
          title="加载失败"
          subTitle="无法加载仪表盘数据，请稍后重试"
          extra={
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              style={{
                backgroundColor: '#FF6B35',
                borderColor: '#FF6B35',
                borderRadius: 20,
              }}
            >
              重新加载
            </Button>
          }
        />
      </div>
    );
  }

  // Prepare monthly revenue data for chart
  const monthlyRevenueData = statistics?.monthlyRevenue || [];

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 600,
              color: '#333',
              margin: 0,
              marginBottom: 4,
            }}
          >
            商家仪表盘
          </h1>
          <p style={{ fontSize: 14, color: '#999', margin: 0 }}>
            欢迎回来！查看您的店铺运营数据
          </p>
        </div>
        <Button
          icon={<ReloadOutlined />}
          onClick={handleRefresh}
          loading={statsLoading || ordersLoading}
          style={{
            borderRadius: 20,
            borderColor: '#FF6B35',
            color: '#FF6B35',
          }}
        >
          刷新数据
        </Button>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="今日订单"
            value={statistics?.todayOrders || 0}
            prefix={<ShoppingCartOutlined />}
            trend="up"
            trendValue="12%"
            loading={statsLoading}
            color="#FF6B35"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="今日收入"
            value={statistics?.todayRevenue || 0}
            prefix="¥"
            precision={2}
            trend="up"
            trendValue="8.5%"
            loading={statsLoading}
            color="#4CAF50"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="待处理订单"
            value={statistics?.pendingOrders || 0}
            prefix={<ClockCircleOutlined />}
            loading={statsLoading}
            color="#FFC107"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="店铺评分"
            value={statistics?.averageRating || 0}
            prefix={<StarOutlined />}
            suffix="分"
            precision={1}
            trend="up"
            trendValue="0.2"
            loading={statsLoading}
            color="#FF6B35"
          />
        </Col>
      </Row>

      {/* Charts and Orders */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <RevenueChart
            data={monthlyRevenueData}
            loading={statsLoading}
          />
        </Col>
        <Col xs={24} lg={10}>
          <RecentOrders
            orders={orders.slice(0, 5)}
            loading={ordersLoading}
            onViewDetail={handleViewOrderDetail}
          />
        </Col>
      </Row>

      {/* Additional Statistics */}
      {statistics && (
        <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
          <Col xs={24} sm={8}>
            <div
              style={{
                background: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0CC 100%)',
                borderRadius: 16,
                padding: 24,
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 32, fontWeight: 600, color: '#FF6B35' }}>
                {statistics.totalServices}
              </div>
              <div style={{ fontSize: 14, color: '#666', marginTop: 8 }}>
                服务项目总数
              </div>
            </div>
          </Col>
          <Col xs={24} sm={8}>
            <div
              style={{
                background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
                borderRadius: 16,
                padding: 24,
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 32, fontWeight: 600, color: '#4CAF50' }}>
                {statistics.customerAnalysis?.totalCustomers || 0}
              </div>
              <div style={{ fontSize: 14, color: '#666', marginTop: 8 }}>
                累计客户数
              </div>
            </div>
          </Col>
          <Col xs={24} sm={8}>
            <div
              style={{
                background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
                borderRadius: 16,
                padding: 24,
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 32, fontWeight: 600, color: '#2196F3' }}>
                {statistics.customerAnalysis?.repeatCustomers || 0}
              </div>
              <div style={{ fontSize: 14, color: '#666', marginTop: 8 }}>
                回头客数量
              </div>
            </div>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default MerchantDashboard;
