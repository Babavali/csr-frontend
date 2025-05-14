/* eslint-disable  no-unused-vars */
// React
import React, { useCallback, useEffect, useState } from 'react'
// Packages
import { useNavigate, useParams } from 'react-router-dom'
import { Box, Button, Divider, FormControl, FormHelperText, Grid, Input, InputLabel, Stack, useMediaQuery } from '@mui/material'
import axios from '../../shared/axios'
import { toast } from 'react-toastify'
export default function UploadLeadsPage() {
	const [selectedFile, setSelectedFile] = useState(null)
	const handleFileSelect = (event) => {
		setSelectedFile(event.target.files[0])
	}
	const handleSubmit = async () => {
		const formData = new FormData()
		formData.append('file', selectedFile)
		// formData.append('purpose', props.fileType)
		formData.append('altText', 'Lead Upload')
		const response = await axios
			.post(`sales/leads/upload-csv`, formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
			})
			.then((res) => {
				if (res?.status === 200 || res?.status === 201) {
					toast.success('Uploaded Successfully', {
						position: 'bottom-left',
					})
				}
			})
			.catch((error) => {
				toast.error(error.response?.data.data.message, {
					position: 'bottom-left',
				})
			})
	}

	return (
		<>
			<Box width="100%" height="75vh" display="flex" justifyContent="center" alignItems="center">
				<FormControl>
					<Input
						type="file"
						id="upload-csv"
						onChange={handleFileSelect}
						accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
					/>
					<FormHelperText id="upload-csv">Only CSV</FormHelperText>
					<Button
						type="submit"
						variant="contained"
						onClick={handleSubmit}
						sx={{
							mt: 6,
						}}>
						Upload File
					</Button>
				</FormControl>
			</Box>
		</>
	)
}
