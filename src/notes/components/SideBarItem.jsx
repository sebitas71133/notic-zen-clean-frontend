// import PestControlOutlinedIcon from "@mui/icons-material/PestControlOutlined";

// import {
//   colors,
//   Grid2,
//   ListItem,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
// } from "@mui/material";
// import React, { useMemo } from "react";
// import { useDispatch } from "react-redux";
// import { setActiveNote } from "../../store/slices/noteSlice";

// export const SideBarItem = ({
//   title = "",
//   content,
//   id,
//   createdAt,
//   images = [],
// }) => {
//   const dispatch = useDispatch();
//   const newTitle = useMemo(() => {
//     return title.length > 17 ? title.substring(0, 17) + "...." : title;
//   }, [title]);
//   const newBody = useMemo(() => {
//     return content.length > 17 ? content.substring(0, 30) + "...." : content;
//   }, [content]);

//   return (
//     <>
//       <ListItem key={id} disablePadding>
//         <ListItemButton
//           onClick={() =>
//             dispatch(setActiveNote({ title, content, id, createdAt, images }))
//           }
//         >
//           <ListItemIcon sx={{ color: "text.primary" }}>
//             <PestControlOutlinedIcon />
//           </ListItemIcon>
//           <Grid2 container>
//             <ListItemText
//               primary={newTitle}
//               sx={{
//                 "& .MuiTypography-root": {
//                   color: "text.primary",
//                 },
//               }}
//             />
//             <ListItemText
//               secondary={newBody}
//               sx={{ "& .MuiTypography-root": { color: "secondary.main" } }}
//             />
//           </Grid2>
//         </ListItemButton>
//       </ListItem>
//     </>
//   );
// };
