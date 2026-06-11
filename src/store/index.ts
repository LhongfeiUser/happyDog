import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import petsReducer from './slices/petsSlice';
import servicesReducer from './slices/servicesSlice';
import ordersReducer from './slices/ordersSlice';
import reviewsReducer from './slices/reviewsSlice';
import afterSalesReducer from './slices/afterSalesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    pets: petsReducer,
    services: servicesReducer,
    orders: ordersReducer,
    reviews: reviewsReducer,
    afterSales: afterSalesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
