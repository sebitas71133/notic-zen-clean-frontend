import { Toolbar } from "@mui/material";
import { Box } from "@mui/system";

import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { NavBar } from "../components/NavBar";
import { SideBar } from "../components/SideBar";

const drawerWidth = 280;

export const NoteLayout = () => {
  const { displayName } = useSelector((state) => state.auth);
  const { notes } = useSelector((state) => state.journal);

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
      }}
    >
      <NavBar drawerWidth={drawerWidth} />

      <SideBar
        drawerWidth={drawerWidth}
        list={notes}
        displayName={displayName}
      />

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />

        <Outlet></Outlet>
      </Box>
    </Box>
  );
};
