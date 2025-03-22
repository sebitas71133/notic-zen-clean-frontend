import PestControlOutlinedIcon from "@mui/icons-material/PestControlOutlined";

import {
  colors,
  Grid2,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import React, { useMemo } from "react";
import { useDispatch } from "react-redux";
import { setActiveNote } from "../../store/slices/journalSlice";

export const SideBarItem = ({
  title = "",
  body,
  id,
  date,
  imagesUrls = [],
}) => {
  const dispatch = useDispatch();
  const newTitle = useMemo(() => {
    return title.length > 17 ? title.substring(0, 17) + "...." : title;
  }, [title]);
  const newBody = useMemo(() => {
    return body.length > 17 ? body.substring(0, 30) + "...." : body;
  }, [body]);

  return (
    <>
      <ListItem key={id} disablePadding>
        <ListItemButton
          onClick={() =>
            dispatch(setActiveNote({ title, body, id, date, imagesUrls }))
          }
        >
          <ListItemIcon sx={{ color: "text.primary" }}>
            <PestControlOutlinedIcon />
          </ListItemIcon>
          <Grid2 container>
            <ListItemText
              primary={newTitle}
              sx={{
                "& .MuiTypography-root": {
                  color: "text.primary",
                },
              }}
            />
            <ListItemText
              secondary={newBody}
              sx={{ "& .MuiTypography-root": { color: "secondary.main" } }}
            />
          </Grid2>
        </ListItemButton>
      </ListItem>
    </>
  );
};
