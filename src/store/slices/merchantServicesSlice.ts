import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { MerchantService } from '../../types';
import { merchantServicesApi } from '../../services/api';

interface MerchantServicesState {
  list: MerchantService[];
  loading: boolean;
  error: string | null;
  total: number;
  currentPage: number;
  pageSize: number;
}

const initialState: MerchantServicesState = {
  list: [],
  loading: false,
  error: null,
  total: 0,
  currentPage: 1,
  pageSize: 10,
};

// 获取服务列表
export const getServicesListAsync = createAsyncThunk(
  'merchantServices/getList',
  async (params: { page?: number; pageSize?: number; category?: string; status?: string }, { rejectWithValue }) => {
    const response = await merchantServicesApi.getList(params);
    if (response.code !== 0) {
      return rejectWithValue(response.message);
    }
    return response.data;
  }
);

// 创建服务
export const createServiceAsync = createAsyncThunk(
  'merchantServices/create',
  async (data: Omit<MerchantService, 'id' | 'merchantId' | 'rating' | 'salesCount' | 'auditStatus' | 'auditReason' | 'createTime' | 'updateTime'>, { rejectWithValue }) => {
    const response = await merchantServicesApi.create(data);
    if (response.code !== 0) {
      return rejectWithValue(response.message);
    }
    return response.data;
  }
);

// 更新服务
export const updateServiceAsync = createAsyncThunk(
  'merchantServices/update',
  async ({ id, data }: { id: string; data: Partial<MerchantService> }, { rejectWithValue }) => {
    const response = await merchantServicesApi.update(id, data);
    if (response.code !== 0) {
      return rejectWithValue(response.message);
    }
    return response.data;
  }
);

// 删除服务
export const deleteServiceAsync = createAsyncThunk(
  'merchantServices/delete',
  async (id: string, { rejectWithValue }) => {
    const response = await merchantServicesApi.deleteService(id);
    if (response.code !== 0) {
      return rejectWithValue(response.message);
    }
    return id;
  }
);

// 更新服务状态
export const updateServiceStatusAsync = createAsyncThunk(
  'merchantServices/updateStatus',
  async ({ id, status }: { id: string; status: 'active' | 'inactive' }, { rejectWithValue }) => {
    const response = await merchantServicesApi.updateStatus(id, status);
    if (response.code !== 0) {
      return rejectWithValue(response.message);
    }
    return response.data;
  }
);

const merchantServicesSlice = createSlice({
  name: 'merchantServices',
  initialState,
  reducers: {
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
      // 获取服务列表
      .addCase(getServicesListAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getServicesListAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.list;
        state.total = action.payload.total;
      })
      .addCase(getServicesListAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // 创建服务
      .addCase(createServiceAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createServiceAsync.fulfilled, (state) => {
        state.loading = false;
        // 创建成功后刷新列表
        state.currentPage = 1;
      })
      .addCase(createServiceAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // 更新服务
      .addCase(updateServiceAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateServiceAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(updateServiceAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // 删除服务
      .addCase(deleteServiceAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteServiceAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter(item => item.id !== action.payload);
        state.total -= 1;
      })
      .addCase(deleteServiceAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // 更新服务状态
      .addCase(updateServiceStatusAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateServiceStatusAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(updateServiceStatusAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentPage, setPageSize, clearError } = merchantServicesSlice.actions;
export default merchantServicesSlice.reducer;
