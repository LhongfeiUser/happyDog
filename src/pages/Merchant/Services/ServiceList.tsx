import React from 'react';
import { Table, Tag, Button, Space, Image, Tooltip, Switch } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { deleteServiceAsync, updateServiceStatusAsync } from '../../../store/slices/merchantServicesSlice';
import { formatPrice, formatServiceCategory } from '../../../utils';
import type { MerchantService } from '../../../types';
import { message, Modal } from 'antd';

interface ServiceListProps {
  loading: boolean;
  onEdit: (service: MerchantService) => void;
  onView: (service: MerchantService) => void;
}

const ServiceList: React.FC<ServiceListProps> = ({ loading, onEdit, onView }) => {
  const dispatch = useAppDispatch();
  const { list, currentPage, pageSize, total } = useAppSelector(
    state => state.merchantServices
  );

  // 处理删除服务
  const handleDelete = (service: MerchantService) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除服务"${service.name}"吗？此操作不可恢复。`,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      centered: true,
      onOk: async () => {
        try {
          await dispatch(deleteServiceAsync(service.id)).unwrap();
          message.success('删除成功！');
        } catch (error: any) {
          message.error(error || '删除失败，请重试');
        }
      },
    });
  };

  // 处理状态切换
  const handleStatusChange = async (service: MerchantService, checked: boolean) => {
    const newStatus = checked ? 'active' : 'inactive';
    const statusText = checked ? '上架' : '下架';

    try {
      await dispatch(updateServiceStatusAsync({
        id: service.id,
        status: newStatus,
      })).unwrap();
      message.success(`${statusText}成功！`);
    } catch (error: any) {
      message.error(error || `${statusText}失败，请重试`);
    }
  };

  // 表格列配置
  const columns = [
    {
      title: '服务名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      fixed: 'left' as const,
      render: (text: string, record: MerchantService) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {record.images && record.images.length > 0 ? (
            <Image
              src={record.images[0]}
              alt={text}
              width={48}
              height={48}
              style={{ borderRadius: 8, objectFit: 'cover' }}
              preview={false}
            />
          ) : (
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 8,
                background: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#999',
              }}
            >
              暂无图片
            </div>
          )}
          <div>
            <div style={{ fontWeight: 500, color: '#333' }}>{text}</div>
            <div style={{ fontSize: 12, color: '#999' }}>
              ID: {record.id.slice(0, 8)}...
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '服务分类',
      dataIndex: 'category',
      key: 'category',
      width: 100,
      render: (category: string) => {
        const colorMap: Record<string, string> = {
          wash: 'blue',
          grooming: 'purple',
          boarding: 'green',
          feeding: 'orange',
        };
        return (
          <Tag color={colorMap[category] || 'default'} style={{ borderRadius: 12 }}>
            {formatServiceCategory(category)}
          </Tag>
        );
      },
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      width: 120,
      align: 'right' as const,
      render: (price: number) => (
        <span style={{ color: '#FF6B35', fontWeight: 600, fontSize: 16 }}>
          ¥{formatPrice(price)}
        </span>
      ),
    },
    {
      title: '时长',
      dataIndex: 'duration',
      key: 'duration',
      width: 100,
      align: 'center' as const,
      render: (duration: number) => (
        <span>{duration}分钟</span>
      ),
    },
    {
      title: '销量',
      dataIndex: 'salesCount',
      key: 'salesCount',
      width: 100,
      align: 'center' as const,
      render: (count: number) => (
        <span style={{ color: '#1890ff' }}>{count || 0}</span>
      ),
    },
    {
      title: '评分',
      dataIndex: 'rating',
      key: 'rating',
      width: 100,
      align: 'center' as const,
      render: (rating: number) => (
        <span style={{ color: '#faad14' }}>{rating ? rating.toFixed(1) : '-'}</span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      align: 'center' as const,
      render: (status: string, record: MerchantService) => (
        <Switch
          checked={status === 'active'}
          checkedChildren="上架"
          unCheckedChildren="下架"
          onChange={(checked) => handleStatusChange(record, checked)}
          style={{
            background: status === 'active'
              ? 'linear-gradient(135deg, #FF6B35 0%, #FF8555 100%)'
              : undefined,
          }}
        />
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
      render: (time: string) => (
        <span style={{ color: '#666' }}>
          {new Date(time).toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right' as const,
      align: 'center' as const,
      render: (_: any, record: MerchantService) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => onView(record)}
              style={{ color: '#1890ff' }}
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={list}
      rowKey="id"
      loading={loading}
      scroll={{ x: 1400 }}
      pagination={{
        current: currentPage,
        pageSize,
        total,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `共 ${total} 条服务`,
        pageSizeOptions: ['10', '20', '50', '100'],
        style: { marginTop: 16 },
      }}
      style={{
        background: '#fff',
        borderRadius: 12,
      }}
    />
  );
};

export default ServiceList;
