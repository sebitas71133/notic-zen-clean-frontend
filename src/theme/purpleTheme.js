import { createTheme } from "@mui/material";
import { red } from "@mui/material/colors";

export const purpleTheme = createTheme({
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
  palette: {
    primary: {
      main: "#262254",
    },
    secondary: {
      main: "#543884",
    },
    text: {
      primary: "#262254",
      secondary: "#543884",
    },
    error: {
      main: red.A400,
    },
  },
});
