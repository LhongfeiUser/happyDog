import React, { useEffect, useState } from 'react';
import { Typography, Card, Button, Tag, Modal, Form, Input, Select, InputNumber, Switch, message, Empty, Popconfirm, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, HeartOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { getPetsAsync, addPetAsync, updatePetAsync, deletePetAsync, setDefaultPetAsync } from '../../store/slices/petsSlice';
import { formatPetSpecies, formatPetGender } from '../../utils';
import type { Pet } from '../../types';

const { Title, Text } = Typography;

const Pets: React.FC = () => {
  const dispatch = useAppDispatch();
  const { list, loading } = useAppSelector(state => state.pets);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(getPetsAsync());
  }, [dispatch]);

  const handleAdd = () => {
    setEditingPet(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (pet: Pet) => {
    setEditingPet(pet);
    form.setFieldsValue({
      ...pet,
      vaccineRecords: pet.vaccineRecords,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deletePetAsync(id)).unwrap();
      message.success('删除成功');
    } catch (error) {
      message.error('删除失败：' + error);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await dispatch(setDefaultPetAsync(id)).unwrap();
      message.success('设置成功');
    } catch (error) {
      message.error('设置失败：' + error);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingPet) {
        await dispatch(updatePetAsync({ id: editingPet.id, data: values })).unwrap();
        message.success('更新成功');
      } else {
        await dispatch(addPetAsync(values)).unwrap();
        message.success('添加成功');
      }
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('操作失败：' + error);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <Title level={2} style={{ marginBottom: 8 }}>
            🐾 我的宠物
          </Title>
          <Text type="secondary">管理您的宠物档案</Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
          style={{
            borderRadius: 20,
            background: 'linear-gradient(135deg, #FF6B35 0%, #FF8555 100%)',
            border: 'none',
          }}
        >
          添加宠物
        </Button>
      </div>

      {list.length === 0 ? (
        <Empty
          description="还没有添加宠物"
          style={{ padding: 100 }}
        >
          <Button type="primary" onClick={handleAdd} style={{ borderRadius: 20 }}>
            添加第一只宠物
          </Button>
        </Empty>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {list.map(pet => (
            <Card
                style={{
                  borderRadius: 16,
                  boxShadow: pet.isDefault ? '0 4px 16px rgba(255, 107, 53, 0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
                  border: pet.isDefault ? '2px solid #FF6B35' : 'none',
                }}
              >
                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                  <div
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: '#FFF3E0',
                      margin: '0 auto 12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 40,
                    }}
                  >
                    {pet.species === 'dog' ? '🐕' : pet.species === 'cat' ? '🐱' : '🐾'}
                  </div>
                  <Title level={4} style={{ marginBottom: 4 }}>
                    {pet.name}
                    {pet.isDefault && (
                      <Tag color="orange" style={{ marginLeft: 8, borderRadius: 12 }}>
                        默认
                      </Tag>
                    )}
                  </Title>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <Space wrap>
                    <Tag>{formatPetSpecies(pet.species)}</Tag>
                    <Tag>{pet.breed}</Tag>
                    <Tag>{formatPetGender(pet.gender)}</Tag>
                    <Tag>{pet.age}岁</Tag>
                    <Tag>{pet.weight}kg</Tag>
                    {pet.isNeutered && <Tag color="green">已绝育</Tag>}
                  </Space>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Space>
                    <Button
                      icon={<EditOutlined />}
                      onClick={() => handleEdit(pet)}
                      style={{ borderRadius: 20 }}
                    >
                      编辑
                    </Button>
                    {!pet.isDefault && (
                      <Button
                        icon={<HeartOutlined />}
                        onClick={() => handleSetDefault(pet.id)}
                        style={{ borderRadius: 20 }}
                      >
                        设为默认
                      </Button>
                    )}
                  </Space>
                  <Popconfirm
                    title="确定删除这只宠物吗？"
                    onConfirm={() => handleDelete(pet.id)}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      style={{ borderRadius: 20 }}
                    >
                      删除
                    </Button>
                  </Popconfirm>
                </div>
              </Card>
          ))}
        </div>
      )}

      {/* 添加/编辑宠物弹窗 */}
      <Modal
        title={editingPet ? '编辑宠物' : '添加宠物'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="宠物名称"
            rules={[{ required: true, message: '请输入宠物名称' }]}
          >
            <Input placeholder="请输入宠物名称" />
          </Form.Item>

          <div className="grid grid-cols-3 gap-4">
            <Form.Item
              name="species"
              label="宠物种类"
              rules={[{ required: true, message: '请选择宠物种类' }]}
            >
              <Select placeholder="请选择">
                <Select.Option value="dog">狗狗</Select.Option>
                <Select.Option value="cat">猫咪</Select.Option>
                <Select.Option value="other">其他</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="breed"
              label="品种"
              rules={[{ required: true, message: '请输入品种' }]}
            >
              <Input placeholder="如：金毛" />
            </Form.Item>
            <Form.Item
              name="gender"
              label="性别"
              rules={[{ required: true, message: '请选择性别' }]}
            >
              <Select placeholder="请选择">
                <Select.Option value="male">公</Select.Option>
                <Select.Option value="female">母</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Form.Item
              name="age"
              label="年龄"
              rules={[{ required: true, message: '请输入年龄' }]}
            >
              <InputNumber min={0} max={30} placeholder="岁" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="weight"
              label="体重"
              rules={[{ required: true, message: '请输入体重' }]}
            >
              <InputNumber min={0} max={100} placeholder="kg" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="isNeutered"
              label="是否绝育"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </div>

          <Form.Item
            name="medicalHistory"
            label="病史"
          >
            <Input.TextArea rows={2} placeholder="请输入病史（选填）" />
          </Form.Item>

          <Form.Item
            name="allergies"
            label="过敏信息"
          >
            <Input placeholder="请输入过敏信息（选填）" />
          </Form.Item>

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setModalVisible(false)} style={{ borderRadius: 20 }}>
                取消
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{
                  borderRadius: 20,
                  background: 'linear-gradient(135deg, #FF6B35 0%, #FF8555 100%)',
                  border: 'none',
                }}
              >
                {editingPet ? '更新' : '添加'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Pets;
