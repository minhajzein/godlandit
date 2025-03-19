import { FcConferenceCall } from 'react-icons/fc'
import { useGetDashboardQuery } from '../../../redux/apiSlices/admin/adminDashboardApiSlice'
import Loading from '../../loading/Loading'
import Card from './Card'

function Home() {
	const { data, isLoading } = useGetDashboardQuery()

	return isLoading ? (
		<Loading />
	) : (
		<div className='grid grid-cols-2 md:grid-cols-4'>
			<Card Icon={FcConferenceCall} count={data?.users} title={'Total Users'} />
		</div>
	)
}

export default Home
