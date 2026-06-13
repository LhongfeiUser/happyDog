import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Order, OrderStatus } from '../../types';
import { merchantOrdersApi } from '../../services/api';

interface MerchantOrdersState {
  list: Order[];
  loading: boolean;
  error: string | null;
  total: number;
  currentPage: number;
  pageSize: number;
  statusFilter: OrderStatus | 'all';
}

const initialState: MerchantOrdersState = {
  list: [],
  loading: false,
  error: null,
  total: 0,
  currentPage: 1,
  pageSize: 10,
  statusFilter: 'all',
};

// 获取订单列表
export const getOrdersListAsync = createAsyncThunk(
  'merchantOrders/getList',
  async (params: { page?: number; pageSize?: number; status?: OrderStatus; startDate?: string; endDate?: string }, { rejectWithValue }) => {
    const response = await merchantOrdersApi.getList(params);
    if (response.code !== 0) {
      return rejectWithValue(response.message);
    }
    return response.data;
  }
);

// 接受订单
export const acceptOrderAsync = createAsyncThunk(
  'merchantOrders/accept',
  async (id: string, { rejectWithValue }) => {
    const response = await merchantOrdersApi.accept(id);
    if (response.code !== 0) {
      return rejectWithValue(response.message);
    }
    return response.data;
  }
);

// 拒绝订单
export const rejectOrderAsync = createAsyncThunk(
  'merchantOrders/reject',
  async ({ id, reason }: { id: string; reason: string }, { rejectWithValue }) => {
    const response = await merchantOrdersApi.reject(id, reason);
    if (response.code !== 0) {
      return rejectWithValue(response.message);
    }
    return response.data;
  }
);

// 开始服务
export const startServiceAsync = createAsyncThunk(
  'merchantOrders/startService',
  async (id: string, { rejectWithValue }) => {
    const response = await merchantOrdersApi.startService(id);
    if (response.code !== 0) {
      return rejectWithValue(response.message);
    }
    return response.data;
  }
);

// 完成服务
export const completeServiceAsync = createAsyncThunk(
  'merchantOrders/completeService',
  async (id: string, { rejectWithValue }) => {
    const response = await merchantOrdersApi.completeService(id);
    if (response.code !== 0) {
      return rejectWithValue(response.message);
    }
    return response.data;
  }
);

const merchantOrdersSlice = createSlice({
  name: 'merchantOrders',
  initialState,
  reducers: {
    setStatusFilter: (state, action: PayloadAction<OrderStatus | 'all'>) => {
      state.statusFilter = action.payload;
      state.currentPage = 1; // 重置页码
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 获取订单列表
      .addCase(getOrdersListAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrdersListAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.list;
        state.total = action.payload.total;
      })
      .addCase(getOrdersListAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // 接受订单
      .addCase(acceptOrderAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(acceptOrderAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(acceptOrderAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // 拒绝订单
      .addCase(rejectOrderAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectOrderAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(rejectOrderAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // 开始服务
      .addCase(startServiceAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startServiceAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(startServiceAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // 完成服务
      .addCase(completeServiceAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeServiceAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(completeServiceAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setStatusFilter, setCurrentPage, setPageSize, clearError } = merchantOrdersSlice.actions;
export default merchantOrdersSlice.reducer;
