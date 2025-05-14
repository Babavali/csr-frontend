// import { useCallback } from "react";
// import { shallowEqual, useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import controlsActions from "../redux/controls/action";
// import userActions from "../redux/user-info/user-actions";
// import { PANEL_MODES } from "../shared/constants";

// const usePanel = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const panel = useSelector((state) => state.controls.panelMode, shallowEqual);
//   // debugger;
//   console.log(panel);
//   const { isLoading } = useSelector((state) => state.controls, shallowEqual);
//   const user = useSelector((state) => state.user, shallowEqual);
//   // debugger;
//   const toggleLoading = useCallback(
//     (isLoading) => {
//       dispatch(controlsActions.toggleLoading(isLoading));
//       console.log("loader", isLoading);
//     },
//     [dispatch]
//   );
//   const logout = useCallback(() => {
//     dispatch(userActions.logout());
//     console.log("user log out");
//     navigate("/");
//   }, [dispatch]);
//   const updateUserInfo = useCallback(
//     (data) => {
//       dispatch(userActions.login({ ...user?.userInfo?.data, ...data }));
//       console.log("user log in");
//     },
//     [dispatch]
//   );
//   // console.log(panel, PANEL_MODES);

//   return {
//     panel,
//     isFounder: panel === PANEL_MODES.FOUNDER,
//     isAdmin: panel === PANEL_MODES.ADMIN,
//     isInvestor: panel === PANEL_MODES.INVESTOR,
//     controls: {
//       isLoading,
//       // isMobileView,
//       loggedIn: user?.userInfo?.isLoggedIn === false,
//       userInfo: user?.userInfo?.data,
//     },
//     actions: {
//       toggleLoader: toggleLoading,
//       logout,
//       updateUserInfo,
//     },
//   };
// };

// export default usePanel;
