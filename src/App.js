import * as React from 'react'
import { useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import AppRoutes from './routes/routes'
import { AxiosInterceptor } from './shared/axios'
import 'react-toastify/dist/ReactToastify.css'

export default function MyApp() {
	useEffect(() => {}, [window.location.pathName])
	return (
		<>
			<Router>
				<AxiosInterceptor>
					<AppRoutes />
				</AxiosInterceptor>
			</Router>
			<ToastContainer
				position="bottom-right"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="light"
			/>
		</>
	)
}
