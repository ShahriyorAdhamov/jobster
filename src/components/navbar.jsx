import { useState } from 'react';
import { FaAlignLeft, FaCaretDown, FaUserCircle } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import Wrapper from '../assets/wrappers/Navbar';
import { clearValues } from '../features/job/job-slice';
import { logoutUser, toggleSidebar } from '../features/user/user-slice';
import Logo from './logo';

const Navbar = () => {
	const [showLogout, setShowLogout] = useState(false);
	const { user } = useSelector(store => store.user);
	const dispatch = useDispatch();

	const toggle = () => {
		dispatch(toggleSidebar());
	};

	const userLogout = () => {
		dispatch(logoutUser());
		dispatch(clearValues());
	};

	return (
		<Wrapper>
			<div className='nav-center'>
				<button type='button' className='toggle-btn' onClick={toggle}>
					<FaAlignLeft />
				</button>
				<div>
					<Logo />
					<h3 className='logo-text'>dashboard</h3>
				</div>
				<div className='btn-container'>
					<button
						type='button'
						className='btn'
						onClick={() => setShowLogout(!showLogout)}
					>
						<FaUserCircle />
						{user?.name}
						<FaCaretDown />
					</button>
					<div className={showLogout ? 'dropdown show-dropdown' : 'dropdown'}>
						<button type='button' className='dropdown-btn' onClick={userLogout}>
							logout
						</button>
					</div>
				</div>
			</div>
		</Wrapper>
	);
};
export default Navbar;
