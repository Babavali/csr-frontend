/* eslint-disable no-unused-vars*/
import { Box, Button, Grid, IconButton } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import axios from '../../../../shared/axios'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import ImageViewer from 'react-simple-image-viewer'
import { useCallback } from 'react'
import PropTypes from 'prop-types'
import { useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'

const thumbInner = {
	display: 'flex',
	position: 'relative',
	minWidth: 0,
}

const thumb = {
	display: 'inline-flex',
	borderRadius: 2,
	border: '1px solid #eaeaea',
	marginBottom: 8,
	marginRight: 12,
	padding: 4,
	boxSizing: 'border-box',
}

function FileUploadComponent(props) {
	const [files, setFiles] = useState([])
	const [oldFilesIds, setOldFilesIds] = useState([])
	const {
		field: { name, value },
		form: { setFieldValue },
	} = props

	const location = useLocation()

	useEffect(() => {
		;(async () => {
			if (value.length === 0 || value.filter((item) => item.public_url).length === 0) {
				return
			}
			const incomingFiles = []
			const incomingFilesIds = []
			for await (const incomingFile of value) {
				const response = await fetch(incomingFile.public_url)
				const blob = await response.blob()
				const tokens = incomingFile.public_url.split('/')
				const file = new File([blob], tokens[tokens.length - 1].split('?')[0], {
					type: blob.type,
				})
				file.responseId = incomingFile.id
				file.responseUrl = incomingFile.public_url
				file.preview = URL.createObjectURL(file)
				file.uploaded = true
				incomingFiles.push(file)
				incomingFilesIds.push(file.responseId)
				setOldFilesIds(incomingFilesIds)
			}
			const images = []
			const otherFiles = []
			incomingFiles.forEach((file) => {
				if (file.type.startsWith('image/')) {
					images.push(file)
					file.preview = URL.createObjectURL(file)
				} else {
					otherFiles.push(file)
				}
			})
			setFiles([...images, ...otherFiles])
		})()
	}, [value])

	const [isViewerOpen, setIsViewerOpen] = useState(false)
	const [imageUrl, setImageUrl] = useState()
	const [, setCurrentImage] = useState(0)

	const { getRootProps, getInputProps } = useDropzone({
		accept: {
			'image/jpeg': [],
			'image/png': [],
			'application/pdf': [],
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [],
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
		},
		onDrop: async (acceptedFiles, rejectedFiles) => {
			if (rejectedFiles.length > 0) {
				toast.error('File type not supported', {
					position: 'bottom-left',
				})
			} else {
				let newFiles = [...acceptedFiles, ...files]
				const images = []
				const otherFiles = []
				newFiles.forEach((file, index) => {
					if (file.type.startsWith('image/')) {
						images.push(file)
						file.preview = URL.createObjectURL(file)
					} else {
						otherFiles.push(file)
					}
				})
				newFiles = [...images, ...otherFiles]
				setFiles(newFiles)
				const ids = []
				newFiles.forEach(async (file) => {
					if (!oldFilesIds.includes(file.responseId)) {
						const formData = new FormData()
						formData.append('file', file)
						formData.append('purpose', props.fileType)
						formData.append('altText', 'X-ray report')
						const response = await axios.post(`sales/media`, formData, {
							headers: { 'Content-Type': 'multipart/form-data' },
						})
						file.uploaded = true
						file.responseId = response.data.data.id
						file.responseUrl = response.data.data.publicUrl
						ids.push(response.data.data.id)
					}
				})
				setFieldValue(name, ids)
				setFiles(newFiles)
			}
		},
	})

	const handleRemoveFile = React.useCallback(
		async (fileId) => {
			let newFiles = [...files]
			newFiles = newFiles.filter((file) => file.responseId !== fileId)
			setFiles(newFiles)
			setFieldValue(
				name,
				newFiles.map((file) => file.responseId)
			)
			await axios.delete(`/sales/media/${fileId}`)
		},
		[files]
	)

	const openImageViewer = useCallback((url, index) => {
		setCurrentImage(index)
		setImageUrl(url)
		setIsViewerOpen(true)
	}, [])

	const closeImageViewer = () => {
		setCurrentImage(0)
		setIsViewerOpen(false)
	}

	const thumbs = files.map((file, index) => {
		if (file.type.startsWith('image/')) {
			return (
				<Box style={thumb} key={file.responseId}>
					<div style={thumbInner}>
						<img
							style={{
								objectFit: 'contain',
								width: 100,
								height: 100,
							}}
							src={file.preview}
							alt="imagePreview"
							onClick={() => {
								openImageViewer(file.responseUrl, index)
							}}
						/>
						<IconButton
							style={{
								borderRadius: 10,
								position: 'absolute',
								top: -24,
								right: -24,
							}}
							onClick={() => handleRemoveFile(file.responseId)}>
							<HighlightOffIcon />
						</IconButton>
					</div>
					{isViewerOpen && (
						<Box sx={{ textAlign: 'center' }}>
							<ImageViewer
								src={[imageUrl]}
								currentIndex="0"
								closeOnClickOutside={true}
								onClose={closeImageViewer}
								backgroundStyle={{
									backgroundColor: 'rgba(0,0,0,0.1)',
									zIndex: 2,
									width: '70vw',
									height: '70vh',
									marginLeft: '15vw',
									marginTop: '15vh',
								}}
								disableScroll={true}
							/>
						</Box>
					)}
				</Box>
			)
		}
		return (
			<Grid key={file.name} container spacing={2}>
				<Grid item xs={8}>
					<a href={file.responseUrl} target="_blank" rel="noreferrer">
						<p key={file.responseId}>{file.name}</p>
					</a>
				</Grid>
				<Grid item xs={4}>
					<Button sx={{ marginTop: '8px' }} onClick={() => handleRemoveFile(file.responseId)}>
						Remove file
					</Button>
				</Grid>
			</Grid>
		)
	})

	useEffect(() => {
		return () => files.forEach((file) => URL.revokeObjectURL(file.responseUrl))
	}, [files])

	useEffect(() => {
		setFiles([])
	}, [location])

	return (
		<section className="container">
			<div {...getRootProps({ className: 'dropzone' })}>
				<input {...getInputProps()} />
				<p
					style={{
						display: 'flex',
						height: '100px',
						color: 'black',
						backgroundColor: 'white',
						alignItems: 'center',
						textAlign: 'center',
						justifyContent: 'center',
						border: '1px dashed black',
					}}>
					Drag & drop a file here or upload a file <br /> (Format: jpg,png,pdf,excel,word)
				</p>
			</div>
			<aside>{thumbs}</aside>
		</section>
	)
}

FileUploadComponent.propTypes = {
	fileType: PropTypes.string,
}

FileUploadComponent.defaultProps = {
	fileType: '',
}

export default FileUploadComponent
