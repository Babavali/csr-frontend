/* eslint-disable no-unused-vars*/
// React
import React, { useEffect, useState, useRef } from 'react'
// MUI Components
import {
	Box,
	Divider,
	TextField,
	IconButton,
	Autocomplete,
	Typography,
	Checkbox,
	FormControlLabel,
	FormControl,
	FormGroup,
} from '@mui/material'
// MUI Icons
import DeleteIcon from '@mui/icons-material/Delete'
export default function AddCategoryCard({ matches, categoryList, data, index, previousDataLength, handleChange, handleDelete }) {
	// useState
	const [disableCategoryDropdown, setDisableCategoryDropdown] = useState(false)
	const [disableCategoryURL, setDisableCategoryURL] = useState(false)

	const [categoryURLData, setCategoryURLData] = useState(data.source_url)
	const [categorySalesEmpIDChange, setCategorySalesEmpIDChange] = useState(data.old_sales_emp_id)
	//
	let categoryDropdownData = null

	if (data.category_id && data.category_id > 0) {
		let category_name = null
		for (let i = 0; i < categoryList.length; i++) {
			if (categoryList[i]['id'] === data.category_id) {
				category_name = categoryList[i]['name']
			}
		}
		categoryDropdownData = {
			name: category_name,
			id: data.category_id,
		}
	}

	useEffect(() => {
		if (categoryURLData || categorySalesEmpIDChange) {
			setDisableCategoryDropdown(true)
		} else {
			setDisableCategoryDropdown(false)
		}
	}, [categoryURLData, categorySalesEmpIDChange])

	// Event Handlers
	const handleCategoryDropdownChange = (event, categoryValue) => {
		if (categoryValue) {
			handleChange(index, 'category_id', categoryValue.id)
			setDisableCategoryURL(true)
		} else {
			setDisableCategoryURL(false)
		}
	}
	const handleCategoryURLChange = (event) => {
		// const categoryValue = event.target.value
		setCategoryURLData(event.target.value)
		handleChange(index, 'source_url', event.target.value)
	}
	const handleCategoryURLPaste = (event) => {
		const pasteData = event.clipboardData.getData('Text')
		const categoryURL = categoryURLData + pasteData
		setCategoryURLData(categoryURL)
		handleChange(index, 'source_url', categoryURL)
		event.preventDefault()
	}
	const handleCategorySalesEmpIDChange = (event) => {
		// const categoryValue = event.target.value
		setCategorySalesEmpIDChange(event.target.value)
		handleChange(index, 'old_sales_emp_id', event.target.value)
	}
	const handleCategoryisDomesticChange = (event) => {
		const isDomesticValue = event.target.checked
		if (isDomesticValue) {
			handleChange(index, 'is_domestic', 1)
		} else {
			handleChange(index, 'is_domestic', 0)
		}
	}
	const handleCategoryisInternationalChange = (event) => {
		const isInternationalValue = event.target.checked
		if (isInternationalValue) {
			handleChange(index, 'is_international', 1)
		} else {
			handleChange(index, 'is_international', 0)
		}
	}

	return (
		<Box my={4}>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: matches ? 'start' : 'center',
					flexDirection: matches ? 'row' : 'column',
				}}>
				{/* Autocomplete Start */}
				<Box>
					<Autocomplete
						id="category-select-demo"
						disabled={disableCategoryDropdown || index < previousDataLength}
						onChange={(event, value) => handleCategoryDropdownChange(event, value)}
						sx={{ width: matches ? 450 : 330 }}
						options={categoryList}
						autoHighlight
						getOptionLabel={(option) => option.name}
						value={data.category_id || data.source_url ? categoryDropdownData : null}
						renderOption={(props, option) => (
							<Box component="li" {...props}>
								{option.name}
							</Box>
						)}
						renderInput={(params) => (
							<TextField
								{...params}
								label="Select Category"
								InputLabelProps={{
									shrink: true,
								}}
								disabled={disableCategoryDropdown || index < previousDataLength}
								inputProps={{
									...params.inputProps,
									autoComplete: 'new-password', // disable autocomplete and autofill
								}}
							/>
						)}
					/>
					<FormControl>
						<FormGroup row>
							<FormControlLabel
								control={
									<Checkbox
										checked={data.is_domestic}
										onChange={(event) => handleCategoryisDomesticChange(event)}
										name="Domestic"
									/>
								}
								disabled={disableCategoryDropdown || index < previousDataLength}
								label="Domestic"
							/>
							<FormControlLabel
								control={
									<Checkbox
										checked={data.is_international}
										onChange={(event) => handleCategoryisInternationalChange(event)}
										name="International"
									/>
								}
								label="International"
								disabled={disableCategoryDropdown || index < previousDataLength}
							/>
						</FormGroup>
					</FormControl>
				</Box>
				{/* Autocomplete End */}
				<Typography mx={4} my={1} variant="h6" sx={{ fontWeight: 'bold' }}>
					OR
				</Typography>
				{/* URL Start */}
				<Box>
					<Box display="flex">
						<TextField
							InputLabelProps={{
								shrink: true,
							}}
							sx={{ width: matches ? 450 : 230 }}
							label="Category URL"
							disabled={disableCategoryURL || index < previousDataLength}
							variant="outlined"
							value={categoryURLData || data.source_url}
							onChange={(event) => handleCategoryURLChange(event)}
							onPaste={(event) => handleCategoryURLPaste(event)}
						/>
						<TextField
							style={{ width: 100, marginLeft: 2 }}
							InputLabelProps={{
								shrink: true,
							}}
							label="ID"
							disabled={disableCategoryURL || index < previousDataLength}
							variant="outlined"
							value={categorySalesEmpIDChange || data.old_sales_emp_id}
							onChange={(event) => handleCategorySalesEmpIDChange(event, index)}
						/>
					</Box>
				</Box>
				{/* URL End */}
				<IconButton mx={4} size="large" onClick={() => handleDelete(index)}>
					<DeleteIcon fontSize="large" color="error" />
				</IconButton>
			</Box>
			<Divider sx={{ marginTop: 1, marginBottom: 5 }} />
		</Box>
	)
}
