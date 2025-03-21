import { useState } from "react";
import {
  Box,
  Divider,
  Drawer,
  List,
  Toolbar,
  Typography,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import useMediaQuery from "@mui/material/useMediaQuery";
import { SideBarItem } from "./SideBarItem";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export const SideBar = ({ drawerWidth = 240, displayName, list = [] }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");
  // Detecta si es PC/tablet

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerContent = (
    <>
      <Toolbar>
        <Typography
          variant="h5"
          noWrap
          ml={6}
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
          color="primary.main"
        >
          <AccountCircleIcon sx={{ color: "primary.main" }} />
          {displayName}
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {list.map((note) => (
          <SideBarItem key={note.id} {...note} />
        ))}
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
