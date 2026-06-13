import React from 'react';
import { Card, Empty } from 'antd';
import { ReactECharts } from '../../../components/SimpleChart';
import type { EChartsOption } from 'echarts';

interface TopServicesData {
  id: string;
  name: string;
  salesCount: number;
  revenue: number;
}

interface TopServicesChartProps {
  data: TopServicesData[];
  loading?: boolean;
}

const TopServicesChart: React.FC<TopServicesChartProps> = ({ data, loading = false }) => {
  // Sort by sales count descending and take top 10
  const sortedData = [...data]
    .sort((a, b) => b.salesCount - a.salesCount)
    .slice(0, 10);

  const option: EChartsOption = {
    title: {
      text: '热销服务排行',
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
      axisPointer: {
        type: 'shadow',
      },
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#FF6B35',
      borderWidth: 1,
      textStyle: {
        color: '#333',
      },
      formatter: (params: any) => {
        const item = params[0];
        const service = sortedData.find(d => d.name === item.name);
        return `
          <div style="padding: 4px 8px;">
            <div style="font-weight: 600; margin-bottom: 4px;">${item.name}</div>
            <div style="color: #FF6B35;">
              销量: <span style="font-weight: 600;">${item.value}</span>
            </div>
            ${
              service
                ? `<div style="color: #4CAF50; font-size: 12px;">
                    收入: <span style="font-weight: 600;">¥${service.revenue.toLocaleString()}</span>
                   </div>`
                : ''
            }
          </div>
        `;
      },
    },
    grid: {
      left: '3%',
      right: '12%',
      bottom: '3%',
      top: 60,
      containLabel: true,
    },
    xAxis: {
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
      },
      splitLine: {
        lineStyle: {
          color: '#F5F5F5',
          type: 'dashed',
        },
      },
    },
    yAxis: {
      type: 'category',
      data: sortedData.map(item => item.name).reverse(),
      axisLine: {
        lineStyle: {
          color: '#E0E0E0',
        },
      },
      axisLabel: {
        color: '#666',
        fontSize: 12,
        width: 100,
        overflow: 'truncate',
      },
      axisTick: {
        show: false,
      },
    },
    series: [
      {
        name: '销量',
        type: 'bar',
        data: sortedData.map(item => item.salesCount).reverse(),
        barWidth: '60%',
        itemStyle: {
          borderRadius: [0, 8, 8, 0],
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              {
                offset: 0,
                color: '#FF6B35',
              },
              {
                offset: 1,
                color: '#FFA980',
              },
            ],
          },
        },
        emphasis: {
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                {
                  offset: 0,
                  color: '#E85D26',
                },
                {
                  offset: 1,
                  color: '#FF6B35',
                },
              ],
            },
          },
        },
        label: {
          show: true,
          position: 'right',
          color: '#666',
          fontSize: 12,
          formatter: '{c}',
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
      {sortedData.length === 0 && !loading ? (
        <div style={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="暂无服务数据"
            style={{ color: '#999' }}
          />
        </div>
      ) : (
        <ReactECharts
          option={option}
          height={400}
          loading={loading}
        />
      )}
    </Card>
  );
};

export default TopServicesChart;
