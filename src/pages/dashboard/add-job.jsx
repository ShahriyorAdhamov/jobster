import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Wrapper from '../../assets/wrappers/DashboardFormPage';
import { FormRow, FormRowSelect } from '../../components';
import {
	clearValues,
	createJob,
	editJob,
	handleChange,
} from '../../features/job/job-slice';
const AddJob = () => {
	const {
		isLoading,
		position,
		company,
		jobLocation,
		jobType,
		jobTypeOptions,
		status,
		statusOptions,
		isEditing,
		editJobId,
	} = useSelector(store => store.job);
	const { user } = useSelector(state => state.user);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		if (!isEditing) {
			dispatch(
				handleChange({
					name: 'jobLocation',
					value: user.location,
				})
			);
		}
	}, []);

	const handleSubmit = e => {
		e.preventDefault();
		if (!position || !company || !jobLocation) {
			toast.error('Please fill out all fields');
			return;
		}

		if (isEditing) {
			dispatch(
				editJob({
					jobId: editJobId,
					job: { position, company, jobLocation, jobType, status },
				})
			);
			navigate('/all-jobs');
			return;
		}

		dispatch(createJob({ position, company, jobLocation, jobType, status }));
	};

	const handleJobInput = e => {
		const name = e.target.name;
		const value = e.target.value;
		dispatch(handleChange({ name, value }));
	};

	return (
		<Wrapper>
			<form className='form'>
				<h3>{isEditing ? 'edit job' : 'add job'}</h3>
				<div className='form-center'>
					{/* position */}
					<FormRow
						type='text'
						name='position'
						value={position}
						handleChange={handleJobInput}
					/>
					{/* company */}
					<FormRow
						type='text'
						name='company'
						value={company}
						handleChange={handleJobInput}
					/>
					{/* jobLocation */}
					<FormRow
						type='text'
						name='jobLocation'
						labelText='job location'
						value={jobLocation}
						handleChange={handleJobInput}
					/>
					{/* status */}
					<FormRowSelect
						name='status'
						value={status}
						handleChange={handleJobInput}
						list={statusOptions}
					/>
					{/* job type*/}
					<FormRowSelect
						name='jobType'
						labelText='job type'
						value={jobType}
						handleChange={handleJobInput}
						list={jobTypeOptions}
					/>
					<div className='btn-container'>
						<button
							type='button'
							className='btn btn-block clear-btn'
							onClick={() => dispatch(clearValues())}
						>
							clear
						</button>
						<button
							type='submit'
							className='btn btn-block submit-btn'
							onClick={handleSubmit}
							disabled={isLoading}
						>
							submit
						</button>
					</div>
				</div>
			</form>
		</Wrapper>
	);
};
export default AddJob;
