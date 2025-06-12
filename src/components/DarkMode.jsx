import { Switch } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";

export const DarkMode = ({ darkMode, setDarkMode }) => {
  return (
    <Switch
      checked={darkMode}
      onChange={() => setDarkMode()}
      color="primary"
      icon={<Brightness7 sx={{ color: "white" }} />}
      checkedIcon={<Brightness4 sx={{ color: "#262254" }} />}
      sx={{
        mr: 1,
      }}
    />
  );
};
