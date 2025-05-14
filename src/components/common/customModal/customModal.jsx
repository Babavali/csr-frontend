import React from 'react'
import Modal from '@mui/material/Modal'

export default function CustomModal({ openModal, handleClose, children }) {
	return (
		<Modal open={openModal} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
			{children}
		</Modal>
	)
}
