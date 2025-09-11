import {
  AppBar,
  Grid,
  Toolbar,
  Typography,
  Tooltip,
  useTheme,
  useMediaQuery,
  Box,
  Stack,
} from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import { toggleDarkMode } from "../../store/slices/themeSlice";
import { DarkMode } from "../../components/DarkMode";
import { NotificationBell } from "./NotificationBell";

export const NavBar = ({ drawerWidth = 240 }) => {
  const { darkMode } = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg")); // usa el tema para breakpoint

  const setDarkMode = () => {
    dispatch(toggleDarkMode());
  };

  return (
    <AppBar
      position="fixed"
      color={darkMode ? "default" : "primary"}
      elevation={4}
      sx={{
        width: isLargeScreen ? `calc(100% - ${drawerWidth}px)` : "100%",
        ml: isLargeScreen ? `${drawerWidth}px` : 0,
        backgroundColor: darkMode ? theme.palette.background.paper : undefined,
        borderBottom: darkMode
          ? `1px solid ${theme.palette.divider}`
          : undefined,
      }}
    >
      <Toolbar sx={{ px: { xs: 2, md: 3 } }}>
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          wrap="nowrap"
          spacing={2}
        >
          <Grid item xs>
            <Box sx={{ textAlign: isLargeScreen ? "left" : "center" }}>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{
                  fontWeight: "bold",
                  color: darkMode ? theme.palette.text.primary : "#fff",
                  userSelect: "none",
                }}
              >
                <Stack>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    ZenNotes
                  </Typography>
                  <Typography variant="body2">
                    Your personal note manager
                  </Typography>
                </Stack>
              </Typography>
            </Box>
          </Grid>

          <Grid
            item
            container
            justifyContent="flex-end"
            alignItems="center"
            spacing={1}
            sx={{ width: "auto" }}
          >
            <Grid item>
              <Tooltip title={darkMode ? "Light Mode" : "Dark Mode"}>
                <DarkMode darkMode={darkMode} setDarkMode={setDarkMode} />
              </Tooltip>
            </Grid>
            <Grid item>
              <NotificationBell />
            </Grid>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};
