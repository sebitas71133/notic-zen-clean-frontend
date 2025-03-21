import React from "react";
import { Avatar, Box, Button } from "@mui/material";
import { Link } from "react-router-dom";
import GitHubIcon from "@mui/icons-material/GitHub";

export const Header = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 2rem",
        zIndex: 10,
        flexDirection: { xs: "column", sm: "row" },
        backgroundColor: "black",
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: { xs: 2, sm: 0 },
          cursor: "pointer",
        }}
      >
        <Avatar
          sx={{ p: 0, backgroundColor: "black" }}
          onClick={() =>
            window.open("https://github.com/sebitas71133", "_blank")
          }
        >
          <GitHubIcon fontSize="large" sx={{ color: "white" }} />
        </Avatar>
      </Box>
      <Box sx={{ display: "flex", gap: 2 }}>
        <Link to={"auth/login"}>
          <Button
            variant="outlined"
            color="primary"
            sx={{
              "&:hover": {
                backgroundColor: "text.secondary",
                color: "white",
              },
              fontSize: "1rem",
            }}
          >
            INGRESA
          </Button>
        </Link>
        <Link to={"loginDemo"}>
          <Button
            variant="outlined"
            color="secondary"
            sx={{
              "&:hover": {
                backgroundColor: "text.secondary",
                color: "white",
              },
              // padding: "0.5rem 2rem",
              fontSize: "1rem",
            }}
          >
            DEMO
          </Button>
        </Link>
      </Box>
    </Box>
  );
};
