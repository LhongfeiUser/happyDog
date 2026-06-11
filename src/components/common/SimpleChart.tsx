import React from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import { Spin } from 'antd';

interface SimpleChartProps {
  option: EChartsOption;
  height?: number;
  loading?: boolean;
  style?: React.CSSProperties;
}

export const SimpleChart: React.FC<SimpleChartProps> = ({
  option,
  height = 400,
  loading = false,
  style,
}) => {
  return (
    <Spin spinning={loading}>
      <div style={{ minHeight: height, ...style }}>
        <ReactECharts
          option={option}
          style={{ height: `${height}px`, width: '100%' }}
          opts={{ renderer: 'canvas' }}
          notMerge={true}
          lazyUpdate={true}
        />
      </div>
    </Spin>
  );
};

export default SimpleChart;
