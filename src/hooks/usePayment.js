// // import { useCallback, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import userActions from "../redux/user-info/user-actions";
// import { FETCH_STATES } from "../shared/constants";
// import openaxios from "../shared/openaxios";
// import { nestedParseJSON } from "../shared/utils";
// import usePanel from "./usePanel";
// import { getValue } from "../shared/local-storage";
// const usePayment = () => {
//   const disptach = useDispatch();
//   // const status = useSelector(
//   //   (state) => state.user?.userInfo?.data?.applicationStatus
//   // );
//   const status = getValue("userInfo")?.data?.applicationStatus;
//   const {
//     isFounder,
//     controls: { loggedIn },
//     actions: { toggleLoader },
//   } = usePanel();
//   const selectedOffer = useSelector((state) => state.user.offer);
//   const offers = useSelector((state) => state.user.offers);
//   const selectOffer = (data) => {
//     disptach(userActions.setSelection(data));
//   };
//   const updateOffers = (payload) => {
//     disptach(userActions.setOffers(payload));
//   };
//   const getOffers = () => {
//     updateOffers(FETCH_STATES.LOADING);
//     if (isFounder) {
//       toggleLoader(true);
//       openaxios
//         .get("/founders/offers")
//         .then((res) => {
//           let parsedData = nestedParseJSON(res?.data?.data);
//           updateOffers({
//             ...FETCH_STATES.FETCHED,
//             data: parsedData,
//           });
//           toggleLoader(false);
//         })
//         .catch((err) => {
//           console.log(err);
//           toggleLoader(false);
//         });
//     }
//   };
//   console.log("render");
//   // useEffect(() => {
//   //   // debugger;
//   //   console.log("status is true");
//   //   getOffers();
//   // }, []);

//   return {
//     offers,
//     selectOffer,
//     selectedOffer,
//     getOffers,
//     status,
//   };
// };
// export default usePayment;
