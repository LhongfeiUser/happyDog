import React from 'react';
import { Card, Statistic, Tag } from 'antd';
import { RiseOutlined, FallOutlined } from '@ant-design/icons';

interface StatCardProps {
  title: string;
  value: number | string;
  prefix?: React.ReactNode;
  suffix?: string;
  trend?: 'up' | 'down';
  trendValue?: string;
  loading?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  prefix,
  suffix,
  trend,
  trendValue,
  loading = false,
}) => {
  return (
    <Card style={{ borderRadius: 16, textAlign: 'center' }} loading={loading}>
      <Statistic
        title={title}
        value={value}
        prefix={prefix}
        suffix={suffix}
      />
      {trend && trendValue && (
        <div style={{ marginTop: 16 }}>
          <Tag color={trend === 'up' ? 'green' : 'red'}>
            {trend === 'up' ? <RiseOutlined /> : <FallOutlined />} {trendValue}
          </Tag>
        </div>
      )}
    </Card>
  );
};

export default StatCard;
