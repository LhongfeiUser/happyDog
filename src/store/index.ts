import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import petsReducer from './slices/petsSlice';
import servicesReducer from './slices/servicesSlice';
import ordersReducer from './slices/ordersSlice';
import reviewsReducer from './slices/reviewsSlice';
import afterSalesReducer from './slices/afterSalesSlice';
import statisticsReducer from './slices/statisticsSlice';

// 商家端 reducers
import merchantAuthReducer from './slices/merchantAuthSlice';
import merchantServicesReducer from './slices/merchantServicesSlice';
import merchantOrdersReducer from './slices/merchantOrdersSlice';
import merchantStatisticsReducer from './slices/merchantStatisticsSlice';

export const store = configureStore({
  reducer: {
    // C端 reducers
    auth: authReducer,
    pets: petsReducer,
    services: servicesReducer,
    orders: ordersReducer,
    reviews: reviewsReducer,
    afterSales: afterSalesReducer,
    statistics: statisticsReducer,
    // 商家端 reducers
    merchantAuth: merchantAuthReducer,
    merchantServices: merchantServicesReducer,
    merchantOrders: merchantOrdersReducer,
    merchantStatistics: merchantStatisticsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
