import { useSelector } from 'react-redux'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

function Public() {
	const adminToken = useSelector(state => state.adminToken.adminToken)
	const location = useLocation()

	return adminToken !== null ? (
		<Navigate to='/admin' state={{ from: location }} replace />
	) : (
		<Outlet />
	)
}

export default Public
