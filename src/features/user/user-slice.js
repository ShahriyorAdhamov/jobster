import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import authHeader from '../../utils/auth-header';
import customFetch from '../../utils/axios';
import CheckAuth from '../../utils/check-auth';
import {
	addUserToLocalStorage,
	getUserFromLocalStorage,
	removeUserFromLocalStorage,
} from '../../utils/local-storage';

const initialState = {
	isLoading: false,
	isSidebarOpen: false,
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

export const updateUser = createAsyncThunk(
	'user/updateUser',
	async (user, thunkApi) => {
		try {
			const res = await customFetch.patch(
				'/auth/updateUser',
				user,
				authHeader(thunkApi)
			);
			return res.data;
		} catch (err) {
			CheckAuth(thunkApi, err);
		}
	}
);

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		toggleSidebar: state => {
			state.isSidebarOpen = !state.isSidebarOpen;
		},
		logoutUser: (state, { payload }) => {
			state.user = null;
			state.isSidebarOpen = false;
			removeUserFromLocalStorage();
			if (payload) {
				toast.success(payload);
			}
		},
	},
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
			})
			.addCase(updateUser.pending, state => {
				state.isLoading = true;
			})
			.addCase(updateUser.fulfilled, (state, { payload }) => {
				const { user } = payload;
				state.isLoading = false;
				state.user = user;
				addUserToLocalStorage(user);

				toast.success(`User Updated!`);
			})
			.addCase(updateUser.rejected, (state, { payload }) => {
				state.isLoading = false;
				toast.error(payload);
			});
	},
});

export const { toggleSidebar, logoutUser } = userSlice.actions;
export default userSlice.reducer;
