import { useSelector } from 'react-redux'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

function Private() {
	const location = useLocation()
	const adminToken = useSelector(state => state.adminToken.adminToken)

	return adminToken !== null ? (
		<Outlet />
	) : (
		<Navigate to='/admin/login' state={{ from: location }} replace />
	)
}

export default Private
