import axios from 'axios'
// import { toast } from "react-toastify";
import config from '../config'
// import Cookies from 'universal-cookie'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from '../slices/userDetailsSlice'
import Cookies from 'universal-cookie'

const axiosClient = axios.create({
	baseURL: config.api.baseURL,
	headers: {
		'Content-Type': 'application/json',
	},
})

const AxiosInterceptor = ({ children }) => {
	const navigate = useNavigate()
	const dispatch = useDispatch()

	const [isSet, setIsSet] = useState(false)

	useEffect(() => {
		const resInterceptor = (response) => {
			return response
		}
		const errInterceptor = (error) => {
			if (error.response.status === 401) {
				navigate('/login')
				const authToken = new Cookies().remove('x-auth-token', { path: '/' })
				if (!authToken) {
					navigate('/login')
				}
				dispatch(logout())
			}
			return Promise.reject(error)
		}

		const interceptor = axiosClient.interceptors.response.use(resInterceptor, errInterceptor)
		setIsSet(true)
		return () => axiosClient.interceptors.response.eject(interceptor)
	})
	return isSet && children
}

// To set the updated value of 'x-auth-token' everytime we request from axios
//Helpful in the cases like when the token expires after some time or changes for some reason
axiosClient.interceptors.request.use(function (request) {
	const authToken = new Cookies().get('x-auth-token')
	if (authToken !== null) {
		request.headers['x-auth-token'] = authToken
	}
	return request
})

// axiosClient.interceptors.response.use(
//   function (response) {
//     return response;
//   },
//   function (error) {
//     // Any status codes that falls outside the range of 2xx cause this function to trigger
//     const navigate = useNavigate();

//     const redirectHandler = (path) => {
//       navigate(path);
//     };

//     if (error?.response?.data?.statusCode === 401) {
//       //TODO redirect it to login page
//       redirectHandler("/login");
//     } else {
//       // TODO snackbar
//       toast.error("ERROR => ", error?.response?.data);
//     }
//     return Promise.reject(error);
//   }
// );

export default axiosClient
export { AxiosInterceptor }
