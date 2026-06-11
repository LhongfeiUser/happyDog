import React from 'react';
import { Card, Tag, Rate, Typography } from 'antd';
import { ClockCircleOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { Service } from '../../types';
import { formatPrice, formatServiceCategory, getImageUrl } from '../../utils';

const { Text, Title } = Typography;

interface ServiceCardProps {
  service: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const navigate = useNavigate();

  const categoryColors: Record<string, string> = {
    wash: 'blue',
    grooming: 'purple',
    boarding: 'orange',
  };

  return (
    <Card
      hoverable
      style={{
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(255, 107, 53, 0.15)',
        transition: 'all 0.3s ease',
      }}
      cover={
        <div
          style={{
            height: 200,
            overflow: 'hidden',
            background: '#FFF3E0',
          }}
        >
          <img
            alt={service.name}
            src={getImageUrl(service.images)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/400x200?text=宠物服务';
            }}
          />
        </div>
      }
      onClick={() => navigate(`/services/${service.id}`)}
    >
      <Tag color={categoryColors[service.category]} style={{ marginBottom: 8 }}>
        {formatServiceCategory(service.category)}
      </Tag>
      <Title level={5} style={{ marginBottom: 8, color: '#333' }}>
        {service.name}
      </Title>
      <Text type="secondary" style={{ display: 'block', marginBottom: 12, fontSize: 13 }}>
        {service.description.length > 50
          ? service.description.substring(0, 50) + '...'
          : service.description}
      </Text>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
        <Rate disabled defaultValue={service.rating} style={{ fontSize: 14 }} />
        <Text style={{ marginLeft: 8, color: '#FF6B35' }}>{service.rating}</Text>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text strong style={{ color: '#FF6B35', fontSize: 20 }}>
          ¥{formatPrice(service.price)}
        </Text>
        <div style={{ display: 'flex', gap: 12 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            <ClockCircleOutlined style={{ marginRight: 4 }} />
            {service.duration}分钟
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            <ShoppingOutlined style={{ marginRight: 4 }} />
            已售{service.salesCount}
          </Text>
        </div>
      </div>
    </Card>
  );
};

export default ServiceCard;
