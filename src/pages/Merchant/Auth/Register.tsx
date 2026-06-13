import React, { useState } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  Steps,
  Upload,
  message,
  Space,
  Divider,
  Row,
  Col,
} from 'antd';
import {
  ShopOutlined,
  UserOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  CameraOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { merchantRegisterAsync } from '../../../store/slices/merchantAuthSlice';
import { isValidPhone } from '../../../utils';
import type { MerchantRegisterRequest } from '../../../types';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const MerchantRegister: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector(state => state.merchantAuth);
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState<Partial<MerchantRegisterRequest>>({});
  const [form] = Form.useForm();

  // Handle form submission for each step
  const handleNext = async () => {
    try {
      const values = await form.validateFields();
      setFormData({ ...formData, ...values });

      if (current === 2) {
        // Final step - submit registration
        const finalData = { ...formData, ...values } as MerchantRegisterRequest;
        await dispatch(merchantRegisterAsync(finalData)).unwrap();
        message.success('注册成功！请等待审核，即将跳转到登录页...');
        setTimeout(() => {
          navigate('/merchant/login');
        }, 2000);
      } else {
        setCurrent(current + 1);
      }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handlePrev = () => {
    setCurrent(current - 1);
  };

  // Handle file upload for business license
  const handleUpload = (file: File) => {
    // In a real app, you would upload to a server and get back a URL
    // For now, we'll just create a fake base64 string
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setFormData({ ...formData, businessLicenseImage: result });
      message.success('营业执照上传成功');
    };
    reader.readAsDataURL(file);
    return false; // Prevent automatic upload
  };

  // Preview data for step 3
  const previewData = [
    { label: '店铺名称', value: formData.name, icon: <ShopOutlined /> },
    { label: '联系人', value: formData.contactName, icon: <UserOutlined /> },
    { label: '联系电话', value: formData.contactPhone, icon: <PhoneOutlined /> },
    { label: '营业时间', value: formData.businessHours, icon: <ClockCircleOutlined /> },
    { label: '店铺地址', value: formData.address, icon: <EnvironmentOutlined /> },
    { label: '店铺描述', value: formData.description, icon: <FileTextOutlined /> },
    { label: '营业执照号', value: formData.businessLicense, icon: <FileTextOutlined /> },
  ];

  // Form validation rules
  const phoneValidationRules = [
    { required: true, message: '请输入联系电话' },
    { validator: (_: any, value: any) => isValidPhone(value) ? Promise.resolve() : Promise.reject('请输入有效的手机号') },
  ];

  const requiredValidationRules = [
    { required: true, message: '此项为必填项' },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0CC 100%)',
        padding: '40px 20px',
      }}
    >
      <Card
        style={{
          width: 600,
          borderRadius: 20,
          boxShadow: '0 8px 32px rgba(255, 107, 53, 0.2)',
          overflow: 'hidden',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🏪</div>
          <Title level={2} style={{ margin: 0, color: '#FF6B35' }}>
            商家入驻
          </Title>
          <Text type="secondary">填写信息，快速开通商家账号</Text>
        </div>

        <Steps
          current={current}
          style={{ marginBottom: 32 }}
          items={[
            { title: '基本信息' },
            { title: '资质信息' },
            { title: '确认信息' },
          ]}
        />

        <Form
          form={form}
          layout="vertical"
          size="large"
          initialValues={formData}
        >
          {/* Step 1: Basic Information */}
          {current === 0 && (
            <>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    name="name"
                    label="店铺名称"
                    rules={requiredValidationRules}
                  >
                    <Input
                      prefix={<ShopOutlined style={{ color: '#FFB74D' }} />}
                      placeholder="请输入店铺名称"
                      style={{ borderRadius: 12 }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="contactName"
                    label="联系人"
                    rules={requiredValidationRules}
                  >
                    <Input
                      prefix={<UserOutlined style={{ color: '#FFB74D' }} />}
                      placeholder="请输入联系人姓名"
                      style={{ borderRadius: 12 }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="contactPhone"
                    label="联系电话"
                    rules={phoneValidationRules}
                  >
                    <Input
                      prefix={<PhoneOutlined style={{ color: '#FFB74D' }} />}
                      placeholder="请输入联系电话"
                      style={{ borderRadius: 12 }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    name="businessHours"
                    label="营业时间"
                    rules={requiredValidationRules}
                  >
                    <Input
                      prefix={<ClockCircleOutlined style={{ color: '#FFB74D' }} />}
                      placeholder="例如：09:00-21:00"
                      style={{ borderRadius: 12 }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    name="address"
                    label="店铺地址"
                    rules={requiredValidationRules}
                  >
                    <Input
                      prefix={<EnvironmentOutlined style={{ color: '#FFB74D' }} />}
                      placeholder="请输入详细地址"
                      style={{ borderRadius: 12 }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    name="description"
                    label="店铺描述"
                    rules={requiredValidationRules}
                  >
                    <TextArea
                      placeholder="请简要描述您的店铺特色和服务内容"
                      rows={4}
                      style={{ borderRadius: 12 }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}

          {/* Step 2: Qualification Information */}
          {current === 1 && (
            <>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    name="businessLicense"
                    label="营业执照号"
                    rules={requiredValidationRules}
                  >
                    <Input
                      prefix={<FileTextOutlined style={{ color: '#FFB74D' }} />}
                      placeholder="请输入统一社会信用代码"
                      style={{ borderRadius: 12 }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    label="营业执照照片"
                    required
                  >
                    <Upload
                      accept="image/*"
                      beforeUpload={handleUpload}
                      listType="picture-card"
                      maxCount={1}
                      fileList={formData.businessLicenseImage ? [
                        {
                          uid: '-1',
                          name: 'business-license.png',
                          status: 'done',
                          url: formData.businessLicenseImage,
                        }
                      ] : []}
                    >
                      {!formData.businessLicenseImage && (
                        <div>
                          <CameraOutlined style={{ fontSize: 32, color: '#FFB74D' }} />
                          <div style={{ marginTop: 8 }}>上传营业执照</div>
                        </div>
                      )}
                    </Upload>
                    <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 8 }}>
                      请上传清晰的营业执照正本或副本照片，支持 JPG、PNG 格式
                    </Text>
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}

          {/* Step 3: Confirmation */}
          {current === 2 && (
            <>
              <div style={{ background: '#FFF8F0', padding: 16, borderRadius: 12, marginBottom: 24 }}>
                <Title level={4} style={{ color: '#FF6B35', marginBottom: 16 }}>
                  请确认您的信息
                </Title>
                <Space direction="vertical" style={{ width: '100%' }} size={16}>
                  {previewData.map((item, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'flex-start' }}>
                      <div style={{ color: '#FFB74D', marginRight: 8, marginTop: 2 }}>{item.icon}</div>
                      <div>
                        <Text type="secondary" style={{ fontSize: 12 }}>{item.label}</Text>
                        <br />
                        <Text strong>{item.value || '-'}</Text>
                      </div>
                    </div>
                  ))}
                  <Divider style={{ margin: '8px 0' }} />
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    <div style={{ color: '#FFB74D', marginRight: 8, marginTop: 2 }}>
                      <CameraOutlined />
                    </div>
                    <div>
                      <Text type="secondary" style={{ fontSize: 12 }}>营业执照照片</Text>
                      <br />
                      {formData.businessLicenseImage ? (
                        <img
                          src={formData.businessLicenseImage}
                          alt="营业执照"
                          style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8, marginTop: 4 }}
                        />
                      ) : (
                        <Text type="secondary">未上传</Text>
                      )}
                    </div>
                  </div>
                </Space>
              </div>

              <div style={{ background: '#FFF3E0', padding: 16, borderRadius: 12, marginBottom: 24 }}>
                <Space>
                  <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 16 }} />
                  <Paragraph style={{ margin: 0, fontSize: 14 }}>
                    确认信息无误后，点击"提交申请"按钮。我们将在1-3个工作日内完成审核，审核通过后您将收到短信通知。
                  </Paragraph>
                </Space>
              </div>
            </>
          )}

          <Form.Item style={{ marginTop: 24 }}>
            <Space size="large" style={{ width: '100%', justifyContent: 'center' }}>
              {current > 0 && (
                <Button
                  size="large"
                  onClick={handlePrev}
                  style={{ borderRadius: 24, minWidth: 120 }}
                >
                  上一步
                </Button>
              )}
              {current < 2 && (
                <Button
                  type="primary"
                  size="large"
                  onClick={handleNext}
                  style={{
                    borderRadius: 24,
                    minWidth: 120,
                    background: 'linear-gradient(135deg, #FF6B35 0%, #FF8555 100%)',
                    border: 'none',
                  }}
                >
                  下一步
                </Button>
              )}
              {current === 2 && (
                <Button
                  type="primary"
                  size="large"
                  loading={loading}
                  onClick={handleNext}
                  style={{
                    borderRadius: 24,
                    minWidth: 120,
                    fontWeight: 'bold',
                    background: 'linear-gradient(135deg, #FF6B35 0%, #FF8555 100%)',
                    border: 'none',
                  }}
                >
                  提交申请
                </Button>
              )}
            </Space>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Text type="secondary">
            已有商家账号？{' '}
            <Link to="/merchant/login" style={{ color: '#FF6B35', fontWeight: 'bold' }}>
              立即登录
            </Link>
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default MerchantRegister;
