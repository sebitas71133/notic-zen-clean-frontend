import React from "react";
import { Switch } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";

export const DarkMode = ({ darkMode, setDarkMode }) => {
  return (
    <Switch
      checked={darkMode}
      onChange={() => setDarkMode()}
      color="secondary"
      icon={<Brightness7 sx={{ color: "secondary.main" }} />}
      checkedIcon={<Brightness4 sx={{ color: "secondary.main" }} />}
      sx={{
        mr: 1,
      }}
    />
  );
};
