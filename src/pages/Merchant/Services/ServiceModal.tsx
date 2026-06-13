import React, { useEffect } from 'react';
import { Modal, message, Tag, Image, Button } from 'antd';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { createServiceAsync, updateServiceAsync } from '../../../store/slices/merchantServicesSlice';
import ServiceForm from './ServiceForm';
import { formatPrice, formatServiceCategory } from '../../../utils';
import type { MerchantService } from '../../../types';

interface ServiceModalProps {
  visible: boolean;
  onClose: () => void;
  service?: MerchantService | null;
  readOnly?: boolean;
}

const ServiceModal: React.FC<ServiceModalProps> = ({ visible, onClose, service, readOnly = false }) => {
  const [form] = ServiceForm.useForm();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector(state => state.merchantServices);

  const isEdit = !!service && !readOnly;
  const isView = !!service && readOnly;

  useEffect(() => {
    if (visible && service) {
      // 编辑/查看模式：设置表单初始值
      form.setFieldsValue({
        name: service.name,
        category: service.category,
        price: service.price / 100, // 分转元
        duration: service.duration,
        description: service.description,
        images: service.images || [],
      });
    } else if (visible) {
      // 新增模式：重置表单
      form.resetFields();
    }
  }, [visible, service, form]);

  const handleSubmit = async (values: any) => {
    try {
      // 转换价格：元转分
      const submitData = {
        ...values,
        price: Math.round(values.price * 100),
      };

      if (isEdit && service) {
        await dispatch(updateServiceAsync({
          id: service.id,
          data: submitData,
        })).unwrap();
        message.success('更新服务成功！');
      } else {
        await dispatch(createServiceAsync(submitData)).unwrap();
        message.success('创建服务成功！');
      }

      onClose();
    } catch (error: any) {
      message.error(error || '操作失败，请重试');
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  // 获取标题
  const getTitle = () => {
    if (isView) return '服务详情';
    if (isEdit) return '编辑服务';
    return '新增服务';
  };

  // 查看模式下的详情展示
  const renderViewMode = () => {
    if (!service) return null;

    return (
      <div style={{ padding: '20px 0' }}>
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: '#333', marginBottom: 16 }}>
            基本信息
          </h3>
          <div style={{ background: '#fafafa', borderRadius: 8, padding: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 12, marginBottom: 12 }}>
              <span style={{ color: '#666' }}>服务名称：</span>
              <span style={{ color: '#333', fontWeight: 500 }}>{service.name}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 12, marginBottom: 12 }}>
              <span style={{ color: '#666' }}>服务分类：</span>
              <Tag color="blue" style={{ borderRadius: 12, width: 'fit-content' }}>
                {formatServiceCategory(service.category)}
              </Tag>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 12, marginBottom: 12 }}>
              <span style={{ color: '#666' }}>服务价格：</span>
              <span style={{ color: '#FF6B35', fontWeight: 600, fontSize: 16 }}>
                ¥{formatPrice(service.price)}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 12, marginBottom: 12 }}>
              <span style={{ color: '#666' }}>服务时长：</span>
              <span>{service.duration} 分钟</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 12, marginBottom: 12 }}>
              <span style={{ color: '#666' }}>服务状态：</span>
              <Tag color={service.status === 'active' ? 'green' : 'default'}>
                {service.status === 'active' ? '上架中' : '已下架'}
              </Tag>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 12, marginBottom: 12 }}>
              <span style={{ color: '#666' }}>销量：</span>
              <span>{service.salesCount || 0} 次</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 12 }}>
              <span style={{ color: '#666' }}>评分：</span>
              <span style={{ color: '#faad14' }}>
                {service.rating ? service.rating.toFixed(1) : '-'} 分
              </span>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: '#333', marginBottom: 16 }}>
            服务描述
          </h3>
          <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 8, padding: 16 }}>
            <p style={{ margin: 0, color: '#666', lineHeight: 1.6 }}>{service.description}</p>
          </div>
        </div>

        {service.images && service.images.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#333', marginBottom: 16 }}>
              服务图片
            </h3>
            <Image.PreviewGroup>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {service.images.map((img, index) => (
                  <Image
                    key={index}
                    src={img}
                    alt={`服务图片${index + 1}`}
                    width={120}
                    height={120}
                    style={{ borderRadius: 8, objectFit: 'cover' }}
                  />
                ))}
              </div>
            </Image.PreviewGroup>
          </div>
        )}

        <div style={{ marginTop: 32, textAlign: 'right' }}>
          <Button
            onClick={handleCancel}
            style={{ borderRadius: 20, minWidth: 100 }}
          >
            关闭
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Modal
      title={
        <span style={{ fontSize: 18, fontWeight: 600, color: '#333' }}>
          {getTitle()}
        </span>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={isView ? 720 : 640}
      centered
      destroyOnClose
      style={{ borderRadius: 12 }}
      styles={{
        body: {
          padding: '24px 32px',
          maxHeight: '70vh',
          overflowY: 'auto',
        },
      }}
    >
      {isView ? (
        renderViewMode()
      ) : (
        <ServiceForm
          form={form}
          onFinish={handleSubmit}
          loading={loading}
        />
      )}
    </Modal>
  );
};

export default ServiceModal;
