import { Outlet, Route, Routes } from 'react-router-dom'
import Register from '../components/user/auth/Register'
import Home from '../components/user/home/Home'
import Profile from '../components/user/profile/Profile'
import PageNotFound from '../components/404/PageNotFound'
import Login from '../components/user/auth/Login'
import Public from '../components/user/auth/Public'
import Private from '../components/user/auth/Private'
import ForgotPassword from '../components/user/auth/ForgotPassword'

function UserRoutes() {
	return (
		<Routes>
			<Route element={<Outlet />}>
				<Route element={<Public />}>
					<Route path='register' element={<Register />} />
					<Route path='login' element={<Login />} />
					<Route path='reset-password' element={<ForgotPassword />} />
				</Route>
				<Route element={<Private />}>
					<Route path='/' element={<Home />} />
					<Route path='profile' element={<Profile />} />
				</Route>
				<Route path='*' element={<PageNotFound />} />
			</Route>
		</Routes>
	)
}

export default UserRoutes
