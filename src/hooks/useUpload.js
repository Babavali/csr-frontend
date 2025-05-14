// import { useRef, useState } from "react";
// import openaxios from "../shared/openaxios";
// import usePanel from "./usePanel";

// const useUpload = (title) => {
//   const uploadRef = useRef(null);
//   const {
//     actions: { toggleLoader },
//   } = usePanel();
//   const [fileData, setFileData] = useState({});
//   const [uploadedFileName, setUploadedFileName] = useState(title);
//   const [totalFiles, setTotalFiles] = useState(0);
//   const setUploadRef = (ref) => {
//     uploadRef.current = ref;
//   };
//   const uploadCSV = (e) => {
//     if (e.target.files.length) {
//       let data = new FormData();
//       data.append("file", e.target.files[0]);
//       setTotalFiles(e.target.files.length);
//       setUploadedFileName(e.target.files[0].name);
//       toggleLoader(true);
//       openaxios({
//         url: "/fileUpload",
//         method: "POST",
//         data,
//         headers: {
//           "content-type": "multipart/form-data",
//         },
//       })
//         .then((res) => {
//           uploadRef.current = null;
//           if (res?.data?.statusCode === 200) {
//             // debugger;
//             setFileData({
//               ...fileData,
//               fileLocation: res?.data?.data?.location[0],
//               fileName: res?.data?.data?.originalname[0]?.originalname,
//             });
//             toggleLoader(false);
//           }
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//     }
//   };
//   return {
//     fileData,
//     uploadedFileName,
//     totalFiles,
//     setUploadRef,
//     uploadCSV,
//   };
// };

// export default useUpload;
