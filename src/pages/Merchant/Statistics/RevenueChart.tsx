import React from 'react';
import { Card } from 'antd';
import { SimpleChart } from '../../../components/common/SimpleChart';
import type { EChartsOption } from 'echarts';

interface RevenueData {
  month: string;
  revenue: number;
}

interface RevenueChartProps {
  data: RevenueData[];
  loading?: boolean;
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data, loading = false }) => {
  const option: EChartsOption = {
    title: {
      text: '营收趋势',
      left: 'center',
      top: 10,
      textStyle: {
        fontSize: 16,
        fontWeight: 600,
        color: '#333',
      },
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#FF6B35',
      borderWidth: 1,
      textStyle: {
        color: '#333',
      },
      formatter: (params: any) => {
        const item = params[0];
        return `
          <div style="padding: 4px 8px;">
            <div style="font-weight: 600; margin-bottom: 4px;">${item.name}</div>
            <div style="color: #FF6B35;">
              营收: <span style="font-weight: 600;">¥${item.value.toLocaleString()}</span>
            </div>
          </div>
        `;
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: 60,
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: data.map(item => item.month),
      axisLine: {
        lineStyle: {
          color: '#E0E0E0',
        },
      },
      axisLabel: {
        color: '#666',
        fontSize: 12,
      },
      axisTick: {
        show: false,
      },
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: '#666',
        fontSize: 12,
        formatter: (value: number) => {
          if (value >= 10000) {
            return `${(value / 10000).toFixed(1)}w`;
          }
          return `${value}`;
        },
      },
      splitLine: {
        lineStyle: {
          color: '#F5F5F5',
          type: 'dashed',
        },
      },
    },
    series: [
      {
        name: '营收',
        type: 'line',
        data: data.map(item => item.revenue),
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: {
          color: '#FF6B35',
        },
        lineStyle: {
          width: 3,
          color: '#FF6B35',
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(255, 107, 53, 0.3)',
              },
              {
                offset: 1,
                color: 'rgba(255, 107, 53, 0.05)',
              },
            ],
          },
        },
        emphasis: {
          itemStyle: {
            borderWidth: 2,
            borderColor: '#FFF',
            shadowBlur: 10,
            shadowColor: 'rgba(255, 107, 53, 0.5)',
          },
        },
      },
    ],
  };

  return (
    <Card
      style={{
        borderRadius: 16,
        boxShadow: '0 2px 8px rgba(255, 107, 53, 0.1)',
        height: '100%',
      }}
      bodyStyle={{ padding: '16px' }}
    >
      <SimpleChart
        option={option}
        height={400}
        loading={loading}
      />
    </Card>
  );
};

export default RevenueChart;
