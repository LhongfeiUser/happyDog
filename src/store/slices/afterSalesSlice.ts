import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { AfterSales, CreateAfterSalesRequest } from '../../types';
import { afterSalesApi } from '../../services/api';

interface AfterSalesState {
  list: AfterSales[];
  currentAfterSales: AfterSales | null;
  loading: boolean;
  error: string | null;
}

const initialState: AfterSalesState = {
  list: [],
  currentAfterSales: null,
  loading: false,
  error: null,
};

// 提交售后申请
export const createAfterSalesAsync = createAsyncThunk(
  'afterSales/create',
  async (data: CreateAfterSalesRequest, { rejectWithValue }) => {
    const response = await afterSalesApi.create(data);
    if (response.code !== 0) {
      return rejectWithValue(response.message);
    }
    return response.data;
  }
);

// 获取用户售后列表
export const getUserAfterSalesAsync = createAsyncThunk(
  'afterSales/getUserList',
  async (params: { page?: number; pageSize?: number } | undefined, { rejectWithValue }) => {
    const response = await afterSalesApi.getUserList(params);
    if (response.code !== 0) {
      return rejectWithValue(response.message);
    }
    return response.data;
  }
);

// 获取售后详情
export const getAfterSalesByIdAsync = createAsyncThunk(
  'afterSales/getById',
  async (id: string, { rejectWithValue }) => {
    const response = await afterSalesApi.getById(id);
    if (response.code !== 0) {
      return rejectWithValue(response.message);
    }
    return response.data;
  }
);

// 取消售后申请
export const cancelAfterSalesAsync = createAsyncThunk(
  'afterSales/cancel',
  async (id: string, { rejectWithValue }) => {
    const response = await afterSalesApi.cancel(id);
    if (response.code !== 0) {
      return rejectWithValue(response.message);
    }
    return response.data;
  }
);

const afterSalesSlice = createSlice({
  name: 'afterSales',
  initialState,
  reducers: {
    clearCurrentAfterSales: (state) => {
      state.currentAfterSales = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 提交售后申请
      .addCase(createAfterSalesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAfterSalesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.list.unshift(action.payload);
      })
      .addCase(createAfterSalesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // 获取用户售后列表
      .addCase(getUserAfterSalesAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserAfterSalesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.list;
      })
      .addCase(getUserAfterSalesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // 获取售后详情
      .addCase(getAfterSalesByIdAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAfterSalesByIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAfterSales = action.payload;
      })
      .addCase(getAfterSalesByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // 取消售后申请
      .addCase(cancelAfterSalesAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(cancelAfterSalesAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
        if (state.currentAfterSales?.id === action.payload.id) {
          state.currentAfterSales = action.payload;
        }
      })
      .addCase(cancelAfterSalesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentAfterSales, clearError } = afterSalesSlice.actions;
export default afterSalesSlice.reducer;
