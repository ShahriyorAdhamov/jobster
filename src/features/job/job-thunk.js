import { clearValues } from '../../features/job/job-slice';
import authHeader from '../../utils/auth-header';
import customFetch from '../../utils/axios';
import CheckAuth from '../../utils/check-auth';
import {
	getAllJobs,
	hideLoading,
	showLoading,
} from '../all-jobs/all-jobs-slice';

export const createJobThunk = async (job, thunkApi) => {
	try {
		const res = await customFetch.post('/jobs', job, authHeader(thunkApi));
		thunkApi.dispatch(clearValues());
		return res.data.msg;
	} catch (err) {
		if (err.response.status === 401) {
			return thunkApi.rejectWithValue('Unauthorized! Logging Out...');
		}
		return thunkApi.rejectWithValue(err.response.data.msg);
	}
};

export const editJobThunk = async ({ jobId, job }, thunkApi) => {
	try {
		const resp = await customFetch.patch(
			`/jobs/${jobId}`,
			job,
			authHeader(thunkApi)
		);
		thunkApi.dispatch(clearValues());
		return resp.data;
	} catch (err) {
		return CheckAuth(thunkApi, err);
	}
};

export const deleteJobThunk = async (jobId, thunkApi) => {
	thunkApi.dispatch(showLoading());
	try {
		const resp = await customFetch.delete(
			`/jobs/${jobId}`,
			authHeader(thunkApi)
		);
		thunkApi.dispatch(getAllJobs());
		return resp.data.msg;
	} catch (err) {
		thunkApi.dispatch(hideLoading());
		CheckAuth(thunkApi, err);
	}
};
