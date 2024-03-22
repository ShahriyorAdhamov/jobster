const CheckAuth = (thunkApi, err) => {
	if (err.response.status === 401) {
		return thunkApi.rejectWithValue('Unauthorized! Logging Out...');
	}
	return thunkApi.rejectWithValue(err.response.data.msg);
};

export default CheckAuth;
