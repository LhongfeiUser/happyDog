import axios from 'axios';
import { message } from 'antd';

// 创建axios实例
const request = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 从localStorage获取token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const { data } = response;

    // 如果返回的code不是0，表示有错误
    if (data.code !== 0) {
      // token无效或过期
      if (data.code === 1003) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        message.error('登录已过期，请重新登录');
        return Promise.reject(new Error(data.message));
      }

      message.error(data.message || '请求失败');
      return Promise.reject(new Error(data.message));
    }

    return data;
  },
  (error) => {
    // 网络错误
    if (!error.response) {
      message.error('网络连接失败，请检查网络');
      return Promise.reject(error);
    }

    // HTTP错误状态码
    const { status } = error.response;
    switch (status) {
      case 401:
        localStorage.removeItem('token');
        window.location.href = '/login';
        message.error('登录已过期，请重新登录');
        break;
      case 403:
        message.error('没有权限访问');
        break;
      case 404:
        message.error('请求的资源不存在');
        break;
      case 500:
        message.error('服务器内部错误');
        break;
      default:
        message.error(`请求失败：${status}`);
    }

    return Promise.reject(error);
  }
);

export default request;
