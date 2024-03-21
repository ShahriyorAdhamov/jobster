import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Wrapper from '../assets/wrappers/JobsContainer';
import { getAllJobs } from '../features/all-jobs/all-jobs-slice';
import Job from './job';
import Loading from './loading';

const JobsContainer = () => {
	const {
		jobs,
		isLoading,
		page,
		totalJobs,
		search,
		searchStatus,
		searchType,
		sort,
	} = useSelector(store => store.allJobs);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getAllJobs());
	}, [page, search, searchStatus, searchType, sort, dispatch]);

	if (isLoading) {
		return <Loading />;
	}

	if (jobs.length === 0) {
		return (
			<Wrapper>
				<h2>No jobs to display...</h2>
			</Wrapper>
		);
	}

	return (
		<Wrapper>
			<h5>
				{totalJobs} job{jobs.length > 1 && 's'} found
			</h5>
			<div className='jobs'>
				{jobs.map(job => {
					return <Job key={job._id} {...job} />;
				})}
			</div>
		</Wrapper>
	);
};
export default JobsContainer;
