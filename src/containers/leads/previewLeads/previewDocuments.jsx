import { Box, Divider, Grid, Stack, Typography } from '@mui/material'
import React, { useCallback } from 'react'
import { useState } from 'react'
import axios from '../../../shared/axios'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import FileViewComponent from '../previewLeads/components/fileViewComponent'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import IconButton from '@mui/material/IconButton'
import noDocs from '../../../assets/no-documents.png'
import { toast } from 'react-toastify'

const classifyFiles = (files) => {
	const images = []
	const otherFiles = []
	files?.map((file) => {
		if (file.public_url.match(/\.(jpg|jpeg|png)$/i)) {
			images.push(file)
		} else {
			otherFiles.push(file)
		}
	})
	return { images, otherFiles }
}

function PreviewDocuments() {
	const { lead_id } = useParams()
	const [data, setData] = useState()

	const navigate = useNavigate()

	const fetchPreviewData = useCallback(async () => {
		await axios
			.get(`/sales/leads/${lead_id}/show`)
			.then((res) => {
				setData(res.data?.data?.media)
			})
			.catch((err) => {
				toast.error(err.response?.data?.data?.message, {
					position: 'bottom-left',
				})
			})
	}, [lead_id])

	useEffect(() => {
		fetchPreviewData()
	}, [fetchPreviewData])

	return (
		<Box style={{ width: '100%' }}>
			<Stack
				style={{
					width: '100%',
				}}
				spacing={2}>
				<Box
					style={{
						display: 'flex',
						alignItems: 'center',
					}}>
					<IconButton
						onClick={() => {
							navigate(-1)
						}}>
						<ArrowBackIosNewIcon fontSize="small" />
					</IconButton>
				</Box>
			</Stack>
			{data && Object.keys(data.patient).length === 0 && Object.keys(data.patient_attendee).length === 0 ? (
				<Box
					style={{
						display: 'flex',
						justifyContent: 'center',
						minHeight: '60vh',
						alignItems: 'center',
					}}>
					<Box>
						<img src={noDocs} alt="no documents" />
						<Typography style={{ textAlign: 'center' }}>No documents uploaded</Typography>
					</Box>
				</Box>
			) : (
				<Grid container>
					<Grid item xs={12} md={6}>
						<Typography variant="h5" sx={{ marginTop: '26px' }}>
							Patient Documents
						</Typography>
						<Divider
							sx={{
								borderBottomWidth: 3,
								borderColor: '#0089D6',
								width: '60px',
								marginBottom: 1,
							}}
						/>
						{data && Object.keys(data.patient).length === 0 ? (
							<Box
								style={{
									display: 'flex',
									justifyContent: 'center',
									minHeight: '60vh',
									alignItems: 'center',
								}}>
								<Box>
									<img src={noDocs} alt="no documents" />
									<Typography style={{ textAlign: 'center' }}>No documents uploaded</Typography>
								</Box>
							</Box>
						) : (
							<Box sx={{ width: '100%', padding: '0 10px' }}>
								{data?.patient?.medical_reports && (
									<FileViewComponent name="Medical Reports" files={classifyFiles(data?.patient?.medical_reports)} />
								)}
								{data?.patient?.bills && <FileViewComponent name="Bills" files={classifyFiles(data?.patient?.bills)} />}
								{data?.patient?.travel && <FileViewComponent name="Travel" files={classifyFiles(data?.patient?.travel)} />}
								{data?.patient?.others && <FileViewComponent name="Others" files={classifyFiles(data?.patient?.others)} />}
							</Box>
						)}
					</Grid>
					<Grid item xs={12} md={6}>
						<Typography variant="h5" sx={{ marginTop: '26px' }}>
							Attendee Documents
						</Typography>
						<Divider
							sx={{
								borderBottomWidth: 3,
								borderColor: '#0089D6',
								width: '60px',
								marginBottom: 1,
							}}
						/>
						{data && Object.keys(data.patient_attendee).length === 0 ? (
							<Box
								style={{
									display: 'flex',
									justifyContent: 'center',
									minHeight: '60vh',
									alignItems: 'center',
								}}>
								<Box>
									<img src={noDocs} alt="no documents" />
									<Typography style={{ textAlign: 'center' }}>No documents uploaded</Typography>
								</Box>
							</Box>
						) : (
							<Box sx={{ width: '100%', padding: '0 10px' }}>
								{data?.patient_attendee?.travel && (
									<FileViewComponent name="Travel" files={classifyFiles(data?.patient_attendee?.travel)} />
								)}
								{data?.patient_attendee?.others && (
									<FileViewComponent name="Others" files={classifyFiles(data?.patient_attendee?.others)} />
								)}
							</Box>
						)}
					</Grid>
				</Grid>
			)}
		</Box>
	)
}

export default PreviewDocuments
