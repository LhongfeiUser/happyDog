// API服务抽象层
// 当前使用真实API（Node.js后端）

import { authApi, petsApi, servicesApi, ordersApi, reviewsApi, afterSalesApi } from '../real';

// 认证API
export const auth = {
  login: authApi.login,
  register: authApi.register,
  getCurrentUser: authApi.getCurrentUser,
  logout: authApi.logout,
};

// 宠物API
export const pets = {
  getList: petsApi.getPets,
  getById: petsApi.getPetById,
  add: petsApi.addPet,
  update: petsApi.updatePet,
  delete: petsApi.deletePet,
  setDefault: petsApi.setDefaultPet,
};

// 服务API
export const services = {
  getList: servicesApi.getServices,
  getById: servicesApi.getServiceById,
  getRecommend: servicesApi.getRecommendServices,
  getCategories: servicesApi.getServiceCategories,
};

// 订单API
export const orders = {
  create: ordersApi.createOrder,
  getList: ordersApi.getOrders,
  getById: ordersApi.getOrderById,
  pay: ordersApi.payOrder,
  cancel: ordersApi.cancelOrder,
  complete: ordersApi.completeOrder,
};

// 评价API
export const reviews = {
  create: reviewsApi.createReview,
  getServiceReviews: reviewsApi.getServiceReviews,
  getUserReviews: reviewsApi.getUserReviews,
  checkOrderReviewed: reviewsApi.checkOrderReviewed,
};

// 售后API
export const afterSales = {
  create: afterSalesApi.createAfterSales,
  getUserList: afterSalesApi.getUserAfterSales,
  getById: afterSalesApi.getAfterSalesById,
  cancel: afterSalesApi.cancelAfterSales,
};
