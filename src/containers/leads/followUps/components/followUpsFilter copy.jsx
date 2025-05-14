/* eslint-disable  no-unused-vars */
import { Box } from '@mui/material'
import React from 'react'
import AppBar from '@mui/material/AppBar'
import IconButton from '@mui/material/IconButton'
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import Toolbar from '@mui/material/Toolbar'
import TextField from '../../../../components/common/textField/textField'
import { Form, Formik } from 'formik'
import SearchIcon from '@mui/icons-material/Search'
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff'

export default function FollowUpsFilter(props) {
	const matches = props.matches
	const initialValues = {
		followUpFromDate: null,
		followUpFromTime: null,
		followUpToDate: null,
		followUpToTime: null,
	}

	const handleSubmit = (values) => {
		props.onSubmit(values)
		props.onClose()
	}

	const handleClearFilter = () => {
		props.handleClearFilter()
	}

	return (
		<Box>
			<Formik initialValues={initialValues} onSubmit={handleSubmit}>
				{(props) => {
					const { followUpFromDate, followUpFromTime, followUpToDate, followUpToTime } = props.values
					return (
						<Form>
							{/* From and To Date Text Field */}
							<Box
								display="flex"
								alignItems="center"
								justifyContent="end"
								sx={{ flexDirection: matches ? 'row' : 'column', marginBottom: matches ? 2 : 0 }}>
								{/* From Date */}
								<Box display="flex" gap={2}>
									<TextField
										name="followUpFromDate"
										label="Follow up from"
										type="date"
										InputLabelProps={{
											shrink: true,
										}}
										value={followUpFromDate}
										onChange={props.handleChange}
									/>

									<TextField
										name="followUpFromTime"
										label="Follow up from"
										type="time"
										InputLabelProps={{
											shrink: true,
										}}
										value={followUpFromTime}
										onChange={props.handleChange}
									/>
								</Box>

								{matches && <ArrowRightAltIcon fontSize="large" sx={{ marginX: 2 }} />}
								{/* To Date */}
								<Box display="flex" gap={2}>
									<TextField
										name="followUpToDate"
										label="Follow up to"
										type="date"
										InputLabelProps={{
											shrink: true,
										}}
										value={followUpToDate}
										onChange={props.handleChange}
									/>
									<TextField
										name="followUpToTime"
										label="Follow up from"
										type="time"
										InputLabelProps={{
											shrink: true,
										}}
										value={followUpToTime}
										onChange={props.handleChange}
									/>
								</Box>
								{/* Search and Clear Filter Buttons */}
								<Box display="flex" ml={3}>
									<IconButton type="submit">
										<SearchIcon color="primary" sx={{ fontSize: 30 }} />
									</IconButton>
									<IconButton onClick={handleClearFilter}>
										<FilterAltOffIcon sx={{ fontSize: 30 }} />
									</IconButton>
								</Box>
							</Box>
						</Form>
					)
				}}
			</Formik>
		</Box>
	)
}
