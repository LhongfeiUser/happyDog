import React from 'react';
import { Typography, Card, Form, Rate, Input, Button, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch } from '../../hooks';
import { createReviewAsync } from '../../store/slices/reviewsSlice';

const { Title } = Typography;
const { TextArea } = Input;

const Review: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
    try {
      await dispatch(createReviewAsync({
        orderId: id!,
        rating: values.rating,
        content: values.content,
      })).unwrap();
      message.success('评价成功！');
      navigate('/orders');
    } catch (error) {
      message.error('评价失败：' + error);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <Card style={{ borderRadius: 16 }}>
        <Title level={3} style={{ textAlign: 'center', marginBottom: 32 }}>
          ⭐ 服务评价
        </Title>

        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          initialValues={{ rating: 5 }}
        >
          <Form.Item
            name="rating"
            label="服务评分"
            rules={[{ required: true, message: '请选择评分' }]}
          >
            <Rate style={{ fontSize: 32 }} />
          </Form.Item>

          <Form.Item
            name="content"
            label="评价内容"
            rules={[{ required: true, message: '请输入评价内容' }]}
          >
            <TextArea
              rows={4}
              placeholder="请分享您的服务体验..."
              style={{ borderRadius: 12 }}
            />
          </Form.Item>

          <Form.Item>
            <div style={{ display: 'flex', gap: 16 }}>
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  flex: 1,
                  height: 48,
                  borderRadius: 24,
                  background: 'linear-gradient(135deg, #FF6B35 0%, #FF8555 100%)',
                  border: 'none',
                }}
              >
                提交评价
              </Button>
              <Button
                onClick={() => navigate('/orders')}
                style={{ flex: 1, height: 48, borderRadius: 24 }}
              >
                返回订单
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Review;
