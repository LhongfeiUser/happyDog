import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Pet } from '../../types';
import { pets } from '../../services/api';

interface PetsState {
  list: Pet[];
  currentPet: Pet | null;
  loading: boolean;
  error: string | null;
}

const initialState: PetsState = {
  list: [],
  currentPet: null,
  loading: false,
  error: null,
};

// 获取宠物列表
export const getPetsAsync = createAsyncThunk(
  'pets/getList',
  async (_, { rejectWithValue }) => {
    const response = await pets.getList();
    if (response.code !== 0) {
      return rejectWithValue(response.message);
    }
    return response.data;
  }
);

// 添加宠物
export const addPetAsync = createAsyncThunk(
  'pets/add',
  async (data: Partial<Pet>, { rejectWithValue }) => {
    const response = await pets.add(data);
    if (response.code !== 0) {
      return rejectWithValue(response.message);
    }
    return response.data;
  }
);

// 更新宠物
export const updatePetAsync = createAsyncThunk(
  'pets/update',
  async ({ id, data }: { id: string; data: Partial<Pet> }, { rejectWithValue }) => {
    const response = await pets.update(id, data);
    if (response.code !== 0) {
      return rejectWithValue(response.message);
    }
    return response.data;
  }
);

// 删除宠物
export const deletePetAsync = createAsyncThunk(
  'pets/delete',
  async (id: string, { rejectWithValue }) => {
    const response = await pets.delete(id);
    if (response.code !== 0) {
      return rejectWithValue(response.message);
    }
    return id;
  }
);

// 设置默认宠物
export const setDefaultPetAsync = createAsyncThunk(
  'pets/setDefault',
  async (id: string, { rejectWithValue }) => {
    const response = await pets.setDefault(id);
    if (response.code !== 0) {
      return rejectWithValue(response.message);
    }
    return id;
  }
);

const petsSlice = createSlice({
  name: 'pets',
  initialState,
  reducers: {
    setCurrentPet: (state, action) => {
      state.currentPet = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 获取宠物列表
      .addCase(getPetsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPetsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(getPetsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // 添加宠物
      .addCase(addPetAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(addPetAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(addPetAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // 更新宠物
      .addCase(updatePetAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePetAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(updatePetAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // 删除宠物
      .addCase(deletePetAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletePetAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.filter(p => p.id !== action.payload);
      })
      .addCase(deletePetAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // 设置默认宠物
      .addCase(setDefaultPetAsync.fulfilled, (state, action) => {
        state.list.forEach(p => {
          p.isDefault = p.id === action.payload;
        });
      });
  },
});

export const { setCurrentPet, clearError } = petsSlice.actions;
export default petsSlice.reducer;
