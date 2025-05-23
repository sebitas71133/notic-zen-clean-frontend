import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { blueTheme } from "./blueTheme";
import { cyberpunkTheme } from "./cyberPunkTheme";
import { useSelector } from "react-redux";
import { purpleTheme } from "./purpleTheme";

export const AppTheme = ({ children }) => {
  const { darkMode } = useSelector((state) => state.theme);

  return (
    <ThemeProvider theme={blueTheme(darkMode)}>
      <CssBaseline />

      {children}
    </ThemeProvider>
  );
};
