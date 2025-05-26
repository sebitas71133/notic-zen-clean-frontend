import { useState } from "react";
import {
  Box,
  Divider,
  Drawer,
  List,
  Toolbar,
  Typography,
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Menu as MenuIcon,
  AccountCircle,
  CategoryOutlined,
  LabelOutlined,
  NotesOutlined,
  DashboardOutlined,
} from "@mui/icons-material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";

export const SideBar = ({ drawerWidth = 240, displayName }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerContent = (
    <>
      <Toolbar sx={{ borderRight: 1, borderColor: "divider" }}>
        <Typography
          variant="h6"
          noWrap
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <AccountCircle sx={{ color: "text.primary" }} />
          {displayName}
        </Typography>
      </Toolbar>
      <Divider sx={{ bgcolor: "divider" }} />

      <List>
        {/* Dashboard */}
        <ListItemButton onClick={() => navigate("/app/dashboard")}>
          <ListItemIcon>
            <DashboardOutlined sx={{ color: "text.primary" }} />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>

        {/* Notas */}
        <ListItemButton onClick={() => navigate("/app")}>
          <ListItemIcon>
            <NotesOutlined sx={{ color: "text.primary" }} />
          </ListItemIcon>
          <ListItemText primary="Notas" />
        </ListItemButton>

        {/* Categorias */}
        <ListItemButton onClick={() => navigate("/app/category")}>
          <ListItemIcon>
            <CategoryOutlined sx={{ color: "text.primary" }} />
          </ListItemIcon>
          <ListItemText primary="Categorías" />
        </ListItemButton>

        {/* Etiquetas */}
        <ListItemButton onClick={() => navigate("/app/tags")}>
          <ListItemIcon>
            <LabelOutlined sx={{ color: "text.primary" }} />
          </ListItemIcon>
          <ListItemText primary="Etiquetas" />
        </ListItemButton>

        <Divider sx={{ my: 1 }} />
      </List>
    </>
  );

  return (
    <>
      {!isLargeScreen && (
        <IconButton
          onClick={handleDrawerToggle}
          sx={{
            position: "absolute",
            top: 10,
            left: 10,
            zIndex: 1300,
            color: mobileOpen ? "primary.main" : "text.primary",
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      <Box
        component="nav"
        sx={{
          width: isLargeScreen ? drawerWidth : "auto",
          flexShrink: { sm: 0 },
        }}
      >
        {isLargeScreen ? (
          <Drawer
            variant="permanent"
            open
            sx={{
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                boxSizing: "border-box",
                bgcolor: "background.paper",
                borderRight: "none",
              },
            }}
          >
            {drawerContent}
          </Drawer>
        ) : (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                boxSizing: "border-box",
                bgcolor: "background.paper",
              },
            }}
          >
            {drawerContent}
          </Drawer>
        )}
      </Box>
    </>
  );
};
