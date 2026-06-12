import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { StatisticsData } from '../../types';
import { statistics } from '../../services/api';

interface StatisticsState {
  data: StatisticsData | null;
  loading: boolean;
  error: string | null;
}

const initialState: StatisticsState = {
  data: null,
  loading: false,
  error: null,
};

/**
 * 获取统计数据 - 使用真实API
 */
export const getStatisticsAsync = createAsyncThunk(
  'statistics/getStatistics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await statistics.getStatistics();
      if (response.code !== 0) {
        return rejectWithValue(response.message);
      }
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('获取统计数据失败');
    }
  }
);

const statisticsSlice = createSlice({
  name: 'statistics',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getStatisticsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStatisticsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getStatisticsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error.message || '加载失败';
      });
  },
});

export default statisticsSlice.reducer;
