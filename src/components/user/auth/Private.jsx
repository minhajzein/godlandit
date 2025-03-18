import { useSelector } from 'react-redux'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

function Private() {
	const location = useLocation()
	const token = useSelector(state => state.auth.token)
	return token !== null ? (
		<Outlet />
	) : (
		<Navigate to='/login' state={{ from: location }} replace />
	)
}

export default Private
