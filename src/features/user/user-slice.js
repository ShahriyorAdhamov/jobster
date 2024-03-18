import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import customFetch from '../../utils/axios';
import {
	addUserToLocalStorage,
	getUserFromLocalStorage,
} from '../../utils/local-storage';

const initialState = {
	isLoading: false,
	user: getUserFromLocalStorage(),
};

export const registerUser = createAsyncThunk(
	'user/registerUser',
	async (user, thunkApi) => {
		try {
			const res = await customFetch.post('/auth/register', user);
			return res.data;
		} catch (err) {
			thunkApi.rejectWithValue(err.response.data.msg);
		}
	}
);

export const loginUser = createAsyncThunk(
	'user/loginUser',
	async (user, thunkApi) => {
		try {
			const res = await customFetch.post('/auth/login', user);
			return res.data;
		} catch (err) {
			thunkApi.rejectWithValue(err.response.data.msg);
		}
	}
);

const userSlice = createSlice({
	name: 'user',
	initialState,
	extraReducers: builder => {
		builder
			.addCase(registerUser.pending, state => {
				state.isLoading = true;
			})
			.addCase(registerUser.fulfilled, (state, { payload }) => {
				state.isLoading = false;
				if (payload?.user) {
					const { user } = payload;
					state.user = user;
					addUserToLocalStorage(user);
					toast.success(`Hello There ${user.name}`);
				}
			})
			.addCase(registerUser.rejected, (state, { payload }) => {
				state.isLoading = false;
				toast.error(payload);
			})
			.addCase(loginUser.pending, state => {
				state.isLoading = true;
			})
			.addCase(loginUser.fulfilled, (state, { payload }) => {
				const { user } = payload;
				state.isLoading = false;
				state.user = user;
				addUserToLocalStorage(user);
				toast.success(`Welcome Back ${user.name}`);
			})
			.addCase(loginUser.rejected, (state, { payload }) => {
				state.isLoading = false;
				toast.error(payload);
			});
	},
});

export default userSlice.reducer;
