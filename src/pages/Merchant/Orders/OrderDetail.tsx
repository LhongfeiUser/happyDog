import React from 'react';
import { Modal, Descriptions, Divider, Image, Tag, Row, Col, Card } from 'antd';
import { UserOutlined, PhoneOutlined, HomeOutlined, ClockCircleOutlined, FileTextOutlined } from '@ant-design/icons';
import type { Order } from '../../../types';
import OrderStatusTag from '../components/OrderStatusTag';
import { formatPrice, formatDate } from '../../../utils';

interface OrderDetailProps {
  visible: boolean;
  order: Order | null;
  onClose: () => void;
}

const OrderDetail: React.FC<OrderDetailProps> = ({ visible, order, onClose }) => {
  if (!order) return null;

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 18, fontWeight: 600 }}>订单详情</span>
          <OrderStatusTag status={order.status} />
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      style={{ top: 20 }}
    >
      <Row gutter={[16, 16]}>
        {/* 订单基本信息 */}
        <Col span={24}>
          <Card
            title="订单信息"
            size="small"
            style={{ borderRadius: 8 }}
          >
            <Descriptions column={2} labelStyle={{ fontWeight: 500 }}>
              <Descriptions.Item label="订单号">{order.orderNo}</Descriptions.Item>
              <Descriptions.Item label="创建时间">
                {formatDate(order.createTime, 'YYYY-MM-DD HH:mm:ss')}
              </Descriptions.Item>
              <Descriptions.Item label="订单金额">
                <span style={{ color: '#FF6B35', fontSize: 18, fontWeight: 600 }}>
                  {formatPrice(order.totalPrice)}
                </span>
              </Descriptions.Item>
              {order.payTime && (
                <Descriptions.Item label="支付时间">
                  {formatDate(order.payTime, 'YYYY-MM-DD HH:mm:ss')}
                </Descriptions.Item>
              )}
              {order.completeTime && (
                <Descriptions.Item label="完成时间">
                  {formatDate(order.completeTime, 'YYYY-MM-DD HH:mm:ss')}
                </Descriptions.Item>
              )}
              {order.cancelTime && (
                <Descriptions.Item label="取消时间">
                  {formatDate(order.cancelTime, 'YYYY-MM-DD HH:mm:ss')}
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>
        </Col>

        {/* 服务信息 */}
        <Col span={24}>
          <Card
            title="服务信息"
            size="small"
            style={{ borderRadius: 8 }}
          >
            <div style={{ display: 'flex', gap: 16 }}>
              {order.serviceImage && (
                <Image
                  src={order.serviceImage}
                  alt={order.serviceName}
                  width={120}
                  height={120}
                  style={{ objectFit: 'cover', borderRadius: 8 }}
                />
              )}
              <div style={{ flex: 1 }}>
                <Descriptions column={2} labelStyle={{ fontWeight: 500 }}>
                  <Descriptions.Item label="服务名称">{order.serviceName}</Descriptions.Item>
                  <Descriptions.Item label="服务分类">{order.serviceCategory}</Descriptions.Item>
                  <Descriptions.Item label="预约日期">
                    {formatDate(order.appointmentDate, 'YYYY-MM-DD')}
                  </Descriptions.Item>
                  <Descriptions.Item label="预约时间">{order.appointmentTime}</Descriptions.Item>
                </Descriptions>
              </div>
            </div>
          </Card>
        </Col>

        {/* 宠物信息 */}
        <Col span={12}>
          <Card
            title="宠物信息"
            size="small"
            style={{ borderRadius: 8 }}
            extra={<Tag color="orange">宠物</Tag>}
          >
            <Descriptions column={1} labelStyle={{ fontWeight: 500 }}>
              <Descriptions.Item label="宠物名称">{order.petName}</Descriptions.Item>
              <Descriptions.Item label="宠物ID">{order.petId}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* 联系信息 */}
        <Col span={12}>
          <Card
            title="联系信息"
            size="small"
            style={{ borderRadius: 8 }}
            extra={<Tag color="blue">联系</Tag>}
          >
            <div style={{ marginBottom: 12 }}>
              <UserOutlined style={{ marginRight: 8, color: '#8c8c8c' }} />
              <span style={{ fontWeight: 500 }}>用户ID：</span>
              <span>{order.userId}</span>
            </div>
            <div style={{ marginBottom: 12 }}>
              <PhoneOutlined style={{ marginRight: 8, color: '#8c8c8c' }} />
              <span style={{ fontWeight: 500 }}>联系电话：</span>
              <span style={{ color: '#1890ff' }}>{order.contactPhone}</span>
            </div>
            <div style={{ marginBottom: 12 }}>
              <HomeOutlined style={{ marginRight: 8, color: '#8c8c8c' }} />
              <span style={{ fontWeight: 500 }}>服务地址：</span>
              <span>{order.address}</span>
            </div>
          </Card>
        </Col>

        {/* 备注信息 */}
        {order.remark && (
          <Col span={24}>
            <Card
              title="备注信息"
              size="small"
              style={{ borderRadius: 8 }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <FileTextOutlined style={{ color: '#8c8c8c', marginTop: 2 }} />
                <span>{order.remark}</span>
              </div>
            </Card>
          </Col>
        )}
      </Row>
    </Modal>
  );
};

export default OrderDetail;
