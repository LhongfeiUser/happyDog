import React, { useEffect } from 'react';
import { Typography, Card, Button, Spin } from 'antd';
import { ShoppingOutlined, HeartOutlined, StarOutlined, RightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { getRecommendServicesAsync, getServiceCategoriesAsync } from '../../store/slices/servicesSlice';
import { ServiceCard } from '../../components/business';

const { Title, Text, Paragraph } = Typography;

const Home: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { recommendList, categories, loading } = useAppSelector(state => state.services);

  useEffect(() => {
    dispatch(getRecommendServicesAsync(4));
    dispatch(getServiceCategoriesAsync());
  }, [dispatch]);

  const categoryIcons: Record<string, React.ReactNode> = {
    wash: <ShoppingOutlined style={{ fontSize: 40, color: '#2196F3' }} />,
    grooming: <StarOutlined style={{ fontSize: 40, color: '#9C27B0' }} />,
    boarding: <HeartOutlined style={{ fontSize: 40, color: '#FF9800' }} />,
  };

  const categoryColors: Record<string, string> = {
    wash: '#E3F2FD',
    grooming: '#F3E5F5',
    boarding: '#FFF3E0',
  };

  return (
    <div className="flex-col gap-8">
      {/* Banner */}
      <div
        className="flex items-center"
        style={{
          background: 'linear-gradient(135deg, #FF6B35 0%, #FF8555 100%)',
          borderRadius: 20,
          padding: '60px 40px',
          color: 'white',
        }}
      >
        <div className="flex-1">
          <Title level={1} style={{ color: 'white', marginBottom: 16 }}>
            🐾 宠物服务平台
          </Title>
          <Paragraph style={{ color: 'rgba(255,255,255,0.9)', fontSize: 18, marginBottom: 24 }}>
            为您的爱宠提供专业、贴心的服务
            <br />
            洗护、美容、寄养，一站式解决
          </Paragraph>
          <div className="flex gap-4">
            <Button
              type="primary"
              size="large"
              style={{
                backgroundColor: 'white',
                borderColor: 'white',
                color: '#FF6B35',
                borderRadius: 20,
                height: 48,
                padding: '0 32px',
                fontWeight: 'bold',
              }}
              onClick={() => navigate('/services')}
            >
              立即预约
            </Button>
            <Button
              size="large"
              style={{
                backgroundColor: 'transparent',
                borderColor: 'white',
                color: 'white',
                borderRadius: 20,
                height: 48,
                padding: '0 32px',
              }}
              onClick={() => navigate('/pets')}
            >
              添加宠物
            </Button>
          </div>
        </div>
        <div style={{ fontSize: 120, textAlign: 'center' }}>🐕</div>
      </div>

      {/* 服务分类 */}
      <div>
        <div className="flex items-center justify-between" style={{ marginBottom: 24 }}>
          <Title level={3} style={{ margin: 0 }}>
            服务分类
          </Title>
          <Button
            type="link"
            onClick={() => navigate('/services')}
            style={{ color: '#FF6B35' }}
          >
            查看全部 <RightOutlined />
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {categories.map(cat => (
            <Card
              key={cat.category}
              style={{
                borderRadius: 16,
                padding: '24px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backgroundColor: categoryColors[cat.category],
              }}
              hoverable
              onClick={() => navigate(`/services?category=${cat.category}`)}
            >
              <div style={{ marginBottom: 16 }}>
                {categoryIcons[cat.category]}
              </div>
              <Title level={4} style={{ marginBottom: 8 }}>
                {cat.label}
              </Title>
              <Text type="secondary">{cat.count} 个服务</Text>
            </Card>
          ))}
        </div>
      </div>

      {/* 推荐服务 */}
      <div>
        <div className="flex items-center justify-between" style={{ marginBottom: 24 }}>
          <Title level={3} style={{ margin: 0 }}>
            热门推荐
          </Title>
          <Button
            type="link"
            onClick={() => navigate('/services')}
            style={{ color: '#FF6B35' }}
          >
            查看更多 <RightOutlined />
          </Button>
        </div>
        {loading ? (
          <div className="flex justify-center items-center" style={{ padding: 60 }}>
            <Spin size="large" />
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-6">
            {recommendList.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </div>

      {/* 为什么选择我们 */}
      <div>
        <Title level={3} style={{ textAlign: 'center', marginBottom: 32 }}>
          为什么选择我们
        </Title>
        <div className="grid grid-cols-4 gap-6">
          <Card style={{ borderRadius: 16, textAlign: 'center', padding: '24px 16px' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🏆</div>
            <Title level={5}>专业团队</Title>
            <Text type="secondary">持证上岗，经验丰富</Text>
          </Card>
          <Card style={{ borderRadius: 16, textAlign: 'center', padding: '24px 16px' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🛡️</div>
            <Title level={5}>安全保障</Title>
            <Text type="secondary">全程监控，安全放心</Text>
          </Card>
          <Card style={{ borderRadius: 16, textAlign: 'center', padding: '24px 16px' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>💰</div>
            <Title level={5}>价格透明</Title>
            <Text type="secondary">明码标价，无隐形消费</Text>
          </Card>
          <Card style={{ borderRadius: 16, textAlign: 'center', padding: '24px 16px' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⭐</div>
            <Title level={5}>好评如潮</Title>
            <Text type="secondary">用户满意度 99%</Text>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
