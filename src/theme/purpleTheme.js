import { createTheme } from "@mui/material";
import { red } from "@mui/material/colors";

export const purpleTheme = (darkMode) =>
  createTheme({
    typography: {
      fontFamily: "Roboto, Arial, sans-serif",
    },
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: darkMode ? "#FFFFFF" : "#262254", // Azul/morado oscuro
      },
      secondary: {
        main: "#543884", // Morado más claro
      },
      background: {
        default: darkMode ? "#1A1A2E" : "#F4F4F6", // Fondo general
        paper: darkMode ? "#FFFFFF" : "#FFFFFF", // Form blanco en ambos modos
      },
      text: {
        primary: darkMode ? "#262254" : "#FFFFFF",
        secondary: darkMode ? "#B3B3B3" : "#543884",
      },
      error: {
        main: red.A400,
      },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            // backgroundColor: "#262254", // 🔥 Asegura que los <Paper> tengan ese color
            // color: "#FFFFFF",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: "6px",
            fontWeight: "500",
            textTransform: "none",
            transition: "all 0.2s ease",
            "&:hover": {
              backgroundColor: darkMode ? "#1E1E40" : "#43367A",
            },
          },
        },
      },
    },
  });
