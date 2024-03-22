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
		const { page, search, searchStatus, searchType, sort } =
			thunkApi.getState().allJobs;

		let url = `/jobs?status=${searchStatus}&jobType=${searchType}&sort=${sort}&page=${page}`;
		if (search) {
			url = url + `&search=${search}`;
		}
		try {
			const res = await customFetch.get(url, authHeader(thunkApi));
			console.log(res);
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
		handleChange: (state, { payload: { name, value } }) => {
			state.page = 1;
			state[name] = value;
		},
		changePage: (state, { payload }) => {
			state.page = payload;
		},
		clearFilters: state => {
			return { ...state, ...initialFiltersState };
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

export const {
	showLoading,
	hideLoading,
	handleChange,
	clearFilters,
	changePage,
} = allJobsSlice.actions;
export default allJobsSlice.reducer;
