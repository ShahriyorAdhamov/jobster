import { useState } from 'react';

import { useSelector } from 'react-redux';
import Wrapper from '../assets/wrappers/ChartsContainer';
import AreaChart from './area-chart';
import BarChart from './bar-chart';
const ChartsContainer = () => {
	const [barChart, setBarChart] = useState(true);
	const { monthlyApplications: data } = useSelector(store => store.allJobs);
	return (
		<Wrapper>
			<h4>Monthly Applications</h4>
			<button type='button' onClick={() => setBarChart(!barChart)}>
				{barChart ? 'Area Chart' : 'Bar Chart'}
			</button>
			{barChart ? <BarChart data={data} /> : <AreaChart data={data} />}
		</Wrapper>
	);
};
export default ChartsContainer;
