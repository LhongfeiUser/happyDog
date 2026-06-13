import React from 'react';
import { Form, Input, InputNumber, Select, Upload, Button, Space } from 'antd';
import { PlusOutlined, UploadOutlined, MinusCircleOutlined } from '@ant-design/icons';
import type { MerchantService } from '../../../types';

const { TextArea } = Input;
const { Option } = Select;

interface ServiceFormProps {
  form: any;
  initialValues?: Partial<MerchantService>;
  onFinish: (values: any) => void;
  loading?: boolean;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ form, initialValues, onFinish, loading = false }) => {
  // 服务分类选项
  const categoryOptions = [
    { value: 'wash', label: '洗护' },
    { value: 'grooming', label: '美容' },
    { value: 'boarding', label: '寄养' },
    { value: 'feeding', label: '喂养' },
  ];

  // 上传图片配置
  const uploadProps = {
    name: 'file',
    action: '/api/upload',
    headers: {
      authorization: 'authorization-text',
    },
    listType: 'picture-card' as const,
    maxCount: 5,
    beforeUpload: (file: File) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        return false;
      }
      return true;
    },
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={initialValues}
      preserve={false}
    >
      <Form.Item
        name="name"
        label="服务名称"
        rules={[
          { required: true, message: '请输入服务名称' },
          { min: 2, message: '服务名称至少2个字符' },
          { max: 50, message: '服务名称不超过50个字符' },
        ]}
      >
        <Input
          placeholder="请输入服务名称"
          maxLength={50}
          showCount
          style={{ borderRadius: 8 }}
        />
      </Form.Item>

      <Form.Item
        name="category"
        label="服务分类"
        rules={[{ required: true, message: '请选择服务分类' }]}
      >
        <Select
          placeholder="请选择服务分类"
          style={{ width: '100%', borderRadius: 8 }}
          dropdownStyle={{ borderRadius: 8 }}
        >
          {categoryOptions.map(option => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="price"
        label="服务价格（元）"
        rules={[
          { required: true, message: '请输入服务价格' },
          { type: 'number', min: 0.01, message: '价格必须大于0' },
          { type: 'number', max: 99999, message: '价格不能超过99999元' },
        ]}
      >
        <InputNumber
          placeholder="请输入服务价格"
          style={{ width: '100%', borderRadius: 8 }}
          precision={2}
          min={0.01}
          max={99999}
          addonAfter="元"
        />
      </Form.Item>

      <Form.Item
        name="duration"
        label="服务时长（分钟）"
        rules={[
          { required: true, message: '请输入服务时长' },
          { type: 'number', min: 1, message: '时长必须大于0' },
          { type: 'number', max: 1440, message: '时长不能超过1440分钟（24小时）' },
        ]}
      >
        <InputNumber
          placeholder="请输入服务时长"
          style={{ width: '100%', borderRadius: 8 }}
          min={1}
          max={1440}
          addonAfter="分钟"
        />
      </Form.Item>

      <Form.Item
        name="description"
        label="服务描述"
        rules={[
          { required: true, message: '请输入服务描述' },
          { min: 10, message: '描述至少10个字符' },
          { max: 500, message: '描述不超过500个字符' },
        ]}
      >
        <TextArea
          placeholder="请输入服务描述"
          rows={4}
          maxLength={500}
          showCount
          style={{ borderRadius: 8 }}
        />
      </Form.Item>

      <Form.Item
        name="images"
        label="服务图片"
        tooltip="最多可上传5张图片，单张图片不超过2MB"
      >
        <Upload {...uploadProps} fileList={initialValues?.images || []}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0' }}>
            <PlusOutlined style={{ fontSize: 24, color: '#999' }} />
            <div style={{ marginTop: 8, color: '#999' }}>上传图片</div>
          </div>
        </Upload>
      </Form.Item>

      <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
          <Button
            htmlType="button"
            onClick={() => form.resetFields()}
            style={{ borderRadius: 20, minWidth: 100 }}
          >
            重置
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{
              borderRadius: 20,
              minWidth: 100,
              background: 'linear-gradient(135deg, #FF6B35 0%, #FF8555 100%)',
              border: 'none',
            }}
          >
            提交
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default ServiceForm;
