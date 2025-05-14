import * as React from 'react'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import axios from '../../../shared/axios'
import { debounce } from '@mui/material'
import { fieldToTextField } from 'formik-mui'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'

export default function CountryComponent(props) {
	const {
		form: { setTouched, setFieldValue },
		field: { name },
		shouldCopy,
		option,
	} = props
	const { error, helperText } = fieldToTextField(props)
	const [value, setValue] = React.useState(props.value)
	const [inputValue, setInputValue] = React.useState('')
	const [options, setOptions] = React.useState([])

	const delayedFetch = React.useCallback(
		debounce(async (value) => {
			await axios
				.get(`search/country?name=${value}`)
				.then((res) => {
					setOptions(res.data.data)
				})
				.catch((err) => {
					toast.error(err.response?.data.data.message, {
						position: 'bottom-left',
					})
				})
		}, 500),
		[]
	)

	React.useEffect(() => {
		if (!inputValue.trim()) {
			setOptions([])
			return
		}
		delayedFetch(inputValue)
	}, [inputValue, delayedFetch])

	return (
		<Autocomplete
			name={name}
			getOptionLabel={(option) => {
				return option?.name || option || props.value
			}}
			filterOptions={(x) => x}
			size="small"
			options={options}
			autoComplete
			includeInputInList
			filterSelectedOptions
			value={value}
			noOptionsText={inputValue.length === 0 ? 'Search and select a country' : 'No countries found'}
			onChange={(_, newValue) => {
				if (newValue === null) {
					setValue('')
					setFieldValue(name, '')
				} else {
					setValue(newValue.name)
					setFieldValue(name, newValue.id)
					setFieldValue(option, newValue.name)
					if (shouldCopy) {
						setFieldValue('patientCountry', newValue.id)
						setFieldValue('patientCountryName', newValue.name)
					}
				}
				if (name === 'patientCountry') {
					setFieldValue('patientCity', null)
					setFieldValue('patientCityName', '')
				}
			}}
			isOptionEqualToValue={(option, selected) => {
				return option.id === selected.id
			}}
			onBlur={() => setTouched({ [name]: true })}
			onInputChange={(_, newInputValue) => {
				setInputValue(newInputValue)
			}}
			renderInput={(props) => <TextField {...props} error={error} helperText={helperText} label="Select a country *" fullWidth />}
			renderOption={(props, option) => {
				return <li {...props}>{option.name}</li>
			}}
		/>
	)
}

CountryComponent.propTypes = {
	value: PropTypes.string,
}
