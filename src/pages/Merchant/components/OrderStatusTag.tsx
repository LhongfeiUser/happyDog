import React from 'react';
import { Tag } from 'antd';
import type { OrderStatus } from '../../../types';

interface OrderStatusTagProps {
  status: OrderStatus;
}

const statusConfig: Record<OrderStatus, { text: string; color: string }> = {
  pending_payment: { text: '待支付', color: '#faad14' },
  paid: { text: '已支付', color: '#1890ff' },
  pending_accept: { text: '待接单', color: '#ff7a45' },
  accepted: { text: '已接单', color: '#1890ff' },
  in_progress: { text: '服务中', color: '#13c2c2' },
  completed: { text: '已完成', color: '#52c41a' },
  reviewed: { text: '已评价', color: '#52c41a' },
  cancelled: { text: '已取消', color: '#ff4d4f' },
  refunding: { text: '退款中', color: '#faad14' },
};

const OrderStatusTag: React.FC<OrderStatusTagProps> = ({ status }) => {
  const config = statusConfig[status] || { text: '未知', color: '#d9d9d9' };

  return (
    <Tag
      color={config.color}
      style={{
        borderRadius: 4,
        fontWeight: 500,
        minWidth: 60,
        textAlign: 'center',
      }}
    >
      {config.text}
    </Tag>
  );
};

export default OrderStatusTag;
