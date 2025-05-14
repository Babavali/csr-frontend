// React
import React, { useState, useEffect } from 'react'
// Packages
import axios from '../../../../shared/axios'
import { toast } from 'react-toastify'
// MUI Components
import { Box, IconButton, Button } from '@mui/material'
// MUI Icons
import AddIcon from '@mui/icons-material/Add'
import SaveIcon from '@mui/icons-material/Save'
// Add Category Components
import AddCategoryCard from './addCategoryCard'

export default function AddCategory(props) {
	// Variables
	const memeber_id = props.memeber_id
	const matches = props.matches
	// useState
	const [categoryList, setCategoryList] = useState([])
	const [categoriesData, setCategoriesData] = useState([
		{
			category_id: null,
			source_url: '',
			is_domestic: 0,
			is_international: 0,
			old_sales_emp_id: null,
		},
	])
	const [previousDataLength, setPreviousDataLength] = useState(-1)

	// Fetch Data
	const getCategories = () => {
		axios.get(`search/category?name`).then((res) => {
			setCategoryList(res.data.data)
		})
	}
	const getPreviousData = () => {
		axios
			.get(`/sales/employee/${memeber_id}/allocate-leads`)
			.then((res) => {
				const savedCategoriesData = res.data.data
				setPreviousDataLength(savedCategoriesData.length)
				setCategoriesData([...savedCategoriesData, ...categoriesData])
			})
			.catch((err) => {
				toast.error(err.response.data.data.message, {
					position: 'bottom-left',
				})
			})
	}
	useEffect(getCategories, [])
	useEffect(getPreviousData, [])
	// Event Listeners
	const handleAddCategory = () => {
		setCategoriesData([
			...categoriesData,
			{
				category_id: null,
				source_url: '',
				is_domestic: 0,
				is_international: 0,
				old_sales_emp_id: null,
			},
		])
	}
	const handleChange = (index, name, value) => {
		const values = [...categoriesData]
		values[index][name] = value
		setCategoriesData(values)
	}
	const handleSave = () => {
		for (let i = previousDataLength; i < categoriesData.length; i++) {
			if (!(categoriesData[i]['category_id'] === null && categoriesData[i]['source_url'] === '')) {
				// Don't save the data when both category_id and source_url are empty.
				axios
					.post(`/sales/employee/${memeber_id}/allocate-leads`, categoriesData[i])
					.then(() => {
						toast.success('Saved successfully', {
							position: 'bottom-left',
						})
					})
					.catch((error) => {
						toast.error(error.response.data.data.message, {
							position: 'bottom-left',
						})
					})
			}
		}
		setTimeout(() => {
			window.location.reload()
		}, 3000)
	}
	const handleDelete = (index) => {
		const payload = categoriesData[index]
		if (payload.id) {
			axios
				.delete(`sales/employee/${memeber_id}/allocate-leads/${payload.id}`)
				.then((res) => {
					if (res?.status === 200) {
						toast.success('Deleted successfully', {
							position: 'bottom-left',
						})
					}
				})
				.catch((error) => {
					toast.error(error.response.data.data.message, {
						position: 'bottom-left',
					})
				})
		}

		setTimeout(() => {
			window.location.reload()
		}, 2000)
	}

	return (
		<Box display="flex" justifyContent="center" alignItems="center">
			<Box>
				<IconButton size="large" color="primary" onClick={handleAddCategory}>
					<AddIcon fontSize="large" />
				</IconButton>
				{categoriesData.map((data, index) => (
					<AddCategoryCard
						key={index}
						matches={matches}
						categoryList={categoryList}
						data={data}
						index={index}
						previousDataLength={previousDataLength}
						handleChange={handleChange}
						handleDelete={handleDelete}
					/>
				))}
				<Button variant="contained" endIcon={<SaveIcon />} onClick={handleSave}>
					Save
				</Button>
			</Box>
		</Box>
	)
}
