/*
common file for defining reusable validation schema that are to be used for forms.
*/
import * as Yup from 'yup'

const emailRegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
const nameRegExp = /^[a-z ,.'-]+$/i
const onlyNumbersRegExp = /^[0-9]*$/

export const Validations = {
	firstName: Yup.string()
		.trim()
		.min(2, 'First Name should be atleast 2 characters long')
		.required('Please enter your First name')
		.max(40, 'Name must be less than or equal to 40 characters')
		.matches(nameRegExp, 'Please enter a valid name'),
	lastName: Yup.string()
		.trim()
		.min(2)
		.required('Please enter your last name')
		.max(40, ' First Name must be less than or equal to 40 characters')
		.matches(/^[A-Za-z ]*$/, 'Please enter valid name'),
	name: Yup.string()
		.trim()
		.min(2, 'Name should be atleast 2 characters long')
		.required('Please enter your name')
		.max(40, 'Name must be less than or equal to 40 characters')
		.matches(nameRegExp, 'Please enter a valid name'),
	email: Yup.string().required('Please enter your email').matches(emailRegExp, 'Please enter a valid E-Mail'),
	password: Yup.string().required('Please enter your password').min(8, 'Password should be minimum 8 characters'),
	confirmPassword: Yup.string()
		.oneOf([Yup.ref('password')], 'Password does not match')
		.required('Confirm Password is Required'),
	phoneNumber: Yup.string()
		.required('Please enter phone number')
		.min(7, 'Phone Number must be atleast 7 characters')
		.max(15, 'Phone Number must be less than or equal to 15 characters'),
	required: Yup.string().nullable().required('Required'),
	dateOfBirth: Yup.date().nullable().min(new Date('1900-01-01T00:00:00.000Z'), 'Must be greater than 1900 ').max(new Date()),
	amount: Yup.string().matches(onlyNumbersRegExp, 'Amount should contain only digits.'),
}
