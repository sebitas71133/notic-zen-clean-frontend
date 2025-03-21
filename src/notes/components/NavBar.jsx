import { AppBar, Grid2, IconButton, Toolbar, Typography } from "@mui/material";
import { LogoutOutlined } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { logoutFirebaseThunk } from "../../store/slices/authSlice";
import useMediaQuery from "@mui/material/useMediaQuery";
import { toggleDarkMode } from "../../store/slices/themeSlice";
import { DarkMode } from "../../components/DarkMode";

export const NavBar = ({ drawerWidth = 240 }) => {
  const { darkMode } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");
  const setDarkMode = () => {
    dispatch(toggleDarkMode());
  };

  console.log(darkMode);

  return (
    <AppBar
      position="fixed"
      sx={{
        width: isLargeScreen ? `calc(100% - ${drawerWidth}px)` : "100%",
        ml: isLargeScreen ? `${drawerWidth}px` : 0,
      }}
    >
      <Toolbar>
        <Grid2
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          width={"100%"}
        >
          <Typography
            ml={5}
            variant="h5"
            margin={"auto"}
            noWrap
            component="div"
            color="text.primary"
          >
            ZenNotes
          </Typography>

          <DarkMode darkMode={darkMode} setDarkMode={setDarkMode} />
          <IconButton
            onClick={() => dispatch(logoutFirebaseThunk())}
            color="error"
          >
            <LogoutOutlined />
          </IconButton>
        </Grid2>
      </Toolbar>
    </AppBar>
  );
};
