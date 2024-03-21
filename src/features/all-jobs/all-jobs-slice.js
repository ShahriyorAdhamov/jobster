import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import authHeader from '../../utils/auth-header';
import customFetch from '../../utils/axios';

const initialFiltersState = {
	search: '',
	searchStatus: 'all',
	searchType: 'all',
	sort: 'latest',
	sortOptions: ['latest', 'oldest', 'a-z', 'z-a'],
};

const initialState = {
	isLoading: true,
	jobs: [],
	totalJobs: 0,
	numOfPages: 1,
	page: 1,
	stats: {},
	monthlyApplications: [],
	...initialFiltersState,
};

export const showStats = createAsyncThunk(
	'allJobs/showStats',
	async (_, thunkApi) => {
		try {
			const resp = await customFetch.get('/jobs/stats', authHeader(thunkApi));

			return resp.data;
		} catch (err) {
			if (err.response.status === 401) {
				return thunkApi.rejectWithValue('Unauthorized! Logging Out...');
			}
			return thunkApi.rejectWithValue(err.response.data.msg);
		}
	}
);

export const getAllJobs = createAsyncThunk(
	'allJobs/getJobs',
	async (_, thunkApi) => {
		try {
			const res = await customFetch.get('/jobs', authHeader(thunkApi));
			return res.data;
		} catch (err) {
			if (err.response.status === 401) {
				return thunkApi.rejectWithValue('Unauthorized! Logging Out...');
			}
			return thunkApi.rejectWithValue(err.response.data.msg);
		}
	}
);

const allJobsSlice = createSlice({
	name: 'allJobs',
	initialState,
	reducers: {
		showLoading: state => {
			state.isLoading = true;
		},
		hideLoading: state => {
			state.isLoading = false;
		},
	},
	extraReducers: builder => {
		builder
			.addCase(getAllJobs.pending, state => {
				state.isLoading = true;
			})
			.addCase(getAllJobs.fulfilled, (state, { payload }) => {
				state.isLoading = false;
				state.jobs = payload.jobs;
				state.numOfPages = payload.numOfPages;
				state.totalJobs = payload.totalJobs;
			})
			.addCase(getAllJobs.rejected, (state, { payload }) => {
				state.isLoading = false;
				toast.error(payload);
			})
			.addCase(showStats.pending, state => {
				state.isLoading = true;
			})
			.addCase(showStats.fulfilled, (state, { payload }) => {
				state.isLoading = false;
				state.stats = payload.defaultStats;
				state.monthlyApplications = payload.monthlyApplications;
			})
			.addCase(showStats.rejected, (state, { payload }) => {
				state.isLoading = false;
				toast.error(payload);
			});
	},
});

export const { showLoading, hideLoading } = allJobsSlice.actions;
export default allJobsSlice.reducer;
