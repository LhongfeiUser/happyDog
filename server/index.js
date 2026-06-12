const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'pet-service-platform-secret-key';

// 中间件
app.use(cors());
app.use(express.json());

// 内存数据存储
const data = {
  users: [
    {
      id: 'user-001',
      phone: '13800138000',
      password: '123456',
      nickname: '爱宠达人',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
      createTime: '2026-01-01T00:00:00.000Z',
      updateTime: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'user-002',
      phone: '13900139000',
      password: '123456',
      nickname: '猫咪主人',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
      createTime: '2026-01-15T00:00:00.000Z',
      updateTime: '2026-01-15T00:00:00.000Z',
    },
  ],
  pets: [
    {
      id: 'pet-001',
      userId: 'user-001',
      name: '旺财',
      species: 'dog',
      breed: '金毛寻回犬',
      age: 3,
      gender: 'male',
      weight: 30,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dog1',
      isNeutered: true,
      vaccineRecords: JSON.stringify([
        { name: '狂犬疫苗', date: '2025-06-01' },
        { name: '六联疫苗', date: '2025-05-01' },
      ]),
      medicalHistory: '无重大疾病史',
      allergies: '无',
      isDefault: true,
      createTime: '2026-01-05T00:00:00.000Z',
      updateTime: '2026-01-05T00:00:00.000Z',
    },
    {
      id: 'pet-002',
      userId: 'user-001',
      name: '咪咪',
      species: 'cat',
      breed: '英国短毛猫',
      age: 2,
      gender: 'female',
      weight: 4,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cat1',
      isNeutered: false,
      vaccineRecords: JSON.stringify([{ name: '猫三联', date: '2025-07-01' }]),
      medicalHistory: '无',
      allergies: '无',
      isDefault: false,
      createTime: '2026-01-10T00:00:00.000Z',
      updateTime: '2026-01-10T00:00:00.000Z',
    },
  ],
  services: [
    {
      id: 'service-001',
      merchantId: 'merchant-001',
      name: '基础洗护套餐',
      category: 'wash',
      description: '包含洗澡、吹干、基础毛发护理，适合短毛犬猫',
      price: 9800,
      duration: 60,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400',
      ]),
      rating: 4.8,
      salesCount: 1256,
      status: 'active',
      createTime: '2026-01-01T00:00:00.000Z',
      updateTime: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'service-002',
      merchantId: 'merchant-001',
      name: '精致洗护套餐',
      category: 'wash',
      description: '包含药浴、深层清洁、毛发护理、指甲修剪、耳道清洁',
      price: 16800,
      duration: 90,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=400',
      ]),
      rating: 4.9,
      salesCount: 892,
      status: 'active',
      createTime: '2026-01-01T00:00:00.000Z',
      updateTime: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'service-003',
      merchantId: 'merchant-001',
      name: '大型犬洗护',
      category: 'wash',
      description: '专为大型犬设计，包含洗澡、吹干、毛发护理',
      price: 15800,
      duration: 90,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400',
      ]),
      rating: 4.7,
      salesCount: 567,
      status: 'active',
      createTime: '2026-01-01T00:00:00.000Z',
      updateTime: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'service-004',
      merchantId: 'merchant-001',
      name: '基础造型套餐',
      category: 'grooming',
      description: '包含洗澡、造型修剪、指甲修剪',
      price: 19800,
      duration: 120,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400',
      ]),
      rating: 4.9,
      salesCount: 723,
      status: 'active',
      createTime: '2026-01-01T00:00:00.000Z',
      updateTime: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'service-005',
      merchantId: 'merchant-001',
      name: '精致造型套餐',
      category: 'grooming',
      description: '包含洗澡、创意造型、染色、SPA护理',
      price: 35800,
      duration: 180,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=400',
      ]),
      rating: 5.0,
      salesCount: 234,
      status: 'active',
      createTime: '2026-01-01T00:00:00.000Z',
      updateTime: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'service-006',
      merchantId: 'merchant-001',
      name: '标准寄养（每天）',
      category: 'boarding',
      description: '独立空间、每日遛弯2次、基础护理',
      price: 12800,
      duration: 1440,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400',
      ]),
      rating: 4.8,
      salesCount: 456,
      status: 'active',
      createTime: '2026-01-01T00:00:00.000Z',
      updateTime: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'service-007',
      merchantId: 'merchant-001',
      name: '豪华寄养（每天）',
      category: 'boarding',
      description: '豪华套房、每日遛弯3次、视频监控、专属护理',
      price: 22800,
      duration: 1440,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400',
      ]),
      rating: 4.9,
      salesCount: 189,
      status: 'active',
      createTime: '2026-01-01T00:00:00.000Z',
      updateTime: '2026-01-01T00:00:00.000Z',
    },
  ],
  orders: [
    {
      id: 'order-001',
      orderNo: 'PS202606010001',
      userId: 'user-001',
      petId: 'pet-001',
      serviceId: 'service-001',
      serviceName: '基础洗护套餐',
      serviceCategory: 'wash',
      serviceImage: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400',
      petName: '旺财',
      status: 'completed',
      totalPrice: 9800,
      appointmentDate: '2026-06-10',
      appointmentTime: '10:00-11:00',
      address: '北京市朝阳区宠物街123号',
      contactPhone: '13800138000',
      remark: '请温柔对待',
      createTime: '2026-06-01T10:00:00.000Z',
      payTime: '2026-06-01T10:05:00.000Z',
      completeTime: '2026-06-10T11:00:00.000Z',
      cancelTime: null,
      updateTime: '2026-06-10T11:00:00.000Z',
    },
  ],
  reviews: [
    {
      id: 'review-001',
      orderId: 'order-001',
      userId: 'user-001',
      serviceId: 'service-001',
      rating: 5,
      content: '服务非常专业，我家旺财洗完澡后毛发柔顺有光泽，工作人员也很温柔！',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200',
      ]),
      createTime: '2026-06-10T12:00:00.000Z',
      updateTime: '2026-06-10T12:00:00.000Z',
    },
  ],
  afterSales: [],
};

// JWT验证中间件
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.json({
      code: 1003,
      message: '未登录',
      data: null,
      timestamp: Date.now(),
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.json({
      code: 1003,
      message: 'token无效',
      data: null,
      timestamp: Date.now(),
    });
  }
};

// 生成订单号
const generateOrderNo = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');
  return `PS${year}${month}${day}${random}`;
};

// ==================== 认证接口 ====================

// 登录
app.post('/api/auth/login', (req, res) => {
  const { phone, password } = req.body;

  const user = data.users.find(
    (u) => u.phone === phone && u.password === password
  );

  if (!user) {
    return res.json({
      code: 1001,
      message: '手机号或密码错误',
      data: null,
      timestamp: Date.now(),
    });
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
  const { password: _, ...userWithoutPassword } = user;

  res.json({
    code: 0,
    message: 'success',
    data: { token, user: userWithoutPassword },
    timestamp: Date.now(),
  });
});

// 注册
app.post('/api/auth/register', (req, res) => {
  const { phone, password, nickname } = req.body;

  const existingUser = data.users.find((u) => u.phone === phone);
  if (existingUser) {
    return res.json({
      code: 1002,
      message: '该手机号已注册',
      data: null,
      timestamp: Date.now(),
    });
  }

  const now = new Date().toISOString();
  const newUser = {
    id: `user_${uuidv4()}`,
    phone,
    password,
    nickname,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${nickname}`,
    createTime: now,
    updateTime: now,
  };

  data.users.push(newUser);

  const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, {
    expiresIn: '7d',
  });
  const { password: _, ...userWithoutPassword } = newUser;

  res.json({
    code: 0,
    message: 'success',
    data: { token, user: userWithoutPassword },
    timestamp: Date.now(),
  });
});

// 获取当前用户信息
app.get('/api/user/profile', authMiddleware, (req, res) => {
  const user = data.users.find((u) => u.id === req.userId);

  if (!user) {
    return res.json({
      code: 1003,
      message: '用户不存在',
      data: null,
      timestamp: Date.now(),
    });
  }

  const { password: _, ...userWithoutPassword } = user;

  res.json({
    code: 0,
    message: 'success',
    data: userWithoutPassword,
    timestamp: Date.now(),
  });
});

// ==================== 宠物接口 ====================

// 获取宠物列表
app.get('/api/pets', authMiddleware, (req, res) => {
  const userPets = data.pets.filter((p) => p.userId === req.userId);

  res.json({
    code: 0,
    message: 'success',
    data: userPets,
    timestamp: Date.now(),
  });
});

// 获取宠物详情
app.get('/api/pets/:id', authMiddleware, (req, res) => {
  const pet = data.pets.find((p) => p.id === req.params.id);

  if (!pet) {
    return res.json({
      code: 2001,
      message: '宠物不存在',
      data: null,
      timestamp: Date.now(),
    });
  }

  res.json({
    code: 0,
    message: 'success',
    data: pet,
    timestamp: Date.now(),
  });
});

// 添加宠物
app.post('/api/pets', authMiddleware, (req, res) => {
  const now = new Date().toISOString();
  const newPet = {
    id: `pet_${uuidv4()}`,
    userId: req.userId,
    ...req.body,
    avatar:
      req.body.avatar ||
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${req.body.name}`,
    isDefault: data.pets.filter((p) => p.userId === req.userId).length === 0,
    createTime: now,
    updateTime: now,
  };

  data.pets.push(newPet);

  res.json({
    code: 0,
    message: 'success',
    data: newPet,
    timestamp: Date.now(),
  });
});

// 更新宠物
app.put('/api/pets/:id', authMiddleware, (req, res) => {
  const petIndex = data.pets.findIndex((p) => p.id === req.params.id);

  if (petIndex === -1) {
    return res.json({
      code: 2001,
      message: '宠物不存在',
      data: null,
      timestamp: Date.now(),
    });
  }

  data.pets[petIndex] = {
    ...data.pets[petIndex],
    ...req.body,
    updateTime: new Date().toISOString(),
  };

  res.json({
    code: 0,
    message: 'success',
    data: data.pets[petIndex],
    timestamp: Date.now(),
  });
});

// 删除宠物
app.delete('/api/pets/:id', authMiddleware, (req, res) => {
  const petIndex = data.pets.findIndex((p) => p.id === req.params.id);

  if (petIndex === -1) {
    return res.json({
      code: 2001,
      message: '宠物不存在',
      data: null,
      timestamp: Date.now(),
    });
  }

  data.pets.splice(petIndex, 1);

  res.json({
    code: 0,
    message: 'success',
    data: null,
    timestamp: Date.now(),
  });
});

// 设置默认宠物
app.put('/api/pets/:id/default', authMiddleware, (req, res) => {
  // 取消当前默认宠物
  data.pets.forEach((p) => {
    if (p.userId === req.userId) {
      p.isDefault = false;
    }
  });

  // 设置新的默认宠物
  const pet = data.pets.find(
    (p) => p.id === req.params.id && p.userId === req.userId
  );
  if (pet) {
    pet.isDefault = true;
  }

  res.json({
    code: 0,
    message: 'success',
    data: null,
    timestamp: Date.now(),
  });
});

// ==================== 服务接口 ====================

// 获取服务列表
app.get('/api/services', (req, res) => {
  const { category, page = 1, pageSize = 10 } = req.query;

  let filteredServices = data.services.filter((s) => s.status === 'active');

  if (category) {
    filteredServices = filteredServices.filter((s) => s.category === category);
  }

  const start = (page - 1) * pageSize;
  const end = start + parseInt(pageSize);
  const list = filteredServices.slice(start, end);

  res.json({
    code: 0,
    message: 'success',
    data: {
      list,
      total: filteredServices.length,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
    },
    timestamp: Date.now(),
  });
});

// 获取服务详情
app.get('/api/services/:id', (req, res) => {
  const service = data.services.find((s) => s.id === req.params.id);

  if (!service) {
    return res.json({
      code: 3001,
      message: '服务不存在',
      data: null,
      timestamp: Date.now(),
    });
  }

  res.json({
    code: 0,
    message: 'success',
    data: service,
    timestamp: Date.now(),
  });
});

// 获取推荐服务
app.get('/api/services/recommend/list', (req, res) => {
  const { limit = 4 } = req.query;

  const sortedServices = [...data.services]
    .filter((s) => s.status === 'active')
    .sort((a, b) => b.salesCount - a.salesCount)
    .slice(0, parseInt(limit));

  res.json({
    code: 0,
    message: 'success',
    data: sortedServices,
    timestamp: Date.now(),
  });
});

// 获取服务分类
app.get('/api/services/categories/list', (req, res) => {
  const categories = [
    { category: 'wash', count: 0, label: '洗护' },
    { category: 'grooming', count: 0, label: '美容' },
    { category: 'boarding', count: 0, label: '寄养' },
  ];

  data.services.forEach((s) => {
    if (s.status === 'active') {
      const cat = categories.find((c) => c.category === s.category);
      if (cat) {
        cat.count++;
      }
    }
  });

  res.json({
    code: 0,
    message: 'success',
    data: categories,
    timestamp: Date.now(),
  });
});

// ==================== 订单接口 ====================

// 创建订单
app.post('/api/orders', authMiddleware, (req, res) => {
  const { serviceId, petId, appointmentDate, appointmentTime, address, contactPhone, remark } = req.body;

  const service = data.services.find((s) => s.id === serviceId);
  if (!service) {
    return res.json({
      code: 3001,
      message: '服务不存在',
      data: null,
      timestamp: Date.now(),
    });
  }

  const pet = data.pets.find((p) => p.id === petId);
  if (!pet) {
    return res.json({
      code: 2001,
      message: '宠物不存在',
      data: null,
      timestamp: Date.now(),
    });
  }

  const now = new Date().toISOString();
  const newOrder = {
    id: `order_${uuidv4()}`,
    orderNo: generateOrderNo(),
    userId: req.userId,
    petId,
    serviceId,
    serviceName: service.name,
    serviceCategory: service.category,
    serviceImage: JSON.parse(service.images)[0] || '',
    petName: pet.name,
    status: 'pending_payment',
    totalPrice: service.price,
    appointmentDate,
    appointmentTime,
    address,
    contactPhone,
    remark: remark || '',
    createTime: now,
    payTime: null,
    completeTime: null,
    cancelTime: null,
    updateTime: now,
  };

  data.orders.push(newOrder);

  res.json({
    code: 0,
    message: 'success',
    data: newOrder,
    timestamp: Date.now(),
  });
});

// 获取订单列表
app.get('/api/orders', authMiddleware, (req, res) => {
  const { status, page = 1, pageSize = 10 } = req.query;

  let filteredOrders = data.orders.filter((o) => o.userId === req.userId);

  if (status) {
    filteredOrders = filteredOrders.filter((o) => o.status === status);
  }

  // 按创建时间倒序
  filteredOrders.sort(
    (a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
  );

  const start = (page - 1) * pageSize;
  const end = start + parseInt(pageSize);
  const list = filteredOrders.slice(start, end);

  res.json({
    code: 0,
    message: 'success',
    data: {
      list,
      total: filteredOrders.length,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
    },
    timestamp: Date.now(),
  });
});

// 获取订单详情
app.get('/api/orders/:id', authMiddleware, (req, res) => {
  const order = data.orders.find((o) => o.id === req.params.id);

  if (!order) {
    return res.json({
      code: 4001,
      message: '订单不存在',
      data: null,
      timestamp: Date.now(),
    });
  }

  res.json({
    code: 0,
    message: 'success',
    data: order,
    timestamp: Date.now(),
  });
});

// 支付订单
app.put('/api/orders/:id/pay', authMiddleware, (req, res) => {
  const orderIndex = data.orders.findIndex((o) => o.id === req.params.id);

  if (orderIndex === -1) {
    return res.json({
      code: 4001,
      message: '订单不存在',
      data: null,
      timestamp: Date.now(),
    });
  }

  const order = data.orders[orderIndex];

  if (order.status !== 'pending_payment') {
    return res.json({
      code: 4002,
      message: '订单状态不允许支付',
      data: null,
      timestamp: Date.now(),
    });
  }

  order.status = 'paid';
  order.payTime = new Date().toISOString();
  order.updateTime = new Date().toISOString();

  res.json({
    code: 0,
    message: 'success',
    data: order,
    timestamp: Date.now(),
  });
});

// 取消订单
app.put('/api/orders/:id/cancel', authMiddleware, (req, res) => {
  const orderIndex = data.orders.findIndex((o) => o.id === req.params.id);

  if (orderIndex === -1) {
    return res.json({
      code: 4001,
      message: '订单不存在',
      data: null,
      timestamp: Date.now(),
    });
  }

  const order = data.orders[orderIndex];

  if (!['pending_payment', 'paid'].includes(order.status)) {
    return res.json({
      code: 4003,
      message: '订单状态不允许取消',
      data: null,
      timestamp: Date.now(),
    });
  }

  order.status = 'cancelled';
  order.cancelTime = new Date().toISOString();
  order.updateTime = new Date().toISOString();

  res.json({
    code: 0,
    message: 'success',
    data: order,
    timestamp: Date.now(),
  });
});

// 确认完成
app.put('/api/orders/:id/complete', authMiddleware, (req, res) => {
  const orderIndex = data.orders.findIndex((o) => o.id === req.params.id);

  if (orderIndex === -1) {
    return res.json({
      code: 4001,
      message: '订单不存在',
      data: null,
      timestamp: Date.now(),
    });
  }

  const order = data.orders[orderIndex];

  if (order.status !== 'in_progress') {
    return res.json({
      code: 4004,
      message: '订单状态不允许确认完成',
      data: null,
      timestamp: Date.now(),
    });
  }

  order.status = 'completed';
  order.completeTime = new Date().toISOString();
  order.updateTime = new Date().toISOString();

  res.json({
    code: 0,
    message: 'success',
    data: order,
    timestamp: Date.now(),
  });
});

// ==================== 评价接口 ====================

// 提交评价
app.post('/api/reviews', authMiddleware, (req, res) => {
  const { orderId, rating, content, images } = req.body;

  const order = data.orders.find((o) => o.id === orderId);
  if (!order) {
    return res.json({
      code: 4001,
      message: '订单不存在',
      data: null,
      timestamp: Date.now(),
    });
  }

  // 检查是否已评价
  const existingReview = data.reviews.find((r) => r.orderId === orderId);
  if (existingReview) {
    return res.json({
      code: 5001,
      message: '该订单已评价',
      data: null,
      timestamp: Date.now(),
    });
  }

  const now = new Date().toISOString();
  const newReview = {
    id: `review_${uuidv4()}`,
    orderId,
    userId: req.userId,
    serviceId: order.serviceId,
    rating,
    content,
    images: JSON.stringify(images || []),
    createTime: now,
    updateTime: now,
  };

  data.reviews.push(newReview);

  // 更新订单状态为已评价
  order.status = 'reviewed';
  order.updateTime = now;

  res.json({
    code: 0,
    message: 'success',
    data: newReview,
    timestamp: Date.now(),
  });
});

// 获取服务评价列表
app.get('/api/reviews/service/:serviceId', (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;

  let filteredReviews = data.reviews.filter(
    (r) => r.serviceId === req.params.serviceId
  );

  filteredReviews.sort(
    (a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
  );

  const start = (page - 1) * pageSize;
  const end = start + parseInt(pageSize);
  const list = filteredReviews.slice(start, end);

  res.json({
    code: 0,
    message: 'success',
    data: {
      list,
      total: filteredReviews.length,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
    },
    timestamp: Date.now(),
  });
});

// 获取用户评价列表
app.get('/api/reviews/user', authMiddleware, (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;

  let filteredReviews = data.reviews.filter((r) => r.userId === req.userId);

  filteredReviews.sort(
    (a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
  );

  const start = (page - 1) * pageSize;
  const end = start + parseInt(pageSize);
  const list = filteredReviews.slice(start, end);

  res.json({
    code: 0,
    message: 'success',
    data: {
      list,
      total: filteredReviews.length,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
    },
    timestamp: Date.now(),
  });
});

// 检查订单是否已评价
app.get('/api/reviews/check/:orderId', authMiddleware, (req, res) => {
  const review = data.reviews.find((r) => r.orderId === req.params.orderId);

  res.json({
    code: 0,
    message: 'success',
    data: { reviewed: !!review },
    timestamp: Date.now(),
  });
});

// ==================== 售后接口 ====================

// 提交售后申请
app.post('/api/after-sales', authMiddleware, (req, res) => {
  const { orderId, type, reason, description, images } = req.body;

  const order = data.orders.find((o) => o.id === orderId);
  if (!order) {
    return res.json({
      code: 4001,
      message: '订单不存在',
      data: null,
      timestamp: Date.now(),
    });
  }

  // 检查是否已有售后申请
  const existingAfterSales = data.afterSales.find(
    (a) => a.orderId === orderId && a.status !== 'rejected'
  );
  if (existingAfterSales) {
    return res.json({
      code: 6001,
      message: '该订单已有售后申请',
      data: null,
      timestamp: Date.now(),
    });
  }

  const now = new Date().toISOString();
  const newAfterSales = {
    id: `aftersales_${uuidv4()}`,
    orderId,
    userId: req.userId,
    type,
    reason,
    description,
    images: JSON.stringify(images || []),
    status: 'pending',
    adminReply: '',
    createTime: now,
    updateTime: now,
  };

  data.afterSales.push(newAfterSales);

  // 更新订单状态
  if (type === 'refund') {
    order.status = 'refunding';
    order.updateTime = now;
  }

  res.json({
    code: 0,
    message: 'success',
    data: newAfterSales,
    timestamp: Date.now(),
  });
});

// 获取用户售后列表
app.get('/api/after-sales/user', authMiddleware, (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;

  let filteredAfterSales = data.afterSales.filter(
    (a) => a.userId === req.userId
  );

  filteredAfterSales.sort(
    (a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
  );

  const start = (page - 1) * pageSize;
  const end = start + parseInt(pageSize);
  const list = filteredAfterSales.slice(start, end);

  res.json({
    code: 0,
    message: 'success',
    data: {
      list,
      total: filteredAfterSales.length,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
    },
    timestamp: Date.now(),
  });
});

// 获取售后详情
app.get('/api/after-sales/:id', authMiddleware, (req, res) => {
  const afterSales = data.afterSales.find((a) => a.id === req.params.id);

  if (!afterSales) {
    return res.json({
      code: 6002,
      message: '售后申请不存在',
      data: null,
      timestamp: Date.now(),
    });
  }

  res.json({
    code: 0,
    message: 'success',
    data: afterSales,
    timestamp: Date.now(),
  });
});

// 取消售后申请
app.put('/api/after-sales/:id/cancel', authMiddleware, (req, res) => {
  const afterSalesIndex = data.afterSales.findIndex(
    (a) => a.id === req.params.id
  );

  if (afterSalesIndex === -1) {
    return res.json({
      code: 6002,
      message: '售后申请不存在',
      data: null,
      timestamp: Date.now(),
    });
  }

  const afterSales = data.afterSales[afterSalesIndex];

  if (afterSales.status !== 'pending') {
    return res.json({
      code: 6003,
      message: '只能取消待处理的售后申请',
      data: null,
      timestamp: Date.now(),
    });
  }

  afterSales.status = 'rejected';
  afterSales.adminReply = '用户主动取消';
  afterSales.updateTime = new Date().toISOString();

  // 恢复订单状态
  const order = data.orders.find((o) => o.id === afterSales.orderId);
  if (order && order.status === 'refunding') {
    order.status = 'completed';
    order.updateTime = new Date().toISOString();
  }

  res.json({
    code: 0,
    message: 'success',
    data: afterSales,
    timestamp: Date.now(),
  });
});

// ==================== 数据统计接口 ====================

// 获取数据统计
app.get('/api/statistics', authMiddleware, (req, res) => {
  // 服务分类统计
  const serviceCategories = [
    { category: 'wash', name: '洗护', icon: '🛁', orderCount: 0, percentage: 0 },
    { category: 'grooming', name: '美容', icon: '✂️', orderCount: 0, percentage: 0 },
    { category: 'boarding', name: '寄养', icon: '🏠', orderCount: 0, percentage: 0 },
    { category: 'feeding', name: '上门喂养', icon: '🍽️', orderCount: 0, percentage: 0 },
  ];

  data.orders.forEach((o) => {
    const cat = serviceCategories.find((c) => c.category === o.serviceCategory);
    if (cat) cat.orderCount++;
  });

  const totalOrders = data.orders.length;
  serviceCategories.forEach((c) => {
    c.percentage = totalOrders > 0 ? Math.round((c.orderCount / totalOrders) * 100) : 0;
  });

  // 热门服务排行
  const salesMap = {};
  data.orders.forEach((o) => {
    if (!salesMap[o.serviceId]) {
      const service = data.services.find((s) => s.id === o.serviceId);
      salesMap[o.serviceId] = {
        id: o.serviceId,
        name: o.serviceName,
        price: service?.price ?? o.totalPrice, // 优先取服务原价，兜底用订单金额
        salesCount: 0,
      };
    }
    salesMap[o.serviceId].salesCount++;
  });
  const topServices = Object.values(salesMap)
    .sort((a, b) => b.salesCount - a.salesCount)
    .slice(0, 6);

  // 月度订单趋势（最近8个月）
  const monthlyTrend = [];
  const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
  const now = new Date();
  for (let i = 7; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const count = data.orders.filter((o) => o.createTime.startsWith(monthKey)).length;
    monthlyTrend.push({ month: monthNames[d.getMonth()], orders: count });
  }

  // 用户分析
  const totalUsers = data.users.length;
  const activeUsers = new Set(data.orders.map((o) => o.userId)).size;
  const userOrderCounts = {};
  data.orders.forEach((o) => {
    userOrderCounts[o.userId] = (userOrderCounts[o.userId] || 0) + 1;
  });
  const repeatUsers = Object.values(userOrderCounts).filter((c) => c > 1).length;
  const newUsers = totalUsers - activeUsers;

  // 评分分布
  const ratingDistribution = [
    { rating: 5, count: 0, percentage: 0 },
    { rating: 4, count: 0, percentage: 0 },
    { rating: 3, count: 0, percentage: 0 },
    { rating: 2, count: 0, percentage: 0 },
    { rating: 1, count: 0, percentage: 0 },
  ];
  let totalRating = 0;
  let totalReviews = 0;
  data.reviews.forEach((r) => {
    const item = ratingDistribution.find((item) => item.rating === r.rating);
    if (item) item.count++;
    totalRating += r.rating;
    totalReviews++;
  });
  ratingDistribution.forEach((r) => {
    r.percentage = totalReviews > 0 ? Math.round((r.count / totalReviews) * 100) : 0;
  });

  // 宠物类型分布
  const petTypesMap = {
    dog: { type: 'dog', name: '狗狗', icon: '🐕', count: 0, percentage: 0 },
    cat: { type: 'cat', name: '猫咪', icon: '🐈', count: 0, percentage: 0 },
    other: { type: 'other', name: '其他', icon: '🐰', count: 0, percentage: 0 },
  };
  let totalPets = 0;
  data.pets.forEach((p) => {
    if (petTypesMap[p.species]) {
      petTypesMap[p.species].count++;
      totalPets++;
    }
  });
  Object.values(petTypesMap).forEach((t) => {
    t.percentage = totalPets > 0 ? Math.round((t.count / totalPets) * 100) : 0;
  });
  const petTypes = Object.values(petTypesMap);

  // 服务时段分析
  const timeSlots = [
    { period: '上午', orders: 0, percentage: 0 },
    { period: '下午', orders: 0, percentage: 0 },
    { period: '晚上', orders: 0, percentage: 0 },
  ];
  data.orders.forEach((o) => {
    const hour = parseInt(o.appointmentTime?.split(':')[0] || '0');
    if (hour >= 6 && hour < 12) timeSlots[0].orders++;
    else if (hour >= 12 && hour < 18) timeSlots[1].orders++;
    else timeSlots[2].orders++;
  });
  timeSlots.forEach((s) => {
    s.percentage = totalOrders > 0 ? Math.round((s.orders / totalOrders) * 100) : 0;
  });

  // 总收入
  const totalRevenue = data.orders.reduce((sum, o) => sum + o.totalPrice, 0);

  // 平均评分
  const averageRating = totalReviews > 0 ? parseFloat((totalRating / totalReviews).toFixed(1)) : 0;

  res.json({
    code: 0,
    message: 'success',
    data: {
      totalUsers,
      totalOrders,
      totalRevenue,
      averageRating,
      serviceCategories,
      topServices,
      monthlyTrend,
      userAnalysis: {
        newUsers: Math.max(0, newUsers),
        activeUsers,
        repeatUsers,
      },
      ratingDistribution,
      petTypes,
      timeSlots,
    },
    timestamp: Date.now(),
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🐾 宠物服务平台后端服务已启动`);
  console.log(`📡 地址: http://localhost:${PORT}`);
  console.log(`📋 API文档:`);
  console.log(`   - POST /api/auth/login - 用户登录`);
  console.log(`   - POST /api/auth/register - 用户注册`);
  console.log(`   - GET  /api/user/profile - 获取用户信息`);
  console.log(`   - GET  /api/pets - 获取宠物列表`);
  console.log(`   - POST /api/pets - 添加宠物`);
  console.log(`   - GET  /api/services - 获取服务列表`);
  console.log(`   - GET  /api/services/:id - 获取服务详情`);
  console.log(`   - POST /api/orders - 创建订单`);
  console.log(`   - GET  /api/orders - 获取订单列表`);
  console.log(`   - POST /api/reviews - 提交评价`);
  console.log(`   - POST /api/after-sales - 提交售后申请`);
  console.log(`   - GET  /api/statistics - 获取数据统计`);
});
