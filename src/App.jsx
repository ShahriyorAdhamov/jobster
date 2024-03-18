import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Error, Landing, Register } from './pages';
import { AddJob, AllJobs, Profile, Stats } from './pages/dashboard';
import SharedLayout from './pages/dashboard/shared-layout';
import ProtectedRoute from './pages/protected-route';

const App = () => {
	return (
		<>
			<Routes>
				<Route
					path='/'
					element={
						<ProtectedRoute>
							<SharedLayout />
						</ProtectedRoute>
					}
				>
					<Route index element={<Stats />} />
					<Route path='all-jobs' element={<AllJobs />} />
					<Route path='add-job' element={<AddJob />} />
					<Route path='profile' element={<Profile />} />
				</Route>
				<Route path='/register' element={<Register />} />
				<Route path='/landing' element={<Landing />} />
				<Route path='*' element={<Error />} />
			</Routes>
			<ToastContainer position='top-center' />
		</>
	);
};

export default App;
