import React from 'react';
import { Card, Tag, Button, Typography, Space, message } from 'antd';
import { PayCircleOutlined, CloseCircleOutlined, CheckCircleOutlined, StarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { Order } from '../../types';
import { formatPrice, formatDate, formatOrderStatus, formatServiceCategory, getImageUrl } from '../../utils';
import { useAppDispatch } from '../../hooks';
import { payOrderAsync, cancelOrderAsync, completeOrderAsync } from '../../store/slices/ordersSlice';
import AddressDisplay from '@/components/common/AddressPicker/AddressDisplay';

const { Text, Title } = Typography;

interface OrderItemProps {
  order: Order;
}

const OrderItem: React.FC<OrderItemProps> = ({ order }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handlePay = async () => {
    try {
      await dispatch(payOrderAsync(order.id)).unwrap();
      message.success('支付成功！');
    } catch (error) {
      message.error('支付失败：' + error);
    }
  };

  const handleCancel = async () => {
    try {
      await dispatch(cancelOrderAsync(order.id)).unwrap();
      message.success('订单已取消');
    } catch (error) {
      message.error('取消失败：' + error);
    }
  };

  const handleComplete = async () => {
    try {
      await dispatch(completeOrderAsync(order.id)).unwrap();
      message.success('已确认完成');
    } catch (error) {
      message.error('确认失败：' + error);
    }
  };

  const handleReview = () => {
    navigate(`/orders/${order.id}/review`);
  };

  const handleViewDetail = () => {
    navigate(`/orders/${order.id}`);
  };

  const statusInfo = formatOrderStatus(order.status);

  const renderActions = () => {
    const actions = [];

    if (order.status === 'pending_payment') {
      actions.push(
        <Button
          type="primary"
          icon={<PayCircleOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            handlePay();
          }}
          style={{ borderRadius: 20 }}
        >
          立即支付
        </Button>
      );
      actions.push(
        <Button
          danger
          icon={<CloseCircleOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            handleCancel();
          }}
          style={{ borderRadius: 20 }}
        >
          取消订单
        </Button>
      );
    }

    if (order.status === 'in_progress') {
      actions.push(
        <Button
          type="primary"
          icon={<CheckCircleOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            handleComplete();
          }}
          style={{ borderRadius: 20 }}
        >
          确认完成
        </Button>
      );
    }

    if (order.status === 'completed') {
      actions.push(
        <Button
          type="primary"
          icon={<StarOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            handleReview();
          }}
          style={{ borderRadius: 20 }}
        >
          去评价
        </Button>
      );
    }

    actions.push(
      <Button
        onClick={(e) => {
          e.stopPropagation();
          handleViewDetail();
        }}
        style={{ borderRadius: 20 }}
      >
        查看详情
      </Button>
    );

    return actions;
  };

  return (
    <Card
      style={{
        marginBottom: 16,
        borderRadius: 16,
        boxShadow: '0 2px 8px rgba(255, 107, 53, 0.1)',
      }}
      onClick={handleViewDetail}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <Space>
          <Text type="secondary">订单号：{order.orderNo}</Text>
          <Text type="secondary">{formatDate(order.createTime, 'YYYY-MM-DD HH:mm')}</Text>
        </Space>
        <Tag color={statusInfo.color} style={{ borderRadius: 12, padding: '2px 12px' }}>
          {statusInfo.text}
        </Tag>
      </div>
      <div style={{ display: 'flex', gap: 16 }}>
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: 12,
            overflow: 'hidden',
            background: '#FFF3E0',
            flexShrink: 0,
          }}
        >
          <img
            alt={order.serviceName}
            src={getImageUrl(order.serviceImage)}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/100x100?text=服务';
            }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <Title level={5} style={{ marginBottom: 8 }}>
            {order.serviceName}
          </Title>
          <Space direction="vertical" size={4}>
            <Text>
              <Tag>{formatServiceCategory(order.serviceCategory)}</Tag>
              宠物：{order.petName}
            </Text>
            <Text type="secondary">
              预约时间：{order.appointmentDate} {order.appointmentTime}
            </Text>
            <Text type="secondary">地址：<AddressDisplay value={order.address} short /></Text>
          </Space>
        </div>
        <div style={{ textAlign: 'right' }}>
          <Text strong style={{ color: '#FF6B35', fontSize: 24 }}>
            ¥{formatPrice(order.totalPrice)}
          </Text>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
        {renderActions()}
      </div>
    </Card>
  );
};

export default OrderItem;
