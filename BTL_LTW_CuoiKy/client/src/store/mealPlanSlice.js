import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';
import { getMonday } from '../utils/helpers';

export const fetchMealPlan = createAsyncThunk('mealPlan/fetch', async (weekStart) => {
  const { data } = await api.get('/mealplans', { params: { weekStart } });
  return data;
});

export const saveMealPlan = createAsyncThunk('mealPlan/save', async (_, { getState }) => {
  const { weekStart, slots } = getState().mealPlan;
  const body = {
    weekStart,
    slots: slots.map((s) => ({ day: s.day, meal: s.meal, recipe: s.recipe._id })),
  };
  await api.put('/mealplans', body);
  return true;
});

const mealPlanSlice = createSlice({
  name: 'mealPlan',
  initialState: { weekStart: getMonday(), slots: [], status: 'idle', saved: true, error: null },
  reducers: {
    setWeekStart: (state, { payload }) => {
      state.weekStart = payload;
    },
    // Immer cho phép viết kiểu "mutate" trong reducer
    setSlot: (state, { payload: { day, meal, recipe } }) => {
      const i = state.slots.findIndex((s) => s.day === day && s.meal === meal);
      if (i >= 0) state.slots[i].recipe = recipe;
      else state.slots.push({ day, meal, recipe });
      state.saved = false;
    },
    clearSlot: (state, { payload: { day, meal } }) => {
      state.slots = state.slots.filter((s) => !(s.day === day && s.meal === meal));
      state.saved = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMealPlan.pending, (s) => { s.status = 'loading'; s.error = null; })
      .addCase(fetchMealPlan.fulfilled, (s, { payload }) => {
        s.status = 'idle';
        s.slots = payload.slots;
        s.saved = true;
      })
      .addCase(fetchMealPlan.rejected, (s, { error }) => { s.status = 'error'; s.error = error.message; })
      .addCase(saveMealPlan.pending, (s) => { s.status = 'saving'; })
      .addCase(saveMealPlan.fulfilled, (s) => { s.status = 'idle'; s.saved = true; })
      .addCase(saveMealPlan.rejected, (s, { error }) => { s.status = 'error'; s.error = error.message; });
  },
});

export const { setWeekStart, setSlot, clearSlot } = mealPlanSlice.actions;
export default mealPlanSlice.reducer;
