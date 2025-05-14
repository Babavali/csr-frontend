import { Box, Divider, Typography } from '@mui/material'
import React from 'react'
import { useCallback } from 'react'
import { useState } from 'react'
import ImageViewer from 'react-simple-image-viewer'

function FileViewComponent(props) {
	const [isViewerOpen, setIsViewerOpen] = useState(false)
	const [, setCurrentImage] = useState(0)
	const [imageUrl, setImageUrl] = useState()
	const {
		files: { images, otherFiles },
		name,
	} = props

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

	const openImageViewer = useCallback((url, index) => {
		setCurrentImage(index)
		setImageUrl(url)
		setIsViewerOpen(true)
	}, [])

	const closeImageViewer = () => {
		setCurrentImage(0)
		setIsViewerOpen(false)
	}

	return (
		<>
			<Typography variant="h5" sx={{ marginTop: '26px' }}>
				{name}
			</Typography>
			{name && (
				<Divider
					sx={{
						borderBottomWidth: 3,
						borderColor: '#0089D6',
						width: '60px',
						marginBottom: 1,
					}}
				/>
			)}
			{images.map((file, index) => {
				return (
					<Box style={thumb} key={file.id}>
						<div style={thumbInner}>
							<img
								style={{
									objectFit: 'contain',
									width: 100,
									height: 100,
								}}
								src={file.public_url}
								alt="imagePreview"
								onClick={() => {
									openImageViewer(file.public_url, index)
								}}
							/>
						</div>
						{isViewerOpen && (
							<Box sx={{ textAlign: 'center' }}>
								<ImageViewer
									src={[imageUrl]}
									currentIndex="0"
									closeOnClickOutside={true}
									onClose={closeImageViewer}
									backgroundStyle={{
										backgroundColor: 'rgba(0,0,0,0.8)',
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
			})}
			{otherFiles.map((file) => {
				return (
					<a key={file.public_url} href={file.public_url} target="_blank" rel="noreferrer">
						{/*    <p key={file.responseId}>{file.public_url}</p> */}
						<Box style={thumb} key={file.id}>
							<div style={thumbInner}>
								<img
									style={{
										objectFit: 'contain',
										width: 100,
										height: 100,
									}}
									src={require('../../../../assets/pdf.png')}
									alt="imagePreview"
								/>
								<div
									style={{
										position: 'absolute',
										bottom: '0px',
										width: '100%',
										height: '24px',
										fontSize: '10px',
										color: 'white',
										textAlign: 'center',
										backgroundColor: '#666666',
										overflow: 'hidden',
										whiteSpace: 'nowrap',
										textOverflow: 'ellipsis',
									}}>
									<p key={file.responseId}>{file.public_url}</p>
								</div>
							</div>
						</Box>
					</a>
				)
			})}
		</>
	)
}

export default FileViewComponent
