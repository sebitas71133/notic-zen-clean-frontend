import { Box, Grid2, ThemeProvider } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { Link, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { blueTheme } from "../../theme/blueTheme";

export const AuthLayout = () => {
  return (
    // <ThemeProvider theme={blueTheme}>
    //   {/* <Grid2
    //     container
    //     spacing={0}
    //     direction="column"
    //     alignItems="center"
    //     justifyContent="center"
    //     sx={{
    //       minHeight: "100vh",
    //       backgroundColor: "primary.main",
    //       padding: 4,
    //     }}
    //   >
    //     <Box
    //       sx={{
    //         position: "absolute",
    //         left: 0,
    //         top: 0,
    //         color: "white",
    //         fontWeight: "bold",
    //         padding: 2,
    //       }}
    //       component={Link}
    //       to="/"
    //     >
    //       <HomeIcon
    //         fontSize="large"
    //         sx={{
    //           color: "secondary.main",
    //           "&:hover": { transform: "scale(1.2)" },
    //         }}
    //       />
    //     </Box>
    //     <Grid2
    //       item
    //       className="box-shadow"
    //       xs={3}
    //       sx={{
    //         width: { sm: 450 },
    //         backgroundColor: "secondary.main",
    //         padding: 3,
    //         borderRadius: 2,
    //       }}
    //     >
    //       <Outlet />
    //     </Grid2>
    //   </Grid2> */}
    //   <Outlet />
    // </ThemeProvider>
    <Outlet />
  );
};
