import React, { useState, useEffect } from 'react'
import axios from '../../shared/axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { TextField, Autocomplete, Box, Divider, Chip, Pagination, List, ListItem, Tabs, Tab, Stack } from '@mui/material'
import usePagination from '../../components/pagination'
import CircularLoader from '../../components/common/loader/circularLoader'

function Members() {
	const [value, setValue] = useState(0)

	const handleChange = (event, newValue) => {
		setValue(newValue)
	}

	const [data, setData] = useState([])
	const [isLoading, setIsLoading] = useState(true)
	const navigate = useNavigate()

	const redirectHandler = (path, optionalArguments) => {
		navigate(path, optionalArguments)
	}

	const fetchData = () => {
		setIsLoading(true)
		if (value === 0) {
			axios
				.get(`sales/employee/sale-emp`)
				.then((res) => {
					setData(res.data.data)
					setIsLoading(false)
				})
				.catch((error) => {
					toast.error(error.response.data.data.message, {
						position: 'bottom-left',
					})
				})
		} else if (value === 1) {
			axios
				.get(`sales/employee/partner`)
				.then((res) => {
					setData(res.data.data)
					setIsLoading(false)
				})
				.catch((error) => {
					toast.error(error.response.data.data.message, {
						position: 'bottom-left',
					})
				})
		}
	}
	useEffect(fetchData, [value])

	let [page, setPage] = useState(1)
	const PER_PAGE = 10
	const count = Math.ceil(data.length / PER_PAGE)
	const _DATA = usePagination(data, PER_PAGE)

	const handlePageChange = (e, p) => {
		setPage(p)
		_DATA.jump(p)
	}

	const handleSearch = (searchMem) => {
		const member = data.filter((member) => member.full_name === searchMem)
		navigate(`/edit-member?id=${member[0].id}&value=0`)
	}

	return (
		<>
			<Box sx={{ width: '100%', padding: '0 10px' }}>
				<Stack direction="row" justifyContent="space-between" alignItems="flex-end" spacing={1} sx={{ padding: '20px' }}>
					<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ flex: 0.5 }}>
						<Box sx={{ borderColor: 'divider', width: '260px' }}>
							<Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
								<Tab label="Sales" />
								<Tab label="Partner" />
							</Tabs>
						</Box>
					</Stack>
				</Stack>
				<Divider sx={{ marginTop: -2.6, marginBottom: 3 }} />
				<Box value={value} index={0}>
					<div role="tabpanel" hidden={value !== 0} id={`simple-tabpanel-${0}`} aria-labelledby={`simple-tab-${0}`}>
						{isLoading ? (
							<CircularLoader />
						) : (
							value === 0 && (
								<>
									<Autocomplete
										id="search-box-members"
										freeSolo
										options={data.map((option) => option.full_name)}
										renderInput={(params) => <TextField {...params} label="Search Member" />}
										sx={{ pl: '40%', pr: '40%' }}
										onChange={(e, value) => handleSearch(value)}
									/>
									<List p="10" pt="3" spacing={2}>
										{_DATA.currentData().map((members) => {
											return (
												<Box key={members.id}>
													<Box
														onClick={() => {
															redirectHandler(`/edit-member?id=${members.id}&value=0`)
														}}
														sx={{
															display: 'flex',
															cursor: 'pointer',
															backgroundColor: 'transparent',
															'&:hover': {
																backgroundColor: '#e3f2fd',
															},
															paddingY: 1,
														}}>
														<ListItem>{members.full_name}</ListItem>
														{members.is_active ? (
															<Chip
																label="Active"
																sx={{
																	bgcolor: '#43A047',
																	color: '#FFFFFF',
																	width: '80px',
																	borderRadius: '5px',
																}}></Chip>
														) : (
															<Chip
																label="Inactive"
																sx={{
																	bgcolor: '#E53935',
																	color: '#FFFFFF',
																	width: '80px',
																	borderRadius: '5px',
																}}></Chip>
														)}
													</Box>
													<Divider />
												</Box>
											)
										})}
									</List>
									<Box
										style={{
											width: '100%',
											display: 'flex',
											justifyContent: 'center',
											marginTop: '58px',
										}}>
										<Stack spacing={2}>
											<Pagination
												count={count}
												color="primary"
												page={page}
												onChange={handlePageChange}
												shape="rounded"
											/>
										</Stack>
									</Box>
								</>
							)
						)}
					</div>
				</Box>
				<Box value={value} index={1}>
					<div role="tabpanel" hidden={value !== 1} id={`simple-tabpanel-${1}`} aria-labelledby={`simple-tab-${1}`}>
						{isLoading ? (
							<CircularLoader />
						) : (
							value === 1 && (
								<>
									<List p="10" pt="3" spacing={2}>
										{_DATA.currentData().map((members) => {
											return (
												<Box key={members.id}>
													<Box
														onClick={() => {
															redirectHandler(`/edit-member?id=${members.id}&value=1`)
														}}
														sx={{
															display: 'flex',
															cursor: 'pointer',
															backgroundColor: 'transparent',
															'&:hover': {
																backgroundColor: '#e3f2fd',
															},
															paddingY: 1,
														}}>
														<ListItem>{members.full_name}</ListItem>
														{members.is_active ? (
															<Chip
																label="Active"
																sx={{
																	bgcolor: '#43A047',
																	color: '#FFFFFF',
																	width: '80px',
																	borderRadius: '5px',
																}}></Chip>
														) : (
															<Chip
																label="Inactive"
																sx={{
																	bgcolor: '#E53935',
																	color: '#FFFFFF',
																	width: '80px',
																	borderRadius: '5px',
																}}></Chip>
														)}
													</Box>
													<Divider />
												</Box>
											)
										})}
									</List>
									<Box
										style={{
											width: '100%',
											display: 'flex',
											justifyContent: 'center',
											marginTop: '58px',
										}}>
										<Stack spacing={2}>
											<Pagination
												count={count}
												color="primary"
												page={page}
												onChange={handlePageChange}
												shape="rounded"
											/>
										</Stack>
									</Box>
								</>
							)
						)}
					</div>
				</Box>
			</Box>
		</>
	)
}

export default Members
