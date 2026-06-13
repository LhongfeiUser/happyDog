import React, { useEffect, useState } from 'react';
import {
  Card,
  Button,
  Input,
  Select,
  Space,
  Row,
  Col,
  Statistic,
  Tag,
  Empty,
  Spin,
  Descriptions,
  Image,
  Divider,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
  CheckCircleOutlined,
  PauseCircleOutlined,
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { getServicesListAsync } from '../../../store/slices/merchantServicesSlice';
import ServiceList from './ServiceList';
import ServiceModal from './ServiceModal';
import { formatPrice, formatServiceCategory } from '../../../utils';
import type { MerchantService } from '../../../types';

const MerchantServices: React.FC = () => {
  const dispatch = useAppDispatch();
  const { list, loading, error, total } = useAppSelector(
    state => state.merchantServices
  );

  // 模态框状态
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState<MerchantService | null>(null);

  // 搜索和筛选状态
  const [searchKeyword, setSearchKeyword] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  // 获取统计数据
  const activeCount = list.filter(s => s.status === 'active').length;
  const inactiveCount = list.filter(s => s.status === 'inactive').length;
  const totalSales = list.reduce((sum, s) => sum + s.salesCount, 0);

  // 加载服务列表
  const loadServices = () => {
    dispatch(getServicesListAsync({
      category: categoryFilter || undefined,
      status: statusFilter || undefined,
    }));
  };

  useEffect(() => {
    loadServices();
  }, [dispatch, categoryFilter, statusFilter]);

  // 处理搜索
  const handleSearch = (value: string) => {
    setSearchKeyword(value);
    // 实际项目中应该调用搜索API
    // 这里简单过滤前端数据
  };

  // 处理重置
  const handleReset = () => {
    setSearchKeyword('');
    setCategoryFilter('');
    setStatusFilter('');
  };

  // 处理编辑
  const handleEdit = (service: MerchantService) => {
    setSelectedService(service);
    setEditModalVisible(true);
  };

  // 处理查看
  const handleView = (service: MerchantService) => {
    setSelectedService(service);
    setViewModalVisible(true);
  };

  // 服务分类选项
  const categoryOptions = [
    { value: 'wash', label: '洗护' },
    { value: 'grooming', label: '美容' },
    { value: 'boarding', label: '寄养' },
    { value: 'feeding', label: '喂养' },
  ];

  // 状态选项
  const statusOptions = [
    { value: 'active', label: '上架中' },
    { value: 'inactive', label: '已下架' },
  ];

  // 过滤后的列表
  const filteredList = list.filter(service => {
    const matchKeyword = !searchKeyword ||
      service.name.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchCategory = !categoryFilter || service.category === categoryFilter;
    const matchStatus = !statusFilter || service.status === statusFilter;
    return matchKeyword && matchCategory && matchStatus;
  });

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 600, color: '#333', margin: 0 }}>
          服务管理
        </h1>
        <p style={{ color: '#666', marginTop: 8, marginBottom: 0 }}>
          管理您的宠物服务项目，包括新增、编辑、上下架等操作
        </p>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            style={{
              borderRadius: 12,
              background: 'linear-gradient(135deg, #FF6B35 0%, #FF8555 100%)',
              border: 'none',
            }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.85)' }}>总服务数</span>}
              value={total}
              prefix={<ShoppingOutlined style={{ color: '#fff' }} />}
              valueStyle={{ color: '#fff', fontSize: 28, fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            style={{
              borderRadius: 12,
              background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
              border: 'none',
            }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.85)' }}>上架中</span>}
              value={activeCount}
              prefix={<CheckCircleOutlined style={{ color: '#fff' }} />}
              valueStyle={{ color: '#fff', fontSize: 28, fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            style={{
              borderRadius: 12,
              background: 'linear-gradient(135deg, #722ed1 0%, #9254de 100%)',
              border: 'none',
            }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.85)' }}>已下架</span>}
              value={inactiveCount}
              prefix={<PauseCircleOutlined style={{ color: '#fff' }} />}
              valueStyle={{ color: '#fff', fontSize: 28, fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            style={{
              borderRadius: 12,
              background: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)',
              border: 'none',
            }}
          >
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.85)' }}>总销量</span>}
              value={totalSales}
              prefix={<AppstoreOutlined style={{ color: '#fff' }} />}
              valueStyle={{ color: '#fff', fontSize: 28, fontWeight: 600 }}
            />
          </Card>
        </Col>
      </Row>

      {/* 主要内容卡片 */}
      <Card
        style={{
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}
        styles={{ body: { padding: '24px' } }}
      >
        {/* 操作栏 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <Space size={12} wrap>
            <Input
              placeholder="搜索服务名称"
              prefix={<SearchOutlined style={{ color: '#999' }} />}
              style={{ width: 240, borderRadius: 20 }}
              allowClear
              onChange={(e) => handleSearch(e.target.value)}
            />
            <Select
              placeholder="服务分类"
              style={{ width: 140, borderRadius: 20 }}
              allowClear
              value={categoryFilter}
              onChange={setCategoryFilter}
              options={categoryOptions}
            />
            <Select
              placeholder="状态筛选"
              style={{ width: 140, borderRadius: 20 }}
              allowClear
              value={statusFilter}
              onChange={setStatusFilter}
              options={statusOptions}
            />
            <Button
              icon={<ReloadOutlined />}
              onClick={handleReset}
              style={{ borderRadius: 20 }}
            >
              重置
            </Button>
          </Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalVisible(true)}
            style={{
              borderRadius: 20,
              background: 'linear-gradient(135deg, #FF6B35 0%, #FF8555 100%)',
              border: 'none',
              height: 40,
              paddingLeft: 24,
              paddingRight: 24,
              boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
            }}
          >
            新增服务
          </Button>
        </div>

        {/* 错误提示 */}
        {error && (
          <div
            style={{
              padding: '12px 16px',
              background: '#fff2f0',
              border: '1px solid #ffccc7',
              borderRadius: 8,
              color: '#ff4d4f',
              marginBottom: 16,
            }}
          >
            {error}
          </div>
        )}

        {/* 服务列表 */}
        {filteredList.length === 0 && !loading ? (
          <Empty
            description="暂无服务数据"
            style={{ padding: '60px 0' }}
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setCreateModalVisible(true)}
              style={{
                borderRadius: 20,
                background: 'linear-gradient(135deg, #FF6B35 0%, #FF8555 100%)',
                border: 'none',
              }}
            >
              创建第一个服务
            </Button>
          </Empty>
        ) : (
          <ServiceList
            loading={loading}
            onEdit={handleEdit}
            onView={handleView}
          />
        )}
      </Card>

      {/* 新增服务模态框 */}
      <ServiceModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
      />

      {/* 编辑服务模态框 */}
      <ServiceModal
        visible={editModalVisible}
        onClose={() => {
          setEditModalVisible(false);
          setSelectedService(null);
        }}
        service={selectedService}
      />

      {/* 查看服务详情模态框 */}
      {selectedService && (
        <ServiceModal
          visible={viewModalVisible}
          onClose={() => {
            setViewModalVisible(false);
            setSelectedService(null);
          }}
          service={selectedService}
          readOnly
        />
      )}
    </div>
  );
};

export default MerchantServices;
