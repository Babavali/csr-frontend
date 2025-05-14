/* eslint-disable no-unused-vars*/
import { Box, Button, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { toast } from 'react-toastify'
import axios from '../../../../shared/axios'
export default function FileUploadCSV(props) {
	// const [file, setFile] = useState()
	const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
		accept: {
			'.csv, text/csv, application/vnd.ms-excel, application/csv, text/x-csv, application/x-csv, text/comma-separated-values, text/x-comma-separated-values':
				[],
		},
		maxFiles: 1,
		onDrop: async (acceptedFiles, rejectedFiles, errors) => {
			if (rejectedFiles.length > 0) {
				toast.error('File type not supported', {
					position: 'bottom-left',
				})
			} else if (acceptedFiles.length > 0) {
				// setFile(acceptedFiles)
				// const formData = new FormData()
				// formData.append('file', acceptedFiles)
				// const response = await axios.post(`sales/leads/upload-csv`, acceptedFiles, {
				// 	headers: { 'Content-Type': 'multipart/form-data' },
				// })
				let newFiles = [...acceptedFiles]
				const otherFiles = []
				newFiles.forEach((file, index) => {
					otherFiles.push(file)
				})
				newFiles = [...otherFiles]
				const ids = []
				newFiles.forEach(async (file) => {
					const formData = new FormData()
					formData.append('file', file)
					formData.append('purpose', props.fileType)
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
					file.uploaded = true
					file.responseId = response.data.data.id
					file.responseUrl = response.data.data.publicUrl
					ids.push(response.data.data.id)
				})
			}
		},
	})

	// const uploadCSV = () => {}

	return (
		<Box display="flex" justifyContent="center" width="100%">
			<Box>
				<section className="container">
					<div {...getRootProps({ className: 'dropzone' })}>
						<input {...getInputProps()} />
						<p
							style={{
								display: 'flex',
								height: '100px',
								color: 'black',
								backgroundColor: '#FAFAFA',
								alignItems: 'center',
								textAlign: 'center',
								justifyContent: 'center',
								border: '1px dashed #d3d3d3',
							}}>
							Drag and drop some files here, or click to select files (Only .csv files are allowed)
						</p>
					</div>
					<aside>
						{/* <h4>Files</h4>
						<ul>{JSON.stringify(file)}</ul> */}
					</aside>
				</section>
				{/* <Box textAlign="center" mt={4}>
					<Button variant="contained" onClick={uploadCSV}>
						Upload CSV
					</Button>
				</Box> */}
			</Box>
		</Box>
	)
}
