import React from 'react';
import { Card } from 'antd';
import { ReactECharts } from '../../../components/SimpleChart';
import type { EChartsOption } from 'echarts';

interface OrderStatusData {
  status: string;
  name: string;
  count: number;
  percentage: number;
}

interface OrderStatusChartProps {
  data: OrderStatusData[];
  loading?: boolean;
}

const OrderStatusChart: React.FC<OrderStatusChartProps> = ({ data, loading = false }) => {
  // Orange-themed color palette
  const colorPalette = [
    '#FF6B35', // Primary orange
    '#FF8C5A', // Light orange
    '#FFA980', // Lighter orange
    '#FFC7AA', // Very light orange
    '#FFE5D5', // Lightest orange
    '#FFB347', // Golden orange
    '#FF9F1C', // Bright orange
    '#E85D26', // Dark orange
  ];

  const option: EChartsOption = {
    title: {
      text: '订单状态分布',
      left: 'center',
      top: 10,
      textStyle: {
        fontSize: 16,
        fontWeight: 600,
        color: '#333',
      },
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#FF6B35',
      borderWidth: 1,
      textStyle: {
        color: '#333',
      },
      formatter: (params: any) => {
        return `
          <div style="padding: 4px 8px;">
            <div style="font-weight: 600; margin-bottom: 4px;">${params.name}</div>
            <div style="color: #FF6B35;">
              数量: <span style="font-weight: 600;">${params.value}</span>
            </div>
            <div style="color: #666; font-size: 12px;">
              占比: <span style="font-weight: 600;">${params.percent}%</span>
            </div>
          </div>
        `;
      },
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'middle',
      itemWidth: 12,
      itemHeight: 12,
      itemGap: 12,
      textStyle: {
        color: '#666',
        fontSize: 12,
      },
      formatter: (name: string) => {
        const item = data.find(d => d.name === name);
        return item ? `${name} (${item.count})` : name;
      },
    },
    series: [
      {
        name: '订单状态',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['40%', '55%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8,
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
            fontSize: 18,
            fontWeight: 'bold',
            color: '#FF6B35',
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(255, 107, 53, 0.5)',
          },
        },
        labelLine: {
          show: false,
        },
        data: data.map((item, index) => ({
          value: item.count,
          name: item.name,
          itemStyle: {
            color: colorPalette[index % colorPalette.length],
          },
        })),
      },
    ],
    color: colorPalette,
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
      <ReactECharts
        option={option}
        height={400}
        loading={loading}
      />
    </Card>
  );
};

export default OrderStatusChart;
