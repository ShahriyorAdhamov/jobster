import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChartContainer, StatsContainer } from '../../components';
import { showStats } from '../../features/all-jobs/all-jobs-slice';

const Stats = () => {
	const { monthlyApplications } = useSelector(store => store.allJobs);

	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(showStats());
	}, []);
	return (
		<>
			<StatsContainer />
			{monthlyApplications.length > 0 && <ChartContainer />}
		</>
	);
};
export default Stats;
