import React, { useEffect } from 'react';
import { Typography, Card, Row, Col, Button, Tag, Descriptions, Steps, Space, message, Spin } from 'antd';
import { PayCircleOutlined, CloseCircleOutlined, CheckCircleOutlined, StarOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { getOrderByIdAsync, payOrderAsync, cancelOrderAsync, completeOrderAsync } from '../../store/slices/ordersSlice';
import { formatPrice, formatDate, formatOrderStatus, formatServiceCategory, getImageUrl } from '../../utils';

const { Title, Text } = Typography;

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentOrder, loading } = useAppSelector(state => state.orders);

  useEffect(() => {
    if (id) {
      dispatch(getOrderByIdAsync(id));
    }
  }, [dispatch, id]);

  const handlePay = async () => {
    try {
      await dispatch(payOrderAsync(id!)).unwrap();
      message.success('支付成功！');
    } catch (error) {
      message.error('支付失败：' + error);
    }
  };

  const handleCancel = async () => {
    try {
      await dispatch(cancelOrderAsync(id!)).unwrap();
      message.success('订单已取消');
    } catch (error) {
      message.error('取消失败：' + error);
    }
  };

  const handleComplete = async () => {
    try {
      await dispatch(completeOrderAsync(id!)).unwrap();
      message.success('已确认完成');
    } catch (error) {
      message.error('确认失败：' + error);
    }
  };

  if (loading || !currentOrder) {
    return (
      <div style={{ textAlign: 'center', padding: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  const statusInfo = formatOrderStatus(currentOrder.status);

  // 订单状态步骤
  const statusSteps = [
    { title: '下单', description: formatDate(currentOrder.createTime, 'MM-DD HH:mm') },
    { title: '支付', description: currentOrder.payTime ? formatDate(currentOrder.payTime, 'MM-DD HH:mm') : '' },
    { title: '服务', description: currentOrder.status === 'in_progress' || currentOrder.status === 'completed' ? '进行中' : '' },
    { title: '完成', description: currentOrder.completeTime ? formatDate(currentOrder.completeTime, 'MM-DD HH:mm') : '' },
    { title: '评价', description: currentOrder.status === 'reviewed' ? '已评价' : '' },
  ];

  const currentStep = currentOrder.status === 'reviewed' ? 4
    : currentOrder.status === 'completed' ? 3
    : currentOrder.status === 'in_progress' ? 2
    : currentOrder.status === 'paid' ? 1
    : 0;

  return (
    <div>
      <Card style={{ borderRadius: 16, marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <Title level={3} style={{ margin: 0 }}>
            订单详情
          </Title>
          <Tag color={statusInfo.color} style={{ borderRadius: 12, padding: '4px 16px', fontSize: 14 }}>
            {statusInfo.text}
          </Tag>
        </div>

        <Steps
          current={currentStep}
          items={statusSteps}
          style={{ marginBottom: 32 }}
        />

        <Row gutter={24}>
          <Col span={16}>
            <Card style={{ borderRadius: 12 }}>
              <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
                <div
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 12,
                    overflow: 'hidden',
                    background: '#FFF3E0',
                    flexShrink: 0,
                  }}
                >
                  <img
                    alt={currentOrder.serviceName}
                    src={getImageUrl(currentOrder.serviceImage)}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/120x120?text=服务';
                    }}
                  />
                </div>
                <div>
                  <Title level={4} style={{ marginBottom: 8 }}>
                    {currentOrder.serviceName}
                  </Title>
                  <Tag>{formatServiceCategory(currentOrder.serviceCategory)}</Tag>
                  <Text style={{ marginLeft: 8 }}>宠物：{currentOrder.petName}</Text>
                </div>
              </div>

              <Descriptions column={2} bordered>
                <Descriptions.Item label="订单号">{currentOrder.orderNo}</Descriptions.Item>
                <Descriptions.Item label="下单时间">{formatDate(currentOrder.createTime)}</Descriptions.Item>
                <Descriptions.Item label="预约日期">{currentOrder.appointmentDate}</Descriptions.Item>
                <Descriptions.Item label="预约时间">{currentOrder.appointmentTime}</Descriptions.Item>
                <Descriptions.Item label="服务地址" span={2}>{currentOrder.address}</Descriptions.Item>
                <Descriptions.Item label="联系电话">{currentOrder.contactPhone}</Descriptions.Item>
                <Descriptions.Item label="备注">{currentOrder.remark || '无'}</Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          <Col span={8}>
            <Card style={{ borderRadius: 12 }}>
              <Title level={5} style={{ marginBottom: 16 }}>订单金额</Title>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <Text strong style={{ color: '#FF6B35', fontSize: 36 }}>
                  ¥{formatPrice(currentOrder.totalPrice)}
                </Text>
              </div>

              <Title level={5} style={{ marginBottom: 16 }}>操作</Title>
              <Space direction="vertical" style={{ width: '100%' }}>
                {currentOrder.status === 'pending_payment' && (
                  <>
                    <Button
                      type="primary"
                      block
                      icon={<PayCircleOutlined />}
                      onClick={handlePay}
                      style={{
                        borderRadius: 20,
                        background: 'linear-gradient(135deg, #FF6B35 0%, #FF8555 100%)',
                        border: 'none',
                      }}
                    >
                      立即支付
                    </Button>
                    <Button
                      danger
                      block
                      icon={<CloseCircleOutlined />}
                      onClick={handleCancel}
                      style={{ borderRadius: 20 }}
                    >
                      取消订单
                    </Button>
                  </>
                )}
                {currentOrder.status === 'in_progress' && (
                  <Button
                    type="primary"
                    block
                    icon={<CheckCircleOutlined />}
                    onClick={handleComplete}
                    style={{ borderRadius: 20 }}
                  >
                    确认完成
                  </Button>
                )}
                {currentOrder.status === 'completed' && (
                  <Button
                    type="primary"
                    block
                    icon={<StarOutlined />}
                    onClick={() => navigate(`/orders/${id}/review`)}
                    style={{ borderRadius: 20 }}
                  >
                    去评价
                  </Button>
                )}
                <Button
                  block
                  onClick={() => navigate('/orders')}
                  style={{ borderRadius: 20 }}
                >
                  返回订单列表
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default OrderDetail;
