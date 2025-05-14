import * as React from 'react'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import axios from '../../../shared/axios'
import { debounce } from '@mui/material'
import { fieldToTextField } from 'formik-mui'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'

export default function CityComponent(props) {
	const {
		form: { setTouched, setFieldValue },
	} = props
	const { error, helperText } = fieldToTextField(props)
	const [value, setValue] = React.useState(props.value)
	const [inputValue, setInputValue] = React.useState('')
	const [options, setOptions] = React.useState([])

	const delayedFetch = React.useCallback(
		debounce(async (value) => {
			const country = props.form.values.patientCountry
			const state = props.form.values.patientState
			if (state) {
				await axios
					.get(`search/city?country_id=${country}&state_id=${state}&name=${value}`)
					.then((res) => {
						setOptions(res.data.data)
					})
					.catch((err) => {
						toast.error(err.response?.data?.data?.message, {
							position: 'bottom-left',
						})
					})
			}
		}, 500),
		[props.form.values.patientCountry, props.form.values.patientState]
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
			name="patientCity"
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
			noOptionsText={
				props.form.values.patientState && props.form.values.patientCountry
					? inputValue.length === 0
						? 'Search and select a city'
						: 'No cities found'
					: null
			}
			onChange={(_, newValue) => {
				if (newValue === null) {
					setValue('')
					setFieldValue('patientCity', '')
					return
				}
				setValue(newValue.name)
				setFieldValue('patientCity', newValue.id)
			}}
			isOptionEqualToValue={(option, selected) => {
				return option.id === selected.id
			}}
			onBlur={() => setTouched({ patientCity: true })}
			onInputChange={(_, newInputValue) => {
				setInputValue(newInputValue)
			}}
			renderInput={(params) => (
				<TextField
					{...params}
					disabled={!props.form.values.patientState}
					error={error}
					helperText={helperText}
					label="Select a city"
					fullWidth
				/>
			)}
			renderOption={(props, option) => {
				return <li {...props}>{option.name}</li>
			}}
		/>
	)
}

CityComponent.propTypes = {
	value: PropTypes.string,
}
