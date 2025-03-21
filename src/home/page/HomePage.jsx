import { Typography } from "@mui/material";
import React from "react";

export const HomePage = () => {
  return (
    <>
      <Typography
        variant="h2"
        sx={{
          fontWeight: "bold",
          textShadow: "2px 2px 10px rgba(0,0,0,0.5)", // Efecto de sombra para destacar
          maxWidth: "90%",
        }}
      >
        Bienvenido a ZenNotes
      </Typography>
      <Typography
        variant="h6"
        sx={{
          mt: 1,
          opacity: 0.8, // Un poco más tenue
          maxWidth: "80%",
        }}
      >
        Organiza tus ideas y notas con facilidad 🚀
      </Typography>
    </>
  );
};
