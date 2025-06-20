import { Toolbar } from "@mui/material";
import { Box } from "@mui/system";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { SideBarAdmin } from "../components/SideBarAdmin";
import { NavBar } from "../../notes/components/NavBar";
import NotFoundPage from "../../components/NotFoundPage";

const drawerWidth = 280;

export const AdminLayout = () => {
  const { user } = useSelector((state) => state.auth);

  if (user?.role.name !== "admin") {
    return <NotFoundPage></NotFoundPage>;
  }

  return (
    <Box sx={{ display: "flex" }}>
      <NavBar drawerWidth={drawerWidth} />

      <SideBarAdmin drawerWidth={drawerWidth} displayName={user.name} />

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />

        <Outlet></Outlet>
      </Box>
    </Box>
  );
};
