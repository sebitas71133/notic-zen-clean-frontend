import { createTheme } from "@mui/material";

export const cyberpunkTheme = (darkMode) =>
  createTheme({
    typography: {
      fontFamily: "Orbitron, Roboto, Arial, sans-serif",
    },
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: "#FF0266", // Rosa neón
      },
      secondary: {
        main: "#00E5FF", // Azul neón
      },
      background: {
        default: darkMode ? "#0D0D0D" : "#F5F5F5", // Negro en oscuro, gris claro en claro
        paper: darkMode ? "#1A1A1A" : "#FFFFFF", // Fondo más suave
      },
      text: {
        primary: darkMode ? "#F8F8F8" : "#121212", // Blanco en oscuro, negro en claro
        secondary: "#FF0266", // Siempre rosa neón para detalles
      },
      error: {
        main: darkMode ? "#FF1744" : "#D50000", // Rojo vibrante
      },
      warning: {
        main: darkMode ? "#FF9800" : "#FF6D00", // Naranja intenso
      },
      success: {
        main: darkMode ? "#00E676" : "#00C853", // Verde neón
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: "8px",
            textTransform: "uppercase",
            fontWeight: "bold",
            boxShadow: darkMode ? "0 0 8px #FF0266" : "0 0 5px #FF0266",
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: darkMode ? "0 0 12px #FF0266" : "0 0 8px #FF0266",
              backgroundColor: "#FF0266",
              color: darkMode ? "#0D0D0D" : "#F5F5F5",
            },
          },
        },
      },
    },
  });
