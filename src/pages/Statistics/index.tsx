import React, { useEffect } from 'react';
import { Typography, Card, Row, Col, Tag, Progress, Empty, Result, Button } from 'antd';
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  StarOutlined,
  RiseOutlined,
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { getStatisticsAsync } from '../../store/slices/statisticsSlice';
import StatCard from '../../components/business/StatCard';
import SimpleChart from '../../components/common/SimpleChart';
import RankList from '../../components/business/RankList';
import type { EChartsOption } from 'echarts';

const { Title, Text } = Typography;

const Statistics: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector(state => state.statistics);

  useEffect(() => {
    dispatch(getStatisticsAsync());
  }, [dispatch]);

  // 折线图配置
  const lineChartOption: EChartsOption = {
    title: {
      text: '月度订单趋势',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
      formatter: '{b}<br/>订单数: {c}',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data?.monthlyTrend.map(m => m.month) || [],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '订单数',
        type: 'line',
        smooth: true,
        data: data?.monthlyTrend.map(m => m.orders) || [],
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(255, 107, 53, 0.3)' },
              { offset: 1, color: 'rgba(255, 107, 53, 0.05)' },
            ],
          },
        },
        lineStyle: { color: '#FF6B35', width: 3 },
        itemStyle: { color: '#FF6B35' },
      },
    ],
  };

  // 饼图配置 - 服务分类
  const pieChartOption: EChartsOption = {
    title: {
      text: '服务分类统计',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        name: '服务分类',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold',
          },
        },
        labelLine: { show: false },
        data: data?.serviceCategories.map(c => ({
          value: c.orderCount,
          name: c.name,
        })) || [],
      },
    ],
  };

  // 柱状图配置 - 评分分布
  const barChartOption: EChartsOption = {
    title: {
      text: '评分分布',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
      formatter: '{b}<br/>评价数: {c}',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: ['5星', '4星', '3星', '2星', '1星'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '评价数',
        type: 'bar',
        data: data?.ratingDistribution.map(r => r.count) || [],
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#FF6B35' },
              { offset: 1, color: '#FF8555' },
            ],
          },
          borderRadius: [8, 8, 0, 0],
        },
      },
    ],
  };

  // 错误处理
  if (error) {
    return (
      <Result
        status="error"
        title="加载失败"
        subTitle={error}
        extra={
          <Button type="primary" onClick={() => dispatch(getStatisticsAsync())}>
            重试
          </Button>
        }
      />
    );
  }

  return (
    <div className="flex-col gap-8">
      {/* 页面标题 */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <Title level={2}>📊 数据统计分析</Title>
        <Text type="secondary">平台运营数据总览</Text>
      </div>

      {/* 核心指标 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="总用户数"
            value={data?.totalUsers || 0}
            prefix={<UserOutlined style={{ color: '#1890ff' }} />}
            suffix="人"
            trend="up"
            trendValue="+12.5%"
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="总订单数"
            value={data?.totalOrders || 0}
            prefix={<ShoppingCartOutlined style={{ color: '#52c41a' }} />}
            suffix="单"
            trend="up"
            trendValue="+8.3%"
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="总收入"
            value={data?.totalRevenue || 0}
            prefix={<DollarOutlined style={{ color: '#faad14' }} />}
            suffix="元"
            precision={2}
            trend="up"
            trendValue="+15.2%"
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="平均评分"
            value={data?.averageRating || 0}
            prefix={<StarOutlined style={{ color: '#f5222d' }} />}
            precision={1}
            loading={loading}
          />
        </Col>
      </Row>

      {/* 月度订单趋势 */}
      <Card style={{ borderRadius: 16 }}>
        <SimpleChart
          option={lineChartOption}
          height={400}
          loading={loading}
        />
      </Card>

      {/* 服务分类统计 & 热门服务排行 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card style={{ borderRadius: 16, height: '100%' }}>
            <SimpleChart
              option={pieChartOption}
              height={400}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card style={{ borderRadius: 16, height: '100%' }}>
            <Title level={3} style={{ marginBottom: 24 }}>
              🔥 热门服务排行
            </Title>
            {data ? (
              <RankList data={data.topServices} maxItems={6} />
            ) : (
              <Empty description="暂无数据" />
            )}
          </Card>
        </Col>
      </Row>

      {/* 用户分析 & 评分分布 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card style={{ borderRadius: 16 }}>
            <Title level={3} style={{ marginBottom: 24 }}>
              👥 用户分析
            </Title>
            <div className="flex-col gap-4">
              <div className="flex items-center justify-between">
                <Text>新用户</Text>
                <div className="flex items-center gap-2">
                  <Text strong>{data?.userAnalysis.newUsers || 0}</Text>
                  <Tag color="green">
                    <RiseOutlined /> +18%
                  </Tag>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Text>活跃用户</Text>
                <div className="flex items-center gap-2">
                  <Text strong>{data?.userAnalysis.activeUsers || 0}</Text>
                  <Tag color="green">
                    <RiseOutlined /> +12%
                  </Tag>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Text>复购用户</Text>
                <div className="flex items-center gap-2">
                  <Text strong>{data?.userAnalysis.repeatUsers || 0}</Text>
                  <Tag color="blue">复购率 68%</Tag>
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card style={{ borderRadius: 16 }}>
            <Title level={3} style={{ marginBottom: 24 }}>
              ⭐ 评分分布
            </Title>
            <SimpleChart
              option={barChartOption}
              height={300}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>

      {/* 宠物类型分布 & 服务时段分析 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card style={{ borderRadius: 16 }}>
            <Title level={3} style={{ marginBottom: 24 }}>
              🐾 宠物类型分布
            </Title>
            <Row gutter={[16, 16]}>
              {data?.petTypes.map((pet) => (
                <Col xs={8} key={pet.type}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 48, marginBottom: 8 }}>{pet.icon}</div>
                    <Title level={4}>{pet.name}</Title>
                    <Text type="secondary">{pet.count} 只</Text>
                    <Progress
                      percent={pet.percentage}
                      strokeColor="#FF6B35"
                      style={{ marginTop: 8 }}
                    />
                  </div>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card style={{ borderRadius: 16 }}>
            <Title level={3} style={{ marginBottom: 24 }}>
              ⏰ 服务时段分析
            </Title>
            <Row gutter={[16, 16]}>
              {data?.timeSlots.map((slot) => (
                <Col xs={8} key={slot.period}>
                  <div style={{ textAlign: 'center' }}>
                    <Title level={4}>{slot.period}</Title>
                    <Text type="secondary">{slot.orders} 单</Text>
                    <Progress
                      percent={slot.percentage}
                      strokeColor="#FF6B35"
                      style={{ marginTop: 8 }}
                    />
                  </div>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Statistics;
