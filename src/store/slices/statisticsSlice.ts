import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getStatistics } from '../../services/mock/statistics';
import type { StatisticsData } from '../../types';

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

export const getStatisticsAsync = createAsyncThunk(
  'statistics/getStatistics',
  async () => {
    const response = await getStatistics();
    if (response.code === 0) {
      return response.data;
    }
    throw new Error(response.message);
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
        state.error = action.error.message || '加载失败';
      });
  },
});

export default statisticsSlice.reducer;
