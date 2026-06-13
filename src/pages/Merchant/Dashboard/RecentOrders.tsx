import React from 'react';
import { Card, Table, Button, Spin } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import OrderStatusTag from '../../../components/business/OrderStatusTag';
import { formatPrice, formatDate } from '../../../utils';
import type { Order } from '../../../types';

interface RecentOrdersProps {
  orders: Order[];
  loading?: boolean;
  onViewDetail?: (order: Order) => void;
}

const RecentOrders: React.FC<RecentOrdersProps> = ({
  orders,
  loading = false,
  onViewDetail,
}) => {
  const columns: ColumnsType<Order> = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      width: 140,
      ellipsis: true,
      render: (text: string) => (
        <span style={{ fontFamily: 'monospace', fontSize: 13 }}>{text}</span>
      ),
    },
    {
      title: '服务名称',
      dataIndex: 'serviceName',
      key: 'serviceName',
      ellipsis: true,
      render: (text: string, record: Order) => (
        <div>
          <div style={{ fontWeight: 500, marginBottom: 2 }}>{text}</div>
          <div style={{ fontSize: 12, color: '#999' }}>{record.petName}</div>
        </div>
      ),
    },
    {
      title: '预约时间',
      key: 'appointmentTime',
      width: 130,
      render: (_, record: Order) => (
        <div style={{ fontSize: 13 }}>
          <div>{formatDate(record.appointmentDate, 'MM-DD')}</div>
          <div style={{ color: '#999', fontSize: 12 }}>{record.appointmentTime}</div>
        </div>
      ),
    },
    {
      title: '金额',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      width: 100,
      align: 'right',
      render: (price: number) => (
        <span style={{ color: '#FF6B35', fontWeight: 600 }}>
          ¥{formatPrice(price)}
        </span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 90,
      render: (status: string) => <OrderStatusTag status={status as any} />,
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      align: 'center',
      render: (_, record: Order) => (
        <Button
          type="link"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => onViewDetail?.(record)}
          style={{ color: '#FF6B35' }}
        >
          查看
        </Button>
      ),
    },
  ];

  return (
    <Card
      title={
        <span style={{ fontSize: 16, fontWeight: 600, color: '#333' }}>
          最近订单
        </span>
      }
      style={{
        borderRadius: 16,
        boxShadow: '0 2px 8px rgba(255, 107, 53, 0.1)',
        height: '100%',
      }}
      bodyStyle={{ padding: 0 }}
      extra={
        <Button type="link" size="small" style={{ color: '#FF6B35' }}>
          查看全部
        </Button>
      }
    >
      <Spin spinning={loading}>
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="id"
          pagination={false}
          size="small"
          scroll={{ x: 600 }}
          style={{ minHeight: 300 }}
        />
      </Spin>
    </Card>
  );
};

export default RecentOrders;
