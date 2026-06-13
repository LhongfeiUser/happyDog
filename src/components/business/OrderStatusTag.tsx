import React from 'react';
import { Tag } from 'antd';
import { formatOrderStatus } from '../../utils';
import type { OrderStatus } from '../../types';

interface OrderStatusTagProps {
  status: OrderStatus;
}

const OrderStatusTag: React.FC<OrderStatusTagProps> = ({ status }) => {
  const { text, color } = formatOrderStatus(status);

  return <Tag color={color}>{text}</Tag>;
};

export default OrderStatusTag;
