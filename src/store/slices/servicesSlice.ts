import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Service } from '../../types';
import { services } from '../../services/api';

interface ServicesState {
  list: Service[];
  recommendList: Service[];
  categories: { category: string; count: number; label: string }[];
  currentService: Service | null;
  loading: boolean;
  error: string | null;
}

const initialState: ServicesState = {
  list: [],
  recommendList: [],
  categories: [],
  currentService: null,
  loading: false,
  error: null,
};

// 获取服务列表
export const getServicesAsync = createAsyncThunk(
  'services/getList',
  async (params: { category?: string; page?: number; pageSize?: number } | undefined, { rejectWithValue }) => {
    const response = await services.getList(params);
    if (response.code !== 0) {
      return rejectWithValue(response.message);
    }
    return response.data;
  }
);

// 获取推荐服务
export const getRecommendServicesAsync = createAsyncThunk(
  'services/getRecommend',
  async (limit: number | undefined, { rejectWithValue }) => {
    const response = await services.getRecommend(limit);
    if (response.code !== 0) {
      return rejectWithValue(response.message);
    }
    return response.data;
  }
);

// 获取服务详情
export const getServiceByIdAsync = createAsyncThunk(
  'services/getById',
  async (id: string, { rejectWithValue }) => {
    const response = await services.getById(id);
    if (response.code !== 0) {
      return rejectWithValue(response.message);
    }
    return response.data;
  }
);

// 获取服务分类
export const getServiceCategoriesAsync = createAsyncThunk(
  'services/getCategories',
  async (_, { rejectWithValue }) => {
    const response = await services.getCategories();
    if (response.code !== 0) {
      return rejectWithValue(response.message);
    }
    return response.data;
  }
);

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    clearCurrentService: (state) => {
      state.currentService = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 获取服务列表
      .addCase(getServicesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getServicesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.list;
      })
      .addCase(getServicesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // 获取推荐服务
      .addCase(getRecommendServicesAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(getRecommendServicesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.recommendList = action.payload;
      })
      .addCase(getRecommendServicesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // 获取服务详情
      .addCase(getServiceByIdAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(getServiceByIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.currentService = action.payload;
      })
      .addCase(getServiceByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // 获取服务分类
      .addCase(getServiceCategoriesAsync.fulfilled, (state, action) => {
        state.categories = action.payload;
      });
  },
});

export const { clearCurrentService, clearError } = servicesSlice.actions;
export default servicesSlice.reducer;
