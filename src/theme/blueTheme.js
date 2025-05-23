import { createTheme } from "@mui/material";
import { red } from "@mui/material/colors";

export const blueTheme = (darkMode) =>
  createTheme({
    typography: {
      fontFamily: "Roboto, Arial, sans-serif",
    },
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: "#3A7FF9",
      },
      secondary: {
        main: darkMode ? "#2C3E50" : "#F5F7F9", // Un gris-azulado para fondo secundario oscuro
      },
      background: {
        default: darkMode ? "#0F172A" : "#F4F4F6", // Un azul oscuro elegante tipo Tailwind
        paper: darkMode ? "#1E293B" : "#FFFFFF", // Cartas más oscuras en dark mode
      },
      text: {
        primary: darkMode ? "#E2E8F0" : "#121212", // Texto más claro en oscuro
        secondary: "#3A7FF9",
      },
      error: {
        main: red.A400,
      },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: darkMode ? "#1E293B" : "#FFFFFF",
            color: darkMode ? "#E2E8F0" : "#121212",
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
              backgroundColor: darkMode ? "#2563EB" : "#306EDC", // Azul más intenso en dark mode
              color: "#FFFFFF",
            },
          },
        },
      },
    },
  });
