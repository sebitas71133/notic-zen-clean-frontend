import { createTheme } from "@mui/material";
import { red } from "@mui/material/colors";

export const blueTheme = createTheme({
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
  palette: {
    primary: {
      main: "#3A7FF9",
    },
    secondary: {
      main: "#F5F7F9",
    },
    text: {
      primary: "#121212",
      secondary: "#3A7FF9",
    },
    error: {
      main: red.A400,
    },
  },
});
