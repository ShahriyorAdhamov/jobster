import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
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

export const getAllJobs = createAsyncThunk(
	'allJobs/getJobs',
	async (_, thunkApi) => {
		try {
			const res = await customFetch.get('/jobs', {
				headers: {
					authorization: `Bearer ${thunkApi.getState().user.user.token}`,
				},
			});
			return res.data;
		} catch (err) {
			return thunkApi.rejectWithValue('Error');
		}
	}
);

export const deleteJob = createAsyncThunk(
	'job/deleteJob',
	async (jobId, thunkApi) => {
		thunkApi.dispatch(showLoading());
		try {
			const resp = await customFetch.delete(`/jobs/${jobId}`, {
				headers: {
					authorization: `Bearer ${thunkApi.getState().user.user.token}`,
				},
			});
			thunkApi.dispatch(getAllJobs());
			return resp.data.msg;
		} catch (err) {
			thunkApi.dispatch(hideLoading());
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
			.addCase(deleteJob.fulfilled, (state, { payload }) => {
				toast.success(payload);
			})
			.addCase(deleteJob.rejected, (state, { payload }) => {
				toast.error(payload);
			});
	},
});

export const { showLoading, hideLoading } = allJobsSlice.actions;
export default allJobsSlice.reducer;
