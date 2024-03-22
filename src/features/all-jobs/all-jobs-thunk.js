import authHeader from '../../utils/auth-header';
import customFetch from '../../utils/axios';
import CheckAuth from '../../utils/check-auth';

export const getAllJobsThunk = async (_, thunkApi) => {
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
		return CheckAuth(thunkApi, err);
	}
};

export const showStatsThunk = async (_, thunkApi) => {
	try {
		const resp = await customFetch.get('/jobs/stats');

		return resp.data;
	} catch (err) {
		return CheckAuth(thunkApi, err);
	}
};
