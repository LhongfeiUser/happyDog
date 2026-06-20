import React, { useEffect, useState } from 'react';
import { Typography, Card, Row, Col, Button, Tag, Rate, Space, Descriptions, message, Modal, Form, Input, DatePicker, Select, Spin } from 'antd';
import { ClockCircleOutlined, ShoppingOutlined, PhoneOutlined } from '@ant-design/icons';
import AddressPicker from '@/components/common/AddressPicker';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { getServiceByIdAsync } from '../../store/slices/servicesSlice';
import { getServiceReviewsAsync } from '../../store/slices/reviewsSlice';
import { createOrderAsync } from '../../store/slices/ordersSlice';
import { getPetsAsync } from '../../store/slices/petsSlice';
import { formatPrice, formatServiceCategory, formatDate, getImageUrls } from '../../utils';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;

const ServiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentService, loading } = useAppSelector(state => state.services);
  const { serviceReviews } = useAppSelector(state => state.reviews);
  const { list: pets } = useAppSelector(state => state.pets);
  const [orderModalVisible, setOrderModalVisible] = useState(false);
  const [orderForm] = Form.useForm();

  useEffect(() => {
    if (id) {
      dispatch(getServiceByIdAsync(id));
      dispatch(getServiceReviewsAsync({ serviceId: id }));
      dispatch(getPetsAsync());
    }
  }, [dispatch, id]);

  const handleOrder = async (values: any) => {
    try {
      await dispatch(createOrderAsync({
        serviceId: id!,
        petId: values.petId,
        appointmentDate: values.appointmentDate.format('YYYY-MM-DD'),
        appointmentTime: values.appointmentTime,
        address: values.address,
        contactPhone: values.contactPhone,
        remark: values.remark,
      })).unwrap();
      message.success('下单成功！');
      setOrderModalVisible(false);
      navigate('/orders');
    } catch (error) {
      message.error('下单失败：' + error);
    }
  };

  if (loading || !currentService) {
    return (
      <div style={{ textAlign: 'center', padding: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  const images = getImageUrls(currentService.images);

  return (
    <div>
      <Row gutter={32}>
        <Col span={12}>
          <Card style={{ borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ height: 400, overflow: 'hidden' }}>
              <img
                alt={currentService.name}
                src={images[0] || 'https://via.placeholder.com/600x400?text=宠物服务'}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/600x400?text=宠物服务';
                }}
              />
            </div>
            {images.length > 1 && (
              <Row gutter={8} style={{ marginTop: 8 }}>
                {images.slice(1, 4).map((img, index) => (
                  <Col span={8} key={index}>
                    <div style={{ height: 80, overflow: 'hidden', borderRadius: 8 }}>
                      <img
                        alt={`${currentService.name}-${index}`}
                        src={img}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  </Col>
                ))}
              </Row>
            )}
          </Card>
        </Col>
        <Col span={12}>
          <Card style={{ borderRadius: 16, height: '100%' }}>
            <Tag color="blue" style={{ marginBottom: 16 }}>
              {formatServiceCategory(currentService.category)}
            </Tag>
            <Title level={2} style={{ marginBottom: 16 }}>
              {currentService.name}
            </Title>
            <Paragraph type="secondary" style={{ marginBottom: 24 }}>
              {currentService.description}
            </Paragraph>

            <div style={{ marginBottom: 24 }}>
              <Text strong style={{ color: '#FF6B35', fontSize: 36 }}>
                ¥{formatPrice(currentService.price)}
              </Text>
              {currentService.category === 'boarding' && (
                <Text type="secondary" style={{ marginLeft: 8 }}>/天</Text>
              )}
            </div>

            <Descriptions column={1} style={{ marginBottom: 24 }}>
              <Descriptions.Item label="时长">
                <ClockCircleOutlined style={{ marginRight: 8 }} />
                {currentService.duration}分钟
              </Descriptions.Item>
              <Descriptions.Item label="评分">
                <Rate disabled defaultValue={currentService.rating} style={{ fontSize: 16 }} />
                <Text style={{ marginLeft: 8 }}>{currentService.rating}分</Text>
              </Descriptions.Item>
              <Descriptions.Item label="销量">
                <ShoppingOutlined style={{ marginRight: 8 }} />
                已售{currentService.salesCount}次
              </Descriptions.Item>
            </Descriptions>

            <Button
              type="primary"
              size="large"
              block
              style={{
                height: 56,
                borderRadius: 28,
                fontSize: 18,
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #FF6B35 0%, #FF8555 100%)',
                border: 'none',
              }}
              onClick={() => setOrderModalVisible(true)}
            >
              立即预约
            </Button>
          </Card>
        </Col>
      </Row>

      {/* 评价区域 */}
      <Card style={{ borderRadius: 16, marginTop: 32 }}>
        <Title level={4} style={{ marginBottom: 24 }}>
          用户评价 ({serviceReviews.length})
        </Title>
        {serviceReviews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
            暂无评价
          </div>
        ) : (
          serviceReviews.map(review => (
            <div key={review.id} style={{ marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid #f0f0f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <Space>
                  <Rate disabled defaultValue={review.rating} style={{ fontSize: 14 }} />
                  <Text>{review.rating}分</Text>
                </Space>
                <Text type="secondary">{formatDate(review.createTime)}</Text>
              </div>
              <Paragraph>{review.content}</Paragraph>
            </div>
          ))
        )}
      </Card>

      {/* 下单弹窗 */}
      <Modal
        title="预约服务"
        open={orderModalVisible}
        onCancel={() => setOrderModalVisible(false)}
        footer={null}
        width={600}
        style={{ borderRadius: 20 }}
      >
        <Form
          form={orderForm}
          onFinish={handleOrder}
          layout="vertical"
        >
          <Form.Item
            name="petId"
            label="选择宠物"
            rules={[{ required: true, message: '请选择宠物' }]}
          >
            <Select placeholder="请选择您的宠物">
              {pets.map(pet => (
                <Select.Option key={pet.id} value={pet.id}>
                  {pet.name} ({formatServiceCategory(pet.species)})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="appointmentDate"
            label="预约日期"
            rules={[{ required: true, message: '请选择预约日期' }]}
          >
            <DatePicker
              style={{ width: '100%' }}
              disabledDate={(current) => current && current < dayjs().startOf('day')}
            />
          </Form.Item>

          <Form.Item
            name="appointmentTime"
            label="预约时间"
            rules={[{ required: true, message: '请选择预约时间' }]}
          >
            <Select placeholder="请选择预约时间">
              <Select.Option value="09:00-10:00">09:00-10:00</Select.Option>
              <Select.Option value="10:00-11:00">10:00-11:00</Select.Option>
              <Select.Option value="11:00-12:00">11:00-12:00</Select.Option>
              <Select.Option value="14:00-15:00">14:00-15:00</Select.Option>
              <Select.Option value="15:00-16:00">15:00-16:00</Select.Option>
              <Select.Option value="16:00-17:00">16:00-17:00</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="address"
            label="服务地址"
            rules={[
              { required: true, message: '请选择地址' },
              {
                validator: (_, value) => {
                  if (value && typeof value === 'object' && !value.address) {
                    return Promise.reject('请输入详细地址');
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <AddressPicker placeholder="请选择服务地址" />
          </Form.Item>

          <Form.Item
            name="contactPhone"
            label="联系电话"
            rules={[{ required: true, message: '请输入联系电话' }]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="请输入联系电话" />
          </Form.Item>

          <Form.Item
            name="remark"
            label="备注"
          >
            <Input.TextArea rows={3} placeholder="请输入备注信息（选填）" />
          </Form.Item>

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setOrderModalVisible(false)} style={{ borderRadius: 20 }}>
                取消
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  borderRadius: 20,
                  background: 'linear-gradient(135deg, #FF6B35 0%, #FF8555 100%)',
                  border: 'none',
                }}
              >
                确认下单
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ServiceDetail;
