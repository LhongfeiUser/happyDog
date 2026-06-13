import React, { useState } from 'react';
import { Table, Button, Space, Card, Input, DatePicker, message, Modal } from 'antd';
import { SearchOutlined, EyeOutlined, CheckOutlined, CloseOutlined, PlayCircleOutlined, StopOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useAppDispatch } from '../../../hooks';
import type { Order, OrderStatus } from '../../../types';
import OrderStatusTag from '../components/OrderStatusTag';
import { formatPrice, formatDate } from '../../../utils';
import {
  acceptOrderAsync,
  rejectOrderAsync,
  startServiceAsync,
  completeServiceAsync,
} from '../../../store/slices/merchantOrdersSlice';

const { RangePicker } = DatePicker;

interface OrderListProps {
  orders: Order[];
  loading: boolean;
  onViewDetail: (order: Order) => void;
  onRefresh: () => void;
}

const OrderList: React.FC<OrderListProps> = ({
  orders,
  loading,
  onViewDetail,
  onRefresh,
}) => {
  const dispatch = useAppDispatch();
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectOrderId, setRejectOrderId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectLoading, setRejectLoading] = useState(false);

  // 接单 - 使用Redux thunk
  const handleAccept = (orderId: string) => {
    Modal.confirm({
      title: '确认接单',
      content: '确定要接受此订单吗？',
      okText: '确认接单',
      cancelText: '取消',
      okButtonProps: { style: { background: '#FF6B35', borderColor: '#FF6B35' } },
      onOk: async () => {
        try {
          await dispatch(acceptOrderAsync(orderId)).unwrap();
          message.success('接单成功！');
          onRefresh();
        } catch (error: any) {
          message.error(error || '接单失败');
        }
      },
    });
  };

  // 拒单
  const handleReject = (orderId: string) => {
    setRejectOrderId(orderId);
    setRejectReason('');
    setRejectModalVisible(true);
  };

  const confirmReject = async () => {
    if (!rejectOrderId || !rejectReason.trim()) {
      message.warning('请输入拒单原因');
      return;
    }

    setRejectLoading(true);
    try {
      await dispatch(rejectOrderAsync({ orderId: rejectOrderId, reason: rejectReason })).unwrap();
      message.success('已拒绝订单');
      setRejectModalVisible(false);
      setRejectOrderId(null);
      setRejectReason('');
      onRefresh();
    } catch (error: any) {
      message.error(error || '拒单失败');
    } finally {
      setRejectLoading(false);
    }
  };

  // 开始服务 - 使用Redux thunk
  const handleStartService = (orderId: string) => {
    Modal.confirm({
      title: '开始服务',
      content: '确定要开始服务吗？',
      okText: '开始服务',
      cancelText: '取消',
      okButtonProps: { style: { background: '#13c2c2', borderColor: '#13c2c2' } },
      onOk: async () => {
        try {
          await dispatch(startServiceAsync(orderId)).unwrap();
          message.success('服务已开始！');
          onRefresh();
        } catch (error: any) {
          message.error(error || '操作失败');
        }
      },
    });
  };

  // 完成服务 - 使用Redux thunk
  const handleCompleteService = (orderId: string) => {
    Modal.confirm({
      title: '完成服务',
      content: '确定要完成服务吗？',
      okText: '完成服务',
      cancelText: '取消',
      okButtonProps: { style: { background: '#52c41a', borderColor: '#52c41a' } },
      onOk: async () => {
        try {
          await dispatch(completeServiceAsync(orderId)).unwrap();
          message.success('服务已完成！');
          onRefresh();
        } catch (error: any) {
          message.error(error || '操作失败');
        }
      },
    });
  };

  // 渲染操作按钮
  const renderActions = (order: Order) => {
    const buttons: JSX.Element[] = [];

    // 查看详情按钮
    buttons.push(
      <Button
        key="view"
        type="link"
        size="small"
        icon={<EyeOutlined />}
        onClick={() => onViewDetail(order)}
        style={{ color: '#1890ff' }}
      >
        详情
      </Button>
    );

    // 根据状态显示不同操作
    switch (order.status) {
      case 'pending_accept':
        buttons.push(
          <Button
            key="accept"
            type="link"
            size="small"
            icon={<CheckOutlined />}
            onClick={() => handleAccept(order.id)}
            style={{ color: '#52c41a' }}
          >
            接单
          </Button>
        );
        buttons.push(
          <Button
            key="reject"
            type="link"
            size="small"
            icon={<CloseOutlined />}
            onClick={() => handleReject(order.id)}
            style={{ color: '#ff4d4f' }}
          >
            拒单
          </Button>
        );
        break;
      case 'accepted':
        buttons.push(
          <Button
            key="start"
            type="link"
            size="small"
            icon={<PlayCircleOutlined />}
            onClick={() => handleStartService(order.id)}
            style={{ color: '#13c2c2' }}
          >
            开始服务
          </Button>
        );
        break;
      case 'in_progress':
        buttons.push(
          <Button
            key="complete"
            type="link"
            size="small"
            icon={<StopOutlined />}
            onClick={() => handleCompleteService(order.id)}
            style={{ color: '#52c41a' }}
          >
            完成服务
          </Button>
        );
        break;
    }

    return <Space size="small">{buttons}</Space>;
  };

  const columns: ColumnsType<Order> = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      width: 180,
      fixed: 'left',
      render: (text: string) => (
        <span style={{ fontWeight: 500 }}>{text}</span>
      ),
    },
    {
      title: '服务信息',
      key: 'service',
      width: 250,
      render: (_, record: Order) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {record.serviceImage && (
            <img
              src={record.serviceImage}
              alt={record.serviceName}
              style={{
                width: 48,
                height: 48,
                objectFit: 'cover',
                borderRadius: 6,
              }}
            />
          )}
          <div>
            <div style={{ fontWeight: 500, marginBottom: 4 }}>{record.serviceName}</div>
            <div style={{ fontSize: 12, color: '#8c8c8c' }}>{record.serviceCategory}</div>
          </div>
        </div>
      ),
    },
    {
      title: '宠物',
      dataIndex: 'petName',
      key: 'petName',
      width: 100,
    },
    {
      title: '预约时间',
      key: 'appointment',
      width: 160,
      render: (_, record: Order) => (
        <div>
          <div>{formatDate(record.appointmentDate, 'YYYY-MM-DD')}</div>
          <div style={{ fontSize: 12, color: '#8c8c8c' }}>{record.appointmentTime}</div>
        </div>
      ),
    },
    {
      title: '订单金额',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      width: 120,
      align: 'right',
      render: (price: number) => (
        <span style={{ color: '#FF6B35', fontWeight: 600, fontSize: 15 }}>
          {formatPrice(price)}
        </span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: OrderStatus) => <OrderStatusTag status={status} />,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 160,
      render: (time: string) => formatDate(time, 'MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'actions',
      width: 200,
      fixed: 'right',
      render: (_, record: Order) => renderActions(record),
    },
  ];

  return (
    <>
      <Card style={{ borderRadius: 12 }}>
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`,
            pageSizeOptions: ['10', '20', '50'],
          }}
        />
      </Card>

      {/* 拒单弹窗 */}
      <Modal
        title="拒单确认"
        open={rejectModalVisible}
        onOk={confirmReject}
        onCancel={() => {
          setRejectModalVisible(false);
          setRejectOrderId(null);
          setRejectReason('');
        }}
        confirmLoading={rejectLoading}
        okText="确认拒单"
        cancelText="取消"
        okButtonProps={{
          danger: true,
        }}
      >
        <div style={{ marginBottom: 16 }}>
          <p style={{ marginBottom: 12 }}>请填写拒单原因：</p>
          <Input.TextArea
            rows={4}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="请输入拒单原因..."
            maxLength={200}
            showCount
          />
        </div>
      </Modal>
    </>
  );
};

export default OrderList;
