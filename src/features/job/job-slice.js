import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import customFetch from '../../utils/axios';
import { getUserFromLocalStorage } from '../../utils/local-storage';
import {
	getAllJobs,
	hideLoading,
	showLoading,
} from '../all-jobs/all-jobs-slice';
const initialState = {
	isLoading: false,
	position: '',
	company: '',
	jobLocation: '',
	jobTypeOptions: ['full-time', 'part-time', 'remote', 'internship'],
	jobType: 'full-time',
	statusOptions: ['interview', 'declined', 'pending'],
	status: 'pending',
	isEditing: false,
	editJobId: '',
};

export const createJob = createAsyncThunk(
	'job/createJob',
	async (job, thunkApi) => {
		try {
			const resp = await customFetch.post('/jobs', job, {
				headers: {
					authorization: `Bearer ${thunkApi.getState().user.user.token}`,
				},
			});
			thunkApi.dispatch(clearValues());
			return resp.data.msg;
		} catch (err) {
			if (err.response.status === 401) {
				return thunkApi.rejectWithValue('Unauthorized! Logging Out...');
			}
			return thunkApi.rejectWithValue(err.response.data.msg);
		}
	}
);

export const editJob = createAsyncThunk(
	'job/editJob',
	async ({ jobId, job }, thunkApi) => {
		try {
			const resp = await customFetch.patch(`/jobs/${jobId}`, job, {
				headers: {
					authorization: `Bearer ${thunkApi.getState().user.user.token}`,
				},
			});
			thunkApi.dispatch(clearValues());
			return resp.data;
		} catch (err) {
			if (err.response.status === 401) {
				return thunkApi.rejectWithValue('Unauthorized! Logging Out...');
			}
			return thunkApi.rejectWithValue(err.response.data.msg);
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

const jobSlice = createSlice({
	name: 'job',
	initialState,
	reducers: {
		handleChange: (state, { payload: { name, value } }) => {
			state[name] = value;
		},
		clearValues: () => {
			return {
				...initialState,
				jobLocation: getUserFromLocalStorage()?.location || '',
			};
		},
		setEditJob: (state, { payload }) => {
			return { ...state, isEditing: true, ...payload };
		},
	},
	extraReducers: builder => {
		builder
			.addCase(createJob.pending, state => {
				state.isLoading = true;
			})
			.addCase(createJob.fulfilled, state => {
				state.isLoading = false;
				toast.success('Job Created');
			})
			.addCase(createJob.rejected, (state, { payload }) => {
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

export const { handleChange, clearValues, setEditJob } = jobSlice.actions;
export default jobSlice.reducer;
