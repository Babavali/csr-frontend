import * as React from 'react'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import axios from '../../../../shared/axios'
import { debounce } from '@mui/material'
import PropTypes from 'prop-types'

export default function PartnerComponent(props) {
	const [value, setValue] = React.useState(props.value)
	const [inputValue, setInputValue] = React.useState('')
	const [options, setOptions] = React.useState([])

	const delayedFetch = React.useCallback(
		debounce(async (value) => {
			const response = await axios.get(`sales/employee/partner/search?name=${value}`)
			setOptions(response.data.data)
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
			getOptionLabel={(option) => {
				return option?.full_name
			}}
			filterOptions={(x) => x}
			size="small"
			fullWidth
			style={{ maxWidth: 300 }}
			options={options}
			autoComplete
			includeInputInList
			filterSelectedOptions
			value={value}
			noOptionsText={inputValue.length === 0 ? 'Search and select a name' : 'No names found'}
			onChange={(_, newValue) => {
				if (newValue === null) {
					setValue('')
					props.handlePartnerChange(null)
				} else {
					setValue(newValue.full_name)
					props.handlePartnerChange(newValue.id)
				}
			}}
			isOptionEqualToValue={(option, selected) => {
				return option.id === selected.id
			}}
			onInputChange={(_, newInputValue) => {
				setInputValue(newInputValue)
			}}
			renderInput={(props) => <TextField {...props} label="Search partner name" fullWidth />}
			renderOption={(props, option) => {
				return <li {...props}>{option.full_name}</li>
			}}
		/>
	)
}

PartnerComponent.propTypes = {
	value: PropTypes.string,
	handlePartnerChange: PropTypes.func,
}

PartnerComponent.defaultProps = {
	handlePartnerChange: () => {},
}
