import Loading from '../../loading/Loading'
import UserRow from './UserRow'
import { useGetAllUsersQuery } from '../../../redux/apiSlices/admin/usersApiSlice'
import { motion as m } from 'framer-motion'

function Users() {
	const {
		data: users,
		isLoading,
		isSuccess,
		isError,
		error,
	} = useGetAllUsersQuery()

	let content

	if (isLoading) content = <Loading />

	if (isSuccess) {
		const { ids } = users
		const tableContent = ids?.length
			? ids.map(userId => <UserRow key={userId} userId={userId} />)
			: null
		content = (
			<m.div
				className='w-full'
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5 }}
				exit={{ opacity: 0 }}
			>
				<table className='w-full bg-slate-200 rounded'>
					<thead className='bg-gray-400 border-2 border-black rounded'>
						<tr>
							<th className='py-5 border-r border-black' scope='col'>
								Profile
							</th>
							<th className='py-5 border-r border-black' scope='col'>
								Name
							</th>
							<th className='py-5 border-r border-black' scope='col'>
								Email
							</th>
							<th className='py-5 border-r border-black' scope='col'>
								Mobile
							</th>
							<th className='py-5 border-r border-black' scope='col'>
								Gender
							</th>
							<th className='py-5' scope='col'>
								Actions
							</th>
						</tr>
					</thead>
					<tbody>{tableContent}</tbody>
				</table>
			</m.div>
		)
	}
	return content
}

export default Users
