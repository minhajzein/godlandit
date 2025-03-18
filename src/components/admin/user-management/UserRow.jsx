import { toast } from 'react-toastify'
import {
	selectUsersById,
	useBanUnbanUserMutation,
	useDeleteUserMutation,
} from '../../../redux/apiSlices/admin/usersApiSlice'
import { useSelector } from 'react-redux'
import { FaBan, FaTrashAlt } from 'react-icons/fa'
import { MdVerifiedUser } from 'react-icons/md'
import { ImSpinner3 } from 'react-icons/im'

function UserRow({ userId }) {
	const user = useSelector(state => selectUsersById(state, userId))

	const [banOrUnban, { isLoading }] = useBanUnbanUserMutation()
	const [deleteUser, { isLoading: deleting }] = useDeleteUserMutation()

	const changeStatus = async () => {
		try {
			const result = await banOrUnban(userId)
			if (result.data?.success) {
				if (!user.isBanned) {
					toast.error(user.username + ' is blocked', {
						position: 'top-center',
						theme: 'colored',
					})
				} else {
					toast.success(user.username + ' is unlocked', {
						position: 'top-center',
						theme: 'colored',
					})
				}
			} else {
				toast.error(result.err_msg, {
					position: 'top-center',
					theme: 'colored',
				})
			}
		} catch (error) {
			console.log(error)
		}
	}

	const handleDelete = async () => {
		try {
			const { data } = await deleteUser(userId)
			if (data.success) {
				toast.success(data.message)
			} else {
				toast.error(data.message)
			}
		} catch (error) {
			console.error(error)
		}
	}

	if (user) {
		return (
			<tr className='border border-black'>
				<td className='p-2 flex justify-center items-center border-r border-black'>
					<img
						src={user.avatar ? user.avatar : '/images/profile_dummy.jpg'}
						className={`h-12 cursor-pointer rounded-full border-2 ${
							user.isBanned ? 'border-red-600' : 'border-green-600'
						}`}
						alt='profile'
					/>
				</td>
				<td className='p-2 border-r border-black'>{user.username}</td>
				<td className='p-2 border-r border-black'>{user.email}</td>
				<td className='p-2 border-r border-black'>{user.mobile}</td>
				<td className='p-2 border-r border-black'>{user.gender}</td>
				<td className='p-2 flex items-center gap-2'>
					<button onClick={changeStatus} className='p-2 text-xl cursor-pointer'>
						{isLoading ? (
							<ImSpinner3 className='animate-spin' />
						) : user.isBanned ? (
							<FaBan className='text-red-500' />
						) : (
							<MdVerifiedUser className='text-green-500' />
						)}
					</button>
					<button className='p-2 text-xl cursor-pointer' onClick={handleDelete}>
						{deleting ? (
							<ImSpinner3 className='animate-spin' />
						) : (
							<FaTrashAlt className='text-red-500' />
						)}
					</button>
				</td>
			</tr>
		)
	} else return null
}

export default UserRow
