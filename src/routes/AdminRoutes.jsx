import { Outlet, Route, Routes } from 'react-router-dom'
import Public from '../components/admin/auth/Public'
import AdminLogin from '../components/admin/auth/AdminLogin'
import Home from '../components/admin/home/Home'
import Private from '../components/admin/auth/Private'
import PageNotFound from '../components/404/PageNotFound'
import Layout from '../components/admin/layouts/Layout'
import Users from '../components/admin/user-management/Users'

function AdminRoutes() {
	return (
		<Routes>
			<Route element={<Outlet />}>
				<Route element={<Public />}>
					<Route path='login' element={<AdminLogin />} />
				</Route>
				<Route element={<Private />}>
					<Route element={<Layout />}>
						<Route path='/' element={<Home />} />
						<Route path='users' element={<Users />} />
					</Route>
				</Route>
				<Route path='*' element={<PageNotFound />} />
			</Route>
		</Routes>
	)
}

export default AdminRoutes
