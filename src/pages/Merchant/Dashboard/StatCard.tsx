import React from 'react';
import { Card, Statistic, Spin } from 'antd';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';

interface StatCardProps {
  title: string;
  value: number | string;
  prefix?: React.ReactNode;
  suffix?: string;
  precision?: number;
  trend?: 'up' | 'down';
  trendValue?: string;
  loading?: boolean;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  prefix,
  suffix,
  precision,
  trend,
  trendValue,
  loading = false,
  color = '#FF6B35',
}) => {
  const renderTrend = () => {
    if (!trend || !trendValue) return null;

    const trendColor = trend === 'up' ? '#4CAF50' : '#F44336';
    const TrendIcon = trend === 'up' ? CaretUpOutlined : CaretDownOutlined;

    return (
      <span style={{ color: trendColor, fontSize: 14, marginLeft: 8 }}>
        <TrendIcon />
        {trendValue}
      </span>
    );
  };

  return (
    <Card
      style={{
        borderRadius: 16,
        boxShadow: '0 2px 8px rgba(255, 107, 53, 0.1)',
        height: '100%',
      }}
      bodyStyle={{ padding: '20px 24px' }}
    >
      <Spin spinning={loading}>
        <Statistic
          title={
            <span style={{ fontSize: 14, color: '#666', fontWeight: 500 }}>
              {title}
            </span>
          }
          value={value}
          prefix={
            prefix ? (
              <span style={{ color, fontSize: 20, marginRight: 4 }}>{prefix}</span>
            ) : undefined
          }
          suffix={suffix}
          precision={precision}
          valueStyle={{ color, fontSize: 28, fontWeight: 600 }}
        />
        {renderTrend()}
      </Spin>
    </Card>
  );
};

export default StatCard;
