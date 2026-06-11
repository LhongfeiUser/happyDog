import React, { useEffect, useState } from 'react';
import { Typography, Tabs, Spin, Empty, Button } from 'antd';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { getServicesAsync, getServiceCategoriesAsync } from '../../store/slices/servicesSlice';
import { ServiceCard } from '../../components/business';

const { Title, Text } = Typography;

const Services: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { list, categories, loading } = useAppSelector(state => state.services);
  const [activeCategory, setActiveCategory] = useState<string>(searchParams.get('category') || 'all');

  useEffect(() => {
    dispatch(getServiceCategoriesAsync());
  }, [dispatch]);

  useEffect(() => {
    const category = activeCategory === 'all' ? undefined : activeCategory;
    dispatch(getServicesAsync({ category }));
  }, [dispatch, activeCategory]);

  const handleCategoryChange = (key: string) => {
    setActiveCategory(key);
    navigate(key === 'all' ? '/services' : `/services?category=${key}`);
  };

  const tabItems = [
    {
      key: 'all',
      label: '全部服务',
    },
    ...categories.map(cat => ({
      key: cat.category,
      label: `${cat.label} (${cat.count})`,
    })),
  ];

  return (
    <div className="flex-col gap-8">
      <div>
        <Title level={2} style={{ marginBottom: 8 }}>
          🐾 服务列表
        </Title>
        <Text type="secondary">为您的爱宠选择合适的服务</Text>
      </div>

      <Tabs
        activeKey={activeCategory}
        onChange={handleCategoryChange}
        items={tabItems}
      />

      {loading ? (
        <div className="flex justify-center items-center" style={{ padding: 100 }}>
          <Spin size="large" />
        </div>
      ) : list.length === 0 ? (
        <Empty
          description="暂无服务"
          style={{ padding: 100 }}
        >
          <Button type="primary" onClick={() => navigate('/')}>
            返回首页
          </Button>
        </Empty>
      ) : (
        <div className="grid grid-cols-4 gap-6">
          {list.map(service => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Services;
