import authHeader from '../../utils/auth-header';
import customFetch from '../../utils/axios';
import CheckAuth from '../../utils/check-auth';

export const registerUserThunk = async (user, thunkApi) => {
	try {
		const res = await customFetch.post('/auth/register', user);
		return res.data;
	} catch (err) {
		return thunkApi.rejectWithValue(err.response.data.msg);
	}
};

export const loginUserThunk = async (user, thunkApi) => {
	try {
		const res = await customFetch.post('/auth/login', user);
		return res.data;
	} catch (err) {
		return thunkApi.rejectWithValue(err.response.data.msg);
	}
};

export const updateUserThunk = async (user, thunkApi) => {
	try {
		const res = await customFetch.patch(
			'/auth/updateUser',
			user,
			authHeader(thunkApi)
		);
		return res.data;
	} catch (err) {
		return CheckAuth(thunkApi, err);
	}
};
