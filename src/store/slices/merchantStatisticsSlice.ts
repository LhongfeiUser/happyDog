import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { MerchantStatistics } from '../../types';
import { merchantStatistics } from '../../services/api';

interface DateRange {
  startDate: string;
  endDate: string;
}

interface MerchantStatisticsState {
  data: MerchantStatistics | null;
  loading: boolean;
  error: string | null;
  dateRange: DateRange;
}

const initialState: MerchantStatisticsState = {
  data: null,
  loading: false,
  error: null,
  dateRange: {
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  },
};

// 获取统计数据
export const getStatisticsDataAsync = createAsyncThunk(
  'merchantStatistics/getData',
  async (params: { startDate?: string; endDate?: string }, { rejectWithValue }) => {
    const response = await merchantStatistics.getData(params);
    if (response.code !== 0) {
      return rejectWithValue(response.message);
    }
    return response.data;
  }
);

const merchantStatisticsSlice = createSlice({
  name: 'merchantStatistics',
  initialState,
  reducers: {
    setDateRange: (state, action: PayloadAction<DateRange>) => {
      state.dateRange = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 获取统计数据
      .addCase(getStatisticsDataAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStatisticsDataAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getStatisticsDataAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setDateRange, clearError } = merchantStatisticsSlice.actions;
export default merchantStatisticsSlice.reducer;
