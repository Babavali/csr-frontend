import * as React from 'react'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import axios from '../../../shared/axios'
import { debounce } from '@mui/material'
import { fieldToTextField } from 'formik-mui'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'

export default function StateComponent(props) {
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
			if (country) {
				await axios
					.get(`search/state?country_id=${country}&name=${value}`)
					.then((res) => {
						setOptions(res.data.data)
					})
					.catch((err) => {
						toast.error(err.response?.data.data.message, {
							position: 'bottom-left',
						})
					})
			}
		}, 500),
		[props.form.values.patientCountry]
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
			name="patientState"
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
				props.form.values.patientCountry ? (inputValue.length === 0 ? 'Search and select a state' : 'No states found') : null
			}
			onChange={(_, newValue) => {
				if (newValue === null) {
					setValue('')
					setFieldValue('patientState', '')
					return
				}
				setValue(newValue.name)
				setFieldValue('patientState', newValue.id)
			}}
			isOptionEqualToValue={(option, selected) => {
				return option.id === selected.id
			}}
			onBlur={() => setTouched({ patientState: true })}
			onInputChange={(_, newInputValue) => {
				setInputValue(newInputValue)
			}}
			renderInput={(params) => (
				<TextField
					{...params}
					disabled={!props.form.values.patientCountry}
					error={error}
					helperText={helperText}
					label="Select a state"
					fullWidth
				/>
			)}
			renderOption={(props, option) => {
				return <li {...props}>{option.name}</li>
			}}
		/>
	)
}

StateComponent.propTypes = {
	value: PropTypes.string,
}
