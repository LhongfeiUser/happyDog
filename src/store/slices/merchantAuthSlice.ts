import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import type { Merchant, MerchantRegisterRequest } from '../../types';
import { merchantAuth } from '../../services/api';

interface MerchantAuthState {
  merchant: Merchant | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: MerchantAuthState = {
  merchant: null,
  token: localStorage.getItem('merchantToken'),
  loading: false,
  error: null,
};

// 商家登录
export const merchantLoginAsync = createAsyncThunk(
  'merchantAuth/login',
  async (data: { phone: string; password: string }, { rejectWithValue }) => {
    const response = await merchantAuth.login(data);
    if (response.code !== 0) {
      return rejectWithValue(response.message);
    }
    localStorage.setItem('merchantToken', response.data.token);
    return response.data;
  }
);

// 商家注册
export const merchantRegisterAsync = createAsyncThunk(
  'merchantAuth/register',
  async (data: MerchantRegisterRequest, { rejectWithValue }) => {
    const response = await merchantAuth.register(data);
    if (response.code !== 0) {
      return rejectWithValue(response.message);
    }
    return response.data;
  }
);

// 获取商家信息
export const getMerchantInfoAsync = createAsyncThunk(
  'merchantAuth/getMerchantInfo',
  async (_, { rejectWithValue }) => {
    const response = await merchantAuth.getMerchantInfo();
    if (response.code !== 0) {
      return rejectWithValue(response.message);
    }
    return response.data;
  }
);

// 更新商家信息
export const updateMerchantInfoAsync = createAsyncThunk(
  'merchantAuth/updateMerchantInfo',
  async (data: Partial<Merchant>, { rejectWithValue }) => {
    const response = await merchantAuth.updateMerchantInfo(data);
    if (response.code !== 0) {
      return rejectWithValue(response.message);
    }
    return response.data;
  }
);

// 退出登录
export const merchantLogoutAsync = createAsyncThunk(
  'merchantAuth/logout',
  async () => {
    localStorage.removeItem('merchantToken');
  }
);

const merchantAuthSlice = createSlice({
  name: 'merchantAuth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 登录
      .addCase(merchantLoginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(merchantLoginAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.merchant = action.payload.merchant;
        state.token = action.payload.token;
      })
      .addCase(merchantLoginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // 注册
      .addCase(merchantRegisterAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(merchantRegisterAsync.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(merchantRegisterAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // 获取商家信息
      .addCase(getMerchantInfoAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMerchantInfoAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.merchant = action.payload;
      })
      .addCase(getMerchantInfoAsync.rejected, (state) => {
        state.loading = false;
        state.token = null;
        localStorage.removeItem('merchantToken');
      })
      // 更新商家信息
      .addCase(updateMerchantInfoAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMerchantInfoAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.merchant = action.payload;
      })
      .addCase(updateMerchantInfoAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // 退出登录
      .addCase(merchantLogoutAsync.fulfilled, (state) => {
        state.merchant = null;
        state.token = null;
      });
  },
});

export const { clearError } = merchantAuthSlice.actions;
export default merchantAuthSlice.reducer;
