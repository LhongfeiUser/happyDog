import React, { useEffect } from 'react';
import { Form, Input, Upload, Button, message, Card } from 'antd';
import { UploadOutlined, FileProtectOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { updateMerchantInfoAsync } from '../../../store/slices/merchantAuthSlice';

const QualificationForm: React.FC = () => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { merchant, loading } = useAppSelector((state) => state.merchantAuth);

  useEffect(() => {
    if (merchant) {
      form.setFieldsValue({
        businessLicense: merchant.businessLicense,
        businessLicenseImage: merchant.businessLicenseImage,
      });
    }
  }, [merchant, form]);

  const handleSubmit = async (values: any) => {
    try {
      await dispatch(updateMerchantInfoAsync({
        businessLicense: values.businessLicense,
        businessLicenseImage: values.businessLicenseImage,
      })).unwrap();
      message.success('营业资质保存成功！');
    } catch (error: any) {
      message.error(error || '保存失败，请重试');
    }
  };

  const handleReset = () => {
    if (merchant) {
      form.setFieldsValue({
        businessLicense: merchant.businessLicense,
        businessLicenseImage: merchant.businessLicenseImage,
      });
    }
  };

  const uploadProps = {
    name: 'file',
    action: '/api/upload',
    headers: {
      authorization: 'authorization-text',
    },
    maxCount: 1,
    onChange(info: any) {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 上传成功`);
        form.setFieldsValue({ businessLicenseImage: info.file.response?.url || '' });
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败`);
      }
    },
  };

  return (
    <Card title="营业资质" bordered={false}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="businessLicense"
          label="营业执照号"
          rules={[
            { required: true, message: '请输入营业执照号' },
            { min: 15, max: 20, message: '营业执照号长度为15-20位' },
            { pattern: /^[0-9A-Z]{15,20}$/, message: '营业执照号只能包含数字和大写字母' },
          ]}
        >
          <Input
            prefix={<FileProtectOutlined />}
            placeholder="请输入营业执照号"
            size="large"
            style={{ borderRadius: 8 }}
          />
        </Form.Item>

        <Form.Item
          name="businessLicenseImage"
          label="营业执照图片"
          extra="支持 JPG、PNG 格式，文件大小不超过 5MB"
        >
          <Upload {...uploadProps} listType="picture-card">
            <div style={{ textAlign: 'center' }}>
              <UploadOutlined />
              <div style={{ marginTop: 8 }}>上传营业执照</div>
            </div>
          </Upload>
        </Form.Item>

        <Form.Item style={{ marginTop: 32 }}>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <Button
              onClick={handleReset}
              size="large"
              style={{ borderRadius: 8, minWidth: 100 }}
            >
              取消
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              style={{
                borderRadius: 8,
                minWidth: 120,
                backgroundColor: '#FF6B35',
                borderColor: '#FF6B35',
              }}
            >
              保存
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default QualificationForm;
