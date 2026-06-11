import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Review, CreateReviewRequest } from '../../types';
import { reviews } from '../../services/api';

interface ReviewsState {
  list: Review[];
  serviceReviews: Review[];
  currentReview: Review | null;
  loading: boolean;
  error: string | null;
}

const initialState: ReviewsState = {
  list: [],
  serviceReviews: [],
  currentReview: null,
  loading: false,
  error: null,
};

// 提交评价
export const createReviewAsync = createAsyncThunk(
  'reviews/create',
  async (data: CreateReviewRequest, { rejectWithValue }) => {
    const response = await reviews.create(data);
    if (response.code !== 0) {
      return rejectWithValue(response.message);
    }
    return response.data;
  }
);

// 获取用户评价列表
export const getUserReviewsAsync = createAsyncThunk(
  'reviews/getUserList',
  async (params: { page?: number; pageSize?: number } | undefined, { rejectWithValue }) => {
    const response = await reviews.getUserReviews(params);
    if (response.code !== 0) {
      return rejectWithValue(response.message);
    }
    return response.data;
  }
);

// 获取服务评价列表
export const getServiceReviewsAsync = createAsyncThunk(
  'reviews/getServiceList',
  async (params: { serviceId: string; page?: number; pageSize?: number }, { rejectWithValue }) => {
    const response = await reviews.getServiceReviews(params);
    if (response.code !== 0) {
      return rejectWithValue(response.message);
    }
    return response.data;
  }
);

// 检查订单是否已评价
export const checkOrderReviewedAsync = createAsyncThunk(
  'reviews/checkOrderReviewed',
  async (orderId: string, { rejectWithValue }) => {
    const response = await reviews.checkOrderReviewed(orderId);
    if (response.code !== 0) {
      return rejectWithValue(response.message);
    }
    return { orderId, reviewed: response.data.reviewed };
  }
);

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    clearCurrentReview: (state) => {
      state.currentReview = null;
    },
    clearServiceReviews: (state) => {
      state.serviceReviews = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 提交评价
      .addCase(createReviewAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReviewAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.list.unshift(action.payload);
      })
      .addCase(createReviewAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // 获取用户评价列表
      .addCase(getUserReviewsAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserReviewsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.list;
      })
      .addCase(getUserReviewsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // 获取服务评价列表
      .addCase(getServiceReviewsAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(getServiceReviewsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.serviceReviews = action.payload.list;
      })
      .addCase(getServiceReviewsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentReview, clearServiceReviews, clearError } = reviewsSlice.actions;
export default reviewsSlice.reducer;
