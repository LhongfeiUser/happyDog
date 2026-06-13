import React, { useEffect, useState } from 'react';
import { Row, Col, Spin, Result, Button, Segmented, Card } from 'antd';
import {
  ShoppingCartOutlined,
  WalletOutlined,
  ClockCircleOutlined,
  StarOutlined,
  ReloadOutlined,
  TeamOutlined,
  UserAddOutlined,
  RiseOutlined,
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { getStatisticsDataAsync } from '../../../store/slices/merchantStatisticsSlice';
import RevenueChart from './RevenueChart';
import OrderStatusChart from './OrderStatusChart';
import TopServicesChart from './TopServicesChart';
import { formatPrice } from '../../../utils';

type TimeRange = 'today' | 'week' | 'month' | 'year';

const MerchantStatistics: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data: statistics, loading, error } = useAppSelector(
    state => state.merchantStatistics
  );
  const [timeRange, setTimeRange] = useState<TimeRange>('month');

  useEffect(() => {
    const params = getDateRangeParams(timeRange);
    dispatch(getStatisticsDataAsync(params))
      .unwrap()
      .catch(error => {
        console.error('Failed to fetch statistics:', error);
      });
  }, [dispatch, timeRange]);

  const getDateRangeParams = (range: TimeRange) => {
    const now = new Date();
    let startDate: Date;

    switch (range) {
      case 'today':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(now.setMonth(now.getMonth() - 1));
    }

    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
    };
  };

  const handleRefresh = () => {
    const params = getDateRangeParams(timeRange);
    dispatch(getStatisticsDataAsync(params));
  };

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value as TimeRange);
  };

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <Result
          status="error"
          title="加载失败"
          subTitle="无法加载统计数据，请稍后重试"
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

  const monthlyRevenueData = statistics?.monthlyRevenue || [];
  const orderStatusData = statistics?.orderStatusDistribution || [];
  const topServicesData = statistics?.topServices || [];
  const customerAnalysis = statistics?.customerAnalysis || {
    newCustomers: 0,
    repeatCustomers: 0,
    totalCustomers: 0,
  };

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
          flexWrap: 'wrap',
          gap: 16,
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
            数据统计
          </h1>
          <p style={{ fontSize: 14, color: '#999', margin: 0 }}>
            查看店铺运营的各项数据指标和分析图表
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Segmented
            value={timeRange}
            onChange={handleTimeRangeChange}
            options={[
              { label: '今日', value: 'today' },
              { label: '本周', value: 'week' },
              { label: '本月', value: 'month' },
              { label: '本年', value: 'year' },
            ]}
            style={{
              borderRadius: 20,
            }}
          />
          <Button
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            loading={loading}
            style={{
              borderRadius: 20,
              borderColor: '#FF6B35',
              color: '#FF6B35',
            }}
          >
            刷新数据
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              borderRadius: 16,
              boxShadow: '0 2px 8px rgba(255, 107, 53, 0.1)',
              background: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0CC 100%)',
            }}
            bodyStyle={{ padding: 20 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  backgroundColor: 'rgba(255, 107, 53, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ShoppingCartOutlined style={{ fontSize: 24, color: '#FF6B35' }} />
              </div>
              <div>
                <div style={{ fontSize: 14, color: '#666' }}>今日订单</div>
                <Spin spinning={loading}>
                  <div style={{ fontSize: 28, fontWeight: 600, color: '#FF6B35' }}>
                    {statistics?.todayOrders || 0}
                  </div>
                </Spin>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              borderRadius: 16,
              boxShadow: '0 2px 8px rgba(76, 175, 80, 0.1)',
              background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
            }}
            bodyStyle={{ padding: 20 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  backgroundColor: 'rgba(76, 175, 80, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <WalletOutlined style={{ fontSize: 24, color: '#4CAF50' }} />
              </div>
              <div>
                <div style={{ fontSize: 14, color: '#666' }}>今日收入</div>
                <Spin spinning={loading}>
                  <div style={{ fontSize: 28, fontWeight: 600, color: '#4CAF50' }}>
                    ¥{formatPrice(statistics?.todayRevenue || 0)}
                  </div>
                </Spin>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              borderRadius: 16,
              boxShadow: '0 2px 8px rgba(255, 193, 7, 0.1)',
              background: 'linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%)',
            }}
            bodyStyle={{ padding: 20 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  backgroundColor: 'rgba(255, 193, 7, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ClockCircleOutlined style={{ fontSize: 24, color: '#FFC107' }} />
              </div>
              <div>
                <div style={{ fontSize: 14, color: '#666' }}>待处理订单</div>
                <Spin spinning={loading}>
                  <div style={{ fontSize: 28, fontWeight: 600, color: '#FFC107' }}>
                    {statistics?.pendingOrders || 0}
                  </div>
                </Spin>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              borderRadius: 16,
              boxShadow: '0 2px 8px rgba(255, 107, 53, 0.1)',
              background: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0CC 100%)',
            }}
            bodyStyle={{ padding: 20 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  backgroundColor: 'rgba(255, 107, 53, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <StarOutlined style={{ fontSize: 24, color: '#FF6B35' }} />
              </div>
              <div>
                <div style={{ fontSize: 14, color: '#666' }}>平均评分</div>
                <Spin spinning={loading}>
                  <div style={{ fontSize: 28, fontWeight: 600, color: '#FF6B35' }}>
                    {(statistics?.averageRating || 0).toFixed(1)}
                  </div>
                </Spin>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Main Charts */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={16}>
          <RevenueChart data={monthlyRevenueData} loading={loading} />
        </Col>
        <Col xs={24} lg={8}>
          <OrderStatusChart data={orderStatusData} loading={loading} />
        </Col>
      </Row>

      {/* Top Services and Customer Analysis */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <TopServicesChart data={topServicesData} loading={loading} />
        </Col>
        <Col xs={24} lg={10}>
          <Card
            title={
              <span style={{ fontSize: 16, fontWeight: 600, color: '#333' }}>
                客户分析
              </span>
            }
            style={{
              borderRadius: 16,
              boxShadow: '0 2px 8px rgba(255, 107, 53, 0.1)',
              height: '100%',
            }}
            bodyStyle={{ padding: '20px 24px' }}
          >
            <Spin spinning={loading}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div
                  style={{
                    padding: 16,
                    borderRadius: 12,
                    backgroundColor: '#FFF3E0',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <TeamOutlined style={{ fontSize: 20, color: '#FF6B35' }} />
                    <span style={{ fontSize: 16, fontWeight: 500, color: '#333' }}>
                      累计客户数
                    </span>
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 600, color: '#FF6B35' }}>
                    {customerAnalysis.totalCustomers}
                  </div>
                </div>

                <div
                  style={{
                    padding: 16,
                    borderRadius: 12,
                    backgroundColor: '#E8F5E9',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <UserAddOutlined style={{ fontSize: 20, color: '#4CAF50' }} />
                    <span style={{ fontSize: 16, fontWeight: 500, color: '#333' }}>
                      新客户
                    </span>
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 600, color: '#4CAF50' }}>
                    {customerAnalysis.newCustomers}
                  </div>
                  <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                    占比{' '}
                    {customerAnalysis.totalCustomers > 0
                      ? ((customerAnalysis.newCustomers / customerAnalysis.totalCustomers) * 100).toFixed(1)
                      : 0}
                    %
                  </div>
                </div>

                <div
                  style={{
                    padding: 16,
                    borderRadius: 12,
                    backgroundColor: '#E3F2FD',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <RiseOutlined style={{ fontSize: 20, color: '#2196F3' }} />
                    <span style={{ fontSize: 16, fontWeight: 500, color: '#333' }}>
                      回头客
                    </span>
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 600, color: '#2196F3' }}>
                    {customerAnalysis.repeatCustomers}
                  </div>
                  <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                    复购率{' '}
                    {customerAnalysis.totalCustomers > 0
                      ? ((customerAnalysis.repeatCustomers / customerAnalysis.totalCustomers) * 100).toFixed(1)
                      : 0}
                    %
                  </div>
                </div>
              </div>
            </Spin>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MerchantStatistics;
