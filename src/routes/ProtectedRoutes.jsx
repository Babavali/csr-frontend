import { Navigate, Outlet } from 'react-router-dom'
import Cookies from 'universal-cookie'

const useAuth = () => {
	const authToken = new Cookies().get('x-auth-token')
	return authToken
}

const ProtectedRoutes = () => {
	const isAuth = useAuth()
	return isAuth ? <Outlet /> : <Navigate to="/" />
}

export default ProtectedRoutes
