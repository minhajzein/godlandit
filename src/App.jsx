import { Route, Routes } from 'react-router-dom'
import UserRoutes from './routes/UserRoutes'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Persist from './components/user/persist/Persist'
import AdminRoutes from './routes/AdminRoutes'
import AdminPersist from './components/admin/auth/AdminPersist'

function App() {
	return (
		<>
			<Routes>
				<Route element={<Persist />}>
					<Route path='/*' element={<UserRoutes />} />
				</Route>
				<Route element={<AdminPersist />}>
					<Route path='/admin/*' element={<AdminRoutes />} />
				</Route>
			</Routes>
			<ToastContainer />
		</>
	)
}

export default App
