import { Route, Routes } from 'react-router-dom'
import UserRoutes from './routes/UserRoutes'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Persist from './components/user/persist/Persist'

function App() {
	return (
		<>
			<Routes>
				<Route element={<Persist />}>
					<Route path='/*' element={<UserRoutes />} />
				</Route>
			</Routes>
			<ToastContainer />
		</>
	)
}

export default App
