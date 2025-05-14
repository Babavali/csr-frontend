import { useState } from 'react'

const useConfirm = (callback) => {
	const [isVisible, toggleIsVisible] = useState(false)
	const [data, updateData] = useState({})
	const onConfirm = () => {
		callback(data)
		toggleIsVisible(false)
	}
	const onCancel = () => {
		toggleIsVisible(false)
	}
	const onClick = (data) => {
		updateData(data)
		toggleIsVisible(true)
	}
	return {
		onCancel,
		onConfirm,
		onClick,
		isVisible,
		data,
	}
}
export default useConfirm
