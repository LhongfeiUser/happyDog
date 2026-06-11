import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Order, CreateOrderRequest } from '../../types';
import { orders } from '../../services/api';

interface OrdersState {
  list: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  list: [],
  currentOrder: null,
  loading: false,
  error: null,
};

// 创建订单
export const createOrderAsync = createAsyncThunk(
  'orders/create',
  async (data: CreateOrderRequest, { rejectWithValue }) => {
    const response = await orders.create(data);
    if (response.code !== 0) {
      return rejectWithValue(response.message);
    }
    return response.data;
  }
);

// 获取订单列表
export const getOrdersAsync = createAsyncThunk(
  'orders/getList',
  async (params: { status?: string; page?: number; pageSize?: number } | undefined, { rejectWithValue }) => {
    const response = await orders.getList(params);
    if (response.code !== 0) {
      return rejectWithValue(response.message);
    }
    return response.data;
  }
);

// 获取订单详情
export const getOrderByIdAsync = createAsyncThunk(
  'orders/getById',
  async (id: string, { rejectWithValue }) => {
    const response = await orders.getById(id);
    if (response.code !== 0) {
      return rejectWithValue(response.message);
    }
    return response.data;
  }
);

// 支付订单
export const payOrderAsync = createAsyncThunk(
  'orders/pay',
  async (id: string, { rejectWithValue }) => {
    const response = await orders.pay(id);
    if (response.code !== 0) {
      return rejectWithValue(response.message);
    }
    return response.data;
  }
);

// 取消订单
export const cancelOrderAsync = createAsyncThunk(
  'orders/cancel',
  async (id: string, { rejectWithValue }) => {
    const response = await orders.cancel(id);
    if (response.code !== 0) {
      return rejectWithValue(response.message);
    }
    return response.data;
  }
);

// 确认完成
export const completeOrderAsync = createAsyncThunk(
  'orders/complete',
  async (id: string, { rejectWithValue }) => {
    const response = await orders.complete(id);
    if (response.code !== 0) {
      return rejectWithValue(response.message);
    }
    return response.data;
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 创建订单
      .addCase(createOrderAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrderAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.list.unshift(action.payload);
      })
      .addCase(createOrderAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // 获取订单列表
      .addCase(getOrdersAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrdersAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.list;
      })
      .addCase(getOrdersAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // 获取订单详情
      .addCase(getOrderByIdAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOrderByIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(getOrderByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // 支付订单
      .addCase(payOrderAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(payOrderAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex(o => o.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        if (state.currentOrder?.id === action.payload.id) {
          state.currentOrder = action.payload;
        }
      })
      .addCase(payOrderAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // 取消订单
      .addCase(cancelOrderAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(cancelOrderAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex(o => o.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        if (state.currentOrder?.id === action.payload.id) {
          state.currentOrder = action.payload;
        }
      })
      .addCase(cancelOrderAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // 确认完成
      .addCase(completeOrderAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(completeOrderAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex(o => o.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        if (state.currentOrder?.id === action.payload.id) {
          state.currentOrder = action.payload;
        }
      })
      .addCase(completeOrderAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentOrder, clearError } = ordersSlice.actions;
export default ordersSlice.reducer;
