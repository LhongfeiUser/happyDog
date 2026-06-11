import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { Provider } from 'react-redux';
import { store } from './store';
import { theme } from './styles/theme';
import { MainLayout } from './components/layout';
import { Login, Register } from './pages/Auth';
import Home from './pages/Home';
import { ServiceList, ServiceDetail } from './pages/Services';
import { OrderList, OrderDetail, OrderReview } from './pages/Orders';
import Pets from './pages/Pets';
import Profile from './pages/Profile';
import Reviews from './pages/Reviews';
import { AfterSalesList } from './pages/AfterSales';
import { useAuth } from './hooks';
import './styles/global.css';

// 受保护的路由组件
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ConfigProvider theme={theme} locale={zhCN}>
        <BrowserRouter>
          <Routes>
            {/* 登录注册页面（无布局） */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* 主布局 */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="services" element={<ServiceList />} />
              <Route path="services/:id" element={<ServiceDetail />} />
              <Route
                path="orders"
                element={
                  <ProtectedRoute>
                    <OrderList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="orders/:id"
                element={
                  <ProtectedRoute>
                    <OrderDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="orders/:id/review"
                element={
                  <ProtectedRoute>
                    <OrderReview />
                  </ProtectedRoute>
                }
              />
              <Route
                path="pets"
                element={
                  <ProtectedRoute>
                    <Pets />
                  </ProtectedRoute>
                }
              />
              <Route
                path="profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="reviews"
                element={
                  <ProtectedRoute>
                    <Reviews />
                  </ProtectedRoute>
                }
              />
              <Route
                path="after-sales"
                element={
                  <ProtectedRoute>
                    <AfterSalesList />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* 404页面 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ConfigProvider>
    </Provider>
  );
};

export default App;
