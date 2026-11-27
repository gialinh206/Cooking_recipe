import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../utils/api';

const saved = (() => {
  try {
    return JSON.parse(localStorage.getItem('auth')) ?? {};
  } catch {
    return {};
  }
})();

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    return await api('/auth/login', { method: 'POST', body: credentials });
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const register = createAsyncThunk('auth/register', async (form, { rejectWithValue }) => {
  try {
    return await api('/auth/register', { method: 'POST', body: form });
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const loginWithGoogle = createAsyncThunk('auth/google', async (credential, { rejectWithValue }) => {
  try {
    return await api('/auth/google', { method: 'POST', body: { credential } });
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const initialState = {
  user: saved.user ?? null,
  token: saved.token ?? null,
  status: 'idle', // idle | loading | failed
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem('auth');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const pending = (state) => {
      state.status = 'loading';
      state.error = null;
    };
    const fulfilled = (state, { payload }) => {
      state.status = 'idle';
      state.user = payload.user;
      state.token = payload.token;
      localStorage.setItem('auth', JSON.stringify({ user: payload.user, token: payload.token }));
    };
    const rejected = (state, { payload }) => {
      state.status = 'failed';
      state.error = payload;
    };
    builder
      .addCase(login.pending, pending).addCase(login.fulfilled, fulfilled).addCase(login.rejected, rejected)
      .addCase(register.pending, pending).addCase(register.fulfilled, fulfilled).addCase(register.rejected, rejected)
      .addCase(loginWithGoogle.pending, pending).addCase(loginWithGoogle.fulfilled, fulfilled).addCase(loginWithGoogle.rejected, rejected);
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
