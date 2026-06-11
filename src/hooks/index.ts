import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState, AppDispatch } from '../store';
import { getCurrentUserAsync } from '../store/slices/authSlice';

// 使用Redux dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();

// 使用Redux selector
export const useAppSelector = <T>(selector: (state: RootState) => T): T => {
  return useSelector(selector);
};

// 使用认证状态
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, token, loading, error } = useAppSelector(state => state.auth);

  useEffect(() => {
    if (token && !user) {
      dispatch(getCurrentUserAsync());
    }
  }, [dispatch, token, user]);

  const isAuthenticated = !!token && !!user;

  const requireAuth = useCallback(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return false;
    }
    return true;
  }, [isAuthenticated, navigate]);

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    requireAuth,
  };
};

// 使用宠物列表
export const usePets = () => {
  const { list, loading, error } = useAppSelector(state => state.pets);
  return { pets: list, loading, error };
};

// 使用当前宠物（默认宠物）
export const useCurrentPet = () => {
  const { list } = useAppSelector(state => state.pets);
  const currentPet = list.find(p => p.isDefault) || list[0] || null;
  return currentPet;
};

// 使用服务列表
export const useServices = () => {
  const { list, recommendList, categories, loading, error } = useAppSelector(state => state.services);
  return { services: list, recommendServices: recommendList, categories, loading, error };
};

// 使用订单列表
export const useOrders = () => {
  const { list, loading, error } = useAppSelector(state => state.orders);
  return { orders: list, loading, error };
};

// 使用评价列表
export const useReviews = () => {
  const { list, serviceReviews, loading, error } = useAppSelector(state => state.reviews);
  return { reviews: list, serviceReviews, loading, error };
};

// 使用售后列表
export const useAfterSales = () => {
  const { list, loading, error } = useAppSelector(state => state.afterSales);
  return { afterSalesList: list, loading, error };
};

// 使用加载状态
export const useLoading = () => {
  const authLoading = useAppSelector(state => state.auth.loading);
  const petsLoading = useAppSelector(state => state.pets.loading);
  const servicesLoading = useAppSelector(state => state.services.loading);
  const ordersLoading = useAppSelector(state => state.orders.loading);
  const reviewsLoading = useAppSelector(state => state.reviews.loading);
  const afterSalesLoading = useAppSelector(state => state.afterSales.loading);

  return authLoading || petsLoading || servicesLoading || ordersLoading || reviewsLoading || afterSalesLoading;
};

// 使用页面标题
export const usePageTitle = (title: string) => {
  useEffect(() => {
    document.title = `${title} - 宠物服务平台`;
  }, [title]);
};

// 使用返回按钮
export const useBack = () => {
  const navigate = useNavigate();
  return useCallback(() => {
    navigate(-1);
  }, [navigate]);
};
