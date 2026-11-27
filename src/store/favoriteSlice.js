import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../utils/api';

export const fetchFavorites = createAsyncThunk(
  'favorite/fetch',
  async (_, { getState, rejectWithValue }) => {
    try {
      return await api('/users/me/favorites', { token: getState().auth.token });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const toggleFavorite = createAsyncThunk(
  'favorite/toggle',
  async (recipeId, { getState, rejectWithValue }) => {
    try {
      const data = await api(`/users/me/favorites/${recipeId}`, {
        method: 'POST',
        token: getState().auth.token,
      });
      return data.favorites; // mảng id mới
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const favoriteSlice = createSlice({
  name: 'favorite',
  initialState: { ids: [], items: [], status: 'idle', error: null },
  reducers: {
    clearFavorites: () => ({ ids: [], items: [], status: 'idle', error: null }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFavorites.fulfilled, (state, { payload }) => {
        state.status = 'idle';
        state.items = payload;
        state.ids = payload.map((r) => r._id);
      })
      .addCase(fetchFavorites.rejected, (state, { payload }) => {
        state.status = 'failed';
        state.error = payload;
      })
      .addCase(toggleFavorite.fulfilled, (state, { payload }) => {
        state.ids = payload;
        state.items = state.items.filter((r) => payload.includes(r._id));
      })
      .addCase(toggleFavorite.rejected, (state, { payload }) => {
        state.error = payload;
      });
  },
});

export const { clearFavorites } = favoriteSlice.actions;
export default favoriteSlice.reducer;
