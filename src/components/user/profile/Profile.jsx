import { FiMail, FiPhone, FiUser } from 'react-icons/fi'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useSendLougoutMutation } from '../../../redux/apiSlices/user/authApiSlice'
import { useState } from 'react'
import EditForm from './EditForm'
import { useGetUserQuery } from '../../../redux/apiSlices/user/profileApiSlice'
import Loading from '../../loading/Loading'

function Profile() {
	const userId = useSelector(state => state.user.value._id)
	const { data: user, isLoading: loading } = useGetUserQuery(userId)

	const [sendLogout, { isLoading }] = useSendLougoutMutation()
	const [isOpenModal, setIsOpenModal] = useState(false)

	function calculateAge(dob) {
		const dobDate = new Date(dob)
		const today = new Date()

		let age = today.getFullYear() - dobDate.getFullYear()
		const monthDiff = today.getMonth() - dobDate.getMonth()
		const dayDiff = today.getDate() - dobDate.getDate()

		// Adjust age if birthday hasn't occurred yet this year
		if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
			age--
		}

		return age
	}

	const openModal = () => setIsOpenModal(true)

	const handleLogout = async () => {
		try {
			await sendLogout()
		} catch (error) {
			console.error(error)
		}
	}

	return loading ? (
		<Loading />
	) : (
		<div className='bg-blue-900 min-h-dvh p-2 md:py-10 flex'>
			<div className='max-w-2xl rounded-xl border shadow-xl shadow-gray-400 border-white p-5 bg-blue-950 mx-auto flex gap-5 flex-col'>
				<div className='flex items-center gap-5'>
					<img
						className='w-32 rounded-full ring-2 ring-green-500 p-1'
						src={user.avatar}
						alt=''
					/>
					<div className='flex gap-3 text-gray-200 flex-col'>
						<h1 className='capitalize flex items-center gap-2 font-bold text-xl'>
							<FiUser />
							{user.username}
						</h1>
						<h1 className='flex items-center gap-2'>
							<FiMail />
							{user.email}
						</h1>
						<h1 className='flex items-center gap-2'>
							<FiPhone />
							{user.mobile}
						</h1>
					</div>
				</div>
				<div className='text-gray-400 flex justify-center gap-5 items-center'>
					<h1>Age: {calculateAge(user.DOB)},</h1>
					<h1>Gender: {user.gender}</h1>
				</div>
				<p className='text-center text-gray-400 px-10'>{user.address}</p>
				<div className='flex gap-5 justify-center'>
					<Link
						to='/'
						className='ring px-3 py-1 ring-white text-white rounded-lg cursor-pointer'
					>
						Back
					</Link>
					<button
						onClick={openModal}
						className='ring px-3 py-1 ring-white bg-white rounded-lg cursor-pointer'
					>
						Edit Profile
					</button>
					<button
						onClick={handleLogout}
						disabled={isLoading}
						className='ring px-3 py-1 text-white ring-white bg-red-500 rounded-lg cursor-pointer'
					>
						Logout
					</button>
				</div>
			</div>
			<EditForm
				isModalOpen={isOpenModal}
				setIsModalOpen={setIsOpenModal}
				user={user}
			/>
		</div>
	)
}

export default Profile
