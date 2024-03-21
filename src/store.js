import { configureStore } from '@reduxjs/toolkit';
import allJobsSlice from './features/all-jobs/all-jobs-slice';
import jobSlice from './features/job/job-slice';
import userSlice from './features/user/user-slice';
export const store = configureStore({
	reducer: {
		user: userSlice,
		job: jobSlice,
		allJobs: allJobsSlice,
	},
});
