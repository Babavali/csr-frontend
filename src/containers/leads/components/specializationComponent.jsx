import * as React from 'react'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import axios from '../../../shared/axios'
import { debounce } from '@mui/material'
import { fieldToTextField } from 'formik-mui'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'

export default function specializationComponent(props) {
	const {
		form: { setTouched, setFieldValue },
	} = props
	const { error, helperText } = fieldToTextField(props)
	const [value, setValue] = React.useState(props.value)
	const [inputValue, setInputValue] = React.useState('')
	const [options, setOptions] = React.useState([])

	const delayedFetch = React.useCallback(
		debounce(async (value) => {
			await axios
				.get(`search/specialization?name=${value}`)
				.then((res) => {
					setOptions(res.data.data)
				})
				.catch((err) => {
					toast.error(err.response?.data?.data?.message, {
						position: 'bottom-left',
					})
				})
		}, 500),
		[]
	)

	React.useEffect(() => {
		setOptions([])
	}, [value])

	React.useEffect(() => {
		if (!inputValue.trim()) {
			setOptions([])
			return
		}
		delayedFetch(inputValue)
	}, [inputValue, delayedFetch])

	return (
		<Autocomplete
			name="specialization"
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
			noOptionsText={inputValue.length === 0 ? 'Search and select a specialization' : 'No categories found'}
			onChange={(_, newValue) => {
				if (newValue === null) {
					setValue('')
					setFieldValue('specialization', '')
					return
				}
				setValue(newValue.name)
				setFieldValue('specialization', newValue.id)
			}}
			isOptionEqualToValue={(option, selected) => {
				return option.id === selected.id
			}}
			onBlur={() => setTouched({ specialization: true })}
			onInputChange={(_, newInputValue) => {
				setInputValue(newInputValue)
			}}
			renderInput={(props) => {
				return <TextField {...props} error={error} helperText={helperText} label="Select a specialization *" fullWidth />
			}}
			renderOption={(props, option) => {
				return <li {...props}>{option.name}</li>
			}}
		/>
	)
}

specializationComponent.propTypes = {
	value: PropTypes.string,
}
