// import React, { useState, useEffect } from "react";

// import axios from "../shared/axios";
// import { removeEmptyKeys } from "../shared/utils";

// const calculateParams = (data) => {
//   // passing object to fetch hook will trigger it multiple times (reference changes)
//   return JSON.stringify({
//     limit: data?.pageSize,
//     skip: (data?.current - 1) * data?.pageSize,
//     search: data?.search,
//   });
// };

// const usePagination = (pageSize = 10, current = 1, total, search) => {
//   const [pagination, updatePagination] = useState({
//     pageSize,
//     current,
//     total,
//     search,
//   });
//   const initialState = { pageSize, current, total, search };
//   const [params, updateParams] = useState(calculateParams(initialState));

//   useEffect(() => {
//     updatePagination({ pageSize, current, total });
//   }, [pageSize, current, total]);

//   useEffect(() => {
//     updateParams(calculateParams(pagination));
//   }, [pagination]);

//   return [pagination, params, updatePagination];
// };

// export default usePagination;
