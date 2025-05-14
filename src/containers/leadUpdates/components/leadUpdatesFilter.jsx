/* eslint-disable  no-unused-vars */
import { Box, Button, TextField, Tooltip } from '@mui/material'
import React from 'react'
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt'
import { Form, Formik } from 'formik'
import SearchIcon from '@mui/icons-material/Search'
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff'

export default function LeadUpdatesFilter(props) {
	const matches = props.matches
	const initialValues = {
		leadUpdatesDateFrom: null,
		leadUpdatesDateTo: null,
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
					const { leadUpdatesDateFrom, leadUpdatesDateTo } = props.values
					return (
						<Form>
							<Box
								display="flex"
								alignItems="center"
								justifyContent="end"
								gap={4}
								sx={{ flexDirection: matches ? 'row' : 'column', marginTop: matches ? 0 : 2, marginBottom: 2 }}>
								{/* From and To Date Text Field */}
								<Box display="flex" gap={1}>
									{/* From Date */}
									<TextField
										name="leadUpdatesDateFrom"
										label="From"
										type="datetime-local"
										size="small"
										InputLabelProps={{
											shrink: true,
										}}
										value={leadUpdatesDateFrom}
										onChange={props.handleChange}
									/>

									{matches && <ArrowRightAltIcon fontSize="large" />}
									{/* To Date */}
									<TextField
										name="leadUpdatesDateTo"
										label="To"
										type="datetime-local"
										size="small"
										InputLabelProps={{
											shrink: true,
										}}
										value={leadUpdatesDateTo}
										onChange={props.handleChange}
									/>
								</Box>
								{/* Search and Clear Filter Buttons */}
								<Box display="flex" gap={2}>
									<Tooltip title="Search dates" arrow>
										<Button
											type="submit"
											variant="contained"
											size="small"
											sx={{ borderRadius: '50%', minWidth: 0, padding: '8px' }}>
											<SearchIcon />
										</Button>
									</Tooltip>
									<Tooltip title="Clear Filter" arrow>
										<Button
											onClick={handleClearFilter}
											variant="contained"
											size="small"
											sx={{ borderRadius: '50%', minWidth: 0, padding: '8px' }}>
											<FilterAltOffIcon />
										</Button>
									</Tooltip>
								</Box>
							</Box>
						</Form>
					)
				}}
			</Formik>
		</Box>
	)
}
