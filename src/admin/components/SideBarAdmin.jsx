import { useState } from "react";
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  IconButton,
  ListItemIcon,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PestControlOutlinedIcon from "@mui/icons-material/PestControlOutlined";

import useMediaQuery from "@mui/material/useMediaQuery";

import { Link } from "react-router-dom";

export const SideBarAdmin = ({ drawerWidth = 240, displayName }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");
  // Detecta si es PC/tablet

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerContent = (
    <>
      <Toolbar>
        <Typography variant="h6" noWrap ml={6}>
          {displayName ? displayName : "Admin"}
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/admin">
            <ListItemIcon>
              <PestControlOutlinedIcon sx={{ color: "primary.main" }} />
            </ListItemIcon>
            <ListItemText primary="Users" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/admin/cloudinary">
            <ListItemIcon>
              <PestControlOutlinedIcon sx={{ color: "primary.main" }} />
            </ListItemIcon>
            <ListItemText primary="Cloudinary" />
          </ListItemButton>
        </ListItem>
      </List>
    </>
  );

  return (
    <>
      {/* Botón de menú en móviles */}
      {!isLargeScreen && (
        <IconButton
          onClick={handleDrawerToggle}
          sx={{
            position: "absolute",
            top: 10,
            left: 10,
            zIndex: 1300,
            color: mobileOpen ? "primary.main" : "white",
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
        {/* Sidebar fijo en pantallas grandes */}
        {isLargeScreen ? (
          <Drawer
            variant="permanent"
            open
            sx={{
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                boxSizing: "border-box",
              },
            }}
          >
            {drawerContent}
          </Drawer>
        ) : (
          /* Sidebar deslizable en móviles */
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                boxSizing: "border-box",
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
