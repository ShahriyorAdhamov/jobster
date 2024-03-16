import { Route, Routes } from 'react-router-dom';
import { Dashboard, Error, Landing, Register } from './pages';

const App = () => {
	return (
		<Routes>
			<Route path='/' element={<Dashboard />} />
			<Route path='/' element={<Register />} />
			<Route path='/' element={<Landing />} />
			<Route path='/' element={<Error />} />
		</Routes>
	);
};

export default App;
