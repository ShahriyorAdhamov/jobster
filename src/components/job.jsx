import moment from 'moment';
import { FaBriefcase, FaCalendarAlt, FaLocationArrow } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Wrapper from '../assets/wrappers/Job';
import { deleteJob, setEditJob } from '../features/job/jobSlice';
import JobInfo from './JobInfo';
const Job = ({
	_id,
	position,
	company,
	jobLocation,
	jobType,
	createdAt,
	status,
}) => {
	const dispatch = useDispatch();

	const date = moment(createdAt).format('MMM Do, YYYY');

	return (
		<Wrapper>
			<header>
				<div className='main-icon'>{company.charAt(0)}</div>
				<div className='info'>
					<h5>{position}</h5>
					<p>{company}</p>
				</div>
			</header>
			<div className='content'>
				<div className='content-center'>
					<JobInfo icon={<FaLocationArrow />} text={jobLocation} />
					<JobInfo icon={<FaCalendarAlt />} text={date} />
					<JobInfo icon={<FaBriefcase />} text={jobType} />
					<div className={`status ${status}`}>{status}</div>
				</div>
				<footer>
					<div className='actions'>
						<Link
							to='/add-job'
							className='btn edit-btn'
							onClick={() =>
								dispatch(
									setEditJob({
										editJobId: _id,
										position,
										company,
										jobLocation,
										jobType,
										status,
									})
								)
							}
						>
							Edit
						</Link>
						<button
							type='button'
							className='btn delete-btn'
							onClick={() => dispatch(deleteJob(_id))}
						>
							delete
						</button>
					</div>
				</footer>
			</div>
		</Wrapper>
	);
};
export default Job;
