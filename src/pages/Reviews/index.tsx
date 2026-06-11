import React, { useEffect } from 'react';
import { Typography, Card, Rate, Tag, Empty, Button, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { getUserReviewsAsync } from '../../store/slices/reviewsSlice';
import { formatDate } from '../../utils';

const { Title, Text, Paragraph } = Typography;

const Reviews: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { list, loading } = useAppSelector(state => state.reviews);

  useEffect(() => {
    dispatch(getUserReviewsAsync());
  }, [dispatch]);

  return (
    <div className="flex-col gap-8">
      <div>
        <Title level={2} style={{ marginBottom: 8 }}>
          ⭐ 我的评价
        </Title>
        <Text type="secondary">查看您发布的所有评价</Text>
      </div>

      {loading ? (
        <div className="flex justify-center items-center" style={{ padding: 100 }}>
          <Spin size="large" />
        </div>
      ) : list.length === 0 ? (
        <Empty
          description="暂无评价"
          style={{ padding: 100 }}
        >
          <Button type="primary" onClick={() => navigate('/orders')} style={{ borderRadius: 20 }}>
            去评价订单
          </Button>
        </Empty>
      ) : (
        <div className="flex-col gap-4">
          {list.map(review => (
            <Card
              key={review.id}
              style={{
                borderRadius: 16,
                boxShadow: '0 2px 8px rgba(255, 107, 53, 0.1)',
              }}
            >
              <div className="flex justify-between items-start" style={{ marginBottom: 16 }}>
                <div>
                  <Rate disabled value={review.rating} style={{ fontSize: 16 }} />
                  <Text style={{ marginLeft: 8, color: '#FF6B35' }}>{review.rating}分</Text>
                </div>
                <Text type="secondary">{formatDate(review.createTime)}</Text>
              </div>

              <Paragraph style={{ marginBottom: 16 }}>
                {review.content}
              </Paragraph>

              <div className="flex justify-between items-center">
                <Tag>订单号：{review.orderId.substring(0, 8)}...</Tag>
                <Button
                  type="link"
                  onClick={() => navigate(`/orders/${review.orderId}`)}
                  style={{ color: '#FF6B35' }}
                >
                  查看订单
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reviews;
