import React, { useEffect } from 'react';
import { Typography, Card, Table, Tag, Button, Empty } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { getUserAfterSalesAsync } from '../../store/slices/afterSalesSlice';
import { formatAfterSalesStatus, formatAfterSalesType, formatDate } from '../../utils';

const { Title, Text } = Typography;

const AfterSales: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { list, loading } = useAppSelector(state => state.afterSales);

  useEffect(() => {
    dispatch(getUserAfterSalesAsync());
  }, [dispatch]);

  const columns = [
    {
      title: '售后编号',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => id.substring(0, 8) + '...',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'refund' ? 'orange' : type === 'cancel' ? 'blue' : 'red'}>
          {formatAfterSalesType(type)}
        </Tag>
      ),
    },
    {
      title: '原因',
      dataIndex: 'reason',
      key: 'reason',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusInfo = formatAfterSalesStatus(status);
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
      },
    },
    {
      title: '申请时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (time: string) => formatDate(time, 'YYYY-MM-DD HH:mm'),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Button
          type="link"
          onClick={() => navigate(`/after-sales/${record.id}`)}
        >
          查看详情
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <Title level={2} style={{ marginBottom: 8 }}>
          🛎️ 售后服务
        </Title>
        <Text type="secondary">查看和管理您的售后申请</Text>
      </div>

      <Card style={{ borderRadius: 16 }}>
        {list.length === 0 ? (
          <Empty
            description="暂无售后记录"
            style={{ padding: 60 }}
          >
            <Button type="primary" onClick={() => navigate('/orders')} style={{ borderRadius: 20 }}>
              查看订单
            </Button>
          </Empty>
        ) : (
          <Table
            columns={columns}
            dataSource={list}
            rowKey="id"
            loading={loading}
            pagination={false}
          />
        )}
      </Card>
    </div>
  );
};

export default AfterSales;
