import React, { useEffect, useState } from 'react';
import { Typography, Card, Button } from 'antd';
import {
  CheckCircleOutlined,
  PhoneOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  HomeOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { useAppSelector } from '../../hooks';
import ServiceCarousel from './components/ServiceCarousel';
import ServiceProcess from './components/ServiceProcess';
import FAQSection from './components/FAQSection';

const { Title, Text, Paragraph } = Typography;

const Feeding: React.FC = () => {
  const services = useAppSelector(
    state => state.services.list.filter(s => s.category === 'feeding')
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟加载延迟
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // 轮播图数据
  const carouselImages = [
    'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=1200',
    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1200',
    'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1200',
  ];

  // 服务流程数据
  const processSteps = [
    { title: '选择服务', description: '选择适合的服务类型', icon: <HomeOutlined /> },
    { title: '预约时间', description: '选择上门服务时间', icon: <CalendarOutlined /> },
    { title: '确认地址', description: '填写详细地址信息', icon: <CheckCircleOutlined /> },
    { title: '宠物师上门', description: '专业宠物师按时到达', icon: <SafetyCertificateOutlined /> },
    { title: '服务完成', description: '拍照反馈，服务完成', icon: <CheckCircleOutlined /> },
  ];

  // FAQ数据
  const faqs = [
    {
      question: '宠物师资质如何？',
      answer: '所有宠物师均经过专业培训，持有相关资格证书，至少有2年以上宠物护理经验。我们还会定期进行技能考核和培训。',
    },
    {
      question: '服务过程中宠物生病怎么办？',
      answer: '我们提供全程保险保障，如服务过程中宠物出现健康问题，我们会立即联系合作兽医进行处理，费用由平台承担。',
    },
    {
      question: '如何确保服务安全？',
      answer: '所有宠物师都经过严格的背景调查，服务过程中会佩戴专业设备，全程录像监控，确保服务安全可靠。',
    },
    {
      question: '可以取消预约吗？',
      answer: '可以，请提前24小时取消预约，全额退款。24小时内取消将收取30%的手续费。',
    },
    {
      question: '服务时间是什么时候？',
      answer: '我们的服务时间是每天08:00-20:00，您可以根据自己的需求预约合适的时间段。',
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center" style={{ padding: 100 }}>
        <div className="flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
          <Text type="secondary" style={{ marginTop: 16 }}>加载中...</Text>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-col gap-8">
      {/* 服务轮播横幅 */}
      <ServiceCarousel
        images={carouselImages}
        title="上门喂养服务"
        subtitle="专业宠物师贴心上门，让您的宠物在您不在时也能得到最好的照顾"
      />

      {/* 服务卡片网格 */}
      <div>
        <Title level={3} style={{ marginBottom: 24 }}>
          🎯 选择服务
        </Title>
        <div className="grid grid-cols-3 gap-6">
          {services.map((service) => (
            <Card
              key={service.id}
              hoverable
              style={{ borderRadius: 16 }}
              cover={
                <img
                  src={JSON.parse(service.images)[0]}
                  alt={service.name}
                  style={{ height: 200, objectFit: 'cover' }}
                />
              }
            >
              <Card.Meta
                title={service.name}
                description={
                  <div className="flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <Text strong style={{ color: '#FF6B35', fontSize: 20 }}>
                        ¥{(service.price / 100).toFixed(2)}
                      </Text>
                      <Text type="secondary">{service.duration}分钟</Text>
                    </div>
                    <Paragraph ellipsis={{ tooltip: service.description }}>
                      {service.description}
                    </Paragraph>
                    <div className="flex items-center gap-4">
                      <Text type="secondary">评分：{service.rating}</Text>
                      <Text type="secondary">销量：{service.salesCount}</Text>
                    </div>
                    <Button
                      type="primary"
                      block
                      style={{
                        borderRadius: 20,
                        backgroundColor: '#FF6B35',
                        borderColor: '#FF6B35',
                      }}
                    >
                      立即预约
                    </Button>
                  </div>
                }
              />
            </Card>
          ))}
        </div>
      </div>

      {/* 服务流程 */}
      <Card style={{ borderRadius: 16 }}>
        <Title level={3} style={{ marginBottom: 24, textAlign: 'center' }}>
          📋 服务流程
        </Title>
        <ServiceProcess steps={processSteps} />
      </Card>

      {/* 常见问题 */}
      <Card style={{ borderRadius: 16 }}>
        <Title level={3} style={{ marginBottom: 24 }}>
          ❓ 常见问题
        </Title>
        <FAQSection faqs={faqs} />
      </Card>

      {/* 联系方式 */}
      <Card style={{ borderRadius: 16, backgroundColor: '#FFF8F0' }}>
        <Title level={3} style={{ marginBottom: 24, textAlign: 'center' }}>
          📞 联系我们
        </Title>
        <div className="grid grid-cols-2 gap-8">
          <div className="flex items-center gap-4">
            <PhoneOutlined style={{ fontSize: 32, color: '#FF6B35' }} />
            <div>
              <Text type="secondary">客服热线</Text>
              <div>
                <Text strong style={{ fontSize: 24 }}>400-888-8888</Text>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ClockCircleOutlined style={{ fontSize: 32, color: '#FF6B35' }} />
            <div>
              <Text type="secondary">服务时间</Text>
              <div>
                <Text strong style={{ fontSize: 24 }}>08:00 - 20:00</Text>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Feeding;
