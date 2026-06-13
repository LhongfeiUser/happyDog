import React, { useEffect, useState, useMemo } from 'react';
import { Row, Col, Card, Select, DatePicker, Button, Statistic, Space, Alert } from 'antd';
import { SearchOutlined, ReloadOutlined, ShoppingOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useAppSelector, useAppDispatch } from '../../../hooks';
import { getOrdersListAsync, setStatusFilter } from '../../../store/slices/merchantOrdersSlice';
import type { Order, OrderStatus } from '../../../types';
import OrderList from './OrderList';
import OrderDetail from './OrderDetail';
import { formatPrice } from '../../../utils';

const { RangePicker } = DatePicker;

const Orders: React.FC = () => {
  const dispatch = useAppDispatch();
  const { list, loading, total, error, statusFilter } = useAppSelector((state) => state.merchantOrders);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);

  // 获取订单列表 - 使用useCallback避免重复创建
  const fetchOrders = React.useCallback(() => {
    const params: any = {
      page: 1,
      pageSize: 10,
    };

    if (statusFilter && statusFilter !== 'all') {
      params.status = statusFilter;
    }

    if (dateRange) {
      params.startDate = dateRange[0];
      params.endDate = dateRange[1];
    }

    dispatch(getOrdersListAsync(params));
  }, [dispatch, statusFilter, dateRange]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // 使用useMemo缓存统计计算
  const statistics = useMemo(() => ({
    pendingAccept: list.filter(o => o.status === 'pending_accept').length,
    accepted: list.filter(o => o.status === 'accepted').length,
    inProgress: list.filter(o => o.status === 'in_progress').length,
    completed: list.filter(o => o.status === 'completed').length,
  }), [list]);

  // 查看详情
  const handleViewDetail = (order: Order) => {
    setSelectedOrder(order);
    setDetailVisible(true);
  };

  // 刷新列表
  const handleRefresh = () => {
    fetchOrders();
  };

  // 状态筛选变更
  const handleStatusChange = (value: OrderStatus | 'all') => {
    dispatch(setStatusFilter(value));
  };

  // 日期范围变更
  const handleDateChange = (dates: any, dateStrings: [string, string]) => {
    if (dates) {
      setDateRange(dateStrings);
    } else {
      setDateRange(null);
    }
  };

  // 搜索
  const handleSearch = () => {
    fetchOrders();
  };

  // 重置筛选
  const handleReset = () => {
    setDateRange(null);
    dispatch(setStatusFilter('all'));
  };

  // 使用useMemo缓存统计数据
  const { pendingAcceptCount, acceptedCount, inProgressCount, completedCount, totalRevenue } = useMemo(() => ({
    pendingAcceptCount: list.filter((o) => o.status === 'pending_accept').length,
    acceptedCount: list.filter((o) => o.status === 'accepted').length,
    inProgressCount: list.filter((o) => o.status === 'in_progress').length,
    completedCount: list.filter((o) => o.status === 'completed').length,
    totalRevenue: list
      .filter((o) => o.status === 'completed')
      .reduce((sum, o) => sum + o.totalPrice, 0),
  }), [list]);

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      {/* 错误提示 */}
      {error && (
        <Alert
          message="加载失败"
          description={error}
          type="error"
          showIcon
          closable
          className="mb-4"
        />
      )}

      {/* 页面标题 */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 600, color: '#1f1f1f', margin: 0 }}>
          订单管理
        </h2>
        <p style={{ color: '#8c8c8c', margin: '8px 0 0' }}>
          查看和处理用户的宠物服务订单
        </p>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card
            hoverable
            style={{
              borderRadius: 12,
              background: 'linear-gradient(135deg, #ff7a45 0%, #ffa940 100%)',
              border: 'none',
            }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.85)' }}>待接单</span>}
              value={pendingAcceptCount}
              suffix="单"
              prefix={<ClockCircleOutlined style={{ color: '#fff' }} />}
              valueStyle={{ color: '#fff', fontSize: 28, fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card
            hoverable
            style={{
              borderRadius: 12,
              background: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)',
              border: 'none',
            }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.85)' }}>已接单</span>}
              value={acceptedCount}
              suffix="单"
              prefix={<CheckCircleOutlined style={{ color: '#fff' }} />}
              valueStyle={{ color: '#fff', fontSize: 28, fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card
            hoverable
            style={{
              borderRadius: 12,
              background: 'linear-gradient(135deg, #13c2c2 0%, #36cfc9 100%)',
              border: 'none',
            }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.85)' }}>服务中</span>}
              value={inProgressCount}
              suffix="单"
              prefix={<CheckCircleOutlined style={{ color: '#fff' }} />}
              valueStyle={{ color: '#fff', fontSize: 28, fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card
            hoverable
            style={{
              borderRadius: 12,
              background: 'linear-gradient(135deg, #FF6B35 0%, #FF8555 100%)',
              border: 'none',
            }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.85)' }}>已完成订单</span>}
              value={completedCount}
              suffix="单"
              prefix={<ShoppingOutlined style={{ color: '#fff' }} />}
              valueStyle={{ color: '#fff', fontSize: 28, fontWeight: 600 }}
            />
          </Card>
        </Col>
      </Row>

      {/* 筛选区域 */}
      <Card
        style={{
          marginBottom: 16,
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}
      >
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={8} md={6}>
            <Select
              placeholder="订单状态"
              style={{ width: '100%' }}
              value={statusFilter}
              onChange={handleStatusChange}
              options={[
                { value: 'all', label: '全部状态' },
                { value: 'pending_payment', label: '待支付' },
                { value: 'paid', label: '已支付' },
                { value: 'pending_accept', label: '待接单' },
                { value: 'accepted', label: '已接单' },
                { value: 'in_progress', label: '服务中' },
                { value: 'completed', label: '已完成' },
                { value: 'reviewed', label: '已评价' },
                { value: 'cancelled', label: '已取消' },
                { value: 'refunding', label: '退款中' },
              ]}
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <RangePicker
              style={{ width: '100%' }}
              onChange={handleDateChange}
              format="YYYY-MM-DD"
              placeholder={['开始日期', '结束日期']}
            />
          </Col>
          <Col xs={24} sm={8} md={6}>
            <Space>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={handleSearch}
                style={{
                  background: '#FF6B35',
                  borderColor: '#FF6B35',
                  borderRadius: 20,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#FF8555';
                  e.currentTarget.style.borderColor = '#FF8555';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#FF6B35';
                  e.currentTarget.style.borderColor = '#FF6B35';
                }}
              >
                搜索
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={handleReset}
                style={{ borderRadius: 20 }}
              >
                重置
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 订单列表 */}
      <OrderList
        orders={list}
        loading={loading}
        onViewDetail={handleViewDetail}
        onRefresh={handleRefresh}
      />

      {/* 订单详情弹窗 */}
      <OrderDetail
        visible={detailVisible}
        order={selectedOrder}
        onClose={() => {
          setDetailVisible(false);
          setSelectedOrder(null);
        }}
      />
    </div>
  );
};

export default Orders;
