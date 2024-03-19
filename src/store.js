import { configureStore } from '@reduxjs/toolkit';
import jobSlice from './features/job/job-slice';
import userSlice from './features/user/user-slice';
export const store = configureStore({
	reducer: {
		user: userSlice,
		job: jobSlice,
	},
});
