/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import {
	PreviewLeads,
	AddLead,
	Auth,
	DashboardPage,
	Layout,
	MyLeads,
	FollowUps,
	Members,
	EditMembers,
	PreviewDocuments,
	PendingApproval,
	PartnerLeadListingPage,
	PartnerLeadDetailPage,
	PartnerLeadFollowUpsPage,
	PartnerLeadAddPage,
	UploadLeadsPage,
	LeadUpdatesPage,
	FacebookLeadsPage,
	FacebookFollowUpsPage,
	DoctorActivityPage,
	// ClientLeadsPage,
	// PartnerLeadsPage,
} from '../containers'
import { SignUp, Login, ForgotPassword, ResetPassword } from '../containers/auth'
import NotFound from '../components/common/notFound/notFound'
import ProtectedRoutes from './ProtectedRoutes'
import ArrivalSheetPage from '../containers/arrivalSheet/arrivalSheetPage'
import MTLeadsPage from '../containers/mtLeads/mtLeadsPage'
import ClientLeadsPage from '../containers/clientLeads/clientLeadsPage'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { resetFacebookLeadsFilter } from '../slices/facebookLeadsFilterSlice'
const AppRoutes = () => {
	const dispatch = useDispatch()
	const location = useLocation()
	const facebookLeadFilter = useSelector((state) => state.filter)
	useEffect(() => {
		dispatch(resetFacebookLeadsFilter())
	}, [location.pathname])
	return (
		<Routes>
			<Route element={<Auth />}>
				{/* outlet is defined in parent container and child routes are defined here */}
				<Route path="/register" element={<SignUp />} />
				<Route path="/login" element={<Login />} />
				<Route path="/forgot-password" element={<ForgotPassword />} />
				<Route path="/reset-password" element={<ResetPassword />} />
			</Route>
			{/* Grouped in App layout */}
			<Route element={<ProtectedRoutes />}>
				<Route element={<Layout />}>
					<Route path="/dashboard" element={<DashboardPage />} />
					<Route path="/lead/add" element={<AddLead />} />
					<Route path="/lead/:lead_id/edit" element={<AddLead />} />
					<Route path="/leads" element={<MyLeads />} />
					<Route path="/follow-ups" element={<FollowUps />} />
					<Route path="/lead/:lead_id" element={<PreviewLeads />} />
					<Route path="/lead/:lead_id/documents" element={<PreviewDocuments />} />
					<Route path="/members" element={<Members />} />
					<Route path="/edit-member" element={<EditMembers />} />
					<Route path="/pending-approval" element={<PendingApproval />} />
					<Route path="/arrival-sheet" element={<ArrivalSheetPage />} />
					<Route path="/mt-leads" element={<MTLeadsPage />} />
					<Route path="/client-leads" element={<ClientLeadsPage />} />
					{/* <Route path="/partner-leads" element={<PartnerLeadsPage />} /> */}

					{/* Lead Updates */}
					<Route path="/lead-updates" element={<LeadUpdatesPage />} />
					{/* Partner Leads */}
					<Route path="/business-partners" element={<PartnerLeadListingPage />} />
					<Route path="/business-partner/doctor/:lead_id" element={<PartnerLeadDetailPage />} />
					<Route path="/business-partner/sales/:lead_id" element={<PartnerLeadDetailPage />} />
					<Route path="/business-partner/doctor/follow-ups" element={<PartnerLeadFollowUpsPage />} />
					<Route path="/business-partner/sales/follow-ups" element={<PartnerLeadFollowUpsPage />} />
					<Route path="/business-partner/add" element={<PartnerLeadAddPage />} />
					<Route path="/business-partner/doctor/:lead_id/edit" element={<PartnerLeadAddPage />} />
					{/* Doctor Activity */}
					<Route path="/doctor/activity" element={<DoctorActivityPage />} />
					{/* Upload Leads */}
					<Route path="/upload-leads" element={<UploadLeadsPage />} />
					{/* Facebook Leads */}
					<Route path="/offline/leads" element={<FacebookLeadsPage />} />
					{/* Facebook Follow Ups */}
					<Route path="/offline/follow-ups" element={<FacebookFollowUpsPage />} />
				</Route>
			</Route>
			{/* <Route path="/dashboard" element={<Dashboard />} /> */}
			<Route path="*" element={<NotFound />} />
			<Route path="/" element={<Navigate replace={true} to="/login" />} />
			{/* Redirection of domain to login url */}
		</Routes>
	)
}
export default AppRoutes
