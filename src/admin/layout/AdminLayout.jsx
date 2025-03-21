import { Toolbar } from "@mui/material";
import { Box } from "@mui/system";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { SideBarAdmin } from "../components/SideBarAdmin";
import { NavBar } from "../../notes/components/NavBar";

const drawerWidth = 280;

export const AdminLayout = () => {
  const { displayName } = useSelector((state) => state.auth);

  return (
    <Box sx={{ display: "flex" }}>
      <NavBar drawerWidth={drawerWidth} />

      <SideBarAdmin drawerWidth={drawerWidth} displayName={displayName} />

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />

        <Outlet></Outlet>
      </Box>
    </Box>
  );
};
